'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CBSE_CURRICULUM } from '@/lib/curriculum/cbse-curriculum';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  cyan: '#06b6d4', orange: '#ff6b35', purple: '#7c3aed', green: '#10b981',
  text: '#f1f5f9', muted: '#64748b'
};

const CLASSES = [
  { classNum: 1, label: 'Class 1st', age: '5-6 Saal', emoji: '🌱' },
  { classNum: 2, label: 'Class 2nd', age: '6-7 Saal', emoji: '🌿' },
  { classNum: 3, label: 'Class 3rd', age: '7-8 Saal', emoji: '🎒' },
  { classNum: 4, label: 'Class 4th', age: '8-9 Saal', emoji: '📚' },
  { classNum: 5, label: 'Class 5th', age: '9-10 Saal', emoji: '✏️' },
  { classNum: 6, label: 'Class 6th', age: '10-11 Saal', emoji: '🔬' },
  { classNum: 7, label: 'Class 7th', age: '11-12 Saal', emoji: '📐' },
  { classNum: 8, label: 'Class 8th', age: '12-13 Saal', emoji: '🚀' },
  { classNum: 9, label: 'Class 9th', age: '13-14 Saal', emoji: '⚛️' },
  { classNum: 10, label: 'Class 10th (Board)', age: '14-15 Saal', emoji: '🏆' },
];

const BOARDS = [
  { id: 'CBSE', name: 'CBSE (NCERT Govt. Standards)', badge: '⭐ Recommended' },
  { id: 'ICSE', name: 'ICSE Board', badge: 'Standard' },
  { id: 'State', name: 'State Board (State Govt)', badge: 'Regional' },
];

export default function SelectProfile() {
  const router = useRouter();
  const [hovered, setHovered] = useState(null);
  const [step, setStep] = useState('profile'); // 'profile' -> 'class' -> 'board'
  const [selectedType, setSelectedType] = useState(null); // 'child' | 'guest'
  
  const [selectedClass, setSelectedClass] = useState(5);
  const [selectedBoard, setSelectedBoard] = useState('CBSE');
  const [selectedMedium, setSelectedMedium] = useState('English');

  const handleChildSelect = () => {
    setSelectedType('child');
    setStep('class');
  };

  const handleGuestSelect = () => {
    setSelectedType('guest');
    setStep('class');
  };

  const handleParentSelect = () => {
    localStorage.setItem('kidai_parent_id', 'parent_123');
    localStorage.removeItem('kidai_student_id');
    localStorage.removeItem('kidai_is_guest');
    router.push('/dashboard');
  };

  const completeLogin = (board, medium) => {
    const isGuest = selectedType === 'guest';
    const ageMap = { 1: 6, 2: 7, 3: 8, 4: 9, 5: 10, 6: 11, 7: 12, 8: 13, 9: 14, 10: 15 };
    const calculatedAge = ageMap[selectedClass] || 10;

    localStorage.setItem('kidai_student_id', isGuest ? 'guest_123' : 'student_123');
    localStorage.setItem('kidai_student_name', isGuest ? 'Guest Player' : 'Arjun');
    localStorage.setItem('kidai_child_age', calculatedAge.toString());
    localStorage.setItem('kidai_student_class', selectedClass.toString());
    localStorage.setItem('kidai_student_board', board);
    localStorage.setItem('kidai_student_medium', medium);

    if (isGuest) {
      localStorage.setItem('kidai_is_guest', 'true');
    } else {
      localStorage.removeItem('kidai_is_guest');
    }
    localStorage.removeItem('kidai_parent_id');

    if (!localStorage.getItem('kidai_free_plays')) {
      localStorage.setItem('kidai_free_plays', '10');
    }

    router.push('/home');
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <div style={{ 
      background: C.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', color: C.text, fontFamily: "'Nunito', sans-serif",
      padding: '24px 16px'
    }}>
      
      {/* ── STEP 1: WHO IS PLAYING ── */}
      {step === 'profile' && (
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 10 }}>Who's playing?</h1>
          <p style={{ color: C.muted, marginBottom: 40 }}>Apna profile chunein aur padhai shuru karein!</p>
          
          <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', justifyContent: 'center' }}>
            
            {/* Child Profile */}
            <div 
              onClick={handleChildSelect}
              onMouseEnter={() => setHovered('child')}
              onMouseLeave={() => setHovered(null)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              <div style={{ 
                width: 130, height: 130, borderRadius: 24, 
                background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56,
                border: hovered === 'child' ? `4px solid #fff` : `4px solid transparent`,
                boxShadow: hovered === 'child' ? `0 10px 30px ${C.cyan}66` : 'none',
                transform: hovered === 'child' ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease-in-out'
              }}>
                👦
              </div>
              <div style={{ marginTop: 14, fontSize: 17, fontWeight: 800, color: hovered === 'child' ? '#fff' : C.muted }}>Arjun (Student)</div>
            </div>

            {/* Parent Profile */}
            <div 
              onClick={handleParentSelect}
              onMouseEnter={() => setHovered('parent')}
              onMouseLeave={() => setHovered(null)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              <div style={{ 
                width: 130, height: 130, borderRadius: 24, 
                background: `linear-gradient(135deg, #334155, #0f172a)`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56,
                border: hovered === 'parent' ? `4px solid #fff` : `4px solid transparent`,
                boxShadow: hovered === 'parent' ? `0 10px 30px rgba(255,255,255,0.2)` : 'none',
                transform: hovered === 'parent' ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease-in-out'
              }}>
                👨‍👩‍👧
              </div>
              <div style={{ marginTop: 14, fontSize: 17, fontWeight: 800, color: hovered === 'parent' ? '#fff' : C.muted }}>Parent & Teacher</div>
            </div>

            {/* Guest Profile */}
            <div 
              onClick={handleGuestSelect}
              onMouseEnter={() => setHovered('guest')}
              onMouseLeave={() => setHovered(null)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              <div style={{ 
                width: 130, height: 130, borderRadius: 24, 
                background: `linear-gradient(135deg, ${C.orange}, #fbbf24)`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56,
                border: hovered === 'guest' ? `4px solid #fff` : `4px solid transparent`,
                boxShadow: hovered === 'guest' ? `0 10px 30px ${C.orange}66` : 'none',
                transform: hovered === 'guest' ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease-in-out',
                position: 'relative'
              }}>
                🎮
                <div style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 900, padding: '3px 8px', borderRadius: 10 }}>FREE</div>
              </div>
              <div style={{ marginTop: 14, fontSize: 17, fontWeight: 800, color: hovered === 'guest' ? '#fff' : C.muted }}>Guest Play</div>
            </div>

          </div>
        </div>
      )}

      {/* ── STEP 2: CLASS & AGE SELECTION (OFFICIAL INDIAN STANDARDS) ── */}
      {step === 'class' && (
        <div style={{ textAlign: 'center', maxWidth: 650, width: '100%', animation: 'slideUp 0.3s ease' }}>
          <span style={{ background: C.cyan + '22', color: C.cyan, padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 800 }}>
            🇮🇳 Government / CBSE Curriculum Aligned
          </span>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginTop: 10, marginBottom: 6 }}>Aap Kaunsi Class Mein Hain?</h1>
          <p style={{ color: C.muted, marginBottom: 24, fontSize: 14 }}>
            AI aapki class ke official NCERT/CBSE course ke hisaab se games aur practice banayega! 🎯
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12, marginBottom: 24 }}>
            {CLASSES.map(cls => (
              <button
                key={cls.classNum}
                onClick={() => {
                  setSelectedClass(cls.classNum);
                  setStep('board');
                }}
                style={{
                  background: selectedClass === cls.classNum ? `linear-gradient(135deg, ${C.cyan}33, ${C.purple}33)` : C.card2,
                  border: `2px solid ${selectedClass === cls.classNum ? C.cyan : C.border}`,
                  padding: '14px 10px', borderRadius: 16, cursor: 'pointer', color: '#fff',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: 28 }}>{cls.emoji}</span>
                <span style={{ fontWeight: 900, fontSize: 15 }}>{cls.label}</span>
                <span style={{ fontSize: 11, color: C.muted }}>{cls.age}</span>
              </button>
            ))}
          </div>

          <button onClick={() => setStep('profile')} style={{ background: 'none', border: 'none', color: C.muted, textDecoration: 'underline', cursor: 'pointer' }}>← Back</button>
        </div>
      )}

      {/* ── STEP 3: BOARD & MEDIUM SELECTION ── */}
      {step === 'board' && (
        <div style={{ textAlign: 'center', maxWidth: 480, width: '100%', animation: 'slideUp 0.3s ease' }}>
          <span style={{ background: C.purple + '22', color: C.purple, padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 800 }}>
            Class {selectedClass}th Selected
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginTop: 10, marginBottom: 6 }}>Board & Language</h1>
          <p style={{ color: C.muted, marginBottom: 24, fontSize: 13 }}>Sahi board aur bhasha chunein taaki exact standard questions milein.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20, textAlign: 'left' }}>
            <label style={{ fontSize: 12, fontWeight: 800, color: C.muted }}>SCHOOL BOARD:</label>
            {BOARDS.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBoard(b.id)}
                style={{
                  padding: '14px 16px', borderRadius: 14,
                  border: `2px solid ${selectedBoard === b.id ? C.green : C.border}`,
                  background: selectedBoard === b.id ? C.green + '18' : C.card2,
                  color: C.text, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: 'pointer', fontWeight: 800, fontSize: 14
                }}
              >
                <span>{b.name}</span>
                <span style={{ fontSize: 11, color: selectedBoard === b.id ? C.green : C.muted }}>{b.badge}</span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, textAlign: 'left' }}>
            <label style={{ fontSize: 12, fontWeight: 800, color: C.muted }}>MEDIUM OF STUDY:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {['English', 'Hindi', 'Hinglish'].map(med => (
                <button
                  key={med}
                  onClick={() => setSelectedMedium(med)}
                  style={{
                    padding: '12px', borderRadius: 12,
                    border: `2px solid ${selectedMedium === med ? C.orange : C.border}`,
                    background: selectedMedium === med ? C.orange + '18' : C.card2,
                    color: selectedMedium === med ? C.orange : C.text,
                    cursor: 'pointer', fontWeight: 800, fontSize: 13, textAlign: 'center'
                  }}
                >
                  {med}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => completeLogin(selectedBoard, selectedMedium)}
            style={{
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              background: `linear-gradient(135deg, ${C.green}, ${C.cyan})`,
              color: '#000', fontSize: 16, fontWeight: 900, cursor: 'pointer',
              boxShadow: `0 6px 20px ${C.green}44`
            }}
          >
            🚀 Shuru Karo! (Class {selectedClass} • {selectedBoard})
          </button>

          <div style={{ marginTop: 16 }}>
            <button onClick={() => setStep('class')} style={{ background: 'none', border: 'none', color: C.muted, textDecoration: 'underline', cursor: 'pointer' }}>← Back to Class</button>
          </div>
        </div>
      )}

      {/* Logout / Switch Account */}
      {step === 'profile' && (
        <div style={{ marginTop: 50 }}>
          <button onClick={handleLogout} style={{ background: 'transparent', border: `2px solid ${C.border}`, color: C.muted, padding: '10px 24px', borderRadius: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🚪</span> Reset All Profiles
          </button>
        </div>
      )}

    </div>
  );
}