import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const { studentId, gameId, details } = await req.json();

    if (!gameId) {
      return NextResponse.json({ error: "Game ID missing" }, { status: 400 });
    }

    // 1. Library table mein game ko 'inactive' mark karo taaki baccho ko na dikhe
    const { error: libError } = await supabase
      .from('library')
      .update({ is_active: false, status: 'reported' })
      .eq('id', gameId);

    if (libError) console.error("Library update error:", libError);

    // 2. Admin dashboard ke liye platform_feedback table me record add karo
    const { error: fbError } = await supabase
      .from('platform_feedback')
      .insert({
        sender_id: studentId || 'unknown',
        feedback_text: `REPORTED GAME (${gameId}): ${details}`,
        ai_analysis: 'User ne direct game report kiya hai. Ek baar Library mein jaakar is game ko check karein ya delete kar dein.',
        ai_can_fix: false,
        status: 'pending_admin'
      });

    if (fbError) throw fbError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Report API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}