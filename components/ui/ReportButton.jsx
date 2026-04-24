'use client';
import { useState } from 'react';

export default function ReportButton({ gameId, studentId, onReported }) {
  const [reported, setReported] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    if (!gameId || !studentId) return alert('Pehle login karo dost!');
    
    const reason = prompt('Kya galti hai is game mein? (Galat answer, spelling mistake, etc.)');
    if (!reason) return;

    setLoading(true);
    try {
      const res = await fetch('/api/games/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          gameId,
          issueType: 'user_reported',
          details: reason
        })
      });
      
      if (res.ok) {
        setReported(true);
        alert('Thanks! Humne note kar liya hai, ye game ab hide ho jayega. 🚀');
        if (onReported) onReported(gameId); // Parent component ko batao taaki wo game UI se hide ho jaye
      } else {
        alert('Report bhejne mein error aayi!');
      }
    } catch (err) {
      alert('Report bhejne mein error aayi!');
    }
    setLoading(false);
  };

  if (reported) return <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 'bold', padding: '6px 12px', background: '#ef444422', borderRadius: 8, display: 'inline-block', marginTop: 10 }}>🚩 Reported & Hidden</span>;

  return (
    <button onClick={handleReport} disabled={loading} style={{ background: '#1e2d45', border: '1px solid #334155', color: '#cbd5e1', cursor: 'pointer', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '6px 12px', borderRadius: 8, fontWeight: 'bold', transition: 'all 0.2s' }}>
      {loading ? '⏳ Sending...' : '🚩 Report Error'}
    </button>
  );
}