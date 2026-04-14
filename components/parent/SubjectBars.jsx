"use client";

const C = { card: "#0f1520", card2: "#161e30", border: "#1e2d45", cyan: "#06b6d4", pink: "#ec4899", green: "#10b981", orange: "#ff6b35", muted: "#64748b" };

export default function SubjectBars() {
  const subjects = [
    { name: "Math", pct: 35, color: C.cyan },
    { name: "Science", pct: 25, color: C.pink },
    { name: "English", pct: 25, color: C.green },
    { name: "Hindi", pct: 15, color: C.orange }
  ];

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16, marginBottom: 14 }}>
      <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14, color: "#f1f5f9" }}>📚 Subject Time Split</div>
      {subjects.map((sub, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <div style={{ width: 60, fontSize: 12, fontWeight: 700, color: "#f1f5f9" }}>{sub.name}</div>
          <div style={{ flex: 1, height: 10, background: C.card2, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${sub.pct}%`, background: sub.color, borderRadius: 99 }} />
          </div>
          <div style={{ width: 40, textAlign: "right", fontSize: 12, color: C.muted }}>{sub.pct}%</div>
        </div>
      ))}
    </div>
  );
}