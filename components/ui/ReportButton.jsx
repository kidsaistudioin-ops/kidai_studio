'use client';
import { useState } from 'react';

export default function ReportButton({ quizId, studentId }) {
  const [reported, setReported] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    if (!quizId || !studentId) return alert('Pehle login karo dost!');
    
    const reason = prompt('Kya galti hai is game mein? (Galat answer, spelling mistake, etc.)');
    if (!reason) return;

    setLoading(true);
    try {
      await fetch('/api/games/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          quizId,
          issueType: 'user_reported',
          details: reason
        })
      });
      setReported(true);
      alert('Thanks! Humne Arya ko bata diya hai, wo isko theek kar degi. 🚀');
    } catch (err) {
      alert('Report bhejne mein error aayi!');
    }
    setLoading(false);
  };

  if (reported) return <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 'bold' }}>🚩 Report Sent</span>;

  return (
    <button onClick={handleReport} disabled={loading} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, marginTop: 10 }}>
      🚩 Report Error
    </button>
  );
}