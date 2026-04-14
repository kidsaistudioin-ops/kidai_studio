'use client';

import Link from 'next/link';
import GameBoard from '@/components/games-animation/snakeLadderAnimated/GameBoard';

export default function AnimatedSnakeLadderPage() {
  return (
    <div style={{ background: '#07090f', minHeight: '100vh', color: '#f1f5f9', padding: 16, fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Link href="/play" style={{ textDecoration: 'none', color: '#64748b', fontSize: 24, marginRight: 16 }}>←</Link>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Snakes & <span style={{ color: '#10b981' }}>Ladders</span> 🐍</h1>
      </div>
      
      {/* Yahan aap apna SVG paste kar sakte hain (Testing ya Decoration ke liye) */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: 400, margin: '0 auto 20px auto' }}>
        
        {/* 👇 APNA <svg> ... </svg> CODE ISKE NEECHE PASTE KAREIN 👇 */}
        
      </div>

      {/* Main Game Engine Component */}
      <GameBoard />
    </div>
  );
}