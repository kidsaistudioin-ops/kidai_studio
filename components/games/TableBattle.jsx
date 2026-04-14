"use client";
import { useState, useEffect } from "react";

const C = {
  card: "#0f1520", card2: "#161e30", border: "#1e2d45",
  cyan: "#06b6d4", purple: "#7c3aed", green: "#10b981", red: "#ef4444",
  text: "#f1f5f9", muted: "#64748b",
};

function generateQuestions(count = 5) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    const a = Math.floor(Math.random() * 9) + 2; // 2-10
    const b = Math.floor(Math.random() * 9) + 2; // 2-10
    const answer = a * b;
    const options = new Set([answer]);
    while (options.size < 4) {
      const wrongAns = answer + (Math.floor(Math.random() * 10) - 5);
      if (wrongAns > 0 && wrongAns !== answer) {
        options.add(wrongAns);
      }
    }
    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);
    questions.push({
      question: `⚔️ ${a} × ${b} = ?`,
      options: shuffledOptions.map(String),
      correct: shuffledOptions.indexOf(answer),
      explanation: `The correct answer is ${answer} because ${a} times ${b} is ${answer}.`
    });
  }
  return questions;
}

export default function TableBattle({ onGameEnd = () => {} }) {
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setQuestions(generateQuestions(5));
  }, []);

  if (questions.length === 0) {
    return <div style={{ background: C.card, borderRadius: 18, padding: 16, textAlign: 'center', color: C.muted }}>Loading Battle...</div>;
  }

  const q = questions[idx];

  if (done) {
    return (
      <div style={{ background: C.card, borderRadius: 18, padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 12 }}>🏆</div>
        <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Battle Over!</div>
        <div style={{ color: C.muted, fontSize: 14, marginBottom: 16 }}>Your Score: {score}/{questions.length}</div>
        <button onClick={() => { setQuestions(generateQuestions(5)); setIdx(0); setPicked(null); setScore(0); setDone(false); onGameEnd(score); }}
          style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${C.cyan},${C.purple})`, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
          New Battle
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: C.cyan }}>Table Battle</div>
        <div style={{ fontSize: 13, color: C.muted }}>{idx + 1}/{questions.length}</div>
      </div>
      <div style={{ height: 6, background: C.border, borderRadius: 99, marginBottom: 14, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((idx + 1) / questions.length) * 100}%`, background: `linear-gradient(90deg,${C.cyan},${C.purple})`, borderRadius: 99, transition: "width .4s" }} />
      </div>
      <div style={{ background: C.card2, borderRadius: 14, padding: 16, marginBottom: 14, textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.6 }}>{q.question}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct;
          const isPicked = i === picked;
          return (
            <button key={i} onClick={() => { if (picked === null) { setPicked(i); if (isCorrect) setScore(s => s + 1); } }}
              style={{ padding: "16px", borderRadius: 12, fontFamily: "inherit", border: `2px solid ${picked === null ? C.border : isCorrect ? C.green : isPicked ? C.red : C.border}`, background: picked === null ? C.card2 : isCorrect ? C.green + "22" : isPicked ? C.red + "22" : C.card2, color: C.text, fontSize: 18, fontWeight: 700, cursor: picked === null ? "pointer" : "default", transition: "all .2s" }}>
              {picked !== null && isCorrect ? "✅ " : ""}{opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <button onClick={() => { if (idx + 1 >= questions.length) setDone(true); else { setIdx(i => i + 1); setPicked(null); } }}
          style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${C.cyan},${C.purple})`, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", marginTop: 8 }}>
          {idx + 1 >= questions.length ? "Finish Battle 🏆" : "Next →"}
        </button>
      )}
    </div>
  );
}
