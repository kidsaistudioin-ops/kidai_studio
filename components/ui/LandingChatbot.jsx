'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingChatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { ai: true, text: "Namaste! 🙏 Welcome to KidAI Studio. Main Tara hoon, aapki guide. Aap parent hain ya student? Main aapko kis page par le chalu?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Memory Load (Chat History restore karna)
  useEffect(() => {
    const saved = localStorage.getItem('kidai_landing_chat');
    if (saved) { try { setMessages(JSON.parse(saved)); } catch(e){} }
  }, []);

  // Memory Save (Har naye message par history save karna)
  useEffect(() => {
    if (messages.length > 1) localStorage.setItem('kidai_landing_chat', JSON.stringify(messages));
  }, [messages]);

  // Chat aane par auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userText = input;
    setMessages(prev => [...prev, { ai: false, text: userText }]);
    setInput('');
    setLoading(true);

    // History for context (Memory badha kar last 10 messages kar di gayi hai)
    const history = messages.slice(-10).map(m => ({
      role: m.ai ? 'assistant' : 'user',
      content: m.text.substring(0, 400) // Lambe messages ko limit karna
    }));

    try {
      // Yahan hum aapka existing Groq API route use kar rahe hain
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Strict instructions to prevent auto-navigation without asking and to avoid JSON leaks
          message: userText + "\n\n[SYSTEM INSTRUCTION: You are 'Tara', KidAI Studio's Landing Page Guide. 1. Speak respectfully in Hinglish. 2. NEVER output JSON format, output plain text only. 3. If the user wants to create a game, play a game, or scan homework, ENCOURAGE them and append '[GOTO:/scanner]' or '[GOTO:/play]'. 4. NEVER refuse to make a game because the user is an adult.]",
          childAge: 30, // Default age for parents/visitors
          childId: 'visitor_pre_login',
          history: history
        })
      });

      const data = await res.json();
      let reply = data.message + (data.followUp ? '\n\n' + data.followUp : '');
      
      // Safe-guard: Agar AI backend error ki wajah se galti se JSON code bhej de, toh usko clean karna
      if (typeof reply === 'string' && reply.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(reply.trim());
          // Agar parsed object mein message hai toh wo nikal lo
          reply = parsed.message || parsed.text || reply; 
        } catch(e) {}
      }

      // Check if AI wants to redirect user (Auto-Navigation Parsing)
      const gotoMatch = reply.match(/\[GOTO:\s*([^\]]+)\]/);
      if (gotoMatch) {
        const path = gotoMatch[1].trim();
        reply = reply.replace(gotoMatch[0], '').trim();
        setTimeout(() => router.push(path), 2500); // 2.5 second baad navigate hoga taaki user AI ka message padh sake
      }
      
      setMessages(prev => [...prev, { ai: true, text: reply }]);
    } catch (error) {
      console.error("Chatbot API Error:", error);
      setMessages(prev => [...prev, { ai: true, text: "Maaf kijiyega, abhi thodi technical problem hai. Kripya thodi der baad try karein. 🔌" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Chat Window */}
      {isOpen && (
        <div style={{ 
          width: '320px', 
          height: '450px', 
          background: '#0f1520', 
          borderRadius: '16px', 
          border: '1px solid #1e2d45',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          display: 'flex', 
          flexDirection: 'column',
          marginBottom: '16px',
          overflow: 'hidden',
          animation: 'slideUp 0.3s ease'
        }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>👩‍🏫</span> Tara — KidAI Guide
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>✖</button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: '#07090f' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                alignSelf: msg.ai ? 'flex-start' : 'flex-end', 
                background: msg.ai ? '#161e30' : '#7c3aed', 
                color: '#f1f5f9', 
                padding: '10px 14px', 
                borderRadius: '12px', 
                borderBottomLeftRadius: msg.ai ? '2px' : '12px',
                borderBottomRightRadius: !msg.ai ? '2px' : '12px',
                maxWidth: '85%',
                fontSize: '14px',
                lineHeight: '1.5',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: '#161e30', color: '#64748b', padding: '10px 14px', borderRadius: '12px', borderBottomLeftRadius: '2px', fontSize: '13px' }}>
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '12px', background: '#0f1520', borderTop: '1px solid #1e2d45', display: 'flex', gap: '8px' }}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #1e2d45', background: '#161e30', color: '#fff', outline: 'none', fontSize: '14px' }}
            />
            <button 
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '8px', cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
            >
              ➔
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff', border: 'none', fontSize: '28px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
        >
          💬
        </button>
      )}
    </div>
  );
}