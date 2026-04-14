import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateAI } from "@/lib/ai-handler";
import { PROMPTS, SYSTEMS } from "@/lib/prompts";

export async function POST(req) {
  try {
    const { model } = await req.json();

    // 1. 10 aise games uthao jo abhi tak check nahi hue hain (Chunk by Chunk)
    const { data: games } = await supabaseAdmin
      .from('quizzes')
      .select('id, question, option_a, option_b, option_c, option_d, correct_option')
      .eq('verification_status', 'unverified')
      .limit(10);

    if (!games || games.length === 0) {
      return NextResponse.json({ checked: 0, message: "All games are already verified!" });
    }

    let checkedCount = 0;
    for (let game of games) {
      // 2. Selected AI Model se Verify karao
      const verifyRes = await generateAI({
        system: SYSTEMS.VERIFIER,
        prompt: PROMPTS.verify(game),
        preferred: model
      });

      // 3. Database mein flag aur status update kardo
      const isValid = verifyRes.success && verifyRes.data && verifyRes.data.valid !== false;
      await supabaseAdmin.from('quizzes')
        .update({ verification_status: isValid ? 'verified' : 'flagged', ai_flag_reason: isValid ? null : verifyRes.data?.reason })
        .eq('id', game.id);
      checkedCount++;
    }

    return NextResponse.json({ checked: checkedCount });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}