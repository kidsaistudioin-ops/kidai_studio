"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import { speak } from "@/lib/voice";

const C = {
  bg: "#07090f", card: "#0f1520", card2: "#161e30", border: "#1e2d45",
  orange: "#ff6b35", purple: "#7c3aed", cyan: "#06b6d4", green: "#10b981",
  yellow: "#f59e0b", pink: "#ec4899", text: "#f1f5f9", muted: "#64748b",
};

const BASE_CHARS = [
  { id: "lion", emoji: "🦁", name: "Simba", color: C.yellow },
  { id: "robot", emoji: "🤖", name: "Robo", color: C.cyan },
  { id: "ninja", emoji: "🥷", name: "Ninja", color: C.purple },
  { id: "wizard", emoji: "🧙", name: "Merlin", color: C.green },
];

const ANIMATIONS = [
  { id: "float2", name: "Floating", emoji: "😐", css: "float2 2s ease infinite" },
  { id: "jump2", name: "Jumping", emoji: "⬆️", css: "jump2 0.6s ease infinite" },
  { id: "spin2", name: "Spinning", emoji: "🌀", css: "spin2 1s linear infinite" },
  { id: "bounce2", name: "Bouncing", emoji: "🎾", css: "bounce2 0.5s ease infinite" },
];

const SIZES = [
  { id: "sm", label: "Small", px: 60 },
  { id: "md", label: "Normal", px: 80 },
  { id: "lg", label: "Big", px: 110 },
];

const SCENES = [
  { id: "forest", bg: "linear-gradient(180deg,#1a3a1a,#0a1f0a)", floor: "#1a3a1a", emojis: "🌲🌳🌿🍃", label: "Forest" },
  { id: "space", bg: "linear-gradient(180deg,#000033,#000011)", floor: "#000033", emojis: "⭐🌙✨💫", label: "Space" },
];

const LESSONS = [
  {
    title: "🌌 Magic Aura Banao!",
    desc: "Character ke peeche chamakta hua shadow (aura) lagate hain! Niche wala code CSS wale dabbe mein paste karo.",
    speakText: "Character ke peeche chamakta hua shadow lagate hain! Niche wala code C S S wale dabbe mein paste karo aur apna jadu dekho.",
    getCode: (cId) => `.${cId} {\n  font-size: 100px;\n  filter: drop-shadow(0 0 25px #06b6d4);\n  animation: float2 2s infinite;\n}`
  },
  {
    title: "💃 Naya Dance (Spin & Bada Hona)",
    desc: "Ab hum isko ek naya dance sikhayenge jo pehle nahi tha! Ye code dalo aur magic dekho.",
    speakText: "Ab hum isko ek naya dance sikhayenge jo pehle nahi tha! Ye code dalo aur character ka dance dekho.",
    getCode: (cId) => `@keyframes magicDance {\n  0% { transform: translateY(0) rotate(0deg) scale(1); }\n  50% { transform: translateY(-40px) rotate(180deg) scale(1.5); }\n  100% { transform: translateY(0) rotate(360deg) scale(1); }\n}\n\n.${cId} {\n  font-size: 80px;\n  animation: magicDance 2.5s infinite ease-in-out;\n}`
  },
  {
    title: "🦄 Naya Text Character",
    desc: "Tum apna khud ka naam bhi likh sakte ho! Pehle upar 'Character (Emoji/Text)' wale dabbe mein apna naam likho, fir CSS mein ye dalo:",
    speakText: "Tum apna khud ka naam bhi character bana sakte ho! Pehle upar H T M L wale dabbe mein apna naam likho, fir C S S mein ye style dalo.",
    getCode: (cId) => `.${cId} {\n  font-size: 26px;\n  font-weight: 800;\n  color: white;\n  background: linear-gradient(135deg, #ff6b35, #ec4899);\n  padding: 15px 30px;\n  border-radius: 25px;\n  box-shadow: 0 10px 20px rgba(236,72,153,0.4);\n  animation: bounce2 0.8s infinite;\n}`
  }
];

function Btn({ children, onClick, color = C.orange, ghost, small }) {
  return (
    <button onClick={onClick} style={{
      padding: small ? "8px 14px" : "12px 20px", borderRadius: 13,
      border: ghost ? `1.5px solid ${color}` : "none",
      background: ghost ? "transparent" : `linear-gradient(135deg,${color},${color}cc)`,
      color: ghost ? color : "#fff", fontSize: small ? 12 : 14, fontWeight: 800,
      cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6,
      boxShadow: ghost ? "none" : `0 4px 14px ${color}44`,
    }}>{children}</button>
  );
}

export default function CodeMagicPage() {
  const [charId, setCharId] = useState("lion");
  const [animId, setAnimId] = useState("float2");
  const [sizeId, setSizeId] = useState("md");
  const [sceneId, setSceneId] = useState("forest");
  const [playing, setPlaying] = useState(true);
  const [lessonId, setLessonId] = useState(0);

  // Code Playground States
  const char = BASE_CHARS.find((c) => c.id === charId) || BASE_CHARS[0];
  const anim = ANIMATIONS.find((a) => a.id === animId) || ANIMATIONS[0];
  const size = SIZES.find((s) => s.id === sizeId) || SIZES[1];
  const scene = SCENES.find((s) => s.id === sceneId) || SCENES[0];

  const cssCode = `/* AI Generated Code */
.character-${char.id} {
  font-size: ${size.px}px;
  animation: ${playing ? anim.css : "none"};
  display: inline-block;
}

@keyframes ${animId} {
  ${animId === "float2" ? "0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); }" :
      animId === "jump2" ? "0%,100% { transform: translateY(0) scaleX(1); } 40% { transform: translateY(-50px) scaleX(0.9); }" :
        animId === "spin2" ? "from { transform: rotate(0deg); } to { transform: rotate(360deg); }" :
          "0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.2) translateY(-10px); }"
    }
}`;

  const [testCSS, setTestCSS] = useState(cssCode);
  const [testHTML, setTestHTML] = useState(char.emoji);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, paddingBottom: 80 }}>
      <Header title="Code Magic 💻" showBack={true} onBack={() => window.history.back()} />

      <style>{`
        @keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes jump2{0%,100%{transform:translateY(0) scaleX(1)}40%{transform:translateY(-50px) scaleX(0.9)}}
        @keyframes spin2{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes bounce2{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.2) translateY(-10px)}}
      `}</style>

      <div style={{ padding: 16, maxWidth: 500, margin: "0 auto" }}>
        <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>🎨 Character Coder</div>
        <div style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>Dekho code se character kaise banta hai aur act karta hai!</div>

        {/* VISUAL CONTROLS */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16, marginBottom: 16 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>1. Character Chuno:</div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
              {BASE_CHARS.map(c => (
                <button key={c.id} onClick={() => { setCharId(c.id); setTestHTML(c.emoji); }} style={{
                  padding: "10px 14px", borderRadius: 12, border: `2px solid ${charId === c.id ? c.color : C.border}`,
                  background: charId === c.id ? c.color + "22" : C.card2, cursor: "pointer", fontSize: 24
                }}>
                  {c.emoji}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>2. Animation Chuno:</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {ANIMATIONS.map(a => (
                <button key={a.id} onClick={() => setAnimId(a.id)} style={{
                  padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
                  border: `1.5px solid ${animId === a.id ? C.orange : C.border}`,
                  background: animId === a.id ? C.orange + "22" : C.card2, color: animId === a.id ? C.orange : C.muted,
                }}>{a.emoji} {a.name}</button>
              ))}
            </div>
          </div>
          
          <Btn small ghost color={C.cyan} onClick={() => setTestCSS(cssCode)}>
            ⬇️ Code Generate Karo
          </Btn>
        </div>

    {/* 🤖 AI TUTOR - NEW GUIDED SCREEN SECTION */}
    <div style={{ background: `linear-gradient(135deg, ${C.card2}, #1e1b4b)`, border: `2px solid ${C.purple}`, borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: '0 8px 24px rgba(124, 58, 237, 0.15)' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div 
          style={{ fontSize: 36, cursor: 'pointer', filter: 'drop-shadow(0 0 10px rgba(6,182,212,0.6))', animation: 'float2 2s infinite' }} 
          onClick={() => speak(LESSONS[lessonId].speakText, { rate: 0.85, pitch: 1.3 })}
          title="Suno!"
        >
          🤖
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: C.cyan, display: 'flex', alignItems: 'center', gap: 6 }}>
              {LESSONS[lessonId].title}
              <span onClick={() => speak(LESSONS[lessonId].speakText, { rate: 0.85, pitch: 1.3 })} style={{ cursor: 'pointer', color: C.orange, fontSize: 11, background: C.orange+'22', padding: '3px 8px', borderRadius: 8, whiteSpace: 'nowrap' }}>🔊 Suno</span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
               <button disabled={lessonId === 0} onClick={() => setLessonId(p => p - 1)} style={{ background: C.border, border: 'none', color: '#fff', borderRadius: 6, padding: '4px 10px', cursor: lessonId === 0 ? 'not-allowed' : 'pointer', fontWeight: 800 }}>←</button>
               <span style={{ fontSize: 12, color: C.muted, alignSelf: 'center' }}>{lessonId + 1}/{LESSONS.length}</span>
               <button disabled={lessonId === LESSONS.length - 1} onClick={() => setLessonId(p => p + 1)} style={{ background: C.border, border: 'none', color: '#fff', borderRadius: 6, padding: '4px 10px', cursor: lessonId === LESSONS.length - 1 ? 'not-allowed' : 'pointer', fontWeight: 800 }}>→</button>
            </div>
          </div>
          <div style={{ fontSize: 13, color: C.text, marginBottom: 12, lineHeight: 1.5 }}>
            {LESSONS[lessonId].desc}
          </div>
          
          {/* Code Snippet Box */}
          <div style={{ background: '#0a0e18', padding: 12, borderRadius: 10, fontSize: 12, fontFamily: 'monospace', color: '#6ee7b7', position: 'relative', border: `1px solid ${C.border}`, overflowX: 'auto' }}>
             <pre style={{ margin: 0, whiteSpace: 'pre-wrap', paddingRight: 60 }}>{LESSONS[lessonId].getCode(`character-${charId}`)}</pre>
             <button 
               onClick={() => {
                 setTestCSS(LESSONS[lessonId].getCode(`character-${charId}`));
                 if(lessonId === 2) setTestHTML("KidAI Hacker! 🚀");
                 speak("Code paste ho gaya! Niche playground mein dekho.", { rate: 0.9, pitch: 1.2 });
               }} 
               style={{ position: 'absolute', top: 12, right: 12, background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`, border: 'none', color: '#fff', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 10px rgba(236,72,153,0.3)' }}>
               Paste 🪄
             </button>
          </div>
        </div>
      </div>
    </div>

        {/* 🛠️ CODE PLAYGROUND */}
        <div style={{ background: C.card2, border: `2px dashed ${C.purple}`, borderRadius: 16, padding: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.purple, marginBottom: 8 }}>🛠️ Live Code Playground</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>
            Upar se generate kiya hua code yahan aayega. Isme numbers (jaise <b>-12px</b> ya <b>360deg</b>) change karke dekho. Ya fir AI se naya CSS banwakar yahan paste karo!
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Input Side */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.cyan, marginBottom: 4 }}>Character (Emoji/Text)</div>
              <input
                value={testHTML}
                onChange={e => setTestHTML(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 24, textAlign: "center", outline: "none" }}
              />
            </div>
            
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.cyan, marginBottom: 4 }}>CSS Code (Edit Here)</div>
              <textarea
                value={testCSS}
                onChange={e => setTestCSS(e.target.value)}
                placeholder="Apna CSS code yahan paste karo..."
                style={{ width: "100%", height: 200, padding: "10px", borderRadius: 10, border: `1px solid ${C.border}`, background: "#0a0e18", color: "#6ee7b7", fontSize: 11, fontFamily: "monospace", resize: "none", outline: "none", whiteSpace: "pre-wrap" }}
              />
            </div>

            {/* Output Side */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                <span>👀 Live Result</span>
                <span style={{color: C.muted, cursor: "pointer"}} onClick={() => setSceneId(s => s === "forest" ? "space" : "forest")}>🔄 Scene badlo</span>
              </div>
              <div style={{ background: scene.bg, borderRadius: 12, height: 220, border: `1px solid ${C.border}`, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Yeh style tag input CSS ko live apply karega */}
                <style>{testCSS}</style>
                
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", fontSize: 28, opacity: 0.18, letterSpacing: 12, paddingTop: 8 }}>
                  {scene.emojis}
                </div>

                {/* Test Character Container */}
                <div className={`character-${char.id}`} style={{ position: "relative", zIndex: 1, filter: `drop-shadow(0 4px 12px ${char.color}88)` }}>
                  {testHTML}
                </div>
                
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 20, background: `${scene.floor}cc` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Learning Hint */}
        <div style={{ background: C.yellow + "18", border: `1px solid ${C.yellow}44`, borderRadius: 12, padding: 12, fontSize: 12, color: C.yellow, lineHeight: 1.7, marginTop: 16 }}>
          🌟 <strong>Bacchon ke liye Tip:</strong><br />
          Agar tum AI se kaho "Make this character jump very high", toh wo tumhe ek naya CSS code dega. Bas use copy karo aur upar wale black box me paste kardo!
        </div>

      </div>
    </div>
  );
}