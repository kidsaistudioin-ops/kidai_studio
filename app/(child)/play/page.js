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
  const [isGuest, setIsGuest] = useState(false);
  const [freePlays, setFreePlays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function fetchCoins() {
      // Check if user is Guest
      const guestMode = localStorage.getItem('kidai_is_guest') === 'true';
      
      setIsGuest(guestMode);
      
      // Sabhi ke liye Free Plays uthao (Signup aur Guest dono ke liye)
      const storedPlays = localStorage.getItem('kidai_free_plays');
      setFreePlays(storedPlays ? parseInt(storedPlays, 10) : 0);

      if (!guestMode) {
        const studentId = 'student_123'; // NOTE: Baad me real logged-in ID aayegi
        const { data } = await supabase.from('students').select('coins').eq('id', studentId).single();
        if (data) setCoins(data.coins || 0);
      }
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

    // Sabse pehle Free Plays check karo (Guest ho ya Signed Up)
    if (freePlays > 0) {
      const newPlays = freePlays - 1;
      setFreePlays(newPlays);
      localStorage.setItem('kidai_free_plays', newPlays.toString());
      router.push(path);
      return;
    }

    // Agar Free Plays khatam ho gaye aur user Guest hai
    if (isGuest) {
      showToast("❌ Free Games khatam! Apne doston ko 'Share' karke 5 games pao, ya account banakar padhai se coins kamao! 🚀");
      return;
    }
    
    if (coins < 10) {
      showToast("❌ Coins khatam! 'Seekho' me padhai karo ya 'Scanner' se homework scan karke coins kamao! Ya Share button dabakar 5 free games lo! 📚");
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

  const handleShareInvite = () => {
    // Dost ko invite karne par 5 extra games ka reward
    const newPlays = freePlays + 5;
    setFreePlays(newPlays);
    localStorage.setItem('kidai_free_plays', newPlays.toString());
    
    showToast("🎉 Link Shared! Aapko aur aapke dost dono ko 5-5 Free Games mil gaye hain!");
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
        
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          {freePlays > 0 && (
            <div style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.purple})`, padding: '8px 16px', borderRadius: 12, color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6, boxShadow: `0 4px 15px ${C.purple}66` }}>
              🎁 {freePlays} Free Plays
            </div>
          )}
          {!isGuest && (
            <div style={{ background: C.card, padding: '8px 16px', borderRadius: 12, border: `2px solid ${C.yellow}`, color: C.yellow, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}>
              🪙 {loading ? '...' : coins}
            </div>
          )}
        </div>
      </div>

      <div style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.card, padding: 16, borderRadius: 12, border: `1px solid ${C.border}`, flexWrap: 'wrap', gap: 10 }}>
          <span>
            {freePlays > 0 
              ? `Aapke paas ${freePlays} Free Plays hain! Har game me 1 Free Play use hoga.` 
              : isGuest 
                ? `Aapke Free Plays khatam ho gaye! Naye games ke liye Share karein.` 
                : `Free Plays khatam! Ab har game ki entry fee 10 Coins hai.`}
          </span>
          <button onClick={handleShareInvite} style={{ background: C.green, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}>Share & Get +5 🎁</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
        {GAMES.map((g) => (
          <div key={g.id} onClick={() => handlePlayGame(g.path)} style={{ background: C.card, border: `2px solid ${C.border}`, borderRadius: 16, padding: 20, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 0 ${g.color}22`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, background: C.yellow, color: '#000', fontSize: 10, fontWeight: 900, padding: '4px 8px', borderBottomLeftRadius: 12 }}>
              {freePlays > 0 ? "-1 Play 🎁" : "-10 🪙"}
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