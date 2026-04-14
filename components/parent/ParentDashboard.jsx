"use client";
import { useState } from "react";
import ProgressChart from "./ProgressChart";
import AIInsights from "./AIInsights";
import SubjectBars from "./SubjectBars";

const C = { card2: "#161e30", border: "#1e2d45", purple: "#7c3aed", muted: "#64748b" };

export default function ParentDashboard() {
  const [tab, setTab] = useState("overview");

  const TABS = [
    { id: "overview", label: "Overview", emoji: "📊" },
    { id: "insights", label: "AI Insights", emoji: "🤖" },
    { id: "subjects", label: "Subjects", emoji: "📚" }
  ];

  return (
    <div style={{ animation: "slideUp .3s ease" }}>
      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${tab === t.id ? C.purple : C.border}`,
            background: tab === t.id ? C.purple + "22" : C.card2, color: tab === t.id ? C.purple : C.muted,
            fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0
          }}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tab === "overview" && <ProgressChart />}
        {tab === "insights" && <AIInsights />}
        {tab === "subjects" && <SubjectBars />}
      </div>
    </div>
  );
}