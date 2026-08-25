'use client';

import { useRouter } from 'next/navigation';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  yellow: '#f59e0b', pink: '#ec4899', text: '#f1f5f9', muted: '#64748b'
};

export default function CreatorStudioPage() {
  const router = useRouter();

  const TOOLS = [
    {
      id: "magic-scanner",
      title: "Magic Scanner",
      desc: "Kagaz ki drawing ko scan karo, background hatao aur digital banao!",
      icon: "📸",
      color: C.green,
      tag: "Most Loved"
    },
    {
      id: "comic-maker",
      title: "Comic Maker",
      desc: "Apne characters ko canvas pe dalo aur unse baatein karwao.",
      icon: "💬",
      color: C.purple,
      tag: "Hot"
    },
    {
      id: "coloring-book",
      title: "Coloring Book",
      desc: "Drawings print karo ya screen par color bharo.",
      icon: "🎨",
      color: C.pink,
      tag: "Fun"
    },
    {
      id: "logo-maker",
      title: "Logo Maker",
      desc: "AI se apne naye project ke liye sundar logos aur templates banao.",
      icon: "✨",
      color: C.cyan,
      tag: "Pro"
    }
  ];

  const VIDEO_TOOLS = [
    {
      id: "story-video",
      title: "Story Video",
      desc: "Apni kahani ko animated video me badlo!",
      icon: "🎬",
      color: C.orange,
      tag: "NEW"
    },
    {
      id: "brand-promo",
      title: "Brand Promo",
      desc: "Scalio jaise professional promotional videos banao!",
      icon: "📢",
      color: C.yellow,
      tag: "NEW"
    },
    {
      id: "2d-animation",
      title: "2D Animation",
      desc: "Frame-by-frame 2D animation create karo!",
      icon: "🎞️",
      color: C.green,
      tag: "NEW"
    }
  ];

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(7,9,15,.97)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/home')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 22 }}>←</button>
          <span>Creator <span style={{ color: C.pink }}>Studio</span> 🎨</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => router.push('/studio/library')} style={{ background: `${C.orange}22`, color: C.orange, border: `1px solid ${C.orange}55`, padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            📁 Studio Library
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        
        {/* Intro Hero */}
        <div style={{ textAlign: 'center', marginBottom: 36, padding: '20px 0' }}>
          <div style={{ fontSize: 64, marginBottom: 12, display: 'inline-block', animation: "bounce 2s infinite" }}>👩‍🎨</div>
          <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, marginBottom: 10 }}>
            Apni Duniya <span style={{ background: `linear-gradient(90deg, ${C.pink}, ${C.orange}, ${C.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Khud Banao!</span> 🚀
          </h1>
          <p style={{ color: C.muted, fontSize: 15, maxWidth: 580, margin: '0 auto', lineHeight: 1.6 }}>
            Kagaz ki drawings scan karke digital stickers banao, animated video kahaniyan banao, aur comic panels design karo!
          </p>
        </div>

        {/* ── CORE CREATION SUITE (2-3 COLUMN GRID) ── */}
        <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          ✨ Drawing & Comic Studio Tools
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, marginBottom: 36 }}>
          {TOOLS.map((tool) => (
            <div 
              key={tool.id} 
              onClick={() => router.push(`/studio/${tool.id}`)}
              style={{ 
                background: `linear-gradient(135deg, ${tool.color}12, ${C.card})`, 
                border: `1px solid ${tool.color}44`, 
                borderRadius: 20, 
                padding: 22, 
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.2)"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = tool.color; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = `${tool.color}44`; }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ 
                    width: 56, height: 56, borderRadius: 16, background: `${tool.color}22`, 
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 
                  }}>
                    {tool.icon}
                  </div>
                  <span style={{ background: tool.color, color: "#fff", fontSize: 11, fontWeight: 900, padding: "3px 10px", borderRadius: 10 }}>
                    {tool.tag}
                  </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: 18, color: tool.color, marginBottom: 6 }}>{tool.title}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
                  {tool.desc}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: tool.color }}>Launch Studio</span>
                <span style={{ fontSize: 18, color: tool.color }}>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── VIDEO & ANIMATION PIPELINE SECTION ── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 28 }}>🎬</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 20 }}>Video & Animation Pipeline <span style={{ color: C.orange, fontSize: 13 }}>(AI Powered)</span></div>
              <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>Kahani aur graphics ko animated videos mein transform karein</div>
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginTop: 20 }}>
            {VIDEO_TOOLS.map((tool) => (
              <div 
                key={tool.id} 
                onClick={() => router.push(`/studio/${tool.id}`)}
                style={{ 
                  background: `linear-gradient(135deg, ${tool.color}12, ${C.card2})`, 
                  border: `1px solid ${tool.color}44`, 
                  borderRadius: 18, 
                  padding: 18, 
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.25s ease"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = tool.color; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = `${tool.color}44`; }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ 
                      width: 48, height: 48, borderRadius: 14, background: `${tool.color}22`, 
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 
                    }}>
                      {tool.icon}
                    </div>
                    <span style={{ background: tool.color, color: "#fff", fontSize: 10, fontWeight: 900, padding: "2px 8px", borderRadius: 8 }}>
                      {tool.tag}
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: tool.color, marginBottom: 4 }}>{tool.title}</div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.4 }}>
                    {tool.desc}
                  </div>
                </div>
                <div style={{ marginTop: 14, fontSize: 12, fontWeight: 800, color: tool.color, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Open Tool</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}