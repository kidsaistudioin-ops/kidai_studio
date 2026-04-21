'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  text: '#f1f5f9', muted: '#64748b'
};

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

export default function MemoryMatchGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // indices of currently flipped cards
  const [solved, setSolved] = useState([]); // indices of solved cards
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [winner, setWinner] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  
  const movesRef = useRef(moves);
  useEffect(() => { movesRef.current = moves; }, [moves]);

  useEffect(() => {
    startNewGame();
  }, []);

  // 🔗 BACKEND LINK: Game jeetne par XP save karna
  const saveGameResult = async (finalMoves) => {
    try {
      const studentId = 'student_123'; // Baad me real auth id aayegi
      // Base 50 XP. Har extra move par -2 XP. Minimum 10 XP.
      const calcXp = Math.max(10, 50 - ((finalMoves - 8) * 2)); 
      setEarnedXp(calcXp);

      // Total XP Update
      const { data: student } = await supabase.from('students').select('total_xp').eq('id', studentId).single();
      if (student) {
        await supabase.from('students').update({ total_xp: (student.total_xp || 0) + calcXp }).eq('id', studentId);
      }

      // Daily Session Update
      const today = new Date().toISOString().split('T')[0];
      const { data: session } = await supabase.from('daily_sessions').select('*').eq('student_id', studentId).eq('session_date', today).single();
      if (session) {
        await supabase.from('daily_sessions').update({ xp_earned: (session.xp_earned || 0) + calcXp }).eq('id', session.id);
      } else {
        await supabase.from('daily_sessions').insert({ student_id: studentId, session_date: today, xp_earned: calcXp });
      }
    } catch (err) {
      console.error("Error saving XP:", err);
    }
  };

  const startNewGame = () => {
    const shuffledCards = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setWinner(false);
    setDisabled(false);
  };

  const handleCardClick = (index) => {
    if (disabled || flipped.includes(index) || solved.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves(m => m + 1);
      
      const firstCard = cards[newFlipped[0]].emoji;
      const secondCard = cards[newFlipped[1]].emoji;

      if (firstCard === secondCard) {
        setSolved([...solved, ...newFlipped]);
        setFlipped([]);
        setDisabled(false);
        if (solved.length + 2 === cards.length) {
          setTimeout(() => {
            setWinner(true);
            saveGameResult(movesRef.current + 1);
          }, 500);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000); // 1 second dikhakar wapas palat do
      }
    }
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: C.bg, color: C.text, minHeight: '100vh', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Link href="/play" style={{ textDecoration: 'none', color: C.muted, fontSize: 24, marginRight: 16 }}>←</Link>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Memory <span style={{ color: C.purple }}>Match</span> 🧠</h1>
        <button onClick={startNewGame} style={{ marginLeft: 'auto', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>🔄 Reset</button>
      </div>

      <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: C.card, padding: '12px 20px', borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800 }}>Moves: <span style={{ color: C.cyan }}>{moves}</span></div>
          <div style={{ fontWeight: 800 }}>Matched: <span style={{ color: C.green }}>{solved.length / 2} / 8</span></div>
        </div>

        {winner ? (
          <div style={{ background: C.green+'22', padding: 30, borderRadius: 16, border: `2px solid ${C.green}` }}>
            <div style={{ fontSize: 64, marginBottom: 10 }}>🏆</div>
            <h2 style={{ color: C.green, margin: 0, fontSize: 24 }}>Awesome Memory!</h2>
            <p style={{ color: C.muted, marginTop: 10 }}>Aapne sirf {moves} moves mein game jeet liya.</p>
            <div style={{ display: 'inline-block', background: C.green, color: '#000', padding: '6px 16px', borderRadius: 20, fontWeight: 900, marginTop: 10 }}>+{earnedXp} XP Earned! ⚡</div>
            <button onClick={startNewGame} style={{ background: C.green, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: 'pointer', marginTop: 10 }}>Play Again</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {cards.map((card, index) => {
              const isFlipped = flipped.includes(index) || solved.includes(index);
              return (
                <div 
                  key={index}
                  onClick={() => handleCardClick(index)}
                  style={{
                    aspectRatio: '1',
                    perspective: '1000px',
                    cursor: isFlipped ? 'default' : 'pointer'
                  }}
                >
                  <div style={{
                    width: '100%', height: '100%', position: 'relative',
                    transition: 'transform 0.6s', transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}>
                    {/* Card Back (Question Mark) */}
                    <div style={{ width: '100%', height: '100%', position: 'absolute', backfaceVisibility: 'hidden', background: `linear-gradient(135deg, ${C.card2}, ${C.border})`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, border: `2px solid ${C.card}` }}>
                      ❓
                    </div>
                    {/* Card Front (Emoji) */}
                    <div style={{ width: '100%', height: '100%', position: 'absolute', backfaceVisibility: 'hidden', background: solved.includes(index) ? C.green+'44' : C.card, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, transform: 'rotateY(180deg)', border: `2px solid ${solved.includes(index) ? C.green : C.purple}` }}>
                      {card.emoji}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}