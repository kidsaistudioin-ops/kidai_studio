'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { speak, stopSpeaking, isSpeaking } from '@/lib/voice';
import { playCorrectSound, playStreakChime, playTone } from '@/lib/audio/sound-engine';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  yellow: '#f59e0b', pink: '#ec4899', red: '#ef4444', text: '#f1f5f9', muted: '#64748b'
};

const SCENE_STYLES = [
  { id: 'cartoon', name: 'Cartoon Toon', icon: '🎨', bgGradient: 'linear-gradient(135deg, #1e1b4b, #312e81)' },
  { id: 'anime', name: 'Anime Vibrant', icon: '👾', bgGradient: 'linear-gradient(135deg, #4c0519, #831843)' },
  { id: 'fantasy', name: 'Magic Disney', icon: '🏰', bgGradient: 'linear-gradient(135deg, #042f2e, #115e59)' },
  { id: 'cinematic', name: '3D Pixar', icon: '✨', bgGradient: 'linear-gradient(135deg, #172554, #1e3a8a)' }
];

const VOICES = [
  { id: 'friendly', name: 'Sweet Voice', icon: '😊', pitch: 1.2, rate: 0.9 },
  { id: 'storyteller', name: 'Narrator', icon: '📚', pitch: 1.0, rate: 0.85 },
  { id: 'funny', name: 'Playful', icon: '😂', pitch: 1.3, rate: 0.95 },
  { id: 'heroic', name: 'Heroic', icon: '🦸', pitch: 0.95, rate: 0.88 }
];

const QUICK_STORIES = [
  {
    title: '🌟 Chanda & Tara',
    char: '🌟',
    text: 'Ek chhota sa chamakta sitara asmaan se zameen par aaya aur ek sundar bagiche me pyare phoolon se dosti karne laga.'
  },
  {
    title: '🦁 Sher & Little Bird',
    char: '🦁',
    text: 'Jungle ka nanha sher Simba doston ke sath nikal pada ek jaadui gufa ki khoj me jahan milti thi sabse meethi ber.'
  },
  {
    title: '🤖 Chintu Robot on Mars',
    char: '🤖',
    text: 'Chintu Robot ne banaya ek super rocket aur asmaan ke paar ud gaya lal grah Mars par naye robot doston se milne.'
  },
  {
    title: '🦄 The Magic Unicorn',
    char: '🦄',
    text: 'Jaadui indradhanush ke jungle me ek sunhera unicorn rehta tha jo apni chamakti seeng se murjhaye phoolon ko khila deta tha.'
  }
];

const SCENE_ENVIRONMENTS = [
  { bg: 'linear-gradient(180deg, #f97316 0%, #38bdf8 60%, #166534 100%)', sky: '🌅 Sunrise Garden', decor: '🌸 🏡 🌳' },
  { bg: 'linear-gradient(180deg, #0284c7 0%, #064e3b 70%, #052e16 100%)', sky: '🌲 Magic Forest', decor: '🍄 🌲 🌿 🦌' },
  { bg: 'linear-gradient(180deg, #4f46e5 0%, #311042 70%, #0f172a 100%)', sky: '✨ Enchanted Cave', decor: '💎 🔮 ⚡ 🪨' },
  { bg: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #431407 100%)', sky: '🚀 Cosmic Galaxy', decor: '🌌 🪐 🛸 🌠' },
  { bg: 'linear-gradient(180deg, #1e1b4b 0%, #064e3b 60%, #022c22 100%)', sky: '🌟 Celebration Meadow', decor: '🎆 🎉 🌈 🌟' }
];

export default function StoryVideoPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Script & Theme, 2: Storyboard Director, 3: Cinema Video Player
  const [story, setStory] = useState('');
  const [mainChar, setMainChar] = useState('🦸');
  const [style, setStyle] = useState(SCENE_STYLES[0]);
  const [voice, setVoice] = useState(VOICES[0]);
  const [scenes, setScenes] = useState([]);
  const [generating, setGenerating] = useState(false);

  // Cinema Player State
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [editingSceneId, setEditingSceneId] = useState(null);

  const videoTimerRef = useRef(null);
  const progressTimerRef = useRef(null);

  // Auto Generate 5 Cinematic Scenes from Story
  const generateScenes = () => {
    if (!story.trim()) {
      alert('Kripya pehle apni story likhein ya neeche diye gaye templates me se chunein!');
      return;
    }

    setGenerating(true);

    try {
      playStreakChime();
    } catch(e) {}

    setTimeout(() => {
      // Smart Scene Parsing Logic
      const charName = mainChar === '🤖' ? 'Chintu Robot' : mainChar === '🦁' ? 'Simba the Lion' : mainChar === '🦄' ? 'Twinkle Unicorn' : mainChar === '🌟' ? 'Little Star' : mainChar === '👸' ? 'Princess Maya' : mainChar === '🐉' ? 'Draco Dragon' : 'Hamara Hero';

      const generated = [
        {
          id: 1,
          title: 'Scene 1: Introduction & Setting',
          desc: `Kahani shuru hoti hai ek khubsoorat subah me, jahan ${charName} ${mainChar} apne shandar safar ki tayyari kar raha tha.`,
          dialogue: `Ek samay ki baat hai! Ek pyare gaon me ${charName} apne doston ke sath rehta tha.`,
          actor: mainChar,
          secActor: '🏡',
          env: SCENE_ENVIRONMENTS[0],
          duration: 5
        },
        {
          id: 2,
          title: 'Scene 2: Meeting a Wise Companion',
          desc: `${charName} aage badhte hue jaadui jungle me pahuncha aur use mila ek akalmand sathi.`,
          dialogue: `Raste me ${charName} ko mila ek pyara sathi jisne use aage ka rasta bataya!`,
          actor: mainChar,
          secActor: '🧙‍♂️',
          env: SCENE_ENVIRONMENTS[1],
          duration: 5
        },
        {
          id: 3,
          title: 'Scene 3: The Mystery Challenge',
          desc: `Dono ko raste me ek jaadui gufa aur chamakta hua chamatkari stone dikhai diya.`,
          dialogue: `Achanak asmaan me chamakti roshni phooti aur ek romanchak paheli samne aayi!`,
          actor: mainChar,
          secActor: '✨',
          env: SCENE_ENVIRONMENTS[2],
          duration: 5
        },
        {
          id: 4,
          title: 'Scene 4: Brave Action & Triumph',
          desc: `${charName} ne apni samajhdari aur taqat se mushkil ko hal kar diya!`,
          dialogue: `${charName} ne himmat dikhayi aur sabhi doston ki madad karke din jeet liya!`,
          actor: mainChar,
          secActor: '⚡',
          env: SCENE_ENVIRONMENTS[3],
          duration: 5
        },
        {
          id: 5,
          title: 'Scene 5: Grand Joyful Celebration',
          desc: `Sabhi doston ne milkar sitaron ke neeche khushiyon ka jashn manaya aur dosti ki jeet hui.`,
          dialogue: `Aur is tarah ${charName} ki kahani ek shaandar aur muskurahat bhare andaz me poori hui!`,
          actor: mainChar,
          secActor: '🎉',
          env: SCENE_ENVIRONMENTS[4],
          duration: 6
        }
      ];

      setScenes(generated);
      setGenerating(false);
      setStep(2);
      try { playCorrectSound(); } catch(e) {}
    }, 1500);
  };

  // Cinema Player Video Controller
  const startVideoPlayback = (fromScene = 0) => {
    setStep(3);
    setActiveSceneIdx(fromScene);
    setIsPlayingVideo(true);
    setSceneProgress(0);
  };

  // Scene Progression & Voice Narration Loop
  useEffect(() => {
    if (step !== 3 || !isPlayingVideo || scenes.length === 0) {
      stopSpeaking();
      if (videoTimerRef.current) clearTimeout(videoTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const currentScene = scenes[activeSceneIdx];
    if (!currentScene) return;

    // 1. Play Voice Narration
    if (!voiceMuted && currentScene.dialogue) {
      speak(currentScene.dialogue, {
        rate: voice.rate,
        pitch: voice.pitch,
        lang: 'hi-IN'
      });
    }

    // 2. Play Scene Transition Tone
    try {
      playTone(440 + activeSceneIdx * 80, 'sine', 0.15, 0.1);
    } catch(e) {}

    // 3. Smooth Progress Bar
    const durationMs = (currentScene.duration || 5) * 1000;
    const intervalMs = 100;
    let elapsed = 0;
    setSceneProgress(0);

    progressTimerRef.current = setInterval(() => {
      elapsed += intervalMs;
      setSceneProgress(Math.min(100, (elapsed / durationMs) * 100));
    }, intervalMs);

    // 4. Auto Advance to Next Scene
    videoTimerRef.current = setTimeout(() => {
      clearInterval(progressTimerRef.current);
      if (activeSceneIdx < scenes.length - 1) {
        setActiveSceneIdx(prev => prev + 1);
      } else {
        // Video Finished
        setIsPlayingVideo(false);
        try { playStreakChime(); } catch(e) {}
      }
    }, durationMs);

    return () => {
      if (videoTimerRef.current) clearTimeout(videoTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [step, isPlayingVideo, activeSceneIdx, voiceMuted, scenes, voice]);

  const togglePlayPause = () => {
    if (isPlayingVideo) {
      stopSpeaking();
      setIsPlayingVideo(false);
    } else {
      if (activeSceneIdx >= scenes.length - 1 && sceneProgress >= 100) {
        setActiveSceneIdx(0);
      }
      setIsPlayingVideo(true);
    }
  };

  const handleNextScene = () => {
    stopSpeaking();
    if (activeSceneIdx < scenes.length - 1) {
      setActiveSceneIdx(prev => prev + 1);
      setSceneProgress(0);
    }
  };

  const handlePrevScene = () => {
    stopSpeaking();
    if (activeSceneIdx > 0) {
      setActiveSceneIdx(prev => prev - 1);
      setSceneProgress(0);
    }
  };

  const handleRestartVideo = () => {
    stopSpeaking();
    setActiveSceneIdx(0);
    setSceneProgress(0);
    setIsPlayingVideo(true);
  };

  const handleUpdateSceneText = (sceneId, newDialogue) => {
    setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, dialogue: newDialogue } : s));
  };

  const currentActiveScene = scenes[activeSceneIdx] || scenes[0];

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @keyframes float-actor {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-12px) scale(1.05); }
        }
        @keyframes walk-actor {
          0% { transform: translateX(-40px) scale(0.9); opacity: 0; }
          40% { transform: translateX(0px) scale(1); opacity: 1; }
          70% { transform: translateY(-8px) scale(1.05); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes pulse-bubble {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes glow-cinema {
          0%, 100% { box-shadow: 0 0 30px rgba(124, 58, 237, 0.4); }
          50% { box-shadow: 0 0 50px rgba(6, 182, 212, 0.6); }
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      {/* Header Bar */}
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, background: C.card }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button 
            onClick={() => {
              stopSpeaking();
              if (step > 1) setStep(step - 1);
              else router.push('/studio');
            }} 
            style={{ background: C.card2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, padding: '6px 12px', cursor: 'pointer', fontSize: 16, fontWeight: 900 }}
          >
            ← {step === 1 ? 'Studio' : step === 2 ? 'Edit Script' : 'Storyboard'}
          </button>
          <div style={{ fontWeight: 900, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>Story Video Studio</span>
            <span style={{ background: C.orange, color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 6, fontWeight: 900 }}>HD CINEMA</span>
          </div>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['1. Script', '2. Scenes (5)', '3. Cinema Play'].map((sName, sIdx) => (
            <div 
              key={sIdx}
              style={{
                padding: '4px 10px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 900,
                background: step === sIdx + 1 ? C.cyan : C.card2,
                color: step === sIdx + 1 ? '#000' : C.muted,
                border: `1px solid ${step === sIdx + 1 ? '#fff' : C.border}`
              }}
            >
              {sName}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 16px', maxWidth: 900, margin: '0 auto' }}>
        
        {/* STEP 1: SCRIPT INPUT & THEME CONFIGURATION */}
        {step === 1 && (
          <div style={{ maxWidth: 650, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 50, marginBottom: 8 }}>🎬✨</div>
              <h2 style={{ fontWeight: 900, fontSize: 24, margin: '0 0 6px' }}>Create Your Animated Story Video</h2>
              <p style={{ color: C.muted, fontSize: 14 }}>Apni kahani likhein ya 1-Click me ready template se 5-Scene HD Video banayein!</p>
            </div>

            {/* Quick Templates */}
            <div style={{ background: C.card, padding: 18, borderRadius: 20, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ fontWeight: 900, fontSize: 13, color: C.yellow, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>⚡</span> 1-CLICK POPULAR STORY TEMPLATES
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
                {QUICK_STORIES.map((qt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setStory(qt.text);
                      setMainChar(qt.char);
                    }}
                    style={{
                      padding: 10,
                      background: C.card2,
                      border: `1px solid ${C.border}`,
                      borderRadius: 12,
                      color: C.text,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'transform 0.1s'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 4 }}>{qt.title}</div>
                    <div style={{ fontSize: 11, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{qt.text}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Story Textarea */}
            <div style={{ background: C.card, padding: 20, borderRadius: 20, border: `1px solid ${C.cyan}44`, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontWeight: 900, color: C.cyan, fontSize: 14 }}>📝 Apni Kahani Likho (Hindi / Hinglish / English)</div>
                <div style={{ fontSize: 11, color: C.muted }}>{story.length} characters</div>
              </div>
              <textarea 
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Yahan apni kahani likho... Jaise: Ek chhota pyara hathi jisko naye doston ke sath jungle ghumna pasand tha..."
                rows={4}
                style={{ width: '100%', padding: 14, borderRadius: 14, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontSize: 15, lineHeight: 1.5, resize: 'vertical', outline: 'none' }}
              />
            </div>

            {/* Main Character Picker */}
            <div style={{ background: C.card, padding: 18, borderRadius: 20, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ fontWeight: 900, marginBottom: 12, color: C.purple, fontSize: 13 }}>🎭 CHOOSE MAIN HERO CHARACTER</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['🦸', '👸', '🦁', '🤖', '🦄', '🌟', '🐉', '🐱', '🦊', '🚀'].map(c => (
                  <button 
                    key={c}
                    onClick={() => setMainChar(c)}
                    style={{ 
                      width: 52, 
                      height: 52, 
                      fontSize: 28, 
                      background: mainChar === c ? C.purple + '33' : C.card2, 
                      border: `2px solid ${mainChar === c ? C.purple : C.border}`, 
                      borderRadius: 14, 
                      cursor: 'pointer',
                      boxShadow: mainChar === c ? `0 0 15px ${C.purple}66` : 'none',
                      transform: mainChar === c ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Style & Voice Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
              <div style={{ background: C.card, padding: 16, borderRadius: 18, border: `1px solid ${C.border}` }}>
                <div style={{ fontWeight: 900, marginBottom: 10, color: C.orange, fontSize: 12 }}>🎨 VISUAL THEME</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {SCENE_STYLES.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => setStyle(s)}
                      style={{ padding: 10, background: style.id === s.id ? C.orange : C.card2, color: style.id === s.id ? '#fff' : C.muted, border: `1px solid ${style.id === s.id ? '#fff' : C.border}`, borderRadius: 10, cursor: 'pointer', textAlign: 'center', fontWeight: 800, fontSize: 11 }}
                    >
                      <div>{s.icon}</div>
                      <div>{s.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: C.card, padding: 16, borderRadius: 18, border: `1px solid ${C.border}` }}>
                <div style={{ fontWeight: 900, marginBottom: 10, color: C.green, fontSize: 12 }}>🎙️ NARRATION VOICE</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {VOICES.map(v => (
                    <button 
                      key={v.id}
                      onClick={() => setVoice(v)}
                      style={{ padding: 10, background: voice.id === v.id ? C.green : C.card2, color: voice.id === v.id ? '#000' : C.muted, border: `1px solid ${voice.id === v.id ? '#fff' : C.border}`, borderRadius: 10, cursor: 'pointer', textAlign: 'center', fontWeight: 800, fontSize: 11 }}
                    >
                      <div>{v.icon}</div>
                      <div>{v.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Big Generate Scenes Button */}
            <button 
              onClick={generateScenes}
              disabled={generating || !story.trim()}
              style={{
                width: '100%',
                padding: 18,
                background: generating ? C.card2 : `linear-gradient(135deg, ${C.orange}, ${C.pink})`,
                color: '#fff',
                border: 'none',
                borderRadius: 18,
                fontWeight: 900,
                fontSize: 18,
                cursor: generating || !story.trim() ? 'not-allowed' : 'pointer',
                boxShadow: generating ? 'none' : '0 8px 30px rgba(255, 107, 53, 0.4)',
                transition: 'transform 0.1s'
              }}
            >
              {generating ? '⏳ Generating 5-Scene Storyboard...' : '✨ Generate 5-Scene Story Video ▶'}
            </button>
          </div>
        )}

        {/* STEP 2: 5-SCENE STORYBOARD & SCRIPT DIRECTOR */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontWeight: 900, fontSize: 22, margin: 0 }}>📽️ Storyboard (5 Scenes Ready!)</h2>
                <p style={{ color: C.muted, fontSize: 13, margin: '4px 0 0' }}>Har scene ko dekhein, customize karein aur play karein.</p>
              </div>
              <button 
                onClick={() => startVideoPlayback(0)}
                style={{
                  padding: '14px 28px',
                  background: `linear-gradient(135deg, ${C.green}, #059669)`,
                  color: '#000',
                  border: 'none',
                  borderRadius: 14,
                  fontWeight: 900,
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <span>▶️</span>
                <span>PLAY FULL VIDEO NOW</span>
              </button>
            </div>

            {/* 5 Scenes Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {scenes.map((scene, i) => (
                <div 
                  key={scene.id} 
                  style={{
                    background: C.card,
                    borderRadius: 18,
                    border: `1px solid ${C.border}`,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 34, height: 34, background: C.purple, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff' }}>
                        {i + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: 15, color: '#fff' }}>{scene.title}</div>
                        <div style={{ fontSize: 12, color: C.cyan }}>{scene.env.sky}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => startVideoPlayback(i)}
                        style={{
                          padding: '6px 12px',
                          background: C.card2,
                          border: `1px solid ${C.green}`,
                          borderRadius: 8,
                          color: C.green,
                          fontWeight: 800,
                          fontSize: 12,
                          cursor: 'pointer'
                        }}
                      >
                        ▶️ Play Scene
                      </button>
                    </div>
                  </div>

                  {/* Scene Dialogue Script */}
                  <div style={{ background: C.card2, padding: 12, borderRadius: 12, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: C.yellow, marginBottom: 4 }}>🗣️ NARRATION / DIALOGUE:</div>
                    {editingSceneId === scene.id ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input 
                          value={scene.dialogue}
                          onChange={(e) => handleUpdateSceneText(scene.id, e.target.value)}
                          style={{ flex: 1, padding: 8, borderRadius: 8, background: '#000', border: `1px solid ${C.cyan}`, color: '#fff', fontSize: 13, outline: 'none' }}
                        />
                        <button onClick={() => setEditingSceneId(null)} style={{ padding: '6px 12px', background: C.cyan, color: '#000', border: 'none', borderRadius: 8, fontWeight: 900, cursor: 'pointer' }}>Done</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.4 }}>"{scene.dialogue}"</div>
                        <button onClick={() => setEditingSceneId(scene.id)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 12 }}>✏️ Edit</button>
                      </div>
                    )}
                  </div>

                  {/* Visual Preview Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: C.muted, background: '#0b0f19', padding: '8px 12px', borderRadius: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span>Actors: <strong>{scene.actor}</strong> & <strong>{scene.secActor}</strong></span>
                      <span>Decor: {scene.env.decor}</span>
                    </div>
                    <div>⏱️ {scene.duration}s</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => setStep(1)}
                style={{ flex: 1, padding: 16, background: C.card, color: C.text, border: `1px solid ${C.border}`, borderRadius: 16, fontWeight: 800, cursor: 'pointer' }}
              >
                ✏️ Re-write Story
              </button>
              <button 
                onClick={() => startVideoPlayback(0)}
                style={{ flex: 2, padding: 16, background: `linear-gradient(135deg, ${C.green}, #059669)`, color: '#000', border: 'none', borderRadius: 16, fontWeight: 900, fontSize: 17, cursor: 'pointer', boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)' }}
              >
                ▶️ Start Cinema Video Player
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: 16:9 HD CINEMA ANIMATED VIDEO PLAYER */}
        {step === 3 && (
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            
            {/* 16:9 CINEMA STAGE SCREEN */}
            <div 
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 9',
                borderRadius: 24,
                overflow: 'hidden',
                background: currentActiveScene?.env?.bg || SCENE_ENVIRONMENTS[0].bg,
                border: '4px solid #334155',
                animation: 'glow-cinema 4s infinite',
                boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 20
              }}
            >
              {/* Floating Stars / Sky Details */}
              <div style={{ position: 'absolute', top: 12, left: 20, fontSize: 18, animation: 'star-twinkle 2s infinite' }}>✨</div>
              <div style={{ position: 'absolute', top: 30, right: 40, fontSize: 24, animation: 'star-twinkle 3s infinite' }}>🌟</div>
              <div style={{ position: 'absolute', top: 60, left: '50%', fontSize: 20, opacity: 0.7 }}>☁️</div>

              {/* Top Scene Badge & Progress Count */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <div style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: '#fff', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 900, border: '1px solid rgba(255,255,255,0.2)' }}>
                  🎬 Scene {activeSceneIdx + 1} of {scenes.length} • {currentActiveScene?.title}
                </div>

                <div style={{ background: 'rgba(0,0,0,0.6)', color: C.yellow, padding: '4px 10px', borderRadius: 10, fontSize: 12, fontWeight: 900 }}>
                  {currentActiveScene?.env?.sky}
                </div>
              </div>

              {/* Main Animated Actors Stage */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', zIndex: 10, paddingBottom: 20 }}>
                
                {/* Hero Actor */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'walk-actor 1s ease-out' }}>
                  {/* Talking Speech Bubble */}
                  <div style={{
                    background: '#ffffff',
                    color: '#000',
                    padding: '8px 16px',
                    borderRadius: 18,
                    fontWeight: 900,
                    fontSize: 14,
                    marginBottom: 12,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                    maxWidth: 260,
                    textAlign: 'center',
                    lineHeight: 1.3,
                    animation: 'pulse-bubble 2s infinite',
                    position: 'relative'
                  }}>
                    {currentActiveScene?.dialogue}
                    <div style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '8px solid #ffffff' }} />
                  </div>

                  <div style={{ fontSize: 72, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.7))', animation: 'float-actor 3s ease-in-out infinite' }}>
                    {currentActiveScene?.actor}
                  </div>
                </div>

                {/* Secondary Companion / Prop Actor */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'walk-actor 1.2s ease-out' }}>
                  <div style={{ fontSize: 64, filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.6))', animation: 'float-actor 2.5s ease-in-out infinite' }}>
                    {currentActiveScene?.secActor}
                  </div>
                </div>

              </div>

              {/* Bottom Ground Environment Decor */}
              <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', fontSize: 24, opacity: 0.8, pointerEvents: 'none' }}>
                <span>{currentActiveScene?.env?.decor}</span>
              </div>

              {/* Subtitle Bar Overlay */}
              <div style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: '10px 18px', borderRadius: 14, textAlign: 'center', zIndex: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#fef08a', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  {currentActiveScene?.dialogue}
                </div>
              </div>

            </div>

            {/* Video Timeline Progress Bar */}
            <div style={{ marginTop: 14, marginBottom: 16 }}>
              <div style={{ height: 8, background: C.card2, borderRadius: 4, overflow: 'hidden', border: `1px solid ${C.border}` }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${((activeSceneIdx + (sceneProgress / 100)) / scenes.length) * 100}%`, 
                    background: `linear-gradient(90deg, ${C.purple}, ${C.cyan})`,
                    transition: 'width 0.1s linear'
                  }} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.muted, marginTop: 4 }}>
                <span>Scene {activeSceneIdx + 1} of {scenes.length}</span>
                <span>{Math.round(((activeSceneIdx + (sceneProgress / 100)) / scenes.length) * 100)}% Complete</span>
              </div>
            </div>

            {/* Cinema Video Control Bar */}
            <div style={{ background: C.card, padding: '16px 20px', borderRadius: 20, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              
              {/* Prev / Play / Next Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button 
                  onClick={handlePrevScene}
                  disabled={activeSceneIdx === 0}
                  style={{ width: 44, height: 44, borderRadius: 12, background: C.card2, border: `1px solid ${C.border}`, color: activeSceneIdx === 0 ? C.muted : '#fff', cursor: activeSceneIdx === 0 ? 'not-allowed' : 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Previous Scene"
                >
                  ⏮️
                </button>

                <button 
                  onClick={togglePlayPause}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 14,
                    background: isPlayingVideo ? C.orange : C.green,
                    color: isPlayingVideo ? '#fff' : '#000',
                    border: 'none',
                    fontWeight: 900,
                    fontSize: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: isPlayingVideo ? '0 4px 15px rgba(255,107,53,0.4)' : '0 4px 15px rgba(16,185,129,0.4)'
                  }}
                >
                  <span>{isPlayingVideo ? '⏸️' : '▶️'}</span>
                  <span>{isPlayingVideo ? 'PAUSE' : 'PLAY'}</span>
                </button>

                <button 
                  onClick={handleNextScene}
                  disabled={activeSceneIdx === scenes.length - 1}
                  style={{ width: 44, height: 44, borderRadius: 12, background: C.card2, border: `1px solid ${C.border}`, color: activeSceneIdx === scenes.length - 1 ? C.muted : '#fff', cursor: activeSceneIdx === scenes.length - 1 ? 'not-allowed' : 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Next Scene"
                >
                  ⏭️
                </button>

                <button 
                  onClick={handleRestartVideo}
                  style={{ width: 44, height: 44, borderRadius: 12, background: C.card2, border: `1px solid ${C.border}`, color: '#fff', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Restart Video from Scene 1"
                >
                  🔄
                </button>
              </div>

              {/* Voice Narration & Switchers */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button 
                  onClick={() => {
                    if (!voiceMuted) stopSpeaking();
                    setVoiceMuted(!voiceMuted);
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 10,
                    background: voiceMuted ? '#ef444422' : '#10b98122',
                    border: `1px solid ${voiceMuted ? '#ef4444' : '#10b981'}`,
                    color: voiceMuted ? '#ef4444' : '#10b981',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {voiceMuted ? '🔇 Voice Muted' : '🔊 Voice Narration On'}
                </button>

                <button 
                  onClick={() => {
                    stopSpeaking();
                    setStep(2);
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 10,
                    background: C.card2,
                    border: `1px solid ${C.border}`,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  📋 Storyboard
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}