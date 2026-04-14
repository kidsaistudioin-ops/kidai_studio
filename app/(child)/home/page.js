'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  yellow: '#f59e0b', pink: '#ec4899', text: '#f1f5f9', muted: '#64748b'
};

export default function ChildDashboard() {
  const router = useRouter();
  const [name, setName] = useState('Hero');
  const [avatar, setAvatar] = useState('🦁');

  useEffect(() => {
    const storedName = localStorage.getItem('kidai_student_name');
    const storedAvatar = localStorage.getItem('kidai_student_avatar');
    if (storedName) setName(storedName);
    if (storedAvatar) setAvatar(storedAvatar);
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", padding: '20px 20px 120px' }}>
      
      {/* Top Bar: Profile & Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 36, background: C.card2, padding: 8, borderRadius: 20, border: `2px solid ${C.cyan}` }}>{avatar}</div>
          <div>
            <div style={{ fontSize: 14, color: C.muted, fontWeight: 800, textTransform: 'uppercase' }}>Welcome back,</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.text }}>{name}! 🚀</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: '6px 12px', borderRadius: 12, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: C.orange }}>🔥</span> 5
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: '6px 12px', borderRadius: 12, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: C.yellow }}>🪙</span> 1240
          </div>
        </div>
      </div>

      {/* Arya AI Notification */}
      <div onClick={() => router.push('/chat')} style={{ background: `linear-gradient(135deg, ${C.purple}22, ${C.cyan}22)`, border: `1px solid ${C.purple}55`, borderRadius: 24, padding: 20, marginBottom: 30, display: 'flex', gap: 16, alignItems: 'center', cursor: 'pointer', boxShadow: `0 8px 32px ${C.purple}22` }}>
        <div style={{ fontSize: 40, animation: 'bounce 2s infinite' }}>🤖</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 18, color: '#fff' }}>Arya is waiting!</div>
          <div style={{ color: '#cbd5e1', fontSize: 13, marginTop: 4 }}>Arrey wah {name}! Tumhare dost Rahul ne tumhara invite code use kiya. Tumhe +500 Coins mile! 🎉 ▶</div>
        </div>
      </div>

      {/* My Progress / Journey Section */}
      <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>📈 Meri Journey</h2>
      <div style={{ display: 'flex', overflowX: 'auto', gap: 12, paddingBottom: 10, marginBottom: 20, scrollbarWidth: 'none' }}>
        {/* Metric 1 */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, minWidth: 140 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🎮</div>
          <div style={{ fontSize: 20, fontWeight: 900 }}>42</div>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>Games Khele</div>
        </div>
        {/* Metric 2 */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, minWidth: 140 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🏆</div>
          <div style={{ fontSize: 20, fontWeight: 900 }}>18</div>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>Challenges Jeete</div>
        </div>
        {/* Improvement */}
        <div style={{ background: `linear-gradient(135deg, ${C.green}22, transparent)`, border: `1px solid ${C.green}55`, borderRadius: 16, padding: 16, minWidth: 160 }}>
          <div style={{ fontSize: 13, color: C.green, fontWeight: 800, marginBottom: 4 }}>💪 Super Growth!</div>
          <div style={{ fontSize: 12, color: '#e2e8f0' }}>Pehle <strong>Maths</strong> me score <span style={{ color: C.pink }}>45%</span> tha, ab <span style={{ color: C.green, fontWeight: 900 }}>85%</span> ho gaya hai!</div>
        </div>
      </div>

      {/* Weaknesses Turned to Strengths */}
      <div style={{ background: C.card2, borderRadius: 16, padding: 16, marginBottom: 30, display: 'flex', alignItems: 'center', gap: 12, borderLeft: `4px solid ${C.cyan}` }}>
         <div style={{ fontSize: 24 }}>🧠</div>
         <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>'Fractions' pehle mushkil lagta tha na?</div>
            <div style={{ fontSize: 12, color: C.muted }}>Ab tumne iske 5 level pass kar liye hain. You mastered it!</div>
         </div>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>🎮 Today's Quests</h2>
      <div style={{ display: 'grid', gap: 16, marginBottom: 30 }}>
        {/* Quest 1 */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 60, height: 60, background: C.orange+'22', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>⚔️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Table Battle</div>
            <div style={{ color: C.muted, fontSize: 13 }}>Maths • 5 mins</div>
            <div style={{ width: '100%', height: 6, background: C.card2, borderRadius: 10, marginTop: 8, overflow: 'hidden' }}>
              <div style={{ width: '40%', height: '100%', background: C.orange, borderRadius: 10 }}></div>
            </div>
          </div>
          <button onClick={() => router.push('/play')} style={{ background: C.orange, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>Play</button>
        </div>

        {/* Quest 2 */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 60, height: 60, background: C.cyan+'22', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🪐</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Space Explorer</div>
            <div style={{ color: C.muted, fontSize: 13 }}>Science • New!</div>
          </div>
          <button onClick={() => router.push('/learn')} style={{ background: C.cyan, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>Start</button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>🚀 Explore</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div onClick={() => router.push('/scanner')} style={{ background: `linear-gradient(135deg, ${C.card}, ${C.card2})`, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, textAlign: 'center', cursor: 'pointer', transition: '0.2s' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📸</div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Scan Homework</div>
        </div>
        <div onClick={() => router.push('/library')} style={{ background: `linear-gradient(135deg, ${C.card}, ${C.card2})`, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, textAlign: 'center', cursor: 'pointer', transition: '0.2s' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📚</div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Game Library</div>
        </div>
        <div onClick={() => router.push('/earn')} style={{ background: `linear-gradient(135deg, ${C.yellow}22, ${C.card2})`, border: `1px solid ${C.yellow}55`, borderRadius: 20, padding: 20, textAlign: 'center', cursor: 'pointer', transition: '0.2s', gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>💰</div>
          <div style={{ fontWeight: 800, fontSize: 15, color: C.yellow }}>Earn Mode - Share & Win!</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Apna code share karo aur real rewards jeeto!</div>
        </div>
      </div>
    </div>
  );
}