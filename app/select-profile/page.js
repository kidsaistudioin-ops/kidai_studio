'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const C = {
  bg: '#07090f', text: '#f1f5f9', muted: '#64748b', 
  cyan: '#06b6d4', orange: '#ff6b35', purple: '#7c3aed'
};

export default function SelectProfile() {
  const router = useRouter();
  const [hovered, setHovered] = useState(null);

  const handleChildSelect = () => {
    // Bacche ka session set karo aur Parent ka hata do
    localStorage.setItem('kidai_student_id', 'student_123');
    localStorage.setItem('kidai_student_name', 'Arjun');
    localStorage.removeItem('kidai_parent_id');
    router.push('/home'); // Bacche ka dashboard
  };

  const handleParentSelect = () => {
    // Parent ka session set karo aur Bacche ka hata do
    localStorage.setItem('kidai_parent_id', 'parent_123');
    localStorage.removeItem('kidai_student_id');
    router.push('/parent/dashboard'); // Parent ka dashboard
  };

  return (
    <div style={{ 
      background: C.bg, 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      color: C.text, 
      fontFamily: "'Nunito', sans-serif" 
    }}>
      <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 40 }}>Who's playing?</h1>
      
      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
        
        {/* Child Profile */}
        <div 
          onClick={handleChildSelect}
          onMouseEnter={() => setHovered('child')}
          onMouseLeave={() => setHovered(null)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
        >
          <div style={{ 
            width: 140, height: 140, borderRadius: 24, 
            background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60,
            border: hovered === 'child' ? `4px solid #fff` : `4px solid transparent`,
            boxShadow: hovered === 'child' ? `0 10px 30px ${C.cyan}66` : 'none',
            transform: hovered === 'child' ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.2s ease-in-out'
          }}>
            👦
          </div>
          <div style={{ marginTop: 16, fontSize: 18, fontWeight: 800, color: hovered === 'child' ? '#fff' : C.muted, transition: '0.2s' }}>Arjun</div>
        </div>

        {/* Parent Profile */}
        <div 
          onClick={handleParentSelect}
          onMouseEnter={() => setHovered('parent')}
          onMouseLeave={() => setHovered(null)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
        >
          <div style={{ 
            width: 140, height: 140, borderRadius: 24, 
            background: `linear-gradient(135deg, #334155, #0f172a)`, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60,
            border: hovered === 'parent' ? `4px solid #fff` : `4px solid transparent`,
            boxShadow: hovered === 'parent' ? `0 10px 30px rgba(255,255,255,0.2)` : 'none',
            transform: hovered === 'parent' ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.2s ease-in-out'
          }}>
            👨‍👩‍👧
          </div>
          <div style={{ marginTop: 16, fontSize: 18, fontWeight: 800, color: hovered === 'parent' ? '#fff' : C.muted, transition: '0.2s' }}>Parent</div>
        </div>

      </div>
      
    </div>
  );
}