'use client';

import { useState, useEffect } from 'react';
import { checkAnnualClassPromotion, executeClassPromotion, dismissPromotionReminder } from '@/lib/curriculum/academic-lifecycle';

const C = {
  bg: '#0f1520', card: '#161e30', border: '#1e2d45',
  cyan: '#06b6d4', orange: '#ff6b35', purple: '#7c3aed', green: '#10b981',
  yellow: '#f59e0b', text: '#f1f5f9', muted: '#64748b'
};

export default function AcademicPromotionModal({ onPromoted }) {
  const [promoData, setPromoData] = useState(null);
  const [showManualSelect, setShowManualSelect] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [promotedSuccess, setPromotedSuccess] = useState(false);

  useEffect(() => {
    // Only check in browser
    const status = checkAnnualClassPromotion();
    if (status.isDue) {
      setPromoData(status);
      setSelectedClass(status.suggestedNextClass);
    }
  }, []);

  if (!promoData) return null;

  const handleConfirm = async (cls) => {
    await executeClassPromotion(cls);
    setPromotedSuccess(true);
    if (onPromoted) onPromoted(cls);
    setTimeout(() => {
      setPromoData(null);
    }, 2200);
  };

  const handleDismiss = () => {
    dismissPromotionReminder();
    setPromoData(null);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(7, 9, 15, 0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, fontFamily: "'Nunito', sans-serif"
    }}>
      <div style={{
        background: `linear-gradient(145deg, ${C.card}, ${C.bg})`,
        border: `2px solid ${C.yellow}`,
        borderRadius: 24, maxWidth: 440, width: '100%',
        padding: '28px 20px', textAlign: 'center', color: C.text,
        boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 30px ${C.yellow}22`,
        animation: 'slideUp 0.3s ease'
      }}>
        
        {promotedSuccess ? (
          <div style={{ padding: '20px 0' }}>
            <div style={{ fontSize: 60, marginBottom: 10 }}>🎉 🚀 🎓</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: C.green, marginBottom: 8 }}>
              Badhai Ho! +100 XP 🌟
            </h2>
            <p style={{ color: C.muted, fontSize: 14 }}>
              Ab aapka poora CBSE course <strong>Class {selectedClass}th</strong> ke hisaab se update ho gaya hai!
            </p>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 50, marginBottom: 8 }}>🎓 📚 🌟</div>
            
            <div style={{ display: 'inline-block', background: C.yellow + '22', color: C.yellow, padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 800, marginBottom: 12 }}>
              Naya Session {promoData.academicSession}
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>
              Kya Aap <span style={{ color: C.cyan }}>Class {promoData.suggestedNextClass}th</span> Mein Aa Gaye?
            </h2>

            <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
              Pichle session mein aap <strong>Class {promoData.currentClass}th</strong> mein the. Naye session ke liye course update karein taaki exact standard study material mile!
            </p>

            {/* +100 XP Badge */}
            <div style={{ background: C.green + '18', border: `1px dashed ${C.green}`, borderRadius: 12, padding: '10px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>🎁</span>
              <span style={{ color: C.green, fontWeight: 800, fontSize: 13 }}>Promotion Bonus: +100 XP Gift!</span>
            </div>

            {!showManualSelect ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button
                  onClick={() => handleConfirm(promoData.suggestedNextClass)}
                  style={{
                    background: `linear-gradient(135deg, ${C.yellow}, ${C.orange})`,
                    color: '#000', border: 'none', padding: '15px 20px',
                    borderRadius: 14, fontSize: 15, fontWeight: 900,
                    cursor: 'pointer', boxShadow: `0 6px 20px ${C.orange}44`
                  }}
                >
                  🎉 Haan! Main Class {promoData.suggestedNextClass}th Mein Aa Gaya!
                </button>

                <button
                  onClick={() => setShowManualSelect(true)}
                  style={{
                    background: 'transparent', border: `1px solid ${C.border}`,
                    color: C.muted, padding: '10px', borderRadius: 10,
                    cursor: 'pointer', fontSize: 13, fontWeight: 700
                  }}
                >
                  ✏️ Koi Aur Class Chunein
                </button>

                <button
                  onClick={handleDismiss}
                  style={{
                    background: 'transparent', border: 'none',
                    color: C.muted, textDecoration: 'underline',
                    cursor: 'pointer', fontSize: 12, marginTop: 4
                  }}
                >
                  Baad mein puchein
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label style={{ fontSize: 12, color: C.muted, fontWeight: 700, textAlign: 'left' }}>
                  Apni Sahi Class Chunein:
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(parseInt(e.target.value))}
                  style={{
                    padding: '12px', borderRadius: 12, background: C.card,
                    border: `1px solid ${C.cyan}`, color: '#fff', fontSize: 15, fontWeight: 800
                  }}
                >
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => (
                    <option key={c} value={c}>Class {c}th</option>
                  ))}
                </select>

                <button
                  onClick={() => handleConfirm(selectedClass)}
                  style={{
                    background: `linear-gradient(135deg, ${C.green}, ${C.cyan})`,
                    color: '#000', border: 'none', padding: '14px',
                    borderRadius: 14, fontSize: 15, fontWeight: 900, cursor: 'pointer'
                  }}
                >
                  ✅ Confirm Class {selectedClass}th
                </button>
                
                <button
                  onClick={() => setShowManualSelect(false)}
                  style={{ background: 'none', border: 'none', color: C.muted, fontSize: 12, cursor: 'pointer' }}
                >
                  ← Wapas Jao
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
