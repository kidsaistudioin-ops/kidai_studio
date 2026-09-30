export async function callOpenAI({ 
  system = "", 
  prompt = "", 
  messages = [], 
  images = [], 
  maxTokens = 2500,
  model = "gpt-4o-mini" // Default is ultra-cheap gpt-4o-mini
}) {
  if (!process.env.OPENAI_API_KEY) {
    return { success: false, error: "OPENAI_API_KEY missing in .env" };
  }

  try {
    const msgs = [];
    if (system) {
      msgs.push({ role: "system", content: system });
    }
    
    // Conversation History add karein
    messages.forEach(m => {
      const role = m.role === 'student' || m.role === 'user' ? 'user' : 'assistant';
      const content = m.message || m.content || "";
      if (content) {
        msgs.push({ role, content });
      }
    });

    // Current Prompt aur Multi-modal Vision Images add karein
    if (images.length > 0) {
      const contentParts = [];
      if (prompt) contentParts.push({ type: "text", text: prompt });
      
      images.forEach(img => {
        if (!img) return;
        const url = img.startsWith("data:") 
          ? img 
          : img.startsWith("http") 
            ? img 
            : `data:image/jpeg;base64,${img}`;
        contentParts.push({ type: "image_url", image_url: { url, detail: "low" } });
      });
      msgs.push({ role: "user", content: contentParts });
    } else if (prompt) {
      msgs.push({ role: "user", content: prompt });
    }

    console.log(`🤖 [OPENAI] Dispatching to: ${model.toUpperCase()} (Tokens limit: ${maxTokens})`);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` 
      },
      body: JSON.stringify({ 
        model: model, 
        messages: msgs, 
        max_tokens: maxTokens,
        temperature: 0.7
      })
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(`OpenAI Error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("No response choices returned by OpenAI");
    }

    // Exact Token Usage & Cost Calculation (GPT-4o-mini rates: $0.15/1M in, $0.60/1M out)
    const promptTokens = data.usage?.prompt_tokens || 0;
    const completionTokens = data.usage?.completion_tokens || 0;
    const totalTokens = data.usage?.total_tokens || 0;

    const inputRatePerMillion = model === "gpt-4o" ? 2.50 : 0.15;
    const outputRatePerMillion = model === "gpt-4o" ? 10.00 : 0.60;

    const costUSD = ((promptTokens / 1000000) * inputRatePerMillion) + ((completionTokens / 1000000) * outputRatePerMillion);
    const costINR = costUSD * 84; // Approx INR conversion

    console.log(`📊 [AI USAGE] Model: ${model} | Tokens: ${totalTokens} (In: ${promptTokens}, Out: ${completionTokens}) | Cost: ₹${costINR.toFixed(4)} ($${costUSD.toFixed(6)})`);

    let raw = data.choices[0].message.content.trim();
    // Clean markdown wrappers if returned
    const cleanJson = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();

    const usageInfo = {
      model,
      promptTokens,
      completionTokens,
      totalTokens,
      costUSD,
      costINR
    };

    try { 
      const parsed = JSON.parse(cleanJson);
      return { success: true, data: parsed, rawText: raw, usage: usageInfo }; 
    } catch (e) { 
      return { success: true, data: raw, rawText: raw, usage: usageInfo }; 
    }
  } catch (err) {
    console.error("❌ [OPENAI] Error:", err.message);
    return { success: false, error: err.message };
  }
}