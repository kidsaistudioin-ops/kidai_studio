import { NextResponse } from 'next/server';
import { generateAI } from '@/lib/ai-handler';

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    const cleanPrompt = prompt.trim();
    console.log(`🎨 Generating AI Coloring Sketch for: "${cleanPrompt}"`);

    const systemPrompt = `You are a master children's coloring book illustrator and SVG vector artist.
Your job is to generate a simple, charming, highly recognizable BLACK AND WHITE coloring book illustration for kids as clean SVG code (viewBox="0 0 500 500").

CRITICAL RULES:
1. Style: Thick bold black outlines (stroke="#000000", stroke-width="4" or "5", stroke-linecap="round", stroke-linejoin="round").
2. Fill: ALL shapes must have fill="#ffffff" (pure white paper, 0% gray shading, no gradients, no hatching).
3. Structure: Major anatomical parts must be separate closed <path>, <circle>, <ellipse>, or <polygon> elements with clean ids (e.g. id="body", id="head", id="eyes", id="tail", id="teeth", id="belly", id="water", id="flower", id="pot").
4. Subject: Make the character/subject cute, friendly, front-facing or 3/4 angle, with large clear areas easy for a 4-8 year old kid to color with a bucket or crayons.
5. Intelligently fix any spelling mistakes (e.g. "crocodial" -> crocodile, "chikn" -> chicken, "eliphant" -> elephant, "doremon" -> doraemon).
6. Return JSON ONLY with this exact schema:
{
  "title": "Short Title (e.g. Smiling Crocodile 🐊)",
  "svg": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 500 500\\">...</svg>"
}`;

    const userPrompt = `Create a clean black and white coloring book page SVG for: "${cleanPrompt}". Must be cute, simple, closed paths with bold black outlines and pure white fills.`;

    let aiRes = await generateAI({
      system: systemPrompt,
      prompt: userPrompt,
      preferred: process.env.OPENAI_API_KEY ? "openai" : "gemini"
    });

    if (aiRes.success && aiRes.data) {
      let data = aiRes.data;
      let svgString = "";
      let title = cleanPrompt + ' ✨';

      if (typeof data === 'string') {
        const svgMatch = data.match(/<svg[\s\S]*?<\/svg>/i);
        if (svgMatch) {
          svgString = svgMatch[0];
        }
      } else if (data && typeof data === 'object') {
        svgString = data.svg || "";
        title = data.title || title;
      }

      if (svgString && svgString.includes('<svg')) {
        // Log AI Usage & Cost
        try {
          fetch('http://localhost:3000/api/ai/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentId: 'student_sketch_user',
              studentName: 'Creative Kid',
              featureName: 'Magic AI Sketch 🎨',
              model: 'gpt-4o-mini',
              promptTokens: 850,
              completionTokens: 550,
              totalTokens: 1400,
              imagesCount: 0,
              gamesCreated: 0,
              metadata: { prompt: cleanPrompt, title }
            })
          }).catch(() => {});
        } catch(e) {}

        return NextResponse.json({ success: true, data: { title, svg: svgString } });
      }
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Could not generate SVG sketch' 
    });
  } catch (err) {
    console.error('Sketch Gen API Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
