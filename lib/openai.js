export async function callOpenAI({ system = "", prompt = "", messages = [], images = [], maxTokens = 1000 }) {
  if (!process.env.OPENAI_API_KEY) {
    return { success: false, error: "OPENAI_API_KEY missing in .env" };
  }

  try {
    const msgs = [];
    if (system) msgs.push({ role: "system", content: system });
    
    // History add karein
    messages.forEach(m => {
      msgs.push({ role: m.role === 'student' || m.role === 'user' ? 'user' : 'assistant', content: m.message || m.content || "" });
    });

    // Current Prompt aur Images add karein
    let finalContent = prompt;
    if (images.length > 0) {
      finalContent = [{ type: "text", text: prompt }];
      images.forEach(b64 => {
        const url = b64.startsWith("data:image") ? b64 : `data:image/jpeg;base64,${b64}`;
        finalContent.push({ type: "image_url", image_url: { url } });
      });
    }
    
    if (prompt || images.length > 0) msgs.push({ role: "user", content: finalContent });

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: "gpt-4o-mini", messages: msgs, max_tokens: maxTokens })
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    let raw = data.choices[0].message.content.replace(/```json|```/g, "").trim();
    try { return { success: true, data: JSON.parse(raw) }; } 
    catch (e) { return { success: true, data: raw }; } // Agar JSON nahi hai toh text bhejo
  } catch (err) {
    return { success: false, error: err.message };
  }
}