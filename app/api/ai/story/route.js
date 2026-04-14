import { NextResponse } from "next/server";
import { callClaude } from "@/lib/claude";
import { SYSTEMS, PROMPTS } from "@/lib/prompts";

export async function POST(req) {
  try {
    const { topic, characterName = "Hero", age = 11 } = await req.json();

    if (!topic?.trim()) {
      return NextResponse.json({ error: "Topic required" }, { status: 400 });
    }

    const result = await callClaude({
      system: SYSTEMS.STORY,
      prompt: PROMPTS.story(topic, characterName, age),
      maxTokens: 1500,
    });

    if (!result.success) {
      return NextResponse.json({ error: "Story generation failed" }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Story route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}