'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  red: '#ef4444', yellow: '#f59e0b', text: '#f1f5f9', muted: '#64748b'
};

const generateQuestion = (score) => {
  const isAdd = Math.random() > 0.5;
  const maxNum = 10 + Math.floor(score / 50); // Score badhne par difficult math aayega
  const a = Math.floor(Math.random() * maxNum) + 1;
  const b = Math.floor(Math.random() * maxNum) + 1;
  const correct = isAdd ? a + b : Math.abs(a - b);
  const q = isAdd ? `${a} + ` : `${Math.max(a, b)} - ${Math.min(a, b)}`;
  
  const ansLane = Math.floor(Math.random() * 3);
  const opts = [0, 0, 0];
  opts[ansLane] = correct;
  
  // Fill wrong options
  for(let i=0; i<3; i++) {
    if(i !== ansLane) {
      let wrong = correct + Math.floor(Math.random() * 5) + 1 - 2;
      if (wrong === correct) wrong += 1;
      opts[i] = wrong;
    }
  }
  
  return { q, opts, ansLane };
};

export default function MathRacingGame() {
  const [lane, setLane] = useState(1); // 0: Left, 1: Center, 2: Right
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  
  // Obstacle state: y position and question data
  const [obsY, setObsY] = useState(-20);
  const [question, setQuestion] = useState({ q: 'Press Start', opts: ['?', '?', '?'], ansLane: 1 });
  
  const requestRef = useRef();
  const stateRef = useRef({ lane, obsY, question, score });
  
  useEffect(() => {
    stateRef.current = { lane, obsY, question, score };
  }, [lane, obsY, question, score]);

  // 🔗 BACKEND LINK: XP Save karna
  const saveGameResult = async (finalScore) => {
    try {
      const studentId = 'student_123';
      const calcXp = Math.floor(finalScore / 2); // Har 2 score par 1 XP (Kyunki Math hard hota hai)
      if (calcXp <= 0) return;
      setEarnedXp(calcXp);

      const { data: student } = await supabase.from('students').select('total_xp').eq('id', studentId).single();
      if (student) {
        await supabase.from('students').update({ total_xp: (student.total_xp || 0) + calcXp }).eq('id', studentId);
      }

      const today = new Date().toISOString().split('T')[0];
      const { data: session } = await supabase.from('daily_sessions').select('*').eq('student_id', studentId).eq('session_date', today).single();
      if (session) {
        await supabase.from('daily_sessions').update({ xp_earned: (session.xp_earned || 0) + calcXp }).eq('id', session.id);
      } else {
        await supabase.from('daily_sessions').insert({ student_id: studentId, session_date: today, xp_earned: calcXp });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startGame = () => {
    setLane(1);
    setScore(0);
    setObsY(-20);
    setQuestion(generateQuestion(0));
    setIsPlaying(true);
    setGameOver(false);
  };

  useEffect(() => {
    if (!isPlaying) return;
    
    const updateGame = () => {
      const st = stateRef.current;
      let newY = st.obsY + 1.5 + (st.score * 0.02); // Speed increases with score
      
      // Collision Zone (80% to 95% from top)
      if (newY > 80 && newY < 95 && st.obsY <= 80) {
        if (st.lane === st.question.ansLane) {
          setScore(s => s + 10); // Correct!
        } else {
          setIsPlaying(false);
          setGameOver(true);
          saveGameResult(st.score);
          return;
        }
      }
      
      // Reset obstacle
      if (newY >= 100) {
        newY = -20;
        setQuestion(generateQuestion(st.score));
      }
      
      setObsY(newY);
      requestRef.current = requestAnimationFrame(updateGame);
    };
    
    requestRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') setLane(l => Math.max(0, l - 1));
      if (e.key === 'ArrowRight') setLane(l => Math.min(2, l + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: C.bg, color: C.text, minHeight: '100vh', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Link href="/play" style={{ textDecoration: 'none', color: C.muted, fontSize: 24, marginRight: 16 }}>←</Link>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Math <span style={{ color: C.yellow }}>Racing</span> 🏎️</h1>
        <div style={{ marginLeft: 'auto', background: C.card, padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.cyan}`, color: C.cyan, fontWeight: 900 }}>Score: {score}</div>
      </div>

      <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
        
        {/* The Track */}
        <div style={{ position: 'relative', width: '100%', height: '450px', background: '#334155', border: `4px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          
          {/* Road Lines */}
          <div style={{ position: 'absolute', left: '33.33%', top: 0, height: '100%', borderLeft: '2px dashed #94a3b8' }}></div>
          <div style={{ position: 'absolute', left: '66.66%', top: 0, height: '100%', borderLeft: '2px dashed #94a3b8' }}></div>

          {!isPlaying && !gameOver && (
            <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', zIndex: 10 }}>
              <div style={{ fontSize: 50, marginBottom: 10 }}>🏎️</div>
              <button onClick={startGame} style={{ background: C.green, color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 12, fontWeight: 800, fontSize: 18, cursor: 'pointer' }}>Start Engine ▶</button>
            </div>
          )}

          {gameOver && (
            <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', background: C.card, padding: 20, borderRadius: 16, border: `2px solid ${C.red}`, zIndex: 10 }}>
              <div style={{ fontSize: 50, marginBottom: 10 }}>💥</div>
              <h2 style={{ color: C.red, margin: '0 0 10px 0' }}>Crash!</h2>
              {earnedXp > 0 && <div style={{ background: C.yellow, color: '#000', padding: '4px 12px', borderRadius: 20, fontWeight: 900, marginBottom: 12, display: 'inline-block', fontSize: 14 }}>+{earnedXp} XP Earned! ⚡</div>}
              <button onClick={startGame} style={{ background: C.card2, color: C.text, border: `1px solid ${C.border}`, padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}>Try Again</button>
            </div>
          )}

          {/* Question Display */}
          <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', background: '#000000aa', padding: '10px 20px', borderRadius: 12, fontSize: 24, fontWeight: 900, color: C.yellow, zIndex: 5 }}>
            {question.q} = ?
          </div>

          {/* Approaching Options */}
          <div style={{ position: 'absolute', top: `${obsY}%`, left: 0, width: '100%', display: 'flex', transition: 'top 0.05s linear' }}>
            {question.opts.map((opt, i) => (
              <div key={i} style={{ width: '33.33%', display: 'flex', justifyContent: 'center' }}>
                <div style={{ background: C.card, border: `2px solid ${C.cyan}`, color: C.cyan, padding: '10px', borderRadius: 8, fontWeight: 900, fontSize: 20, boxShadow: `0 5px 15px rgba(0,0,0,0.5)` }}>{opt}</div>
              </div>
            ))}
          </div>

          {/* Player Car */}
          <div style={{ position: 'absolute', bottom: '20px', left: `${lane * 33.33}%`, width: '33.33%', display: 'flex', justifyContent: 'center', transition: 'left 0.2s ease' }}>
            <div style={{ fontSize: 50, filter: 'drop-shadow(0 10px 5px rgba(0,0,0,0.5))' }}>🏎️</div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setLane(l => Math.max(0, l - 1))} style={{ flex: 1, padding: 20, background: C.card, border: `2px solid ${C.border}`, borderRadius: 16, fontSize: 30, cursor: 'pointer' }}>⬅️</button>
          <button onClick={() => setLane(l => Math.min(2, l + 1))} style={{ flex: 1, padding: 20, background: C.card, border: `2px solid ${C.border}`, borderRadius: 16, fontSize: 30, cursor: 'pointer' }}>➡️</button>
        </div>
      </div>
    </div>
  );
}