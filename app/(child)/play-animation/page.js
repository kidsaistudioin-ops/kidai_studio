'use client';

import Link from 'next/link';

export default function AnimatedGamesHub() {
  // Yahan hum apne saare premium games list karenge
  const games = [
    { id: 'snakes-ladder', name: 'Snake & Ladder 3D', icon: '🐍', color: '#10b981', desc: 'Multiplayer board game with AI' },
    { id: 'chess', name: 'Animated Chess', icon: '♟️', color: '#38bdf8', desc: 'Gliding pieces aur smart moves!' },
    // Ludo aur Car Racing hum aage yahin add karenge!
  ];

  return (
    <div style={{ background: '#07090f', minHeight: '100vh', color: '#f1f5f9', padding: 20, fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30 }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', color: '#64748b', fontSize: 24, marginRight: 16 }}>🏠</Link>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Premium <span style={{ color: '#f59e0b' }}>Animated Games</span> 🎮</h1>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {games.map(game => (
          <Link key={game.id} href={`/play-animation/${game.id}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#1e2d45', border: `2px solid ${game.color}55`, borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', gap: 16, transition: 'transform 0.2s', boxShadow: `0 8px 20px ${game.color}11` }}>
              <div style={{ fontSize: 40, filter: `drop-shadow(0 4px 8px ${game.color}66)` }}>{game.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: game.color }}>{game.name}</div>
                <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{game.desc}</div>
              </div>
              <div style={{ color: game.color, fontSize: 24, fontWeight: 900 }}>▶</div>
            </div>
          </Link>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: 40, color: '#64748b', fontSize: 13, fontWeight: 700 }}>🚧 Ludo aur Car Racing jaldi aa rahe hain...</div>
    </div>
  );
}