"use client";
import { useState } from "react";

const C = { card: "#0f1520", card2: "#161e30", border: "#1e2d45", orange: "#ff6b35", cyan: "#06b6d4", purple: "#7c3aed", green: "#10b981", text: "#f1f5f9", muted: "#64748b", pink: "#ec4899" };

export default function StoryEngine() {
  const [topic, setTopic] = useState("");
  const [generated, setGenerated] = useState(false);

  return (
    <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 24 }}>📖</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>AI Story Engine</div>
          <div style={{ fontSize: 12, color: C.muted }}>Apne ideas ko kahani mein badlo!</div>
        </div>
      </div>

      {!generated ? (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: C.muted }}>Kiske baare mein story likhni hai?</div>
          <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Ek udne wala kutta jo space mein gaya..." rows={3} style={{ width: "100%", padding: "12px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card2, color: C.text, outline: "none", fontFamily: "inherit", resize: "none", marginBottom: 16 }} />
          <button onClick={() => setGenerated(true)} disabled={!topic} style={{ width: "100%", padding: "12px", borderRadius: 12, background: topic ? C.pink : C.card2, color: topic ? "#fff" : C.muted, border: "none", fontWeight: 800, cursor: topic ? "pointer" : "not-allowed" }}>✨ Magic Story Banao!</button>
        </div>
      ) : (
        <div style={{ animation: "slideUp .3s" }}>
          <div style={{ background: C.pink + "11", border: `1px solid ${C.pink}44`, borderRadius: 14, padding: 16, marginBottom: 16 }}>
            <div style={{ fontWeight: 800, color: C.pink, marginBottom: 8, fontSize: 15 }}>🚀 The Magic Adventure</div>
            <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>Ek baar ki baat hai, ek bahut hi special character tha jiska naam tha... (AI se generated story yahan aayegi). Wo apne dosto ke sath ek nayi duniya ki khoj mein nikal pada!</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setGenerated(false)} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontWeight: 700, cursor: "pointer" }}>✏️ Edit Topic</button>
            <button style={{ flex: 1, padding: "10px", borderRadius: 10, background: C.pink, border: "none", color: "#fff", fontWeight: 800, cursor: "pointer" }}>📢 Publish</button>
          </div>
        </div>
      )}
    </div>
  );
}