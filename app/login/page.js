'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  text: '#f1f5f9', muted: '#64748b'
};

const AVATARS = ['🦁', '🤖', '🦸‍♂️', '👸', '🐯', '🐰', '🦊', '🦄', '🦖', '🐉'];

export default function LoginScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [classLvl, setClassLvl] = useState(5);
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const savedId = localStorage.getItem('kidai_student_id');
    if (savedId) {
      router.push('/home');
    }
  }, [router]);

  const handleGuestLogin = async () => {
    if (!name.trim()) return alert("Apna naam toh likho dost! 😊");
    
    setLoading(true);
    
    let studentId = 'guest_' + Math.random().toString(36).substring(2, 9);

    try {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          name: name.trim(),
          current_class: parseInt(classLvl),
          avatar: avatar,
          // email will be null for guest users
        }])
        .select('id')
        .single();

      if (error) throw error;

      studentId = data.id;
    } catch (err) {
      console.warn("Supabase database connection failed. Falling back to local offline mode. 🚀", err);
    }

    // Save session locally (uses DB ID if success, or random guest ID if failed)
    localStorage.setItem('kidai_student_id', studentId);
    localStorage.setItem('kidai_student_name', name.trim());
    localStorage.setItem('kidai_student_avatar', avatar);
    
    // Redirect to Home Dashboard (Two Doors)
    router.push('/home');
    
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/home`
      }
    });
    if (error) alert(error.message);
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: C.bg, color: C.text, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 48, animation: 'bounce 2s infinite' }}>🚀</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: '10px 0 5px', color: C.text }}>
          KID<span style={{ color: C.orange }}>AI</span> Studio
        </h1>
        <p style={{ color: C.muted, fontSize: 14 }}>Seekho, Khelo, aur Jeeto!</p>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 30, width: '100%', maxWidth: 400, boxShadow: `0 10px 40px rgba(0,0,0,0.5)` }}>
        
        {/* Avatar Selection */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase' }}>Apna Avatar Chuno</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {AVATARS.map(a => (
              <div 
                key={a} 
                onClick={() => setAvatar(a)}
                style={{ fontSize: 32, cursor: 'pointer', padding: 10, background: avatar === a ? C.cyan+'33' : C.card2, border: `2px solid ${avatar === a ? C.cyan : C.border}`, borderRadius: 16, transition: 'all 0.2s', transform: avatar === a ? 'scale(1.1)' : 'scale(1)' }}
              >
                {a}
              </div>
            ))}
          </div>
        </div>

        {/* Name Input */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>Tumhara Naam?</div>
          <input 
            suppressHydrationWarning
            type="text" 
            placeholder="e.g. Arjun"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontSize: 16, outline: 'none', fontWeight: 700 }}
          />
        </div>

        {/* Class Input */}
        <div style={{ marginBottom: 30 }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>Kaunsi Class me ho?</div>
          <select 
            suppressHydrationWarning
            value={classLvl}
            onChange={(e) => setClassLvl(e.target.value)}
            style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontSize: 16, outline: 'none', fontWeight: 700, appearance: 'none' }}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i+1} value={i+1}>Class {i+1}</option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <button 
          suppressHydrationWarning
          onClick={handleGuestLogin} disabled={loading}
          style={{ width: '100%', padding: 16, borderRadius: 16, background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`, color: '#fff', fontSize: 18, fontWeight: 900, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: `0 6px 20px ${C.purple}44`, marginBottom: 16 }}
        >
          {loading ? 'Entering...' : 'Play as Guest 🎮'}
        </button>

        <div style={{ textAlign: 'center', color: C.muted, fontSize: 12, margin: '10px 0' }}>OR</div>

        <button suppressHydrationWarning onClick={handleGoogleLogin} style={{ width: '100%', padding: 14, borderRadius: 14, background: C.card2, color: C.text, fontSize: 15, fontWeight: 700, border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>G</span> Continue with Google
        </button>
      </div>
    </div>
  );
}