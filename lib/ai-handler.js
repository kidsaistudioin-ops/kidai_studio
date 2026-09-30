import { callGemini } from "./gemini";
import { callClaude } from "./claude";
import { callOpenAI } from "./openai";
import { callGroq } from "./groq";
import { logAiUsage } from "./ai-logger";

function normalizeMessages(messages) {
  return messages.map(m => ({
    role: m.role === 'student' || m.role === 'user' ? 'user' : 'assistant',
    content: m.message || m.content || ''
  })).filter(m => m.content);
}

export async function generateAI({ 
  system = "", 
  prompt = "", 
  messages = [], 
  images = [], 
  preferred = "gemini",
  studentId = "guest_student",
  studentName = "Kid User",
  featureName = "ai_generation"
}) {
  
  const keys = {
    gemini: !!process.env.GEMINI_API_KEY,
    claude: !!process.env.ANTHROPIC_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
    groq: !!process.env.GROQ_API_KEY,
  };

  // DEBUGGING: Ye line terminal mein batayegi ki actual mein konsi key load hui hai!
  console.log("\n🔑 Loaded API Keys Status:", keys);

  // 🚀 Multi-AI Router Priority Order (OpenAI GPT-4o, Gemini 1.5/2.0, Groq Llama, Claude)
  let order;
  if (preferred === "openai" || preferred === "gpt-4o") {
    order = ["openai", "gemini", "groq", "claude"];
  } else if (preferred === "gemini") {
    order = ["gemini", "openai", "groq", "claude"];
  } else if (preferred === "groq") {
    order = ["groq", "openai", "gemini", "claude"];
  } else {
    order = ["openai", "gemini", "groq", "claude"];
  }

  const tried = new Set();
  let errorDetails = [];

  for (const ai of order) {
    if (tried.has(ai) || !keys[ai]) continue;
    tried.add(ai);
    console.log(`🤖 AI Router -> Routing task to: ${ai.toUpperCase()}`);

    try {
      let res;
      console.log(`\n⏳ [AI-HANDLER] Trying to call: ${ai.toUpperCase()}`);
      // Gemini aur Claude wrappers ke liye messages ko prompt string me badalna
      let combinedPrompt = prompt;
      if (messages.length > 0 && ai !== 'openai' && ai !== 'groq') {
        const historyStr = messages.map(m => `${m.role === 'student' ? 'Student' : 'Tutor'}: ${m.message || m.content}`).join('\n\n');
        combinedPrompt = `${historyStr}\n\nStudent: ${prompt}`;
      }

      if (ai === "openai") res = await callOpenAI({ system, prompt, messages, images, model: "gpt-4o-mini" });
      else if (ai === "gemini") res = await callGemini({ system, prompt: combinedPrompt, images });
      else if (ai === "groq") res = await callGroq({ system, prompt, messages: normalizeMessages(messages), images });
      else if (ai === "claude") res = await callClaude({ system, prompt: combinedPrompt, images });

      if (res && res.success) {
        console.log(`✅ [AI-HANDLER] ${ai.toUpperCase()} SUCCESS!`);
        if (res.usage) {
          try {
            await logAiUsage({
              studentId,
              studentName,
              featureName,
              model: res.usage.model || "gpt-4o-mini",
              promptTokens: res.usage.promptTokens || 0,
              completionTokens: res.usage.completionTokens || 0,
              totalTokens: res.usage.totalTokens || 0,
              costUSD: res.usage.costUSD || 0,
              costINR: res.usage.costINR || 0,
              imagesCount: images.length
            });
          } catch (logErr) {
            console.warn("AI Log write err:", logErr);
          }
        }
        return res;
      }
      console.log(`❌ [AI-HANDLER] ${ai.toUpperCase()} FAILED:`, res?.error);
      errorDetails.push(`${ai.toUpperCase()}: ${res?.error || "Unknown Error"}`);
    } catch (e) { 
      console.log(`❌ [AI-HANDLER] ${ai.toUpperCase()} CRASHED:`, e.message);
      errorDetails.push(`${ai.toUpperCase()}: ${e.message}`);
    }
  }
  
  // Saare errors ko combine karke bhejein taaki exact wajah pata chale
  return { success: false, error: errorDetails.join(" ➔ ") || "No active API keys found in .env (Add OPENAI_API_KEY or GEMINI_API_KEY)" };
}