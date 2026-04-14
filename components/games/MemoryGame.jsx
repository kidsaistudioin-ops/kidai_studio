'use client';
import { useState, useEffect } from 'react';

const C = { card: '#0f1520', card2: '#161e30', border: '#1e2d45', pink: '#ec4899', text: '#f1f5f9', muted: '#64748b' };
const EMOJIS = ['🚀', '🌍', '🦁', '🍕', '🎸', '🎨', '🧩', '⚽']; 

export default function MemoryGame({ onGameEnd }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [disabled, setDisabled] = useState(false);

  // Game start hone par cards ko shuffle karna
  useEffect(() => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    setCards(shuffled);
  }, []);

  const handleFlip = (index) => {
    if (disabled || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves((m) => m + 1);
      
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        // Match ho gaya
        setMatched([...matched, first, second]);
        setFlipped([]);
        setDisabled(false);
        
        // Win condition
        if (matched.length + 2 === cards.length) {
          setTimeout(() => {
            if (onGameEnd) onGameEnd(moves + 1);
          }, 2500);
        }
      } else {
        // Match nahi hua, wapas flip karo
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <div style={{ background: C.card, border: `1px solid ${C.pink}55`, borderRadius: 20, padding: 20, textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
      <div style={{ fontSize: 24, fontWeight: 900, color: C.pink, marginBottom: 8 }}>🧠 Memory Match</div>
      <div style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>Aapke Moves: {moves}</div>

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, maxWidth: 360, margin: '0 auto', perspective: '1000px' }}>
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          return (
            <div key={card.id} onClick={() => handleFlip(i)} style={{ aspectRatio: '1/1', position: 'relative', cursor: 'pointer', transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transition: 'transform 0.4s ease-in-out' }}>
              {/* Front Side (Hidden) */}
              <div style={{ position: 'absolute', width: '100%', height: '100%', background: `linear-gradient(135deg, ${C.pink}, #be185d)`, borderRadius: 16, backfaceVisibility: 'hidden', boxShadow: '0 4px 12px rgba(236,72,153,0.3)' }} />
              
              {/* Back Side (Emoji) */}
              <div style={{ position: 'absolute', width: '100%', height: '100%', background: C.card2, border: `2px solid ${matched.includes(i) ? '#10b981' : C.pink}`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                {card.emoji}
              </div>
            </div>
          );
        })}
      </div>

      {matched.length === cards.length && cards.length > 0 && (
        <div style={{ marginTop: 24, padding: 16, background: `${C.pink}22`, borderRadius: 16, color: C.pink, fontWeight: 800 }}>
          🎉 Superb! Aapne {moves} moves mein jeet liya!
        </div>
      )}
    </div>
  );
}