"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";

const T = {
  bg: "#07090f", card: "#0f1520", card2: "#161e30", border: "#1e2d45",
  orange: "#ff6b35", purple: "#7c3aed", cyan: "#06b6d4", green: "#10b981",
  yellow: "#f59e0b", pink: "#ec4899", text: "#f1f5f9", muted: "#64748b", neon: "#e0ff44"
};

function SkillBar({ name, pct, color }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
        <span>{name}</span><span style={{ color }}>{pct}%</span>
      </div>
      <div style={{ height: 10, background: T.border, borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, borderRadius: 99,
          background: `linear-gradient(90deg,${color},${color}88)`,
          transition: "width 1.2s ease"
        }} />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [currentAge, setCurrentAge] = useState("10-13");
  const xp = 150;

  const [name, setName] = useState("Arjun");
  const [avatar, setAvatar] = useState("😊");
  const [customPhoto, setCustomPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const AVATARS = ["😊", "😎", "🤓", "🚀", "🦄", "🦁", "🤖", "🌟"];
  
  // Mock data based on behavior tracking
  const behavior = {
    timeSpent: { games: 45, chat: 20 },
    mistakes: { "math-match": 2 }
  };
  const savedGames = [1, 2]; // 2 saved games mock

  const skills = [
    { name: "🔢 Mathematics", pct: 75, color: T.cyan },
    { name: "📝 English", pct: 60, color: T.green },
    { name: "🎮 Game Design", pct: 85, color: T.orange },
    { name: "🤖 AI Understanding", pct: 50, color: T.purple },
  ];

  const getInsight = () => {
    return `Tum <b style="color:${T.cyan}">Maths</b> mein bahut interest rakhte ho! <b style="color:${T.pink}">Word Hunt</b> mein thodi aur practice karo.`;
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomPhoto(imageUrl);
      setAvatar(null); // Clear emoji avatar
    }
  };

  // Profile save karne ka function (Baad mein isme Auth API call lagegi)
  const handleSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    
    setIsSaving(true);
    try {
      // Yahan api/auth ya api/profile/update API call aayegi future mein
      await new Promise(r => setTimeout(r, 600)); // Simulating network request
      setIsEditing(false);
    } catch (error) {
      console.error("Save failed", error);
    }
    setIsSaving(false);
  };

  return (
    <div style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif", background: T.bg, color: T.text, minHeight: "100vh", maxWidth: 500, margin: "0 auto", paddingBottom: 100 }}>
      
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(7,9,15,.97)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${T.border}`, padding: "0 14px", height: 52, display: "flex", alignItems: "center", gap: 10 }}>
        <Link href="/home" style={{ background: "none", border: "none", color: T.muted, fontSize: 20, cursor: "pointer", textDecoration: "none" }}>←</Link>
        <span style={{ fontWeight: 800, fontSize: 16 }}>My <span style={{color: T.orange}}>Profile</span></span>
      </div>

      <div style={{ padding: 16, animation: "slideIn .3s ease" }}>
        
        {/* Avatar Section */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: customPhoto ? `url(${customPhoto}) center/cover` : `linear-gradient(135deg,${T.cyan},${T.green})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0, overflow: 'hidden', border: customPhoto ? `2px solid ${T.cyan}` : 'none' }}>
            {!customPhoto && avatar}
          </div>
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                style={{ background: T.card2, border: `1px solid ${T.border}`, color: T.text, fontSize: 18, fontWeight: 800, padding: "4px 8px", borderRadius: 8, width: "100%", marginBottom: 4, outline: "none", fontFamily: "inherit" }}
              />
            ) : (
              <div style={{ fontWeight: 800, fontSize: 18 }}>{name}</div>
            )}
            <div style={{ fontSize: 12, color: T.muted }}>{currentAge} Saal</div>
            <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ background: T.green + "22", color: T.green, fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 700 }}>Math Genius 🔢</span>
              <span style={{ background: T.orange + "22", color: T.orange, fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 700 }}>Game Creator 🎮</span>
            </div>
          </div>
          <button onClick={handleSave} disabled={isSaving} style={{ background: T.card2, border: `1px solid ${T.border}`, color: T.text, padding: "8px 12px", borderRadius: 10, cursor: isSaving ? "not-allowed" : "pointer", fontWeight: 800, fontSize: 12, opacity: isSaving ? 0.7 : 1 }}>
            {isSaving ? "⏳ Saving..." : isEditing ? "💾 Save" : "✏️ Edit"}
          </button>
        </div>

        {/* Avatar Picker (only shows when editing) */}
        {isEditing && (
          <Card>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10 }}>Apna Naya Avatar Choose Karo:</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {AVATARS.map(a => (
                <button key={a} onClick={() => { setAvatar(a); setCustomPhoto(null); }} style={{ fontSize: 28, background: (avatar === a && !customPhoto) ? T.cyan+"33" : T.card2, border: `2px solid ${(avatar === a && !customPhoto) ? T.cyan : T.border}`, borderRadius: 16, padding: "8px 12px", cursor: "pointer", transition: "all .2s", transform: (avatar === a && !customPhoto) ? "scale(1.05)" : "scale(1)" }}>
                  {a}
                </button>
              ))}
            </div>
            
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
              <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handlePhotoUpload} />
              <button onClick={() => fileInputRef.current.click()} style={{ background: T.card2, color: T.text, border: `1px dashed ${T.cyan}`, borderRadius: 12, padding: "10px 14px", fontSize: 13, fontWeight: 800, cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                📸 Upload Apna Photo
              </button>
            </div>
          </Card>
        )}

        {/* AI Insight */}
        <div style={{ background: `linear-gradient(135deg,#1a1f3a,#111827)`, border: `1px solid ${T.purple}`, borderRadius: 16, padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: T.purple, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>🤖 Arya Ka Observation</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: getInsight() }} />
        </div>

        {/* Skills */}
        <Card>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14 }}>📊 Tumhari Skills</div>
          {skills.map(s => <SkillBar key={s.name} {...s} />)}
        </Card>

        {/* Time tracker */}
        <Card>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14 }}>⏱ Time Tracker</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              ["🎮", `${behavior.timeSpent.games}`, "min Games mein", T.orange],
              ["🤖", `${behavior.timeSpent.chat}`, "min Arya se", T.cyan],
              ["🔥", "5", "Din ka Streak", T.yellow],
              ["⚡", `${xp}`, "Total XP", T.purple],
            ].map(([icon, val, label, color]) => (
              <div key={label} style={{ background: T.card2, borderRadius: 14, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 22 }}>{icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color }}>{val}</div>
                <div style={{ fontSize: 10, color: T.muted }}>{label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Badges */}
        <Card>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14 }}>🏅 Badges</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {[
              ["🎮", "Game Maker", savedGames.length > 0],
              ["🔢", "Math Star", true],
              ["📝", "Word Wizard", false],
              ["🤖", "AI Expert", true],
              ["🔥", "5-Day Streak", true],
              ["💬", "Chatter", true],
              ["🌟", "Explorer", xp > 50],
              ["🚀", "Launcher", xp > 200],
            ].map(([icon, name, earned]) => (
              <div key={name} style={{
                background: T.card2, border: `1px solid ${earned ? T.yellow : T.border}`,
                borderRadius: 14, padding: "12px 8px", textAlign: "center",
                opacity: earned ? 1 : 0.4, filter: earned ? "none" : "grayscale(1)"
              }}>
                <div style={{ fontSize: 28 }}>{icon}</div>
                <div style={{ fontSize: 10, color: earned ? T.yellow : T.muted, marginTop: 4, fontWeight: 700 }}>{name}</div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}