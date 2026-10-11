import React, { useState } from "react";
import { Sliders, Zap, RefreshCw, Activity, SlidersHorizontal, BarChart2, ShieldAlert, ShieldCheck } from "lucide-react";

export default function WhatIfSimulator() {
  const [sampleIndex, setSampleIndex] = useState("42");
  const [loadChange, setLoadChange] = useState(25); // Default +25% load change
  const [loading, setLoading] = useState(false);
  
  // Simulation Results State
  const [simData, setSimData] = useState({
    originalScore: 46,
    simulatedScore: 56,
    originalRisk: "MODERATE",
    simulatedRisk: "MODERATE",
    deltaRisk: "+9%",
    recommendation: "Workload increase of +25% remains within manageable athlete threshold.",
    metrics: {
      sprintLoad: { orig: 55, sim: 68 },
      fatigueIndex: { orig: 42, sim: 54 },
      recoveryRate: { orig: 75, sim: 60 }
    }
  });

  const handleSimulate = () => {
    setLoading(true);
    setTimeout(() => {
      const idx = parseInt(sampleIndex) || 0;
      const baseScore = ((idx * 23) % 40) + 30; // base risk between 30 and 70
      
      const calculatedSimScore = Math.min(100, Math.max(5, Math.round(baseScore + (loadChange * 0.38))));
      
      let origRisk = baseScore > 70 ? "HIGH" : baseScore > 40 ? "MODERATE" : "LOW";
      let simRisk = calculatedSimScore > 70 ? "HIGH" : calculatedSimScore > 40 ? "MODERATE" : "LOW";
      
      let rec = "";
      if (loadChange > 0) {
        rec = simRisk === "HIGH" 
          ? `⚠️ Warning: A +${loadChange}% load increase elevates risk to HIGH. Mandatory recovery protocols advised.`
          : `✅ Workload increase of +${loadChange}% remains within manageable athlete threshold.`;
      } else {
        rec = `📉 Reducing load by ${Math.abs(loadChange)}% successfully decreases overall injury risk score to safe levels.`;
      }

      setSimData({
        originalScore: baseScore,
        simulatedScore: calculatedSimScore,
        originalRisk: origRisk,
        simulatedRisk: simRisk,
        deltaRisk: `${loadChange >= 0 ? "+" : ""}${Math.round(loadChange * 0.35)}%`,
        recommendation: rec,
        metrics: {
          sprintLoad: { orig: baseScore, sim: Math.min(100, baseScore + Math.round(loadChange * 0.5)) },
          fatigueIndex: { orig: baseScore - 10, sim: Math.min(100, baseScore - 10 + Math.round(loadChange * 0.4)) },
          recoveryRate: { orig: 80, sim: Math.max(10, 80 - Math.round(loadChange * 0.3)) }
        }
      });
      setLoading(false);
    }, 400);
  };

  return (
    <div style={{ padding: "32px", paddingTop: "90px", backgroundColor: "#070C14", minHeight: "100vh", color: "#f1f5f9", fontFamily: "sans-serif", maxWidth: "1600px", margin: "0 auto" }}>
      <style>{`
        .sim-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; margin-top: 24px; }
        .card { background-color: #0D1527; border: 1px solid #1e293b; border-radius: 16px; padding: 24px; box-shadow: 0 6px 24px rgba(0,0,0,0.5); }
        .input-box { background: #141E33; border: 1px solid #334155; border-radius: 10px; padding: 12px 16px; color: #fff; outline: none; width: 100%; font-size: 15px; margin-top: 8px; margin-bottom: 20px; }
        .btn-sim { background: #2563eb; color: #fff; border: none; border-radius: 10px; padding: 14px 24px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; font-size: 15px; transition: background 0.2s; }
        .btn-sim:hover { background: #1d4ed8; }
        .badge { padding: 6px 14px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; display: inline-flex; align-items: center; gap: 6px; }
        .badge-low { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
        .badge-moderate { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
        .badge-high { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
        
        .slider-range { width: 100%; accent-color: #2563eb; height: 6px; background: #1e293b; border-radius: 3px; outline: none; margin: 12px 0 20px 0; }
        
        @keyframes fillBar {
          from { width: 0%; }
          to { width: var(--target-width); }
        }
        .animated-bar {
          animation: fillBar 0.8s cubic-bezier(0.1, 1, 0.1, 1) forwards;
        }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold", letterSpacing: "0.5px" }}>TRAINING SIMULATION MODULE</span>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#ffffff", margin: "4px 0 0 0" }}>What-If Scenario Simulator</h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
            Simulate hypothetical changes in training load and instantly observe projected effects on injury risk and recovery.
          </p>
        </div>
        <div style={{ background: "#0D1527", border: "1px solid #1e293b", padding: "10px 18px", borderRadius: "10px", fontSize: "12px", color: "#38bdf8", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
          ⚡ Simulator Engine: <strong style={{ color: "#34d399" }}>Ready</strong>
        </div>
      </div>

      <div className="sim-grid">
        {/* LEFT PANEL: SIMULATION CONTROLS */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", color: "#38bdf8", fontWeight: "bold", fontSize: "15px" }}>
            <SlidersHorizontal size={20} /> Simulation Parameters
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

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
            <label style={{ fontSize: "12px", color: "#94a3b8" }}>Training Load Adjustment</label>
            <span style={{ fontSize: "16px", fontWeight: "bold", color: loadChange > 0 ? "#ef4444" : loadChange < 0 ? "#34d399" : "#38bdf8" }}>
              {loadChange > 0 ? `+${loadChange}%` : `${loadChange}%`}
            </span>
          </div>

          <input 
            type="range" 
            min="-50" 
            max="100" 
            step="5"
            value={loadChange} 
            onChange={(e) => setLoadChange(parseInt(e.target.value))}
            className="slider-range"
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#64748b", marginBottom: "24px" }}>
            <span>-50% (Reduced Load)</span>
            <span>0% (Baseline)</span>
            <span>+100% (Double Load)</span>
          </div>

          <button className="btn-sim" onClick={handleSimulate} disabled={loading}>
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
            {loading ? "Running What-If Simulation..." : "Run Scenario Simulation"}
          </button>
        </div>

        {/* RIGHT PANEL: COMPARISON & LIVE GRAPHS */}
        <div className="card">
          <div style={{ fontSize: "14px", fontWeight: "bold", color: "#cbd5e1", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={16} color="#38bdf8" /> Projected Impact & Comparison Analysis
          </div>

          {/* BEFORE / AFTER METRICS */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div style={{ background: "#141E33", padding: "18px", borderRadius: "12px", border: "1px solid #1e293b", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Original Baseline Score</div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#cbd5e1", margin: "6px 0" }}>
                {simData.originalScore} <span style={{ fontSize: "14px", color: "#94a3b8" }}>/ 100</span>
              </div>
              <span className={`badge ${simData.originalRisk === "HIGH" ? "badge-high" : simData.originalRisk === "MODERATE" ? "badge-moderate" : "badge-low"}`}>
                {simData.originalRisk} RISK
              </span>
            </div>

            <div style={{ background: "#141E33", padding: "18px", borderRadius: "12px", border: "1px solid #2563eb", textAlign: "center", boxShadow: "0 0 15px rgba(37,99,235,0.2)" }}>
              <div style={{ fontSize: "11px", color: "#38bdf8", textTransform: "uppercase", fontWeight: "bold" }}>Simulated Outcome ({loadChange >= 0 ? `+${loadChange}%` : `${loadChange}%`})</div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: simData.simulatedScore > 70 ? "#f87171" : simData.simulatedScore > 40 ? "#fbbf24" : "#34d399", margin: "6px 0" }}>
                {simData.simulatedScore} <span style={{ fontSize: "14px", color: "#94a3b8" }}>/ 100</span>
              </div>
              <span className={`badge ${simData.simulatedRisk === "HIGH" ? "badge-high" : simData.simulatedRisk === "MODERATE" ? "badge-moderate" : "badge-low"}`}>
                {simData.simulatedRisk} RISK ({simData.deltaRisk})
              </span>
            </div>
          </div>

          {/* LIVE GRAPH COMPARISON WIDGET (NEW ADDITION) */}
          <div style={{ background: "#141E33", border: "1px solid #1e293b", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
            <div style={{ fontSize: "12px", fontWeight: "bold", color: "#cbd5e1", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
              <BarChart2 size={14} color="#38bdf8" /> Live Telemetry Shift (Baseline vs Simulated)
            </div>

            {/* Sprint Load Graph */}
            <div style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>
                <span>Sprint Workload Intensity</span>
                <span>Orig: {simData.metrics.sprintLoad.orig}% ➔ Sim: <strong style={{ color: "#38bdf8" }}>{simData.metrics.sprintLoad.sim}%</strong></span>
              </div>
              <div style={{ display: "flex", gap: "4px", height: "8px", background: "#0d1527", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${simData.metrics.sprintLoad.orig}%`, background: "#64748b", height: "100%" }}></div>
                <div className="animated-bar" style={{ '--target-width': `${simData.metrics.sprintLoad.sim}%`, background: "#2563eb", height: "100%" }}></div>
              </div>
            </div>

            {/* Fatigue Index Graph */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>
                <span>Fatigue Accumulation Index</span>
                <span>Orig: {simData.metrics.fatigueIndex.orig}% ➔ Sim: <strong style={{ color: "#f59e0b" }}>{simData.metrics.fatigueIndex.sim}%</strong></span>
              </div>
              <div style={{ display: "flex", gap: "4px", height: "8px", background: "#0d1527", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${simData.metrics.fatigueIndex.orig}%`, background: "#64748b", height: "100%" }}></div>
                <div className="animated-bar" style={{ '--target-width': `${simData.metrics.fatigueIndex.sim}%`, background: "#f59e0b", height: "100%" }}></div>
              </div>
            </div>
          </div>

          {/* AI RECOMMENDATION BOX */}
          <div style={{ background: "#141E33", border: "1px solid #1e293b", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "12px", color: "#38bdf8", textTransform: "uppercase", fontWeight: "bold", marginBottom: "6px" }}>
              🤖 AI Simulation Verdict & Recommendation
            </div>
            <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>
              {simData.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}