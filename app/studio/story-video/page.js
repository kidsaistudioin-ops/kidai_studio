'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  pink: '#ec4899', text: '#f1f5f9', muted: '#64748b'
};

const SCENE_STYLES = [
  { id: 'cartoon', name: 'Cartoon', icon: '🎨' },
  { id: 'anime', name: 'Anime', icon: '👾' },
  { id: 'disney', name: 'Disney', icon: '🏰' },
  { id: 'pixar', name: 'Pixar', icon: '✨' }
];

const VOICES = [
  { id: 'friendly', name: 'Friendly', icon: '😊' },
  { id: 'storyteller', name: 'Storyteller', icon: '📚' },
  { id: 'funny', name: 'Funny', icon: '😂' },
  { id: 'dramatic', name: 'Dramatic', icon: '🎭' }
];

export default function StoryVideoPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [story, setStory] = useState('');
  const [mainChar, setMainChar] = useState('🦸');
  const [style, setStyle] = useState(SCENE_STYLES[0]);
  const [voice, setVoice] = useState(VOICES[0]);
  const [scenes, setScenes] = useState([]);
  const [generating, setGenerating] = useState(false);

  const generateScenes = () => {
    if (!story) {
      alert('Please write a story first!');
      return;
    }
    setGenerating(true);
    // Mock scene generation (Real AI integration later)
    setTimeout(() => {
      setScenes([
        { id: 1, desc: 'A beautiful village at sunrise', image: '🏡', duration: 3 },
        { id: 2, desc: 'The hero meets a wise old friend', image: '👴', duration: 4 },
        { id: 3, desc: 'Adventure begins in the forest', image: '🌲', duration: 3 },
        { id: 4, desc: 'A magical discovery', image: '✨', duration: 4 },
        { id: 5, desc: 'Happy ending under stars', image: '🌟', duration: 3 }
      ]);
      setGenerating(false);
      setStep(2);
    }, 3000);
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${C.border}`, background: C.card }}>
        <button onClick={() => router.push('/studio')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20 }}>←</button>
        <span style={{ fontWeight: 800, fontSize: 18 }}>Story Video Maker 🎬</span>
      </div>

      <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
        
        {/* Step 1: Story Input */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>📖</div>
              <h2 style={{ fontWeight: 900, marginBottom: 8 }}>Write Your Story</h2>
              <p style={{ color: C.muted }}>AI se video banayein apni kahani se!</p>
            </div>

            {/* Story Input */}
            <div style={{ background: C.card, padding: 20, borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ fontWeight: 800, marginBottom: 10, color: C.cyan }}>Your Story (Hindi ya English me likho)</div>
              <textarea 
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Ek chhota sa story likho... jaise: Ek chanda jo raat ko sitare se baat karta tha..."
                rows={5}
                style={{ width: '100%', padding: 12, borderRadius: 12, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontSize: 14, resize: 'none', outline: 'none' }}
              />
            </div>

            {/* Character Selection */}
            <div style={{ background: C.card, padding: 20, borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ fontWeight: 800, marginBottom: 10, color: C.purple }}>Main Character</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['🦸', '👸', '🐉', '🤖', '🦄', '🐱', '🦊', '🐼'].map(c => (
                  <button 
                    key={c}
                    onClick={() => setMainChar(c)}
                    style={{ width: 50, height: 50, fontSize: 28, background: mainChar === c ? C.purple + '33' : C.card2, border: `2px solid ${mainChar === c ? C.purple : C.border}`, borderRadius: 12, cursor: 'pointer' }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div style={{ background: C.card, padding: 20, borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ fontWeight: 800, marginBottom: 10, color: C.orange }}>Video Style</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {SCENE_STYLES.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setStyle(s)}
                    style={{ padding: 12, background: style.id === s.id ? C.orange + '33' : C.card2, border: `2px solid ${style.id === s.id ? C.orange : C.border}`, borderRadius: 12, cursor: 'pointer', textAlign: 'center' }}
                  >
                    <div style={{ fontSize: 24 }}>{s.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 800, marginTop: 4 }}>{s.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Selection */}
            <div style={{ background: C.card, padding: 20, borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ fontWeight: 800, marginBottom: 10, color: C.green }}>Voice Style</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {VOICES.map(v => (
                  <button 
                    key={v.id}
                    onClick={() => setVoice(v)}
                    style={{ padding: 12, background: voice.id === v.id ? C.green + '33' : C.card2, border: `2px solid ${voice.id === v.id ? C.green : C.border}`, borderRadius: 12, cursor: 'pointer', textAlign: 'center' }}
                  >
                    <div style={{ fontSize: 24 }}>{v.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 800, marginTop: 4 }}>{v.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button 
              onClick={generateScenes}
              disabled={generating}
              style={{ width: '100%', padding: 18, background: generating ? C.card2 : `linear-gradient(135deg, ${C.purple}, ${C.pink})`, color: generating ? C.muted : '#fff', border: 'none', borderRadius: 16, fontWeight: 900, fontSize: 18, cursor: generating ? 'not-allowed' : 'pointer' }}
            >
              {generating ? '🎬 Generating Scenes...' : '✨ Generate Video'}
            </button>
          </div>
        )}

        {/* Step 2: Preview Scenes */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 48 }}>🎉</div>
              <h2 style={{ fontWeight: 900, marginBottom: 8 }}>Your Story Scenes</h2>
              <p style={{ color: C.muted }}>5 scenes generate hue hain</p>
            </div>

            {/* Scene Timeline */}
            <div style={{ background: C.card, padding: 16, borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ fontWeight: 800, marginBottom: 12, color: C.cyan }}>📽️ Scene Timeline</div>
              {scenes.map((scene, i) => (
                <div key={scene.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: C.card2, borderRadius: 12, marginBottom: 8 }}>
                  <div style={{ width: 30, height: 30, background: C.purple, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>{i + 1}</div>
                  <div style={{ fontSize: 32 }}>{scene.image}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>{scene.desc}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{scene.duration} seconds</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Preview Button */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => setStep(1)}
                style={{ flex: 1, padding: 14, background: C.card2, color: C.text, border: `1px solid ${C.border}`, borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}
              >
                ✏️ Edit Story
              </button>
              <button 
                style={{ flex: 1, padding: 14, background: C.green, color: '#000', border: 'none', borderRadius: 12, fontWeight: 900, cursor: 'pointer' }}
              >
                ▶️ Preview Video
              </button>
            </div>

            <p style={{ textAlign: 'center', color: C.muted, marginTop: 16, fontSize: 12 }}>
              🔜 Video generation coming soon! (API integration pending)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}