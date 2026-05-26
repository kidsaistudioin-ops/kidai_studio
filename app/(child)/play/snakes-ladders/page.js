'use client';

import Link from 'next/link';
import { GameBoard } from '@/components/games-animation/snakeLadderAnimated';

export default function SnakesLaddersPage() {
  return (
    <div style={{ padding: 16, background: '#07090f', minHeight: '100vh', color: '#f1f5f9', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Link href="/play" style={{ textDecoration: 'none', color: '#64748b', fontSize: 24, marginRight: 16 }}>←</Link>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Snakes & <span style={{ color: '#10b981' }}>Ladders</span> 🐍</h1>
      </div>
      
      <GameBoard />
      
    </div>
  );
}