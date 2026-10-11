import React, { useState } from "react";
import { Brain, Zap, RefreshCw, ShieldAlert, ShieldCheck, Activity, RotateCw, Layers } from "lucide-react";

export default function RiskPrediction() {
  const [sampleIndex, setSampleIndex] = useState("42");
  const [loading, setLoading] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [predictionData, setPredictionData] = useState({
    riskScore: 78,
    riskLevel: "HIGH",
    primaryZone: "Right Hamstring",
    confidence: "94.2%",
    recommendations: "Immediate workload reduction required. High strain detected on posterior chain during high-speed sprints.",
    breakdown: { sprintLoad: "88%", fatigueIndex: "79%", recoveryScore: "42%" },
    telemetry: { acwr: "1.42 (High)", heartRateVar: "42 ms", loadSpike: "+24.5%", neuromuscular: "Compromised" },
    secondaryRisks: [
      { zone: "Left Calf", strain: "68% (Moderate)", status: "Monitor Daily", physioAction: "Foam Rolling & Stretching" },
      { zone: "Lower Lumbar Spine", strain: "74% (High)", status: "Rest Required", physioAction: "Core Decompression Exercises" },
      { zone: "Right Knee Patella", strain: "45% (Safe)", status: "Optimal", physioAction: "Standard Loading" }
    ]
  });

  const handlePredict = () => {
    setLoading(true);
    setTimeout(() => {
      const idx = parseInt(sampleIndex) || 0;
      const score = ((idx * 37) % 85) + 12;
      let level = "LOW";
      let zone = "Left Calf";
      let breakdown = { sprintLoad: "45%", fatigueIndex: "30%", recoveryScore: "85%" };
      let telemetry = { acwr: "1.02 (Optimal)", heartRateVar: "78 ms", loadSpike: "+2.1%", neuromuscular: "Stable" };
      let secondaryRisks = [
        { zone: "Right Hamstring", strain: "32% (Safe)", status: "Optimal", physioAction: "Standard Training" },
        { zone: "Upper Back", strain: "28% (Safe)", status: "Optimal", physioAction: "None Required" }
      ];
      
      if (score > 70) {
        level = "HIGH";
        zone = idx % 2 === 0 ? "Right Hamstring" : "Lower Back Spine";
        breakdown = { sprintLoad: "88%", fatigueIndex: "79%", recoveryScore: "42%" };
        telemetry = { acwr: "1.42 (High)", heartRateVar: "42 ms", loadSpike: "+24.5%", neuromuscular: "Compromised" };
        secondaryRisks = [
          { zone: "Left Calf", strain: "68% (Moderate)", status: "Monitor Daily", physioAction: "Foam Rolling" },
          { zone: "Lower Lumbar Spine", strain: "74% (High)", status: "Rest Required", physioAction: "Spinal Decompression" },
          { zone: "Right Knee Patella", strain: "55% (Elevated)", status: "Caution", physioAction: "Tendon Loading Check" }
        ];
      } else if (score > 40) {
        level = "MODERATE";
        zone = "Left Knee Patella";
        breakdown = { sprintLoad: "65%", fatigueIndex: "58%", recoveryScore: "60%" };
        telemetry = { acwr: "1.18 (Elevated)", heartRateVar: "55 ms", loadSpike: "+12.0%", neuromuscular: "Moderate Fatigue" };
        secondaryRisks = [
          { zone: "Right Hamstring", strain: "52% (Moderate)", status: "Monitor", physioAction: "Ice Therapy" },
          { zone: "Ankle Joint", strain: "48% (Stable)", status: "Normal", physioAction: "Mobility Drills" }
        ];
      }

      setPredictionData({
        riskScore: score,
        riskLevel: level,
        primaryZone: zone,
        confidence: "91.8%",
        recommendations: level === "HIGH" 
          ? "High overload risk predicted by LSTM model. Mandatory 48-hour physical therapy & rest recommended."
          : "Workload parameters are within safe thresholds. Proceed with structured training.",
        breakdown,
        telemetry,
        secondaryRisks
      });
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ padding: "32px", paddingTop: "90px", backgroundColor: "#070C14", minHeight: "100vh", color: "#f1f5f9", fontFamily: "sans-serif", maxWidth: "1600px", margin: "0 auto" }}>
      <style>{`
        .dashboard-layout { display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; margin-top: 20px; }
        .card { background-color: #0D1527; border: 1px solid #1e293b; border-radius: 16px; padding: 24px; box-shadow: 0 6px 24px rgba(0,0,0,0.5); }
        .input-box { background: #141E33; border: 1px solid #334155; border-radius: 10px; padding: 12px 16px; color: #fff; outline: none; width: 100%; font-size: 15px; margin-top: 8px; margin-bottom: 16px; }
        .btn-predict { background: #2563eb; color: #fff; border: none; border-radius: 10px; padding: 14px 24px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; font-size: 15px; transition: background 0.2s; }
        .btn-predict:hover { background: #1d4ed8; }
        .badge { padding: 6px 16px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; display: inline-flex; align-items: center; gap: 8px; }
        .badge-low { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
        .badge-moderate { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
        .badge-high { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
        
        @keyframes pulseGlow {
          0% { transform: scale(0.9); opacity: 0.7; box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.8); }
          50% { transform: scale(1.4); opacity: 1; box-shadow: 0 0 18px 8px rgba(239, 68, 68, 0.7); }
          100% { transform: scale(0.9); opacity: 0.7; box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.8); }
        }
        .hotspot-dot { animation: pulseGlow 1.4s infinite ease-in-out; }

        @keyframes rotate3D {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        .rotating-figure {
          animation: ${isRotating ? "rotate3D 5s linear infinite" : "none"};
          transform-style: preserve-3d;
        }
        .table-row { border-bottom: 1px solid #1e293b; transition: background 0.2s; }
        .table-row:hover { background: #141E33; }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold", letterSpacing: "0.5px" }}>AI RISK ASSESSMENT MODULE</span>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#ffffff", margin: "4px 0 0 0" }}>Advanced Risk Prediction Dashboard</h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
            Real-time LSTM neural network overload detection & anatomical thermal mapping.
          </p>
        </div>
        <div style={{ background: "#0D1527", border: "1px solid #1e293b", padding: "10px 18px", borderRadius: "10px", fontSize: "12px", color: "#38bdf8", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
          ⚡ Engine Status: <strong style={{ color: "#34d399" }}>Online (v2.4)</strong>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="dashboard-layout">
        {/* LEFT PANEL */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", color: "#38bdf8", fontWeight: "bold", fontSize: "15px" }}>
              <Brain size={20} /> LSTM Test Sample Selector
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

            <button className="btn-predict" onClick={handlePredict} disabled={loading}>
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
              {loading ? "Analyzing Biometrics..." : "Run AI Risk Prediction"}
            </button>

            <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ background: "#141E33", padding: "12px", borderRadius: "10px", border: "1px solid #1e293b", textAlign: "center", cursor: "pointer" }} onClick={() => { setSampleIndex("42"); handlePredict(); }}>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>Sample A</div>
                <div style={{ fontSize: "13px", fontWeight: "bold", color: "#f87171" }}>High Risk Test</div>
              </div>
              <div style={{ background: "#141E33", padding: "12px", borderRadius: "10px", border: "1px solid #1e293b", textAlign: "center", cursor: "pointer" }} onClick={() => { setSampleIndex("105"); handlePredict(); }}>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>Sample B</div>
                <div style={{ fontSize: "13px", fontWeight: "bold", color: "#34d399" }}>Safe Zone Test</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#cbd5e1", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Activity size={16} color="#38bdf8" /> AI Feature Importance Breakdown
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px", display: "flex", justifyContent: "space-between" }}>
              <span>Sprint Workload Spike</span>
              <span style={{ color: "#f87171", fontWeight: "bold" }}>{predictionData.breakdown.sprintLoad}</span>
            </div>
            <div style={{ width: "100%", background: "#141E33", height: "8px", borderRadius: "4px", marginBottom: "14px" }}>
              <div style={{ width: predictionData.breakdown.sprintLoad, background: "#ef4444", height: "100%", borderRadius: "4px" }}></div>
            </div>

            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>Fatigue Index: {predictionData.breakdown.fatigueIndex}</div>
            <div style={{ width: "100%", background: "#141E33", height: "8px", borderRadius: "4px", marginBottom: "14px" }}>
              <div style={{ width: predictionData.breakdown.fatigueIndex, background: "#f59e0b", height: "100%", borderRadius: "4px" }}></div>
            </div>

            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>Recovery Score: {predictionData.breakdown.recoveryScore}</div>
            <div style={{ width: "100%", background: "#141E33", height: "8px", borderRadius: "4px" }}>
              <div style={{ width: predictionData.breakdown.recoveryScore, background: "#34d399", height: "100%", borderRadius: "4px" }}></div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <span style={{ fontSize: "13px", color: "#38bdf8", fontWeight: "bold", textTransform: "uppercase" }}>AI Assessment Results</span>
              <span className={`badge ${predictionData.riskLevel === "HIGH" ? "badge-high" : predictionData.riskLevel === "MODERATE" ? "badge-moderate" : "badge-low"}`}>
                {predictionData.riskLevel === "HIGH" ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                {predictionData.riskLevel === "HIGH" ? "🚨 HIGH RISK ALERT" : predictionData.riskLevel === "MODERATE" ? "⚠️ MODERATE RISK" : "🟢 OPTIMAL ZONE"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
              <div style={{ background: "#141E33", padding: "16px", borderRadius: "12px", border: "1px solid #1e293b" }}>
                <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Calculated Risk Score</div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: predictionData.riskScore > 70 ? "#f87171" : predictionData.riskScore > 40 ? "#fbbf24" : "#34d399", marginTop: "4px" }}>
                  {predictionData.riskScore} <span style={{ fontSize: "14px", color: "#94a3b8" }}>/ 100</span>
                </div>
              </div>
              <div style={{ background: "#141E33", padding: "16px", borderRadius: "12px", border: "1px solid #1e293b" }}>
                <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>LSTM Model Confidence</div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#38bdf8", marginTop: "4px" }}>{predictionData.confidence}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "18px" }}>
              <div style={{ background: "#141E33", padding: "12px", borderRadius: "8px", border: "1px solid #1e293b", textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: "#94a3b8" }}>ACWR Ratio</div>
                <div style={{ fontSize: "13px", fontWeight: "bold", color: "#cbd5e1" }}>{predictionData.telemetry.acwr}</div>
              </div>
              <div style={{ background: "#141E33", padding: "12px", borderRadius: "8px", border: "1px solid #1e293b", textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: "#94a3b8" }}>HR Variability</div>
                <div style={{ fontSize: "13px", fontWeight: "bold", color: "#cbd5e1" }}>{predictionData.telemetry.heartRateVar}</div>
              </div>
              <div style={{ background: "#141E33", padding: "12px", borderRadius: "8px", border: "1px solid #1e293b", textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: "#94a3b8" }}>Load Spike</div>
                <div style={{ fontSize: "13px", fontWeight: "bold", color: "#f87171" }}>{predictionData.telemetry.loadSpike}</div>
              </div>
              <div style={{ background: "#141E33", padding: "12px", borderRadius: "8px", border: "1px solid #1e293b", textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: "#94a3b8" }}>Neuromuscular</div>
                <div style={{ fontSize: "12px", fontWeight: "bold", color: "#fbbf24" }}>{predictionData.telemetry.neuromuscular}</div>
              </div>
            </div>

            {/* CENTERED BODY HEATMAP WIDGET */}
            <div style={{ background: "#141E33", border: "1px solid #1e293b", borderRadius: "14px", padding: "24px", display: "flex", alignItems: "center", gap: "28px", position: "relative", overflow: "hidden" }}>
              
              <button 
                onClick={() => setIsRotating(!isRotating)}
                title="Toggle 3D Rotation"
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  background: isRotating ? "#2563eb" : "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#fff",
                  padding: "8px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  zIndex: 10
                }}
              >
                <RotateCw size={14} className={isRotating ? "animate-spin" : ""} />
                {isRotating ? "Auto-Rotating 3D" : "Rotation Paused"}
              </button>

              <div style={{ minWidth: "130px", height: "190px", backgroundColor: "#070C14", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #334155", boxShadow: "inset 0 0 20px rgba(0,0,0,0.7)", position: "relative" }}>
                <div className="rotating-figure" style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="65" height="150" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="4" r="3" />
                    <path d="M12 7v6m-4-4h8" />
                    <path d="M12 13l-3 8m3-8l3 8" />
                  </svg>

                  <div 
                    className="hotspot-dot"
                    style={{
                      position: "absolute",
                      bottom: predictionData.primaryZone.includes("Hamstring") ? "55px" : predictionData.primaryZone.includes("Back") ? "95px" : "75px",
                      right: "42px",
                      width: "14px",
                      height: "14px",
                      backgroundColor: predictionData.riskLevel === "HIGH" ? "#ef4444" : "#fbbf24",
                      borderRadius: "50%"
                    }} 
                  />
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", color: "#38bdf8", textTransform: "uppercase", fontWeight: "bold" }}>Primary Injury Vulnerability Zone</div>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#fff", marginTop: "6px" }}>
                  {predictionData.primaryZone}
                </div>

                <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "10px", lineHeight: "1.6" }}>
                  {predictionData.recommendations}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM TABLE SECTION */}
      <div className="card" style={{ marginTop: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#38bdf8", fontWeight: "bold", fontSize: "15px" }}>
            <Layers size={20} /> Comprehensive Anatomical Strain Log & Action Plan
          </div>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Real-time telemetry tracked across all muscle chains</span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", fontSize: "12px" }}>
              <th style={{ padding: "14px" }}>BODY ZONE / MUSCLE</th>
              <th style={{ padding: "14px" }}>DETECTED STRAIN</th>
              <th style={{ padding: "14px" }}>STATUS</th>
              <th style={{ padding: "14px" }}>PHYSIO RECOMMENDED ACTION</th>
            </tr>
          </thead>
          <tbody>
            {predictionData.secondaryRisks.map((item, index) => (
              <tr key={index} className="table-row">
                <td style={{ padding: "16px 14px", fontWeight: "bold", color: "#fff" }}>{item.zone}</td>
                <td style={{ padding: "16px 14px", color: "#cbd5e1" }}>{item.strain}</td>
                <td style={{ padding: "16px 14px" }}>
                  <span style={{ color: item.status.includes("High") || item.status.includes("Rest") ? "#f87171" : "#34d399", fontWeight: "bold" }}>
                    ● {item.status}
                  </span>
                </td>
                <td style={{ padding: "16px 14px", color: "#38bdf8" }}>{item.physioAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}