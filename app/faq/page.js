'use client';
import Link from 'next/link';

const C = { bg:'#07090f', card:'#0f1520', card2:'#161e30', border:'#1e2d45', yellow:'#f59e0b', text:'#f1f5f9', muted:'#64748b', orange:'#ff6b35' };

export default function FAQ() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ color: C.muted, textDecoration: 'none', fontSize: 24, marginRight: 16 }}>←</Link>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Help & <span style={{ color: C.yellow }}>FAQ</span></h1>
        </div>
        
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 24 }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0, color: C.yellow }}>🤔 FAQs</h2>
            <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Aapke sawaal, humare jawaab</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { q: "Kya KidAI free hai?", a: "Haan! Basic account bilkul free hai jisme aap daily 3 games khel sakte hain." },
              { q: "Ye kis age ke bacchon ke liye hai?", a: "Ye platform 6 se 18 saal ke bacchon ke liye design kiya gaya hai. Har age group ke liye alag features hain." },
              { q: "Kya yahan bacchon ka data safe hai?", a: "100% safe! Hum koi ads nahi dikhate aur data strictly private rehta hai." },
              { q: "Earn Mode kya hai?", a: "13+ saal ke bacche verified companies ke liye AI tools use karke real pocket money kama sakte hain." }
            ].map((faq, i) => (
              <div key={i} style={{ background: C.card2, borderRadius: 12, padding: 14 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: C.text, marginBottom: 6 }}>Q: {faq.q}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>A: {faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}