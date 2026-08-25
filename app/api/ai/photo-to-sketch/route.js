import { NextResponse } from "next/server";
import { generateAI } from "@/lib/ai-handler";

export async function POST(req) {
  try {
    const { image } = await req.json();
    if (!image) {
      return NextResponse.json({ error: "Image required" }, { status: 400 });
    }

    const system = `You are a world-renowned comic artist and children's coloring book illustrator.
Your job is to convert a real-world photo of a person/child into a CLEAN, HAND-DRAWN BLACK & WHITE COLORING BOOK SVG OF ONLY THE PERSON.

CRITICAL ARTISTIC RULES:
1. 100% BACKGROUND REMOVAL: Do NOT draw any background objects, racks, shelves, furniture, room walls, or lighting shadows. The background must be pure clean white.
2. DRAW ONLY THE HUMAN: Draw an expressive, cute, high-quality cartoon/comic line-art drawing of the person's face (hair, eyes, eyebrows, nose, smiling mouth, face oval, clothes/shirt outline).
3. COLORABLE SVG STRUCTURE:
   - Root: <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
   - Background rect: <rect id="bg" x="0" y="0" width="500" height="500" fill="#ffffff" />
   - Paths: Each part must be a closed path with fill="#ffffff" stroke="#0f172a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" and unique id (e.g. id="hair", id="face", id="eyes", id="mouth", id="shirt", id="body") so children can bucket-fill colors!
4. Response Format: Return ONLY a valid JSON object:
{
  "title": "My AI Cartoon Portrait",
  "svg": "<svg ...>...</svg>"
}`;

    const prompt = "Convert this photo into a pure hand-drawn black and white coloring book SVG portrait of the person. Completely remove 100% of background racks and room clutter. Return JSON with 'svg' and 'title'.";

    const result = await generateAI({
      system,
      prompt,
      images: [image],
      preferred: "gemini"
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
      return NextResponse.json({ success: true, data: { title, svg: svgString } });
    }

    return NextResponse.json({ error: "Could not parse SVG from AI" }, { status: 500 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
