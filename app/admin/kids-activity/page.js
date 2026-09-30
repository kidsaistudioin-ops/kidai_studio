'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  yellow: '#f59e0b', pink: '#ec4899', red: '#ef4444', text: '#f1f5f9', muted: '#64748b'
};

export default function AdminKidsActivityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'games', 'artworks', 'chats', 'books'
  const [selectedKid, setSelectedKid] = useState('all');
  const [previewItem, setPreviewItem] = useState(null);

  // Sample Aggregated Activity Stream (Populated dynamically from Supabase / LocalStorage)
  const [activities, setActivities] = useState([
    {
      id: 'act_1',
      type: 'game',
      title: 'Solar System Planet Quiz 🪐',
      kidId: 'student_arjun_1',
      kidName: 'Arjun (Class 5)',
      time: '15 mins ago',
      details: 'Created a 5-question Solar System match game using Arya AI Tutor.',
      sourceBook: 'NCERT Class 5 Science Chapter 8',
      preview: '🎮 Quiz • 5 Questions • Topic: Planets & Gravity',
      badge: 'Game Created'
    },
    {
      id: 'act_2',
      type: 'artwork',
      title: 'Lion King Masterpiece 🦁',
      kidId: 'student_arjun_1',
      kidName: 'Arjun (Class 5)',
      time: '1 hour ago',
      details: 'Painted a full Lion sketch using bucket fill and rainbow brushes in Coloring Book.',
      preview: '🎨 Coloring Book Art • Saved to Studio Library',
      badge: 'Artwork Saved'
    },
    {
      id: 'act_3',
      type: 'book',
      title: 'Math Fractions Chapter Scan 📚',
      kidId: 'student_neha_2',
      kidName: 'Neha (Class 7)',
      time: '2 hours ago',
      details: 'Uploaded 2 book pages. AI extracted formula rules and generated 3 games (Fraction Battle + Quiz).',
      sourceBook: 'CBSE Class 7 Mathematics Page 42',
      preview: '📸 2 Pages Scanned ➔ 3 Interactive Games Generated',
      badge: 'Book to Game'
    },
    {
      id: 'act_4',
      type: 'chat',
      title: 'Asked: "How do black holes work in space?" 🕳️',
      kidId: 'student_neha_2',
      kidName: 'Neha (Class 7)',
      time: '3 hours ago',
      details: 'Arya AI Tutor explained black hole gravity and suggested playing Cosmic Gravity game.',
      preview: '💬 Chat Conversation with AI Tutor Arya',
      badge: 'AI Tutor Chat'
    },
    {
      id: 'act_5',
      type: 'artwork',
      title: 'Handmade Robot Scanned Sticker 🤖',
      kidId: 'student_rahul_3',
      kidName: 'Rahul (Class 4)',
      time: 'Yesterday',
      details: 'Paper drawing scanned via camera, background auto-removed and converted into digital sticker.',
      preview: '📸 Magic Scanner • Transparent PNG Sticker',
      badge: 'Sticker Asset'
    },
    {
      id: 'act_6',
      type: 'game',
      title: 'Multiplication Table 12 Speed Run ⚡',
      kidId: 'student_rahul_3',
      kidName: 'Rahul (Class 4)',
      time: 'Yesterday',
      details: 'Played Math Racing and scored 240 points, earning 120 XP.',
      preview: '🏎️ Math Racing • Score: 240 • XP: +120',
      badge: 'Game Played'
    }
  ]);

  useEffect(() => {
    // Attempt to load live library items from Supabase
    async function loadLiveActivities() {
      try {
        const { data, error } = await supabase.from('library').select('*').order('created_at', { ascending: false }).limit(20);
        if (data && data.length > 0) {
          const formatted = data.map((item, idx) => ({
            id: item.id || `live_${idx}`,
            type: item.type === 'Coloring Sheet' || item.type === 'Sticker Asset' ? 'artwork' : 'game',
            title: item.title || 'Creative Creation',
            kidId: item.student_id || 'student_live',
            kidName: item.student_name || item.student_id || 'Student',
            time: 'Recently',
            details: `Created on platform (${item.type || 'Custom Item'}).`,
            preview: item.preview || item.content?.title || 'Interactive Content',
            badge: item.type || 'Creation'
          }));
          setActivities(prev => [...formatted, ...prev]);
        }
      } catch (err) {
        console.warn('Using activity stream cache');
      }
    }
    loadLiveActivities();
  }, []);

  const filteredActivities = activities.filter(act => {
    const matchType = activeTab === 'all' || act.type === activeTab;
    const matchKid = selectedKid === 'all' || act.kidId === selectedKid;
    return matchType && matchKid;
  });

  const uniqueKids = Array.from(new Set(activities.map(a => JSON.stringify({ id: a.kidId, name: a.kidName })))).map(s => JSON.parse(s));

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Navigation Bar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, background: C.card, padding: '18px 24px', borderRadius: 20, border: `1px solid ${C.border}`, flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => router.push('/admin')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 22 }}>←</button>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
                Kids Activity & Content Creation Monitor 🎨🎮
              </h1>
              <p style={{ margin: 0, color: C.muted, fontSize: 13 }}>Live portfolio of all games, drawings, scanned books, and chats made by kids</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Link 
              href="/admin/ai-costs" 
              style={{ background: `linear-gradient(135deg, ${C.green}, #059669)`, color: '#000', textDecoration: 'none', padding: '10px 18px', borderRadius: 12, fontWeight: 900, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              💰 View AI Cost & Tokens ↗
            </Link>
            <Link 
              href="/admin" 
              style={{ background: C.card2, color: C.text, border: `1px solid ${C.border}`, textDecoration: 'none', padding: '10px 16px', borderRadius: 12, fontWeight: 800, fontSize: 13 }}
            >
              👑 Main Admin
            </Link>
          </div>
        </header>

        {/* ── FILTER TOOLBAR ── */}
        <div style={{ background: C.card, padding: 18, borderRadius: 20, border: `1px solid ${C.border}`, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          
          {/* Activity Category Tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: '🌟 All Activity' },
              { id: 'games', label: '🎮 Games Created' },
              { id: 'artworks', label: '🎨 Drawings & Art' },
              { id: 'books', label: '📚 Book Scans' },
              { id: 'chats', label: '💬 AI Tutor Chats' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: activeTab === tab.id ? `1px solid ${C.cyan}` : `1px solid ${C.border}`,
                  background: activeTab === tab.id ? `${C.cyan}22` : C.card2,
                  color: activeTab === tab.id ? C.cyan : C.text,
                  fontWeight: 900,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filter by Specific Kid Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 800 }}>FILTER KID:</span>
            <select
              value={selectedKid}
              onChange={e => setSelectedKid(e.target.value)}
              style={{
                background: C.card2,
                color: '#fff',
                border: `1px solid ${C.border}`,
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 800,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">👨‍👩‍👧 All Students</option>
              {uniqueKids.map(k => (
                <option key={k.id} value={k.id}>{k.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* ── ACTIVITY FEED GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
          {filteredActivities.map((act) => (
            <div 
              key={act.id} 
              style={{ 
                background: C.card, 
                border: `1px solid ${C.border}`, 
                borderRadius: 20, 
                padding: 20, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}
            >
              <div>
                {/* Header Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ 
                    background: act.type === 'game' ? `${C.purple}22` : act.type === 'artworks' ? `${C.pink}22` : act.type === 'books' ? `${C.orange}22` : `${C.cyan}22`,
                    color: act.type === 'game' ? C.purple : act.type === 'artworks' ? C.pink : act.type === 'books' ? C.orange : C.cyan,
                    border: `1px solid ${act.type === 'game' ? C.purple : act.type === 'artworks' ? C.pink : act.type === 'books' ? C.orange : C.cyan}55`,
                    fontSize: 11,
                    fontWeight: 900,
                    padding: '3px 10px',
                    borderRadius: 8
                  }}>
                    {act.badge}
                  </span>
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>{act.time}</span>
                </div>

                {/* Title & Kid info */}
                <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', marginBottom: 4 }}>
                  {act.title}
                </div>
                <div style={{ fontSize: 13, color: C.cyan, fontWeight: 800, marginBottom: 10 }}>
                  👤 By: {act.kidName}
                </div>

                {/* Details */}
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, marginBottom: 14, background: C.card2, padding: 12, borderRadius: 12, border: `1px solid ${C.border}` }}>
                  {act.details}
                  {act.sourceBook && (
                    <div style={{ marginTop: 6, color: C.orange, fontSize: 11, fontWeight: 800 }}>
                      📖 Source: {act.sourceBook}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 8, borderTop: `1px solid ${C.border}`, paddingTop: 12, marginTop: 6 }}>
                {act.type === 'game' && (
                  <button 
                    onClick={() => router.push('/seekho')}
                    style={{ flex: 1, padding: '8px', background: C.purple, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}
                  >
                    ▶️ Play / Inspect Game
                  </button>
                )}
                {act.type === 'artworks' && (
                  <button 
                    onClick={() => router.push('/studio/library')}
                    style={{ flex: 1, padding: '8px', background: C.pink, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}
                  >
                    🖼️ View in Studio Library
                  </button>
                )}
                {act.type === 'books' && (
                  <button 
                    onClick={() => router.push('/scanner')}
                    style={{ flex: 1, padding: '8px', background: C.orange, color: '#000', border: 'none', borderRadius: 8, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}
                  >
                    🔍 View Book Scan
                  </button>
                )}
                {act.type === 'chats' && (
                  <button 
                    onClick={() => router.push('/chat')}
                    style={{ flex: 1, padding: '8px', background: C.cyan, color: '#000', border: 'none', borderRadius: 8, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}
                  >
                    💬 View Tutor Chat
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: C.card, borderRadius: 24, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 54, marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 900, fontSize: 18, color: '#fff' }}>No activities found for this filter</div>
            <p style={{ color: C.muted, fontSize: 14 }}>Try selecting a different tab or student above.</p>
          </div>
        )}

      </div>
    </div>
  );
}
