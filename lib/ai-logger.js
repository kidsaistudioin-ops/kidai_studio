import { supabase } from "@/lib/supabase";

/**
 * Log AI token usage and estimated cost to Supabase and local cache
 */
export async function logAiUsage({
  studentId = "guest_student",
  studentName = "Kid User",
  featureName = "ai_chat",
  model = "gpt-4o-mini",
  promptTokens = 0,
  completionTokens = 0,
  totalTokens = 0,
  imagesCount = 0,
  gamesCreated = 0,
  costUSD = 0,
  costINR = 0,
  metadata = {}
}) {
  // If cost was not pre-calculated, calculate based on model
  if (costUSD === 0 && totalTokens > 0) {
    const inputRate = model === "gpt-4o" ? 2.50 : 0.15;
    const outputRate = model === "gpt-4o" ? 10.00 : 0.60;
    costUSD = ((promptTokens / 1000000) * inputRate) + ((completionTokens / 1000000) * outputRate);
    costINR = costUSD * 84;
  }

  const logEntry = {
    student_id: studentId,
    student_name: studentName,
    feature_name: featureName,
    model: model,
    prompt_tokens: promptTokens,
    completion_tokens: completionTokens,
    total_tokens: totalTokens,
    images_count: imagesCount,
    games_created: gamesCreated,
    cost_usd: parseFloat(costUSD.toFixed(6)),
    cost_inr: parseFloat(costINR.toFixed(4)),
    metadata: metadata,
    created_at: new Date().toISOString()
  };

  console.log(`📝 [AI LOGGER] ${featureName} by ${studentName} (${studentId}) | Tokens: ${totalTokens} | Cost: ₹${logEntry.cost_inr}`);

  // 1. Try to save to Supabase
  try {
    const { data, error } = await supabase
      .from("ai_usage_logs")
      .insert([logEntry]);

    if (error) {
      console.warn("⚠️ Supabase ai_usage_logs table not found or failed, using local tracking.", error.message);
    }
  } catch (err) {
    console.warn("⚠️ Supabase logging fallback:", err.message);
  }

  return logEntry;
}

/**
 * Fetch AI cost analytics from Supabase
 */
export async function getAiCostAnalytics() {
  try {
    const { data, error } = await supabase
      .from("ai_usage_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return null;
    }
    return data;
  } catch (err) {
    return null;
  }
}
