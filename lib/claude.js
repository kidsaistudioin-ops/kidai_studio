import Anthropic from "@anthropic-ai/sdk";

let client = null;
try {
  if (process.env.ANTHROPIC_API_KEY) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
} catch (e) {
  console.warn("⚠️ Claude API Key invalid or missing, skipping initialization.");
}

// Main wrapper — sab API calls yahan se
export async function callClaude({
  model = "claude-haiku-4-5-20251001",
  system = "",
  prompt,
  images = [],
  maxTokens = 800,
}) {
  if (!client) return { success: false, error: "Claude is disabled or API key is missing." };

  try {
    const content = [];

    // Images add karo (vision ke liye)
    images.forEach((b64) => {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: "image/jpeg",
          data: b64,
        },
      });
    });

    content.push({ type: "text", text: prompt });

    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content }],
    });

    const raw = response.content[0].text
      .replace(/```json|```/g, "")
      .trim();

    return {
      success: true,
      data: JSON.parse(raw),
      usage: response.usage,
    };
  } catch (error) {
    console.error("Claude API Error:", error.message);
    return { success: false, error: error.message };
  }
}

// Cost calculator (INR mein)
export function calculateCost(inputTokens, outputTokens, model) {
  const rates = {
    "claude-haiku-4-5-20251001": {
      input: 0.00025,
      output: 0.00125,
    },
    "claude-sonnet-4-20250514": {
      input: 0.003,
      output: 0.015,
    },
  };
  const rate = rates[model] || rates["claude-haiku-4-5-20251001"];
  const usd = inputTokens * rate.input / 1000 + outputTokens * rate.output / 1000;
  return Math.round(usd * 85 * 100) / 100; // USD to INR
}
