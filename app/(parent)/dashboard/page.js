'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  red: '#ef4444', text: '#f1f5f9', muted: '#64748b'
};

export default function ParentDashboard() {
  const router = useRouter();
  const [childName, setChildName] = useState('Student');
  
  useEffect(() => {
    const name = localStorage.getItem('kidai_student_name');
    if (name) setChildName(name);
  }, []);

  // Mock Data (Baad mein isko Supabase / API se fetch karenge)
  const stats = [
    { label: 'Games Played', value: `42 🎮`, color: C.purple, sub: 'Lifetime' },
    { label: 'Avg. Accuracy', value: `84% 🎯`, color: C.green, sub: 'Last 7 days' },
    { label: 'Total Coins', value: `1,240 🪙`, color: C.yellow, sub: 'Wallet Balance' },
    { label: 'Challenges Won', value: `18 🏆`, color: C.orange, sub: 'Out of 22 played' }
  ];

  const insights = [
    { type: 'Strength', text: 'Maths mein Table Battle bahut acha khel raha hai. Calculation speed 20% badh gayi hai!', color: C.green, icon: '🌟' },
    { type: 'Struggle', text: 'Science mein Solar System thoda weak lag raha hai. Main usko kal uske related ek animated story dikhaungi.', color: C.orange, icon: '⚠️' },
    { type: 'Test Result', text: 'Aaj ke Weekly Test me 10/10 aaye! (Topic: Nouns & Pronouns). Very good progress.', color: C.cyan, icon: '📝' }
  ];

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }}>
      {/* Parent Header */}
      <header style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24, background: C.card2, padding: 8, borderRadius: 12 }}>👨‍👩‍👧</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Parent Portal</div>
            <div style={{ color: C.cyan, fontSize: 12, fontWeight: 700 }}>Monitoring {childName}</div>
          </div>
        </div>
        <Link href="/" style={{ color: C.muted, textDecoration: 'none', fontSize: 14, fontWeight: 700, background: C.card2, padding: '8px 16px', borderRadius: 12 }}>Home</Link>
      </header>

      <div style={{ padding: 20, maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Lifetime Timeline Banner */}
        <div style={{ background: `linear-gradient(90deg, ${C.purple}22, transparent)`, border: `1px solid ${C.purple}44`, borderRadius: 16, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div>
              <div style={{ fontSize: 12, color: C.muted, textTransform: 'uppercase', fontWeight: 800 }}>Account History</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Joined: <span style={{color: C.cyan}}>12 Jan 2025</span> • First Game: <span style={{color: C.orange}}>Math Combat</span></div>
           </div>
           <div style={{ fontSize: 32 }}>🎓</div>
        </div>

        {/* Top Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ background: C.card, borderStyle: 'solid', borderColor: C.border, borderWidth: '4px 1px 1px 1px', borderTopColor: stat.color, borderRadius: 20, padding: 20 }}>
              <div style={{ color: C.muted, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>{stat.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.text }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Past vs Present Comparison */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20 }}>
           <h3 style={{ margin: '0 0 16px', fontSize: 18, display: 'flex', justifyContent: 'space-between' }}>
              <span>📊 Progress Comparison</span>
              <span style={{ fontSize: 12, background: C.card2, padding: '4px 10px', borderRadius: 8 }}>Past vs Present</span>
           </h3>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Comparison 1 */}
              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6, fontWeight: 700 }}>
                    <span>Maths Calculation Speed</span>
                    <span style={{ color: C.green }}>+40% Faster 🚀</span>
                 </div>
                 <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ width: '40%', height: 16, background: C.red+'44', borderRadius: 10, display: 'flex', alignItems: 'center', paddingLeft: 10, fontSize: 11, fontWeight: 800 }}>Pehle (Last Month)</div>
                    <div style={{ width: '80%', height: 16, background: C.green, borderRadius: 10, display: 'flex', alignItems: 'center', paddingLeft: 10, fontSize: 11, fontWeight: 800, color: '#000' }}>Abhi (Today)</div>
                 </div>
              </div>
              {/* Comparison 2 */}
              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6, fontWeight: 700 }}>
                    <span>Science Basics Accuracy</span>
                    <span style={{ color: C.green }}>+25% Improved ✨</span>
                 </div>
                 <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ width: '60%', height: 16, background: C.red+'44', borderRadius: 10, display: 'flex', alignItems: 'center', paddingLeft: 10, fontSize: 11, fontWeight: 800 }}>Pehle: 60%</div>
                    <div style={{ width: '85%', height: 16, background: C.cyan, borderRadius: 10, display: 'flex', alignItems: 'center', paddingLeft: 10, fontSize: 11, fontWeight: 800, color: '#000' }}>Abhi: 85%</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Arya's AI Insights (Main Feature) */}
        <div style={{ background: `linear-gradient(135deg, ${C.card}, #1e1b4b)`, border: `1px solid ${C.purple}55`, borderRadius: 24, padding: 24, boxShadow: `0 10px 30px ${C.purple}11` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 32 }}>🤖</div>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#fff' }}>Arya's AI Report</h2>
              <div style={{ color: '#a78bfa', fontSize: 13 }}>Pichle 7 dino ka analysis</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {insights.map((insight, i) => (
              <div key={i} style={{ background: 'rgba(0,0,0,0.3)', borderLeft: `4px solid ${insight.color}`, borderRadius: 12, padding: 16, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 20 }}>{insight.icon}</div>
                <div style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.6 }}><strong>{insight.type}:</strong> {insight.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <h3 style={{ fontSize: 16, fontWeight: 800, margin: '10px 0 0' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div onClick={() => router.push('/reports')} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, transition: '0.2s', textAlign: 'center' }}>
            <div style={{ fontSize: 28 }}>📊</div>
            <div style={{ fontWeight: 800, fontSize: 14 }}>Full Report Card</div>
          </div>
          <div onClick={() => alert('Settings coming soon!')} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, transition: '0.2s', textAlign: 'center' }}>
            <div style={{ fontSize: 28 }}>⚙️</div>
            <div style={{ fontWeight: 800, fontSize: 14 }}>App Settings</div>
          </div>
        </div>

        {/* Active Child Profile */}
        <div style={{ marginTop: 20, background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 50, height: 50, background: C.card2, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🦁</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{childName}</div>
              <div style={{ color: C.muted, fontSize: 13 }}>Class 5 • Active 2h ago</div>
            </div>
          </div>
          <button onClick={() => router.push('/home')} style={{ background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>
            Go to Kid's App →
          </button>
        </div>

      </div>
    </div>
  );
}