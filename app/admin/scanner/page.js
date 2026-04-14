'use client';
import { useState } from 'react';

export default function AdminScanner() {
  const [scanning, setScanning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [model, setModel] = useState('groq'); // Fast AI by default

  const handleScan = async () => {
    setScanning(true);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🚀 Starting batch scan with ${model}...`]);
    
    try {
      const res = await fetch('/api/admin/scan-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model })
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✅ Scan complete! Checked ${data.checked} games.`]);
    } catch (error) {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ❌ Error: ${error.message}`]);
    }
    setScanning(false);
  };

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', background: '#07090f', color: '#fff', minHeight: '100vh' }}>
      <h2>🕵️ AI Game Scanner (Batch Verify)</h2>
      <p style={{ color: '#888' }}>Ek click me database ke purane unverified games check karo.</p>
      
      <div style={{ margin: '20px 0', display: 'flex', gap: 10 }}>
        <select 
          value={model} 
          onChange={e => setModel(e.target.value)}
          style={{ padding: 10, borderRadius: 8, background: '#161e30', color: '#fff', border: '1px solid #1e2d45', outline: 'none' }}
        >
          <option value="groq">Groq (Llama-3) - Ultra Fast ⚡</option>
          <option value="openai">OpenAI (GPT-4o-mini) - Very Smart 🧠</option>
          <option value="gemini">Gemini 1.5 - Smart 💡</option>
        </select>
        
        <button 
          onClick={handleScan} 
          disabled={scanning}
          style={{ padding: '10px 20px', borderRadius: 8, background: scanning ? '#555' : '#7c3aed', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {scanning ? 'Scanning Backend...' : 'Scan Database Now'}
        </button>
      </div>

      <div style={{ background: '#000', padding: 20, borderRadius: 8, border: '1px solid #333', height: 400, overflowY: 'auto' }}>
        {logs.map((log, i) => <div key={i} style={{ marginBottom: 5, fontSize: 13, fontFamily: 'monospace' }}>{log}</div>)}
        {logs.length === 0 && <div style={{ color: '#555' }}>Scanner logs will appear here...</div>}
      </div>
    </div>
  );
}