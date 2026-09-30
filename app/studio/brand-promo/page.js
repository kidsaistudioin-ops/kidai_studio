'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { speak, stopSpeaking } from '@/lib/voice';
import { playStreakChime, playTone } from '@/lib/audio/sound-engine';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  yellow: '#f59e0b', pink: '#ec4899', text: '#f1f5f9', muted: '#64748b'
};

const PROMO_STYLES = [
  { id: 'product', name: 'Product Launch', icon: '📦', bg: 'linear-gradient(135deg, #1e1b4b, #311042)', color: C.orange },
  { id: 'social', name: 'Social Reel', icon: '📱', bg: 'linear-gradient(135deg, #831843, #4c0519)', color: C.pink },
  { id: 'corporate', name: 'Corporate Tech', icon: '🏢', bg: 'linear-gradient(135deg, #0f172a, #1e3a8a)', color: C.cyan },
  { id: 'sale', name: 'Mega Discount', icon: '🔥', bg: 'linear-gradient(135deg, #7c2d12, #991b1b)', color: C.yellow },
  { id: 'event', name: 'Grand Event', icon: '🎉', bg: 'linear-gradient(135deg, #14532d, #064e3b)', color: C.green },
  { id: 'brand', name: 'Brand Story', icon: '💫', bg: 'linear-gradient(135deg, #3b0764, #1e1b4b)', color: C.purple }
];

const TEMPLATES = [
  { id: 1, name: 'Kinetic Neon', preview: '⚡' },
  { id: 2, name: 'Minimal Glow', preview: '✨' },
  { id: 3, name: 'Dynamic 3D', preview: '🎬' },
  { id: 4, name: 'Pop Showcase', preview: '🎯' }
];

export default function BrandPromoPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Setup, 2: Animated Player
  const [brandName, setBrandName] = useState('TechKids AI');
  const [tagline, setTagline] = useState('Build The Future With AI & Creativity!');
  const [description, setDescription] = useState('The #1 Creative Learning Platform for Young Creators and Innovators.');
  const [promoStyle, setPromoStyle] = useState(PROMO_STYLES[0]);
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [generating, setGenerating] = useState(false);

  // Promo Video Player State
  const [activeSlide, setActiveSlide] = useState(0); // 0: Logo Reveal, 1: Tagline Kinetic, 2: Key Features, 3: Call to Action
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const promoTimerRef = useRef(null);
  const progressTimerRef = useRef(null);

  const promoSlides = [
    {
      type: 'logo_reveal',
      badge: '🎬 OFFICIAL REVEAL',
      mainText: brandName || 'Your Brand',
      subText: 'PROUDLY PRESENTS',
      icon: promoStyle.icon,
      duration: 4,
      voiceText: `Welcome to ${brandName}! A brand new era of creativity.`
    },
    {
      type: 'tagline_kinetic',
      badge: '✨ CORE MISSION',
      mainText: tagline || 'Empowering The Next Generation',
      subText: 'DISCOVER THE MAGIC',
      icon: '💡',
      duration: 4,
      voiceText: `${tagline}`
    },
    {
      type: 'feature_showcase',
      badge: '🚀 KEY HIGHLIGHTS',
      mainText: description || 'Create, Learn and Innovate with AI Tools.',
      subText: 'SMART • FAST • POWERFUL',
      icon: '⭐',
      duration: 4,
      voiceText: `${description}`
    },
    {
      type: 'cta_final',
      badge: '🔥 GET STARTED TODAY',
      mainText: 'Join The Experience Now!',
      subText: `VISIT ${brandName.toUpperCase()}.COM`,
      icon: '🎉',
      duration: 4,
      voiceText: `Experience ${brandName} today! Start creating now.`
    }
  ];

  const handleGenerate = () => {
    if (!brandName.trim() || !tagline.trim()) {
      alert('Please fill brand name and tagline!');
      return;
    }
    setGenerating(true);
    try { playStreakChime(); } catch(e) {}

    setTimeout(() => {
      setGenerating(false);
      setStep(2);
      setActiveSlide(0);
      setIsPlaying(true);
    }, 1500);
  };

  // Promo Playback Loop
  useEffect(() => {
    if (step !== 2 || !isPlaying) {
      stopSpeaking();
      if (promoTimerRef.current) clearTimeout(promoTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const currentSlide = promoSlides[activeSlide];
    if (!currentSlide) return;

    // Speak Narration
    speak(currentSlide.voiceText, { rate: 0.95, pitch: 1.0, lang: 'en-IN' });

    // Play Synth Transition Chime
    try {
      playTone(520 + activeSlide * 60, 'triangle', 0.2, 0.15);
    } catch(e) {}

    const durationMs = currentSlide.duration * 1000;
    let elapsed = 0;
    setProgress(0);

    progressTimerRef.current = setInterval(() => {
      elapsed += 100;
      setProgress(Math.min(100, (elapsed / durationMs) * 100));
    }, 100);

    promoTimerRef.current = setTimeout(() => {
      clearInterval(progressTimerRef.current);
      if (activeSlide < promoSlides.length - 1) {
        setActiveSlide(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, durationMs);

    return () => {
      if (promoTimerRef.current) clearTimeout(promoTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [step, isPlaying, activeSlide]);

  const currentSlideObj = promoSlides[activeSlide] || promoSlides[0];

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @keyframes scale-kinetic {
          0% { transform: scale(0.85); opacity: 0; }
          40% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes glow-promo {
          0%, 100% { box-shadow: 0 0 35px rgba(245, 158, 11, 0.4); }
          50% { box-shadow: 0 0 60px rgba(236, 72, 153, 0.6); }
        }
      `}</style>

      {/* Top Header */}
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, background: C.card }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button 
            onClick={() => {
              stopSpeaking();
              if (step === 2) setStep(1);
              else router.push('/studio');
            }} 
            style={{ background: C.card2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, padding: '6px 12px', cursor: 'pointer', fontSize: 15, fontWeight: 900 }}
          >
            ← {step === 2 ? 'Edit Promo' : 'Studio'}
          </button>
          <span style={{ fontWeight: 900, fontSize: 18 }}>Brand Promo Studio 📢</span>
        </div>
        <span style={{ background: C.yellow, color: '#000', fontSize: 11, fontWeight: 900, padding: '4px 10px', borderRadius: 8 }}>
          HD PROMO ENGINE
        </span>
      </div>

      <div style={{ padding: 20, maxWidth: 750, margin: '0 auto' }}>
        
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 50, marginBottom: 8 }}>💼✨</div>
              <h2 style={{ fontWeight: 900, fontSize: 24, margin: '0 0 6px' }}>Create Professional Promo Video</h2>
              <p style={{ color: C.muted, fontSize: 14 }}>High-impact commercial video with kinetic motion & voiceover!</p>
            </div>

            {/* Brand Details Card */}
            <div style={{ background: C.card, padding: 20, borderRadius: 20, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ fontWeight: 900, marginBottom: 12, color: C.cyan, fontSize: 13 }}>🏢 BRAND ASSETS & COPY</div>
              <input 
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Brand Name (e.g., TechKids)"
                style={{ width: '100%', padding: 12, borderRadius: 12, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontSize: 15, fontWeight: 800, marginBottom: 10, outline: 'none' }}
              />
              <input 
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Punchy Tagline (e.g., Learning made fun!)"
                style={{ width: '100%', padding: 12, borderRadius: 12, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontSize: 14, marginBottom: 10, outline: 'none' }}
              />
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description / Call to action..."
                rows={2}
                style={{ width: '100%', padding: 12, borderRadius: 12, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontSize: 14, resize: 'none', outline: 'none' }}
              />
            </div>

            {/* Promo Style */}
            <div style={{ background: C.card, padding: 18, borderRadius: 20, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ fontWeight: 900, marginBottom: 12, color: C.purple, fontSize: 13 }}>🎨 COMMERCIAL THEME</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8 }}>
                {PROMO_STYLES.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setPromoStyle(s)}
                    style={{ padding: 12, background: promoStyle.id === s.id ? s.color + '33' : C.card2, border: `2px solid ${promoStyle.id === s.id ? s.color : C.border}`, borderRadius: 12, cursor: 'pointer', textAlign: 'center', color: C.text }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 800 }}>{s.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button 
              onClick={handleGenerate}
              disabled={generating || !brandName.trim()}
              style={{ width: '100%', padding: 18, background: generating ? C.card2 : `linear-gradient(135deg, ${C.yellow}, ${C.orange})`, color: '#000', border: 'none', borderRadius: 18, fontWeight: 900, fontSize: 17, cursor: generating || !brandName.trim() ? 'not-allowed' : 'pointer', boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)' }}
            >
              {generating ? '🎬 Generating Promo Video...' : '✨ Generate Commercial Video ▶'}
            </button>
          </div>
        )}

        {/* STEP 2: ANIMATED PROMO CINEMA PLAYER */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: C.yellow, fontWeight: 900 }}>🎬 COMMERCIAL PREVIEW (HD 16:9)</div>
            </div>

            {/* Cinema Screen */}
            <div 
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 9',
                borderRadius: 24,
                overflow: 'hidden',
                background: promoStyle.bg,
                border: '4px solid #475569',
                animation: 'glow-promo 4s infinite',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 24,
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
              }}
            >
              {/* Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ background: 'rgba(0,0,0,0.6)', color: C.yellow, padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 900 }}>
                  {currentSlideObj.badge}
                </span>
                <span style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800 }}>
                  Slide {activeSlide + 1} of {promoSlides.length}
                </span>
              </div>

              {/* Central Kinetic Motion */}
              <div style={{ animation: 'scale-kinetic 0.8s ease-out' }}>
                <div style={{ fontSize: 58, marginBottom: 10, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.8))' }}>
                  {currentSlideObj.icon}
                </div>
                <div style={{ fontSize: 12, fontWeight: 900, color: C.cyan, letterSpacing: 2, marginBottom: 6 }}>
                  {currentSlideObj.subText}
                </div>
                <div style={{ fontSize: 'clamp(20px, 3.5vw, 32px)', fontWeight: 900, color: '#fff', textShadow: '0 4px 15px rgba(0,0,0,0.8)', lineHeight: 1.2 }}>
                  {currentSlideObj.mainText}
                </div>
              </div>

              {/* Subtitle Bar */}
              <div style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 800, color: '#fef08a' }}>
                🗣️ "{currentSlideObj.voiceText}"
              </div>
            </div>

            {/* Timeline Progress */}
            <div style={{ marginTop: 14, marginBottom: 16 }}>
              <div style={{ height: 6, background: C.card2, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${((activeSlide + (progress / 100)) / promoSlides.length) * 100}%`, background: C.yellow, transition: 'width 0.1s linear' }} />
              </div>
            </div>

            {/* Controls */}
            <div style={{ background: C.card, padding: 16, borderRadius: 18, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => {
                    stopSpeaking();
                    if (activeSlide > 0) setActiveSlide(prev => prev - 1);
                  }}
                  disabled={activeSlide === 0}
                  style={{ padding: '8px 16px', background: C.card2, border: `1px solid ${C.border}`, color: '#fff', borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}
                >
                  ⏮️
                </button>
                <button 
                  onClick={() => {
                    if (isPlaying) { stopSpeaking(); setIsPlaying(false); }
                    else { setIsPlaying(true); }
                  }}
                  style={{ padding: '8px 20px', background: isPlaying ? C.orange : C.green, border: 'none', color: '#000', borderRadius: 10, fontWeight: 900, cursor: 'pointer' }}
                >
                  {isPlaying ? '⏸️ PAUSE' : '▶️ PLAY'}
                </button>
                <button 
                  onClick={() => {
                    stopSpeaking();
                    if (activeSlide < promoSlides.length - 1) setActiveSlide(prev => prev + 1);
                  }}
                  disabled={activeSlide === promoSlides.length - 1}
                  style={{ padding: '8px 16px', background: C.card2, border: `1px solid ${C.border}`, color: '#fff', borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}
                >
                  ⏭️
                </button>
              </div>

              <button 
                onClick={() => setStep(1)}
                style={{ padding: '8px 18px', background: C.card2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}
              >
                ✏️ Edit Copy
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}