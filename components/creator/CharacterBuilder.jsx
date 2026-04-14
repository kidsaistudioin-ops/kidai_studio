"use client";
import { useState } from "react";

const C = { card: "#0f1520", card2: "#161e30", border: "#1e2d45", orange: "#ff6b35", cyan: "#06b6d4", purple: "#7c3aed", green: "#10b981", text: "#f1f5f9", muted: "#64748b" };

export default function CharacterBuilder() {
  const [name, setName] = useState("Hero");
  const [emoji, setEmoji] = useState("🤖");
  const [power, setPower] = useState("Flying");
  const [color, setColor] = useState(C.cyan);

  const emojis = ["🤖", "👽", "👻", "🤠", "🐱", "🐶", "🦊", "🐉"];
  const powers = ["Flying", "Invisibility", "Super Strength", "Time Travel", "Mind Reading"];
  const colors = [C.cyan, C.orange, C.purple, C.green, "#ef4444", "#f59e0b"];

  return (
    <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ fontSize: 24 }}>🎭</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Character Builder</div>
          <div style={{ fontSize: 12, color: C.muted }}>Apna khud ka game hero banao!</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: 20, background: `linear-gradient(135deg, ${color}44, ${color})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, border: `2px solid ${color}`, fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif' }}>
          {emoji}
        </div>
        <div style={{ flex: 1 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Character Name" style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontSize: 14, fontWeight: 700, outline: "none", marginBottom: 8 }} />
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>Power: <span style={{ color: color }}>{power}</span></div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.muted, fontWeight: 700, marginBottom: 8 }}>Avatar Chuno</div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
          {emojis.map(e => (
            <button key={e} onClick={() => setEmoji(e)} style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 12, background: emoji === e ? color + "44" : C.card2, border: `1.5px solid ${emoji === e ? color : C.border}`, fontSize: 20, cursor: "pointer", fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif' }}>{e}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.muted, fontWeight: 700, marginBottom: 8 }}>Super Power</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {powers.map(p => (
            <button key={p} onClick={() => setPower(p)} style={{ padding: "6px 12px", borderRadius: 10, background: power === p ? color + "22" : C.card2, border: `1px solid ${power === p ? color : C.border}`, color: power === p ? color : C.muted, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{p}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {colors.map(c => (
          <button key={c} onClick={() => setColor(c)} style={{ width: 30, height: 30, borderRadius: "50%", background: c, border: color === c ? "3px solid #fff" : "none", cursor: "pointer" }} />
        ))}
      </div>

      <button style={{ width: "100%", padding: "12px", borderRadius: 12, background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: "#fff", border: "none", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>💾 Character Save Karo</button>
    </div>
  );
}