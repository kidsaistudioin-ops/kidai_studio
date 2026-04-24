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
  const [libraryGames, setLibraryGames] = useState([]);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
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

      // Fetch child's scanned games for Library Manager
      const { data: libData } = await supabase.from('library').select('*').eq('student_id', studentId).order('created_at', { ascending: false });
      if (libData) setLibraryGames(libData);

      const { data: existingFocus } = await supabase.from('student_focus_areas').select('topic_tag').eq('student_id', studentId);
      if (existingFocus) setFocusAreas(existingFocus.map(f => f.topic_tag));

      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === '1234') setIsAuthenticated(true);
    else { alert('❌ Galat PIN! Kripya "1234" try karein.'); setPin(''); }
  };

  const toggleVisibility = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    const { error } = await supabase.from('library').update({ is_active: newStatus }).eq('id', id);
    if (!error) setLibraryGames(libraryGames.map(g => g.id === id ? { ...g, is_active: newStatus } : g));
  };

  const deleteGame = async (id) => {
    if (window.confirm('⚠️ Kya aap sach mein is game ko hamesha ke liye delete karna chahte hain?')) {
      const { error } = await supabase.from('library').delete().eq('id', id);
      if (!error) setLibraryGames(libraryGames.filter(g => g.id !== id));
    }
  };

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

  if (!isAuthenticated) {
    return (
      <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <form onSubmit={handlePinSubmit} style={{ background: C.card, padding: 40, borderRadius: 24, textAlign: 'center', border: `1px solid ${C.border}`, maxWidth: 400, width: '90%' }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🔒</div>
          <h2 style={{ marginBottom: 10, fontSize: 24, fontWeight: 900 }}>Parent Dashboard</h2>
          <p style={{ color: C.muted, marginBottom: 30, fontSize: 14 }}>Enter your 4-digit PIN (Default: 1234)</p>
          
          <input 
            type="password" maxLength="4" value={pin} onChange={(e) => setPin(e.target.value)}
            placeholder="****" style={{ fontSize: 32, letterSpacing: 8, textAlign: 'center', padding: 15, borderRadius: 12, border: `2px solid ${C.border}`, background: C.card2, color: C.text, width: '100%', marginBottom: 20, outline: 'none' }}
            autoFocus
          />
          
          <button type="submit" style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, color: '#fff', border: 'none', padding: '16px', width: '100%', borderRadius: 12, fontSize: 18, fontWeight: 800, cursor: 'pointer' }}>
            Unlock Dashboard
          </button>
          <button type="button" onClick={() => router.push('/select-profile')} style={{ background: 'transparent', color: C.muted, border: 'none', marginTop: 15, cursor: 'pointer', textDecoration: 'underline' }}>Back to Profiles</button>
        </form>
      </div>
    );
  }

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

        <h2 style={styles.sectionTitle}>🗂️ Scanned Games Manager</h2>
        <p style={styles.sectionDescription}>Bacche ke scan kiye hue games check karein, hide karein ya delete karein.</p>
        
        {libraryGames.length === 0 ? (
          <div style={{ background: C.card2, padding: 30, borderRadius: 16, textAlign: 'center', color: C.muted, border: `1px dashed ${C.border}` }}>Abhi koi game scan nahi kiya gaya hai.</div>
        ) : (
          <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: C.card2, color: C.muted, fontSize: 13 }}>
                  <th style={{ padding: '15px 20px', borderBottom: `1px solid ${C.border}` }}>GAME TITLE</th>
                  <th style={{ padding: '15px 20px', borderBottom: `1px solid ${C.border}` }}>SUBJECT</th>
                  <th style={{ padding: '15px 20px', borderBottom: `1px solid ${C.border}` }}>STATUS</th>
                  <th style={{ padding: '15px 20px', borderBottom: `1px solid ${C.border}`, textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {libraryGames.map(game => (
                  <tr key={game.id} style={{ borderBottom: `1px solid ${C.border}`, background: !game.is_active ? '#ef444411' : 'transparent' }}>
                    <td style={{ padding: '15px 20px', fontWeight: 'bold' }}>{game.title}</td>
                    <td style={{ padding: '15px 20px' }}><span style={{ background: C.card2, padding: '4px 8px', borderRadius: 6, fontSize: 12, color: C.cyan }}>{game.subject?.toUpperCase() || 'MIXED'}</span></td>
                    <td style={{ padding: '15px 20px' }}>{game.is_active ? <span style={{ color: C.green, fontSize: 13, fontWeight: 'bold' }}>✅ Active</span> : <span style={{ color: C.red, fontSize: 13, fontWeight: 'bold' }}>🚫 Hidden</span>}</td>
                    <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                      <button onClick={() => toggleVisibility(game.id, game.is_active)} style={{ background: game.is_active ? C.card2 : C.green+'33', color: game.is_active ? C.text : C.green, border: `1px solid ${game.is_active ? C.border : C.green}`, padding: '6px 10px', borderRadius: 8, cursor: 'pointer', marginRight: 8, fontSize: 12, fontWeight: 'bold' }}>
                        {game.is_active ? '👁️ Hide' : '👁️‍🗨️ Show'}
                      </button>
                      <button onClick={() => deleteGame(game.id)} style={{ background: '#ef444422', color: C.red, border: '1px solid #ef444455', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 'bold' }}>
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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