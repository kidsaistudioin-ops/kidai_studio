import { createClient } from "@supabase/supabase-js";

// Client-side (browser)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy_key"
);

// Server-side (API routes mein use karo)
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

// ── QUIZ CACHE ──
export async function getCachedQuiz(subject, topic, difficulty) {
  const key = `${subject}__${topic.toLowerCase().trim()}__${difficulty}`;
  const { data, error } = await supabase
    .from("quiz_cache")
    .select("quiz_data, hit_count")
    .eq("cache_key", key)
    .single();

  if (error || !data) return null;

  // Hit count badhao
  await supabase
    .from("quiz_cache")
    .update({
      hit_count: data.hit_count + 1,
      last_used: new Date().toISOString(),
    })
    .eq("cache_key", key);

  return { ...data.quiz_data, fromCache: true, cacheHits: data.hit_count };
}

export async function saveQuizCache(subject, topic, difficulty, quizData) {
  const key = `${subject}__${topic.toLowerCase().trim()}__${difficulty}`;
  await supabase.from("quiz_cache").upsert({
    cache_key: key,
    quiz_data: quizData,
    hit_count: 0,
    last_used: new Date().toISOString(),
  });
}

// ── PROGRESS ──
export async function saveProgress(childId, subject, topic, score, timeSpent, gameType) {
  const { error } = await supabase.from("progress").insert({
    child_id: childId,
    subject,
    topic,
    score,
    time_spent: timeSpent,
    game_type: gameType,
  });
  return !error;
}

export async function getProgress(childId, days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data } = await supabase
    .from("progress")
    .select("*")
    .eq("child_id", childId)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });
  return data || [];
}

// ── DAILY USAGE (rate limiting) ──
export async function checkDailyLimit(childId, action, limit) {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("daily_usage")
    .select("*")
    .eq("child_id", childId)
    .eq("date", today)
    .single();

  const current = data?.[action] || 0;
  return { allowed: current < limit, current, limit };
}

export async function incrementUsage(childId, action) {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("daily_usage")
    .select("id, " + action)
    .eq("child_id", childId)
    .eq("date", today)
    .single();

  if (data) {
    await supabase
      .from("daily_usage")
      .update({ [action]: (data[action] || 0) + 1 })
      .eq("id", data.id);
  } else {
    await supabase
      .from("daily_usage")
      .insert({ child_id: childId, date: today, [action]: 1 });
  }
}

// ── LIBRARY & APPROVAL SYSTEM ──
export async function saveLibraryItem(studentId, itemData) {
  const { data, error } = await supabase
    .from("library")
    .insert({ student_id: studentId, ...itemData })
    .select()
    .single();

  if (error) {
    console.error("❌ SUPABASE SAVE LIBRARY ERROR:", error.message || error);
    return null;
  }
  return data;
}

export async function getLibraryItems(studentId) {
  const { data, error } = await supabase
    .from("library")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ SUPABASE GET LIBRARY ERROR:", error.message || error);
  }
  return data || [];
}

export async function getApprovedLibraryItems(studentId) {
  const { data, error } = await supabase
    .from("library")
    .select("*")
    .eq("student_id", studentId)
    .eq("status", "approved")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ SUPABASE GET APPROVED ERROR:", error.message || error);
  }
  return data || [];
}

export async function getPendingApprovalGames(studentId = null) {
  let query = supabase
    .from("library")
    .select("*")
    .eq("status", "pending_approval")
    .order("created_at", { ascending: false });

  if (studentId) {
    query = query.eq("student_id", studentId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("❌ SUPABASE GET PENDING ERROR:", error.message || error);
  }
  return data || [];
}

export async function approveGame(gameId, reviewerId = "parent_123", updatedContent = null) {
  const updatePayload = {
    status: "approved",
    is_active: true,
    reviewed_by: reviewerId,
    reviewed_at: new Date().toISOString(),
  };

  if (updatedContent) {
    updatePayload.content = updatedContent;
  }

  const { data, error } = await supabase
    .from("library")
    .update(updatePayload)
    .eq("id", gameId)
    .select()
    .single();

  if (error) {
    console.error("❌ SUPABASE APPROVE GAME ERROR:", error.message || error);
    return false;
  }
  return data;
}

export async function rejectGame(gameId, reviewerId = "parent_123", reason = "Rejected by reviewer") {
  const { error } = await supabase
    .from("library")
    .update({
      status: "rejected",
      is_active: false,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      ai_verification_notes: reason,
    })
    .eq("id", gameId);

  if (error) {
    console.error("❌ SUPABASE REJECT GAME ERROR:", error.message || error);
    return false;
  }
  return true;
}

export async function updateRevisionCount(libraryId) {
  const { data } = await supabase
    .from("library")
    .select("revision_count")
    .eq("id", libraryId)
    .single();

  await supabase
    .from("library")
    .update({
      revision_count: (data?.revision_count || 0) + 1,
      last_revision: new Date().toISOString(),
      status: (data?.revision_count || 0) >= 2 ? "mastered" : "learning",
    })
    .eq("id", libraryId);
}

// ── STUDENT ACADEMIC PROFILE & PROMOTION HELPERS ──
export async function updateStudentAcademicProfile(studentId, profileData) {
  const { currentClass, board, medium, dob, name } = profileData;
  const updatePayload = {};
  if (currentClass) updatePayload.current_class = parseInt(currentClass);
  if (board) updatePayload.board = board;
  if (medium) updatePayload.medium = medium;
  if (dob) updatePayload.dob = dob;
  if (name) updatePayload.name = name;

  const { data, error } = await supabase
    .from("students")
    .update(updatePayload)
    .eq("id", studentId)
    .select()
    .single();

  if (error) {
    console.error("❌ SUPABASE UPDATE STUDENT ERROR:", error.message || error);
    return null;
  }
  return data;
}

export async function getStudentAcademicProfile(studentId) {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", studentId)
    .single();

  if (error) {
    console.error("❌ SUPABASE GET STUDENT ERROR:", error.message || error);
    return null;
  }
  return data;
}

