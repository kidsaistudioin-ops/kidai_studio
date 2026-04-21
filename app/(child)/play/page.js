'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30 }}>
        <Link href="/" style={{ textDecoration: 'none', color: C.muted, fontSize: 24, marginRight: 16 }}>←</Link>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Game <span style={{ color: C.purple }}>Zone</span> 🎮</h1>
      </div>

      <div style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>
        Apna favourite game choose karo aur khelna shuru karo!
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
        {GAMES.map((g) => (
          <div key={g.id} onClick={() => router.push(g.path)} style={{ background: C.card, border: `2px solid ${C.border}`, borderRadius: 16, padding: 20, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 0 ${g.color}22` }}>
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