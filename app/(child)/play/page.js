'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#07090f', card: '#0f1520', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  text: '#f1f5f9', muted: '#64748b'
};

const GAMES = [
  { id: 'chess', title: 'Chess (Chase)', emoji: '♟️', path: '/play/chess', color: C.cyan, desc: 'Play with Arya AI or pass & play!' },
  { id: 'ludo', title: 'Ludo Race', emoji: '🎲', path: '/play/ludo-game', color: C.orange, desc: '4-Player classic racing game.' },
  { id: 'carrace', title: 'Car Race', emoji: '🏎️', path: '/play/car-race-game', color: C.green, desc: 'Dodge the rocks & survive!' },
  { id: 'snakes', title: 'Snakes & Ladders', emoji: '🐍', path: '/play/snake-ladder', color: C.purple, desc: 'Climb up, but watch out for snakes!' },
  { id: 'quiz', title: 'Smart Quiz', emoji: '🧠', path: '/play/quiz', color: C.orange, desc: 'Test your knowledge with Arya!' }
];

export default function PlayDashboard() {
  const router = useRouter();
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function fetchCoins() {
      const studentId = 'student_123'; // NOTE: Baad me real logged-in ID aayegi
      const { data } = await supabase.from('students').select('coins').eq('id', studentId).single();
      if (data) setCoins(data.coins || 0);
      setLoading(false);
    }
    fetchCoins();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handlePlayGame = async (path) => {
    if (loading) return;
    
    if (coins < 10) {
      showToast("❌ Oops! Game khelne ke liye 10 Coins chahiye. 'Seekho' page par jao aur padhai karke Coins kamao! 📚");
      return;
    }

    // Deduct 10 coins
    const newCoins = coins - 10;
    setCoins(newCoins);
    
    // Backend update
    const studentId = 'student_123';
    await supabase.from('students').update({ coins: newCoins }).eq('id', studentId);
    
    // Redirect to game
    router.push(path);
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", padding: 20 }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: C.red, color: '#fff', padding: '12px 20px', borderRadius: 12, fontWeight: 800, fontSize: 14, zIndex: 1000, boxShadow: `0 4px 20px rgba(239, 68, 68, 0.4)`, textAlign: 'center', width: '90%', maxWidth: 400 }}>
          {toastMsg}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30 }}>
        <Link href="/" style={{ textDecoration: 'none', color: C.muted, fontSize: 24, marginRight: 16 }}>←</Link>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Game <span style={{ color: C.purple }}>Zone</span> 🎮</h1>
        <div style={{ marginLeft: 'auto', background: C.card, padding: '8px 16px', borderRadius: 12, border: `2px solid ${C.yellow}`, color: C.yellow, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}>
          🪙 {loading ? '...' : coins}
        </div>
      </div>

      <div style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>
        Apna favourite game choose karo! Har game ki entry fee <strong style={{ color: C.yellow }}>10 Coins</strong> hai.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
        {GAMES.map((g) => (
          <div key={g.id} onClick={() => handlePlayGame(g.path)} style={{ background: C.card, border: `2px solid ${C.border}`, borderRadius: 16, padding: 20, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 0 ${g.color}22`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, background: C.yellow, color: '#000', fontSize: 10, fontWeight: 900, padding: '4px 8px', borderBottomLeftRadius: 12 }}>
              -10 🪙
            </div>
            <div style={{ fontSize: 48, marginBottom: 12, filter: `drop-shadow(0 4px 8px ${g.color}66)` }}>{g.emoji}</div>
            <div style={{ fontWeight: 900, fontSize: 16, color: g.color, marginBottom: 6 }}>{g.title}</div>
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.4 }}>{g.desc}</div>
            <button style={{ marginTop: 16, width: '100%', padding: '8px', background: `${g.color}22`, color: g.color, border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>Play Now ▶</button>
          </div>
        ))}
      </div>
    </div>
  );
}