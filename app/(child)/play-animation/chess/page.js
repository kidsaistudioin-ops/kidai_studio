import Link from 'next/link';
import ChessBoard from '@/components/games-animation/chessAnimated/ChessBoard';

export default function AnimatedChessPage() {
  return (
    <div style={{ background: '#07090f', minHeight: '100vh', color: '#f1f5f9', padding: 16, fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Link href="/play-animation" style={{ textDecoration: 'none', color: '#64748b', fontSize: 24, marginRight: 16 }}>←</Link>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Animated <span style={{ color: '#38bdf8' }}>Chess</span> ♟️</h1>
      </div>
      
      <ChessBoard />
    </div>
  );
}
