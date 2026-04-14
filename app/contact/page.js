'use client';
import Link from 'next/link';

const C = { bg:'#07090f', card:'#0f1520', card2:'#161e30', border:'#1e2d45', cyan:'#06b6d4', green:'#10b981', orange:'#ff6b35', text:'#f1f5f9', muted:'#64748b' };

export default function Contact() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ color: C.muted, textDecoration: 'none', fontSize: 24, marginRight: 16 }}>←</Link>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Contact <span style={{ color: C.green }}>Us</span></h1>
        </div>
        
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 24, color: C.text, textAlign: 'center' }}>📞 Humse Judey</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: C.card2, padding: 16, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 28 }}>📧</div>
              <div><div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>Email Us</div><div style={{ fontSize: 16, fontWeight: 800 }}>hello@kidaistudio.in</div></div>
            </div>
            
            <div style={{ background: C.card2, padding: 16, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 28 }}>📱</div>
              <div><div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>WhatsApp / Call</div><div style={{ fontSize: 16, fontWeight: 800 }}>+91 98765 43210</div></div>
            </div>
            
            <div style={{ background: C.card2, padding: 16, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 28 }}>🏢</div>
              <div><div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>Office Address</div><div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.4 }}>KidAI HQ, Tech Park<br/>Sector 62, Noida, UP</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
