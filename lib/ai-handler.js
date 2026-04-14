import { callGemini } from "./gemini";
import { callClaude } from "./claude";
import { callOpenAI } from "./openai";
import { callGroq } from "./groq";

export async function generateAI({ system = "", prompt = "", messages = [], images = [], preferred = "gemini" }) {
  
  const keys = {
    gemini: !!process.env.GEMINI_API_KEY,
    claude: !!process.env.ANTHROPIC_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
    groq: !!process.env.GROQ_API_KEY,
  };

  // Agar fallback ki zaroorat padi toh Groq > Gemini > OpenAI
  const order = [preferred, "groq", "gemini", "openai", "claude"];
  const tried = new Set();
  let lastError = "No API keys configured in .env";

  for (const ai of order) {
    if (tried.has(ai) || !keys[ai]) continue;
    tried.add(ai);
    console.log(`🤖 AI Router -> Routing task to: ${ai.toUpperCase()}`);

    try {
      let res;
      // Gemini aur Claude wrappers ke liye messages ko prompt string me badalna (kyunki unhe array samajh nahi aata)
      let combinedPrompt = prompt;
      if (messages.length > 0 && ai !== 'openai' && ai !== 'groq') {
        const historyStr = messages.map(m => `${m.role === 'student' ? 'Student' : 'Tutor'}: ${m.message || m.content}`).join('\n\n');
        combinedPrompt = `${historyStr}\n\nStudent: ${prompt}`;
      }

      if (ai === "gemini") res = await callGemini({ system, prompt: combinedPrompt, images });
      else if (ai === "claude") res = await callClaude({ system, prompt: combinedPrompt, images });
      else if (ai === "openai") res = await callOpenAI({ system, prompt, messages, images });
      else if (ai === "groq") res = await callGroq({ system, prompt, messages, images });

      if (res && res.success) return res;
      if (res && res.error) lastError = `${ai}: ${res.error}`;
    } catch (e) { lastError = `${ai}: ${e.message}`; }
  }
  return { success: false, error: lastError };
}