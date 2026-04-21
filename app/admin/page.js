'use client'
import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [msgs, setMsgs] = useState([{ ai: true, text: "Hello Boss! 🫡 Main aapka Admin Assistant AI hoon. Boliye aaj kya command hai? (Jaise: 'Aaj 100 naye games generate karo')" }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  // Load Admin Chat History from LocalStorage (3 Days Expiry)
  useEffect(() => {
    const saved = localStorage.getItem('kidai_admin_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Date.now() - parsed.timestamp < 259200000) {
          setMsgs(parsed.data);
        } else {
          localStorage.removeItem('kidai_admin_history');
        }
      } catch (e) {}
    }
  }, []);

  // Save Admin Chat History to LocalStorage
  useEffect(() => {
    if (msgs.length > 1) {
      localStorage.setItem('kidai_admin_history', JSON.stringify({ timestamp: Date.now(), data: msgs }));
    }
  }, [msgs]);

  const sendCmd = async () => {
    if(!input.trim() || loading) return
    const text = input
    setInput('')
    setMsgs(prev => [...prev, { ai: false, text }])
    setLoading(true)

    const recentHistory = msgs.slice(-10).map(m => ({
      role: m.ai ? 'assistant' : 'user',
      content: m.text
    }));

    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: recentHistory })
      })
      const data = await res.json()
      
      setMsgs(prev => [...prev, { ai: true, text: data.message }])
      
      if(data.action === 'generate_games') {
        // Yahan se hum direct wo 100 game banane wala API trigger kar sakte hain
        setMsgs(prev => [...prev, { ai: true, text: "⚙️ [SYSTEM]: Background Game Generation mode On ho gaya hai..." }])
      }
    } catch (e) {
      setMsgs(prev => [...prev, { ai: true, text: "❌ Error connecting to AI." }])
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: 20, background: '#07090f', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#06b6d4', borderBottom: '1px solid #1e2d45', paddingBottom: 10 }}>🛡️ Admin Command Center</h1>
      
      <div style={{ display: 'flex', gap: 20, marginTop: 20, flexWrap: 'wrap' }}>
        {/* Stats Panel */}
        <div style={{ flex: 1, background: '#0f1520', padding: 20, borderRadius: 12, border: '1px solid #1e2d45', minWidth: 300 }}>
          <h3>📊 App Statistics (Live)</h3>
          <p>Total Games in Library: <strong style={{color: '#10b981'}}>Fetching...</strong></p>
          <p>Active Students Today: <strong style={{color: '#7c3aed'}}>Fetching...</strong></p>
          <p>Auto-Generator Status: <strong style={{color: '#f59e0b'}}>Standby</strong></p>
          <p>Next Cron Job: <strong style={{color: '#06b6d4'}}>12:00 AM Night</strong></p>
        </div>

        {/* Admin AI Chat */}
        <div style={{ flex: 2, background: '#0f1520', borderRadius: 12, border: '1px solid #1e2d45', display: 'flex', flexDirection: 'column', height: '70vh', minWidth: 350 }}>
          <div style={{ padding: 15, borderBottom: '1px solid #1e2d45', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 10 }}>
            🤖 <span>Admin Assistant AI</span>
          </div>
          
          <div style={{ flex: 1, padding: 15, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.ai ? 'flex-start' : 'flex-end', background: m.ai ? '#1e2d45' : '#7c3aed', padding: '10px 15px', borderRadius: 12, maxWidth: '80%' }}>
                {m.text}
              </div>
            ))}
            {loading && <div style={{ color: '#06b6d4', fontSize: 14 }}>AI soch raha hai...</div>}
          </div>

          <div style={{ padding: 15, borderTop: '1px solid #1e2d45', display: 'flex', gap: 10 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendCmd()} placeholder="AI ko command do (e.g. Aaj 50 naye Math games banao)..." style={{ flex: 1, padding: 12, borderRadius: 8, background: '#07090f', border: '1px solid #1e2d45', color: '#fff', outline: 'none' }} />
            <button onClick={sendCmd} style={{ padding: '0 20px', background: '#06b6d4', color: '#000', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}