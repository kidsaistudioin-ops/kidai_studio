'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  red: '#ef4444', text: '#f1f5f9', muted: '#64748b'
};

const WORD_LIST = ['CAT', 'DOG', 'SUN', 'BOOK', 'LION', 'TIGER', 'MOON', 'STAR', 'BLUE', 'RED', 'APPLE', 'WATER', 'FIRE', 'EARTH', 'SPACE', 'ROBOT', 'KIDAI', 'SMART', 'BRAIN', 'SPEED'];

export default function TypingNinjaGame() {
  const [words, setWords] = useState([]);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  
  const requestRef = useRef();
  const wordsRef = useRef(words);
  const livesRef = useRef(lives);
  const scoreRef = useRef(score);
  
  useEffect(() => { wordsRef.current = words; }, [words]);
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  // 🔗 BACKEND LINK: XP Save karna
  const saveGameResult = async (finalScore) => {
    try {
      const studentId = 'student_123';
      const calcXp = Math.floor(finalScore / 5); // Har 5 score par 1 XP
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
    setWords([{ id: Date.now(), text: WORD_LIST[0], x: 40, y: 0 }]);
    setInput('');
    setScore(0);
    setLives(3);
    setIsPlaying(true);
    setGameOver(false);
  };

  // Game Loop
  useEffect(() => {
    if (!isPlaying) return;
    
    const updateGame = () => {
      setWords(prevWords => {
        let newWords = prevWords.map(w => ({ ...w, y: w.y + 0.3 + (score * 0.01) })); // Speed badhegi score ke sath
        
        // Check missed words (Neeche gir gaye)
        const missed = newWords.filter(w => w.y > 90);
        if (missed.length > 0) {
          setLives(l => {
            const newLives = l - missed.length;
            if (newLives <= 0) {
              setIsPlaying(false);
              setGameOver(true);
              saveGameResult(scoreRef.current);
            }
            return newLives;
          });
        }
        
        newWords = newWords.filter(w => w.y <= 90); // Zameen se upar wale
        
        // Random word spawn
        if (Math.random() < 0.01 + (score * 0.0005) && newWords.length < 5) {
          const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
          newWords.push({ id: Date.now(), text: randomWord, x: Math.random() * 70 + 10, y: 0 });
        }
        return newWords;
      });
      requestRef.current = requestAnimationFrame(updateGame);
    };
    
    requestRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, score]);

  const handleInputChange = (e) => {
    const val = e.target.value.toUpperCase();
    setInput(val);
    
    // Word destroy check
    const matchIndex = words.findIndex(w => w.text === val);
    if (matchIndex !== -1) {
      setWords(prev => prev.filter((_, i) => i !== matchIndex));
      setScore(s => s + 10);
      setInput('');
    }
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: C.bg, color: C.text, minHeight: '100vh', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Link href="/play" style={{ textDecoration: 'none', color: C.muted, fontSize: 24, marginRight: 16 }}>←</Link>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Typing <span style={{ color: C.orange }}>Ninja</span> 🥷</h1>
      </div>

      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', background: C.card, padding: 16, borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 16 }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Score: <span style={{ color: C.cyan }}>{score}</span></div>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Lives: <span style={{ color: C.red }}>{'❤️'.repeat(Math.max(0, lives))}</span></div>
        </div>

        <div style={{ position: 'relative', width: '100%', height: '400px', background: `linear-gradient(180deg, ${C.card2}, #000)`, border: `2px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          {!isPlaying && !gameOver && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>⌨️</div>
              <p style={{ color: C.muted, marginBottom: 20 }}>Words ko neeche girne se pehle type karo!</p>
              <button onClick={startGame} style={{ background: C.orange, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>Start Game ▶</button>
            </div>
          )}
          
          {gameOver && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%', background: C.card, padding: 20, borderRadius: 16, zIndex: 10 }}>
              <div style={{ fontSize: 50, marginBottom: 10 }}>💀</div>
              <h2 style={{ color: C.red, margin: 0, marginBottom: 10 }}>Game Over!</h2>
              <p style={{ color: C.muted, marginBottom: 20 }}>Final Score: {score}</p>
              {earnedXp > 0 && <div style={{ background: C.cyan, color: '#000', padding: '4px 12px', borderRadius: 20, fontWeight: 900, marginBottom: 16, display: 'inline-block' }}>+{earnedXp} XP Earned! ⚡</div>}
              <button onClick={startGame} style={{ background: C.cyan, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>Try Again 🔄</button>
            </div>
          )}

          {/* Falling Words */}
          {words.map(w => (
            <div key={w.id} style={{ position: 'absolute', left: `${w.x}%`, top: `${w.y}%`, background: C.cyan+'33', color: C.cyan, border: `1px solid ${C.cyan}`, padding: '4px 12px', borderRadius: 8, fontWeight: 900, transition: 'top 0.1s linear', whiteSpace: 'nowrap' }}>
              {w.text}
            </div>
          ))}
          
          {/* Ground Line */}
          <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '5px', background: C.red, boxShadow: `0 0 15px ${C.red}` }}></div>
        </div>

        <input 
          type="text" 
          value={input} 
          onChange={handleInputChange} 
          disabled={!isPlaying || gameOver}
          placeholder={isPlaying ? "Type here quickly!" : "Press start..."}
          style={{ width: '100%', padding: 16, fontSize: 20, borderRadius: 16, border: `2px solid ${C.orange}`, background: C.card, color: C.text, textAlign: 'center', outline: 'none', fontWeight: 900, textTransform: 'uppercase' }}
          autoFocus
        />
      </div>
    </div>
  );
}