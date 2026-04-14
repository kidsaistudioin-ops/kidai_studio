'use client';
import Link from 'next/link';

const C = { bg:'#07090f', card:'#0f1520', card2:'#161e30', border:'#1e2d45', cyan:'#06b6d4', text:'#f1f5f9', muted:'#64748b', orange:'#ff6b35' };

export default function About() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ color: C.muted, textDecoration: 'none', fontSize: 24, marginRight: 16 }}>←</Link>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>About <span style={{ color: C.orange }}>KidAI</span></h1>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, margin: 0, color: C.cyan }}>🚀 Humara Mission</h2>
          </div>
          <p style={{ color: C.muted, fontSize: 16, lineHeight: 1.8, textAlign: 'center', margin: 0 }}>
            KidAI Studio India ka pehla AI-powered school hai jahan bacche khel-khel mein seekhte hain. Humara mission hai har bacche ko future-ready banana, chahe wo homework scanner ho, AI tutor Arya ho, ya phir game creation!
          </p>
        </div>
      </div>
    </div>
  );
}
