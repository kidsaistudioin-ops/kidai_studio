'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

const C = {
  bg: '#07090f', card: '#0f1520', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  text: '#f1f5f9', muted: '#64748b'
};

export default function PlayArenaHub() {
  const router = useRouter();

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, padding: 16 }}>
      <style>{`
        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.8); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Link href="/home" style={{ textDecoration: 'none', color: C.muted, fontSize: 24, marginRight: 16 }}>←</Link>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Play <span style={{ color: C.orange }}>Arena</span> 🎮</h1>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 10, height: 10, background: C.green, borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          <div style={{ fontWeight: 800, color: C.green, fontSize: 14 }}>17 Groups Live Right Now</div>
        </div>
        <div style={{ fontSize: 12, color: C.muted }}>Apne doston ke saath khelo ya Arya (AI) ko harane ka try karo!</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Snakes & Ladders */}
        <div onClick={() => router.push('/play-animation/snakes-ladder')} style={{ background: `linear-gradient(135deg, ${C.cyan}22, ${C.purple}22)`, border: `1px solid ${C.cyan}44`, borderRadius: 16, padding: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 40 }}>🐍</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Saanp Seedi</div>
            <div style={{ fontSize: 12, color: C.muted, display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              Play vs Arya
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${C.green}22`, color: C.green, padding: '2px 6px', borderRadius: 8, fontWeight: 700, fontSize: 10 }}>
                <span style={{ width: 6, height: 6, background: C.green, borderRadius: '50%', animation: 'pulse-green 2s infinite' }} />
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Chess */}
        <div onClick={() => router.push('/play/chess')} style={{ background: `linear-gradient(135deg, ${C.orange}22, ${C.card})`, border: `1px solid ${C.orange}44`, borderRadius: 16, padding: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 40 }}>♟️</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Chess (Chase)</div>
            <div style={{ fontSize: 12, color: C.muted, display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              Mind Game vs Arya
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${C.green}22`, color: C.green, padding: '2px 6px', borderRadius: 8, fontWeight: 700, fontSize: 10 }}>
                <span style={{ width: 6, height: 6, background: C.green, borderRadius: '50%', animation: 'pulse-green 2s infinite' }} />
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}