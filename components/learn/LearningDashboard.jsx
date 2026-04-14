"use client";

import { useState, useEffect, useRef } from "react";
import { getTodaysPlan, chatWithArya, recordQuizAttempt } from "@/lib/arya/arya-engine";

const MOCK_STUDENT = {
  id: "arjun_001",
  name: "Arjun",
  current_class: 7,
  board: "CBSE",
  streak_days: 5,
  coins: 150,
  avatar: "🧒",
  skill_growth: [
    { name: "Hindi to English", before: 30, now: 85 },
    { name: "Math Tables", before: 45, now: 90 },
    { name: "Number Spelling", before: 50, now: 95 },
    { name: "Reading Speed", before: 60, now: 80 },
  ]
};

const MOCK_PLAN = {
  totalPending: 8,
  plan: [
    {
      type: "skipped",
      label: "Pehle ye karo!",
      quizzes: [
        { quiz_id: "q1", quizzes: { question: "Photosynthesis mein kaunsa gas produce hota hai?", option_a: "CO2", option_b: "O2", option_c: "N2", option_d: "H2", correct_option: "b", difficulty: 2, chapters: { title: "Plants ka Khana", subjects: { name: "Science", icon: "🔬", color: "#10b981" } } }, last_score: 0, status: "skipped" },
        { quiz_id: "q2", quizzes: { question: "2/3 + 1/4 = ?", option_a: "3/7", option_b: "8/12", option_c: "11/12", option_d: "5/6", correct_option: "c", difficulty: 3, chapters: { title: "Fractions", subjects: { name: "Maths", icon: "🔢", color: "#f59e0b" } } }, last_score: 0, status: "skipped" }
      ]
    },
    {
      type: "weak",
      label: "Thoda weak hai — practice karo",
      quizzes: [
        { quiz_id: "q3", quizzes: { question: "Newton ka pehla niyam kya hai?", option_a: "F=ma", option_b: "Inertia ka niyam", option_c: "Action-Reaction", option_d: "Gravitation", correct_option: "b", difficulty: 3, chapters: { title: "Force & Laws", subjects: { name: "Science", icon: "🔬", color: "#10b981" } } }, last_score: 45, status: "learning" },
        { quiz_id: "q4", quizzes: { question: "Verb ki kitni types hoti hain?", option_a: "2", option_b: "3", option_c: "4", option_d: "5", correct_option: "b", difficulty: 2, chapters: { title: "Parts of Speech", subjects: { name: "English", icon: "📖", color: "#6366f1" } } }, last_score: 60, status: "learning" }
      ]
    }
  ],
  allQuizzes: []
};

const ARYA_INTRO = "Heyy Arjun! 👋 Main Arya hoon, teri study dost! Aaj ke liye 8 quizzes pending hain. Pehle jo skip kiye the, unhe solve karte hain? 💪";

const DUMMY_UUID = "11111111-1111-1111-1111-111111111111"; // Testing ke liye ek dummy UUID

export default function LearningDashboard() {
  const [screen, setScreen] = useState("dashboard");
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [coins, setCoins] = useState(MOCK_STUDENT.coins);
  const [messages, setMessages] = useState([{ role: "arya", text: ARYA_INTRO }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [planData, setPlanData] = useState(MOCK_PLAN);
  const chatRef = useRef(null);

  // LIVE ARENA / CHALLENGE STATES
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  const [isLateForChallenge, setIsLateForChallenge] = useState(false); // Demo purposes

  // WEEKLY TEST (REVGEN) STATES
  const [testIdx, setTestIdx] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testAns, setTestAns] = useState("");
  const [testStatus, setTestStatus] = useState(null);
  const WEEKLY_TEST_QS = [
    { type: "mcq", q: "Batao, 8 × 7 kya hota hai? 🤔", options: ["48", "54", "56", "64"], ans: "56", topic: "Pahada (Tables)" },
    { type: "input", q: "Number '15' ki English spelling likho! ✍️", ans: "fifteen", topic: "Number Spelling" },
    { type: "mcq", q: "'पानी' ko English mein kya kehte hain? 💧", options: ["Fire", "Water", "Air", "Earth"], ans: "Water", topic: "Anuvad (Translation)" },
    { type: "mcq", q: "Website ki 'Eent' (structure) kise kehte hain? 🧱", options: ["CSS", "JavaScript", "HTML", "Python"], ans: "HTML", topic: "Tech Basics" },
  ];

  const allQuizzes = planData.plan.flatMap(p => p.quizzes);
  const currentQuiz = allQuizzes[currentQuizIdx];

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // Real Backend Data Fetch
  useEffect(() => {
    async function loadData() {
      try {
        const realPlan = await getTodaysPlan(DUMMY_UUID);
        if (realPlan && realPlan.plan && realPlan.plan.length > 0) {
          setPlanData(realPlan); // Agar Supabase me real data hai, to wo load hoga
        }
      } catch (err) {
        console.log("No real data yet, using mock data...");
      }
    }
    loadData();
  }, []);

  const handleAnswer = async (option) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);
    const isCorrect = option === currentQuiz.quizzes.correct_option;
    if (isCorrect) {
      setScore(s => ({ correct: s.correct + 1, total: s.total + 1 }));
      setCoins(c => c + 2); // +2 Coins for Correct
    } else {
      setScore(s => ({ ...s, total: s.total + 1 }));
      setCoins(c => Math.max(0, c - 2)); // -2 Coins for Wrong (minimum 0)
    }
    setCompletedQuizzes(prev => [...prev, currentQuiz.quiz_id]);

    // Supabase Backend Link (Spaced Repetition Record karna)
    if (!currentQuiz.quiz_id.toString().startsWith("q")) { 
      try {
        // 10s mock time assumed
        await recordQuizAttempt(DUMMY_UUID, currentQuiz.quiz_id, option, 10);
      } catch(e) { console.error("Attempt save failed", e) }
    }
  };

  const nextQuiz = () => {
    setShowResult(false);
    setSelectedOption(null);
    if (currentQuizIdx < allQuizzes.length - 1) {
      setCurrentQuizIdx(i => i + 1);
    } else {
      setScreen("complete");
    }
  };

  const handleTestAnswer = (ans) => {
    const isCorrect = ans.toLowerCase().trim() === WEEKLY_TEST_QS[testIdx].ans.toLowerCase();
    setTestStatus(isCorrect ? "correct" : "wrong");
    if (isCorrect) setTestScore(s => s + 1);
    
    setTimeout(() => {
      if (testIdx < WEEKLY_TEST_QS.length - 1) {
        setTestIdx(i => i + 1);
        setTestAns("");
        setTestStatus(null);
      } else {
        setScreen("test_complete");
      }
    }, 2000);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "student", text: input };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Claude AI se Real API request
      const history = messages.map(m => ({ role: m.role, message: m.text }));
      const res = await chatWithArya(DUMMY_UUID, input, history);
      setMessages(m => [...m, { role: "arya", text: res.reply }]);
    } catch(e) {
      console.error("Chat Error:", e);
      setMessages(m => [...m, { role: "arya", text: "Main network se connect nahi ho pa rahi hoon! 🔌" }]);
    }
    setLoading(false);
  };

  const getOptionStyle = (opt) => {
    if (!showResult) return selectedOption === opt ? "selected" : "default";
    if (opt === currentQuiz.quizzes.correct_option) return "correct";
    if (opt === selectedOption && opt !== currentQuiz.quizzes.correct_option) return "wrong";
    return "default";
  };

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.avatar}>{MOCK_STUDENT.avatar}</span>
          <div>
            <div style={styles.studentName}>{MOCK_STUDENT.name}</div>
            <div style={styles.classLabel}>Class {MOCK_STUDENT.current_class} • {MOCK_STUDENT.board}</div>
          </div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.coinBadge}>🪙 {coins.toLocaleString()} Coins</div>
          <div style={styles.streakBadge}>🔥 {MOCK_STUDENT.streak_days} din</div>
        </div>
      </div>

      <div style={styles.nav}>
        {[
          { id: "dashboard", icon: "🏠", label: "Home" },
          { id: "quiz", icon: "📝", label: "Quiz" },
          { id: "library", icon: "🎮", label: "Library" },
          { id: "arya", icon: "🤖", label: "Arya" },
          { id: "progress", icon: "📊", label: "Progress" }
        ].map(tab => (
          <button
            key={tab.id}
            style={{ ...styles.navBtn, ...(screen === tab.id ? styles.navBtnActive : {}) }}
            onClick={() => { 
              if (tab.id === "library") {
                window.location.href = '/library';
                return;
              }
              setScreen(tab.id); 
              if (tab.id === "quiz") { setCurrentQuizIdx(0); setShowResult(false); setSelectedOption(null); } 
            }}
          >
            <span style={styles.navIcon}>{tab.icon}</span>
            <span style={styles.navLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div style={styles.content}>

        {screen === "dashboard" && (
          <div>
            <div style={styles.greeting}>
              Namaste Arjun! 🌟
              <div style={styles.greetingSub}>Aaj bhi seekhne chalein?</div>
            </div>

            {/* LIVE ARENA CHALLENGE BANNER */}
            <div style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid #a78bfa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, color: "#fff" }}>🏆 Live Arena: Math Speed Run</div>
                  <div style={{ fontSize: 13, color: "#e2e8f0" }}>Aaj shaam 5:00 PM • 24 doston ne accept kiya!</div>
                </div>
                <div style={{ fontSize: 32, animation: "bounce 2s infinite" }}>⚔️</div>
              </div>
              
              {!challengeAccepted ? (
                <button onClick={() => setChallengeAccepted(true)} style={{ background: "#fff", color: "#6366f1", padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 800, border: "none", cursor: "pointer", display: "inline-flex", gap: 6, alignItems: "center" }}>👍 Accept Challenge</button>
              ) : (
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ color: "#a7f3d0", fontSize: 13, fontWeight: 800, background: "rgba(0,0,0,0.2)", padding: "6px 12px", borderRadius: 8 }}>✅ Accepted! See you at 5.</span>
                  <button onClick={() => setIsLateForChallenge(true)} style={{ background: "transparent", color: "rgba(255,255,255,0.6)", padding: "4px 8px", borderRadius: 6, fontSize: 11, border: "1px dashed rgba(255,255,255,0.4)", cursor: "pointer" }}>Simulate Late Entry</button>
                </div>
              )}
              
              {isLateForChallenge && challengeAccepted && (
                <div style={{ marginTop: 12, background: "rgba(255,255,255,0.15)", padding: 12, borderRadius: 10, fontSize: 12, color: "#fff", lineHeight: 1.5, animation: "slideIn .3s" }}>
                  ⏳ <strong style={{color:"#fde047"}}>Tum late ho gaye?</strong> Koi baat nahi! Arya ne tumhare jaise 8 aur doston ke sath ek naya <strong>"Late Batch"</strong> bana diya hai. <span style={{ background: "#f59e0b", color: "#000", padding: "4px 10px", borderRadius: 6, fontWeight: 800, cursor: "pointer", marginLeft: 6 }}>Start Now ▶</span>
                </div>
              )}
            </div>

            {/* WEEKLY REVGEN BANNER */}
            <div style={{ background: "linear-gradient(135deg, #ef4444, #f59e0b)", borderRadius: 16, padding: 16, marginBottom: 16, cursor: "pointer", border: "1px solid #f59e0b" }} 
                 onClick={() => { setScreen("weekly_test"); setTestIdx(0); setTestScore(0); setTestStatus(null); setTestAns(""); }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>🎯 Weekly AI Test (Revgen)</div>
              <div style={{ fontSize: 13, color: "#fff", opacity: 0.9 }}>Arya ke saath is hafte ka live test do!</div>
              <div style={{ marginTop: 10, display: "inline-block", background: "rgba(0,0,0,0.2)", padding: "4px 12px", borderRadius: 8, fontSize: 12, fontWeight: 800 }}>Start Test ▶</div>
            </div>

            <div style={styles.planCard}>
              <div style={styles.planHeader}>
                <span>📋 Aaj ka Plan</span>
                <span style={styles.planCount}>{planData.totalPending} pending</span>
              </div>
              {planData.plan.map((section, i) => (
                <div key={i} style={styles.planSection}>
                  <div style={{ ...styles.planTag, background: section.type === "skipped" ? "#ef444420" : "#f59e0b20", color: section.type === "skipped" ? "#ef4444" : "#f59e0b" }}>
                    {section.type === "skipped" ? "⚠️" : "🔄"} {section.label}
                  </div>
                  {section.quizzes.map((q, j) => (
                    <div key={j} style={styles.planItem}>
                      <span style={{ ...styles.subjectDot, background: q.quizzes.chapters.subjects.color }} />
                      <span style={styles.planItemText}>{q.quizzes.chapters.subjects.name} — {q.quizzes.chapters.title}</span>
                      {q.last_score > 0 && <span style={styles.planScore}>{q.last_score}%</span>}
                    </div>
                  ))}
                </div>
              ))}
              <button style={styles.startBtn} onClick={() => setScreen("quiz")}>Shuru Karo! 🚀</button>
            </div>
            <div style={styles.statsRow}>
              {[
                { label: "Complete", value: completedQuizzes.length, icon: "✅", color: "#10b981" },
                { label: "Streak", value: `${MOCK_STUDENT.streak_days}d`, icon: "🔥", color: "#f59e0b" },
                { label: "Coins Today", value: "+14", icon: "🪙", color: "#eab308" }
              ].map((stat, i) => (
                <div key={i} style={{ ...styles.statCard, borderColor: stat.color + "40" }}>
                  <div style={styles.statIcon}>{stat.icon}</div>
                  <div style={{ ...styles.statValue, color: stat.color }}>{stat.value}</div>
                  <div style={styles.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={styles.aryaCard} onClick={() => setScreen("arya")}>
              <div style={styles.aryaAvatar}>🤖</div>
              <div style={styles.aryaMessage}>
                <div style={styles.aryaName}>Arya</div>
                <div style={styles.aryaText}>Photosynthesis phir se try karo aaj — last time 45% tha! 💪</div>
              </div>
              <div style={styles.aryaArrow}>›</div>
            </div>
          </div>
        )}

        {/* WEEKLY TEST (REVGEN) SCREEN */}
        {screen === "weekly_test" && (
          <div style={{ animation: "slideIn .3s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontWeight: 800, color: "#f59e0b" }}>Revgen Test</div>
              <div style={{ fontWeight: 800, color: "#cbd5e1" }}>Q {testIdx + 1}/{WEEKLY_TEST_QS.length}</div>
            </div>
            <div style={{ background: "#1e293b", borderRadius: 16, padding: 20, border: "1px solid #334155", position: "relative" }}>
              <div style={{ position: "absolute", top: -20, left: 20, fontSize: 40 }}>🤖</div>
              <div style={{ background: "#334155", display: "inline-block", padding: "4px 10px", borderRadius: 8, fontSize: 11, color: "#94a3b8", marginBottom: 12, marginTop: 16 }}>Topic: {WEEKLY_TEST_QS[testIdx].topic}</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, lineHeight: 1.5 }}>{WEEKLY_TEST_QS[testIdx].q}</div>
              
              {WEEKLY_TEST_QS[testIdx].type === "mcq" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {WEEKLY_TEST_QS[testIdx].options.map(opt => (
                    <button key={opt} onClick={() => !testStatus && handleTestAnswer(opt)} 
                      style={{ ...styles.option, borderColor: testStatus === "correct" && opt === WEEKLY_TEST_QS[testIdx].ans ? "#10b981" : testStatus === "wrong" && testAns === opt ? "#ef4444" : "#334155",
                               background: testStatus === "correct" && opt === WEEKLY_TEST_QS[testIdx].ans ? "#10b98122" : testStatus === "wrong" && testAns === opt ? "#ef444422" : "transparent" }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              
              {WEEKLY_TEST_QS[testIdx].type === "input" && (
                <div>
                  <input value={testAns} onChange={e => setTestAns(e.target.value)} disabled={!!testStatus} placeholder="Yahan likho..." 
                    style={{ width: "100%", padding: 14, borderRadius: 12, background: "#0f172a", border: `2px solid ${testStatus==="correct"?"#10b981":testStatus==="wrong"?"#ef4444":"#334155"}`, color: "#fff", fontSize: 16, marginBottom: 16, outline: "none" }} />
                  {!testStatus && <button onClick={() => handleTestAnswer(testAns)} style={styles.startBtn}>Check Answer ✨</button>}
                </div>
              )}

              {testStatus === "correct" && <div style={{ color: "#10b981", fontWeight: 800, marginTop: 16, textAlign: "center", fontSize: 16, animation: "pop .3s" }}>🎉 Ekdum Sahi!</div>}
              {testStatus === "wrong" && <div style={{ color: "#ef4444", fontWeight: 800, marginTop: 16, textAlign: "center", fontSize: 16, animation: "pop .3s" }}>❌ Galat ho gaya, Sahi jawab tha: {WEEKLY_TEST_QS[testIdx].ans}</div>}
            </div>
          </div>
        )}

        {screen === "test_complete" && (
          <div style={styles.completeScreen}>
            <div style={styles.completeEmoji}>🎯</div>
            <div style={styles.completeTitle}>Test Complete!</div>
            <div style={{ fontSize: 16, color: "#94a3b8", marginBottom: 20 }}>Tumne {testScore} / {WEEKLY_TEST_QS.length} score kiya.</div>
            <div style={{ background: "#10b98122", color: "#10b981", padding: 16, borderRadius: 12, fontWeight: 700, marginBottom: 24 }}>Arya: "Bohat badhiya! Tumhari spelling aur math tables ab bilkul strong ho gaye hain!"</div>
            <button style={styles.startBtn} onClick={() => setScreen("dashboard")}>Wapas Dashboard Par 🏠</button>
          </div>
        )}

        {screen === "quiz" && currentQuiz && (
          <div>
            <div style={styles.quizProgress}>
              <span style={styles.quizCount}>{currentQuizIdx + 1} / {allQuizzes.length}</span>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${((currentQuizIdx + 1) / allQuizzes.length) * 100}%` }} />
              </div>
            </div>
            <div style={{ ...styles.subjectBadge, background: currentQuiz.quizzes.chapters.subjects.color + "20", color: currentQuiz.quizzes.chapters.subjects.color }}>
              {currentQuiz.quizzes.chapters.subjects.icon} {currentQuiz.quizzes.chapters.subjects.name}
            </div>
            <div style={styles.questionCard}>
              <div style={styles.question}>{currentQuiz.quizzes.question}</div>
              {["a", "b", "c", "d"].map(opt => {
                const s = getOptionStyle(opt);
                return (
                  <button
                    key={opt}
                    style={{ ...styles.option, ...(s === "selected" ? styles.optionSelected : {}), ...(s === "correct" ? styles.optionCorrect : {}), ...(s === "wrong" ? styles.optionWrong : {}) }}
                    onClick={() => handleAnswer(opt)}
                  >
                    <span style={styles.optionLabel}>{opt.toUpperCase()}</span>
                    <span>{currentQuiz.quizzes[`option_${opt}`]}</span>
                    {s === "correct" && <span style={styles.optionIcon}>✓</span>}
                    {s === "wrong" && <span style={styles.optionIcon}>✗</span>}
                  </button>
                );
              })}
            </div>
            {showResult && (
              <div style={{ ...styles.resultCard, background: selectedOption === currentQuiz.quizzes.correct_option ? "#10b98115" : "#ef444415", borderColor: selectedOption === currentQuiz.quizzes.correct_option ? "#10b981" : "#ef4444" }}>
                <div style={styles.resultText}>
                  {selectedOption === currentQuiz.quizzes.correct_option ? "🎉 Bilkul sahi! Shabaash!" : `❌ Sahi jawab: ${currentQuiz.quizzes.correct_option.toUpperCase()} — ${currentQuiz.quizzes[`option_${currentQuiz.quizzes.correct_option}`]}`}
                </div>
                <div style={selectedOption === currentQuiz.quizzes.correct_option ? styles.coinEarned : styles.coinLost}>{selectedOption === currentQuiz.quizzes.correct_option ? "+2 Coins 🪙" : "-2 Coins 📉"}</div>
                <button style={styles.nextBtn} onClick={nextQuiz}>{currentQuizIdx < allQuizzes.length - 1 ? "Agla ➜" : "Complete! 🎊"}</button>
              </div>
            )}
            {!showResult && (
              <button style={styles.skipBtn} onClick={nextQuiz}>Skip karo (baad mein aayega) ⏭️</button>
            )}
          </div>
        )}

        {screen === "complete" && (
          <div style={styles.completeScreen}>
            <div style={styles.completeEmoji}>🏆</div>
            <div style={styles.completeTitle}>Shabash Arjun!</div>
            <div style={styles.completeStats}>
              <div>{score.correct}/{score.total} sahi jawab</div>
              <div>{score.correct * 2 - (score.total - score.correct) * 2} Coins kamaye! 🪙</div>
            </div>
            <div style={styles.nextReview}>Agle quiz ka schedule ho gaya ✅</div>
            <button style={styles.startBtn} onClick={() => setScreen("dashboard")}>Dashboard pe jaao 🏠</button>
          </div>
        )}

        {screen === "arya" && (
          <div style={styles.chatScreen}>
            <div style={styles.chatHeader}>
              <span style={styles.chatAvatar}>🤖</span>
              <div>
                <div style={styles.chatName}>Arya</div>
                <div style={styles.chatStatus}>● Online — Tumhari study dost</div>
              </div>
            </div>
            <div style={styles.messages} ref={chatRef}>
              {messages.map((msg, i) => (
                <div key={i} style={{ ...styles.message, ...(msg.role === "student" ? styles.messageStudent : styles.messageArya) }}>
                  {msg.role === "arya" && <span style={styles.msgAvatar}>🤖</span>}
                  <div style={{ ...styles.msgBubble, ...(msg.role === "student" ? styles.bubbleStudent : styles.bubbleArya) }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={styles.message}>
                  <span style={styles.msgAvatar}>🤖</span>
                  <div style={{ ...styles.msgBubble, ...styles.bubbleArya }}>
                    <span style={styles.typing}>● ● ●</span>
                  </div>
                </div>
              )}
            </div>
            <div style={styles.chatInput}>
              <input
                style={styles.input}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Arya se kuch bhi poochho..."
              />
              <button style={styles.sendBtn} onClick={sendMessage}>➤</button>
            </div>
          </div>
        )}

        {screen === "progress" && (
          <div>
            <div style={styles.progressTitle}>Tera Progress 📊</div>
            {[
              { name: "Science", icon: "🔬", color: "#10b981", done: 23, total: 45, weak: 5 },
              { name: "Maths", icon: "🔢", color: "#f59e0b", done: 31, total: 60, weak: 8 },
              { name: "Languages", icon: "📖", color: "#6366f1", done: 18, total: 40, weak: 3 },
            ].map((sub, i) => (
              <div key={i} style={styles.subjectProgress}>
                <div style={styles.subjectHeader}>
                  <span>{sub.icon} {sub.name}</span>
                  <span style={{ color: sub.color }}>{sub.done}/{sub.total}</span>
                </div>
                <div style={styles.subjectBar}>
                  <div style={{ ...styles.subjectFill, width: `${(sub.done / sub.total) * 100}%`, background: sub.color }} />
                </div>
                <div style={styles.weakNote}>⚠️ {sub.weak} weak topics pending</div>
              </div>
            ))}
            
            {/* SKILL GROWTH (Before vs Now) */}
            <div style={{ marginTop: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>📈 Learning Impact</span>
                <span style={{ fontSize: 12, color: "#10b981", background: "#10b98122", padding: "4px 8px", borderRadius: 8 }}>Game Results</span>
              </div>
              {MOCK_STUDENT.skill_growth.map((skill, i) => (
                <div key={i} style={{ background: "#1e293b", padding: 14, borderRadius: 12, marginBottom: 10, border: "1px solid #334155" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>{skill.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
                    <div style={{ width: 60, color: "#94a3b8" }}>Pehle: {skill.before}%</div>
                    <div style={{ flex: 1, height: 6, background: "#334155", borderRadius: 3 }}><div style={{ width: `${skill.before}%`, height: "100%", background: "#ef4444", borderRadius: 3 }}/></div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, marginTop: 8 }}>
                    <div style={{ width: 60, color: "#10b981", fontWeight: 800 }}>Ab: {skill.now}%</div>
                    <div style={{ flex: 1, height: 6, background: "#334155", borderRadius: 3 }}><div style={{ width: `${skill.now}%`, height: "100%", background: "#10b981", borderRadius: 3, boxShadow: "0 0 10px #10b98188" }}/></div>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.promotionCard}>
              <div style={styles.promotionTitle}>🎓 Class 8 ke liye Ready?</div>
              <div style={styles.promotionText}>Sab weak topics clear karo toh Class 8 unlock hoga!</div>
              <div style={styles.promotionProgress}>
                <div style={{ ...styles.promotionBar, width: "68%" }} />
              </div>
              <div style={styles.promotionLabel}>68% complete</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  app: { fontFamily: "'Nunito', system-ui, sans-serif", background: "#0f172a", minHeight: "100vh", color: "#f1f5f9", maxWidth: 420, margin: "0 auto", display: "flex", flexDirection: "column" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#1e293b", borderBottom: "1px solid #334155" },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  avatar: { fontSize: 36 },
  studentName: { fontWeight: 700, fontSize: 16 },
  classLabel: { fontSize: 12, color: "#94a3b8" },
  headerRight: { display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" },
  coinBadge: { background: "#eab30820", color: "#eab308", padding: "3px 10px", borderRadius: 20, fontSize: 13, fontWeight: 800 },
  streakBadge: { background: "#f59e0b20", color: "#fbbf24", padding: "3px 10px", borderRadius: 20, fontSize: 13, fontWeight: 700 },
  nav: { display: "flex", background: "#1e293b", borderBottom: "1px solid #334155" },
  navBtn: { flex: 1, padding: "10px 4px", background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  navBtnActive: { color: "#6366f1", borderBottom: "2px solid #6366f1" },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 10, fontWeight: 600 },
  content: { flex: 1, padding: "16px 16px 100px", overflowY: "auto" },
  greeting: { fontSize: 22, fontWeight: 800, marginBottom: 4 },
  greetingSub: { fontSize: 14, color: "#94a3b8", fontWeight: 400 },
  planCard: { background: "#1e293b", borderRadius: 16, padding: 16, marginTop: 16, border: "1px solid #334155" },
  planHeader: { display: "flex", justifyContent: "space-between", fontWeight: 700, marginBottom: 12, fontSize: 15 },
  planCount: { background: "#6366f120", color: "#818cf8", padding: "2px 10px", borderRadius: 20, fontSize: 13 },
  planSection: { marginBottom: 12 },
  planTag: { padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700, marginBottom: 8, display: "inline-block" },
  planItem: { display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid #334155" },
  subjectDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  planItemText: { flex: 1, fontSize: 13, color: "#cbd5e1" },
  planScore: { fontSize: 12, color: "#ef4444", fontWeight: 700 },
  startBtn: { width: "100%", padding: "14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", marginTop: 12 },
  statsRow: { display: "flex", gap: 10, marginTop: 16 },
  statCard: { flex: 1, background: "#1e293b", borderRadius: 12, padding: 12, textAlign: "center", border: "1px solid" },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 800 },
  statLabel: { fontSize: 11, color: "#64748b" },
  aryaCard: { display: "flex", alignItems: "center", gap: 12, background: "#1e293b", borderRadius: 12, padding: 14, marginTop: 12, border: "1px solid #334155", cursor: "pointer" },
  aryaAvatar: { fontSize: 32 },
  aryaMessage: { flex: 1 },
  aryaName: { fontWeight: 700, fontSize: 13, color: "#818cf8" },
  aryaText: { fontSize: 13, color: "#cbd5e1", marginTop: 2 },
  aryaArrow: { fontSize: 24, color: "#475569" },
  quizProgress: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 },
  quizCount: { fontSize: 13, color: "#94a3b8", minWidth: 50, fontWeight: 700 },
  progressBar: { flex: 1, height: 8, background: "#334155", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: 4, transition: "width 0.4s ease" },
  subjectBadge: { padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700, display: "inline-block", marginBottom: 12 },
  questionCard: { background: "#1e293b", borderRadius: 16, padding: 20, border: "1px solid #334155" },
  question: { fontSize: 17, fontWeight: 700, lineHeight: 1.5, marginBottom: 20 },
  option: { width: "100%", padding: "14px 16px", margin: "8px 0", background: "#0f172a", border: "2px solid #334155", borderRadius: 12, color: "#f1f5f9", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left", transition: "all 0.2s" },
  optionLabel: { width: 28, height: 28, background: "#334155", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 },
  optionSelected: { borderColor: "#6366f1", background: "#6366f120" },
  optionCorrect: { borderColor: "#10b981", background: "#10b98115" },
  optionWrong: { borderColor: "#ef4444", background: "#ef444415" },
  optionIcon: { marginLeft: "auto", fontSize: 18 },
  resultCard: { marginTop: 16, padding: 16, borderRadius: 12, border: "2px solid" },
  resultText: { fontWeight: 700, fontSize: 15, marginBottom: 8 },
  coinEarned: { color: "#eab308", fontWeight: 800, fontSize: 16, marginBottom: 12, animation: "pop .3s" },
  coinLost: { color: "#ef4444", fontWeight: 800, fontSize: 16, marginBottom: 12, animation: "pop .3s" },
  nextBtn: { background: "linear-gradient(135deg, #10b981, #059669)", border: "none", borderRadius: 10, color: "#fff", padding: "12px 24px", fontWeight: 800, fontSize: 15, cursor: "pointer" },
  skipBtn: { width: "100%", marginTop: 12, padding: "12px", background: "transparent", border: "1px dashed #334155", borderRadius: 10, color: "#64748b", cursor: "pointer", fontSize: 13 },
  completeScreen: { textAlign: "center", padding: "40px 20px" },
  completeEmoji: { fontSize: 72, marginBottom: 16 },
  completeTitle: { fontSize: 28, fontWeight: 800, marginBottom: 12 },
  completeStats: { color: "#94a3b8", marginBottom: 8, fontSize: 15 },
  nextReview: { color: "#10b981", fontWeight: 700, margin: "16px 0 24px" },
  chatScreen: { display: "flex", flexDirection: "column", height: "calc(100vh - 180px)" },
  chatHeader: { display: "flex", alignItems: "center", gap: 10, padding: "12px 0 16px", borderBottom: "1px solid #334155", marginBottom: 12 },
  chatAvatar: { fontSize: 32 },
  chatName: { fontWeight: 700 },
  chatStatus: { fontSize: 12, color: "#10b981" },
  messages: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 },
  message: { display: "flex", alignItems: "flex-end", gap: 8 },
  messageStudent: { flexDirection: "row-reverse" },
  messageArya: { flexDirection: "row" },
  msgAvatar: { fontSize: 24, flexShrink: 0 },
  msgBubble: { maxWidth: "80%", padding: "12px 14px", borderRadius: 16, fontSize: 14, lineHeight: 1.5 },
  bubbleArya: { background: "#1e293b", borderBottomLeftRadius: 4 },
  bubbleStudent: { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderBottomRightRadius: 4 },
  typing: { color: "#64748b", letterSpacing: 2 },
  chatInput: { display: "flex", gap: 8, paddingTop: 12, borderTop: "1px solid #334155" },
  input: { flex: 1, padding: "12px 16px", background: "#1e293b", border: "1px solid #334155", borderRadius: 12, color: "#f1f5f9", fontSize: 14, outline: "none" },
  sendBtn: { padding: "12px 16px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 12, color: "#fff", fontSize: 18, cursor: "pointer" },
  progressTitle: { fontSize: 20, fontWeight: 800, marginBottom: 16 },
  subjectProgress: { background: "#1e293b", borderRadius: 12, padding: 14, marginBottom: 10, border: "1px solid #334155" },
  subjectHeader: { display: "flex", justifyContent: "space-between", fontWeight: 700, marginBottom: 8 },
  subjectBar: { height: 8, background: "#334155", borderRadius: 4, overflow: "hidden" },
  subjectFill: { height: "100%", borderRadius: 4, transition: "width 0.4s ease" },
  weakNote: { fontSize: 12, color: "#f59e0b", marginTop: 6 },
  promotionCard: { background: "linear-gradient(135deg, #1e293b, #0f172a)", border: "2px solid #6366f1", borderRadius: 16, padding: 20, marginTop: 16, textAlign: "center" },
  promotionTitle: { fontSize: 18, fontWeight: 800, marginBottom: 8 },
  promotionText: { fontSize: 13, color: "#94a3b8", marginBottom: 16 },
  promotionProgress: { height: 10, background: "#334155", borderRadius: 5, overflow: "hidden", marginBottom: 8 },
  promotionBar: { height: "100%", background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: 5 },
  promotionLabel: { fontSize: 13, color: "#818cf8", fontWeight: 700 }
};