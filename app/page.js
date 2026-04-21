'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LandingChatbot from '@/components/ui/LandingChatbot';
import MainHeader from '@/components/ui/MainHeader';
import MainFooter from '@/components/ui/MainFooter';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  yellow: '#f59e0b', pink: '#ec4899', text: '#f1f5f9', muted: '#64748b'
};

const GUEST_QUIZ = [
  { id: 'math', name: 'Table Battle', emoji: '⚔️', color: C.cyan, subject: 'Math', question: '7 × 8 = ?', opts: ['54', '56', '63', '48'], correct: 1 },
  { id: 'science', name: 'Space Quiz', emoji: '🚀', color: C.purple, subject: 'Science', question: 'Hamare solar system mein kitne planets hain?', opts: ['7', '8', '9', '10'], correct: 1 },
  { id: 'english', name: 'Word Hunt', emoji: '🔤', color: C.green, subject: 'English', question: "'Enormous' ka matlab kya hai?", opts: ['Chota', 'Bahut bada', 'Tez', 'Thaka'], correct: 1 }
];

// Reusable Button Style
const btnStyle = (color, full = false, ghost = false) => ({
  padding: '12px 20px', borderRadius: 13, border: ghost ? `1.5px solid ${color}` : 'none',
  background: ghost ? 'transparent' : `linear-gradient(135deg, ${color}, ${color}cc)`,
  color: ghost ? color : '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer',
  width: full ? '100%' : 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  gap: 6, boxShadow: ghost ? 'none' : `0 4px 14px ${color}44`, fontFamily: 'inherit'
});

function GuestGame({ game, onDone }) {
  const [picked, setPicked] = useState(null);
  const done = picked !== null;
  return (
    <div style={{ background: C.card, border: `1px solid ${game.color}44`, borderRadius: 18, padding: 16 }}>
      <div style={{ fontWeight: 800, fontSize: 15, color: game.color, marginBottom: 12 }}>{game.emoji} {game.name}</div>
      <div style={{ background: C.card2, borderRadius: 14, padding: 14, fontSize: 14, fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>{game.question}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {game.opts.map((opt, i) => {
          const isC = i === game.correct, isP = i === picked;
          return (
            <button key={i} onClick={() => { if (!done) setPicked(i); }} style={{ padding: '11px 14px', borderRadius: 12, fontFamily: 'inherit', border: `2px solid ${done ? isC ? C.green : isP ? C.red : C.border : C.border}`, background: done ? isC ? C.green + '22' : isP ? C.red + '22' : C.card2 : C.card2, color: C.text, fontSize: 14, fontWeight: 700, cursor: done ? 'default' : 'pointer', textAlign: 'left' }}>
              {done && isC ? '✅ ' : done && isP ? '❌ ' : `${['A', 'B', 'C', 'D'][i]}. `}{opt}
            </button>
          );
        })}
      </div>
      {done && <button style={btnStyle(game.color, true)} onClick={onDone}>Agle Game →</button>}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [activeGame, setActiveGame] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const MAX_FREE = 3;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2000);
  };

  const startGame = (game) => {
    if (gamesPlayed >= MAX_FREE) return;
    setActiveGame(game);
  };

  const gameDone = () => {
    const next = gamesPlayed + 1;
    setGamesPlayed(next);
    setActiveGame(null);
    if (next < MAX_FREE) showToast('✅ +10 XP!');
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", scrollBehavior: 'smooth' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .nav-link { color: ${C.muted}; text-decoration: none; font-weight: 700; font-size: 13px; transition: color 0.2s; }
        .nav-link:hover { color: ${C.cyan}; }
        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.8); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>

      {/* Simple Toast */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: 64, left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg, ${C.orange}, ${C.purple})`, color: '#fff', padding: '8px 20px', borderRadius: 99, fontWeight: 800, fontSize: 13, zIndex: 200, boxShadow: `0 4px 20px ${C.orange}88` }}>
          {toastMsg}
        </div>
      )}

      {/* Naya Clean Header */}
      <MainHeader />

      <div style={{ padding: '0 16px 32px', maxWidth: 600, margin: '0 auto' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '28px 0 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 10, display: 'inline-block', animation: 'bounce 3s ease infinite' }}>🤖</div>
          <h1 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 30, fontWeight: 800, lineHeight: 1.1, marginBottom: 8 }}>
            Bacchon Ka<br /><span style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.yellow}, ${C.pink})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200%', animation: 'shimmer 3s linear infinite' }}>AI School</span>
          </h1>
          <p style={{ color: C.muted, fontSize: 14, maxWidth: 320, margin: '0 auto 20px', lineHeight: 1.6 }}>6-18 saal ke bacho ke liye — AI seekho, games banao, homework fun banao!</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={btnStyle(C.orange)} onClick={() => router.push('/signup')}>✅ Free Mein Shuru Karo</button>
          </div>
        </div>

        {/* Top 4 Buttons (2x2 Grid) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '🤖', title: 'Arya AI Tutor', desc: 'AI Chat se baat karo', color: C.cyan, path: '/chat' },
            { icon: '📸', title: 'Smart Scanner', desc: 'Homework scan', color: C.purple, path: '/scanner' },
            { icon: '🎲', title: 'Multiplayer', desc: 'Ludo, Chess khelo', color: C.green, path: '/play' },
            { icon: '💰', title: 'Earn Mode', desc: 'Jobs & Pocket money', color: C.yellow, path: '/earn' },
          ].map(f => (
            <div 
              key={f.title} 
              onClick={() => router.push(f.path)} 
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 12px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 4px 14px rgba(0,0,0,0.2)` }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4, color: f.color }}>{f.title}</div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.3 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[['6-18', 'Saal', C.orange], ['50+', 'AI Skills', C.cyan], ['∞', 'Games', C.green]].map(([n, l, c]) => (
            <div key={l} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: c, fontFamily: "'Baloo 2', cursive" }}>{n}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Free Games */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>🎮 Free Games — Abhi Khelo!</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>{gamesPlayed < MAX_FREE ? `${MAX_FREE - gamesPlayed} games bache — koi login nahi!` : 'Account banao — unlimited games!'}</div>
          
          {activeGame ? <GuestGame game={activeGame} onDone={gameDone} /> : gamesPlayed >= MAX_FREE ? (
            <div style={{ background: `linear-gradient(135deg, ${C.green}22, ${C.cyan}11)`, border: `1px solid ${C.green}44`, borderRadius: 14, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔓</div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>3 Games Try Kar Liye!</div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>Free account se unlimited access — 30 seconds mein!</div>
              <button style={btnStyle(C.green, true)} onClick={() => router.push('/signup')}>✅ Free Account Banao</button>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>No credit card • No spam</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {GUEST_QUIZ.map((game) => (
                <div key={game.id} onClick={() => startGame(game)} style={{ display: 'flex', alignItems: 'center', gap: 14, background: `linear-gradient(135deg, ${game.color}15, ${C.card})`, border: `1px solid ${game.color}33`, borderRadius: 14, padding: 14, cursor: 'pointer' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: game.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{game.emoji}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{game.name}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{game.subject}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: 18, color: game.color }}>▶</div>
                </div>
              ))}
              {/* Naye users ko signup ke liye bhejein taki 404 na aaye */}
              <button style={{...btnStyle(C.purple, true), marginTop: 4}} onClick={() => router.push('/signup')}>🌟 View 50+ Games Library</button>
            </div>
          )}
        </div>

        {/* Age Sections */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}>👦👧 Umar Ke Hisab Se</div>
          {[['9-12', '🌱', C.green, 'Games + Fun Learning', 'Drag & drop, animated math, homework scanner'], ['12-15', '🔧', C.cyan, 'Creator Mode', 'Game builder, story engine, AI tools sikhna'], ['15-18', '🚀', C.orange, 'Earn Mode', 'Real projects, company work, paise kamao']].map(([age, icon, color, title, desc]) => (
            <div key={age} style={{ background: C.card2, borderRadius: 14, padding: 12, marginBottom: 8, borderLeft: `4px solid ${color}` }}>
              <div style={{ fontWeight: 800, fontSize: 13, color }}>{icon} {age} Saal — {title}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{desc}</div>
            </div>
          ))}
        </div>

        <button style={btnStyle(C.orange, true)} onClick={() => router.push('/signup')}>🚀 Abhi Shuru Karo — Free!</button>
      </div>

      {/* Naya API Connected Chatbot */}
      <LandingChatbot />

      {/* Naya Clean Footer Jisme Saare Links Hain */}
      <MainFooter />
    </div>
  );
}
    