'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  pink: '#ec4899', text: '#f1f5f9', muted: '#64748b'
};

const FOCUS_SUBJECTS = [
  { id: 'math_tables', name: 'Pahada (Tables 1-10)', icon: '✖️', subject: 'Math' },
  { id: 'english_grammar', name: 'English Grammar', icon: '📝', subject: 'English' },
  { id: 'science_concepts', name: 'Science Concepts', icon: '🔬', subject: 'Science' },
  { id: 'history_dates', name: 'History Dates', icon: '📜', subject: 'History' },
];

export default function ParentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [focusAreas, setFocusAreas] = useState([]);
  const [toast, setToast] = useState('');

  // Chat UI States
  const [messages, setMessages] = useState([{ role: 'ai', text: "Namaste! 🙏 Main Arya Manager hoon. Aap manually topics select kar sakte hain, ya seedha yahan mujhe likh kar bata sakte hain." }]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const studentId = 'student_123'; // NOTE: Yahan parent ke child ki ID aayegi

      const { data: studentData } = await supabase.from('students').select('*').eq('id', studentId).single();
      setStudent(studentData);

      const { data: overallStats } = await supabase.from('quiz_attempts').select('status, last_score').eq('student_id', studentId);
      const realStats = {
        total: overallStats?.length || 0,
        mastered: overallStats?.filter(a => a.status === 'mastered').length || 0,
        avgScore: overallStats?.length ? Math.round(overallStats.reduce((s, a) => s + (a.last_score || 0), 0) / overallStats.length) : 0
      };
      setStats(realStats);

      const { data: existingFocus } = await supabase.from('student_focus_areas').select('topic_tag').eq('student_id', studentId);
      if (existingFocus) setFocusAreas(existingFocus.map(f => f.topic_tag));

      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFocusClick = async (topicId) => {
    const studentId = 'student_123';
    const isFocused = focusAreas.includes(topicId);

    if (isFocused) {
      await supabase.from('student_focus_areas').delete().match({ student_id: studentId, topic_tag: topicId });
      setFocusAreas(focusAreas.filter(f => f !== topicId));
      showToast('Focus Removed!');
    } else {
      await supabase.from('student_focus_areas').insert({ student_id: studentId, topic_tag: topicId, priority: 1 });
      setFocusAreas([...focusAreas, topicId]);
      showToast('AI ko naya focus de diya hai!');
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || chatLoading) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'parent', text: userMsg }]);
    setInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/parent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          parentId: localStorage.getItem('kidai_parent_id') || 'parent_123',
          studentId: 'student_123'
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply, type: data.action_taken }]);
        if (data.action_taken === 'guidance') {
          const { data: existingFocus } = await supabase.from('student_focus_areas').select('topic_tag').eq('student_id', 'student_123');
          if (existingFocus) setFocusAreas(existingFocus.map(f => f.topic_tag));
        }
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "Maaf kijiye, server se connect nahi ho paya." }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Internet connection check karein." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  if (loading) return <div style={{...styles.container, justifyContent: 'center', alignItems: 'center', display: 'flex'}}>Loading Dashboard...</div>;

  return (
    <div style={styles.container}>
      {toast && <div style={styles.toast}>{toast}</div>}
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>Parent Dashboard</h1>
          <p style={styles.headerSubtitle}>Welcome, Parent of {student?.name || 'Student'}!</p>
        </div>
        <button onClick={() => { localStorage.removeItem('kidai_parent_id'); router.push('/login'); }} style={styles.logoutButton}>Logout</button>
      </header>

      <main style={{padding: '0 20px 40px'}}>
        <h2 style={styles.sectionTitle}>📊 {student?.name}'s Progress</h2>
        <div style={styles.statsGrid}>
          <StatCard title="Total Games Played" value={stats?.total || 0} icon="🎮" color={C.cyan} />
          <StatCard title="Concepts Mastered" value={stats?.mastered || 0} icon="🏆" color={C.green} />
          <StatCard title="Average Score" value={`${stats?.avgScore || 0}%`} icon="🎯" color={C.orange} />
          <StatCard title="Current Streak" value={`${student?.streak_days || 0} Days`} icon="🔥" color={C.pink} />
        </div>

        <h2 style={styles.sectionTitle}>🧠 AI ko Guide Karein</h2>
        <p style={styles.sectionDescription}>Click karke Arya AI ko batayein ki aapke bacche ko kis subject par zyada dhyan dena hai.</p>
        <div style={styles.focusGrid}>
          {FOCUS_SUBJECTS.map(subject => {
            const isSelected = focusAreas.includes(subject.id);
            return (
              <div key={subject.id} onClick={() => handleFocusClick(subject.id)} style={{...styles.focusCard, border: `2px solid ${isSelected ? C.green : C.border}`}}>
                <div style={{fontSize: 24, marginBottom: 8}}>{subject.icon}</div>
                <div style={{fontWeight: 700, fontSize: 14}}>{subject.name}</div>
                <div style={{fontSize: 12, color: C.muted, marginTop: 4}}>{subject.subject}</div>
                {isSelected && <div style={styles.focusSelected}>✅ FOCUSED</div>}
              </div>
            );
          })}
        </div>

        <h2 style={styles.sectionTitle}>💬 Arya Manager (AI Assistant)</h2>
        <p style={styles.sectionDescription}>Type karke batayein aap kya chahte hain (e.g. "Math par dhyan do" ya "Naya game add karo").</p>

        <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', height: 400, overflow: 'hidden', marginTop: 16 }}>
          <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.role === 'parent' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <div style={{ 
                  background: msg.role === 'parent' ? `linear-gradient(135deg, ${C.cyan}, ${C.purple})` : C.card2, 
                  color: msg.role === 'parent' ? '#fff' : C.text,
                  padding: '10px 14px', borderRadius: 12, fontSize: 14, lineHeight: 1.5,
                  border: msg.role === 'ai' ? `1px solid ${C.border}` : 'none'
                }}>
                  {msg.text}
                </div>
                {msg.type === 'guidance' && <div style={{ fontSize: 11, color: C.green, marginTop: 4, textAlign: msg.role === 'parent' ? 'right' : 'left' }}>✅ Focus Area Updated</div>}
                {msg.type === 'suggestion' && <div style={{ fontSize: 11, color: C.orange, marginTop: 4, textAlign: msg.role === 'parent' ? 'right' : 'left' }}>📝 Suggestion Sent to Admin</div>}
              </div>
            ))}
            {chatLoading && <div style={{ color: C.muted, fontSize: 12, fontStyle: 'italic' }}>Arya likh rahi hain... ✍️</div>}
            <div ref={chatEndRef} />
          </div>
          
          <div style={{ padding: 12, background: C.card2, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
            <input 
              value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Message likhein..." 
              style={{ flex: 1, padding: '10px 14px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, color: '#fff', outline: 'none', fontSize: 14 }}
            />
            <button onClick={sendMessage} style={{ background: C.cyan, color: '#000', border: 'none', padding: '0 16px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>Send ➔</button>
          </div>
        </div>
      </main>
    </div>
  );
}

const StatCard = ({ title, value, icon, color }) => (<div style={{...styles.statCard, borderLeft: `4px solid ${color}`}}><div style={{fontSize: 28, marginBottom: 8}}>{icon}</div><div style={{fontSize: 22, fontWeight: 900, color: C.text}}>{value}</div><div style={{fontSize: 12, color: C.muted}}>{title}</div></div>);
const styles = { container: { background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }, header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: `1px solid ${C.border}` }, headerTitle: { margin: 0, fontSize: 20, fontWeight: 800 }, headerSubtitle: { margin: '4px 0 0', fontSize: 13, color: C.muted }, logoutButton: { background: C.card2, color: C.muted, border: `1px solid ${C.border}`, padding: '8px 14px', borderRadius: 10, cursor: 'pointer' }, sectionTitle: { fontSize: 18, fontWeight: 900, marginTop: 30, marginBottom: 8 }, sectionDescription: { fontSize: 13, color: C.muted, marginTop: 0, marginBottom: 16, lineHeight: 1.6 }, statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }, statCard: { background: C.card, borderRadius: 12, padding: 16 }, focusGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }, focusCard: { background: C.card, borderRadius: 12, padding: 16, textAlign: 'center', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }, focusSelected: { position: 'absolute', top: 8, right: 8, background: C.green, color: '#000', fontSize: 9, fontWeight: 900, padding: '3px 6px', borderRadius: 6 }, toast: { position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: C.green, color: '#000', padding: '10px 20px', borderRadius: 8, fontWeight: 800, zIndex: 100 }};