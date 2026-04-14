import { NextResponse } from "next/server";
import { generateAI } from "@/lib/ai-handler";

export async function POST(req) {
  try {
    const { product } = await req.json();

    if (!product) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    // Gemini ko specifically json format mein script return karne ke liye bolenge
    const systemPrompt = `You are an expert Ad copywriter. 
Write a 2-line highly engaging, fun, and catchy video ad script in Hinglish for the given product.
Make it sound enthusiastic for kids!
Return ONLY valid JSON: {"script": "your ad script here"}`;

    const res = await generateAI({
      system: systemPrompt,
      prompt: `Product: ${product}`,
      images: [],
      preferred: 'openai' // Ad copy/Script writing ke liye ChatGPT best hai
    });

    if (!res.success) throw new Error(res.error);

    return NextResponse.json({ script: res.data.script });
  } catch (error) {
    console.error("Ad Maker API Error:", error.message);
    return NextResponse.json({ error: "Failed to generate script" }, { status: 500 });
  }
}
