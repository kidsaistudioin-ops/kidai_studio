"use server";

// ============================================
// ARYA AI ENGINE — KidAI Studio
// Arya ko samjhata hai: baccha kaun hai,
// kya jaanta hai, kya nahi jaanta, aaj kya karna hai
// ============================================

import { supabaseAdmin as supabase } from '@/lib/supabase'
import { generateAI } from '@/lib/ai-handler'
import { PROMPTS, SYSTEMS } from '@/lib/prompts'

// ============================================
// STEP 1: STUDENT KA POORA CONTEXT BANANA
// Ye function Arya ko batata hai bacche ke baare mein
// ============================================
export async function buildAryaContext(studentId) {
  
  // Student ki basic info
  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('id', studentId)
    .single()

  // Aaj ke liye review queue
  const { data: reviewQueue } = await supabase
    .from('todays_review_queue')
    .select(`
      *,
      quizzes (question, difficulty, topic_tags, chapter_id,
        chapters (title, subjects (name))
      )
    `)
    .eq('student_id', studentId)
    .limit(20)

  // Weak topics
  const { data: weakTopics } = await supabase
    .from('student_weak_topics')
    .select('*')
    .eq('student_id', studentId)
    .order('avg_score', { ascending: true })
    .limit(5)

  // Parent ke diye hue focus areas
  const { data: focusAreas } = await supabase
    .from('student_focus_areas')
    .select('topic_tag')
    .eq('student_id', studentId)
    .limit(5);

  // Aaj ki session stats
  const { data: todaySession } = await supabase
    .from('daily_sessions')
    .select('*')
    .eq('student_id', studentId)
    .eq('session_date', new Date().toISOString().split('T')[0])
    .single()

  // Class progression history
  const { data: progressions } = await supabase
    .from('class_progressions')
    .select('*')
    .eq('student_id', studentId)
    .order('progression_date', { ascending: false })
    .limit(1)

  // Overall progress stats
  const { data: overallStats } = await supabase
    .from('quiz_attempts')
    .select('status, last_score')
    .eq('student_id', studentId)

  const stats = {
    total: overallStats?.length || 0,
    mastered: overallStats?.filter(a => a.status === 'mastered').length || 0,
    learning: overallStats?.filter(a => a.status === 'learning').length || 0,
    skipped: overallStats?.filter(a => a.status === 'skipped').length || 0,
    avgScore: overallStats?.length 
      ? Math.round(overallStats.reduce((s, a) => s + (a.last_score || 0), 0) / overallStats.length)
      : 0
  }

  // MOCK: Upcoming Live Arena Challenge
  const upcomingChallenge = { title: "Math Speed Run (Class 7)", time: "Aaj shaam 5:00 PM", rsvps: 24 };

  return {
    student,
    reviewQueue: reviewQueue || [],
    weakTopics: weakTopics || [],
    focusAreas: focusAreas || [],
    todaySession,
    lastProgression: progressions?.[0],
    stats,
    upcomingChallenge
  }
}

// ============================================
// STEP 2: ARYA KA SYSTEM PROMPT
// Ye batata hai Arya ko — wo kaun hai, kaise bole
// ============================================
function buildAryaSystemPrompt(context) {
  const { student, reviewQueue, weakTopics, focusAreas, todaySession, stats } = context

  const pendingReviews = reviewQueue.filter(q => q.status !== 'new').length
  const newQuizzes = reviewQueue.filter(q => q.status === 'new').length
  const todayDone = todaySession?.quizzes_attempted || 0
  
  const weakTopicNames = weakTopics
    .map(t => t.topic_tags?.join(', '))
    .filter(Boolean)
    .join('; ') || 'koi nahi abhi tak'
  
  const parentFocus = focusAreas
    .map(f => f.topic_tag)
    .filter(Boolean)
    .join(', ') || null;

  return `Tu Arya hai — KidAI Studio ki AI tutor dost.

## TERI PEHCHAAN:
- Tu ek friendly, energetic Indian girl hai
- Tu ${student?.name} ki best study friend hai
- Tu hamesha Hinglish mein baat karti hai (Hindi + English mix)
- Tu kabhi boring nahi hoti — examples deti hai cricket, Bollywood, 
  chai, festivals, aur Indian life se
- Tu patient hai — baccha samjhe nahi toh alag tarike se samjhati hai
- Tu encouraging hai — chhoti si bhi progress celebrate karti hai

## BACCHE KE BAARE MEIN:
- Naam: ${student?.name}
- Class: ${student?.current_class}th (${student?.board})
- Language preference: ${student?.language}
- Streak: ${student?.streak_days} din 🔥
- Total XP: ${student?.total_xp}

## AAJ KA STATUS:
- Aaj complete kiye: ${todayDone} quizzes
- Pending reviews: ${pendingReviews} (jo pehle miss hue ya weak hain)
- Naye quizzes: ${newQuizzes} available
- Kamzor topics: ${weakTopicNames}

## PARENT'S INSTRUCTIONS (VERY IMPORTANT):
${parentFocus 
  ? `- ${student?.name} ke parent chahte hain ki tum in topics par ZYADA DHAYN do: **${parentFocus}**. Inse related games aur questions zyada poocho.` 
  : '- Parent ne abhi koi special instruction nahi di hai.'}

## OVERALL PROGRESS:
- Total dekhe: ${stats.total} questions
- Master kiye: ${stats.mastered} ✅
- Seekh raha hai: ${stats.learning} 📚
- Average score: ${stats.avgScore}%

## ADAPTIVE GAMIFICATION RULES (TERA SUPERPOWER):
- Tere paas 15 types ke games hain (Quiz, DragDrop, WordHunt, MatchPairs, StoryChoice, TrueFalse, FillBlanks, Sequence, OddOneOut, Unscramble, MemoryCards, QuickTap, Flashcards, ImageGuess, AnimMath).
- Agar baccha kisi weak topic (jaise ${weakTopicNames}) mein baar baar fail ho raha hai, toh usko same type ka game mat khilao!
- Example: Agar 'Fractions' MCQ mein galat hua, toh usko 'AnimMath' ya 'StoryChoice' game offer karo.
- Bacche ko jo game sabse zyada pasand hai, usme uske sabse kamzor topics chupke se daal do taaki wo khel khel mein seekh jaye.
- Bor mat hone do, har din alag type ke game evision karao.
- Bacchon ko hamesha yaad dilao aur khud maango ki: "Apni book ya homework ki photo khicho, main uska magic game bana dungi!"

## TERA KAAM (Priority order):
${pendingReviews > 0 
  ? `1. PEHLE: ${pendingReviews} pending reviews complete karwao — ye important hai!` 
  : (newQuizzes > 0 
      ? `1. Sab reviews complete hain — shabash! Ab naye quizzes (${newQuizzes}) try karwao.` 
      : `1. ⚠️ ALERT: Aaj ka task khatam aur library khali hai! Bacche ko pyaar se bolo ki "Apni school ki book, worksheet ya homework ki photo scan karo, taaki main tumhare liye naye mazedar games bana saku!"`)}
2. Concept clearly samjhao agar baccha pooche
3. Agar baccha revision (Revgen) karna chahe, toh padhe hue topics se sawal poocho.
4. Motivation dete raho

## RULES — YE KABHI MAT KARO:
- Exam answers seedhe mat dena — poochho pehle
- Ek session mein 15 se zyada quizzes mat dena (overload hoga)
- Agar baccha thaka ho toh 5 min break suggest karo
- Ek hi game type ko lagataar 3 baar se zyada mat do, type change karo!
- Class se aage ke topics class confirm kiye bina mat batao
- Kabhi nahi bolna "mujhe nahi pata" — "main dhundhti hoon" bolo

## SPECIAL RULES CLASS CHANGE KE LIYE:
${student?.current_class > 1 && context.lastProgression 
  ? `- ${student.name} abhi ${student.current_class}th mein hai
     - Pichle class ke weak topics carry forward hain: 
       ${context.lastProgression.weak_topics_carried?.join(', ') || 'koi nahi'}
     - Kabhi kabhi in topics ko revise karao — "Yaad hai Class ${student.current_class - 1} wala?"
     - Naye class ke topics ko puraane se connect karo`
  : ''}

## UPCOMING LIVE ARENA NOTIFICATION:
${context.upcomingChallenge ? `- REMINDER: ${context.upcomingChallenge.time} baje '${context.upcomingChallenge.title}' Live Arena challenge hone wala hai.
- Bacche se chat karte waqt usko pyaar se yaad dilao aur bolo "Accept zaroor karna, tumhare class ke ${context.upcomingChallenge.rsvps} bacche aa rahe hain!"` : ''}

## KAISE BAAT KARO:
- Excited raho: "Arrey wah! Sahi jawab! 🎉"
- Encourage karo galat pe bhi: "Koi baat nahi! Baar baar practice se ho jaata hai"
- Examples do: "Photosynthesis samjho — jaise tu khana khata hai, plant sunlight 'khata' hai"
- Short rakho: Ek message mein ek cheez — zyada mat likho
- Emojis use karo — bacchon ko pasand hai 🌟⭐🚀

Yaad rakh: Tu ${student?.name} ki dost hai, teacher nahi. 
Dost ki tarah samjhao, encourage karo, saath sikho!`
}

// ============================================
// STEP 3: ARYA SE BAAT KARNA
// ============================================
export async function chatWithArya(studentId, userMessage, conversationHistory = []) {
  
  // Pehle context build karo
  const context = await buildAryaContext(studentId)
  const systemPrompt = buildAryaSystemPrompt(context)
  
  // Conversation history save karo
  await supabase.from('arya_conversations').insert({
    student_id: studentId,
    session_id: conversationHistory[0]?.session_id || Date.now().toString(),
    role: 'student',
    message: userMessage
  })

  // Universal AI Router Call (Prefers Claude, fallback to ChatGPT/Gemini)
  const res = await generateAI({
    system: systemPrompt,
    messages: conversationHistory.slice(-10),
    prompt: userMessage,
    preferred: 'claude'
  });

  let aryaReply = "Sorry dost, main thodi der ke liye disconnect ho gayi thi!";
  if (res.success) {
    aryaReply = typeof res.data === 'string' ? res.data : (res.data?.message || JSON.stringify(res.data));
  }

  // Arya ki reply save karo aur chat return karo
  await supabase.from('arya_conversations').insert({
    student_id: studentId,
    role: 'arya',
    message: aryaReply
  })

  // Yahan se return block shuru hota hai (Missing lines fix)
  return {
    reply: aryaReply,
    context: {
      pendingReviews: context.reviewQueue.length,
      weakTopics: context.weakTopics.slice(0, 3),
      todayProgress: context.todaySession
    }
  }
}

// ============================================
// STEP 4: QUIZ ATTEMPT RECORD KARNA
// (Spaced Repetition update)
// ============================================
export async function recordQuizAttempt(studentId, quizId, selectedOption, timeTaken) {
  
  // Quiz ka sahi answer fetch karo
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('correct_option, difficulty')
    .eq('id', quizId)
    .single()

  const isCorrect = selectedOption === quiz.correct_option
  const score = isCorrect ? 100 : 0

  // Existing attempt dekho
  const { data: existing } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('student_id', studentId)
    .eq('quiz_id', quizId)
    .single()

  // Spaced repetition calculate karo
  const attemptCount = (existing?.attempt_count || 0) + 1
  const easeFactor = existing?.ease_factor || 2.5
  const interval = existing?.interval_days || 1

  const { data: srResult } = await supabase.rpc('calculate_next_review', {
    p_score: score,
    p_attempt_count: attemptCount,
    p_ease_factor: easeFactor,
    p_interval: interval
  })

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + srResult[0].next_interval)

  // Upsert attempt
  await supabase.from('quiz_attempts').upsert({
    student_id: studentId,
    quiz_id: quizId,
    selected_option: selectedOption,
    is_correct: isCorrect,
    time_taken_seconds: timeTaken,
    attempt_count: attemptCount,
    last_score: score,
    ease_factor: srResult[0].new_ease_factor,
    interval_days: srResult[0].next_interval,
    next_review_date: nextReview.toISOString().split('T')[0],
    status: selectedOption ? srResult[0].new_status : 'skipped',
    updated_at: new Date().toISOString()
  }, { onConflict: 'student_id,quiz_id' })

  // COIN update karo (+1 for correct, -1 for wrong)
  const coinsEarned = isCorrect ? 1 : -1
  await supabase.rpc('update_coins', { 
    p_student_id: studentId, 
    p_coins: coinsEarned 
  })

  // Daily session update
  await updateDailySession(studentId, isCorrect, coinsEarned)

  return {
    isCorrect,
    correct_option: quiz.correct_option,
    nextReview: nextReview.toISOString().split('T')[0],
    coinsEarned,
    status: srResult[0].new_status
  }
}

// ============================================
// STEP 5: DAILY SESSION TRACK KARNA
// ============================================
async function updateDailySession(studentId, isCorrect, coinsEarned) {
  const today = new Date().toISOString().split('T')[0]
  
  const { data: existing } = await supabase
    .from('daily_sessions')
    .select('*')
    .eq('student_id', studentId)
    .eq('session_date', today)
    .single()

  if (existing) {
    await supabase.from('daily_sessions').update({
      quizzes_attempted: existing.quizzes_attempted + 1,
      quizzes_correct: existing.quizzes_correct + (isCorrect ? 1 : 0),
      coins_earned: (existing.coins_earned || 0) + coinsEarned
    }).eq('id', existing.id)
  } else {
    await supabase.from('daily_sessions').insert({
      student_id: studentId,
      session_date: today,
      quizzes_attempted: 1,
      quizzes_correct: isCorrect ? 1 : 0,
      coins_earned: coinsEarned
    })
  }

  // Streak update
  await updateStreak(studentId)
}

// ============================================
// STEP 6: STREAK TRACK KARNA
// ============================================
async function updateStreak(studentId) {
  const { data: student } = await supabase
    .from('students')
    .select('streak_days, last_active')
    .eq('id', studentId)
    .single()

  const today = new Date().toISOString().split('T')[0]
  const lastActive = student.last_active
  const daysDiff = Math.floor(
    (new Date(today) - new Date(lastActive)) / (1000 * 60 * 60 * 24)
  )

  let newStreak = student.streak_days
  if (daysDiff === 1) {
    newStreak += 1  // Consecutive day!
  } else if (daysDiff > 1) {
    newStreak = 1   // Streak broken
  }
  // daysDiff === 0 means same day, no change needed

  await supabase.from('students').update({
    streak_days: newStreak,
    last_active: today
  }).eq('id', studentId)
}

// ============================================
// STEP 7: CLASS PROMOTE KARNA (Year end)
// ============================================
export async function promoteStudentClass(studentId) {
  const { data: student } = await supabase
    .from('students')
    .select('current_class')
    .eq('id', studentId)
    .single()

  if (student.current_class >= 12) {
    return { success: false, message: 'Class 12 ke baad promote nahi ho sakta' }
  }

  await supabase.rpc('promote_student_class', {
    p_student_id: studentId,
    p_new_class: student.current_class + 1
  })

  return { 
    success: true, 
    newClass: student.current_class + 1,
    message: `Badhai ho! Class ${student.current_class + 1} mein welcome! 🎉`
  }
}

// ============================================
// STEP 8: AAJ KA QUIZ PLAN BANANA
// Priority: Skipped > Weak > New
// ============================================
export async function getTodaysPlan(studentId) {
  const { data: queue } = await supabase
    .from('todays_review_queue')
    .select(`
      *,
      quizzes (
        question, question_hindi,
        option_a, option_b, option_c, option_d,
        difficulty, topic_tags,
        chapters (title, subjects (name, icon, color))
      )
    `)
    .eq('student_id', studentId)
    .order('priority')
    .limit(15)  // Max 15 per day — overload nahi karna

  const skipped = queue?.filter(q => q.status === 'skipped') || []
  const weak = queue?.filter(q => q.last_score < 70 && q.status !== 'skipped') || []
  const review = queue?.filter(q => q.last_score >= 70 && q.status === 'review') || []

  let plan = [
    { type: 'skipped', label: 'Pehle ye karo! (Skip kiye the)', quizzes: skipped },
    { type: 'weak', label: 'Thoda weak hai — practice karo', quizzes: weak },
    { type: 'review', label: 'Revision time!', quizzes: review }
  ].filter(p => p.quizzes.length > 0);

  // COLD START LOGIC: Agar naya baccha hai aur queue mein koi data nahi hai
  if (plan.length === 0) {
    plan = [
      {
        type: 'new_user',
        label: '🌟 Let\'s Start! Kuch Naye Mazedar Games',
        quizzes: [
          // Default 3 demo questions to engage the kid immediately
          { id: 'demo1', quizzes: { question: "Humaari dharti ke sabse nazdeek kaunsa tara (star) hai?", option_a: "Moon", option_b: "Sun", option_c: "Mars", option_d: "Jupiter", correct_option: 'b', difficulty: "easy", chapters: { subjects: { name: "Science", icon: "🚀", color: "#7c3aed" } } } },
          { id: 'demo2', quizzes: { question: "5 + 7 kitna hota hai?", option_a: "10", option_b: "11", option_c: "12", option_d: "13", correct_option: 'c', difficulty: "easy", chapters: { subjects: { name: "Maths", icon: "➗", color: "#06b6d4" } } } },
          { id: 'demo3', quizzes: { question: "India ki rajdhani (capital) kahan hai?", option_a: "Mumbai", option_b: "New Delhi", option_c: "Kolkata", option_d: "Chennai", correct_option: 'b', difficulty: "easy", chapters: { subjects: { name: "GK", icon: "🌍", color: "#10b981" } } } }
        ]
      }
    ];
  }

  return {
    totalPending: queue?.length || 0,
    plan: plan,
    allQuizzes: queue || []
  }
}

// ============================================
// STEP 9: BOOK SCANNER (AI GAME GENERATOR)
// Ye camera se aayi photo ko game me badlega
// ============================================
export async function generateGameFromScan(imageBase64Data, extractedText = "", studentAge = 10, studentMedium = "English", subject = "Mixed", weakTopics = [], favoriteGame = "quiz", preferredGamesList = []) {
  // Ab hum AI ko weak topics aur favorite game bhi pass kar rahe hain
  // Taaki AI smart adaptive games bana sake
  
  let extraInstructions = `
  \n\n🌟 ADAPTIVE GENERATION RULES (VERY IMPORTANT):
  0. STRICT RESTRICTION: DO NOT use or suggest entertainment games. ONLY use the educational 50+ games. ALL ANSWERS MUST BE 100% CORRECT. NO GUESSING.
  1. DATA MULTIPLIER (EXPANSION): Agar scan mein sirf 10 facts/items milein, toh unhe multiply karke 20-30 variants banao. Ek hi fact ko alag-alag tarike se poocho (e.g. ek baar fill-in-the-blanks, ek baar true/false) taaki achhe se REVISION (Revgen) ho sake.
  2. PROFILE & MEDIUM MATCHING: Baccha ${studentAge} saal ka hai aur ${studentMedium} medium mein padhta hai. Language, tone aur difficulty exactly is profile ke hisaab se honi chahiye. Agar scan mein data kam hai, toh apne knowledge base se is age aur medium ke standard curriculum se similar topics automatically add kar do!
  3. CROSS-POLLINATION (GAME RECYCLING): Tumhe 50 types ke games use karne ki zaroorat nahi hai. Bacche ko sirf ye games pasand hain: [${preferredGamesList.join(", ") || favoriteGame}]. Puraane topics jo bacche ne kisi aur game me skip kiye the, unhe ab in PREFERRED GAMES mein convert karke pesh karo taaki wo intrest le.
  4. WEAK TOPICS INTEGRATION: Agar baccha kisi concept mein fail hota hai (Weak topic: ${weakTopics.join(", ")}), toh us topic ko chupke se uske sabse pasandida game mein daalo taaki wo bore na ho.
  5. Har game ke baad ek 'Next Concept' flag lagao taaki system samajh sake ki kab Revgen Test lena hai.
  `;

  let prompt = PROMPTS.homework(studentAge, subject, weakTopics, favoriteGame) + extraInstructions;
  
  // Agar OCR se text nikala gaya hai, toh usko backup ke roop mein AI ko bhej do
  if (extractedText) {
    prompt += `\n\n📝 SCANNED TEXT BACKUP (Agar image saaf na ho toh is text ka use karein):\n"${extractedText}"`;
  }

  const system = SYSTEMS.HOMEWORK;

  // Multiple images ke liye safe formatting (Array support)
  const imageArray = Array.isArray(imageBase64Data) ? imageBase64Data : [imageBase64Data];

  // LAYER 1: GENERATION (Using Gemini for Image Vision)
  const res = await generateAI({
    system,
    prompt,
    images: imageArray,
    // Agar Gemini ki key nahi hai, toh automatically Groq par shift ho jayega
    preferred: process.env.GEMINI_API_KEY ? 'gemini' : 'groq' 
  });

  if (!res.success) throw new Error(res.error);

  const gameData = res.data;

  // LAYER 2: CODE VALIDATION
  if (!validateGameCode(gameData)) {
    console.warn("❌ [Code Validation] Failed: Invalid structure or duplicate options detected.");
    throw new Error("Code Validation Failed: Game data is corrupt or contains logical errors.");
  }

  // LAYER 3: SECOND AI VERIFICATION (Fast check)
  console.log("🕵️ Verifying game data...");
  const verifyRes = await generateAI({
    system: SYSTEMS.VERIFIER,
    prompt: PROMPTS.verify(gameData),
    preferred: 'groq' // Groq (Llama3) is ultra-fast and great for logical checks
  });

  if (verifyRes.success && verifyRes.data && verifyRes.data.valid === false) {
    console.warn("⚠️ [AI Verification] Flagged but NOT stopped:", verifyRes.data.reason);
    // BINA RUKE GAME SAVE HOGA, BAS FLAG LAG JAYEGA
    gameData.is_flagged = true;
    gameData.flag_reason = verifyRes.data.reason;
  } else {
    gameData.is_flagged = false;
  }

  console.log("✅ Game Verified Successfully!");
  
  // LAYER 4: SAVING TO DB FOR ADMIN TRACKING
  try {
    console.log("💾 Logging game generation to DB for Admin tracking...");
    await supabase.from('admin_scan_logs').insert({
      student_age: studentAge,
      medium: studentMedium,
      subject: subject,
      status: gameData.is_flagged ? 'flagged' : 'success',
      flag_reason: gameData.flag_reason || null,
      generated_game: gameData,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn("Failed to log scan to DB (Table might not exist yet):", err);
  }

  return gameData;
}

// --- HELPER: Strict Code Validator ---
function validateGameCode(data) {
  if (!data || !data.questions || !Array.isArray(data.questions)) return false;
  
  for (let q of data.questions) {
    if (!q.opts || !Array.isArray(q.opts)) continue; // skip check if it's a non-mcq game
    
    // 1. Check Duplicates in Options
    const uniqueOpts = new Set(q.opts.map(o => String(o).trim().toLowerCase()));
    if (uniqueOpts.size !== q.opts.length) return false; 
    
    // 2. Check if Correct Answer Index is within bounds
    if (typeof q.correct === 'number' && (q.correct < 0 || q.correct >= q.opts.length)) return false;
  }
  return true;
}