import { callGemini } from "./gemini";
import { callClaude } from "./claude";
import { callOpenAI } from "./openai";
import { callGroq } from "./groq";

function normalizeMessages(messages) {
  return messages.map(m => ({
    role: m.role === 'student' || m.role === 'user' ? 'user' : 'assistant',
    content: m.message || m.content || ''
  })).filter(m => m.content);
}

export async function generateAI({ system = "", prompt = "", messages = [], images = [], preferred = "gemini" }) {
  
  const keys = {
    gemini: !!process.env.GEMINI_API_KEY,
    claude: !!process.env.ANTHROPIC_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
    groq: !!process.env.GROQ_API_KEY,
  };

  // DEBUGGING: Ye line terminal mein batayegi ki actual mein konsi key load hui hai!
  console.log("\n🔑 Loaded API Keys Status:", keys);

  // 🚀 FIX: Groq aur Gemini dono rakhenge, taaki Groq ka model change/fail ho toh Gemini turant sambhal le
  const order = ["groq", "gemini"];
  const tried = new Set();
  let lastError = "No API keys configured in .env";

  for (const ai of order) {
    if (tried.has(ai) || !keys[ai]) continue;
    tried.add(ai);
    console.log(`🤖 AI Router -> Routing task to: ${ai.toUpperCase()}`);

    try {
      let res;
      console.log(`\n⏳ [AI-HANDLER] Trying to call: ${ai.toUpperCase()}`);
      // Gemini aur Claude wrappers ke liye messages ko prompt string me badalna (kyunki unhe array samajh nahi aata)
      let combinedPrompt = prompt;
      if (messages.length > 0 && ai !== 'openai' && ai !== 'groq') {
        const historyStr = messages.map(m => `${m.role === 'student' ? 'Student' : 'Tutor'}: ${m.message || m.content}`).join('\n\n');
        combinedPrompt = `${historyStr}\n\nStudent: ${prompt}`;
      }

      if (ai === "gemini") res = await callGemini({ system, prompt: combinedPrompt, images });
      else if (ai === "claude") res = await callClaude({ system, prompt: combinedPrompt, images });
      else if (ai === "openai") res = await callOpenAI({ system, prompt, messages, images });
      else if (ai === "groq") res = await callGroq({ system, prompt, messages: normalizeMessages(messages), images });

      if (res && res.success) {
        console.log(`✅ [AI-HANDLER] ${ai.toUpperCase()} SUCCESS!`);
        return res;
      }
      console.log(`❌ [AI-HANDLER] ${ai.toUpperCase()} FAILED:`, res?.error);
      if (res && res.error) lastError = `${ai}: ${res.error}`;
    } catch (e) { 
      console.log(`❌ [AI-HANDLER] ${ai.toUpperCase()} CRASHED:`, e.message);
      lastError = `${ai}: ${e.message}`; 
    }
  }
  return { success: false, error: lastError };
}