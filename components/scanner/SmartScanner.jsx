"use client";

import { useState, useRef, useCallback } from "react";

const C = {
  bg:"#07090f", card:"#0f1520", card2:"#161e30", border:"#1e2d45",
  orange:"#ff6b35", purple:"#7c3aed", cyan:"#06b6d4", green:"#10b981",
  yellow:"#f59e0b", pink:"#ec4899", red:"#ef4444", blue:"#3b82f6",
  text:"#f1f5f9", muted:"#64748b",
};

// ══════════════════════════════════════
// CLAUDE API — Smart Scanner
// ══════════════════════════════════════
async function callClaude({ system, prompt, images = [] }) {
  const content = [];
  images.forEach(b64 => {
    content.push({ type:"image", source:{ type:"base64", media_type:"image/jpeg", data:b64 } });
  });
  content.push({ type:"text", text: prompt });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      model:"claude-haiku-4-5-20251001",
      max_tokens:1500,
      system,
      messages:[{ role:"user", content }],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const raw = data.content?.map(b=>b.text||"").join("").trim();
  return JSON.parse(raw.replace(/```json|```/g,"").trim());
}

// ══════════════════════════════════════
// SYSTEM PROMPTS
// ══════════════════════════════════════
const SYSTEMS = {
  homework: `You are Arya, an AI tutor for Indian students (age 9-15). 
Extract ALL questions/problems from the provided homework images.
Convert each into a fun interactive game question.
Respond in JSON only — no markdown, no extra text.`,

  book: `You are Arya, an AI tutor for Indian school students.
Analyze the book/textbook page image and extract key concepts.
Create a lesson with simple explanation, examples, and quiz questions.
Use Hinglish (Hindi+English mix). Be encouraging and fun.
Respond in JSON only — no markdown.`,

  problem: `You are Arya, an expert problem solver for Indian school students.
Analyze the problem in the image and provide a clear step-by-step solution.
Show your work clearly. Use simple language (Hinglish OK).
Connect to real life where possible.
Respond in JSON only — no markdown.`,
};

const PROMPTS = {
  homework: (age, subject) =>
    `Student age: ${age}yr. Subject hint: ${subject||"auto-detect"}.
Extract ALL questions from ALL ${true} images provided.
For EACH question create a game version.
Random seed: ${Math.random().toString(36).slice(2,6)}
Return JSON:
{
  "subject": "detected subject",
  "totalFound": 5,
  "gameTitle": "fun title",
  "questions": [
    {
      "original": "original question text",
      "gameQ": "fun game version",
      "opts": ["A","B","C","D"],
      "correct": 0,
      "explain": "fun Hinglish explanation",
      "emoji": "🔢",
      "difficulty": "easy|medium|hard"
    }
  ],
  "estimatedTime": "15 min",
  "reward": "completion message"
}`,

  book: (topic) =>
    `Topic hint: ${topic||"auto-detect from image"}.
Extract the main concept from this book page.
Return JSON:
{
  "chapter": "chapter/topic name",
  "mainConcept": "1 line summary",
  "keyPoints": ["point1","point2","point3"],
  "simpleExplanation": "explain like I'm 10, in Hinglish, 3-4 sentences",
  "realLifeExample": "relatable Indian example",
  "rememberTrick": "memory trick or shortcut",
  "quiz": [
    { "q":"question","opts":["A","B","C","D"],"correct":0,"explain":"why" }
  ],
  "funFact": "interesting related fact"
}`,

  problem: (subject) =>
    `Subject: ${subject||"auto-detect"}.
Solve the problem shown in the image step by step.
Return JSON:
{
  "problemType": "type of problem",
  "subject": "Math/Science/etc",
  "difficulty": "easy|medium|hard",
  "answer": "final answer",
  "steps": [
    { "stepNo": 1, "title": "Step naam", "work": "calculation/reasoning", "explain": "kyun? in simple Hinglish" }
  ],
  "shortcut": "faster way if exists",
  "commonMistake": "common error students make",
  "similarProblem": "ek aur example question",
  "realWorld": "real life connection"
}`,
};

// ══════════════════════════════════════
// IMAGE UTILS
// ══════════════════════════════════════
function fileToB64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => res(e.target.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ══════════════════════════════════════
// PHOTO CAPTURE COMPONENT
// ══════════════════════════════════════
function PhotoCapture({ photos, onAdd, onRemove, maxPhotos = 5, label = "Photo Lo", hint = "" }) {
  const inputRef = useRef(null);

  return (
    <div>
      {/* Photo grid */}
      {photos.length > 0 && (
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
          {photos.map((p, i) => (
            <div key={i} style={{ position:"relative", width:80, height:80 }}>
              <img src={`data:image/jpeg;base64,${p.b64}`} alt={`photo ${i+1}`}
                style={{ width:80, height:80, borderRadius:12, objectFit:"cover", border:`2px solid ${C.orange}` }} />
              <button onClick={() => onRemove(i)} style={{
                position:"absolute", top:-6, right:-6, width:22, height:22, borderRadius:"50%",
                background:C.red, border:"none", color:"#fff", fontSize:12, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800
              }}>✕</button>
              <div style={{ position:"absolute", bottom:4, left:4, background:"rgba(0,0,0,0.7)", borderRadius:6, padding:"1px 6px", fontSize:10, color:"#fff" }}>
                #{i+1}
              </div>
            </div>
          ))}

          {/* Add more button */}
          {photos.length < maxPhotos && (
            <button onClick={() => inputRef.current?.click()} style={{
              width:80, height:80, borderRadius:12, border:`2px dashed ${C.orange}`,
              background:C.orange+"11", cursor:"pointer", display:"flex",
              flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2
            }}>
              <span style={{ fontSize:22 }}>➕</span>
              <span style={{ fontSize:9, color:C.orange, fontWeight:700 }}>Add</span>
            </button>
          )}
        </div>
      )}

      {/* Initial add button */}
      {photos.length === 0 && (
        <div onClick={() => inputRef.current?.click()} style={{
          border:`2px dashed ${C.orange}`, borderRadius:18, padding:"28px 16px",
          textAlign:"center", cursor:"pointer", background:C.orange+"08", marginBottom:12
        }}>
          <div style={{ fontSize:44, marginBottom:8 }}>📸</div>
          <div style={{ fontWeight:800, fontSize:15, marginBottom:4 }}>{label}</div>
          <div style={{ fontSize:13, color:C.muted, marginBottom:12, lineHeight:1.6 }}>{hint}</div>
          <div style={{ background:C.orange, color:"#fff", borderRadius:10, padding:"10px 20px", display:"inline-block", fontWeight:800, fontSize:14 }}>
            📷 Camera / Gallery
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" capture="environment" multiple style={{ display:"none" }}
        onChange={async e => {
          const files = Array.from(e.target.files || []);
          for (const file of files.slice(0, maxPhotos - photos.length)) {
            const b64 = await fileToB64(file);
            onAdd({ b64, name: file.name, size: file.size });
          }
          e.target.value = "";
        }} />

      {photos.length > 0 && photos.length < maxPhotos && (
        <div style={{ fontSize:12, color:C.muted, textAlign:"center", marginBottom:8 }}>
          {photos.length}/{maxPhotos} photos • Aur add kar sakte ho
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════
// QUIZ PLAYER (for homework results)
// ══════════════════════════════════════
function QuizPlayer({ questions, title, reward, onDone }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[idx];
  if (!q) return null;

  if (done) return (
    <div style={{ textAlign:"center", padding:"24px 0" }}>
      <div style={{ fontSize:60, marginBottom:12 }}>{score===questions.length?"🏆":score>=questions.length*0.6?"⭐":"💪"}</div>
      <div style={{ fontWeight:800, fontSize:22, marginBottom:6 }}>
        {score===questions.length?"Perfect! Homework Done!":score>=questions.length*0.6?"Bahut Achha!":"Thodi Practice Aur!"}
      </div>
      <div style={{ color:C.muted, fontSize:14, marginBottom:12 }}>{score}/{questions.length} sahi</div>
      {reward && <div style={{ background:C.yellow+"22", border:`1px solid ${C.yellow}44`, borderRadius:12, padding:12, marginBottom:16, fontSize:13, color:C.yellow }}>🎉 {reward}</div>}
      <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
        <button onClick={() => { setIdx(0); setPicked(null); setScore(0); setDone(false); }}
          style={{ padding:"10px 20px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${C.purple},${C.cyan})`, color:"#fff", fontSize:13, fontWeight:800, cursor:"pointer" }}>
          🔄 Dobara Khelo
        </button>
        <button onClick={onDone}
          style={{ padding:"10px 20px", borderRadius:12, border:`1px solid ${C.border}`, background:C.card2, color:C.muted, fontSize:13, fontWeight:800, cursor:"pointer" }}>
          ← Wapas
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ fontWeight:800, fontSize:14, color:C.orange }}>{title}</div>
        <div style={{ fontSize:13, color:C.muted }}>{idx+1}/{questions.length}</div>
      </div>
      {/* Progress */}
      <div style={{ height:6, background:C.border, borderRadius:99, marginBottom:14, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${((idx+1)/questions.length)*100}%`, background:`linear-gradient(90deg,${C.orange},${C.purple})`, borderRadius:99, transition:"width .4s" }} />
      </div>
      {/* Difficulty badge */}
      <div style={{ marginBottom:10 }}>
        <span style={{ background:q.difficulty==="easy"?C.green+"22":q.difficulty==="hard"?C.red+"22":C.yellow+"22", color:q.difficulty==="easy"?C.green:q.difficulty==="hard"?C.red:C.yellow, fontSize:11, padding:"3px 10px", borderRadius:99, fontWeight:700 }}>
          {q.difficulty==="easy"?"😊 Easy":q.difficulty==="hard"?"🔥 Hard":"🤔 Medium"}
        </span>
      </div>
      {/* Question */}
      <div style={{ background:C.card2, borderRadius:14, padding:16, marginBottom:14, textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:8 }}>{q.emoji||"🎯"}</div>
        <div style={{ fontSize:14, fontWeight:700, lineHeight:1.6, marginBottom:6 }}>{q.gameQ}</div>
        <div style={{ fontSize:11, color:C.muted, fontStyle:"italic" }}>Original: {q.original}</div>
      </div>
      {/* Options */}
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
        {(q.opts||[]).map((opt,i) => {
          const isC=i===q.correct, isP=i===picked;
          return (
            <button key={i} onClick={() => { if(picked!==null)return; setPicked(i); if(isC) setScore(s=>s+1); }}
              style={{ padding:"13px 16px", borderRadius:12, fontFamily:"inherit",
                border:`2px solid ${picked===null?C.border:isC?C.green:isP?C.red:C.border}`,
                background:picked===null?C.card2:isC?C.green+"22":isP?C.red+"22":C.card2,
                color:C.text, fontSize:14, fontWeight:700, cursor:picked===null?"pointer":"default", textAlign:"left"
              }}>
              {picked!==null&&isC?"✅ ":picked!==null&&isP?"❌ ":`${["A","B","C","D"][i]}. `}{opt}
            </button>
          );
        })}
      </div>
      {picked!==null && (
        <>
          <div style={{ background:C.purple+"18", border:`1px solid ${C.purple}44`, borderRadius:12, padding:12, marginBottom:12, fontSize:13, color:C.muted, lineHeight:1.6 }}>
            💡 {q.explain}
          </div>
          <button onClick={() => { if(idx+1>=questions.length) setDone(true); else { setIdx(i=>i+1); setPicked(null); }}}
            style={{ width:"100%", padding:"13px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${C.orange},${C.purple})`, color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer" }}>
            {idx+1>=questions.length?"Results Dekho 🏆":"Agla Sawaal →"}
          </button>
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════
// PROBLEM SOLVER SCREEN
// ══════════════════════════════════════
function ProblemSolverView({ result, onDone }) {
  const [stepIdx, setStepIdx] = useState(-1);
  const [showAll, setShowAll] = useState(false);

  const revealNext = () => {
    if (stepIdx < result.steps.length - 1) setStepIdx(i => i+1);
    else setShowAll(true);
  };

  return (
    <div>
      {/* Problem header */}
      <div style={{ background:`linear-gradient(135deg,${C.purple}22,${C.cyan}11)`, border:`1px solid ${C.purple}44`, borderRadius:16, padding:16, marginBottom:16 }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ fontSize:32, flexShrink:0 }}>🔍</div>
          <div>
            <div style={{ fontWeight:800, fontSize:15, marginBottom:4 }}>{result.problemType}</div>
            <div style={{ fontSize:12, color:C.muted }}>Subject: {result.subject} • {result.difficulty}</div>
            <div style={{ marginTop:8, background:C.green+"22", border:`1px solid ${C.green}44`, borderRadius:10, padding:"8px 12px", fontSize:14, fontWeight:800, color:C.green }}>
              ✅ Answer: {result.answer}
            </div>
          </div>
        </div>
      </div>

      {/* Step by step */}
      <div style={{ fontWeight:800, fontSize:15, marginBottom:12 }}>📐 Step by Step Solution</div>
      <div style={{ marginBottom:14 }}>
        {result.steps.map((step, i) => (
          <div key={i} style={{
            background: i <= stepIdx ? C.card2 : "transparent",
            border:`1px solid ${i <= stepIdx ? C.cyan+"44" : C.border}`,
            borderRadius:14, padding: i <= stepIdx ? 14 : "10px 14px",
            marginBottom:8, opacity: i <= stepIdx ? 1 : 0.3,
            transform: i <= stepIdx ? "translateX(0)" : "translateX(-8px)",
            transition:"all .4s ease"
          }}>
            <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:i<=stepIdx?C.cyan:C.border, color:i<=stepIdx?"#000":C.muted, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, flexShrink:0 }}>
                {step.stepNo}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:13, marginBottom:i<=stepIdx?6:0 }}>{step.title}</div>
                {i <= stepIdx && (
                  <>
                    <div style={{ background:"#0a1020", borderRadius:8, padding:"8px 12px", fontFamily:"monospace", fontSize:14, color:C.cyan, marginBottom:6 }}>
                      {step.work}
                    </div>
                    <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>💬 {step.explain}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reveal buttons */}
      {!showAll ? (
        <button onClick={revealNext} style={{ width:"100%", padding:"13px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${C.cyan},${C.purple})`, color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", marginBottom:12 }}>
          {stepIdx < 0 ? "▶ Step 1 Dekho!" : stepIdx < result.steps.length-1 ? `Step ${stepIdx+2} →` : "Answer Dekho ✅"}
        </button>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:12 }}>
          {result.shortcut && (
            <div style={{ background:C.yellow+"18", border:`1px solid ${C.yellow}44`, borderRadius:14, padding:14 }}>
              <div style={{ fontWeight:800, fontSize:13, color:C.yellow, marginBottom:4 }}>⚡ Shortcut!</div>
              <div style={{ fontSize:13, color:C.muted }}>{result.shortcut}</div>
            </div>
          )}
          {result.commonMistake && (
            <div style={{ background:C.red+"11", border:`1px solid ${C.red}33`, borderRadius:14, padding:14 }}>
              <div style={{ fontWeight:800, fontSize:13, color:C.red, marginBottom:4 }}>⚠️ Common Mistake</div>
              <div style={{ fontSize:13, color:C.muted }}>{result.commonMistake}</div>
            </div>
          )}
          {result.realWorld && (
            <div style={{ background:C.green+"11", border:`1px solid ${C.green}33`, borderRadius:14, padding:14 }}>
              <div style={{ fontWeight:800, fontSize:13, color:C.green, marginBottom:4 }}>🌍 Real Life Connection</div>
              <div style={{ fontSize:13, color:C.muted }}>{result.realWorld}</div>
            </div>
          )}
          {result.similarProblem && (
            <div style={{ background:C.purple+"11", border:`1px solid ${C.purple}33`, borderRadius:14, padding:14 }}>
              <div style={{ fontWeight:800, fontSize:13, color:C.purple, marginBottom:4 }}>🎯 Practice Problem</div>
              <div style={{ fontSize:13, color:C.muted }}>{result.similarProblem}</div>
            </div>
          )}
        </div>
      )}

      <button onClick={onDone} style={{ width:"100%", padding:"12px", borderRadius:12, border:`1px solid ${C.border}`, background:C.card2, color:C.muted, fontSize:14, fontWeight:700, cursor:"pointer" }}>
        ← Wapas
      </button>
    </div>
  );
}

// ══════════════════════════════════════
// BOOK LESSON VIEW
// ══════════════════════════════════════
function BookLessonView({ result, onDone }) {
  const [quizIdx, setQuizIdx] = useState(null);
  const [picked, setPicked] = useState(null);

  return (
    <div>
      {/* Chapter header */}
      <div style={{ background:`linear-gradient(135deg,${C.green}22,${C.cyan}11)`, border:`1px solid ${C.green}44`, borderRadius:18, padding:16, marginBottom:14 }}>
        <div style={{ fontSize:11, color:C.green, fontWeight:800, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>📖 Chapter / Topic</div>
        <div style={{ fontWeight:800, fontSize:18, marginBottom:4 }}>{result.chapter}</div>
        <div style={{ fontSize:13, color:C.muted }}>{result.mainConcept}</div>
      </div>

      {/* Simple explanation */}
      <div style={{ background:C.card2, borderRadius:16, padding:16, marginBottom:12 }}>
        <div style={{ fontWeight:800, fontSize:14, marginBottom:10 }}>🧠 Simple Explanation</div>
        <div style={{ fontSize:14, lineHeight:1.8, color:C.text }}>{result.simpleExplanation}</div>
      </div>

      {/* Key points */}
      <div style={{ marginBottom:12 }}>
        <div style={{ fontWeight:800, fontSize:14, marginBottom:10 }}>✅ Key Points</div>
        {result.keyPoints?.map((point, i) => (
          <div key={i} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
            <div style={{ width:24, height:24, borderRadius:"50%", background:C.cyan+"22", border:`1px solid ${C.cyan}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:C.cyan, flexShrink:0 }}>{i+1}</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.6, paddingTop:2 }}>{point}</div>
          </div>
        ))}
      </div>

      {/* Real life example */}
      {result.realLifeExample && (
        <div style={{ background:C.orange+"11", border:`1px solid ${C.orange}33`, borderRadius:14, padding:14, marginBottom:12 }}>
          <div style={{ fontWeight:800, fontSize:13, color:C.orange, marginBottom:4 }}>🇮🇳 Indian Example</div>
          <div style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>{result.realLifeExample}</div>
        </div>
      )}

      {/* Memory trick */}
      {result.rememberTrick && (
        <div style={{ background:C.yellow+"18", border:`1px solid ${C.yellow}44`, borderRadius:14, padding:14, marginBottom:12 }}>
          <div style={{ fontWeight:800, fontSize:13, color:C.yellow, marginBottom:4 }}>🧠 Yaad Karne Ki Trick!</div>
          <div style={{ fontSize:13, color:C.muted }}>{result.rememberTrick}</div>
        </div>
      )}

      {/* Fun fact */}
      {result.funFact && (
        <div style={{ background:C.purple+"11", border:`1px solid ${C.purple}33`, borderRadius:14, padding:14, marginBottom:14 }}>
          <div style={{ fontWeight:800, fontSize:13, color:C.purple, marginBottom:4 }}>🌟 Fun Fact!</div>
          <div style={{ fontSize:13, color:C.muted }}>{result.funFact}</div>
        </div>
      )}

      {/* Quiz */}
      {result.quiz?.length > 0 && (
        <div style={{ marginBottom:14 }}>
          <div style={{ fontWeight:800, fontSize:14, marginBottom:10 }}>🎯 Quick Quiz — Samjha?</div>
          {result.quiz.map((q, qi) => (
            <div key={qi} style={{ background:C.card2, borderRadius:14, padding:14, marginBottom:10 }}>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>{q.q}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {q.opts.map((opt, i) => {
                  const isC=i===q.correct, isP=quizIdx===qi && picked===i;
                  return (
                    <button key={i} onClick={() => { if(quizIdx===qi && picked!==null)return; setQuizIdx(qi); setPicked(i); }}
                      style={{ padding:"10px 14px", borderRadius:10, fontFamily:"inherit",
                        border:`2px solid ${quizIdx===qi?(isC?C.green:isP?C.red:C.border):C.border}`,
                        background:quizIdx===qi?(isC?C.green+"22":isP?C.red+"22":C.card):C.card,
                        color:C.text, fontSize:13, fontWeight:700, cursor:"pointer", textAlign:"left"
                      }}>
                      {quizIdx===qi&&isC?"✅ ":quizIdx===qi&&isP?"❌ ":""}{opt}
                    </button>
                  );
                })}
              </div>
              {quizIdx===qi && picked!==null && (
                <div style={{ marginTop:8, fontSize:12, color:C.muted, background:C.border, borderRadius:8, padding:"6px 10px" }}>💡 {q.explain}</div>
              )}
            </div>
          ))}
        </div>
      )}

      <button onClick={onDone} style={{ width:"100%", padding:"12px", borderRadius:12, border:`1px solid ${C.border}`, background:C.card2, color:C.muted, fontSize:14, fontWeight:700, cursor:"pointer" }}>
        ← Wapas
      </button>
    </div>
  );
}

// ══════════════════════════════════════
// LOADING SCREEN
// ══════════════════════════════════════
function Loading({ mode, photoCount }) {
  const msgs = {
    homework:["📸 Photos scan ho rahi hain...","🔍 Questions dhundh raha hoon...","🎮 Games bana raha hoon...","✨ Almost done..."],
    book:["📖 Page padh raha hoon...","🧠 Concepts samajh raha hoon...","✍️ Lesson bana raha hoon...","🎯 Quiz ready ho raha hai..."],
    problem:["🔍 Problem dekh raha hoon...","🧮 Step by step solve kar raha hoon...","✅ Solution ready ho raha hai..."],
  };
  const [msgIdx, setMsgIdx] = useState(0);
  const mList = msgs[mode] || msgs.homework;
  const [count, setCount] = useState(0);

  // Cycle messages
  useState(() => {
    const iv = setInterval(() => setMsgIdx(i => (i+1)%mList.length), 1200);
    const iv2 = setInterval(() => setCount(c => c+1), 80);
    return () => { clearInterval(iv); clearInterval(iv2); };
  });

  return (
    <div style={{ textAlign:"center", padding:"48px 0" }}>
      <div style={{ fontSize:56, marginBottom:16, display:"inline-block", animation:"spin 1.5s linear infinite" }}>
        {mode==="homework"?"📚":mode==="book"?"📖":"🔬"}
      </div>
      <div style={{ fontWeight:800, fontSize:16, marginBottom:8 }}>{mList[msgIdx]}</div>
      {photoCount > 1 && <div style={{ fontSize:13, color:C.muted, marginBottom:16 }}>📸 {photoCount} photos process ho rahi hain</div>}
      <div style={{ height:6, background:C.border, borderRadius:99, overflow:"hidden", maxWidth:200, margin:"0 auto" }}>
        <div style={{ height:"100%", background:`linear-gradient(90deg,${C.orange},${C.purple})`, borderRadius:99, width:`${(count%100)}%`, transition:"width .1s" }} />
      </div>
      <div style={{ fontSize:12, color:C.muted, marginTop:12 }}>
        Haiku AI kaam kar raha hai... {photoCount > 1 ? `(${photoCount} images ek saath)` : ""}
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("homework");
  const [photos, setPhotos] = useState([]);
  const [age, setAge] = useState("11");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState(null);
  const [xp, setXp] = useState(0);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };
  const addXP = (n) => { setXp(p=>p+n); showToast(`+${n} XP! ⚡`); };

  const addPhoto = useCallback((photo) => {
    setPhotos(prev => [...prev, photo]);
  }, []);

  const removePhoto = useCallback((idx) => {
    setPhotos(prev => prev.filter((_,i) => i !== idx));
  }, []);

  const reset = () => { setPhotos([]); setResult(null); setResultType(null); setError(null); };

  const process = async (mode) => {
    if (photos.length === 0) return setError("Pehle photo lo!");
    setLoading(true); setError(null);

    try {
      const images = photos.map(p => p.b64);
      let data;

      if (mode === "homework") {
        data = await callClaude({ system:SYSTEMS.homework, prompt:PROMPTS.homework(age, subject), images });
        setResultType("homework");
        addXP(30);
      } else if (mode === "book") {
        data = await callClaude({ system:SYSTEMS.book, prompt:PROMPTS.book(subject), images });
        setResultType("book");
        addXP(25);
      } else if (mode === "problem") {
        data = await callClaude({ system:SYSTEMS.problem, prompt:PROMPTS.problem(subject), images });
        setResultType("problem");
        addXP(20);
      }

      setResult(data);
    } catch(e) {
      setError("Error aa gaya: " + e.message);
    }
    setLoading(false);
  };

  const TABS = [
    { id:"homework", icon:"📚", label:"Homework" },
    { id:"book",     icon:"📖", label:"Book Scan" },
    { id:"problem",  icon:"🔬", label:"Problem" },
  ];

  const SUBJECTS = ["Math","Science","English","Hindi","Social Science","Computer"];

  // Show result
  if (result && resultType) {
    return (
      <div style={{ fontFamily:"'Nunito','Segoe UI',sans-serif", background:C.bg, color:C.text, minHeight:"100vh", maxWidth:500, margin:"0 auto" }}>
        <style>{`*{box-sizing:border-box;margin:0;padding:0;} @keyframes slideUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}} input,button{font-family:inherit;} ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-thumb{background:${C.purple};border-radius:10px;}`}</style>
        <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(7,9,15,.97)", backdropFilter:"blur(16px)", borderBottom:`1px solid ${C.border}`, padding:"0 14px", height:52, display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={reset} style={{ background:"none", border:"none", color:C.muted, fontSize:20, cursor:"pointer", padding:"4px 8px 4px 0" }}>←</button>
          <span style={{ fontWeight:800, fontSize:16 }}>
            {resultType==="homework"?"🎮 Homework Game":resultType==="book"?"📖 Book Lesson":"🔬 Solution"}
          </span>
          <span style={{ marginLeft:"auto", background:`linear-gradient(90deg,${C.yellow},${C.orange})`, color:"#000", padding:"3px 10px", borderRadius:99, fontWeight:800, fontSize:12 }}>⚡{xp}</span>
        </div>
        <div style={{ padding:16, animation:"slideUp .3s ease" }}>
          {resultType==="homework" && result.questions && (
            <QuizPlayer questions={result.questions} title={result.gameTitle} reward={result.reward}
              onDone={reset} />
          )}
          {resultType==="book" && <BookLessonView result={result} onDone={reset} />}
          {resultType==="problem" && <ProblemSolverView result={result} onDone={reset} />}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:"'Nunito','Segoe UI',sans-serif", background:C.bg, color:C.text, minHeight:"100vh", maxWidth:500, margin:"0 auto" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
        @keyframes slideUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes pop{0%{transform:scale(.4) translateX(-50%);opacity:0;}70%{transform:scale(1.1) translateX(-50%);}100%{transform:scale(1) translateX(-50%);opacity:1;}}
        input,button,select{font-family:inherit;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:${C.purple};border-radius:10px;}
      `}</style>

      {/* HEADER */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(7,9,15,.97)", backdropFilter:"blur(16px)", borderBottom:`1px solid ${C.border}`, padding:"0 14px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontWeight:800, fontSize:16 }}>Kid<span style={{color:C.orange}}>AI</span> <span style={{fontSize:12,color:C.muted,fontWeight:400}}>Smart Scanner</span></div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <select value={age} onChange={e=>setAge(e.target.value)} style={{ background:C.card2, border:`1px solid ${C.border}`, color:C.muted, borderRadius:8, padding:"4px 8px", fontSize:12 }}>
            {["9","10","11","12","13","14","15"].map(a => <option key={a} value={a}>{a} saal</option>)}
          </select>
          <div style={{ background:`linear-gradient(90deg,${C.yellow},${C.orange})`, color:"#000", padding:"3px 10px", borderRadius:99, fontWeight:800, fontSize:12 }}>⚡{xp}</div>
        </div>
      </div>

      {/* TAB NAV */}
      <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, background:C.card }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); reset(); }}
            style={{ flex:1, padding:"12px 6px", border:"none", background:"transparent", cursor:"pointer",
              borderBottom:`3px solid ${tab===t.id ? C.orange : "transparent"}`,
              color:tab===t.id ? C.orange : C.muted, fontWeight:700, fontSize:12, transition:"all .2s"
            }}>
            {t.icon}<br/>{t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding:16 }}><Loading mode={tab} photoCount={photos.length} /></div>
      ) : (
        <div style={{ padding:"14px 14px 100px", animation:"slideUp .3s ease" }}>

          {/* ── HOMEWORK ── */}
          {tab === "homework" && (
            <div>
              <div style={{ fontWeight:800, fontSize:20, marginBottom:4 }}>📚 Homework → Game!</div>
              <div style={{ color:C.muted, fontSize:13, marginBottom:16, lineHeight:1.6 }}>
                Sab homework pages ki photo lo ek baar — phir ek button dabao! AI saari photos ko ek saath process karke poora din ka game bana dega. 🎮
              </div>

              {/* Multi-photo capture */}
              <PhotoCapture
                photos={photos}
                onAdd={addPhoto}
                onRemove={removePhoto}
                maxPhotos={8}
                label="Homework Pages Ki Photos Lo"
                hint="Multiple pages? Sab ek baar lo — AI ek saath process karega! Max 8 photos."
              />

              {/* Subject hint */}
              {photos.length > 0 && (
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:12, color:C.muted, fontWeight:700, marginBottom:8 }}>Subject (optional — AI khud detect karega):</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <button onClick={() => setSubject("")} style={{ padding:"6px 12px", borderRadius:8, border:`1.5px solid ${subject===""?C.orange:C.border}`, background:subject===""?C.orange+"22":C.card2, color:subject===""?C.orange:C.muted, fontSize:12, fontWeight:700, cursor:"pointer" }}>Auto</button>
                    {SUBJECTS.map(s => (
                      <button key={s} onClick={() => setSubject(s)} style={{ padding:"6px 12px", borderRadius:8, border:`1.5px solid ${subject===s?C.orange:C.border}`, background:subject===s?C.orange+"22":C.card2, color:subject===s?C.orange:C.muted, fontSize:12, fontWeight:700, cursor:"pointer" }}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {error && <div style={{ background:C.red+"18", border:`1px solid ${C.red}44`, borderRadius:12, padding:12, marginBottom:14, fontSize:13, color:C.red }}>{error}</div>}

              {photos.length > 0 && (
                <>
                  {/* Summary before processing */}
                  <div style={{ background:`linear-gradient(135deg,${C.green}18,${C.cyan}11)`, border:`1px solid ${C.green}44`, borderRadius:14, padding:14, marginBottom:14 }}>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:6, color:C.green }}>✅ Ready to Process!</div>
                    <div style={{ fontSize:13, color:C.muted, lineHeight:1.7 }}>
                      📸 {photos.length} photos ready<br/>
                      🎓 Age: {age} saal<br/>
                      📚 Subject: {subject || "Auto detect"}<br/>
                      ⚡ Cost: ~₹{(photos.length * 0.11 + 0.15).toFixed(2)} (one time)
                    </div>
                  </div>

                  <button onClick={() => process("homework")} style={{
                    width:"100%", padding:"16px", borderRadius:14, border:"none",
                    background:`linear-gradient(135deg,${C.orange},${C.purple})`,
                    color:"#fff", fontSize:16, fontWeight:800, cursor:"pointer",
                    boxShadow:`0 6px 24px ${C.orange}44`
                  }}>
                    🚀 Sab Photos Process Karo! ({photos.length} photos)
                  </button>
                </>
              )}

              {/* How it works */}
              <div style={{ marginTop:16, background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:14 }}>
                <div style={{ fontWeight:700, fontSize:13, marginBottom:10 }}>💡 Kaise Kaam Karta Hai?</div>
                {[
                  ["📸","Ek baar mein sab pages ki photo lo"],
                  ["⚡","Ek button — sab process!"],
                  ["🎮","Har question → Fun game question banta hai"],
                  ["✅","Khelte khelte homework complete!"],
                  ["💾","Next time same topic → Cache se free!"],
                ].map(([icon,text],i) => (
                  <div key={i} style={{ display:"flex", gap:10, marginBottom:8, fontSize:13, alignItems:"flex-start" }}>
                    <span style={{ fontSize:18, flexShrink:0 }}>{icon}</span>
                    <span style={{ color:C.muted, lineHeight:1.5 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BOOK SCAN ── */}
          {tab === "book" && (
            <div>
              <div style={{ fontWeight:800, fontSize:20, marginBottom:4 }}>📖 Book Scanner</div>
              <div style={{ color:C.muted, fontSize:13, marginBottom:16, lineHeight:1.6 }}>
                Textbook ka page photo lo — AI concept samjhayega, trick batayega, aur quiz bhi dega! Jab bhi doubt ho, scan karo. 🧠
              </div>

              <PhotoCapture
                photos={photos}
                onAdd={addPhoto}
                onRemove={removePhoto}
                maxPhotos={3}
                label="Textbook Page Ki Photo Lo"
                hint="Jo chapter/topic samajhna hai uska page photo lo. AI simple language mein samjhayega!"
              />

              {photos.length > 0 && (
                <>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:12, color:C.muted, fontWeight:700, marginBottom:8 }}>Topic (optional):</div>
                    <input value={subject} onChange={e=>setSubject(e.target.value)}
                      placeholder="e.g. Photosynthesis, Fractions, French Revolution..."
                      style={{ width:"100%", padding:"11px 14px", borderRadius:12, border:`1px solid ${C.border}`, background:C.card2, color:C.text, fontSize:13, outline:"none" }} />
                  </div>

                  {error && <div style={{ background:C.red+"18", border:`1px solid ${C.red}44`, borderRadius:12, padding:12, marginBottom:14, fontSize:13, color:C.red }}>{error}</div>}

                  <button onClick={() => process("book")} style={{
                    width:"100%", padding:"16px", borderRadius:14, border:"none",
                    background:`linear-gradient(135deg,${C.green},${C.cyan})`,
                    color:"#fff", fontSize:16, fontWeight:800, cursor:"pointer",
                    boxShadow:`0 6px 24px ${C.green}44`
                  }}>
                    📖 Samjhao Mujhe! (AI Lesson Generate)
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── PROBLEM SOLVER ── */}
          {tab === "problem" && (
            <div>
              <div style={{ fontWeight:800, fontSize:20, marginBottom:4 }}>🔬 Problem Solver</div>
              <div style={{ color:C.muted, fontSize:13, marginBottom:16, lineHeight:1.6 }}>
                Koi bhi problem samajh nahi aai? Photo lo — AI step by step solve karega, aur samjhayega bhi! Real life connection bhi dega. 🎯
              </div>

              <PhotoCapture
                photos={photos}
                onAdd={addPhoto}
                onRemove={removePhoto}
                maxPhotos={2}
                label="Problem Ki Photo Lo"
                hint="Math problem, science diagram, ya koi bhi question — photo lo aur AI solve karega!"
              />

              {photos.length > 0 && (
                <>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:12, color:C.muted, fontWeight:700, marginBottom:8 }}>Subject:</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {SUBJECTS.map(s => (
                        <button key={s} onClick={() => setSubject(s)} style={{ padding:"6px 12px", borderRadius:8, border:`1.5px solid ${subject===s?C.purple:C.border}`, background:subject===s?C.purple+"22":C.card2, color:subject===s?C.purple:C.muted, fontSize:12, fontWeight:700, cursor:"pointer" }}>{s}</button>
                      ))}
                    </div>
                  </div>

                  {error && <div style={{ background:C.red+"18", border:`1px solid ${C.red}44`, borderRadius:12, padding:12, marginBottom:14, fontSize:13, color:C.red }}>{error}</div>}

                  <button onClick={() => process("problem")} style={{
                    width:"100%", padding:"16px", borderRadius:14, border:"none",
                    background:`linear-gradient(135deg,${C.purple},${C.pink})`,
                    color:"#fff", fontSize:16, fontWeight:800, cursor:"pointer",
                    boxShadow:`0 6px 24px ${C.purple}44`
                  }}>
                    🔍 Step by Step Solve Karo!
                  </button>

                  <div style={{ marginTop:12, background:`linear-gradient(135deg,${C.purple}11,${C.cyan}08)`, border:`1px solid ${C.purple}33`, borderRadius:14, padding:14 }}>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:8 }}>Tumhe milega:</div>
                    {["✅ Final answer","📐 Har step clearly","💬 Simple Hinglish explanation","⚡ Shortcut (if exists)","⚠️ Common mistake warning","🌍 Real life connection"].map((item,i) => (
                      <div key={i} style={{ fontSize:12, color:C.muted, marginBottom:4 }}>{item}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:500, background:"rgba(7,9,15,.98)", backdropFilter:"blur(20px)", borderTop:`1px solid ${C.border}`, display:"flex", padding:"8px 4px 16px", zIndex:100 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); reset(); }} style={{
            flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2,
            padding:"6px 2px", borderRadius:12, border:"none",
            background:tab===t.id ? C.orange+"18" : "transparent", cursor:"pointer"
          }}>
            <span style={{ fontSize:22, transform:tab===t.id?"scale(1.15)":"scale(1)", transition:"transform .2s", display:"block" }}>{t.icon}</span>
            <span style={{ fontSize:10, fontWeight:700, color:tab===t.id ? C.orange : C.muted }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position:"fixed", top:62, left:"50%", transform:"translateX(-50%)", background:`linear-gradient(135deg,${C.orange},${C.purple})`, color:"#fff", padding:"8px 20px", borderRadius:99, fontWeight:800, fontSize:13, zIndex:200, animation:"pop .3s ease", whiteSpace:"nowrap" }}>
          {toast}
        </div>
      )}
    </div>
  );
}