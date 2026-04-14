"use client";
import { useState } from "react";

const C = { card2: "#161e30", border: "#1e2d45", green: "#10b981", blue: "#3b82f6", text: "#f1f5f9", muted: "#64748b" };

const STORY_PARTS = {
  hero: ["🦁 Sher Raja", "🤖 Robot Robo", "👧 Priya"],
  setting: ["🏰 ek purane mahal mein", "🚀 space station par", "🌴 jungle mein"],
  problem: ["ek rahasya tha", "ek power band ho gayi thi"],
  solution: ["dimag lagakar", "dosto ki madad se"]
};

export default function EnglishBuilder({ onXP = () => {} }) {
  const [picks, setPicks] = useState({ hero: 0, setting: 0, problem: 0, solution: 0 });
  const [storyMade, setStoryMade] = useState(false);

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12, color: C.text }}>Khud Ki Story Banao! ✨</div>
      {Object.keys(STORY_PARTS).map(part => (
        <div key={part} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>{part}</div>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
            {STORY_PARTS[part].map((opt, i) => (
              <button key={i} onClick={() => setPicks(p => ({ ...p, [part]: i }))} style={{ padding: "8px 12px", borderRadius: 10, border: `1.5px solid ${picks[part] === i ? C.green : C.border}`, background: picks[part] === i ? C.green + "22" : C.card2, color: picks[part] === i ? C.green : C.muted, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={() => { setStoryMade(true); onXP(20); }} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${C.green}, ${C.green}cc)`, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", marginTop: 12 }}>
        🚀 Padhke Sunao!
      </button>

      {storyMade && (
        <div style={{ marginTop: 16, background: C.card2, border: `1px solid ${C.green}44`, borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 15, lineHeight: 1.6, color: C.text }}>
            Ek din, <strong>{STORY_PARTS.hero[picks.hero]}</strong> ghoom raha tha <strong>{STORY_PARTS.setting[picks.setting]}</strong>.
            Achanak pata chala ki <strong>{STORY_PARTS.problem[picks.problem]}</strong>!
            Lekin ghabrane ki baat nahi thi, usne <strong>{STORY_PARTS.solution[picks.solution]}</strong> aur sab theek kar diya! 🎉
          </div>
        </div>
      )}
    </div>
  );
}