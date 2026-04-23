'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateGameFromScan } from '@/lib/arya/arya-engine';
import Header from '@/components/ui/Header';
import Tesseract from 'tesseract.js';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  text: '#f1f5f9', muted: '#64748b'
};

export default function ScannerPage() {
  const router = useRouter();
  
  // Naye Queue aur Counter States
  const [queue, setQueue] = useState([]); // Jo images line me hain
  const [totalAdded, setTotalAdded] = useState(0); // Lifetime counter
  const [completed, setCompleted] = useState(0); // Kitne games ban gaye
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  
  // Hidden file inputs ke refs
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // 📸 Images ko Compress karna aur Queue me daalna
  const processFiles = async (files) => {
    if (!files || files.length === 0) return;
    
    // Ab user kitni bhi files select kar sakta hai
    const fileArray = Array.from(files);

    const promises = fileArray.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    });

    const base64Images = await Promise.all(promises);
    
    setQueue(prev => [...prev, ...base64Images]);
    setTotalAdded(prev => prev + base64Images.length);
  };

  // 🚀 BACKGROUND AUTO-PROCESSOR (Jaise hi queue me photo aayegi, ye chal padega)
  useEffect(() => {
    if (queue.length > 0 && !isProcessing) {
      processNextBatch();
    }
  }, [queue, isProcessing]);

  const processNextBatch = async () => {
    setIsProcessing(true);
    
    // Server overload se bachne ke liye ek baar mein 3-5 images hi AI ko bhejte hain
    const batchSize = Math.min(queue.length, 3); 
    const currentBatch = queue.slice(0, batchSize);

    try {
      setStatus(`⏳ ${batchSize} Photos padhi ja rahi hain... (AI Vision)`);
      
      // Try 1: AI Vision Model se generate karna
      await generateGameFromScan(currentBatch, "", 10, 'English', 'Mixed', [], 'quiz', ['quiz', 'truefalse']); 
      
      // Success: Screen se un photos ko hata do jo process ho chuki hain
      setQueue(prev => prev.slice(batchSize));
      setCompleted(prev => prev + batchSize);
      setStatus(`✅ ${batchSize} Games successfully ban gaye!`);
      
    } catch (error) {
      console.log("AI Vision failed, trying OCR...", error);
      setStatus(`⚠️ AI Vision overload! Free OCR text nikal rahi hai...`);
      
      try {
        // Try 2: Tesseract Library Fallback (Bina AI ke text extract karna, Zero Cost)
        let combinedText = "";
        for (let i = 0; i < currentBatch.length; i++) {
          const { data } = await Tesseract.recognize(currentBatch[i], 'eng');
          combinedText += `\n--- Image ${i+1} ---\n${data.text}`;
        }

        // Tesseract ka text identify karne ke liye label lagaya
        const fallbackText = `[TESSERACT OCR LIBRARY NE YE TEXT NIKALA HAI]\nNiche diye gaye text se bacche ke liye mazedar game banao:\n${combinedText}`;
        
        setStatus(`🧠 OCR ne text nikal liya. Ab games ban rahe hain...`);
        
        // Empty array [] bhej rahe hain taaki AI Vision model ki jagah sasta Text model chal jaye
        await generateGameFromScan([], fallbackText, 10, 'English', 'Mixed', [], 'quiz', ['quiz', 'truefalse']);
        
        // Success after Fallback
        setQueue(prev => prev.slice(batchSize));
        setCompleted(prev => prev + batchSize);
        setStatus(`✅ OCR ki madad se games ban gaye!`);
      } catch (fallbackError) {
        console.error("Dono methods fail ho gaye", fallbackError);
        setStatus(`❌ Ek batch fail ho gaya. Skip karke aage badh rahe hain...`);
        setQueue(prev => prev.slice(batchSize)); // Fail hua batch drop kar do taaki queue block na ho
      }
    }
    
    // Agla batch pick karne ke liye thoda sa delay dete hain
    setTimeout(() => {
      setIsProcessing(false);
    }, 1500);
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

        {images.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} style={{ display: 'none' }} onChange={(e) => { processFiles(e.target.files); e.target.value = ''; }} />
            <input type="file" accept="image/*" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => { processFiles(e.target.files); e.target.value = ''; }} />

            <button onClick={() => cameraInputRef.current.click()} style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`, color: '#fff', border: 'none', padding: '16px', borderRadius: 16, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: `0 4px 20px ${C.orange}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>📷</span> Camera se Photo Lo
            </button>
            <button onClick={() => fileInputRef.current.click()} style={{ background: C.card2, color: C.text, border: `2px solid ${C.border}`, padding: '16px', borderRadius: 16, fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>🖼️</span> Gallery se Select Karo
            </button>
          </div>
        ) : (
          <div style={{ background: C.card, padding: 16, borderRadius: 20, border: `1px solid ${C.border}`, animation: 'slideUp 0.3s ease' }}>
            <div style={{ marginBottom: 12, fontWeight: 800, color: C.cyan, fontSize: 18 }}>
              📸 Aapki Total Photos: {images.length}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: images.length > 1 ? '1fr 1fr' : '1fr', gap: 10, marginBottom: 16 }}>
              {images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={img} alt={`Scanned ${idx}`} style={{ width: '100%', borderRadius: 12, maxHeight: 150, objectFit: 'cover', border: `1px solid ${C.border}` }} />
                  {!loading && (
                    <button onClick={() => setImages(images.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                  )}
                </div>
              ))}
            </div>
            {loading ? (
              <div style={{ padding: '10px 0 20px' }}>
                <div style={{ fontSize: 40, animation: 'spin 1.5s linear infinite', marginBottom: 12, display: 'inline-block' }}>⚙️</div>
                <div style={{ color: C.cyan, fontWeight: 800, fontSize: 15 }}>{status}</div>
                <p style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>Kripya screen band na karein (10-15s)...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button onClick={() => handleGenerate(images)} style={{ background: `linear-gradient(135deg, ${C.green}, ${C.cyan})`, color: '#fff', border: 'none', padding: '16px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: `0 4px 15px ${C.green}44` }}>
                  ✨ {images.length} Photos ka Game Banao!
                </button>
                
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} style={{ display: 'none' }} onChange={(e) => { processFiles(e.target.files); e.target.value = ''; }} />
                  <input type="file" accept="image/*" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => { processFiles(e.target.files); e.target.value = ''; }} />
                  
                  <button onClick={() => cameraInputRef.current.click()} style={{ flex: 1, padding: '10px', background: C.card2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>📷 Aur Jodo</button>
                  <button onClick={() => fileInputRef.current.click()} style={{ flex: 1, padding: '10px', background: C.card2, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>🖼️ Gallery</button>
                  <button onClick={() => setImages([])} style={{ flex: 1, padding: '10px', background: 'transparent', border: `1px solid #ef444466`, color: '#ef4444', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>🗑️ Clear All</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}