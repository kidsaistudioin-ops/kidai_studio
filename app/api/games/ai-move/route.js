import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

export async function POST(req) {
  try {
    const { game, state, difficulty, playerName } = await req.json();

    // 🐍 Saanp Seedi (Snakes & Ladders) AI Logic
    if (game === 'snakes-ladders') {
      // Arya ek normal random dice roll karegi (abhi ke liye)
      // Future mein hum cheating AI bana sakte hain jo intentionally hare ya jeete bacche ke level ke hisaab se!
      const dice = Math.floor(Math.random() * 6) + 1;
      return NextResponse.json({ move: dice, message: `Arya ne ${dice} roll kiya!` });
    }

    // ♟️ Chess (Chase) AI Logic using Gemini
    if (game === 'chess') {
      // AI ko prompt denge board ki current state ke saath
      const systemPrompt = `You are Arya, a friendly AI chess tutor for a kid named ${playerName || 'Arjun'}. The difficulty is ${difficulty || 'easy'}. Give a valid chess move and a short encouraging Hindi/English message. Return ONLY valid JSON in this format: {"move": "e2e4", "message": "Good move! But watch out for your knight! 🐴"}`;
      
      const userPrompt = `Current board state (FEN or custom JSON): ${JSON.stringify(state)}. What is your next move?`;

      const res = await callGemini({ system: systemPrompt, prompt: userPrompt });
      
      if (!res.success) {
        return NextResponse.json({ error: "Arya sochna bhool gayi!" }, { status: 500 });
      }

      return NextResponse.json(res.data);
    }

    return NextResponse.json({ error: "Game not supported" }, { status: 400 });

  } catch (error) {
    console.error('AI Move Error:', error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}