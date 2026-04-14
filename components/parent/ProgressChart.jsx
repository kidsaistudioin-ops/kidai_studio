"use client";

const C = { card: "#0f1520", border: "#1e2d45", cyan: "#06b6d4", purple: "#7c3aed", muted: "#64748b" };

const WEEKLY_DATA = [
  { day: "Mon", games: 4 }, { day: "Tue", games: 6 }, { day: "Wed", games: 3 },
  { day: "Thu", games: 7 }, { day: "Fri", games: 5 }, { day: "Sat", games: 9 }, { day: "Sun", games: 4 }
];

export default function ProgressChart() {
  const maxGames = Math.max(...WEEKLY_DATA.map(d => d.games));
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16, marginBottom: 14 }}>
      <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14, color: "#f1f5f9" }}>📅 Weekly Games Played</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, justifyContent: "space-between", height: 100 }}>
        {WEEKLY_DATA.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>{d.games}</div>
            <div style={{ width: "100%", height: Math.round((d.games / maxGames) * 80), background: `linear-gradient(180deg,${C.cyan},${C.purple})`, borderRadius: "6px 6px 0 0", minHeight: 8 }} />
            <div style={{ fontSize: 10, color: C.muted }}>{d.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
}