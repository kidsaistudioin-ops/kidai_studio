'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { playCorrectSound, playStreakChime, playMovePieceSound } from '@/lib/audio/sound-engine';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  yellow: '#f59e0b', pink: '#ec4899', red: '#ef4444', text: '#f1f5f9', muted: '#64748b'
};

export default function MagicScannerPage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [processedImg, setProcessedImg] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [threshold, setThreshold] = useState(195);
  const [contrast, setContrast] = useState(120);
  const [stickerName, setStickerName] = useState('My Magic Drawing');
  const [toastMsg, setToastMsg] = useState('');

  // Start Camera (Supports Laptop Webcams & Mobile Cameras)
  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(s);
      setCameraActive(true);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(fallbackStream);
        setCameraActive(true);
        if (videoRef.current) videoRef.current.srcObject = fallbackStream;
      } catch(e) {
        console.warn("Camera not available, fallback to upload", e);
        setCameraActive(false);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Capture from live camera
  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    try { playMovePieceSound(); } catch(e) {}

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/png');
    setRawImage(dataUrl);
    stopCamera();
    applyBackgroundRemoval(dataUrl, threshold, contrast);
  };

  // Handle image upload from computer
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { playMovePieceSound(); } catch(e) {}

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setRawImage(dataUrl);
      stopCamera();
      applyBackgroundRemoval(dataUrl, threshold, contrast);
    };
    reader.readAsDataURL(file);
  };

  // Advanced Paper Chroma Key / Background Removal
  const applyBackgroundRemoval = (imageSrc, threshVal, contrastVal) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      // Draw initial
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const contrastFactor = (259 * (contrastVal + 255)) / (255 * (259 - contrastVal));

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Apply contrast
        r = Math.min(255, Math.max(0, contrastFactor * (r - 128) + 128));
        g = Math.min(255, Math.max(0, contrastFactor * (g - 128) + 128));
        b = Math.min(255, Math.max(0, contrastFactor * (b - 128) + 128));

        // Brightness check for paper background removal
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114);

        if (brightness > threshVal) {
          // Transparent background
          data[i + 3] = 0;
        } else {
          // Clean up drawing lines
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const transparentPng = canvas.toDataURL('image/png');
      setProcessedImg(transparentPng);
      setIsProcessing(false);
      try { playCorrectSound(); } catch(e) {}
    };
    img.src = imageSrc;
  };

  // Slider change handler
  const handleThresholdChange = (val) => {
    setThreshold(val);
    if (rawImage) applyBackgroundRemoval(rawImage, val, contrast);
  };

  const handleContrastChange = (val) => {
    setContrast(val);
    if (rawImage) applyBackgroundRemoval(rawImage, threshold, val);
  };

  // Save to Library & Download
  const handleSaveAndDownload = () => {
    if (!processedImg) return;
    try { playStreakChime(); } catch(e) {}

    const existing = JSON.parse(localStorage.getItem('kidai_studio_creations') || '[]');
    const newCreation = {
      id: Date.now().toString(),
      title: stickerName || 'Magic Scanned Sticker',
      type: 'Sticker Asset',
      date: new Date().toLocaleDateString('en-IN'),
      preview: processedImg
    };
    existing.unshift(newCreation);
    localStorage.setItem('kidai_studio_creations', JSON.stringify(existing.slice(0, 20)));

    const link = document.createElement('a');
    link.download = `KidAI-Sticker-${Date.now()}.png`;
    link.href = processedImg;
    link.click();

    showToast('🎉 Sticker Saved to Studio Library & Downloaded!');
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif", paddingBottom: 60 }}>
      
      {/* Toast Alert */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: C.green, color: '#000', padding: '12px 24px', borderRadius: 14, fontWeight: 900, fontSize: 14, zIndex: 1000, boxShadow: '0 8px 30px rgba(16,185,129,0.5)' }}>
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(7,9,15,.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/studio')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 22 }}>←</button>
          <span>Magic Scanner & <span style={{ color: C.green }}>Sticker Maker</span> 📸</span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => router.push('/studio/library')} style={{ background: C.card2, color: C.text, border: `1px solid ${C.border}`, padding: '8px 14px', borderRadius: 10, fontWeight: 800, cursor: 'pointer', fontSize: 13 }}>
            📁 My Library
          </button>
          {processedImg && (
            <button onClick={handleSaveAndDownload} style={{ background: `linear-gradient(135deg, ${C.green}, #059669)`, color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 10, fontWeight: 900, cursor: 'pointer', fontSize: 13, boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>
              💾 Save & Download
            </button>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        
        {/* Intro */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, marginBottom: 8 }}>
            Kagaz Ki Drawing Ko <span style={{ color: C.green }}>Digital Transparent Sticker</span> Banao! ✨
          </h1>
          <p style={{ color: C.muted, fontSize: 15, maxWidth: 600, margin: '0 auto' }}>
            White paper par drawing karke camera se photo lo ya upload karo. AI paper ka white background gayab kar dega!
          </p>
        </div>

        {/* ── WORKSTATION DUAL-COLUMN GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
          
          {/* LEFT: INPUT CAMERA / UPLOADER */}
          <div style={{ background: C.card, padding: 24, borderRadius: 24, border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 900, fontSize: 16, color: C.cyan }}>1. Capture Drawing</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ background: C.card2, color: C.text, border: `1px solid ${C.border}`, padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
                >
                  📁 Upload Photo
                </button>
                {!cameraActive && (
                  <button 
                    onClick={startCamera}
                    style={{ background: C.green+'22', color: C.green, border: `1px solid ${C.green}44`, padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
                  >
                    📷 Open Camera
                  </button>
                )}
              </div>
            </div>

            {/* Video / Captured Image Container */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: '#000', borderRadius: 18, overflow: 'hidden', border: `2px dashed ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cameraActive ? (
                <>
                  <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    onClick={capturePhoto}
                    title="Click Photo"
                    style={{ position: 'absolute', bottom: 16, width: 64, height: 64, borderRadius: '50%', background: C.green, border: '4px solid #fff', cursor: 'pointer', boxShadow: '0 0 20px rgba(16,185,129,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}
                  >
                    📸
                  </button>
                </>
              ) : rawImage ? (
                <img src={rawImage} alt="Raw drawing" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <div style={{ fontSize: 48, marginBottom: 10 }}>📄</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: C.text }}>Drawing Upload Karein</div>
                  <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>Camera on karein ya image file select karein</div>
                </div>
              )}
            </div>

            {rawImage && (
              <button 
                onClick={() => { setRawImage(null); setProcessedImg(null); startCamera(); }}
                style={{ width: '100%', marginTop: 14, padding: '10px', background: C.card2, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}
              >
                🔄 Retake Photo / Upload New
              </button>
            )}
          </div>

          {/* RIGHT: PROCESSED TRANSPARENT STICKER & ADJUSTMENT CONTROLS */}
          <div style={{ background: C.card, padding: 24, borderRadius: 24, border: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 900, fontSize: 16, color: C.green, marginBottom: 16 }}>
              2. Magic Transparent Sticker Result
            </div>

            {/* Checkerboard Canvas Display */}
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              aspectRatio: '4/3', 
              borderRadius: 18, 
              background: 'repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%) 50% / 20px 20px', 
              border: `2px solid ${C.border}`,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {isProcessing ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <div style={{ fontSize: 48, animation: 'bounce 1s infinite' }}>✨</div>
                  <div style={{ fontWeight: 900, color: C.cyan, marginTop: 10 }}>AI Magic Background Removal...</div>
                </div>
              ) : processedImg ? (
                <img src={processedImg} alt="Transparent Sticker" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.8))' }} />
              ) : (
                <div style={{ textAlign: 'center', padding: 20, color: C.muted }}>
                  <div style={{ fontSize: 44, marginBottom: 8 }}>✨</div>
                  <div>Photo click karte hi transparent sticker yahan dikhega!</div>
                </div>
              )}
            </div>

            {/* Fine-Tuning Controls */}
            {processedImg && (
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800, color: C.cyan, marginBottom: 6 }}>
                    <span>Background Cut Sensitivity:</span>
                    <span>{threshold}</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="240" 
                    value={threshold} 
                    onChange={e => handleThresholdChange(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: C.cyan }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800, color: C.orange, marginBottom: 6 }}>
                    <span>Ink Line Contrast / Sharpness:</span>
                    <span>{contrast}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="200" 
                    value={contrast} 
                    onChange={e => handleContrastChange(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: C.orange }}
                  />
                </div>

                <div style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: C.muted, marginBottom: 6 }}>STICKER TITLE:</div>
                  <input 
                    value={stickerName} 
                    onChange={e => setStickerName(e.target.value)} 
                    placeholder="e.g. My Superhero Lion" 
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: C.card2, border: `1px solid ${C.border}`, color: '#fff', fontWeight: 800, outline: 'none' }}
                  />
                </div>

                <button 
                  onClick={handleSaveAndDownload}
                  style={{ width: '100%', padding: '14px', background: `linear-gradient(135deg, ${C.green}, #059669)`, border: 'none', borderRadius: 12, color: '#fff', fontWeight: 900, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.3)', marginTop: 8 }}
                >
                  🎉 Save to Studio Library & Download Sticker
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}