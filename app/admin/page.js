'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const C = { bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45', cyan: '#06b6d4', text: '#f1f5f9', muted: '#64748b', purple: '#7c3aed', orange: '#ff6b35', green: '#10b981', yellow: '#f59e0b' };

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", padding: '20px 40px', paddingBottom: 100 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, borderBottom: `1px solid ${C.border}`, paddingBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900 }}>🛠️ Super Admin HQ</h1>
            <p style={{ color: C.muted, margin: '4px 0 0', fontSize: 14 }}>Global Platform Analytics & Control</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => router.push('/admin/scanner')} style={{ background: C.purple, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>🕵️ Game Scanner</button>
            <Link href="/" style={{ color: C.cyan, textDecoration: 'none', fontWeight: 800, background: C.card2, padding: '10px 20px', borderRadius: 12 }}>← Exit Admin</Link>
          </div>
        </header>

        {/* Top KPI Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 30 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, borderLeft: `4px solid ${C.cyan}` }}>
            <div style={{ color: C.muted, fontSize: 13, fontWeight: 800, textTransform: 'uppercase' }}>Total Users</div>
            <div style={{ fontSize: 32, fontWeight: 900, marginTop: 5 }}>12,450</div>
            <div style={{ fontSize: 12, color: C.green, marginTop: 5 }}>↑ 4,200 (Logged In) • 8,250 (Guest)</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, borderLeft: `4px solid ${C.orange}` }}>
            <div style={{ color: C.muted, fontSize: 13, fontWeight: 800, textTransform: 'uppercase' }}>Games Played (Today)</div>
            <div style={{ fontSize: 32, fontWeight: 900, marginTop: 5 }}>45.2K</div>
            <div style={{ fontSize: 12, color: C.green, marginTop: 5 }}>↑ 12% vs Yesterday</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, borderLeft: `4px solid ${C.yellow}` }}>
            <div style={{ color: C.muted, fontSize: 13, fontWeight: 800, textTransform: 'uppercase' }}>Total Coins Earned</div>
            <div style={{ fontSize: 32, fontWeight: 900, marginTop: 5 }}>2.4M 🪙</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 5 }}>By 8,400 active kids</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, borderLeft: `4px solid ${C.purple}` }}>
            <div style={{ color: C.muted, fontSize: 13, fontWeight: 800, textTransform: 'uppercase' }}>Referral Signups</div>
            <div style={{ fontSize: 32, fontWeight: 900, marginTop: 5 }}>3,890</div>
            <div style={{ fontSize: 12, color: C.cyan, marginTop: 5 }}>🔗 Highly Viral Growth!</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 18 }}>🎮 Most Popular Games / Modules</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { name: 'Table Battle (Maths)', plays: '18.5K', percent: '80%', color: C.cyan },
                  { name: 'Space Explorer (Science)', plays: '12.2K', percent: '65%', color: C.purple },
                  { name: 'AI Story Maker', plays: '8.4K', percent: '45%', color: C.orange },
                  { name: 'Smart Homework Scanner', plays: '6.1K', percent: '30%', color: C.green }
                ].map(g => (
                  <div key={g.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, fontWeight: 700 }}>
                      <span>{g.name}</span>
                      <span>{g.plays} Plays</span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: C.card2, borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ width: g.percent, height: '100%', background: g.color, borderRadius: 10 }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 18 }}>💼 Earn Mode Analytics</h3>
              <p style={{ color: C.muted, fontSize: 14, margin: '0 0 20px' }}>Bacche 'Earn Mode' me kaisa perform kar rahe hain.</p>
              <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', background: C.card2, padding: 20, borderRadius: 12 }}>
                 <div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: C.green }}>4.2K</div>
                    <div style={{ fontSize: 12, color: C.muted }}>Kids in Earn Mode</div>
                 </div>
                 <div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: C.yellow }}>1.2M</div>
                    <div style={{ fontSize: 12, color: C.muted }}>Coins Generated</div>
                 </div>
                 <div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: C.cyan }}>850</div>
                    <div style={{ fontSize: 12, color: C.muted }}>Rewards Redeemed</div>
                 </div>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: `linear-gradient(135deg, ${C.card}, ${C.card2})`, border: `1px solid ${C.purple}55`, borderRadius: 16, padding: 24 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 18 }}>🚨 System Alerts & Insights</h3>
              <div style={{ fontSize: 13, color: '#e2e8f0', background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 8, borderLeft: `3px solid ${C.orange}`, marginBottom: 10 }}>
                <strong>Trend:</strong> Pichle 3 dino se "Fractions" wale games me bacche fail ho rahe hain. AI difficulty auto-adjust kar raha hai.
              </div>
              <div style={{ fontSize: 13, color: '#e2e8f0', background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 8, borderLeft: `3px solid ${C.green}`, marginBottom: 10 }}>
                <strong>Success:</strong> "Referral Code" feature hit hai! 40% naye users friends ke invite se aaye hain.
              </div>
              <div style={{ fontSize: 13, color: '#e2e8f0', background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 8, borderLeft: `3px solid ${C.cyan}` }}>
                <strong>AI Scanner:</strong> 99.8% accuracy maintain ho rahi hai. Baki 0.2% manual review queue me hain.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}