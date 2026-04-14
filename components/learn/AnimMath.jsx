"use client";
import { useState } from "react";

const C = {
  card: "#0f1520", card2: "#161e30", border: "#1e2d45",
  orange: "#ff6b35", purple: "#7c3aed", cyan: "#06b6d4", green: "#10b981",
  red: "#ef4444", text: "#f1f5f9", muted: "#64748b",
};

const actionBtn = (color) => ({
  padding: "12px 16px", borderRadius: 12, border: "none",
  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
  color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer",
  boxShadow: `0 4px 16px ${color}44`,
});

const numBtn = {
  width: 36, height: 40, borderRadius: 10, border: `1px solid ${C.border}`,
  background: C.card, color: C.muted, fontSize: 18, fontWeight: 800, cursor: "pointer"
};

const FRUITS = ["🍎","🍊","🍋","🍇","🍓","🫐","🥭","🍍","🍌","🍉"];
const VEGGIES = ["🥕","🧅","🥦","🌽","🍆","🥔","🫛","🌶️","🥒","🧄"];
const OBJECTS = ["⭐","🔵","🟡","🔴","💎","🎯","🏀","⚽","🎾","🎱"];

export default function AnimMath({ onXP = () => {} }) {
  const [op, setOp] = useState("multiply");
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [icon, setIcon] = useState("🍎");
  const [iconSet, setIconSet] = useState("fruits");
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0); 
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [userAns, setUserAns] = useState("");
  const [feedback, setFeedback] = useState(null);

  const icons = iconSet === "fruits" ? FRUITS : iconSet === "veggies" ? VEGGIES : OBJECTS;

  const getResult = () => {
    if (op === "multiply") return a * b;
    if (op === "add") return a + b;
    if (op === "subtract") return Math.max(a, b) - Math.min(a, b);
    if (op === "divide") return Math.max(a, b) / Math.min(a, b);
    return 0;
  };

  const bigNum = op === "subtract" || op === "divide" ? Math.max(a, b) : a;
  const smallNum = op === "subtract" || op === "divide" ? Math.min(a, b) : b;
  const result = getResult();

  const play = () => {
    setPlaying(true); setStep(0); setShowAnswer(false); setAnswered(false); setFeedback(null); setUserAns("");
    let s = 0;
    const total = op === "multiply" ? smallNum : 1;
    const iv = setInterval(() => {
      s++;
      setStep(s);
      if (s >= total) {
        clearInterval(iv);
        setTimeout(() => setShowAnswer(true), 400);
      }
    }, op === "multiply" ? 600 : 400);
  };

  const check = () => {
    const correct = parseInt(userAns) === result;
    setFeedback(correct ? "correct" : "wrong");
    if (correct && !answered) {
      onXP(15);
      setAnswered(true);
    }
  };

  const randomize = () => {
    const ops = ["multiply", "add", "subtract"];
    const newOp = ops[Math.floor(Math.random() * ops.length)];
    setOp(newOp);
    setA(Math.floor(Math.random() * 7) + 2);
    setB(Math.floor(Math.random() * 7) + 2);
    setIcon(icons[Math.floor(Math.random() * icons.length)]);
    setPlaying(false); setStep(0); setShowAnswer(false); setAnswered(false); setFeedback(null); setUserAns("");
  };

  const opSymbol = { multiply: "×", add: "+", subtract: "−", divide: "÷" };
  const opLabel = { multiply: "Multiplication", add: "Addition", subtract: "Subtraction", divide: "Division" };

  return (
    <div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
        {Object.keys(opSymbol).map(o => (
          <button key={o} onClick={() => { setOp(o); setPlaying(false); setStep(0); setShowAnswer(false); setFeedback(null); }}
            style={{ padding:"6px 14px", borderRadius:10, border:`1.5px solid ${op===o ? C.cyan : C.border}`, background:op===o ? C.cyan+"22" : C.card2, color:op===o ? C.cyan : C.muted, fontSize:13, fontWeight:700, cursor:"pointer" }}>
            {opSymbol[o]} {opLabel[o].split(" ")[0]}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <div style={{ fontSize:11, color:C.muted, fontWeight:700 }}>Number 1</div>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={() => setA(Math.max(1,a-1))} style={numBtn}>−</button>
            <div style={{ width:44, height:40, borderRadius:10, background:C.card2, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:18 }}>{a}</div>
            <button onClick={() => setA(Math.min(10,a+1))} style={numBtn}>+</button>
          </div>
        </div>
        <div style={{ fontSize:28, fontWeight:800, color:C.orange, marginTop:16 }}>{opSymbol[op]}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <div style={{ fontSize:11, color:C.muted, fontWeight:700 }}>Number 2</div>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={() => setB(Math.max(1,b-1))} style={numBtn}>−</button>
            <div style={{ width:44, height:40, borderRadius:10, background:C.card2, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:18 }}>{b}</div>
            <button onClick={() => setB(Math.min(10,b+1))} style={numBtn}>+</button>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <div style={{ fontSize:11, color:C.muted, fontWeight:700 }}>Icon</div>
          <div style={{ display:"flex", gap:6 }}>
            {[["fruits","🍎"],["veggies","🥕"],["objects","⭐"]].map(([k,em]) => (
              <button key={k} onClick={() => { setIconSet(k); setIcon(icons[0]); }}
                style={{ padding:"8px 10px", borderRadius:10, border:`1.5px solid ${iconSet===k ? C.orange : C.border}`, background:iconSet===k ? C.orange+"22" : C.card2, fontSize:18, cursor:"pointer" }}>{em}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background:"#0a1020", borderRadius:18, padding:16, marginBottom:14, minHeight:180, position:"relative", overflow:"hidden" }}>
        {!playing && !showAnswer && (
          <div style={{ textAlign:"center", padding:"30px 0" }}>
            <div style={{ fontSize:48, marginBottom:8 }}>👆</div>
            <div style={{ color:C.muted, fontSize:14 }}>Neeche button dabao — dekho kaise banta hai!</div>
          </div>
        )}

        {playing && op === "multiply" && (
          <div>
            {Array.from({ length: smallNum }, (_, row) => (
              <div key={row} style={{
                display:"flex", gap:6, marginBottom:8, flexWrap:"wrap",
                opacity: row < step ? 1 : 0, transform: row < step ? "translateX(0)" : "translateX(-20px)", transition: "all 0.4s ease"
              }}>
                {Array.from({ length: bigNum }, (_, col) => (
                  <div key={col} style={{ fontSize:24, display:"inline-block" }}>{icon}</div>
                ))}
              </div>
            ))}
          </div>
        )}

        {showAnswer && (
          <div style={{ marginTop:16, textAlign:"center", background:`linear-gradient(135deg,${C.green}22,${C.cyan}11)`, borderRadius:14, padding:16, border:`1px solid ${C.green}44` }}>
            <div style={{ fontSize:22, fontWeight:800 }}>
              {a} {opSymbol[op]} {b} = <span style={{ color:C.green, fontSize:32 }}>{result}</span>
            </div>
          </div>
        )}
      </div>

      {showAnswer && !feedback && (
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:8 }}>Ab tum batao: {a} {opSymbol[op]} {b} = ?</div>
          <div style={{ display:"flex", gap:8 }}>
            <input value={userAns} onChange={e=>setUserAns(e.target.value)} onKeyDown={e=>e.key==="Enter"&&check()}
              placeholder="Jawab likho..."
              style={{ flex:1, padding:"11px 14px", borderRadius:12, border:`1.5px solid ${C.border}`, background:C.card2, color:C.text, fontSize:16, fontWeight:700, outline:"none", fontFamily:"inherit" }} />
            <button onClick={check} style={{ ...actionBtn(C.green) }}>✓</button>
          </div>
        </div>
      )}

      <div style={{ display:"flex", gap:8 }}>
        <button onClick={play} style={{ ...actionBtn(C.orange), flex:2 }}>▶ Dekho Kaise Banta Hai!</button>
        <button onClick={randomize} style={{ ...actionBtn(C.purple), flex:1 }}>🎲 Random</button>
      </div>
    </div>
  );
}
