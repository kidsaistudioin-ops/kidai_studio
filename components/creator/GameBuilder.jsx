"use client";
import { useState, useEffect } from "react";
import { speak } from "@/lib/voice";

const C = { 
  card: "#0f1520", card2: "#161e30", border: "#1e2d45", 
  orange: "#ff6b35", cyan: "#06b6d4", purple: "#7c3aed", 
  green: "#10b981", blue: "#3b82f6", yellow: "#f59e0b", pink: "#ec4899",
  text: "#f1f5f9", muted: "#64748b" 
};

const BLOCKS = [
  { id: "move_right", label: "➡️ Move Right", bg: C.blue, type: "motion" },
  { id: "move_left", label: "⬅️ Move Left", bg: C.blue, type: "motion" },
  { id: "jump", label: "⬆️ Jump High", bg: C.orange, type: "motion" },
  { id: "say", label: "💬 Say Message", bg: C.purple, type: "looks" },
  { id: "grow", label: "🍄 Grow Bigger", bg: C.purple, type: "looks" },
  { id: "sound", label: "🔊 Play Sound", bg: C.pink, type: "sound" },
  { id: "wait", label: "⏳ Wait 1 sec", bg: C.yellow, type: "control" },
];

export default function GameBuilder() {
  const [script, setScript] = useState([{ id: "start", label: "🟢 When ▶ Clicked", bg: C.green }]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerState, setPlayerState] = useState({ x: 20, y: 0, scale: 1, text: "" });
  const [playerEmoji, setPlayerEmoji] = useState("🤖");

  const addBlock = (block) => {
    let customText = "";
    if (block.id === "say") {
      customText = window.prompt("Character se kya bulwana hai?", "Hello!") || "Hello!";
      setScript([...script, { ...block, label: `💬 Say '${customText}'`, customText, uid: Math.random() }]);
    } else {
      setScript([...script, { ...block, uid: Math.random() }]);
    }
  };

  const removeBlock = (index) => {
    if (index === 0) return; // 'Start' block ko remove nahi kar sakte
    setScript(script.filter((_, i) => i !== index));
  };

  // Game Engine Logic (Read blocks and animate)
  useEffect(() => {
    if (!isPlaying) {
      setPlayerState({ x: 20, y: 0, scale: 1, text: "" }); // Reset
      return;
    }

    let currentStep = 1; // Skip start block
    
    const runScript = setInterval(() => {
      if (currentStep >= script.length) {
        clearInterval(runScript);
        setTimeout(() => setIsPlaying(false), 1000);
        return;
      }

      const block = script[currentStep];
      setPlayerState(prev => {
        let next = { ...prev, text: "" }; // Clear text
        if (block.id === "move_right") next.x += 40;
        if (block.id === "move_left") next.x = Math.max(0, next.x - 40);
        if (block.id === "jump") { next.y = 60; setTimeout(() => setPlayerState(p => ({...p, y: 0})), 400); }
        if (block.id === "say") { 
          next.text = block.customText || "Hello!"; 
          speak(next.text, { pitch: 1.2, rate: 0.9 }); 
        }
        if (block.id === "grow") next.scale += 0.5;
        return next;
      });

      currentStep++;
    }, 800); // 0.8s per block execution

    return () => clearInterval(runScript);
  }, [isPlaying, script]);

  return (
    <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Block Coder 🧩</div>
          <div style={{ fontSize: 12, color: C.muted }}>Scratch ki tarah game logic banao!</div>
        </div>
        <button onClick={() => setIsPlaying(!isPlaying)} style={{ padding: "8px 20px", borderRadius: 12, background: isPlaying ? C.red : C.green, color: "#fff", border: "none", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          {isPlaying ? "⏹ Stop" : "▶ Play"}
        </button>
      </div>

    {/* Character Selection */}
    <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
      {["🤖", "👽", "👻", "🤠", "🐱", "🐶", "🦊", "🐉"].map(e => (
        <button key={e} onClick={() => setPlayerEmoji(e)} style={{ flexShrink: 0, background: playerEmoji === e ? C.cyan+"44" : C.card2, border: `1px solid ${playerEmoji === e ? C.cyan : C.border}`, borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontSize: 20, fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif' }}>{e}</button>
      ))}
    </div>

      {/* 📺 GAME CANVAS (Preview Area) */}
      <div style={{ height: 180, background: "linear-gradient(180deg, #1e3a8a, #0f172a)", borderRadius: 16, position: "relative", overflow: "hidden", border: `2px solid ${C.border}`, marginBottom: 16 }}>
        <div style={{ position: "absolute", bottom: playerState.y + 20, left: `${playerState.x}%`, transform: `scale(${playerState.scale})`, transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)", fontSize: 48, zIndex: 10, fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif' }}>
        {playerEmoji}
          {playerState.text && (
            <div style={{ position: "absolute", top: -30, left: 20, background: "#fff", color: "#000", padding: "4px 8px", borderRadius: "12px 12px 12px 0", fontSize: 12, fontWeight: 800, whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
              {playerState.text}
            </div>
          )}
        </div>
        <div style={{ position: "absolute", bottom: 0, width: "100%", height: 20, background: "#064e3b", borderTop: "4px solid #047857" }} />
      </div>

      {/* 🧩 SCRIPT AREA (Blocks Stack) */}
      <div style={{ background: C.card2, borderRadius: 16, padding: 16, minHeight: 180, marginBottom: 16, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 12, fontWeight: 800, letterSpacing: 1 }}>YOUR SCRIPT (Tap block to delete)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {script.map((b, i) => (
            <div key={b.uid || b.id} onClick={() => removeBlock(i)} style={{ background: b.bg, padding: "10px 16px", borderRadius: i === 0 ? "12px 12px 12px 0" : "0 12px 12px 0", color: "#fff", fontWeight: 800, fontSize: 13, width: "fit-content", marginLeft: i > 0 ? 16 : 0, boxShadow: "0 4px 0 rgba(0,0,0,0.2)", cursor: i > 0 ? "pointer" : "default", borderLeft: i > 0 ? "4px solid rgba(255,255,255,0.3)" : "none" }}>
              {b.label}
            </div>
          ))}
        </div>
      </div>

      {/* 📦 BLOCKS PALETTE (Tap to add) */}
      <div>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 10, fontWeight: 800, letterSpacing: 1 }}>ADD BLOCKS (Tap to add)</div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12 }}>
          {BLOCKS.map(b => (
            <button key={b.id} onClick={() => addBlock(b)} style={{ background: b.bg, border: "none", padding: "10px 14px", borderRadius: 10, color: "#fff", fontWeight: 800, fontSize: 13, whiteSpace: "nowrap", flexShrink: 0, cursor: "pointer", boxShadow: "0 4px 0 rgba(0,0,0,0.2)", transform: "translateY(0)", transition: "transform 0.1s" }}
              onMouseDown={e => e.currentTarget.style.transform = "translateY(4px)"}
              onMouseUp={e => e.currentTarget.style.transform = "translateY(0)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}