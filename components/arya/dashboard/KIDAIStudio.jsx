 "use client";

import React from "react";
import Card from "@/components/ui/Card";

export default function KidAIStudio() {
  return (
    <div style={{ padding: "20px" }}>
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#06b6d4" }}>
            Arya & KidAI Studio Dashboard 🚀
          </h1>
          <p style={{ color: "#f1f5f9" }}>
            Tera learning dashboard yahan display hoga. Arya engine ready hai!
          </p>
          
          {/* DIRECT LINK TO GAMES LIBRARY */}
          <button onClick={() => window.location.href='/library'} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #10b981, #059669)", border: "none", borderRadius: "12px", color: "#fff", fontWeight: "800", fontSize: "16px", cursor: "pointer", marginTop: "20px", boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)" }}>
            🎮 20+ Fun Games Library Kholo!
          </button>

        </div>
      </Card>
    </div>
  );
}