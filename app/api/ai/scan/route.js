import { NextResponse } from "next/server";
import { callClaude } from "@/lib/claude";
import { SYSTEMS, PROMPTS } from "@/lib/prompts";
import { saveLibraryItem, incrementUsage } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { images, mode, age = 11, subject, childId, uploadDate, uploadTime } = await req.json();

    if (!images?.length) {
      return NextResponse.json({ error: "Images required" }, { status: 400 });
    }

    if (!["homework", "book", "problem"].includes(mode)) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    // Select system + prompt based on mode
    const configs = {
      homework: { system: SYSTEMS.HOMEWORK, prompt: PROMPTS.homework(age, subject) },
      book:     { system: SYSTEMS.BOOK,     prompt: PROMPTS.book(subject) },
      problem:  { system: SYSTEMS.PROBLEM,  prompt: PROMPTS.problem(subject) },
    };

    const { system, prompt } = configs[mode];

    const result = await callClaude({
      system,
      prompt,
      images, // base64 array
      maxTokens: 1500,
    });

    if (!result.success) {
      return NextResponse.json({ error: "Scan failed. Photo clear nahi thi?" }, { status: 500 });
    }

    // Save to library (numbered system)
    if (childId && (mode === "homework" || mode === "book")) {
      await saveLibraryItem(childId, {
        subject: result.data.subject || subject || "Mixed",
        content_type: mode,
        book_name: mode === "homework" ? "Homework" : "Textbook",
        chapter_name: result.data.chapter ||
          result.data.gameTitle ||
          `${mode === "homework" ? "HW" : "Chapter"} — ${new Date().toLocaleDateString("hi-IN")}`,
        upload_date: uploadDate || new Date().toISOString().split("T")[0],
        upload_time: uploadTime || new Date().toTimeString().slice(0, 5),
        games_generated: result.data.questions?.length || 0,
        status: "new",
      });
    }

    // Track usage
    if (childId) {
      await incrementUsage(childId, "images_scanned");
    }

    return NextResponse.json({ ...result.data, fromCache: false });
  } catch (error) {
    console.error("Scan route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
