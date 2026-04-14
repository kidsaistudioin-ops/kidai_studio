'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const C = { bg:'#07090f', card:'#0f1520', card2:'#161e30', border:'#1e2d45', cyan:'#06b6d4', orange:'#ff6b35', text:'#f1f5f9', muted:'#64748b' };

export default function PricingPage() {
  const router = useRouter();
  
  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ color: C.muted, textDecoration: 'none', fontSize: 24, marginRight: 16 }}>←</Link>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Pricing <span style={{ color: C.orange }}>Plans</span></h1>
        </div>
        
        <div style={{ background: `linear-gradient(180deg, ${C.card} 0%, ${C.bg} 100%)`, border: `1px solid ${C.border}`, borderRadius: 24, padding: 24, boxShadow: `0 10px 40px rgba(0,0,0,0.3)` }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>💎</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0, color: C.text }}>Soft & Simple Plans</h2>
            <p style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>Har bacche ke liye perfect learning plan.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { plan: 'Free', price: '0', color: C.muted, features: ['3 Games / Day', 'Basic AI Chat'] },
              { plan: 'Basic', price: '99', color: C.cyan, popular: true, features: ['3 Games / Day', 'Basic AI Chat', 'Progress Saving', 'Parent Reports', 'Homework Scanner'] },
              { plan: 'Premium', price: '499', color: C.orange, features: ['Unlimited Games', 'Pro AI Tutor (Arya)', 'Progress Saving', 'Multiplayer Mode', 'Earn Mode (13+)'] },
            ].map(p => (
              <div key={p.plan} style={{ position: 'relative', background: `linear-gradient(135deg, ${p.color}11, ${C.card2})`, border: `2px solid ${p.color}${p.popular ? '88' : '33'}`, borderRadius: 20, padding: 20, overflow: 'hidden' }}>
                {p.popular && <div style={{ position: 'absolute', top: 12, right: -25, background: p.color, color: '#000', fontSize: 10, fontWeight: 900, padding: '4px 30px', transform: 'rotate(45deg)' }}>POPULAR</div>}
                <div style={{ fontWeight: 900, fontSize: 18, color: p.color, marginBottom: 4 }}>{p.plan}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.muted }}>₹</span>
                  <span style={{ fontSize: 36, fontWeight: 900, color: C.text, lineHeight: 1 }}>{p.price}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>/mo</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {p.features.map(f => (<div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: C.text, fontWeight: 600 }}><div style={{ width: 18, height: 18, borderRadius: '50%', background: p.color+'33', color: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900 }}>✓</div>{f}</div>))}
                </div>
                <button onClick={() => router.push('/signup')} style={{ width: '100%', marginTop: 20, padding: 14, borderRadius: 14, background: p.popular ? `linear-gradient(135deg, ${p.color}, ${p.color}cc)` : C.card2, border: p.popular ? 'none' : `1px solid ${p.color}55`, color: p.popular ? '#000' : p.color, fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: p.popular ? `0 8px 20px ${p.color}44` : 'none' }}>Choose {p.plan}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}