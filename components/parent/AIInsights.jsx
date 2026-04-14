"use client";

const C = { card: "#0f1520", text: "#f1f5f9", cyan: "#06b6d4", green: "#10b981", yellow: "#f59e0b", orange: "#ff6b35" };

const AI_INSIGHTS = [
  { icon: "🧠", color: C.cyan, title: "Math mein tez hai Arjun!", body: "Last 7 din mein Math ka score 32% se 71% ho gaya. Multiplication tables ab confident ho gaye hain." },
  { icon: "📈", color: C.green, title: "Weekends pe zyada active!", body: "Sat-Sun mein Arjun double time spend karta hai (avg 50 min vs 28 min weekdays)." },
  { icon: "⚠️", color: C.yellow, title: "English Grammar pe dhyan do", body: "Vocabulary achha hai (68%) lekin Grammar quiz mein sirf 42% sahi." }
];

export default function AIInsights() {
  return (
    <div>
      {AI_INSIGHTS.map((insight, i) => (
        <div key={i} style={{ background: C.card, border: `1px solid ${insight.color}33`, borderRadius: 18, padding: 16, marginBottom: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: insight.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{insight.icon}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: insight.color, marginBottom: 6 }}>{insight.title}</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{insight.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}