"use client";

import { useState } from "react";
import Link from "next/link";
import { generateGameFromScan } from "@/lib/arya/arya-engine";

const T = {
  bg: "#07090f", card: "#0f1520", card2: "#161e30", border: "#1e2d45",
  orange: "#ff6b35", purple: "#7c3aed", cyan: "#06b6d4", green: "#10b981",
  yellow: "#f59e0b", pink: "#ec4899", text: "#f1f5f9", muted: "#64748b"
};

export default function ScannerPage() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gameData, setGameData] = useState(null);

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result); // Base64 image
    };
    reader.readAsDataURL(file);
  };

  const generateGame = async () => {
    if (!image) return;
    setLoading(true);
    try {
      // "data:image/jpeg;base64," prefix ko hatana zaroori hai Gemini API ke liye
      const base64Data = image.split(",")[1];
      const data = await generateGameFromScan(base64Data, 10, "Science");
      setGameData(data);
    } catch (err) {
      console.error(err);
      alert("Arya game nahi bana payi, photo clear nahi thi shayad! 😔");
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: T.bg, color: T.text, minHeight: "100vh", maxWidth: 500, margin: "0 auto", paddingBottom: 100 }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(7,9,15,.97)", borderBottom: `1px solid ${T.border}`, padding: "0 14px", height: 52, display: "flex", alignItems: "center", gap: 10 }}>
        <Link href="/home" style={{ color: T.muted, fontSize: 20, textDecoration: "none" }}>←</Link>
        <span style={{ fontWeight: 800, fontSize: 16 }}>Magical <span style={{ color: T.cyan }}>Scanner</span> 📸</span>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🤖</div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Apni book scan karo!</h2>
          <p style={{ fontSize: 13, color: T.muted, marginBottom: 20 }}>
            Arya tumhari book ki photo dekh kar mast game banayegi!
          </p>
          
          {/* Hidden file input jo directly camera ya gallery open karega */}
          <label style={{ display: "inline-block", background: `linear-gradient(135deg, ${T.purple}, ${T.pink})`, padding: "12px 24px", borderRadius: 12, fontWeight: 800, cursor: "pointer", boxShadow: `0 4px 12px ${T.purple}40` }}>
            📸 Camera Kholo
            <input type="file" accept="image/*" capture="environment" onChange={handleCapture} style={{ display: "none" }} />
          </label>
        </div>

        {image && !gameData && (
          <div style={{ animation: "slideIn 0.3s ease" }}>
            <img src={image} alt="Scanned" style={{ width: "100%", borderRadius: 12, border: `2px solid ${T.border}`, marginBottom: 16 }} />
            <button onClick={generateGame} disabled={loading} style={{ width: "100%", background: T.green, color: "#fff", padding: 14, borderRadius: 12, border: "none", fontWeight: 800, fontSize: 16, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Arya Dimaag Laga Rahi Hai... 🧠⏳" : "🪄 Game Banao!"}
            </button>
          </div>
        )}

        {gameData && (
          <div style={{ background: T.card2, border: `2px solid ${T.green}`, borderRadius: 16, padding: 16, animation: "slideIn 0.5s ease" }}>
            <div style={{ fontSize: 40, textAlign: "center", marginBottom: 10 }}>🎉</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: T.green, textAlign: "center", marginBottom: 16 }}>Game Ready Hai!</h3>
            
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>{gameData.gameTitle || "New AI Game"}</div>
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>Reward: {gameData.reward || "100 XP"}</div>

            {gameData.questions?.map((q, i) => (
              <div key={i} style={{ background: T.bg, padding: 12, borderRadius: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{q.emoji} {q.gameQ || q.q}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {q.opts?.map((opt, j) => (
                    <div key={j} style={{ background: T.card, padding: 8, borderRadius: 8, fontSize: 12, border: `1px solid ${j === q.correct ? T.green : T.border}` }}>
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <button style={{ width: "100%", background: `linear-gradient(135deg, ${T.orange}, ${T.pink})`, padding: 14, borderRadius: 12, border: "none", color: "#fff", fontWeight: 800, fontSize: 16, marginTop: 10, cursor: "pointer" }}>
              🎮 Khelna Shuru Karo!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}