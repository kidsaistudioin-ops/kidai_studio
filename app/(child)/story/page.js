"use client";

import { useState, useEffect, useCallback } from "react";
import { speak as voiceSpeak, stopSpeaking, isSupported } from "@/lib/voice";

const C = {
  bg:"#07090f", card:"#0f1520", card2:"#161e30", border:"#1e2d45",
  orange:"#ff6b35", purple:"#7c3aed", cyan:"#06b6d4", green:"#10b981",
  yellow:"#f59e0b", pink:"#ec4899", text:"#f1f5f9", muted:"#64748b",
};

// ══════════════════════════════════════
// CHARACTER SYSTEM
// ══════════════════════════════════════
const BASE_CHARS = [
  { id:"lion",   emoji:"🦁", name:"Simba",  color:C.yellow },
  { id:"robot",  emoji:"🤖", name:"Robo",   color:C.cyan   },
  { id:"ninja",  emoji:"🥷", name:"Ninja",  color:C.purple },
  { id:"wizard", emoji:"🧙", name:"Merlin", color:C.green  },
  { id:"alien",  emoji:"👾", name:"Zorg",   color:C.pink   },
  { id:"hero",   emoji:"🦸", name:"Arjun",  color:C.orange },
  { id:"fairy",  emoji:"🧚", name:"Priya",  color:C.pink   },
  { id:"dragon", emoji:"🐉", name:"Blaze",  color:C.orange },
];

const ANIMATIONS = [
  { id:"idle",     name:"Floating",   emoji:"😐", css:"float2 2s ease infinite" },
  { id:"jump",     name:"Jumping",    emoji:"⬆️", css:"jump2 0.6s ease infinite" },
  { id:"spin",     name:"Spinning",   emoji:"🌀", css:"spin2 1s linear infinite" },
  { id:"bounce",   name:"Bouncing",   emoji:"🎾", css:"bounce2 0.5s ease infinite" },
  { id:"shake",    name:"Shaking",    emoji:"😱", css:"shake2 0.3s ease infinite" },
  { id:"wave",     name:"Waving",     emoji:"👋", css:"wave2 1s ease infinite" },
  { id:"dance",    name:"Dancing",    emoji:"💃", css:"dance2 0.8s ease infinite" },
  { id:"attack",   name:"Attacking",  emoji:"⚔️", css:"attack2 0.4s ease infinite" },
];

const SIZES = [
  { id:"xs", label:"Tiny",   px:40 },
  { id:"sm", label:"Small",  px:60 },
  { id:"md", label:"Normal", px:80 },
  { id:"lg", label:"Big",    px:110},
  { id:"xl", label:"Giant",  px:140},
];

const SCENES = [
  { id:"forest",   bg:"linear-gradient(180deg,#1a3a1a,#0a1f0a)", floor:"#1a3a1a", emojis:"🌲🌳🌿🍃", label:"Forest" },
  { id:"space",    bg:"linear-gradient(180deg,#000033,#000011)", floor:"#000033", emojis:"⭐🌙✨💫", label:"Space"  },
  { id:"ocean",    bg:"linear-gradient(180deg,#003355,#001122)", floor:"#003355", emojis:"🌊🐠🐚🐋", label:"Ocean"  },
  { id:"city",     bg:"linear-gradient(180deg,#111122,#050510)", floor:"#111122", emojis:"🏙️🌆🌉🏢", label:"City"   },
  { id:"desert",   bg:"linear-gradient(180deg,#3a2205,#1a1002)", floor:"#3a2205", emojis:"🏜️🌵🐪☀️", label:"Desert" },
  { id:"snow",     bg:"linear-gradient(180deg,#1a2a3a,#0a1525)", floor:"#1a2a3a", emojis:"❄️⛄🌨️🏔️", label:"Snow"   },
];

// ══════════════════════════════════════
// WEB SPEECH API (FREE TTS)
// ══════════════════════════════════════
function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(isSupported());
  }, []);

  const speak = useCallback((text, opts = {}) => {
    if (!supported) return;
    voiceSpeak(text, {
      ...opts,
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false)
    });
  }, [supported]);

  const stop = useCallback(() => {
    stopSpeaking();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, supported };
}

// ══════════════════════════════════════
// HELPER UI
// ══════════════════════════════════════
function Btn({ children, onClick, color=C.orange, ghost, full, small, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding:small?"8px 14px":"12px 20px", borderRadius:13,
      border:ghost?`1.5px solid ${color}`:"none",
      background:ghost?"transparent":`linear-gradient(135deg,${color},${color}cc)`,
      color:ghost?color:"#fff", fontSize:small?12:14, fontWeight:800,
      cursor:disabled?"not-allowed":"pointer", fontFamily:"inherit",
      width:full?"100%":"auto", opacity:disabled?0.5:1,
      display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6,
      boxShadow:ghost?"none":`0 4px 16px ${color}44`,
    }}>{children}</button>
  );
}

// ══════════════════════════════════════
// 1. CHARACTER ANIMATION BUILDER
// ══════════════════════════════════════
function CharacterBuilder({ onUseInStory }) {
  const [charId, setCharId] = useState("lion");
  const [animId, setAnimId] = useState("idle");
  const [sizeId, setSizeId] = useState("md");
  const [sceneId, setSceneId] = useState("forest");
  const [showCode, setShowCode] = useState(false);
  const [playing, setPlaying] = useState(true);

  const char = BASE_CHARS.find(c=>c.id===charId) || BASE_CHARS[0];
  const anim = ANIMATIONS.find(a=>a.id===animId) || ANIMATIONS[0];
  const size = SIZES.find(s=>s.id===sizeId) || SIZES[2];
  const scene = SCENES.find(s=>s.id===sceneId) || SCENES[0];

  const cssCode = `/* ${char.name} ka animation code */
.character-${char.id} {
  font-size: ${size.px}px;
  animation: ${playing ? anim.css : "none"};
  display: inline-block;
  cursor: pointer;
}

@keyframes ${animId} {
  /* ${anim.name} animation */
  ${animId==="float2" ? "0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); }" :
    animId==="jump2" ? "0%,100% { transform: translateY(0) scaleX(1); } 40% { transform: translateY(-50px) scaleX(0.9); }" :
    animId==="spin2" ? "from { transform: rotate(0deg); } to { transform: rotate(360deg); }" :
    animId==="bounce2" ? "0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.2) translateY(-10px); }" :
    animId==="shake2" ? "0%,100% { transform: rotate(0deg); } 25% { transform: rotate(-8deg); } 75% { transform: rotate(8deg); }" :
    animId==="wave2" ? "0%,100% { transform: rotate(0deg); } 25% { transform: rotate(20deg); } 75% { transform: rotate(-10deg); }" :
    animId==="dance2" ? "0%,100% { transform: translateX(0) rotate(0); } 33% { transform: translateX(-8px) rotate(-5deg); } 66% { transform: translateX(8px) rotate(5deg); }" :
    "0%,100% { transform: scale(1) rotate(0); } 50% { transform: scale(1.3) rotate(-15deg); }"
  }
}`;

  return (
    <div>
      <div style={{ fontWeight:800, fontSize:20, marginBottom:4 }}>🎨 Character Builder</div>
      <div style={{ color:C.muted, fontSize:13, marginBottom:16 }}>Apna character banao, animation add karo, code dekho!</div>

      {/* STAGE */}
      <div style={{
        background:scene.bg, borderRadius:20, minHeight:220, padding:16, marginBottom:16,
        border:`2px solid ${char.color}44`, position:"relative", overflow:"hidden",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"
      }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, textAlign:"center", fontSize:28, opacity:0.18, letterSpacing:12, paddingTop:8 }}>
          {scene.emojis}
        </div>
        <div style={{
          fontSize:size.px, display:"inline-block",
          animation:playing ? anim.css : "none",
          filter:`drop-shadow(0 4px 12px ${char.color}88)`,
          position:"relative", zIndex:1,
        }}>
          {char.emoji}
        </div>
        <div style={{ marginTop:8, background:"rgba(0,0,0,0.5)", borderRadius:99, padding:"4px 14px", fontSize:12, fontWeight:700, color:"#fff", zIndex:1 }}>
          {char.name} • {anim.emoji} {anim.name}
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:24, background:`${scene.floor}cc`, borderRadius:"0 0 18px 18px" }} />
      </div>

      {/* CHAR PICKER */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:11, color:C.muted, fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Character:</div>
        <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4 }}>
          {BASE_CHARS.map(c => (
            <button key={c.id} onClick={() => setCharId(c.id)} style={{
              flexShrink:0, padding:"10px 12px", borderRadius:12,
              border:`2px solid ${charId===c.id ? c.color : C.border}`,
              background:charId===c.id ? c.color+"22" : C.card2,
              cursor:"pointer", textAlign:"center", minWidth:64
            }}>
              <div style={{ fontSize:28 }}>{c.emoji}</div>
              <div style={{ fontSize:9, color:charId===c.id ? c.color : C.muted, marginTop:2, fontWeight:700 }}>{c.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        <Btn onClick={() => setPlaying(p=>!p)} color={playing ? C.pink : C.green} ghost small>
          {playing ? "⏸ Roko" : "▶ Chalao"}
        </Btn>
        <Btn onClick={() => setShowCode(c=>!c)} color={C.purple} ghost small>
          {showCode ? "👁 Preview" : "💻 Code Dekho"}
        </Btn>
        <Btn onClick={() => onUseInStory(char)} color={C.orange} small>
          📖 Story Mein Use Karo
        </Btn>
      </div>

      {/* CODE REVEAL */}
      {showCode && (
        <div>
          <div style={{ background:"#0a0e18", borderRadius:14, padding:14, marginBottom:10 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.cyan, marginBottom:8, display:"flex", justifyContent:"space-between" }}>
              <span>💻 CSS Code (yahi kaam karta hai!)</span>
              <span style={{ color:C.green }}>✅ Real Code</span>
            </div>
            <pre style={{ fontSize:11, color:"#6ee7b7", overflowX:"auto", whiteSpace:"pre-wrap", lineHeight:1.6 }}>{cssCode}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════
// 2. STORY ENGINE
// ══════════════════════════════════════
function StoryEngine({ defaultChar }) {
  const [phase, setPhase] = useState("input"); // input|loading|play|done
  const [topic, setTopic] = useState("");
  const [charId, setCharId] = useState(defaultChar?.id || "lion");
  const [story, setStory] = useState(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [error, setError] = useState(null);
  const tts = useTTS();

  const char = BASE_CHARS.find(c=>c.id===charId) || BASE_CHARS[0];

  const MOOD_EXPR = {
    happy:"😊", excited:"🤩", sad:"😢", scared:"😱",
    angry:"😤", thinking:"🤔", neutral:"😐",
  };

  const MOOD_ANIM = {
    happy:"bounce2", excited:"jump2", sad:"shake2", scared:"shake2",
    angry:"attack2", thinking:"float2", neutral:"float2",
  };

  const generate = async () => {
    if (!topic.trim()) return;
    setPhase("loading"); setError(null);
    try {
      const res = await fetch("/api/ai/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, characterName: char.name, age: 11 })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStory(data);
      setSlideIdx(0);
      setPhase("play");
    } catch(e) {
      setError("Story generate nahi hui: " + e.message);
      setPhase("input");
    }
  };

  const slide = story?.slides?.[slideIdx];
  const scene = slide ? (SCENES.find(s=>s.id===slide.scene) || SCENES[0]) : null;
  const moodEmoji = slide ? (MOOD_EXPR[slide.mood] || "😐") : "😐";
  const moodAnim = slide ? (MOOD_ANIM[slide.mood] || "float2") : "float2";

  useEffect(() => {
    if (phase === "play" && slide?.narration) {
      const t = setTimeout(() => tts.speak(slide.narration), 600);
      return () => { clearTimeout(t); tts.stop(); };
    }
  }, [slideIdx, phase]);

  // Input phase
  if (phase === "input") return (
    <div>
      <div style={{ fontWeight:800, fontSize:20, marginBottom:4 }}>📖 Story Studio</div>
      <div style={{ color:C.muted, fontSize:13, marginBottom:16 }}>AI se story banao — animated + voice ke saath!</div>

      <textarea value={topic} onChange={e=>setTopic(e.target.value)} rows={4}
        placeholder={"Idea likho:\n• 'Ek sher tha jo school nahi jaana chahta'\n• 'Photosynthesis ke baare mein'"}
        style={{ width:"100%", padding:"12px 14px", borderRadius:14, border:`1.5px solid ${C.border}`, background:C.card2, color:C.text, fontSize:14, fontFamily:"inherit", resize:"none", outline:"none", marginBottom:12, lineHeight:1.6 }} />

      {error && <div style={{ background:"#ef444418", border:`1px solid ${C.red}44`, borderRadius:12, padding:12, marginBottom:14, fontSize:13, color:C.red }}>{error}</div>}

      <Btn full onClick={generate} disabled={!topic.trim()} color={C.purple}>
        ✨ Story Banao + Voice Ke Saath!
      </Btn>
    </div>
  );

  // Loading
  if (phase === "loading") return (
    <div style={{ textAlign:"center", padding:"48px 0" }}>
      <div style={{ fontSize:64, marginBottom:12, display:"inline-block", animation:"spin2 1.5s linear infinite" }}>{char.emoji}</div>
      <div style={{ fontWeight:800, fontSize:18, marginBottom:8 }}>Story ban rahi hai...</div>
      <div style={{ color:C.muted, fontSize:14 }}>Haiku AI character ko life de raha hai! ✨</div>
    </div>
  );

  // Play
  if (phase === "play" && story && slide) return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ fontWeight:800, fontSize:16, color:C.text }}>{story.title}</div>
        <div style={{ fontSize:12, color:C.muted }}>{slideIdx + 1} / {story.slides.length}</div>
      </div>

      <div style={{
        background:scene.bg, borderRadius:20, minHeight:260, padding:16, marginBottom:16,
        border:`2px solid ${C.border}`, position:"relative", overflow:"hidden",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"
      }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, textAlign:"center", fontSize:32, opacity:0.15, letterSpacing:16, paddingTop:12 }}>
          {scene.emojis}
        </div>
        <div style={{
          fontSize:100, display:"inline-block",
          animation:moodAnim,
          filter:`drop-shadow(0 6px 16px ${char.color}88)`,
          position:"relative", zIndex:1, marginTop:20
        }}>
          {char.emoji}
          <div style={{ position:"absolute", top:-10, right:-10, fontSize:36, background:"#fff", borderRadius:"50%", padding:2, boxShadow:"0 2px 8px rgba(0,0,0,0.2)" }}>
            {moodEmoji}
          </div>
        </div>
        
        {slide.dialogue && (
          <div style={{
            position:"absolute", top:20, right:20, maxWidth:"50%",
            background:"#fff", color:"#000", padding:"10px 14px", borderRadius:"16px 16px 0 16px",
            fontSize:13, fontWeight:800, boxShadow:"0 4px 12px rgba(0,0,0,0.3)", zIndex:2
          }}>
            {slide.dialogue}
          </div>
        )}
        
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:32, background:`${scene.floor}ee`, borderRadius:"0 0 18px 18px" }} />
      </div>

      <div style={{ background:C.card2, borderRadius:16, padding:16, marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
          <div style={{ fontSize:24, animation:tts.speaking ? "pulse 1s infinite" : "none" }}>🔊</div>
          <div style={{ fontSize:15, lineHeight:1.6, color:C.text }}>
            {slide.narration}
          </div>
        </div>
      </div>

      {slide.learningPoint && (
        <div style={{ background:`linear-gradient(135deg, ${C.cyan}11, ${C.purple}11)`, border:`1px solid ${C.cyan}33`, borderRadius:14, padding:14, marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ fontSize:24 }}>💡</div>
          <div style={{ fontSize:13, color:C.cyan, fontWeight:700 }}>{slide.learningPoint}</div>
        </div>
      )}

      <div style={{ display:"flex", gap:10, justifyContent:"space-between", alignItems:"center" }}>
        <Btn onClick={() => { tts.stop(); setPhase("input"); }} color={C.muted} ghost small>❌ Chhod Do</Btn>
        <div style={{ display:"flex", gap:8 }}>
          <Btn onClick={() => { if(slideIdx > 0) { tts.stop(); setSlideIdx(s=>s-1); } }} color={C.card2} disabled={slideIdx === 0} small>← Peeche</Btn>
          <Btn onClick={() => {
            tts.stop();
            if (slideIdx < story.slides.length - 1) setSlideIdx(s=>s+1);
            else setPhase("done");
          }} color={C.orange}>
            {slideIdx < story.slides.length - 1 ? "Aage Bado →" : "Kahani Khatam 🏁"}
          </Btn>
        </div>
      </div>
    </div>
  );

  // Done Phase
  if (phase === "done") return (
    <div style={{ textAlign:"center", padding:"30px 10px" }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🌟</div>
      <div style={{ fontWeight:800, fontSize:22, marginBottom:12, color:C.text }}>Kahani Khatam!</div>
      
      {story.moral && (
        <div style={{ background:C.card2, borderRadius:16, padding:20, marginBottom:24 }}>
          <div style={{ fontSize:12, fontWeight:800, color:C.orange, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Aaj Ki Seekh</div>
          <div style={{ fontSize:16, color:C.text, lineHeight:1.5 }}>"{story.moral}"</div>
        </div>
      )}

      <Btn onClick={() => { tts.stop(); setTopic(""); setStory(null); setPhase("input"); }} full color={C.green}>
        ✨ Ek Aur Nayi Story Banao!
      </Btn>
    </div>
  );

  return null;
}

export default function StoryPage() {
  const [char, setChar] = useState(null);
  
  return (
    <div style={{ fontFamily:"'Nunito','Segoe UI',sans-serif", background:C.bg, color:C.text, minHeight:"100vh", maxWidth:500, margin:"0 auto", paddingBottom:100 }}>
      <style>{`
        @keyframes float2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes jump2 { 0%,100% { transform: translateY(0) scaleX(1); } 40% { transform: translateY(-50px) scaleX(0.9); } }
        @keyframes spin2 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce2 { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.2) translateY(-10px); } }
        @keyframes shake2 { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(-8deg); } 75% { transform: rotate(8deg); } }
        @keyframes wave2 { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(20deg); } 75% { transform: rotate(-10deg); } }
        @keyframes dance2 { 0%,100% { transform: translateX(0) rotate(0); } 33% { transform: translateX(-8px) rotate(-5deg); } 66% { transform: translateX(8px) rotate(5deg); } }
        @keyframes attack2 { 0%,100% { transform: scale(1) rotate(0); } 50% { transform: scale(1.3) rotate(-15deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:${C.purple};border-radius:10px;}
      `}</style>
      
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(7,9,15,.97)", backdropFilter:"blur(16px)", borderBottom:`1px solid ${C.border}`, padding:"16px", display:"flex", alignItems:"center" }}>
        <div style={{ fontWeight:800, fontSize:18 }}>Story <span style={{color:C.orange}}>Engine</span> 📖</div>
      </div>

      <div style={{ padding:16 }}>
        {!char ? (
          <CharacterBuilder onUseInStory={(c) => setChar(c)} />
        ) : (
          <div>
            <button onClick={() => setChar(null)} style={{ background:"transparent", border:"none", color:C.muted, marginBottom:16, cursor:"pointer", fontWeight:700 }}>← Change Character</button>
            <StoryEngine defaultChar={char} />
          </div>
        )}
      </div>
    </div>
  );
}