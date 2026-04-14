'use client'
import { useState } from 'react';
import AryaAvatar from './AryaAvatar';
import { speak } from '@/lib/voice';

export default function AryaChat({ messages = [], onSendMessage, loading }) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const send = () => {
    if (!input.trim() || loading) return;
    onSendMessage(input);
    setInput('');
  };

  // Voice to Text (Bol kar type karna)
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Aapka browser voice typing support nahi karta 😢. Google Chrome use karein.");
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'hi-IN'; // Hindi/Hinglish ke liye
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev ? prev + " " + transcript : transcript);
    };
    
    recognition.onerror = (event) => {
      setIsListening(false);
    };
    
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, justifyContent: msg.ai ? 'flex-start' : 'flex-end' }}>
            {msg.ai && <AryaAvatar size={32} mood={loading && i === messages.length - 1 ? "thinking" : "happy"} animated={false} />}
            <div style={{ maxWidth: '80%' }}>
              <div style={{
                padding: '10px 14px', borderRadius: 16,
                background: msg.ai ? '#161e30' : 'linear-gradient(135deg, #ff6b35, #f59e0b)',
                color: '#fff', fontSize: 14, lineHeight: 1.5,
                borderTopLeftRadius: msg.ai ? 4 : 16,
                borderTopRightRadius: !msg.ai ? 4 : 16,
              }}>
                {msg.text}
              </div>
              {msg.ai && (
                <button onClick={() => speak(msg.text, { pitch: 1.2, rate: 0.9 })} style={{ marginTop: 6, background: 'transparent', border: 'none', color: '#06b6d4', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  🔊 Padh ke sunao
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', gap: 8, paddingTop: 10 }}>
        <button onClick={startListening} disabled={loading} style={{ padding: '0 16px', borderRadius: 14, background: isListening ? '#ef4444' : '#1e2d45', color: '#fff', border: 'none', fontSize: 18, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.3s' }}>
          {isListening ? '🎙️' : '🎤'}
        </button>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Arya se pucho..." style={{ flex: 1, padding: '12px 16px', borderRadius: 14, border: '1px solid #1e2d45', background: '#0f1520', color: '#f1f5f9', outline: 'none' }} />
        <button onClick={send} disabled={loading || !input.trim()} style={{ padding: '0 20px', borderRadius: 14, background: input.trim() ? '#ff6b35' : '#7c3aed', color: '#fff', border: 'none', fontWeight: 800, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', transition: 'background 0.3s' }}>
          ➤
        </button>
      </div>
    </div>
  );
}