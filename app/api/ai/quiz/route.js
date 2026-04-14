import { NextResponse } from "next/server";
import { callClaude } from "@/lib/claude";
import { SYSTEMS, PROMPTS } from "@/lib/prompts";
import { getCachedQuiz, saveQuizCache, checkDailyLimit, incrementUsage } from "@/lib/supabase";

const GENERATION_LIMITS = { free: 0, basic: 2, premium: 8 };

export async function POST(req) {
  try {
    const {
      subject,
      topic,
      age = 11,
      difficulty = "medium",
      count = 4,
      childId,
      plan = "free",
    } = await req.json();

    if (!subject || !topic) {
      return NextResponse.json({ error: "Subject and topic required" }, { status: 400 });
    }

    // 1. Cache check (free for all)
    const cached = await getCachedQuiz(subject, topic, difficulty);
    if (cached) {
      return NextResponse.json({ ...cached, fromCache: true });
    }

    // 2. Rate limit for generation
    if (childId) {
      const limit = GENERATION_LIMITS[plan] ?? 0;
      if (limit === 0 && plan === "free") {
        return NextResponse.json({
          error: "Quiz generation Basic plan mein available hai. Upgrade karo!",
          upgradeRequired: true,
        });
      }
      const { allowed } = await checkDailyLimit(childId, "quiz_generations", limit);
      if (!allowed) {
        return NextResponse.json({
          error: `Aaj ke quiz generation limit reach ho gayi! (${limit}/day)`,
          dailyLimitReached: true,
        });
      }
    }

    // 3. Generate new quiz
    const result = await callClaude({
      system: SYSTEMS.QUIZ,
      prompt: PROMPTS.quiz(subject, topic, age, difficulty, count),
      maxTokens: 1000,
    });

    if (!result.success) {
      return NextResponse.json({ error: "Quiz generation failed" }, { status: 500 });
    }

    // 4. Save to cache
    await saveQuizCache(subject, topic, difficulty, result.data);

    // 5. Increment usage
    if (childId) {
      await incrementUsage(childId, "quiz_generations");
    }

    return NextResponse.json({ ...result.data, fromCache: false });
  } catch (error) {
    console.error("Quiz route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
