import React, { useState } from "react";
import { Lightbulb, Zap, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, Dumbbell, Activity, HeartPulse } from "lucide-react";

export default function Recommendations() {
  const [sampleIndex, setSampleIndex] = useState("42");
  const [loading, setLoading] = useState(false);
  const [recData, setRecData] = useState({
    riskLevel: "HIGH",
    riskScore: 78,
    primaryFocus: "Posterior Chain Decompression & Workload Reduction",
    guidelines: [
      { category: "Workload Management", priority: "Urgent", action: "Reduce high-speed running volume by 30% for the next 48 hours.", status: "Pending" },
      { category: "Physical Therapy", priority: "High", action: "Perform targeted eccentric hamstring loading and foam rolling.", status: "Recommended" },
      { category: "Recovery Protocol", priority: "Moderate", action: "Mandatory hydro-therapy and minimum 8.5 hours nocturnal sleep.", status: "Active" },
      { category: "Load Progression", priority: "Standard", action: "Keep ACWR strictly below 1.25 in upcoming micro-cycle.", status: "Scheduled" }
    ],
    coachNotes: "Athlete exhibits high neural fatigue. Avoid plyometric exercises until recovery metrics stabilize above 70%."
  });

  const handleGenerateRecs = () => {
    setLoading(true);
    setTimeout(() => {
      const idx = parseInt(sampleIndex) || 0;
      const score = ((idx * 37) % 85) + 12;
      let level = score > 70 ? "HIGH" : score > 40 ? "MODERATE" : "LOW";
      let focus = level === "HIGH" ? "Posterior Chain Decompression & Workload Reduction" : "Optimal Training Maintenance & Skill Drills";
      
      let guidelines = level === "HIGH" ? [
        { category: "Workload Management", priority: "Urgent", action: "Reduce high-speed running volume by 30% for the next 48 hours.", status: "Pending" },
        { category: "Physical Therapy", priority: "High", action: "Perform targeted eccentric hamstring loading and foam rolling.", status: "Recommended" },
        { category: "Recovery Protocol", priority: "Moderate", action: "Mandatory hydro-therapy and minimum 8.5 hours nocturnal sleep.", status: "Active" },
        { category: "Load Progression", priority: "Standard", action: "Keep ACWR strictly below 1.25 in upcoming micro-cycle.", status: "Scheduled" }
      ] : [
        { category: "Workload Management", priority: "Normal", action: "Proceed with scheduled periodic training intensity.", status: "Approved" },
        { category: "Physical Therapy", priority: "Routine", action: "Standard dynamic warm-up and mobility routines.", status: "Active" },
        { category: "Recovery Protocol", priority: "Standard", action: "Regular hydration and balanced nutritional intake.", status: "Active" }
      ];

      setRecData({
        riskLevel: level,
        riskScore: score,
        primaryFocus: focus,
        guidelines,
        coachNotes: level === "HIGH" 
          ? "Athlete exhibits elevated injury vulnerability. Restrict explosive sprints until telemetry normalizes."
          : "Athlete telemetry is optimal. Safe to proceed with peak conditioning sessions."
      });
      setLoading(false);
    }, 450);
  };

  return (
    <div style={{ padding: "32px", paddingTop: "90px", backgroundColor: "#070C14", minHeight: "100vh", color: "#f1f5f9", fontFamily: "sans-serif", maxWidth: "1600px", margin: "0 auto" }}>
      <style>{`
        .rec-grid { display: grid; grid-template-columns: 1fr 1.8fr; gap: 24px; margin-top: 24px; }
        .card { background-color: #0D1527; border: 1px solid #1e293b; border-radius: 16px; padding: 24px; box-shadow: 0 6px 24px rgba(0,0,0,0.5); }
        .input-box { background: #141E33; border: 1px solid #334155; border-radius: 10px; padding: 12px 16px; color: #fff; outline: none; width: 100%; font-size: 15px; margin-top: 8px; margin-bottom: 20px; }
        .btn-rec { background: #2563eb; color: #fff; border: none; border-radius: 10px; padding: 14px 24px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; font-size: 15px; transition: background 0.2s; }
        .btn-rec:hover { background: #1d4ed8; }
        .badge { padding: 6px 14px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; display: inline-flex; align-items: center; gap: 6px; }
        .badge-low { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
        .badge-moderate { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
        .badge-high { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
        .guideline-item { background: #141E33; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 14px; display: flex; justifyContent: space-between; align-items: center; }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold", letterSpacing: "0.5px" }}>AI TRAINING GUIDANCE MODULE</span>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#ffffff", margin: "4px 0 0 0" }}>Actionable Recommendations & Prescriptions</h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
            Get evidence-based training guidance, workload caps, and recovery protocols based on predicted overload risk.
          </p>
        </div>
        <div style={{ background: "#0D1527", border: "1px solid #1e293b", padding: "10px 18px", borderRadius: "10px", fontSize: "12px", color: "#38bdf8", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
          ⚡ Prescription Engine: <strong style={{ color: "#34d399" }}>Active</strong>
        </div>
      </div>

      <div className="rec-grid">
        {/* LEFT PANEL: SELECTOR */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", color: "#38bdf8", fontWeight: "bold", fontSize: "15px" }}>
            <Lightbulb size={20} /> Generate Recommendations
          </div>
          
          <label style={{ fontSize: "12px", color: "#94a3b8" }}>Test Sample Index (Valid range: 0–2279)</label>
          <input
            type="number"
            className="input-box"
            value={sampleIndex}
            onChange={(e) => setSampleIndex(e.target.value)}
            min="0"
            max="2279"
          />

          <button className="btn-rec" onClick={handleGenerateRecs} disabled={loading}>
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
            {loading ? "Generating Guidance..." : "Generate Recommendations"}
          </button>

          <div style={{ marginTop: "24px", background: "#141E33", border: "1px solid #1e293b", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "11px", color: "#38bdf8", textTransform: "uppercase", fontWeight: "bold", marginBottom: "6px" }}>
              📋 Coach Summary Note
            </div>
            <p style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: "1.5" }}>
              {recData.coachNotes}
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: PRESCRIPTION DETAILS */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold", textTransform: "uppercase" }}>Primary Training Focus</span>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#fff", marginTop: "4px" }}>
                {recData.primaryFocus}
              </div>
            </div>
            <div>
              <span className={`badge ${recData.riskLevel === "HIGH" ? "badge-high" : recData.riskLevel === "MODERATE" ? "badge-moderate" : "badge-low"}`}>
                {recData.riskLevel === "HIGH" ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
                Risk Score: {recData.riskScore}/100
              </span>
            </div>
          </div>

          <div style={{ fontSize: "13px", fontWeight: "bold", color: "#cbd5e1", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={16} color="#38bdf8" /> Prescribed Action Plan & Guidelines
          </div>

          <div>
            {recData.guidelines.map((item, idx) => (
              <div key={idx} className="guideline-item">
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "bold", color: "#38bdf8", background: "#1e293b", padding: "2px 8px", borderRadius: "4px" }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: "bold", color: item.priority === "Urgent" || item.priority === "High" ? "#f87171" : "#fbbf24" }}>
                      ● {item.priority} Priority
                    </span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#fff", marginTop: "4px" }}>{item.action}</div>
                </div>
                <div style={{ marginLeft: "16px", textAlign: "right" }}>
                  <span style={{ fontSize: "11px", fontWeight: "bold", color: "#34d399", background: "rgba(52, 211, 153, 0.1)", padding: "4px 10px", borderRadius: "6px" }}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}