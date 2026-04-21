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
  { id: "shrink", label: "🔻 Shrink", bg: C.purple, type: "looks" },
  { id: "spin", label: "🔄 Spin Around", bg: C.blue, type: "motion" },
  { id: "sound", label: "🔊 Play Sound", bg: C.pink, type: "sound" },
  { id: "wait", label: "⏳ Wait 1 sec", bg: C.yellow, type: "control" },
  { id: "loop", label: "🔁 Repeat 3x", bg: C.green, type: "control" },
  { id: "hide", label: "👻 Hide", bg: C.muted, type: "looks" },
  { id: "show", label: "✨ Show", bg: C.cyan, type: "looks" },
];

const BACKGROUNDS = [
  { id: "space", name: "🌌 Space", gradient: "linear-gradient(180deg, #1e3a8a, #0f172a)" },
  { id: "forest", name: "🌲 Forest", gradient: "linear-gradient(180deg, #14532d, #052e16)" },
  { id: "desert", name: "🏜️ Desert", gradient: "linear-gradient(180deg, #78350f, #451a03)" },
  { id: "ocean", name: "🌊 Ocean", gradient: "linear-gradient(180deg, #0c4a6e, #082f49)" },
  { id: "city", name: "🏙️ City", gradient: "linear-gradient(180deg, #374151, #111827)" },
  { id: "sunset", name: "🌅 Sunset", gradient: "linear-gradient(180deg, #7c2d12, #451a03)" },
];

export default function GameBuilder() {
  const [script, setScript] = useState([{ id: "start", label: "🟢 When ▶ Clicked", bg: C.green }]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerState, setPlayerState] = useState({ x: 20, y: 0, scale: 1, text: "", rotation: 0, visible: true });
  const [playerEmoji, setPlayerEmoji] = useState("🤖");
  const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[0]);
  const [gameName, setGameName] = useState("My Awesome Game");
  const [showSaved, setShowSaved] = useState(false);

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
      setPlayerState({ x: 20, y: 0, scale: 1, text: "", rotation: 0, visible: true }); // Reset
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
        if (block.id === "move_right") next.x = Math.min(80, next.x + 40);
        if (block.id === "move_left") next.x = Math.max(5, next.x - 40);
        if (block.id === "jump") { next.y = 60; setTimeout(() => setPlayerState(p => ({...p, y: 0})), 400); }
        if (block.id === "say") { 
          next.text = block.customText || "Hello!"; 
          speak(next.text, { pitch: 1.2, rate: 0.9 }); 
        }
        if (block.id === "grow") next.scale = Math.min(3, next.scale + 0.5);
        if (block.id === "shrink") next.scale = Math.max(0.5, next.scale - 0.3);
        if (block.id === "spin") next.rotation = (prev.rotation || 0) + 360;
        if (block.id === "hide") next.visible = false;
        if (block.id === "show") next.visible = true;
        return next;
      });

      currentStep++;
    }, 800); // 0.8s per block execution

    return () => clearInterval(runScript);
  }, [isPlaying, script]);

  const saveGame = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: 16 }}>
      {/* Game Name Input */}
      <div style={{ marginBottom: 16 }}>
        <input 
          value={gameName} 
          onChange={e => setGameName(e.target.value)} 
          placeholder="Game Name..."
          style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontSize: 14, fontWeight: 700, outline: "none" }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Block Coder 🧩</div>
          <div style={{ fontSize: 12, color: C.muted }}>Scratch ki tarah game logic banao!</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={saveGame} style={{ padding: "8px 16px", borderRadius: 12, background: C.cyan, color: "#fff", border: "none", fontWeight: 800, cursor: "pointer" }}>
            💾 Save
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} style={{ padding: "8px 20px", borderRadius: 12, background: isPlaying ? C.red : C.green, color: "#fff", border: "none", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            {isPlaying ? "⏹ Stop" : "▶ Play"}
          </button>
        </div>
      </div>

    {/* Background Selection */}
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, fontWeight: 800 }}>🎨 BACKGROUND</div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
        {BACKGROUNDS.map(bg => (
          <button key={bg.id} onClick={() => setSelectedBg(bg)} style={{ flexShrink: 0, width: 50, height: 34, borderRadius: 8, background: bg.gradient, border: selectedBg.id === bg.id ? `2px solid ${C.cyan}` : `1px solid ${C.border}`, cursor: "pointer" }} />
        ))}
      </div>
    </div>

    {/* Character Selection */}
    <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
      {["🤖", "👽", "👻", "🤠", "🐱", "🐶", "🦊", "🐉", "🦄", "👾"].map(e => (
        <button key={e} onClick={() => setPlayerEmoji(e)} style={{ flexShrink: 0, background: playerEmoji === e ? C.cyan+"44" : C.card2, border: `1px solid ${playerEmoji === e ? C.cyan : C.border}`, borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontSize: 20, fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif' }}>{e}</button>
      ))}
    </div>

      {/* 📺 GAME CANVAS (Preview Area) */}
      <div style={{ height: 180, background: selectedBg.gradient, borderRadius: 16, position: "relative", overflow: "hidden", border: `2px solid ${C.border}`, marginBottom: 16 }}>
        {/* Decorative elements based on background */}
        {selectedBg.id === "space" && <><div style={{ position: "absolute", top: 10, right: 20, fontSize: 20 }}>⭐</div><div style={{ position: "absolute", top: 30, left: 30, fontSize: 12 }}>✨</div></>}
        {selectedBg.id === "forest" && <><div style={{ position: "absolute", top: 10, left: 10, fontSize: 30 }}>🌲</div><div style={{ position: "absolute", bottom: 20, right: 10, fontSize: 20 }}>🍄</div></>}
        {selectedBg.id === "ocean" && <><div style={{ position: "absolute", top: 10, right: 20, fontSize: 24 }}>🐚</div><div style={{ position: "absolute", top: 20, left: 30, fontSize: 16 }}>🐠</div></>}
        
        <div style={{ position: "absolute", bottom: playerState.y + 20, left: `${playerState.x}%`, transform: `scale(${playerState.scale}) rotate(${playerState.rotation || 0}deg)`, transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)", fontSize: 48, zIndex: 10, fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif', opacity: playerState.visible ? 1 : 0 }}>
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

      {/* Saved Notification */}
      {showSaved && (
        <div style={{ position: "fixed", top: 20, right: 20, background: C.green, color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 800, boxShadow: "0 8px 20px rgba(0,0,0,0.4)", zIndex: 100, animation: "slide-in 0.3s ease" }}>
          ✅ Game Saved!
        </div>
      )}

    </div>
  );
}