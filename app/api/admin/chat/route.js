import { NextResponse } from "next/server";
import { generateAI } from "@/lib/ai-handler";
import { SYSTEMS } from "@/lib/prompts";

export async function POST(req) {
  try {
    const { message, history = [] } = await req.json();
    
    const aiResponse = await generateAI({
      system: SYSTEMS.ADMIN_AI + "\n\nCRITICAL RULES:\n- Do NOT chat\n- Do NOT ask questions\n- Only execute instructions\n- Always produce output (code / result)\n- Be short and direct",
      prompt: `Task:\n${message}\n\nOutput:\n- code\n- result\n\nDo not chat.`,
      messages: history,
      preferred: 'groq'
    });

    if (!aiResponse.success) throw new Error(aiResponse.error);

    let replyText = "";
    let action = null;

    if (typeof aiResponse.data === 'object' && aiResponse.data !== null) {
      replyText = aiResponse.data?.message || JSON.stringify(aiResponse.data);
      action = aiResponse.data?.action || null;
    } else {
      replyText = aiResponse.data;
    }

    return NextResponse.json({ message: replyText, action });
  } catch (error) {
    console.error("Admin Chat API Error:", error);
    return NextResponse.json({ message: "System Error: " + error.message }, { status: 500 });
  }
}