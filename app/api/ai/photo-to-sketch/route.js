import { NextResponse } from "next/server";
import { generateAI } from "@/lib/ai-handler";

export async function POST(req) {
  try {
    const { image } = await req.json();
    if (!image) {
      return NextResponse.json({ error: "Image required" }, { status: 400 });
    }

    const system = `You are a world-class children's Disney & Pixar animation character designer and coloring book artist.
Your job is to look at the photo and create a GORGEOUS, CHARMING, CUTE, AND HIGHLY DETAILED BLACK & WHITE COLORING SHEET SVG of the person in the photo.

CRITICAL DESIGN RULES:
1. 100% BACKGROUND REMOVAL:
   - Completely ignore walls, furniture, floor, shelves, rooms, shadows, lights. The background must be pure clean white.

2. CUTE & HIGH-QUALITY CARTOON VECTOR STRUCTURE:
   - Identify the person's gender, hairstyle (short, long, curly, straight, bald, ponytail), facial expression (happy smile, big eyes), glasses/accessories, and clothing (T-shirt, hoodie, dress, collar).
   - Draw them as a lovable, big-eyed, smiling Disney/Pixar style cartoon kid/hero.
   - ALL major body parts MUST BE SEPARATE, CLOSED <path>, <circle>, or <ellipse> shapes with fill="#ffffff" stroke="#1e293b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" so kids can tap and color each part individually!
   
3. REQUIRED SVG ELEMENTS (500x500 viewport):
   - <rect id="bg" x="0" y="0" width="500" height="500" fill="#ffffff" />
   - <path id="hair" ... fill="#ffffff" stroke="#1e293b" stroke-width="4" />
   - <path id="face" ... fill="#ffffff" stroke="#1e293b" stroke-width="4" />
   - <ellipse id="eye_l" cx="210" cy="220" rx="16" ry="22" fill="#ffffff" stroke="#1e293b" stroke-width="4" />
   - <circle id="pupil_l" cx="212" cy="222" r="9" fill="#1e293b" />
   - <ellipse id="eye_r" cx="290" cy="220" rx="16" ry="22" fill="#ffffff" stroke="#1e293b" stroke-width="4" />
   - <circle id="pupil_r" cx="288" cy="222" r="9" fill="#1e293b" />
   - <path id="smile" d="M 220 270 Q 250 300 280 270" fill="none" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
   - <path id="shirt" ... fill="#ffffff" stroke="#1e293b" stroke-width="4" />
   - <path id="collar" ... fill="#ffffff" stroke="#1e293b" stroke-width="4" />
   - (Optional if present in photo: glasses, cap, bow, ribbon, hands).

4. RETURN ONLY VALID JSON:
{
  "title": "My Cartoon Portrait 🧑‍🎨",
  "svg": "<svg viewBox=\\"0 0 500 500\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>"
}`;

    const prompt = "Analyze the person in this photo (their hairstyle, smile, face shape, glasses/hat if any, and clothes). Generate a super cute Disney Pixar style vector coloring SVG with closed colorable paths. Return JSON with 'title' and 'svg'.";

    const result = await generateAI({
      system,
      prompt,
      images: [image],
      preferred: process.env.OPENAI_API_KEY ? "openai" : "gemini",
      featureName: "Photo-to-Sketch AI 📸"
    });

    let svgString = "";
    let title = "My AI Cartoon Portrait 🧑‍🎨";

    if (result && result.success && result.data) {
      const data = result.data;
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
      } else if (typeof data === "object") {
        svgString = data.svg;
        title = data.title || title;
      }
    }

    // High quality aesthetic fallback if AI fails or returns empty
    if (!svgString || !svgString.includes("<svg") || !svgString.includes("<path")) {
      svgString = `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <rect id="bg" x="0" y="0" width="500" height="500" fill="#ffffff" />
        <path id="hair_back" d="M 140 180 C 130 90 370 90 360 180 C 370 280 340 340 330 360 C 310 320 310 200 250 170 C 190 200 190 320 170 360 C 160 340 130 280 140 180 Z" fill="#ffffff" stroke="#1e293b" stroke-width="5" stroke-linejoin="round" />
        <path id="face" d="M 180 190 C 180 130 320 130 320 190 C 320 280 290 320 250 330 C 210 320 180 280 180 190 Z" fill="#ffffff" stroke="#1e293b" stroke-width="5" stroke-linejoin="round" />
        <path id="hair_bangs" d="M 175 180 C 200 140 240 160 250 140 C 260 160 300 140 325 180 C 310 130 280 100 250 100 C 220 100 190 130 175 180 Z" fill="#ffffff" stroke="#1e293b" stroke-width="5" stroke-linejoin="round" />
        <path id="ear_l" d="M 180 210 C 160 210 160 250 180 250 Z" fill="#ffffff" stroke="#1e293b" stroke-width="5" />
        <path id="ear_r" d="M 320 210 C 340 210 340 250 320 250 Z" fill="#ffffff" stroke="#1e293b" stroke-width="5" />
        <ellipse id="eye_l" cx="215" cy="225" rx="14" ry="18" fill="#ffffff" stroke="#1e293b" stroke-width="4" />
        <circle id="pupil_l" cx="217" cy="227" r="8" fill="#1e293b" />
        <circle cx="214" cy="223" r="3" fill="#ffffff" />
        <ellipse id="eye_r" cx="285" cy="225" rx="14" ry="18" fill="#ffffff" stroke="#1e293b" stroke-width="4" />
        <circle id="pupil_r" cx="283" cy="227" r="8" fill="#1e293b" />
        <circle cx="280" cy="223" r="3" fill="#ffffff" />
        <path id="eyebrow_l" d="M 200 198 Q 215 190 230 198" fill="none" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
        <path id="eyebrow_r" d="M 270 198 Q 285 190 300 198" fill="none" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
        <path id="nose" d="M 248 245 Q 254 252 248 256" fill="none" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
        <path id="smile" d="M 225 275 Q 250 305 275 275" fill="#ffffff" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
        <path id="cheeks_l" d="M 195 248 a 10 7 0 1 0 0.1 0" fill="#fecdd3" stroke="none" />
        <path id="cheeks_r" d="M 305 248 a 10 7 0 1 0 0.1 0" fill="#fecdd3" stroke="none" />
        <path id="shirt" d="M 170 340 L 100 480 L 400 480 L 330 340 Q 250 375 170 340 Z" fill="#ffffff" stroke="#1e293b" stroke-width="5" stroke-linejoin="round" />
        <path id="collar" d="M 200 345 Q 250 390 300 345 Q 250 365 200 345 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4" />
      </svg>`;
    }

    return NextResponse.json({ success: true, data: { title, svg: svgString } });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
