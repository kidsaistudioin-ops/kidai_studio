"use client";
import { useState } from "react";

const C = {
  card: "#0f1520", card2: "#161e30", border: "#1e2d45",
  orange: "#ff6b35", purple: "#7c3aed", green: "#10b981", red: "#ef4444",
  text: "#f1f5f9", muted: "#64748b",
};

export default function QuizGame({ questions, title = "Quiz Game", onGameEnd = () => {} }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!questions || questions.length === 0) {
    return <div style={{ background: C.card, borderRadius: 18, padding: 16, textAlign: 'center', color: C.muted }}>Loading questions...</div>;
  }

  const q = questions[idx];

  if (done) {
    return (
      <div style={{ background: C.card, borderRadius: 18, padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 12 }}>🏆</div>
        <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Game Over!</div>
        <div style={{ color: C.muted, fontSize: 14, marginBottom: 16 }}>Your Score: {score}/{questions.length}</div>
        <button onClick={() => { setIdx(0); setPicked(null); setScore(0); setDone(false); onGameEnd(score); }}
          style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${C.purple},${C.orange})`, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: C.orange }}>{title}</div>
        <div style={{ fontSize: 13, color: C.muted }}>{idx + 1}/{questions.length}</div>
      </div>
      <div style={{ height: 6, background: C.border, borderRadius: 99, marginBottom: 14, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((idx + 1) / questions.length) * 100}%`, background: `linear-gradient(90deg,${C.orange},${C.purple})`, borderRadius: 99, transition: "width .4s" }} />
      </div>
      <div style={{ background: C.card2, borderRadius: 14, padding: 16, marginBottom: 14, textAlign: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.6 }}>{q.question}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct;
          const isPicked = i === picked;
          return (
            <button key={i} onClick={() => { if (picked === null) { setPicked(i); if (isCorrect) setScore(s => s + 1); } }}
              style={{ padding: "13px 16px", borderRadius: 12, fontFamily: "inherit", border: `2px solid ${picked === null ? C.border : isCorrect ? C.green : isPicked ? C.red : C.border}`, background: picked === null ? C.card2 : isCorrect ? C.green + "22" : isPicked ? C.red + "22" : C.card2, color: C.text, fontSize: 14, fontWeight: 700, cursor: picked === null ? "pointer" : "default", textAlign: "left", transition: "all .2s" }}>
              {picked !== null && isCorrect ? "✅ " : picked !== null && isPicked ? "❌ " : `${["A", "B", "C", "D"][i]}. `}{opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <>
          {q.explanation && <div style={{ background: C.purple + "18", border: `1px solid ${C.purple}44`, borderRadius: 12, padding: 12, marginBottom: 12, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>💡 {q.explanation}</div>}
          <button onClick={() => { if (idx + 1 >= questions.length) setDone(true); else { setIdx(i => i + 1); setPicked(null); } }}
            style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${C.orange},${C.purple})`, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
            {idx + 1 >= questions.length ? "Finish Game 🏆" : "Next Question →"}
          </button>
        </>
      )}
    </div>
  );
}
