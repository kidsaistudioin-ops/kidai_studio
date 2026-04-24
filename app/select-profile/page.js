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
  const [step, setStep] = useState('profile'); // 'profile' ya 'age'
  const [selectedType, setSelectedType] = useState(null); // 'child' ya 'guest'

  const handleChildSelect = () => {
    setSelectedType('child');
    setStep('age');
  };

  const completeChildLogin = (age) => {
    // Bacche ka session set karo aur Parent ka hata do
    localStorage.setItem('kidai_student_id', 'student_123');
    localStorage.setItem('kidai_student_name', 'Arjun');
    localStorage.setItem('kidai_child_age', age.toString());
    localStorage.removeItem('kidai_parent_id');
    localStorage.removeItem('kidai_is_guest');

    // Referral Logic Check for Registered Users (First time only)
    if (!localStorage.getItem('kidai_free_plays')) {
      const hasReferral = window.confirm("🎁 Kya aapke paas kisi dost ka Invite Link/Code hai? (OK dabayein agar hai, Cancel agar nahi)");
      if (hasReferral) {
        localStorage.setItem('kidai_free_plays', '10');
        alert("Badhai ho! 🎉 Aapko 10 Free Games mile hain! Aapke dost ko bhi 5 games mil jayenge.");
      } else {
        localStorage.setItem('kidai_free_plays', '5');
      }
    }

    router.push('/home'); // Bacche ka dashboard
  };

  const handleParentSelect = () => {
    // Parent ka session set karo aur Bacche ka hata do
    localStorage.setItem('kidai_parent_id', 'parent_123');
    localStorage.removeItem('kidai_student_id');
    localStorage.removeItem('kidai_is_guest');
    router.push('/parent/dashboard'); // Parent ka dashboard
  };

  const handleGuestSelect = () => {
    setSelectedType('guest');
    setStep('age');
  };

  const completeGuestLogin = (age) => {
    // Guest ka session set karo (Free Promotional Mode)
    localStorage.setItem('kidai_is_guest', 'true');
    localStorage.setItem('kidai_student_name', 'Guest Player');
    localStorage.setItem('kidai_child_age', age.toString());
    localStorage.removeItem('kidai_student_id');
    localStorage.removeItem('kidai_parent_id');

    // Referral Logic Check (First time only)
    if (!localStorage.getItem('kidai_free_plays')) {
      const hasReferral = window.confirm("🎁 Kya aapke paas kisi dost ka Invite Link/Code hai? (OK dabayein agar hai, Cancel agar nahi)");
      if (hasReferral) {
        localStorage.setItem('kidai_free_plays', '10'); // 5 Base + 5 Referral Bonus
        alert("Badhai ho! 🎉 Aapko 10 Free Games mile hain! Aapke dost ko bhi 5 games mil jayenge.");
      } else {
        localStorage.setItem('kidai_free_plays', '5'); // Base 5 Games
      }
    }

    router.push('/home'); // Yahan games access honge limited features ke sath
  };

  const handleLogout = () => {
    // Puraana session aur data clear karna taaki naye Gmail se login ho sake
    localStorage.removeItem('kidai_student_id');
    localStorage.removeItem('kidai_parent_id');
    localStorage.removeItem('kidai_is_guest');
    localStorage.removeItem('kidai_free_plays');
    localStorage.removeItem('kidai_student_name');
    localStorage.removeItem('kidai_child_age');
    router.push('/'); // Login/Landing page par wapas bhej do
  };

  const handleAgeSelect = (age) => {
    if (selectedType === 'child') completeChildLogin(age);
    else if (selectedType === 'guest') completeGuestLogin(age);
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
      {step === 'profile' ? (
        <>
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

            {/* Guest Profile (Promotional) */}
            <div 
              onClick={handleGuestSelect}
              onMouseEnter={() => setHovered('guest')}
              onMouseLeave={() => setHovered(null)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              <div style={{ 
                width: 140, height: 140, borderRadius: 24, 
                background: `linear-gradient(135deg, ${C.orange}, #fbbf24)`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60,
                border: hovered === 'guest' ? `4px solid #fff` : `4px solid transparent`,
                boxShadow: hovered === 'guest' ? `0 10px 30px ${C.orange}66` : 'none',
                transform: hovered === 'guest' ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease-in-out',
                position: 'relative'
              }}>
                🎮
                <div style={{ position: 'absolute', top: -10, right: -10, background: '#ef4444', color: '#fff', fontSize: 12, fontWeight: 900, padding: '4px 8px', borderRadius: 12, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>FREE</div>
              </div>
              <div style={{ marginTop: 16, fontSize: 18, fontWeight: 800, color: hovered === 'guest' ? '#fff' : C.muted, transition: '0.2s' }}>Guest Play</div>
            </div>

          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', animation: 'slideUp 0.3s ease' }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 10 }}>What's your Age?</h1>
          <p style={{ color: C.muted, marginBottom: 30 }}>AI aapke hisaab se games banayega! 🎯</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 300, margin: '0 auto' }}>
            <button onClick={() => handleAgeSelect(7)} style={{ padding: '16px', borderRadius: 16, border: `2px solid ${C.cyan}`, background: 'transparent', color: '#fff', fontSize: 18, fontWeight: 800, cursor: 'pointer' }}>🧒 6 - 8 Years</button>
            <button onClick={() => handleAgeSelect(10)} style={{ padding: '16px', borderRadius: 16, border: `2px solid ${C.purple}`, background: 'transparent', color: '#fff', fontSize: 18, fontWeight: 800, cursor: 'pointer' }}>👦 9 - 12 Years</button>
            <button onClick={() => handleAgeSelect(14)} style={{ padding: '16px', borderRadius: 16, border: `2px solid ${C.orange}`, background: 'transparent', color: '#fff', fontSize: 18, fontWeight: 800, cursor: 'pointer' }}>🧑 13+ Years</button>
          </div>
          <button onClick={() => setStep('profile')} style={{ marginTop: 30, background: 'none', border: 'none', color: C.muted, textDecoration: 'underline', cursor: 'pointer' }}>← Back</button>
        </div>
      )}
      
      {/* Logout / Switch Account Button */}
      <div style={{ marginTop: 60 }}>
        <button onClick={handleLogout} style={{ background: 'transparent', border: `2px solid ${C.border}`, color: C.muted, padding: '10px 24px', borderRadius: 12, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🚪</span> Logout / Switch Account
        </button>
      </div>

    </div>
  );
}