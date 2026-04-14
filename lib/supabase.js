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

// ── LIBRARY ──
export async function saveLibraryItem(childId, itemData) {
  // Auto-generate ID: LIB001, LIB002...
  const { count } = await supabase
    .from("library")
    .select("*", { count: "exact" });
  const newId = `LIB${String((count || 0) + 1).padStart(3, "0")}`;

  const { data, error } = await supabase
    .from("library")
    .insert({ id: newId, child_id: childId, ...itemData })
    .select()
    .single();

  return error ? null : data;
}

export async function getLibraryItems(childId) {
  const { data } = await supabase
    .from("library")
    .select("*")
    .eq("child_id", childId)
    .order("created_at", { ascending: false });
  return data || [];
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
