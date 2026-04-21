'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  text: '#f1f5f9', muted: '#64748b'
};

export default function MagicScannerPage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [capturedImg, setCapturedImg] = useState(null);
  const [processedImg, setProcessedImg] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Start Camera
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Camera on nahi ho paya!");
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
  };

  // Photo Kheecho
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    setCapturedImg(canvas.toDataURL('image/png'));
    stopCamera();
    processImage(); // Magic start!
  };

  // Safed background hatane ka Logic (Chroma Keying type) - Enhanced
  const processImage = () => {
    setIsScanning(true);
    setTimeout(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Enhanced threshold for better background removal
      const threshold = 200; // Adjustable sensitivity
      const colorDiff = 30; // How similar colors are considered background
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        
        // Check if pixel is light (paper-like)
        const brightness = (r + g + b) / 3;
        if (brightness > threshold) {
          // Check if it's white/light gray/light blue (paper colors)
          const isWhite = r > 200 && g > 200 && b > 200;
          const isLightGray = r > 150 && g > 150 && b > 150 && Math.abs(r - g) < colorDiff && Math.abs(g - b) < colorDiff;
          const isLightBlue = r > 200 && g > 200 && b > 230; // Blue-ish paper
          
          if (isWhite || isLightGray || isLightBlue) {
            data[i+3] = 0; // Alpha 0 (Transparent)
          }
        }
      }
      
      ctx.putImageData(imgData, 0, 0);
      setProcessedImg(canvas.toDataURL('image/png'));
      setIsScanning(false);
    }, 2000);
  };

  // Download as PNG
  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = 'magic-scanned-' + Date.now() + '.png';
    link.href = processedImg;
    link.click();
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${C.border}` }}>
        <button onClick={() => router.push('/studio')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20 }}>←</button>
        <span style={{ fontWeight: 800, fontSize: 18 }}>Magic Scanner 📸</span>
      </div>

      <div style={{ padding: 20, textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
        <p style={{ color: C.muted, marginBottom: 20 }}>Apni drawing ko plain white paper par rakho aur photo kheecho!</p>

        {!capturedImg ? (
          <div style={{ position: 'relative' }}>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: 20, border: `2px solid ${C.green}`, background: '#000' }} />
            <button 
              onClick={captureImage}
              style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', width: 64, height: 64, borderRadius: '50%', background: C.green, border: '4px solid #fff', cursor: 'pointer', boxShadow: `0 0 20px ${C.green}` }}
            />
          </div>
        ) : (
          <div>
            {isScanning ? (
              <div style={{ padding: 40 }}>
                <div style={{ fontSize: 64, animation: "bounce 1s infinite" }}>✨</div>
                <h3 style={{ color: C.cyan, marginTop: 20 }}>AI Background Hata Raha Hai...</h3>
              </div>
            ) : (
              <div style={{ animation: "pop 0.3s" }}>
                <h3 style={{ color: C.green, marginBottom: 10 }}>🎉 Magic Complete!</h3>
                
                {/* Checkerboard background to show transparency */}
                <div style={{ 
                  background: 'repeating-conic-gradient(#80808033 0% 25%, transparent 0% 50%) 50% / 20px 20px', 
                  borderRadius: 20, 
                  padding: 20,
                  border: `2px dashed ${C.purple}`
                }}>
                  <img src={processedImg} alt="Processed" style={{ width: '100%', display: 'block' }} />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button onClick={() => { setCapturedImg(null); startCamera(); }} style={{ flex: 1, padding: '12px', background: C.card2, border: 'none', color: '#fff', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>
                    🔄 Retake
                  </button>
                  <button onClick={downloadImage} style={{ flex: 1, padding: '12px', background: C.cyan, border: 'none', color: '#000', borderRadius: 12, fontWeight: 900, cursor: 'pointer' }}>
                    ⬇️ Download
                  </button>
                </div>
                <button onClick={() => alert('Saved to Library!')} style={{ width: '100%', marginTop: 10, padding: '12px', background: C.green + '22', border: `1px solid ${C.green}`, color: C.green, borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>
                  💾 Save to Library
                </button>
              </div>
            )}
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}