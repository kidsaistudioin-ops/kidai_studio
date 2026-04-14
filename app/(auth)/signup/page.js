'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  red: '#ef4444', text: '#f1f5f9', muted: '#64748b'
};

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock signup delay
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.text, fontFamily: "'Nunito', sans-serif", padding: 20 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 8px 0', color: '#fff' }}>Join KidAI Studio</h1>
          <p style={{ color: C.muted, margin: 0, fontSize: 14 }}>Seekho aur khelo ek saath!</p>
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: C.muted, marginBottom: 8, textTransform: 'uppercase' }}>Child's Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Arjun"
              style={{ width: '100%', background: C.card2, border: `1px solid ${C.border}`, color: '#fff', padding: '14px 16px', borderRadius: 12, outline: 'none', fontSize: 15 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: C.muted, marginBottom: 8, textTransform: 'uppercase' }}>Email Address</label>
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

          <button 
            type="submit" 
            disabled={loading}
            style={{ background: C.cyan, color: '#000', border: 'none', padding: '16px', borderRadius: 12, fontSize: 16, fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8, transition: '0.2s', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating Account...' : 'Sign Up ✨'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: C.muted }}>
          Already have an account? <Link href="/login" style={{ color: C.orange, textDecoration: 'none', fontWeight: 800 }}>Log In</Link>
        </div>
      </div>
    </div>
  );
}