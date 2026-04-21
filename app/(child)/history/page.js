'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  green: '#10b981', orange: '#ff6b35', purple: '#7c3aed', text: '#f1f5f9', muted: '#64748b', cyan: '#06b6d4'
};

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ played: 0, won: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const studentId = 'student_123'; // NOTE: Isko actual logged-in user ID se replace kar dena baad mein
      
      // 1. Fetch Real Stats (Kitne khele aur kitne jeete)
      const { data: sessions } = await supabase
        .from('daily_sessions')
        .select('quizzes_attempted, quizzes_correct')
        .eq('student_id', studentId);
        
      let totalPlayed = 0, totalWon = 0;
      if (sessions) {
        totalPlayed = sessions.reduce((s, row) => s + (row.quizzes_attempted || 0), 0);
        totalWon = sessions.reduce((s, row) => s + (row.quizzes_correct || 0), 0);
      }
      setStats({ played: totalPlayed, won: totalWon });

      // 2. Fetch Recent Games/Challenges History (Original data)
      const { data: attempts } = await supabase
        .from('quiz_attempts')
        .select('is_correct, last_score, updated_at, quizzes(question, difficulty)')
        .eq('student_id', studentId)
        .order('updated_at', { ascending: false })
        .limit(30);
        
      if (attempts) setHistory(attempts);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text }}>
      <Header title="My Achievements 🏆" showBack onBack={() => router.back()} />
      
      <div style={{ padding: 16, maxWidth: 600, margin: '0 auto', paddingBottom: 100 }}>
        {/* Real Stats Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎮</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.cyan }}>{loading ? '...' : stats.played}</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>Games Played</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🏅</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.orange }}>{loading ? '...' : stats.won}</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>Challenges Won</div>
          </div>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: C.text }}>Recent History</h2>
        
        {/* Real History List */}
        {loading ? (
          <div style={{ textAlign: 'center', color: C.muted, padding: 20 }}>Original data load ho raha hai... 🔄</div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', background: C.card, padding: 24, borderRadius: 16, border: `1px dashed ${C.border}` }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
            <div style={{ color: C.muted }}>Abhi tak koi game nahi khela. Chalo shuru karein!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {history.map((item, idx) => (
              <div key={idx} style={{ background: C.card, border: `1px solid ${item.is_correct ? C.green+'44' : C.border}`, borderRadius: 14, padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: item.is_correct ? C.green+'22' : C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {item.is_correct ? '✅' : '🎯'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: item.is_correct ? C.green : C.text, marginBottom: 4 }}>
                    {item.is_correct ? 'Challenge Won!' : 'Good Try!'}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                    {item.quizzes?.question || 'Smart Game'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: item.is_correct ? C.orange : C.muted }}>+{item.last_score} XP</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{new Date(item.updated_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}