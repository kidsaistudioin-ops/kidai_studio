import { NextResponse } from "next/server";
import { generateAI } from "@/lib/ai-handler";
import { SYSTEMS, PROMPTS } from "@/lib/prompts";
import { saveLibraryItem, incrementUsage } from "@/lib/supabase";

// SERVER STARTUP KEY CHECKER (Terminal me dikhane ke liye)
console.log("\n=========================================");
console.log("🔍 DETAILED API KEY DEBUGGER (Scanning .env...)");

const envKeys = Object.keys(process.env).filter(k => k.includes('KEY') || k.includes('API') || k.includes('GROQ') || k.includes('GEMINI'));
console.log("TUMHARE .ENV FILE SE EXACTLY YE KEYS READ HUI HAIN:");
if (envKeys.length === 0) console.log("❌ KOI BHI KEY READ NAHI HUI! (File name shayad .env.local.txt ban gaya hai)");
envKeys.forEach(k => {
  const val = process.env[k];
  console.log(`➔ "${k}" = ${val ? val.substring(0,4) + "...[HIDDEN]" : "BLANK"}`);
});

console.log("\nCODE KO EXACTLY KYA NAAM CHAHIYE THA:");
console.log("➔ \"GROQ_API_KEY\"   :", process.env.GROQ_API_KEY ? "✅ MIL GAYI" : "❌ NAHI MILI");
console.log("➔ \"GEMINI_API_KEY\" :", process.env.GEMINI_API_KEY ? "✅ MIL GAYI" : "❌ NAHI MILI");
console.log("=========================================\n");

export async function POST(req) {
  try {
    // Frontend se bacche ka message aur age nikalna
    const body = await req.json();
    const { message, childAge = 10, childId = "student_123", history = [] } = body;
    console.log("📥 [CHAT API] Received message:", message, "Age:", childAge, "Memory len:", history.length);

    if (!message) {
      return NextResponse.json({ error: "Message zaroori hai" }, { status: 400 });
    }

    // AI ko batana ki use Arya (Tutor) ki tarah behave karna hai
    const systemPrompt = SYSTEMS.ARYA + `
    
CRITICAL RULES:
- Speak in very simple Hindi/English.
- You are talking to a ${childAge} year old child. Keep explanations easy, fun, and age-appropriate!
- Do NOT ask more than 1 question. If possible, do not ask at all.
- Agar baccha coding, animation, ya game banana sikhna chahe, toh use thoda guide karo aur message ke end me [GOTO:/create] likho taaki wo Creator Studio me chala jaye.
- Normally baat karte waqt koi GOTO tag mat lagana.

🚀 SUPER LEARNING & MEGA GAME EXPANSION RULES (MANDATORY):
1. DEEP ENGAGEMENT: Agar baccha kuch seekhna chahe ya game mange, toh sirf 1-2 question mat do. Uske liye kam se kam 10-30 questions/levels ka deep game banao taaki wo 3-5 minute tak actively khel sake!
2. SEEKHO PAGE INTEGRATION: Tumhare paas 50+ games ke templates hain. Bacche ki history padho aur uska pattern samjho. Jo template use pasand ho (jaise Table Battle, Word Builder), usi mein uske naye topics daal kar generate karo.
3. SMART DISTRIBUTION: Agar concept bahut bada hai, toh usko alag-alag games me divide kar do. (Example: Thoda hissa Quiz me banao, thoda Fill-in-the-blanks me). Baccha jo game zyada khel raha hai, use usi type me serve karo.
4. SUBJECT FATIGUE: Agar tumhe history dekh kar lage ki baccha bahut der se ek hi game/subject me atka hua hai, toh use pyaar se message karo: "Wah! Tum toh isme master ban gaye 🏆 Chalo ab kuch doosre mazedar games explore karein!" aur message ke end me [GOTO:/seekho] laga do.
5. NEVER STOP (1000+ VISION): Hamara goal har subject ke 1000+ micro-games database me fill karna hai. Bacche ke chat karne par uske current knowledge level se thoda sa advance game khud se auto-generate karke do, bhale hi usne explicitly "game banao" na bola ho (lekin agar wo bas casual hi/hello kar raha hai toh sirf chat karo).
6. HOMEWORK SCANNER PROMO: Bacchon ko hamesha yaad dilao ki unke paas 'Premium' hai. Unhe motivate karo ki wo apni school books, drawings ya homework ko 'Smart Scanner' se scan karein taaki tum usse game bana sako. Chat ke end me kabhi-kabhi [GOTO:/scanner] bhi lagao.`;
    const userPrompt = PROMPTS.chat(message, childAge, []);

    // Universal AI Router Engine: Groq -> Gemini -> OpenAI (ChatGPT) -> Claude
    // Agar Groq fail hua toh auto-fallback karke Gemini, phir OpenAI, aur last mein Claude ko try karega
    const aiResponse = await generateAI({
      system: systemPrompt,
      prompt: userPrompt,
      messages: history, // Ye line AI ko pichli chat history provide karti hai
      preferred: 'groq' // Primary pasand Groq hai (Llama3 fast hai), fail hone pe dusre aayenge
    });

    console.log("🤖 [CHAT API] AI Response Success:", aiResponse.success);

    if (!aiResponse.success) {
      console.error("All AI Models Failed:", aiResponse.error);
      throw new Error(aiResponse.error);
    }

    // Data formatting taaki kisi bhi model se aya hua response frontend pe smoothly dikhe
    let replyText = typeof aiResponse.data === 'string' ? aiResponse.data : "";
    let followUpText = "";

    if (typeof aiResponse.data === 'object' && aiResponse.data !== null) {
      replyText = aiResponse.data?.message || JSON.stringify(aiResponse.data);
      followUpText = aiResponse.data?.followUp || "";
      
      // Bacchon ki chat limit count (Database me daily usage track karega)
      if (childId) {
        await incrementUsage(childId, "chat_messages");
      }

      // Agar AI ne naya game banaya hai, toh usko turant Supabase Library me Auto-Save karo
      if (aiResponse.data?.newGameData && aiResponse.data?.suggestGame) {
        console.log("💾 [CHAT API] Auto-saving new game to Library for:", childId);
        await saveLibraryItem(childId, {
          title: aiResponse.data.newGameData.title || "New AI Game",
          subject: aiResponse.data.subject || "general",
          type: aiResponse.data.newGameData.type || "ai_generated",
          content: aiResponse.data.newGameData, // Pura game JSON format me save hoga
          source: "ai_chat" // Pata chalega ki AI ne banaya hai
        });
      }
    }

    return NextResponse.json({ message: replyText, followUp: followUpText, rawData: aiResponse.data });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { message: "Main abhi connect nahi kar pa rahi hoon (Groq, Gemini, OpenAI, Claude - sabhi models fail ho gaye). API Keys check karein! 🔌" },
      { status: 500 }
    );
  }
}