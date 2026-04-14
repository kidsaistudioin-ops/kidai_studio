"use client";
import { useState } from "react";

const C = {
  card2: "#161e30", border: "#1e2d45", pink: "#ec4899", green: "#10b981",
  yellow: "#f59e0b", red: "#ef4444", text: "#f1f5f9", muted: "#64748b", dim: "#334155"
};

const actionBtn = (color) => ({
  padding: "12px 16px", borderRadius: 12, border: "none",
  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
  color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer",
  boxShadow: `0 4px 16px ${color}44`,
});

export default function ScienceVisual({ onXP = () => {} }) {
  const [scene, setScene] = useState("water-cycle");
  const [activeStep, setActiveStep] = useState(-1);
  const [quizDone, setQuizDone] = useState(false);
  const [picked, setPicked] = useState(null);

  const scenes = {
    "water-cycle": {
      title: "💧 Water Cycle — Paani Ka Safar",
      steps: ["☀️ Sun se heat milti hai", "💧 Paani evaporate hota hai", "☁️ Clouds bante hain", "🌧️ Barish hoti hai", "🏔️ Paani wapas aata hai"],
      fact: "Yahi paani baar baar cycle karta rehta hai — earth pe paani na zyada hota hai na kam!",
      quiz: "Clouds kaise bante hain?", ans: "Paani evaporate hoke", opts: ["Barish se", "Paani evaporate hoke", "Sun se", "Wind se"], correct: 1
    }
  };

  const sc = scenes[scene];

  const autoPlay = () => {
    setActiveStep(-1); setQuizDone(false); setPicked(null);
    let i = 0;
    const iv = setInterval(() => { setActiveStep(i); i++; if (i >= sc.steps.length) clearInterval(iv); }, 700);
  };

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 15, color: C.pink, marginBottom: 12 }}>{sc.title}</div>
      <div style={{ background: "#0a1020", borderRadius: 16, padding: 14, marginBottom: 14 }}>
        {sc.steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, marginBottom: 6, background: activeStep >= i ? C.pink + "18" : C.card2, opacity: activeStep >= i ? 1 : 0.3, transition: "all 0.4s ease" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: activeStep >= i ? C.pink : C.dim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>{i + 1}</div>
            <div style={{ fontSize: 14, color: C.text }}>{s}</div>
          </div>
        ))}
      </div>

      {activeStep >= sc.steps.length - 1 && !quizDone && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: C.text }}>🎯 {sc.quiz}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sc.opts.map((opt, i) => (
              <button key={i} onClick={() => { if (picked !== null) return; setPicked(i); if (i === sc.correct) { onXP(15); setQuizDone(true); } }} style={{ padding: "12px 14px", borderRadius: 12, border: `2px solid ${picked === null ? C.border : i === sc.correct ? C.green : picked === i ? C.red : C.border}`, background: picked === null ? C.card2 : i === sc.correct ? C.green + "22" : picked === i ? C.red + "22" : C.card2, color: C.text, fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "left" }}>
                {picked !== null && i === sc.correct ? "✅ " : picked === i ? "❌ " : "○ "}{opt}
              </button>
            ))}
          </div>
        </div>
      )}
      <button onClick={autoPlay} style={{ ...actionBtn(C.pink), width: "100%" }}>▶ Animation Chalao!</button>
    </div>
  );
}