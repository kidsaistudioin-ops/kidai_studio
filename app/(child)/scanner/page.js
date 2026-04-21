'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { generateGameFromScan } from '@/lib/arya/arya-engine';
import Header from '@/components/ui/Header';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  text: '#f1f5f9', muted: '#64748b'
};

export default function ScannerPage() {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  // Hidden file inputs ke refs
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // 📸 Image ko Compress karna (Taaki API jaldi chale aur size bada na ho)
  const processFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // Image ko max 800px width par set karenge
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Compress karke base64 string banana
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        setImage(base64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // 🚀 AI se Game Generate karwana
  const handleGenerate = async () => {
    if (!image) return;
    setLoading(true);
    setStatus('AI aapki photo ko padh raha hai... 🕵️‍♀️');
    
    try {
      // Engine se generation start
      setStatus('Naye Games ban rahe hain... 🎮✨');
      
      // Note: Hum parameters bhej rahe hain (age 10, Mixed subject, etc.)
      const gameData = await generateGameFromScan(image, 10, 'English', 'Mixed', [], 'quiz', ['quiz', 'truefalse']);
      
      setStatus('Game Ready! Save ho raha hai... 💾');
      
      // Game ko local memory me save kar rahe hain taaki "Seekho" page isko padh sake
      localStorage.setItem('kidai_scanned_game', JSON.stringify(gameData));
      
      // ✅ Seedha Seekho page par redirect
      router.push('/seekho');
      
    } catch (error) {
      console.error("Scanner Error:", error);
      alert("Oops! Game banane me thodi problem aayi. Dusri clear photo try karein! 🔌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes bounce-sm { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
      
      <Header title="Smart Scanner 📸" />
      
      <div style={{ padding: '24px 16px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 10, animation: 'bounce-sm 2s infinite' }}>📸</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Homework to <span style={{ color: C.orange }}>Game!</span></h1>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 30, lineHeight: 1.5 }}>
          Apni school book, drawing, ya worksheet ki photo dalo aur Arya AI usse mazedar game bana dega.
        </p>

        {!image ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} style={{ display: 'none' }} onChange={(e) => processFile(e.target.files[0])} />
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => processFile(e.target.files[0])} />

            <button onClick={() => cameraInputRef.current.click()} style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`, color: '#fff', border: 'none', padding: '16px', borderRadius: 16, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: `0 4px 20px ${C.orange}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>📷</span> Camera se Photo Lo
            </button>
            <button onClick={() => fileInputRef.current.click()} style={{ background: C.card2, color: C.text, border: `2px solid ${C.border}`, padding: '16px', borderRadius: 16, fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>🖼️</span> Gallery se Select Karo
            </button>
          </div>
        ) : (
          <div style={{ background: C.card, padding: 16, borderRadius: 20, border: `1px solid ${C.border}`, animation: 'slideUp 0.3s ease' }}>
            <img src={image} alt="Scanned" style={{ width: '100%', borderRadius: 12, marginBottom: 16, maxHeight: 300, objectFit: 'cover' }} />
            {loading ? (
              <div style={{ padding: '10px 0 20px' }}>
                <div style={{ fontSize: 40, animation: 'spin 1.5s linear infinite', marginBottom: 12, display: 'inline-block' }}>⚙️</div>
                <div style={{ color: C.cyan, fontWeight: 800, fontSize: 15 }}>{status}</div>
                <p style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>Kripya screen band na karein (10-15s)...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setImage(null)} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 12, fontWeight: 800, cursor: 'pointer', fontSize: 14 }}>❌ Cancel</button>
                <button onClick={handleGenerate} style={{ flex: 2, padding: '12px', background: C.green, border: 'none', color: '#000', borderRadius: 12, fontWeight: 900, cursor: 'pointer', fontSize: 15 }}>✨ Generate Game</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}