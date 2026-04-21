'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  pink: '#ec4899', text: '#f1f5f9', muted: '#64748b'
};

const PROMO_STYLES = [
  { id: 'product', name: 'Product Launch', icon: '📦', desc: 'New product showcase' },
  { id: 'social', name: 'Social Media', icon: '📱', desc: 'Instagram/Reels style' },
  { id: 'corporate', name: 'Corporate', icon: '🏢', desc: 'Professional business' },
  { id: 'sale', name: 'Sale Promo', icon: '🔥', desc: 'Discount offers' },
  { id: 'event', name: 'Event', icon: '🎉', desc: 'Event highlights' },
  { id: 'brand', name: 'Brand Story', icon: '💫', desc: 'Brand introduction' }
];

const DURATIONS = [
  { id: '15', name: '15 sec', icon: '⚡' },
  { id: '30', name: '30 sec', icon: '⏱️' },
  { id: '60', name: '1 min', icon: '📺' }
];

const TEMPLATES = [
  { id: 1, name: 'Dynamic Intro', preview: '🎬' },
  { id: 2, name: 'Slide Show', preview: '🖼️' },
  { id: 3, name: 'Motion Text', preview: '✨' },
  { id: 4, name: 'Product Reveal', preview: '📦' }
];

export default function BrandPromoPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [promoStyle, setPromoStyle] = useState(PROMO_STYLES[0]);
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [generating, setGenerating] = useState(false);

  const generatePromo = () => {
    if (!brandName || !tagline) {
      alert('Please fill brand name and tagline!');
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setStep(2);
    }, 2500);
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${C.border}`, background: C.card }}>
        <button onClick={() => router.push('/studio')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20 }}>←</button>
        <span style={{ fontWeight: 800, fontSize: 18 }}>Brand Promo Maker 📢</span>
      </div>

      <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
        
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>💼</div>
              <h2 style={{ fontWeight: 900, marginBottom: 8 }}>Create Brand Promo</h2>
              <p style={{ color: C.muted }}>Scalio jaise professional promotional videos!</p>
            </div>

            {/* Brand Details */}
            <div style={{ background: C.card, padding: 20, borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ fontWeight: 800, marginBottom: 12, color: C.cyan }}>🏢 Brand Details</div>
              <input 
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Brand Name (e.g., TechKids)"
                style={{ width: '100%', padding: 12, borderRadius: 10, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 10, outline: 'none' }}
              />
              <input 
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Tagline (e.g., Learning made fun!)"
                style={{ width: '100%', padding: 12, borderRadius: 10, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontSize: 14, marginBottom: 10, outline: 'none' }}
              />
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description about your brand..."
                rows={2}
                style={{ width: '100%', padding: 12, borderRadius: 10, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontSize: 14, resize: 'none', outline: 'none' }}
              />
            </div>

            {/* Promo Style */}
            <div style={{ background: C.card, padding: 20, borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ fontWeight: 800, marginBottom: 12, color: C.purple }}>🎨 Promo Type</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {PROMO_STYLES.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setPromoStyle(s)}
                    style={{ padding: 12, background: promoStyle.id === s.id ? C.purple + '33' : C.card2, border: `2px solid ${promoStyle.id === s.id ? C.purple : C.border}`, borderRadius: 12, cursor: 'pointer', textAlign: 'center' }}
                  >
                    <div style={{ fontSize: 24 }}>{s.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 800, marginTop: 4 }}>{s.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div style={{ background: C.card, padding: 20, borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ fontWeight: 800, marginBottom: 12, color: C.orange }}>⏱️ Video Duration</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {DURATIONS.map(d => (
                  <button 
                    key={d.id}
                    onClick={() => setDuration(d)}
                    style={{ flex: 1, padding: 12, background: duration.id === d.id ? C.orange + '33' : C.card2, border: `2px solid ${duration.id === d.id ? C.orange : C.border}`, borderRadius: 10, cursor: 'pointer', textAlign: 'center' }}
                  >
                    <div style={{ fontSize: 20 }}>{d.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 800 }}>{d.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Template */}
            <div style={{ background: C.card, padding: 20, borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ fontWeight: 800, marginBottom: 12, color: C.green }}>🎬 Template Style</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {TEMPLATES.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setTemplate(t)}
                    style={{ padding: 12, background: template.id === t.id ? C.green + '33' : C.card2, border: `2px solid ${template.id === t.id ? C.green : C.border}`, borderRadius: 10, cursor: 'pointer', textAlign: 'center' }}
                  >
                    <div style={{ fontSize: 24 }}>{t.preview}</div>
                    <div style={{ fontSize: 10, fontWeight: 800, marginTop: 4 }}>{t.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate */}
            <button 
              onClick={generatePromo}
              disabled={generating}
              style={{ width: '100%', padding: 18, background: generating ? C.card2 : `linear-gradient(135deg, ${C.orange}, ${C.pink})`, color: generating ? C.muted : '#fff', border: 'none', borderRadius: 16, fontWeight: 900, fontSize: 18, cursor: generating ? 'not-allowed' : 'pointer' }}
            >
              {generating ? '🎬 Creating Promo...' : '✨ Generate Promo Video'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 48 }}>🎉</div>
              <h2 style={{ fontWeight: 900, marginBottom: 8 }}>Your Promo Ready!</h2>
              <p style={{ color: C.muted }}>{brandName} - {tagline}</p>
            </div>

            {/* Preview */}
            <div style={{ background: '#000', borderRadius: 20, padding: 20, marginBottom: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 80, marginBottom: 20 }}>🎬</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: C.orange }}>{brandName}</div>
              <div style={{ fontSize: 16, color: '#fff', marginBottom: 10 }}>{tagline}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{duration.name} • {promoStyle.name}</div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => setStep(1)}
                style={{ flex: 1, padding: 14, background: C.card2, color: C.text, border: `1px solid ${C.border}`, borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}
              >
                ✏️ Edit
              </button>
              <button 
                style={{ flex: 1, padding: 14, background: C.cyan, color: '#000', border: 'none', borderRadius: 12, fontWeight: 900, cursor: 'pointer' }}
              >
                ⬇️ Download
              </button>
            </div>

            <p style={{ textAlign: 'center', color: C.muted, marginTop: 16, fontSize: 12 }}>
              🔜 Full video generation coming soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}