"use client";
import { useState } from "react";

const C = { card2: "#161e30", border: "#1e2d45", orange: "#ff6b35", text: "#f1f5f9", muted: "#64748b" };

const VARNAMALA = [ { letter: "क", word: "कबूतर", emoji: "🕊️" }, { letter: "ख", word: "खरगोश", emoji: "🐇" }, { letter: "ग", word: "गमला", emoji: "🪴" } ];

export default function HindiVisual() {
  const [idx, setIdx] = useState(0);

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12, color: C.orange }}>Varnamala Seekho! 🇮🇳</div>
      <div style={{ background: C.card2, borderRadius: 16, padding: 24, textAlign: "center", border: `1px solid ${C.orange}44` }}>
        <div style={{ fontSize: 60, fontWeight: 800, color: C.orange, marginBottom: 8 }}>{VARNAMALA[idx].letter}</div>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{VARNAMALA[idx].emoji}</div>
        <div style={{ fontSize: 20, color: C.text, fontWeight: 700, marginBottom: 16 }}>से {VARNAMALA[idx].word}</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button onClick={() => setIdx(i => i > 0 ? i - 1 : VARNAMALA.length - 1)} style={{ padding: "10px 20px", borderRadius: 12, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontWeight: 800, cursor: "pointer" }}>←</button>
          <button onClick={() => setIdx(i => (i + 1) % VARNAMALA.length)} style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: C.orange, color: "#fff", fontWeight: 800, cursor: "pointer" }}>Next →</button>
        </div>
      </div>
    </div>
  );
}
