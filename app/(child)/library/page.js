'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { speak } from '@/lib/voice';
import ReportButton from '@/components/ui/ReportButton';
import { useRouter } from 'next/navigation';

const T = {
  bg: "#07090f", card: "#0f1520", card2: "#161e30", border: "#1e2d45",
  orange: "#ff6b35", purple: "#7c3aed", cyan: "#06b6d4", green: "#10b981",
  yellow: "#f59e0b", pink: "#ec4899", text: "#f1f5f9", muted: "#64748b", red: "#ef4444"
};

const TABS = [
  { id: 'all', label: 'Sabhi', icon: '📚' },
  { id: 'science', label: 'Science', icon: '🔬' },
  { id: 'maths', label: 'Maths', icon: '➗' },
  { id: 'english', label: 'English', icon: '📝' },
  { id: 'general', label: 'Mixed', icon: '🔀' }
];

function AIGeneratedGame({ gameData, gameId, studentId, onComplete, onReported }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  if (!gameData || !gameData.questions || gameData.questions.length === 0) {
    return <div style={{ color: T.text, textAlign: 'center', padding: 20 }}>Game load ho raha hai...</div>;
  }

  const question = gameData.questions[current];  
  const qText = question.gameQ || question.q || question.question || "Answer this:";
  const qTextHin = question.gameQ_hin || "";
  const options = question.opts || question.options || [];
  const optionsHin = question.opts_hin || [];

  const checkAnswer = (idx) => {
    if (idx === question.correct) {
      setFeedback("correct");
      setScore(score + 10);
      speak("Correct! Bahut badhiya");
      setTimeout(() => {
        setFeedback(null);
        if (current < gameData.questions.length - 1) {
          setCurrent(current + 1);
        } else {
          onComplete(score + 10);
        }
      }, 1500);
    } else {
      setFeedback("wrong");
      speak("Oops, Try again!");
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const btnStyle = {
    color: "#fff", border: "none", borderRadius: 12, padding: "16px",
    fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "transform 0.2s",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 4
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div style={{ color: T.orange, fontWeight: 800, marginBottom: 10, fontSize: 14 }}>
        ✨ {gameData.title || "Scanned Mission"}
      </div>
      <h2 style={{ color: T.cyan, marginBottom: 5, fontSize: 22, lineHeight: 1.4 }}>
        {qText}
      </h2>
      {qTextHin && (
        <div style={{ color: T.muted, fontSize: 16, marginBottom: 15, fontStyle: 'italic', fontWeight: 600 }}>
          ({qTextHin})
        </div>
      )}
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, maxWidth: 400, margin: "20px auto" }}>
        {options.map((opt, idx) => (
          <button 
            key={idx}
            onClick={() => checkAnswer(idx)}
            style={{ 
              ...btnStyle, 
              border: `2px solid ${feedback === "correct" && idx === question.correct ? T.green : feedback === "wrong" && idx !== question.correct ? T.red : T.border}`,
              background: feedback === "correct" && idx === question.correct ? T.green + '33' : T.card2,
            }}
          >
            <span style={{ fontWeight: 800 }}>{opt}</span>
            {optionsHin[idx] && <span style={{ fontSize: 13, color: feedback === "correct" && idx === question.correct ? T.green : T.muted, fontWeight: 600 }}>({optionsHin[idx]})</span>}
          </button>
        ))}
      </div>

      {gameId !== 'mega_revgen' && (
        <>
          <div style={{ marginTop: 20 }}>
            <ReportButton gameId={gameId} studentId={studentId} onReported={onReported} />
          </div>
          {gameData.sourceImage && (
            <div style={{ marginTop: 30, padding: 15, background: T.card2, borderRadius: 12, border: `1px dashed ${T.border}` }}>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 10, fontWeight: 800 }}>📷 SCANNED SOURCE</div>
              <img src={gameData.sourceImage} alt="Source" style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8, objectFit: 'contain' }} />
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: 20, color: T.yellow, fontWeight: 700 }}>
        Score: {score} | Q: {current + 1} / {gameData.questions.length}
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [activeGame, setActiveGame] = useState(null);
  const [studentId, setStudentId] = useState("student_123");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sId = localStorage.getItem('kidai_student_id') || 'student_123';
    setStudentId(sId);

    async function fetchMyLibrary() {
      const { data } = await supabase
        .from('library')
        .select('*')
        .eq('student_id', sId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (data) setGames(data);
      setLoading(false);
    }
    fetchMyLibrary();
  }, []);

  const handleGameComplete = (score) => {
    speak(`Amazing! You scored ${score} points!`);
    setActiveGame(null);
  };

  const handleMegaRevGen = () => {
    let allQuestions = [];
    
    filteredGames.forEach(g => {
      if (g.content?.questions && Array.isArray(g.content.questions)) {
        allQuestions = [...allQuestions, ...g.content.questions];
      }
    });

    if (allQuestions.length < 3) {
      alert("Mega Test ke liye kam se kam 3 questions chahiye! Pehle aur pages scan karo. 📚");
      return;
    }

    allQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);

    const megaGame = {
      id: 'mega_revgen',
      title: `${activeTab === 'all' ? 'MIXED' : activeTab.toUpperCase()} MEGA TEST 🏆`,
      subject: activeTab,
      content: {
        title: `${activeTab === 'all' ? 'Mixed' : activeTab} Revision Test`,
        questions: allQuestions
      }
    };

    speak("Get ready for the Mega Test!");
    setActiveGame(megaGame);
  };

  const filteredGames = games.filter(g => {
    if (activeTab === 'all') return true;
    return g.subject?.toLowerCase().includes(activeTab.replace('s',''));
  });

  const possibleQuestionsCount = filteredGames.reduce((acc, g) => acc + (g.content?.questions?.length || 0), 0);

  if (activeGame) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, padding: 20, fontFamily: "system-ui, sans-serif" }}>
        <button onClick={() => setActiveGame(null)} style={{ background: T.card2, color: T.text, border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", marginBottom: 20 }}>← Library Me Wapas</button>
        <div style={{ background: T.card, borderRadius: 20, padding: 30, maxWidth: 600, margin: "0 auto", border: `2px solid ${activeGame.id === 'mega_revgen' ? T.pink : T.cyan}`, boxShadow: `0 0 30px ${activeGame.id === 'mega_revgen' ? T.pink : T.cyan}33` }}>
          <AIGeneratedGame 
            gameData={activeGame.content} 
            gameId={activeGame.id}
            studentId={studentId}
            onComplete={handleGameComplete} 
            onReported={(id) => {
              setGames(games.filter(g => g.id !== id));
              setActiveGame(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 30, padding: "30px 20px", background: `linear-gradient(135deg, ${T.card2}, ${T.card})`, borderRadius: 20, border: `1px solid ${T.border}` }}>
        <h1 style={{ color: "#fff", fontSize: 32, marginBottom: 10 }}>📚 Personal Library</h1>
        <p style={{ color: T.muted, fontSize: 16 }}>Aapke scan kiye hue saare pages aur games yahan safe hain!</p>
        
        <button onClick={() => router.push('/scanner')} style={{ marginTop: 15, background: `linear-gradient(135deg, ${T.orange}, ${T.pink})`, color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 50, fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
          📸 Naya Page Scan Karo
        </button>
      </div>

      <div style={{ display: 'flex', overflowX: 'auto', gap: 10, paddingBottom: 10, marginBottom: 20, justifyContent: 'center' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? `${T.cyan}22` : T.card2,
              border: `2px solid ${activeTab === tab.id ? T.cyan : T.border}`,
              color: activeTab === tab.id ? T.cyan : T.muted,
              padding: '10px 20px', borderRadius: 20, fontSize: 15, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {possibleQuestionsCount >= 3 && (
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <button 
            onClick={handleMegaRevGen}
            style={{
              background: `linear-gradient(135deg, ${T.purple}, ${T.pink})`,
              color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 50,
              fontSize: 18, fontWeight: 900, cursor: 'pointer', boxShadow: `0 8px 25px ${T.purple}66`,
              width: '100%', maxWidth: 400
            }}>
            🔥 MEGA TEST: {activeTab === 'all' ? 'MIXED' : activeTab.toUpperCase()} ({Math.min(possibleQuestionsCount, 10)} Qs)
          </button>
          <p style={{ color: T.muted, fontSize: 12, marginTop: 8 }}>Puraane scans ko mix karke naya test banega!</p>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', color: T.muted, padding: 40 }}>Loading Library... ⏳</div>
      ) : filteredGames.length === 0 ? (
        <div style={{ textAlign: 'center', background: T.card2, padding: 40, borderRadius: 20, border: `1px dashed ${T.border}` }}>
          <div style={{ fontSize: 40, marginBottom: 15 }}>📭</div>
          <h3 style={{ color: T.muted }}>Abhi koi game nahi hai</h3>
          <p style={{ color: T.muted, fontSize: 14 }}>Is subject ki school book ko scan karke naya game banao!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 15, maxWidth: 1000, margin: '0 auto' }}>
          {filteredGames.map((game) => (
            <button key={game.id} onClick={() => setActiveGame(game)} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 15px", cursor: "pointer", textAlign: "center", transition: "transform 0.2s" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📖</div>
              <div style={{ color: T.text, fontWeight: 700, fontSize: 15, marginBottom: 8, lineHeight: 1.3 }}>{game.title}</div>
              <div style={{ background: T.border, color: T.muted, padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 800, display: 'inline-block' }}>
                {game.subject?.toUpperCase() || 'MIXED'}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}