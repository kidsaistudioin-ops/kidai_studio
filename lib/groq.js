export async function callGroq({ system = "", prompt = "", messages = [], images = [] }) {
  if (!process.env.GROQ_API_KEY) {
    console.log("❌ [GROQ] API Key missing!");
    return { success: false, error: "GROQ_API_KEY .env.local mein missing hai!" };
  }

  // Messages format karna Groq (OpenAI format) ke liye
  const formattedMessages = [];
  if (system) formattedMessages.push({ role: "system", content: system });
  
  // Agar purani chat history hai toh add karein
  messages.forEach(m => {
    formattedMessages.push({ 
      role: m.role === 'student' ? 'user' : 'assistant', 
      content: m.message || m.text || m.content || "" 
    });
  });
  
  // Agar images hain, toh vision model set karein aur content format karein
  let currentModel = "llama-3.3-70b-versatile"; // Latest and working text model
  let finalContent = prompt;

  // 🚀 FIX: Groq ne apne saare Vision models band kar diye hain, isliye image aane par direct Gemini ko bhejenge
  if (images && images.length > 0) {
    console.log("⚠️ [GROQ] Vision models are decommissioned. Bypassing Groq for images.");
    return { success: false, error: "Groq Vision is decommissioned. Falling back to Gemini." };
  }

  formattedMessages.push({ role: "user", content: finalContent });

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: currentModel,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 3000
      })
    });

    console.log("🌐 [GROQ] API Response Status:", response.status);
    const data = await response.json();
    if (!response.ok) {
      console.log("❌ [GROQ] API Error Data:", data);
      return { success: false, error: data.error?.message || "Groq API Failed" };
    }
    
    let raw = data.choices[0].message.content.replace(/```json|```/g, "").trim();
    console.log("📦 [GROQ] Raw Output received (length):", raw.length);
    try { 
      return { success: true, data: JSON.parse(raw) }; 
    } catch (e) { 
      console.log("⚠️ [GROQ] JSON Parse Failed, returning raw text.");
      return { success: true, data: raw }; 
    }
  } catch (error) { 
    console.log("🚨 [GROQ] Fetch Exception:", error.message);
    return { success: false, error: error.message }; 
  }
}