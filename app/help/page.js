'use client';
import Link from 'next/link';
import Btn from '@/components/ui/Btn';

const C = { bg:'#07090f', card:'#0f1520', card2:'#161e30', border:'#1e2d45', purple:'#7c3aed', pink:'#ec4899', text:'#f1f5f9', muted:'#64748b' };

export default function Help() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ color: C.muted, textDecoration: 'none', fontSize: 24, marginRight: 16 }}>←</Link>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Support <span style={{ color: C.pink }}>Desk</span></h1>
        </div>
        
        <div style={{ background: `linear-gradient(135deg, ${C.card2}, ${C.bg})`, border: `1px dashed ${C.purple}`, borderRadius: 24, padding: 24, textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 8px 0', color: C.pink }}>🎧 Help Desk</h2>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Koi problem aa rahi hai? Hum yahan hain!</p>
          <input placeholder="Aapka Email" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, color: C.text, marginBottom: 10, outline: 'none' }} />
          <textarea placeholder="Apni problem yahan likhiye..." rows={4} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, color: C.text, marginBottom: 16, outline: 'none', resize: 'none', fontFamily: 'inherit' }} />
          <Btn full color={C.purple} onClick={() => alert("✅ Message sent! Hum jaldi aapse contact karenge.")}>📩 Send Message</Btn>
        </div>
      </div>
    </div>
  );
}
