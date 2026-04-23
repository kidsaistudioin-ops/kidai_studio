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

  if (images && images.length > 0) {
    currentModel = "llama-3.2-11b-vision-preview"; // Groq Vision Model
    finalContent = [{ type: "text", text: prompt }];
    images.forEach(imgData => {
      // Agar pehle se 'data:image' prefix laga hai toh direct use karo, warna lagao
      const url = imgData.startsWith("data:image") 
        ? imgData 
        : `data:image/jpeg;base64,${imgData}`;
      finalContent.push({ type: "image_url", image_url: { url } });
    });
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
        temperature: 0.7
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