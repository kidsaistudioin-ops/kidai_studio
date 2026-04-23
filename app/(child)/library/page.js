'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import { getLibraryItems } from '@/lib/supabase';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  text: '#f1f5f9', muted: '#64748b'
};

const SUBJECTS = [
  { id: 'all', label: 'All Games', icon: '📚' },
  { id: 'math', label: 'Maths', icon: '➗' },
  { id: 'science', label: 'Science', icon: '🔬' },
  { id: 'english', label: 'English', icon: '🔤' },
  { id: 'general', label: 'Others', icon: '📁' }
];

export default function LibraryPage() {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function fetchLibrary() {
      const studentId = localStorage.getItem('kidai_student_id');
      if (!studentId) {
        setLoading(false);
        return;
      }

      // Supabase se saare saved games laana
      const data = await getLibraryItems(studentId);
      setGames(data || []);
      setLoading(false);
    }
    fetchLibrary();
  }, []);

  const playSavedGame = (gameContent) => {
    // Game data ko local storage me dalo aur seekho page par le jao
    localStorage.setItem('kidai_scanned_game', JSON.stringify(gameContent));
    router.push('/seekho');
  };

  // Tab (Subject) ke hisaab se games filter karna
  const filteredGames = games.filter(g => {
    if (activeTab === 'all') return true;
    if (activeTab === 'general') return !['math', 'science', 'english'].includes(g.subject?.toLowerCase());
    return g.subject?.toLowerCase().includes(activeTab);
  });

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }}>
      <Header title="My Library 🎒" />
      
      <div style={{ padding: '24px 16px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 50, marginBottom: 8 }}>🎒</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Aapke Banaye Hue <span style={{ color: C.cyan }}>Games</span></h1>
          <p style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>Scanner aur AI Chat se banaye gaye saare games yahan save hain.</p>
        </div>

        {/* Tabs (Folders) */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10, marginBottom: 20, scrollbarWidth: 'none' }}>
          {SUBJECTS.map(sub => (
            <button
              key={sub.id}
              onClick={() => setActiveTab(sub.id)}
              style={{
                background: activeTab === sub.id ? C.cyan : C.card,
                color: activeTab === sub.id ? '#000' : C.text,
                border: `1px solid ${activeTab === sub.id ? C.cyan : C.border}`,
                padding: '10px 16px', borderRadius: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'
              }}
            >
              <span>{sub.icon}</span> {sub.label}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', color: C.muted, padding: 40 }}>Library load ho rahi hai... ⏳</div>
        ) : filteredGames.length === 0 ? (
          <div style={{ textAlign: 'center', background: C.card, padding: 40, borderRadius: 20, border: `1px dashed ${C.border}` }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📂</div>
            <div style={{ color: C.muted, fontWeight: 700 }}>Is folder mein abhi koi game nahi hai.</div>
            <button onClick={() => router.push('/scanner')} style={{ marginTop: 16, background: C.orange, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}>📸 Naya Scan Karo</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
            {filteredGames.map(game => (
              <div key={game.id} onClick={() => playSavedGame(game.content)} style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, cursor: 'pointer', transition: 'transform 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ background: C.purple + '33', color: C.purple, padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>{game.subject || 'Mixed'}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{new Date(game.created_at).toLocaleDateString()}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6, color: C.text }}>{game.title}</div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>{game.content?.questions?.length || 0} Questions • AI Generated</div>
                
                <button style={{ width: '100%', background: C.green + '22', color: C.green, border: 'none', padding: '10px', borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}>▶ Play Game</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}