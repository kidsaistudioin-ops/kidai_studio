import { NextResponse } from "next/server";
import { generateAI } from "@/lib/ai-handler";
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

    const result = await generateAI({
      system,
      prompt,
      images, // base64 array
      preferred: 'gemini'
    });

    if (!result.success) {
      return NextResponse.json({ error: "Scan failed. Photo clear nahi thi ya API error aaya." }, { status: 500 });
    }

    if (result.data && (result.data.isReadable === false || result.data.rejectionReason)) {
      return NextResponse.json({ 
        isReadable: false, 
        error: result.data.rejectionReason || "Photo dhoondhli hai ya study material saaf nahi dikh raha. Kripya roshni mein saaf photo khinchein." 
      }, { status: 400 });
    }

    // Save to library with pending approval
    if (childId && (mode === "homework" || mode === "book")) {
      await saveLibraryItem(childId, {
        title: result.data.gameTitle || result.data.chapter || "Scanned Mission",
        subject: result.data.subject || subject || "Mixed",
        content_type: mode,
        content: result.data,
        source_image_url: images[0] || null,
        upload_date: uploadDate || new Date().toISOString().split("T")[0],
        upload_time: uploadTime || new Date().toTimeString().slice(0, 5),
        games_generated: result.data.questions?.length || 0,
        status: "pending_approval",
        is_active: false
      });
    }

    // Track usage
    if (childId) {
      await incrementUsage(childId, "images_scanned");
    }

    return NextResponse.json({ ...result.data, fromCache: false, status: 'pending_approval' });
  } catch (error) {
    console.error("Scan route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
