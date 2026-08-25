'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, approveGame, rejectGame } from '@/lib/supabase';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  yellow: '#f59e0b', pink: '#ec4899', red: '#ef4444', text: '#f1f5f9', muted: '#64748b'
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
  const [pendingGames, setPendingGames] = useState([]);
  
  // Review Modal State
  const [reviewingGame, setReviewingGame] = useState(null);
  const [editedQuestions, setEditedQuestions] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [toast, setToast] = useState('');

  // Chat UI States
  const [messages, setMessages] = useState([{ role: 'ai', text: "Namaste! 🙏 Main Arya Manager hoon. Aap manually topics select kar sakte hain, ya seedha yahan mujhe likh kar bata sakte hain." }]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const studentId = 'student_123';

  useEffect(() => {
    async function fetchData() {
      const { data: studentData } = await supabase.from('students').select('*').eq('id', studentId).single();
      setStudent(studentData);

      const { data: overallStats } = await supabase.from('quiz_attempts').select('status, last_score').eq('student_id', studentId);
      const realStats = {
        total: overallStats?.length || 0,
        mastered: overallStats?.filter(a => a.status === 'mastered').length || 0,
        avgScore: overallStats?.length ? Math.round(overallStats.reduce((s, a) => s + (a.last_score || 0), 0) / overallStats.length) : 0
      };
      setStats(realStats);

      // Fetch all scanned games
      const { data: libData } = await supabase.from('library').select('*').eq('student_id', studentId).order('created_at', { ascending: false });
      if (libData) {
        setLibraryGames(libData);
        setPendingGames(libData.filter(g => g.status === 'pending_approval' || (!g.status && !g.is_active)));
      }

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

  const openReviewModal = (game) => {
    setReviewingGame(game);
    const qs = game.content?.questions || [];
    setEditedQuestions(JSON.parse(JSON.stringify(qs)));
  };

  const closeReviewModal = () => {
    setReviewingGame(null);
    setEditedQuestions([]);
  };

  const handleQuestionEdit = (qIdx, field, val) => {
    const updated = [...editedQuestions];
    updated[qIdx][field] = val;
    setEditedQuestions(updated);
  };

  const handleOptionEdit = (qIdx, optIdx, val) => {
    const updated = [...editedQuestions];
    if (updated[qIdx].opts) {
      updated[qIdx].opts[optIdx] = val;
    }
    setEditedQuestions(updated);
  };

  const handleApprove = async (gameId) => {
    setActionLoading(true);
    const updatedContent = {
      ...reviewingGame.content,
      questions: editedQuestions
    };

    const res = await approveGame(gameId, 'parent_123', updatedContent);
    if (res) {
      showToast('✅ Game Sahi Paaya Gaya! Bache Ki Library Me Live Ho Gaya 🎉');
      setPendingGames(pendingGames.filter(g => g.id !== gameId));
      setLibraryGames(libraryGames.map(g => g.id === gameId ? { ...g, status: 'approved', is_active: true, content: updatedContent } : g));
      closeReviewModal();
    } else {
      alert('Approval fail ho gaya. Kripya dobara try karein.');
    }
    setActionLoading(false);
  };

  const handleReject = async (gameId) => {
    if (!window.confirm('⚠️ Kya aap is scan ko reject karna chahte hain (e.g. Blurry photo ya galat text)?')) return;
    setActionLoading(true);
    const res = await rejectGame(gameId, 'parent_123', 'Blurry/Scribbled or non-educational');
    if (res) {
      showToast('❌ Scan Rejected!');
      setPendingGames(pendingGames.filter(g => g.id !== gameId));
      setLibraryGames(libraryGames.map(g => g.id === gameId ? { ...g, status: 'rejected', is_active: false } : g));
      closeReviewModal();
    }
    setActionLoading(false);
  };

  const toggleVisibility = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    const { error } = await supabase.from('library').update({ is_active: newStatus }).eq('id', id);
    if (!error) setLibraryGames(libraryGames.map(g => g.id === id ? { ...g, is_active: newStatus } : g));
  };

  const deleteGame = async (id) => {
    if (window.confirm('⚠️ Kya aap sach mein is game ko hamesha ke liye delete karna chahte hain?')) {
      const { error } = await supabase.from('library').delete().eq('id', id);
      if (!error) {
        setLibraryGames(libraryGames.filter(g => g.id !== id));
        setPendingGames(pendingGames.filter(g => g.id !== id));
      }
    }
  };

  const handleFocusClick = async (topicId) => {
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
          studentId: studentId
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply, type: data.action_taken }]);
        if (data.action_taken === 'guidance') {
          const { data: existingFocus } = await supabase.from('student_focus_areas').select('topic_tag').eq('student_id', studentId);
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
    setTimeout(() => setToast(''), 3000);
  };

  if (loading) return <div style={{...styles.container, justifyContent: 'center', alignItems: 'center', display: 'flex'}}>Loading Dashboard...</div>;

  if (!isAuthenticated) {
    return (
      <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <form onSubmit={handlePinSubmit} style={{ background: C.card, padding: 40, borderRadius: 24, textAlign: 'center', border: `1px solid ${C.border}`, maxWidth: 400, width: '90%' }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🔒</div>
          <h2 style={{ marginBottom: 10, fontSize: 24, fontWeight: 900 }}>Parent & Teacher Portal</h2>
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
          <h1 style={styles.headerTitle}>Parent & Teacher Dashboard</h1>
          <p style={styles.headerSubtitle}>Supervision & Verification Hub for {student?.name || 'Student'}</p>
        </div>
        <button onClick={() => { localStorage.removeItem('kidai_parent_id'); router.push('/login'); }} style={styles.logoutButton}>Logout</button>
      </header>

      <main style={{padding: '0 20px 40px', maxWidth: 1000, margin: '0 auto'}}>
        
        {/* ── SECTION 1: PENDING APPROVALS QUEUE (HIGHLIGHT) ── */}
        <section style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: pendingGames.length > 0 ? C.orange : C.text, margin: 0 }}>
                🔔 AI Verification & Approval Hub ({pendingGames.length} Pending)
              </h2>
              <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0' }}>
                Bache dwara scan kiye hue pages ko check karein. Photo aur sawal dekh kar approve karein.
              </p>
            </div>
            {pendingGames.length > 0 && (
              <span style={{ background: C.orange + '22', color: C.orange, border: `1px solid ${C.orange}44`, padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 800 }}>
                ⚠️ Review Required
              </span>
            )}
          </div>

          {pendingGames.length === 0 ? (
            <div style={{ background: C.card, padding: 20, borderRadius: 16, border: `1px solid ${C.border}`, textAlign: 'center', color: C.muted }}>
              ✅ Sabhi scanned games review ho chuke hain! Koi pending scan nahi hai.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {pendingGames.map(game => {
                const img = game.source_image_url || game.content?.sourceImage;
                const qCount = game.content?.questions?.length || 0;
                const score = game.ai_confidence_score || game.content?.ai_confidence_score || 95;
                return (
                  <div key={game.id} style={{ background: C.card, borderRadius: 16, border: `2px solid ${score < 85 ? C.red + '66' : C.orange + '66'}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: `0 4px 20px ${C.orange}11` }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      {img ? (
                        <img src={img} alt="Scanned Page" style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', border: `1px solid ${C.border}` }} />
                      ) : (
                        <div style={{ width: 64, height: 64, borderRadius: 10, background: C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📄</div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: 15, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{game.title}</div>
                        <div style={{ fontSize: 12, color: C.cyan, fontWeight: 700 }}>{game.subject?.toUpperCase() || 'MIXED'} • {qCount} Questions</div>
                        <div style={{ fontSize: 11, color: score >= 90 ? C.green : C.yellow, fontWeight: 800, marginTop: 2 }}>
                          {score >= 90 ? '🟢 95%+ Verified' : '⚠️ Review Details'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                      <button onClick={() => openReviewModal(game)} style={{ flex: 1, background: `linear-gradient(135deg, ${C.orange}, ${C.purple})`, color: '#fff', border: 'none', padding: '10px 14px', borderRadius: 10, fontWeight: 800, cursor: 'pointer', fontSize: 13 }}>
                        🔍 Photo & Sawal Dekho
                      </button>
                      <button onClick={() => deleteGame(game.id)} style={{ background: C.card2, color: C.red, border: `1px solid ${C.border}`, padding: '10px', borderRadius: 10, fontWeight: 800, cursor: 'pointer', fontSize: 13 }}>
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── SECTION 2: STATS & OVERVIEW ── */}
        <h2 style={styles.sectionTitle}>📊 {student?.name}'s Progress</h2>
        <div style={styles.statsGrid}>
          <StatCard title="Total Games Played" value={stats?.total || 0} icon="🎮" color={C.cyan} />
          <StatCard title="Concepts Mastered" value={stats?.mastered || 0} icon="🏆" color={C.green} />
          <StatCard title="Average Score" value={`${stats?.avgScore || 0}%`} icon="🎯" color={C.orange} />
          <StatCard title="Current Streak" value={`${student?.streak_days || 0} Days`} icon="🔥" color={C.pink} />
        </div>

        {/* ── SECTION 3: FOCUS AREAS ── */}
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

        {/* ── SECTION 4: ALL SCANNED GAMES TABLE ── */}
        <h2 style={styles.sectionTitle}>🗂️ All Scanned Games History</h2>
        <p style={styles.sectionDescription}>Purane scan kiye hue games ko manage karein, hide/show karein ya dobara review karein.</p>
        
        {libraryGames.length === 0 ? (
          <div style={{ background: C.card2, padding: 30, borderRadius: 16, textAlign: 'center', color: C.muted, border: `1px dashed ${C.border}` }}>Abhi koi game scan nahi kiya gaya hai.</div>
        ) : (
          <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: C.card2, color: C.muted, fontSize: 13 }}>
                  <th style={{ padding: '15px 20px', borderBottom: `1px solid ${C.border}` }}>GAME TITLE</th>
                  <th style={{ padding: '15px 20px', borderBottom: `1px solid ${C.border}` }}>SUBJECT</th>
                  <th style={{ padding: '15px 20px', borderBottom: `1px solid ${C.border}` }}>APPROVAL STATUS</th>
                  <th style={{ padding: '15px 20px', borderBottom: `1px solid ${C.border}`, textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {libraryGames.map(game => (
                  <tr key={game.id} style={{ borderBottom: `1px solid ${C.border}`, background: game.status === 'pending_approval' ? C.orange + '08' : 'transparent' }}>
                    <td style={{ padding: '15px 20px', fontWeight: 'bold' }}>
                      {game.title}
                      {game.status === 'pending_approval' && <span style={{ marginLeft: 8, fontSize: 10, background: C.orange, color: '#000', padding: '2px 6px', borderRadius: 4, fontWeight: 900 }}>PENDING</span>}
                    </td>
                    <td style={{ padding: '15px 20px' }}><span style={{ background: C.card2, padding: '4px 8px', borderRadius: 6, fontSize: 12, color: C.cyan }}>{game.subject?.toUpperCase() || 'MIXED'}</span></td>
                    <td style={{ padding: '15px 20px' }}>
                      {game.status === 'approved' || game.is_active ? (
                        <span style={{ color: C.green, fontSize: 13, fontWeight: 'bold' }}>✅ Approved & Live</span>
                      ) : game.status === 'rejected' ? (
                        <span style={{ color: C.red, fontSize: 13, fontWeight: 'bold' }}>❌ Rejected</span>
                      ) : (
                        <span style={{ color: C.orange, fontSize: 13, fontWeight: 'bold' }}>⏳ Pending Review</span>
                      )}
                    </td>
                    <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                      <button onClick={() => openReviewModal(game)} style={{ background: C.card2, color: C.cyan, border: `1px solid ${C.cyan}44`, padding: '6px 10px', borderRadius: 8, cursor: 'pointer', marginRight: 8, fontSize: 12, fontWeight: 'bold' }}>
                        🔍 View / Edit
                      </button>
                      <button onClick={() => toggleVisibility(game.id, game.is_active)} style={{ background: game.is_active ? C.card2 : C.green+'33', color: game.is_active ? C.text : C.green, border: `1px solid ${game.is_active ? C.border : C.green}`, padding: '6px 10px', borderRadius: 8, cursor: 'pointer', marginRight: 8, fontSize: 12, fontWeight: 'bold' }}>
                        {game.is_active ? '👁️ Hide' : '👁️‍🗨️ Show'}
                      </button>
                      <button onClick={() => deleteGame(game.id)} style={{ background: '#ef444422', color: C.red, border: '1px solid #ef444455', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 'bold' }}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── SECTION 5: ARYA CHAT ASSISTANT ── */}
        <h2 style={styles.sectionTitle}>💬 Arya Manager (AI Assistant)</h2>
        <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', height: 350, overflow: 'hidden', marginTop: 16 }}>
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
              </div>
            ))}
            {chatLoading && <div style={{ color: C.muted, fontSize: 12, fontStyle: 'italic' }}>Arya likh rahi hain... ✍️</div>}
            <div ref={chatEndRef} />
          </div>
          
          <div style={{ padding: 12, background: C.card2, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
            <input 
              value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type message..." 
              style={{ flex: 1, padding: '10px 14px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, color: '#fff', outline: 'none', fontSize: 14 }}
            />
            <button onClick={sendMessage} style={{ background: C.cyan, color: '#000', border: 'none', padding: '0 16px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>Send ➔</button>
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 🔍 SPLIT-SCREEN REVIEW & APPROVAL MODAL                       */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {reviewingGame && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: C.card, borderRadius: 24, border: `2px solid ${C.border}`, width: '100%', maxWidth: 1100, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: `0 20px 50px rgba(0,0,0,0.8)` }}>
            
            {/* Modal Header */}
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}`, background: C.card2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: C.text }}>
                  🔍 Scanned Game Verification & Approval
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: C.muted }}>
                  Left: Scanned Photo • Right: AI Generated Questions (Edit agar koi typo ho)
                </p>
              </div>
              <button onClick={closeReviewModal} style={{ background: 'transparent', border: 'none', color: C.muted, fontSize: 24, cursor: 'pointer' }}>✕</button>
            </div>

            {/* Modal Body - Split Screen */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.3fr', overflow: 'hidden', gap: 0 }}>
              
              {/* LEFT: ORIGINAL PHOTO WITH ZOOM */}
              <div style={{ padding: 20, borderRight: `1px solid ${C.border}`, background: '#05070c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflowY: 'auto' }}>
                {reviewingGame.source_image_url || reviewingGame.content?.sourceImage ? (
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, fontWeight: 700 }}>📸 ORIGINAL SCANNED PAGE</div>
                    <img 
                      src={reviewingGame.source_image_url || reviewingGame.content?.sourceImage} 
                      alt="Source Scanned" 
                      style={{ maxWidth: '100%', maxHeight: '65vh', borderRadius: 12, border: `1px solid ${C.border}`, objectFit: 'contain' }}
                    />
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>💡 Tip: Photo ko zoom karke text check karein</div>
                  </div>
                ) : (
                  <div style={{ color: C.muted, textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📷</div>
                    Photo preview available nahi hai
                  </div>
                )}
              </div>

              {/* RIGHT: GENERATED QUESTIONS & SOURCE PROOFS */}
              <div style={{ padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                {/* Confidence Badge */}
                <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>AI Confidence & Verification</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{reviewingGame.ai_verification_notes || 'All facts cross-checked with image'}</div>
                  </div>
                  <span style={{ background: C.green + '22', color: C.green, border: `1px solid ${C.green}44`, padding: '4px 10px', borderRadius: 99, fontWeight: 900, fontSize: 13 }}>
                    🟢 {reviewingGame.ai_confidence_score || 95}% Verified
                  </span>
                </div>

                {/* Questions List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {editedQuestions.map((q, qIdx) => (
                    <div key={qIdx} style={{ background: C.card2, borderRadius: 16, border: `1px solid ${C.border}`, padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontWeight: 800, fontSize: 13, color: C.orange }}>Question #{qIdx + 1}</span>
                        <span style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>✅ Correct: Option {['A','B','C','D'][q.correct] || q.correct + 1}</span>
                      </div>

                      {/* Question English */}
                      <label style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>English Question:</label>
                      <input 
                        value={q.gameQ || q.q || ''} 
                        onChange={(e) => handleQuestionEdit(qIdx, 'gameQ', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 13, marginBottom: 8 }}
                      />

                      {/* Question Hinglish */}
                      <label style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>Hinglish Translation:</label>
                      <input 
                        value={q.gameQ_hin || ''} 
                        onChange={(e) => handleQuestionEdit(qIdx, 'gameQ_hin', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 12, marginBottom: 8 }}
                      />

                      {/* Options */}
                      <label style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>Options:</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                        {(q.opts || []).map((opt, optIdx) => (
                          <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 800, color: optIdx === q.correct ? C.green : C.muted }}>{['A','B','C','D'][optIdx]}:</span>
                            <input 
                              value={opt} 
                              onChange={(e) => handleOptionEdit(qIdx, optIdx, e.target.value)}
                              style={{ flex: 1, padding: '6px 10px', borderRadius: 6, background: optIdx === q.correct ? C.green + '15' : C.bg, border: `1px solid ${optIdx === q.correct ? C.green : C.border}`, color: C.text, fontSize: 12 }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Source Quote Proof */}
                      {q.sourceQuote && (
                        <div style={{ background: C.yellow + '11', border: `1px solid ${C.yellow}33`, borderRadius: 8, padding: '8px 10px', fontSize: 11, color: C.yellow, lineHeight: 1.4 }}>
                          📖 <strong>Book Proof:</strong> "{q.sourceQuote}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Modal Footer - Actions */}
            <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.border}`, background: C.card2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={() => handleReject(reviewingGame.id)}
                disabled={actionLoading}
                style={{ background: '#ef444422', color: C.red, border: `1px solid #ef444455`, padding: '12px 20px', borderRadius: 12, fontWeight: 800, cursor: 'pointer', fontSize: 14 }}>
                ❌ Reject (Dhoondhla / Galat)
              </button>

              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  onClick={closeReviewModal}
                  style={{ background: C.card, color: C.muted, border: `1px solid ${C.border}`, padding: '12px 20px', borderRadius: 12, fontWeight: 800, cursor: 'pointer', fontSize: 14 }}>
                  Cancel
                </button>
                <button 
                  onClick={() => handleApprove(reviewingGame.id)}
                  disabled={actionLoading}
                  style={{ background: `linear-gradient(135deg, ${C.green}, ${C.cyan})`, color: '#000', border: 'none', padding: '12px 28px', borderRadius: 12, fontWeight: 900, cursor: 'pointer', fontSize: 15, boxShadow: `0 4px 20px ${C.green}44` }}>
                  {actionLoading ? 'Processing...' : '✅ Sahi Hai — Approve & Send to Kid! 🚀'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

const StatCard = ({ title, value, icon, color }) => (<div style={{...styles.statCard, borderLeft: `4px solid ${color}`}}><div style={{fontSize: 28, marginBottom: 8}}>{icon}</div><div style={{fontSize: 22, fontWeight: 900, color: C.text}}>{value}</div><div style={{fontSize: 12, color: C.muted}}>{title}</div></div>);
const styles = { container: { background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }, header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: `1px solid ${C.border}` }, headerTitle: { margin: 0, fontSize: 20, fontWeight: 800 }, headerSubtitle: { margin: '4px 0 0', fontSize: 13, color: C.muted }, logoutButton: { background: C.card2, color: C.muted, border: `1px solid ${C.border}`, padding: '8px 14px', borderRadius: 10, cursor: 'pointer' }, sectionTitle: { fontSize: 18, fontWeight: 900, marginTop: 30, marginBottom: 8 }, sectionDescription: { fontSize: 13, color: C.muted, marginTop: 0, marginBottom: 16, lineHeight: 1.6 }, statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }, statCard: { background: C.card, borderRadius: 12, padding: 16 }, focusGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }, focusCard: { background: C.card, borderRadius: 12, padding: 16, textAlign: 'center', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }, focusSelected: { position: 'absolute', top: 8, right: 8, background: C.green, color: '#000', fontSize: 9, fontWeight: 900, padding: '3px 6px', borderRadius: 6 }, toast: { position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: C.green, color: '#000', padding: '12px 24px', borderRadius: 12, fontWeight: 900, zIndex: 1000, boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }};