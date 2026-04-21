'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/ui/Header'
import Toast from '@/components/ui/Toast'
import AryaChat from '@/components/arya/AryaChat'
import { speak, stopSpeaking } from '@/lib/voice'

const C = {
  card:'#0f1520', card2:'#161e30', border:'#1e2d45',
  orange:'#ff6b35', purple:'#7c3aed', cyan:'#06b6d4',
  green:'#10b981', yellow:'#f59e0b', text:'#f1f5f9', muted:'#64748b',
}

const QUICK_CHIPS = {
  '6-9':  ['🧠 AI kya hai?', '🎮 Game banana', '🔢 Math help', '🐱 Animals'],
  '10-13':['🤖 AI kya hai?', '💻 Game banana', '🔬 Science', '📝 English'],
  '14-18':['🧠 AI architecture', '💰 Paise kamana', '🎮 Game bechna', '🚀 Startup'],
}

export default function ChatPage() {
  const router = useRouter()
  const [age, setAge] = useState('10-13')
  const [messages, setMessages] = useState([
    { ai: true, text: "Heyy! Main Arya hoon 🤖\n\nMujhse kuch bhi poochho — Math, Science, English, ya AI ke baare mein! Hinglish mein baat karo — main samjhunga! 😊" }
  ])
  const [loading, setLoading] = useState(false)
  const [xp, setXp] = useState(120)
  const [toast, setToast] = useState({ visible: false, msg: '' })
  const [voiceEnabled, setVoiceEnabled] = useState(false) // Default aawaz band rahegi

  const showToast = (msg) => {
    setToast({ visible: true, msg })
    setTimeout(() => setToast({ visible: false, msg: '' }), 2000)
  }

  // Load Chat History from LocalStorage (3 Days Expiry)
  useEffect(() => {
    const saved = localStorage.getItem('kidai_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check if history is older than 3 days (3 * 24 * 60 * 60 * 1000 ms)
        if (Date.now() - parsed.timestamp < 259200000) {
          setMessages(parsed.data);
        } else {
          localStorage.removeItem('kidai_chat_history'); // 3 din baad auto delete
        }
      } catch (e) {}
    }
  }, []);

  // Save Chat History to LocalStorage whenever it updates
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('kidai_chat_history', JSON.stringify({ timestamp: Date.now(), data: messages }));
    }
  }, [messages]);

  // Jab page chhodein toh aawaz band ho jaye
  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const sendMsg = async (text) => {
    if (!text.trim() || loading) return
    setMessages(m => [...m, { ai: false, text }])
    setLoading(true)

    // AI ko memory yaad rakhne ke liye last 12 messages bhejenge (achhi memory ke liye)
    const recentHistory = messages.slice(-12).map(m => ({
      role: m.ai ? 'assistant' : 'user',
      content: m.text
    }));

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          childAge: parseInt(age.split('-')[0]),
          childId: 'student_123',
          history: recentHistory // Yahan hum memory bhej rahe hain
        }),
      })
      const data = await res.json()
      let reply = data.message + (data.followUp ? '\n\n' + data.followUp : '')
      
      // Smart Auto-Navigation Logic
      let redirectPath = null;
      const gotoMatch = reply.match(/\[GOTO:\s*([^\]]+)\]/);
      if (gotoMatch) {
        redirectPath = gotoMatch[1].trim();
        reply = reply.replace(gotoMatch[0], '').trim();
      }

      setMessages(m => [...m, { ai: true, text: reply }])
      
      stopSpeaking();
      // Aawaz tabhi aayegi jab user ne button ON kiya hoga
      if (voiceEnabled) {
        speak(reply, { pitch: 1.2, rate: 0.9 }); 
      }

      setXp(x => x + 5)
      showToast('+5 XP! ⚡')
      
      // Agar AI ne naya game generate kiya hai (Khelne ke liye)
      if (data.rawData?.newGameData || data.rawData?.suggestGame) {
        if (data.rawData.newGameData) {
          // Game ko memory me daalo taaki Seekho page ise padh sake
          localStorage.setItem('kidai_scanned_game', JSON.stringify(data.rawData.newGameData));
        }
        showToast('🎮 Naya Game ban gaya! Chalo khelte hain...');
        setTimeout(() => router.push('/seekho'), 3500); // Redirect to Play
      } else if (redirectPath) {
        // Agar AI ne Coding/Studio seekhne ke liye bheja hai
        showToast(`🚀 Chalo kuch naya banate hain...`);
        setTimeout(() => router.push(redirectPath), 3500); // Redirect to Studio
      }
    } catch {
      setMessages(m => [...m, { ai: true, text: 'Oops! Kuch error aa gaya. Dobara try karo! 😅' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ background: '#07090f', minHeight: '100vh', color: C.text, display: 'flex', flexDirection: 'column' }}>
      <Toast message={toast.msg} visible={toast.visible} />
      <Header xp={xp} />

      <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', animation: 'slideUp .3s ease', paddingBottom: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(135deg,#1e1b4b,#0f1629)', border: `1px solid ${C.purple}44`, borderRadius: 16, padding: 14, marginBottom: 12 }}>
          <div style={{ width: 50, height: 50, borderRadius: 16, background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Arya — AI Tutor</div>
            <div style={{ fontSize: 12, color: C.muted }}>Teacher • Guide • Dost</div>
            <div style={{ fontSize: 11, color: C.green, marginTop: 3 }}>● Hinglish mein baat karo!</div>
          </div>
          <button 
            onClick={() => {
              setVoiceEnabled(!voiceEnabled);
              if (voiceEnabled) stopSpeaking(); // Agar OFF kiya toh bolna turant ruk jayega
            }}
            style={{
              background: voiceEnabled ? C.cyan + '22' : 'transparent',
              border: `1.5px solid ${voiceEnabled ? C.cyan : C.border}`,
              color: voiceEnabled ? C.cyan : C.muted,
              padding: '8px 12px',
              borderRadius: 12,
              fontSize: 18,
              cursor: 'pointer'
            }}
          >
            {voiceEnabled ? '🔊' : '🔈'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {['6-9', '10-13', '14-18'].map(a => (
            <button key={a} onClick={() => setAge(a)} style={{ flex: 1, padding: '7px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${age === a ? C.cyan : C.border}`, background: age === a ? C.cyan+'22' : C.card2, color: age === a ? C.cyan : C.muted }}>{a} saal</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {(QUICK_CHIPS[age] || []).map(c => (
            <div key={c} onClick={() => sendMsg(c)} style={{ padding: '7px 12px', borderRadius: 10, border: `1px solid ${C.purple}44`, background: '#1e1b4b88', color: '#a78bfa', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{c}</div>
          ))}
        </div>

        <div style={{ flex: 1, minHeight: 0 }}>
          <AryaChat messages={messages} onSendMessage={sendMsg} loading={loading} />
        </div>
      </div>
    </div>
  )
}