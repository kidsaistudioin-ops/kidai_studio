'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  yellow: '#f59e0b', pink: '#ec4899', text: '#f1f5f9', muted: '#64748b'
};

const AVATARS = ['🦁', '🤖', '🦸‍♂️', '👸', '🐯', '🐰', '🦊', '🦄', '🦖', '🐉', '🚀', '🎨'];

const CLASSES = [
  { val: 0, label: 'Nursery / KG 🎈' },
  { val: 1, label: 'Class 1 🌟' },
  { val: 2, label: 'Class 2 🚀' },
  { val: 3, label: 'Class 3 🎨' },
  { val: 4, label: 'Class 4 🧩' },
  { val: 5, label: 'Class 5 🏆' },
  { val: 6, label: 'Class 6 🔬' },
  { val: 7, label: 'Class 7 💡' },
  { val: 8, label: 'Class 8 📚' },
  { val: 9, label: 'Class 9 ⚡' },
  { val: 10, label: 'Class 10 🎓' },
  { val: 11, label: 'Class 11 🔭' },
  { val: 12, label: 'Class 12 🎯' }
];

export default function LoginScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [classLvl, setClassLvl] = useState(3);
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [loading, setLoading] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [mode, setMode] = useState('new'); // 'quick' | 'new'

  // Play audio chime
  const playSound = (freq = 440) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  };

  useEffect(() => {
    // Load existing profiles from localStorage
    try {
      const raw = localStorage.getItem('kidai_family_profiles');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedProfiles(parsed);
          setMode('quick');
        }
      }
    } catch (e) {
      console.warn('Profile read error', e);
    }
  }, []);

  const selectQuickProfile = (prof) => {
    playSound(587.33); // D5
    localStorage.setItem('kidai_student_id', prof.id);
    localStorage.setItem('kidai_student_name', prof.name);
    localStorage.setItem('kidai_student_avatar', prof.avatar);
    localStorage.setItem('kidai_student_class', (prof.classLvl || 3).toString());
  const handleInstantGuestPlay = () => {
    playSound(523.25);
    const guestNum = Math.floor(100 + Math.random() * 900);
    const guestId = 'guest_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    const guestName = `Hero #${guestNum}`;

    localStorage.setItem('kidai_student_id', guestId);
    localStorage.setItem('kidai_student_name', guestName);
    localStorage.setItem('kidai_student_avatar', randomAvatar);
    localStorage.setItem('kidai_student_class', '5');

    // Fresh isolated stats for this new guest session (No overlap with any other kid)
    localStorage.setItem(`kidai_${guestId}_xp`, '50');
    localStorage.setItem(`kidai_${guestId}_coins`, '20');
    localStorage.setItem(`kidai_${guestId}_creations`, JSON.stringify([]));

    router.push('/home');
  };

  const handleGuestLogin = async () => {
    if (!name.trim()) {
      alert("Apna pyara naam toh likho dost! 😊");
      return;
    }
    
    setLoading(true);
    playSound(523.25); // C5
    
    let studentId = 'kid_' + Math.random().toString(36).substring(2, 9);

    try {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          name: name.trim(),
          current_class: parseInt(classLvl),
          avatar: avatar,
        }])
        .select('id')
        .single();

      if (!error && data?.id) {
        studentId = data.id;
      }
    } catch (err) {
      console.warn("Supabase database connection failed. Falling back to local offline mode. 🚀", err);
    }

    // Save session
    localStorage.setItem('kidai_student_id', studentId);
    localStorage.setItem('kidai_student_name', name.trim());
    localStorage.setItem('kidai_student_avatar', avatar);
    localStorage.setItem('kidai_student_class', classLvl.toString());

    // Update family profile list
    try {
      const existing = savedProfiles.filter(p => p.name.toLowerCase() !== name.trim().toLowerCase());
      const updated = [{ id: studentId, name: name.trim(), avatar, classLvl }, ...existing].slice(0, 5);
      localStorage.setItem('kidai_family_profiles', JSON.stringify(updated));
    } catch {}
    
    // Initialize fresh empty stats if new user
    if (!localStorage.getItem(`kidai_${studentId}_xp`)) {
      localStorage.setItem(`kidai_${studentId}_xp`, '50'); // Starter 50 XP bonus!
      localStorage.setItem(`kidai_${studentId}_coins`, '20'); // Starter 20 Coins!
      localStorage.setItem(`kidai_${studentId}_creations`, JSON.stringify([]));
    }
    
    router.push('/home');
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    playSound(659.25);
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/home`
      }
    });
    if (error) alert(error.message);
  };

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: 'radial-gradient(ellipse at top, #111827 0%, #07090f 100%)',
      color: C.text,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background glow circles */}
      <div style={{ position: 'absolute', top: '-10%', left: '15%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* App Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: 28, zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 54,
            height: 54,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #ff6b35, #ec4899, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            boxShadow: '0 8px 24px rgba(255,107,53,0.35)',
            border: '2px solid rgba(255,255,255,0.2)'
          }}>
            🚀
          </div>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #ffffff 40%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              KID<span style={{ background: 'linear-gradient(135deg, #ff6b35, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span> <span style={{ fontSize: 22, fontWeight: 800, color: '#a855f7', WebkitTextFillColor: '#a855f7' }}>STUDIO</span>
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: C.muted, fontWeight: 700 }}>Next-Gen AI Learning & Game Playground</p>
          </div>
        </div>
      </div>

      {/* Main Login Card */}
      <div style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 28,
        padding: '28px 24px',
        width: '100%',
        maxWidth: 440,
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(12px)',
        zIndex: 2
      }}>

        {/* 📲 Direct Install PWA Button */}
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('trigger-pwa-install'));
            }
          }}
          style={{
            width: '100%',
            padding: '11px 16px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(236,72,153,0.15))',
            border: '1.5px solid #ff6b35',
            color: '#ffedd5',
            fontSize: 13,
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 20,
            boxShadow: '0 4px 14px rgba(255,107,53,0.2)'
          }}
        >
          <span style={{ fontSize: 18 }}>📲</span>
          <span>Apne Phone / PC me App Install Karein ⚡</span>
        </button>

        {/* ⚡ 1-Click Instant Guest Play Button */}
        <button
          type="button"
          onClick={handleInstantGuestPlay}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            border: 'none',
            color: '#000',
            fontSize: 14,
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 20,
            boxShadow: '0 4px 16px rgba(16,185,129,0.35)'
          }}
        >
          <span style={{ fontSize: 18 }}>🎮</span>
          <span>Instant Guest Play (Bina Form Bhare Direct Khelo) 🚀</span>
        </button>

        {/* 1-Tap Quick Switcher if family profiles exist */}
        {savedProfiles.length > 0 && mode === 'quick' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '1px', color: C.cyan, fontWeight: 800 }}>⚡ 1-Tap Quick Play</span>
              <h2 style={{ fontSize: 20, fontWeight: 900, margin: '6px 0 0', color: '#fff' }}>Kaun Khel Raha Hai?</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 12, marginBottom: 20 }}>
              {savedProfiles.map(prof => (
                <button
                  key={prof.id}
                  onClick={() => selectQuickProfile(prof)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: C.card2,
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 20,
                    padding: '16px 10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.cyan;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ fontSize: 36, marginBottom: 6 }}>{prof.avatar || '🦁'}</span>
                  <span style={{ fontWeight: 800, fontSize: 15, color: '#fff', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prof.name}</span>
                  <span style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>Class {prof.classLvl || '5'}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => { playSound(); setMode('new'); }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.05)',
                border: `1px dashed ${C.border}`,
                color: C.muted,
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 16
              }}
            >
              <span>➕</span> Naya Bachha / Friend Add Karein
            </button>
          </div>
        )}

        {/* New / First-Time Profile Creator */}
        {(mode === 'new' || savedProfiles.length === 0) && (
          <div>
            {savedProfiles.length > 0 && (
              <button
                onClick={() => setMode('quick')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: C.cyan,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  marginBottom: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                ← Back to Saved Profiles
              </button>
            )}

            {/* Avatar Selector */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: C.muted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>1. Avatar Chuno</span>
                <span style={{ fontSize: 12, color: C.orange, fontWeight: 800 }}>Chuna gaya: {avatar}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                {AVATARS.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => { playSound(600); setAvatar(a); }}
                    style={{
                      fontSize: 26,
                      height: 48,
                      cursor: 'pointer',
                      background: avatar === a ? 'rgba(6, 182, 212, 0.25)' : C.card2,
                      border: `2px solid ${avatar === a ? C.cyan : C.border}`,
                      borderRadius: 14,
                      transition: 'all 0.15s ease',
                      transform: avatar === a ? 'scale(1.12)' : 'scale(1)',
                      boxShadow: avatar === a ? `0 0 16px ${C.cyan}55` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: C.muted, fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                2. Tumhara Naam Kya Hai?
              </label>
              <input
                type="text"
                placeholder="e.g. Aarav, Ananya, Kabir..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleGuestLogin(); }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 14,
                  border: `1.5px solid ${name ? C.cyan : C.border}`,
                  background: C.card2,
                  color: C.text,
                  fontSize: 16,
                  outline: 'none',
                  fontWeight: 800,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Class / Grade Selector */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, color: C.muted, fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                3. Kaunsi Class Me Padhte Ho?
              </label>
              <select
                value={classLvl}
                onChange={(e) => setClassLvl(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 14,
                  border: `1.5px solid ${C.border}`,
                  background: C.card2,
                  color: C.text,
                  fontSize: 15,
                  outline: 'none',
                  fontWeight: 800,
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                {CLASSES.map(cls => (
                  <option key={cls.val} value={cls.val} style={{ background: '#0f1520', color: '#fff' }}>
                    {cls.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Enter Button */}
            <button
              onClick={handleGuestLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 16,
                background: 'linear-gradient(135deg, #ff6b35 0%, #ec4899 50%, #7c3aed 100%)',
                color: '#fff',
                fontSize: 18,
                fontWeight: 900,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 28px rgba(255,107,53,0.35)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 16
              }}
            >
              {loading ? 'Entering Studio... 🚀' : 'Shuru Karo! (Start Playing) 🚀'}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0', gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ color: C.muted, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>Parent Account</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        {/* Google Login for Parents */}
        <button
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 14,
            background: C.card2,
            color: C.text,
            fontSize: 14,
            fontWeight: 700,
            border: `1px solid ${C.border}`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            transition: 'all 0.2s'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Google Se Sign In Karein (Parent Sync)
        </button>

        {/* Free & Safe notice */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ fontSize: 11, color: C.muted, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            🔒 100% Safe for Kids • No Credit Card Required • Instant Free Play
          </span>
        </div>
      </div>
    </div>
  );
}