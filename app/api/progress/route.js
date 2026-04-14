import { NextResponse } from "next/server";
import { getProgress, saveProgress } from "@/lib/supabase";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const childId = searchParams.get("childId");
    const days = parseInt(searchParams.get("days") || "7");

    if (!childId) {
      return NextResponse.json({ error: "childId required" }, { status: 400 });
    }

    const data = await getProgress(childId, days);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { childId, subject, topic, score, timeSpent, gameType } = await req.json();
    if (!childId || !subject) {
      return NextResponse.json({ error: "childId and subject required" }, { status: 400 });
    }
    const saved = await saveProgress(childId, subject, topic, score, timeSpent, gameType);
    return NextResponse.json({ success: saved });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}