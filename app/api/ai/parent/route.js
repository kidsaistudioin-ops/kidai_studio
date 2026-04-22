import { NextResponse } from "next/server";
import { generateAI } from "@/lib/ai-handler";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { message, parentId = "parent_123", studentId = "student_123" } = await req.json();

    if (!message) return NextResponse.json({ error: "Message missing" }, { status: 400 });

    // 1. Save Parent's Message to DB
    await supabase.from('parent_ai_chat').insert({ parent_id: parentId, role: 'parent', message });

    // 2. AI Brain: Samajhna ki ye "Guidance" hai ya "Platform Suggestion"
    const systemPrompt = `
    You are 'Arya Manager', an assistant for Parents. 
    Analyze the parent's message and respond strictly in JSON format.

    Types of Messages:
    1. "guidance" - Parent is asking to focus on a child's subject (e.g., "Teach him math", "He is weak in science").
    2. "suggestion" - Parent is suggesting a change to the app/platform (e.g., "Add a racing game", "Change the button color").
    3. "general" - Normal chat.

    If "suggestion": Evaluate if AI can fix it dynamically (like generating a new quiz/game = true) or if it requires a Developer/Admin code change (like changing UI colors = false).

    Output JSON Structure:
    {
      "type": "guidance" | "suggestion" | "general",
      "reply_to_parent": "Your friendly reply in Hinglish",
      "focus_topics": ["math", "science"] // (only if guidance, else empty array),
      "ai_can_fix": true | false // (only if suggestion),
      "admin_note": "Brief note for admin dashboard about the fix/suggestion" // (only if suggestion)
    }`;

    const res = await generateAI({
      system: systemPrompt,
      prompt: `Parent's Message: "${message}"`,
      preferred: 'groq'
    });

    if (!res.success) throw new Error("AI Logic failed");

    // Safe parsing in case AI wraps JSON in backticks
    let aiData = res.data;
    if (typeof aiData === 'string') {
      aiData = JSON.parse(aiData.replace(/```json/g, '').replace(/```/g, ''));
    }

    // 3. Process based on AI's Classification
    if (aiData.type === 'guidance' && aiData.focus_topics?.length > 0) {
      // Save focus areas for the child
      for (const topic of aiData.focus_topics) {
        await supabase.from('student_focus_areas').upsert(
          { student_id: studentId, topic_tag: topic.toLowerCase(), priority: 2 },
          { onConflict: 'student_id,topic_tag' }
        );
      }
    } 
    else if (aiData.type === 'suggestion') {
      // Save to Admin Feedback Dashboard
      await supabase.from('platform_feedback').insert({
        sender_id: parentId,
        feedback_text: message,
        ai_analysis: aiData.admin_note || "No specific note",
        ai_can_fix: aiData.ai_can_fix || false,
        status: 'pending_admin'
      });
      
      // Modify reply to inform parent that suggestion was recorded
      if (aiData.ai_can_fix) {
        aiData.reply_to_parent += "\n\n(AI: Main abhi ispe kaam karke content update kar dungi!)";
      } else {
        aiData.reply_to_parent += "\n\n(AI: Ye ek bada UI/feature change hai. Maine ye sughaw (suggestion) Admin / Developer team ko bhej diya hai!)";
      }
    }

    // 4. Save AI's Reply to Chat History
    await supabase.from('parent_ai_chat').insert({
      parent_id: parentId,
      role: 'ai',
      message: aiData.reply_to_parent
    });

    return NextResponse.json({
      success: true,
      reply: aiData.reply_to_parent,
      action_taken: aiData.type
    });

  } catch (error) {
    console.error("Parent AI Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}