'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  yellow: '#f59e0b', pink: '#ec4899', text: '#f1f5f9', muted: '#64748b'
};

export default function ChildDashboard() {
  const router = useRouter();
  const [name, setName] = useState('Hero');
  const [avatar, setAvatar] = useState('🦁');
  const [realStats, setRealStats] = useState({ played: 0, won: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [growth, setGrowth] = useState(null); // Real growth data ke liye
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [coins, setCoins] = useState(0);
  const [xp, setXp] = useState(0);
  const [refCode, setRefCode] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('kidai_student_name');
    const storedAvatar = localStorage.getItem('kidai_student_avatar');
    if (storedName) setName(storedName);
    if (storedAvatar) setAvatar(storedAvatar);

    // Supabase se asli history ka data uthana
    async function loadRealStats() {
      const studentId = 'student_123'; // NOTE: Baad mein isko actual logged-in user ID se replace karenge
      
      // Real Coins aur XP lana
      const { data: studentData } = await supabase.from('students').select('coins, total_xp, referral_code').eq('id', studentId).single();
      if (studentData) {
        setCoins(studentData.coins || 0);
        setXp(studentData.total_xp || 0);
        // Referral code agar nahi hai toh generate karna
        let code = studentData.referral_code;
        if (!code) { code = 'KIDAI' + Math.floor(1000 + Math.random() * 9000); await supabase.from('students').update({ referral_code: code }).eq('id', studentId); }
        setRefCode(code);
      }

      const { data } = await supabase
        .from('daily_sessions')
        .select('quizzes_attempted, quizzes_correct')
        .eq('student_id', studentId);
      
      if (data) {
        setRealStats({
          played: data.reduce((sum, row) => sum + (row.quizzes_attempted || 0), 0),
          won: data.reduce((sum, row) => sum + (row.quizzes_correct || 0), 0)
        });
      }

      // --- ORIGINAL GROWTH CALCULATION ---
      // Bacche ke sabse purane aur naye scores ko compare karna
      const { data: attempts } = await supabase
        .from('quiz_attempts')
        .select('last_score, updated_at, quizzes(topic_tags)')
        .eq('student_id', studentId)
        .order('updated_at', { ascending: true }); // Purane se naya

      if (attempts && attempts.length > 0) {
        const topicScores = {};
        attempts.forEach(a => {
          const tags = a.quizzes?.topic_tags;
          const topic = (tags && tags.length > 0) ? tags[0] : 'General Topic';
          if (!topicScores[topic]) topicScores[topic] = [];
          topicScores[topic].push(a.last_score || 0); // Scores jama karna
        });

        let bestGrowth = null;
        let maxDiff = 0;
        
        for (const topic in topicScores) {
          const scores = topicScores[topic];
          if (scores.length >= 2) {
            const oldScore = scores[0]; // Pehla score
            const newScore = scores[scores.length - 1]; // Aakhri (Latest) score
            if (newScore - oldScore > maxDiff) {
              maxDiff = newScore - oldScore;
              const formattedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
              bestGrowth = { subject: formattedTopic, old: oldScore, new: newScore };
            }
          }
        }
        if (bestGrowth && maxDiff > 0) setGrowth(bestGrowth);
      }

      setLoadingStats(false);
    }
    loadRealStats();
  }, []);

  const handleSaveName = () => {
    if(editName.trim()) {
      setName(editName.trim());
      localStorage.setItem('kidai_student_name', editName.trim());
    }
    setIsEditing(false);
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", padding: '20px 20px 120px' }}>
      
      {/* Top Bar: Profile & Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 36, background: C.card2, padding: 8, borderRadius: 20, border: `2px solid ${C.cyan}` }}>{avatar}</div>
          <div>
            <div style={{ fontSize: 14, color: C.muted, fontWeight: 800, textTransform: 'uppercase' }}>Welcome back,</div>
            {isEditing ? (
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <input value={editName} onChange={e => setEditName(e.target.value)} style={{ padding: '4px 8px', borderRadius: 8, background: C.card2, border: `1px solid ${C.border}`, color: C.text, fontSize: 16, fontWeight: 900, outline: 'none', width: '120px' }} autoFocus />
                <button onClick={handleSaveName} style={{ background: C.green, color: '#000', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
              </div>
            ) : (
              <div style={{ fontSize: 24, fontWeight: 900, color: C.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                {name}! 🚀
                <button onClick={() => { setEditName(name); setIsEditing(true); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14, opacity: 0.6, padding: 0 }}>✏️</button>
              </div>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: '6px 12px', borderRadius: 12, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: C.cyan }}>⚡</span> {loadingStats ? '...' : xp} XP
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: '6px 12px', borderRadius: 12, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: C.yellow }}>🪙</span> {loadingStats ? '...' : coins}
          </div>
        </div>
      </div>

      {/* Arya AI Notification */}
      <div onClick={() => router.push('/chat')} style={{ background: `linear-gradient(135deg, ${C.purple}22, ${C.cyan}22)`, border: `1px solid ${C.purple}55`, borderRadius: 24, padding: 20, marginBottom: 30, display: 'flex', gap: 16, alignItems: 'center', cursor: 'pointer', boxShadow: `0 8px 32px ${C.purple}22` }}>
        <div style={{ fontSize: 40, animation: 'bounce 2s infinite' }}>🤖</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 18, color: '#fff' }}>Arya is waiting!</div>
          <div style={{ color: '#cbd5e1', fontSize: 13, marginTop: 4 }}>
            Hey {name}! Tumhara <b>Premium</b> active hai! Apni school book ya homework ko <b style={{color: C.orange}}>Smart Scanner 📸</b> se scan karo, main uska mazedar game bana dungi! ▶
          </div>
        </div>
      </div>

      {/* 🚀 NEW: Referral / Premium System */}
      <div style={{ background: `linear-gradient(135deg, ${C.card}, ${C.card2})`, border: `2px dashed ${C.orange}`, borderRadius: 20, padding: 20, marginBottom: 30, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: `0 8px 30px rgba(255, 107, 53, 0.15)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 32 }}>🎁</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, color: C.orange }}>Free Premium & XP!</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>Doston ko invite karo. Tumhe aur dost dono ko <b>5 Days Premium (50 XP)</b> aur free games milenge!</div>
          </div>
        </div>
        <div style={{ background: '#000', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${C.border}` }}>
          <span style={{ color: C.muted, fontSize: 12, fontWeight: 700 }}>YOUR CODE:</span>
          <span style={{ color: C.cyan, fontSize: 20, fontWeight: 900, letterSpacing: 2 }}>{refCode || 'LOADING...'}</span>
        </div>
      </div>

      {/* My Progress / Journey Section */}
      <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>📈 Meri Journey</h2>
      <div style={{ display: 'flex', overflowX: 'auto', gap: 12, paddingBottom: 10, marginBottom: 20, scrollbarWidth: 'none' }}>
        {/* Metric 1 */}
        <div onClick={() => router.push('/history')} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, minWidth: 140, cursor: 'pointer', transition: 'transform 0.2s' }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🎮</div>
          <div style={{ fontSize: 20, fontWeight: 900 }}>{loadingStats ? '...' : realStats.played}</div>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>Games Khele</div>
        </div>
        {/* Metric 2 */}
        <div onClick={() => router.push('/history')} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, minWidth: 140, cursor: 'pointer', transition: 'transform 0.2s' }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🏆</div>
          <div style={{ fontSize: 20, fontWeight: 900 }}>{loadingStats ? '...' : realStats.won}</div>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>Challenges Jeete</div>
        </div>
        {/* Improvement */}
        <div onClick={() => router.push('/history')} style={{ background: `linear-gradient(135deg, ${C.green}22, transparent)`, border: `1px solid ${C.green}55`, borderRadius: 16, padding: 16, minWidth: 160, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, color: C.green, fontWeight: 800, marginBottom: 4 }}>💪 Super Growth!</div>
          {loadingStats ? <div style={{ fontSize: 12, color: C.muted }}>Loading...</div> : growth ? (
            <div style={{ fontSize: 12, color: '#e2e8f0' }}>Pehle <strong>{growth.subject}</strong> me score <span style={{ color: C.pink }}>{growth.old}%</span> tha, ab <span style={{ color: C.green, fontWeight: 900 }}>{growth.new}%</span> ho gaya hai!</div>
          ) : (
            <div style={{ fontSize: 12, color: '#e2e8f0', marginBottom: 6 }}>Khelte raho aur apna result yahan dekho! 🚀</div>
          )}
          <div style={{ fontSize: 12, color: C.green, fontWeight: 900, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>▶ Growth Dekho</div>
        </div>
      </div>

      {/* Weaknesses Turned to Strengths */}
      {!loadingStats ? (
        <div onClick={() => router.push('/history')} style={{ background: C.card2, borderRadius: 16, padding: 16, marginBottom: 30, display: 'flex', alignItems: 'center', gap: 12, borderLeft: `4px solid ${C.cyan}`, cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
           <div style={{ fontSize: 24 }}>🧠</div>
           <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>Weakness Turned to Strength!</div>
              {growth ? (
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>'{growth.subject}' pehle mushkil lagta tha, ab score badhkar {growth.new}% ho gaya hai. You mastered it!</div>
              ) : (
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>AI abhi tumhari kamzoriyan track kar raha hai. Daily games khelo aur apni taqat badhao!</div>
              )}
           </div>
           <div style={{ fontSize: 12, color: C.cyan, fontWeight: 900, padding: '6px 12px', background: C.cyan+'22', borderRadius: 8 }}>View ▶</div>
        </div>
      ) : null}

      <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>🎮 Today's Quests</h2>
      <div style={{ display: 'grid', gap: 16, marginBottom: 30 }}>
        {/* Quest 1 */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 60, height: 60, background: C.orange+'22', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>⚔️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Games Arena</div>
            <div style={{ color: C.muted, fontSize: 13 }}>Ludo, Chess & More</div>
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
            <div style={{ fontWeight: 800, fontSize: 16 }}>Smart Quiz</div>
            <div style={{ color: C.muted, fontSize: 13 }}>Science & General</div>
          </div>
          <button onClick={() => router.push('/seekho')} style={{ background: C.cyan, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>Start</button>
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