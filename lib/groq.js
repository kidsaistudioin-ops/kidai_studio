export async function callGroq({ system = "", prompt = "", messages = [], images = [], maxTokens = 1000 }) {
  if (!process.env.GROQ_API_KEY) {
    return { success: false, error: "GROQ_API_KEY missing in .env" };
  }

  // Groq filhaal image support nahi karta, toh agar image aayi toh hum isko skip kar denge (router automatically Gemini pe chala jayega)
  if (images && images.length > 0) {
     return { success: false, error: "Groq does not support image vision natively yet. Fallback to Gemini."};
  }

  try {
    const msgs = [];
    if (system) msgs.push({ role: "system", content: system });
    
    // History add karein
    messages.forEach(m => {
      msgs.push({ role: m.role === 'student' || m.role === 'user' ? 'user' : 'assistant', content: m.message || m.content || "" });
    });

    if (prompt) msgs.push({ role: "user", content: prompt });

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: msgs, max_tokens: maxTokens })
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    let raw = data.choices[0].message.content.replace(/```json|```/g, "").trim();
    try { return { success: true, data: JSON.parse(raw) }; } 
    catch (e) { return { success: true, data: raw }; } 
  } catch (err) {
    return { success: false, error: err.message };
  }
}