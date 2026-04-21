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
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(7,9,15,.97)', borderBottom: `1px solid ${C.border}`, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20 }}>←</button>
          <span>Creator <span style={{ color: C.pink }}>Studio</span> 🎨</span>
        </div>
        <button onClick={() => router.push('/studio/library')} style={{ background: `${C.orange}22`, color: C.orange, padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 800, border: 'none', cursor: 'pointer' }}>
          📁 My Library
        </button>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
        
        {/* Intro */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ fontSize: 64, marginBottom: 10, animation: "bounce 2s infinite" }}>👩‍🎨</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Apni Duniya Khud Banao!</h1>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>
            Apni drawing ko scan karke app mein lao, comics banao, aur apni library grow karo.
          </p>
        </div>

        {/* Tools Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {TOOLS.map((tool) => (
            <div 
              key={tool.id} 
              onClick={() => router.push(`/studio/${tool.id}`)}
              style={{ 
                background: `linear-gradient(135deg, ${tool.color}15, ${C.card})`, 
                border: `1px solid ${tool.color}44`, 
                borderRadius: 20, 
                padding: 20, 
                cursor: "pointer",
                display: "flex",
                gap: 16,
                alignItems: "center",
                transition: "transform 0.2s"
              }}
              onMouseOver={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ 
                width: 64, height: 64, borderRadius: 16, background: `${tool.color}22`, 
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 
              }}>
                {tool.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ fontWeight: 800, fontSize: 18, color: tool.color }}>{tool.title}</div>
                  <span style={{ background: tool.color, color: "#fff", fontSize: 10, fontWeight: 900, padding: "2px 8px", borderRadius: 8 }}>
                    {tool.tag}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
                  {tool.desc}
                </div>
              </div>
              <div style={{ fontSize: 24, color: tool.color, opacity: 0.5 }}>→</div>
            </div>
          ))}
        </div>

        {/* Video Pipeline Section */}
        <div style={{ marginTop: 30, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ fontSize: 24 }}>🎬</div>
            <div style={{ fontWeight: 900, fontSize: 20 }}>Video Pipeline <span style={{ color: C.orange }}>(Beta)</span></div>
          </div>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>
            AI-powered video generation. (API integration pending)
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {VIDEO_TOOLS.map((tool) => (
              <div 
                key={tool.id} 
                onClick={() => router.push(`/studio/${tool.id}`)}
                style={{ 
                  background: `linear-gradient(135deg, ${tool.color}15, ${C.card})`, 
                  border: `1px solid ${tool.color}44`, 
                  borderRadius: 16, 
                  padding: 16, 
                  cursor: "pointer",
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  transition: "transform 0.2s"
                }}
                onMouseOver={e => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <div style={{ 
                  width: 48, height: 48, borderRadius: 12, background: `${tool.color}22`, 
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 
                }}>
                  {tool.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: tool.color }}>{tool.title}</div>
                    <span style={{ background: tool.color, color: "#fff", fontSize: 9, fontWeight: 900, padding: "2px 6px", borderRadius: 6 }}>
                      {tool.tag}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: C.muted }}>
                    {tool.desc}
                  </div>
                </div>
                <div style={{ fontSize: 20, color: tool.color, opacity: 0.5 }}>→</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}