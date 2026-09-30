import { NextResponse } from "next/server";
import { generateAI } from "@/lib/ai-handler";

export async function POST(req) {
  try {
    const { image } = await req.json();
    if (!image) {
      return NextResponse.json({ error: "Image required" }, { status: 400 });
    }

    const system = `You are a world-class children's comic book artist and Disney/Pixar style line-art vector illustrator.
Your job is to look at the photo and create a CLEAN, BEAUTIFUL, HAND-DRAWN BLACK & WHITE COLORING BOOK SVG OF ONLY THE PERSON / MAIN SUBJECT.

CRITICAL ARTISTIC RULES:
1. 100% BACKGROUND REMOVAL (MANDATORY):
   - COMPLETELY IGNORE all background objects, room walls, furniture, shelves, racks, windows, floor, curtains, or lighting.
   - The entire background MUST BE PURE WHITE (#ffffff). Do not draw a single background line.

2. DRAW ONLY THE HUMAN SUBJECT / CHARACTER:
   - Identify the person in the photo (face, hairstyle, facial features, smiling mouth, eyes, clothes/shirt outline).
   - Convert them into a charming, cute, recognizable cartoon/comic line-art portrait.
   - Keep details clear and bold with large open areas so kids can easily color them with bucket fill or crayons.

3. COLORABLE SVG STRUCTURE:
   - Root: <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
   - Background: <rect id="bg" x="0" y="0" width="500" height="500" fill="#ffffff" />
   - Closed Shapes: Major parts must be distinct closed paths with fill="#ffffff" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" and unique IDs (e.g. id="hair", id="face", id="left_eye", id="right_eye", id="smile", id="shirt", id="collar").

4. RESPONSE FORMAT: Return ONLY a valid JSON object:
{
  "title": "My AI Cartoon Portrait 🧑‍🎨",
  "svg": "<svg ...>...</svg>"
}`;

    const prompt = "Look at the person in this photo. Draw a clean, cute black and white cartoon coloring sheet SVG of ONLY the person. Completely ignore and eliminate 100% of the background walls and room clutter. Return JSON with 'title' and 'svg'.";

    const result = await generateAI({
      system,
      prompt,
      images: [image],
      preferred: process.env.OPENAI_API_KEY ? "openai" : "gemini"
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || "AI generation failed" }, { status: 500 });
    }

    let data = result.data;
    let svgString = "";
    let title = "My AI Cartoon Portrait 🧑‍🎨";

    if (typeof data === "string") {
      const match = data.match(/<svg[\s\S]*?<\/svg>/i);
      if (match) {
        svgString = match[0];
      } else {
        try {
          const parsed = JSON.parse(data.replace(/```json|```/g, "").trim());
          svgString = parsed.svg;
          title = parsed.title || title;
        } catch (e) {}
      }
    } else if (data && typeof data === "object") {
      svgString = data.svg;
      title = data.title || title;
    }

    if (svgString && svgString.includes("<svg")) {
      // Log AI Usage & Cost
      try {
        fetch('http://localhost:3000/api/ai/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: 'student_photo_user',
            studentName: 'Creative Kid',
            featureName: 'Photo-to-Sketch AI 📸',
            model: 'gpt-4o-mini',
            promptTokens: 1200,
            completionTokens: 750,
            totalTokens: 1950,
            imagesCount: 1,
            gamesCreated: 0,
            metadata: { title }
          })
        }).catch(() => {});
      } catch(e) {}

      return NextResponse.json({ success: true, data: { title, svg: svgString } });
    }

    return NextResponse.json({ error: "Could not parse SVG from AI" }, { status: 500 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
