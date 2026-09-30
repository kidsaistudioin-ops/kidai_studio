import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      studentId = "guest_user",
      studentName = "Kid User",
      featureName = "ai_feature",
      model = "gpt-4o-mini",
      promptTokens = 0,
      completionTokens = 0,
      totalTokens = 0,
      imagesCount = 0,
      gamesCreated = 0,
      costUSD = 0,
      costINR = 0,
      metadata = {}
    } = body;

    let finalCostUSD = costUSD;
    let finalCostINR = costINR;

    if (finalCostUSD === 0 && totalTokens > 0) {
      const inputRate = model === "gpt-4o" ? 2.50 : 0.15;
      const outputRate = model === "gpt-4o" ? 10.00 : 0.60;
      finalCostUSD = ((promptTokens / 1000000) * inputRate) + ((completionTokens / 1000000) * outputRate);
      finalCostINR = finalCostUSD * 84;
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
      cost_usd: parseFloat(finalCostUSD.toFixed(6)),
      cost_inr: parseFloat(finalCostINR.toFixed(4)),
      metadata: metadata,
      created_at: new Date().toISOString()
    };

    try {
      await supabase.from("ai_usage_logs").insert([logEntry]);
    } catch (err) {
      console.warn("Supabase insert fallback:", err.message);
    }

    return NextResponse.json({ success: true, log: logEntry });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    let logs = [];
    try {
      const { data, error } = await supabase
        .from("ai_usage_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (data && data.length > 0) {
        logs = data;
      }
    } catch (err) {
      console.warn("Could not fetch from Supabase:", err.message);
    }

    // Aggregations
    const totalRequests = logs.length;
    const totalTokens = logs.reduce((sum, l) => sum + (l.total_tokens || 0), 0);
    const totalCostINR = logs.reduce((sum, l) => sum + (l.cost_inr || 0), 0);
    const totalCostUSD = logs.reduce((sum, l) => sum + (l.cost_usd || 0), 0);
    const totalImagesScanned = logs.reduce((sum, l) => sum + (l.images_count || 0), 0);
    const totalGamesCreated = logs.reduce((sum, l) => sum + (l.games_created || 0), 0);

    // Per Kid Aggregation
    const kidMap = {};
    logs.forEach(l => {
      const id = l.student_id || "unknown";
      if (!kidMap[id]) {
        kidMap[id] = {
          studentId: id,
          studentName: l.student_name || id,
          requests: 0,
          tokens: 0,
          costINR: 0,
          costUSD: 0,
          images: 0,
          games: 0,
          lastActive: l.created_at
        };
      }
      kidMap[id].requests += 1;
      kidMap[id].tokens += (l.total_tokens || 0);
      kidMap[id].costINR += (l.cost_inr || 0);
      kidMap[id].costUSD += (l.cost_usd || 0);
      kidMap[id].images += (l.images_count || 0);
      kidMap[id].games += (l.games_created || 0);
    });

    const perKidStats = Object.values(kidMap);

    // Feature Breakdown
    const featureMap = {};
    logs.forEach(l => {
      const f = l.feature_name || "other";
      if (!featureMap[f]) {
        featureMap[f] = { count: 0, tokens: 0, costINR: 0 };
      }
      featureMap[f].count += 1;
      featureMap[f].tokens += (l.total_tokens || 0);
      featureMap[f].costINR += (l.cost_inr || 0);
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalRequests,
        totalTokens,
        totalCostINR: parseFloat(totalCostINR.toFixed(2)),
        totalCostUSD: parseFloat(totalCostUSD.toFixed(4)),
        totalImagesScanned,
        totalGamesCreated,
        avgCostPerKidINR: perKidStats.length > 0 ? parseFloat((totalCostINR / perKidStats.length).toFixed(2)) : 0
      },
      perKidStats,
      featureBreakdown: featureMap,
      recentLogs: logs
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
