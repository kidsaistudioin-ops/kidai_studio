"use client";

const C = { card: "#0f1520", card2: "#161e30", border: "#1e2d45", orange: "#ff6b35", cyan: "#06b6d4", purple: "#7c3aed", green: "#10b981", text: "#f1f5f9", muted: "#64748b" };

const STORE_GAMES = [
  { id: 1, title: "Dino Math Run", author: "Aarav (Age 10)", plays: 120, rating: "4.8", color: C.green, icon: "🦕" },
  { id: 2, title: "Galaxy Word Hunt", author: "Priya (Age 12)", plays: 340, rating: "4.9", color: C.purple, icon: "🌌" },
];

export default function GameStore() {
  return (
    <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 24 }}>🏪</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Community Game Store</div>
          <div style={{ fontSize: 12, color: C.muted }}>Dosto ke banaye games khelo!</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {STORE_GAMES.map(g => (
          <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, background: C.card2, border: `1px solid ${C.border}` }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: g.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{g.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: C.text }}>{g.title}</div>
              <div style={{ fontSize: 11, color: C.muted }}>By {g.author} • ⭐ {g.rating} ({g.plays} plays)</div>
            </div>
            <button style={{ padding: "8px 16px", borderRadius: 10, background: g.color, color: "#fff", border: "none", fontWeight: 800, cursor: "pointer" }}>Play</button>
          </div>
        ))}
      </div>
    </div>
  );
}