'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { generateGameFromScan } from '@/lib/arya/arya-engine';
import Header from '@/components/ui/Header';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  text: '#f1f5f9', muted: '#64748b', pink: '#ec4899'
};

export default function ScannerPage() {
  const router = useRouter();
  
  // Sahi state variables
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [generatedGame, setGeneratedGame] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalAdded, setTotalAdded] = useState(0);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const processFiles = async (files) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);

    const promises = fileArray.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            
            // 🚀 SMART COMPRESSION: Width aur Height dono ko control karo
            const MAX_DIMENSION = 800; 
            let width = img.width;
            let height = img.height;
            
            if (width > height && width > MAX_DIMENSION) {
              height *= MAX_DIMENSION / width;
              width = MAX_DIMENSION;
            } else if (height > MAX_DIMENSION) {
              width *= MAX_DIMENSION / height;
              height = MAX_DIMENSION;
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // 🚀 WEBP format use karo (JPEG se bahut chota aur fast hota hai)
            resolve(canvas.toDataURL('image/webp', 0.6)); 
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    });

    const base64Images = await Promise.all(promises);
    setImages(prev => [...prev, ...base64Images]);
    setTotalAdded(prev => prev + base64Images.length);
  };

  const handleGenerate = async (imageList) => {
    if (!imageList || imageList.length === 0) return;

    setLoading(true);
    setStatus('📸 Photos scan ho rahi hain...');

    try {
      // STEP 1: Fast Library se text nikalna (Browser ke andar)
      const Tesseract = (await import('tesseract.js')).default;
      let combinedText = "";
      for (let i = 0; i < imageList.length; i++) {
        setStatus(`🔍 Fast Library: Photo ${i+1} padh rahi hai...`);
        const { data: { text } } = await Tesseract.recognize(imageList[i], 'eng');
        combinedText += `\n--- Photo ${i+1} ---\n${text}`;
      }
      
      if (!combinedText.trim()) {
        throw new Error("Photo mein koi text nahi mila! Kripya saaf photo khinche.");
      }

      // STEP 2: Sirf Text ko AI ko bhejna (Super Fast)
      setStatus('🤖 AI game bana raha hai (Sirf 3-5 sec)...');
      const result = await generateGameFromScan(
        [], combinedText, 10, 'English', 'Mixed', [], 'quiz', ['quiz', 'truefalse']
      );
      
      if (result && result.error) {
        throw new Error(result.error);
      }
      
      setGeneratedGame(result);
      setStatus('✅ Game ban gaya!');
      setCompletedCount(totalAdded);
      setImages([]); // Queue clear karo
      
      // Save game for seekho page
      if (typeof window !== 'undefined') {
        localStorage.setItem('kidai_scanned_game', JSON.stringify(result));
      }

    } catch (error) {
      console.error("Game generation failed:", error.message);
      setStatus(`❌ Error: ${error.message || 'Kuch gadbad ho gayi'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes bounce-sm { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      
      <Header title="Smart Scanner 📸" />
      
      <div style={{ padding: '24px 16px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 10, animation: 'bounce-sm 2s infinite' }}>📸</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Homework to <span style={{ color: C.orange }}>Game!</span></h1>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 30, lineHeight: 1.5 }}>
          Apni school book, drawing, ya worksheet ki photo dalo aur Arya AI usse mazedar game bana dega.
        </p>

        <input
          type="file" accept="image/*" capture="environment"
          ref={cameraInputRef} style={{ display: 'none' }}
          onChange={(e) => { processFiles(e.target.files); e.target.value = ''; }}
        />
        <input
          type="file" accept="image/*" multiple
          ref={fileInputRef} style={{ display: 'none' }}
          onChange={(e) => { processFiles(e.target.files); e.target.value = ''; }}
        />

        {totalAdded === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button
              onClick={() => cameraInputRef.current.click()}
              style={{
                background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`,
                color: '#fff', border: 'none', padding: '16px', borderRadius: 16,
                fontSize: 16, fontWeight: 800, cursor: 'pointer',
                boxShadow: `0 4px 20px ${C.orange}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
              }}>
              <span style={{ fontSize: 20 }}>📷</span> Camera se Photo Lo
            </button>
            <button
              onClick={() => fileInputRef.current.click()}
              style={{
                background: C.card2, color: C.text, border: `2px solid ${C.border}`,
                padding: '16px', borderRadius: 16, fontSize: 15, fontWeight: 800,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
              }}>
              <span style={{ fontSize: 20 }}>🖼️</span> Gallery se Select Karo
            </button>
          </div>
        ) : (
          <div style={{
            background: C.card, padding: 16, borderRadius: 20,
            border: `1px solid ${C.border}`, animation: 'slideUp 0.3s ease'
          }}>
            {/* Progress Counters */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div style={{ background: C.card2, padding: '12px 8px', borderRadius: 12, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: C.orange }}>{totalAdded}</div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>📸 Total</div>
              </div>
              <div style={{ background: C.card2, padding: '12px 8px', borderRadius: 12, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: C.cyan }}>{images.length}</div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>⏳ Queue Mein</div>
              </div>
              <div style={{ background: C.card2, padding: '12px 8px', borderRadius: 12, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: C.green }}>{completedCount}</div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>✅ Bane</div>
              </div>
            </div>

            {images.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: images.length > 1 ? '1fr 1fr' : '1fr',
                gap: 10, marginBottom: 16
              }}>
                {images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img
                      src={img} alt={`Scanned ${idx}`}
                      style={{ width: '100%', borderRadius: 12, maxHeight: 150, objectFit: 'cover', border: `1px solid ${C.border}` }}
                    />
                    {!loading && (
                      <button
                        onClick={() => {
                          setImages(images.filter((_, i) => i !== idx));
                          setTotalAdded(prev => prev - 1);
                        }}
                        style={{
                          position: 'absolute', top: -5, right: -5,
                          background: '#ef4444', color: '#fff', border: 'none',
                          borderRadius: '50%', width: 26, height: 26,
                          cursor: 'pointer', fontWeight: 'bold', fontSize: 14
                        }}>×</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {loading ? (
              <div style={{ padding: '10px 0 20px' }}>
                <div style={{ fontSize: 40, animation: 'spin 1.5s linear infinite', marginBottom: 12, display: 'inline-block' }}>⚙️</div>
                <div style={{ color: C.cyan, fontWeight: 800, fontSize: 15 }}>{status}</div>
                <p style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>
                  Kripya screen band na karein (15-20s)...
                </p>
              </div>
            ) : completedCount > 0 ? (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
                <div style={{ color: C.green, fontWeight: 800, fontSize: 18, marginBottom: 16 }}>
                  Game ban gaya!
                </div>
                <button
                  onClick={() => router.push('/seekho')}
                  style={{
                    background: `linear-gradient(135deg, ${C.green}, ${C.cyan})`,
                    color: '#fff', border: 'none', padding: '14px 24px',
                    borderRadius: 12, fontSize: 15, fontWeight: 800,
                    cursor: 'pointer', width: '100%', marginBottom: 10
                  }}>
                  🎮 Ab Game Khelo!
                </button>
                <button
                  onClick={() => { setImages([]); setGeneratedGame(null); setStatus(''); setTotalAdded(0); setCompletedCount(0); }}
                  style={{
                    background: 'transparent', color: C.muted,
                    border: `1px solid ${C.border}`, padding: '10px',
                    borderRadius: 8, cursor: 'pointer', width: '100%', fontSize: 13
                  }}>
                  🔄 Naya Scan Karo
                </button>
              </div>
            ) : images.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button
                  onClick={() => handleGenerate(images)}
                  style={{
                    background: `linear-gradient(135deg, ${C.green}, ${C.cyan})`,
                    color: '#fff', border: 'none', padding: '16px',
                    borderRadius: 12, fontSize: 16, fontWeight: 800,
                    cursor: 'pointer', boxShadow: `0 4px 15px ${C.green}44`
                  }}>
                  ✨ {images.length} Photos ka Game Banao!
                </button>
                
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => cameraInputRef.current.click()}
                    style={{
                      flex: 1, padding: '10px', background: C.card2,
                      border: `1px solid ${C.border}`, color: C.text,
                      borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13
                    }}>📷 Aur Jodo</button>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    style={{
                      flex: 1, padding: '10px', background: C.card2,
                      border: `1px solid ${C.border}`, color: C.text,
                      borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13
                    }}>🖼️ Gallery</button>
                  <button
                    onClick={() => { setImages([]); setTotalAdded(0); setCompletedCount(0); }}
                    style={{
                      flex: 1, padding: '10px', background: 'transparent',
                      border: `1px solid #ef444466`, color: '#ef4444',
                      borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13
                    }}>🗑️ Clear</button>
                </div>
              </div>
            ) : null
            }
          </div>
        )}
      </div>
    </div>
  );
}