'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LandingChatbot from '@/components/ui/LandingChatbot';
import MainHeader from '@/components/ui/MainHeader';
import MainFooter from '@/components/ui/MainFooter';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  yellow: '#f59e0b', pink: '#ec4899', text: '#f1f5f9', muted: '#64748b',
  red: '#ef4444'
};

const GUEST_QUIZ = [
  { id: 'math', name: 'Table Battle', emoji: '⚔️', color: C.cyan, subject: 'Math', question: '7 × 8 = ?', opts: ['54', '56', '63', '48'], correct: 1 },
  { id: 'science', name: 'Space Quiz', emoji: '🚀', color: C.purple, subject: 'Science', question: 'Hamare solar system mein kitne planets hain?', opts: ['7', '8', '9', '10'], correct: 1 },
  { id: 'english', name: 'Word Hunt', emoji: '🔤', color: C.green, subject: 'English', question: "'Enormous' ka matlab kya hai?", opts: ['Chota', 'Bahut bada', 'Tez', 'Thaka'], correct: 1 }
];

const quickLinkStyle = {
  textDecoration: 'none',
  background: 'rgba(15, 21, 32, 0.95)',
  color: '#f1f5f9',
  border: '1px solid #1e2d45',
  borderRadius: 999,
  padding: '8px 12px',
  fontWeight: 800,
  fontSize: 13,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
};

// Reusable Button Style
const btnStyle = (color, full = false, ghost = false) => ({
  padding: '12px 20px', borderRadius: 13, border: ghost ? `1.5px solid ${color}` : 'none',
  background: ghost ? 'transparent' : `linear-gradient(135deg, ${color}, ${color}cc)`,
  color: ghost ? color : '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer',
  width: full ? '100%' : 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  gap: 6, boxShadow: ghost ? 'none' : `0 4px 14px ${color}44`, fontFamily: 'inherit'
});

function GuestGame({ game, onDone }) {
  const [picked, setPicked] = useState(null);
  const done = picked !== null;
  return (
    <div style={{ background: C.card, border: `1px solid ${game.color}44`, borderRadius: 18, padding: 16 }}>
      <div style={{ fontWeight: 800, fontSize: 15, color: game.color, marginBottom: 12 }}>{game.emoji} {game.name}</div>
      <div style={{ background: C.card2, borderRadius: 14, padding: 14, fontSize: 14, fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>{game.question}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {game.opts.map((opt, i) => {
          const isC = i === game.correct, isP = i === picked;
          return (
            <button key={i} onClick={() => { if (!done) setPicked(i); }} style={{ padding: '11px 14px', borderRadius: 12, fontFamily: 'inherit', border: `2px solid ${done ? isC ? C.green : isP ? C.red : C.border : C.border}`, background: done ? isC ? C.green + '22' : isP ? C.red + '22' : C.card2 : C.card2, color: C.text, fontSize: 14, fontWeight: 700, cursor: done ? 'default' : 'pointer', textAlign: 'left' }}>
              {done && isC ? '✅ ' : done && isP ? '❌ ' : `${['A', 'B', 'C', 'D'][i]}. `}{opt}
            </button>
          );
        })}
      </div>
      {done && <button style={btnStyle(game.color, true)} onClick={onDone}>Agle Game →</button>}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [activeGame, setActiveGame] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const MAX_FREE = 3;

  useEffect(() => {
    if (localStorage.getItem('kidai_student_id') || localStorage.getItem('kidai_admin')) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('kidai_student_id');
    localStorage.removeItem('kidai_student_name');
    localStorage.removeItem('kidai_student_avatar');
    localStorage.removeItem('kidai_is_guest');
    localStorage.removeItem('kidai_admin');
    setIsLoggedIn(false);
    showToast('👋 Successfully Logged Out!');
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2000);
  };

  const startGame = (game) => {
    if (gamesPlayed >= MAX_FREE) return;
    setActiveGame(game);
  };

  const gameDone = () => {
    const next = gamesPlayed + 1;
    setGamesPlayed(next);
    setActiveGame(null);
    if (next < MAX_FREE) showToast('✅ +10 XP!');
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", scrollBehavior: 'smooth' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .nav-link { color: ${C.muted}; text-decoration: none; font-weight: 700; font-size: 13px; transition: color 0.2s; }
        .nav-link:hover { color: ${C.cyan}; }
        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.8); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>

      {/* Simple Toast */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: 64, left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg, ${C.orange}, ${C.purple})`, color: '#fff', padding: '8px 20px', borderRadius: 99, fontWeight: 800, fontSize: 13, zIndex: 200, boxShadow: `0 4px 20px ${C.orange}88` }}>
          {toastMsg}
        </div>
      )}

      {/* Naya Clean Header */}
      <MainHeader />

      <div style={{ padding: '0 24px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <style>{`
          .landing-desktop-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
          }
          @media (min-width: 900px) {
            .landing-desktop-grid {
              grid-template-columns: 1.1fr 1fr;
              gap: 36px;
              align-items: start;
            }
          }
        `}</style>

        {/* Hero Section */}
        <div style={{ textAlign: 'center', padding: '36px 0 28px' }}>
          <div style={{ fontSize: 64, marginBottom: 12, display: 'inline-block', animation: 'bounce 3s ease infinite' }}>🤖</div>
          <h1 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 12 }}>
            Bacchon Ka <span style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.yellow}, ${C.pink})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200%', animation: 'shimmer 3s linear infinite' }}>AI School & Game Arena</span> 🚀
          </h1>
          <p style={{ color: C.muted, fontSize: 16, maxWidth: 540, margin: '0 auto 24px', lineHeight: 1.6 }}>6-18 saal ke bacho ke liye — School homework scan karo, 3D Games khelo, aur AI seekho!</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {isLoggedIn ? (
              <>
                <button style={btnStyle(C.green)} onClick={() => router.push('/home')}>🏠 Dashboard Kholo</button>
                <button style={btnStyle(C.red, false, true)} onClick={handleLogout}>🚪 Logout</button>
              </>
            ) : (
              <>
                <button style={btnStyle(C.orange)} onClick={() => router.push('/play')}>🎮 Free Games Khelo</button>
                <button style={btnStyle(C.cyan, false, true)} onClick={() => router.push('/signup')}>✅ Free Account Banao</button>
              </>
            )}
          </div>
        </div>

        {/* ── RESPONSIVE DUAL-COLUMN DESKTOP GRID ── */}
        <div className="landing-desktop-grid">
          
          {/* LEFT COLUMN: QUICK ACCESS CARDS & HOW IT WORKS */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
              {[
                { icon: '🤖', title: 'Arya AI Tutor', desc: 'AI Chat se doubt pucho', color: C.cyan, path: '/chat' },
                { icon: '📸', title: 'Smart Scanner', desc: 'Homework scan karo', color: C.purple, path: '/scanner' },
                { icon: '🎲', title: '3D Multiplayer', desc: 'Ludo, Chess, Snakes', color: C.green, path: '/play' },
                { icon: '📖', title: 'Seekho Lessons', desc: 'Alphabet, Tables, Words', color: C.orange, path: '/seekho' },
                { icon: '💰', title: 'Earn Mode', desc: 'Coins & Pocket money', color: C.yellow, path: '/earn' },
                { icon: '⭐', title: 'Parent Reviews', desc: 'Parents feedback', color: C.pink, path: '/reviews' },
              ].map(f => (
                <div 
                  key={f.title} 
                  onClick={() => router.push(f.path)} 
                  style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 14px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 4px 14px rgba(0,0,0,0.2)` }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{f.icon}</div>
                  <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 4, color: f.color }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.3 }}>{f.desc}</div>
                </div>
              ))}
            </div>

            {/* HOW IT WORKS Section */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: '24px 20px', marginBottom: 24 }}>
              <h2 style={{ textAlign: 'center', fontWeight: 900, fontSize: 20, marginBottom: 20 }}>🎮 Aise Kaam Karta Hai! 🕹️</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.card2, padding: 14, borderRadius: 14, borderLeft: `4px solid ${C.green}` }}>
                  <div style={{ fontSize: 30 }}>📚</div>
                  <div>
                    <div style={{ fontWeight: 800, color: C.green, fontSize: 15 }}>1. Padhai Karo (Seekho)</div>
                    <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Maths, English ke games khelo aur har sahi jawab par <b>+1 Coin</b> kamao.</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.card2, padding: 14, borderRadius: 14, borderLeft: `4px solid ${C.yellow}` }}>
                  <div style={{ fontSize: 30 }}>🪙</div>
                  <div>
                    <div style={{ fontWeight: 800, color: C.yellow, fontSize: 15 }}>2. Coins Jama Karo</div>
                    <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Galat jawab par <b>-1 Coin</b> katega. Apne coins dashboard me dekho.</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.card2, padding: 14, borderRadius: 14, borderLeft: `4px solid ${C.purple}` }}>
                  <div style={{ fontSize: 30 }}>🎲</div>
                  <div>
                    <div style={{ fontWeight: 800, color: C.purple, fontSize: 15 }}>3. Games Khelo (Play)</div>
                    <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Ludo, Chess, Snakes & Ladders khelne ke liye <b>-10 Coins</b> use karo.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 50+ GAMES HUB & AGE SECTIONS */}
          <div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { n: '6-18', l: 'Saal', c: C.orange, path: '/play' },
                { n: '50+', l: 'Games & Skills', c: C.cyan, path: '/play' },
                { n: '3D', l: 'Arcade Arena', c: C.green, path: '/play' }
              ].map((item) => (
                <div key={item.l} onClick={() => router.push(item.path)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = item.c}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = C.border}
                >
                  <div style={{ fontSize: 26, fontWeight: 900, color: item.c, fontFamily: "'Baloo 2', cursive" }}>{item.n}</div>
                  <div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>{item.l}</div>
                </div>
              ))}
            </div>

            {/* Free Games Card */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 20, marginBottom: 20, boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 17, color: '#fff' }}>🎮 Free Games — Abhi Khelo!</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Direct click karke game shuru karein</div>
                </div>
                <button onClick={() => router.push('/play')} style={{ background: C.purple+'22', color: C.purple, border: `1px solid ${C.purple}55`, padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>View All 50+ ▶</button>
              </div>

              {activeGame ? <GuestGame game={activeGame} onDone={gameDone} /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {GUEST_QUIZ.map((game) => (
                    <div key={game.id} onClick={() => startGame(game)} style={{ display: 'flex', alignItems: 'center', gap: 14, background: `linear-gradient(135deg, ${game.color}15, ${C.card})`, border: `1px solid ${game.color}33`, borderRadius: 14, padding: 14, cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: game.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{game.emoji}</div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15 }}>{game.name}</div>
                        <div style={{ fontSize: 12, color: C.muted }}>{game.subject}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', fontSize: 18, color: game.color }}>▶</div>
                    </div>
                  ))}
                  
                  {/* DIRECT ACCESS TO 50+ GAMES ARCADE */}
                  <button style={{ ...btnStyle(C.purple, true), marginTop: 8 }} onClick={() => router.push('/play')}>
                    🌟 Open 50+ Games Arcade (Ludo, Chess, Snakes & More)
                  </button>
                </div>
              )}
            </div>

            {/* Clickable Age Category Cards */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 20, marginBottom: 20 }}>
              <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 14 }}>👦👧 Umar Ke Hisab Se (Click to Open)</div>
              {[
                { age: '6-10', icon: '🌱', color: C.green, title: 'Games + Seekho Fun', desc: 'Alphabet, Tables, 3D Ludo, Snakes & Ladders', path: '/seekho' },
                { age: '10-14', icon: '🔧', color: C.cyan, title: 'Creator Studio & Coding', desc: 'Game builder, Comic maker, Smart scanner', path: '/studio' },
                { age: '14-18', icon: '🚀', color: C.orange, title: 'Earn Mode & Skills', desc: 'Real projects, Challenges, Rewards', path: '/earn' }
              ].map((item) => (
                <div 
                  key={item.age} 
                  onClick={() => router.push(item.path)}
                  style={{ background: C.card2, borderRadius: 14, padding: 14, marginBottom: 10, borderLeft: `4px solid ${item.color}`, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = C.card2; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: item.color }}>{item.icon} {item.age} Saal — {item.title}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{item.desc}</div>
                  </div>
                  <div style={{ color: item.color, fontWeight: 900, fontSize: 16 }}>▶</div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {isLoggedIn ? (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button style={{ ...btnStyle(C.red, false, true), maxWidth: 300, margin: '0 auto' }} onClick={handleLogout}>🚪 Logout Karo</button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button style={{ ...btnStyle(C.orange, true), maxWidth: 360, margin: '0 auto' }} onClick={() => router.push('/signup')}>🚀 Abhi Shuru Karo — Free!</button>
          </div>
        )}

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 24, marginTop: 24 }}>
          <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 16 }}>🔗 Explore All 50+ Modules & Tools</div>

          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 800, color: C.cyan, marginBottom: 8 }}>Learning & Creation</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Link href="/learn" style={quickLinkStyle}>Learn</Link>
                <Link href="/create" style={quickLinkStyle}>Create</Link>
                <Link href="/code-magic" style={quickLinkStyle}>Code Magic</Link>
                <Link href="/story" style={quickLinkStyle}>Story</Link>
                <Link href="/games" style={quickLinkStyle}>Games</Link>
                <Link href="/profile" style={quickLinkStyle}>Profile</Link>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 800, color: C.orange, marginBottom: 8 }}>Play Modes</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Link href="/play" style={quickLinkStyle}>Play</Link>
                <Link href="/play/chess" style={quickLinkStyle}>Chess</Link>
                <Link href="/play/ludo-game" style={quickLinkStyle}>Ludo</Link>
                <Link href="/play/car-race-game" style={quickLinkStyle}>Car Race</Link>
                <Link href="/play/snakes-ladders" style={quickLinkStyle}>Snakes</Link>
                <Link href="/play/math-racing" style={quickLinkStyle}>Math Racing</Link>
                <Link href="/play/memory-match" style={quickLinkStyle}>Memory Match</Link>
                <Link href="/play/tic-tac-toe" style={quickLinkStyle}>Tic Tac Toe</Link>
                <Link href="/play/typing-ninja" style={quickLinkStyle}>Typing Ninja</Link>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 800, color: C.purple, marginBottom: 8 }}>Studio Tools</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Link href="/studio" style={quickLinkStyle}>Studio</Link>
                <Link href="/studio/2d-animation" style={quickLinkStyle}>2D Animation</Link>
                <Link href="/studio/brand-promo" style={quickLinkStyle}>Brand Promo</Link>
                <Link href="/studio/coloring-book" style={quickLinkStyle}>Coloring Book</Link>
                <Link href="/studio/comic-maker" style={quickLinkStyle}>Comic Maker</Link>
                <Link href="/studio/logo-maker" style={quickLinkStyle}>Logo Maker</Link>
                <Link href="/studio/magic-scanner" style={quickLinkStyle}>Magic Scanner</Link>
                <Link href="/studio/story-video" style={quickLinkStyle}>Story Video</Link>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 800, color: C.green, marginBottom: 8 }}>Support & Reports</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Link href="/help" style={quickLinkStyle}>Help</Link>
                <Link href="/reviews" style={quickLinkStyle}>Reviews</Link>
                <Link href="/faq" style={quickLinkStyle}>FAQ</Link>
                <Link href="/reports" style={quickLinkStyle}>Reports</Link>
                <Link href="/about" style={quickLinkStyle}>About</Link>
                <Link href="/pricing" style={quickLinkStyle}>Pricing</Link>
                <Link href="/contact" style={quickLinkStyle}>Contact</Link>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 800, color: C.muted, marginBottom: 8 }}>Admin Tools</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Link href="/admin" style={quickLinkStyle}>Admin</Link>
                <Link href="/admin/blog" style={quickLinkStyle}>Admin Blog</Link>
                <Link href="/admin/scanner" style={quickLinkStyle}>Admin Scanner</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Naya API Connected Chatbot */}
      <LandingChatbot />

      {/* Naya Clean Footer Jisme Saare Links Hain */}
      <MainFooter />
    </div>
  );
}
    