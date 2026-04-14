import { NextResponse } from "next/server";
import { generateAI } from "@/lib/ai-handler";
import { SYSTEMS, PROMPTS } from "@/lib/prompts";

export async function POST(req) {
  try {
    // Frontend se bacche ka message aur age nikalna
    const body = await req.json();
    const { message, childAge = 10 } = body;

    if (!message) {
      return NextResponse.json({ error: "Message zaroori hai" }, { status: 400 });
    }

    // AI ko batana ki use Arya (Tutor) ki tarah behave karna hai
    const systemPrompt = SYSTEMS.ARYA;
    const userPrompt = PROMPTS.chat(message, childAge, []);

    // Universal AI Router se connect karna (Fallback support ke saath)
    const aiResponse = await generateAI({
      system: systemPrompt,
      prompt: userPrompt,
      preferred: 'gemini'
    });

    if (!aiResponse.success) {
      throw new Error(aiResponse.error);
    }

    return NextResponse.json(aiResponse.data);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { message: "Mera server thoda thak gaya hai, baad mein try karein? 😅" },
      { status: 500 }
    );
  }
}