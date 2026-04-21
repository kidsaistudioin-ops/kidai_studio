'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const C = {
  bg: '#07090f', card: '#0f1520', border: '#1e2d45',
  cyan: '#06b6d4', orange: '#ff6b35', purple: '#7c3aed',
  green: '#10b981', text: '#f1f5f9', muted: '#64748b'
};

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ childName: '', email: '', password: '', referralCode: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 👑 ADMIN LOGIN CHECK
    if (formData.email === 'kidsaistudio.in@gmail.com' && formData.password === 'ak@7828289433') {
      setTimeout(() => {
        setLoading(false);
        localStorage.setItem('kidai_admin', 'true');
        router.push('/admin'); // Admin dashboard par bhej do
      }, 1000);
      return;
    }

    // Mock signup delay
    setTimeout(() => {
      setLoading(false);
      router.push('/select-profile');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    // Yahan Supabase Google OAuth call aayega
    setTimeout(() => {
      setGoogleLoading(false);
      router.push('/select-profile');
    }, 1500);
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.text, fontFamily: "'Nunito', sans-serif", padding: '40px 20px' }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 8px 0', color: '#fff' }}>Join KidAI Studio</h1>
          <p style={{ color: C.muted, margin: 0, fontSize: 14 }}>Ek Parent Account, Unlimited Bacche!</p>
          <div style={{ marginTop: 16, background: C.green+'22', border: `1px dashed ${C.green}`, padding: '10px 12px', borderRadius: 12, color: C.green, fontSize: 13, fontWeight: 800 }}>
            🎁 Signup Bonus: Free 5 Days Premium (50 XP)!
          </div>
        </div>

        {/* Google Auth Button */}
        <button 
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          style={{ width: '100%', background: '#fff', color: '#000', border: 'none', padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: (googleLoading || loading) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20, transition: '0.2s', opacity: (googleLoading || loading) ? 0.7 : 1 }}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 20, height: 20 }} />
          {googleLoading ? 'Connecting...' : 'Continue with Google'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, color: C.muted, fontSize: 12, fontWeight: 700 }}>
          <div style={{ flex: 1, height: 1, background: C.border }}></div>
          OR CONTINUE WITH EMAIL
          <div style={{ flex: 1, height: 1, background: C.border }}></div>
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: C.muted, marginBottom: 8, textTransform: 'uppercase' }}>
              <span>Child's Name</span>
              <span style={{ color: C.cyan }}>👦👧</span>
            </label>
            <input 
              type="text" 
              required
              value={formData.childName}
              onChange={(e) => setFormData({...formData, childName: e.target.value})}
              placeholder="e.g. Arjun"
              style={{ width: '100%', background: C.card2, border: `1px solid ${C.border}`, color: '#fff', padding: '14px 16px', borderRadius: 12, outline: 'none', fontSize: 15 }}
            />
          </div>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: C.muted, marginBottom: 8, textTransform: 'uppercase' }}>
              <span>Parent's Email Address</span>
              <span style={{ color: C.orange }}>👨‍👩‍👧</span>
            </label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="parent@example.com"
              style={{ width: '100%', background: C.card2, border: `1px solid ${C.border}`, color: '#fff', padding: '14px 16px', borderRadius: 12, outline: 'none', fontSize: 15 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: C.muted, marginBottom: 8, textTransform: 'uppercase' }}>Password</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              style={{ width: '100%', background: C.card2, border: `1px solid ${C.border}`, color: '#fff', padding: '14px 16px', borderRadius: 12, outline: 'none', fontSize: 15 }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: C.muted, marginBottom: 8, textTransform: 'uppercase' }}>
              <span>Referral Code (Optional)</span>
              <span style={{ color: C.green }}>🎁</span>
            </label>
            <input 
              type="text" 
              value={formData.referralCode}
              onChange={(e) => setFormData({...formData, referralCode: e.target.value.toUpperCase()})}
              placeholder="e.g. KIDAI5432"
              style={{ width: '100%', background: C.card2, border: `1px solid ${C.border}`, color: C.green, padding: '14px 16px', borderRadius: 12, outline: 'none', fontSize: 15, fontWeight: 900, letterSpacing: 1 }}
            />
            {formData.referralCode && <div style={{ fontSize: 11, color: C.green, marginTop: 6 }}>✨ Extra 5 Days Premium Applied (Total 10 Days / 100 XP)!</div>}
          </div>

          <button 
            type="submit" 
            disabled={loading || googleLoading}
            style={{ background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`, color: '#fff', border: 'none', padding: '16px', borderRadius: 12, fontSize: 16, fontWeight: 900, cursor: (loading || googleLoading) ? 'not-allowed' : 'pointer', marginTop: 8, transition: '0.2s', opacity: (loading || googleLoading) ? 0.7 : 1, boxShadow: `0 4px 15px ${C.purple}44` }}
          >
            {loading ? 'Creating Account...' : 'Sign Up ✨'}
          </button>
        </form>
      </div>
    </div>
  );
}