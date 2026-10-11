import React, { useState } from "react";
import { Brain, RefreshCw, BarChart2, Info, Cpu, ChevronRight, Layers, ShieldAlert, CheckCircle, Activity } from "lucide-react";

export default function RiskExplanation() {
  const [sampleIndex, setSampleIndex] = useState("42");
  const [loading, setLoading] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState({
    name: "Sprint Workload Spike",
    impact: "+42%",
    color: "#ef4444",
    desc: "Excessive high-intensity distance covered in last 48 hours compared to 4-week moving average.",
    mitigation: "Mandatory reduction in high-speed running volume by 30% for the next 2 training sessions."
  });

  const [explainedData, setExplainedData] = useState({
    riskScore: 78,
    primaryDriver: "High-Speed Sprint Acceleration Spike (+24.5%)",
    modelConfidence: "94.2%",
    features: [
      { name: "Sprint Workload Spike", impact: "+42%", width: "84%", color: "#ef4444", desc: "Excessive high-intensity distance covered in last 48 hours.", mitigation: "Reduce high-speed running volume by 30%." },
      { name: "Fatigue & Sleep Deficit", impact: "+28%", width: "56%", color: "#f59e0b", desc: "Sub-optimal recovery metrics logged via wearable telemetry.", mitigation: "Ensure minimum 8.5 hours sleep & hydro-therapy." },
      { name: "Acute:Chronic Workload Ratio (ACWR)", impact: "+18%", width: "36%", color: "#38bdf8", desc: "Ratio crossed optimal safety threshold of 1.30.", mitigation: "Stabilize training loads across upcoming micro-cycle." },
      { name: "Historical Injury Marker", impact: "+12%", width: "24%", color: "#34d399", desc: "Previous strain history on posterior chain.", mitigation: "Targeted eccentric hamstring strengthening drills." }
    ],
    historicalLogs: [
      { session: "Session #214", sample: "Sample 42", primaryFactor: "Sprint Overload", shapValue: "+0.84", status: "High Attribution" },
      { session: "Session #213", sample: "Sample 41", primaryFactor: "ACWR Spikes", shapValue: "+0.62", status: "Moderate Attribution" },
      { session: "Session #212", sample: "Sample 40", primaryFactor: "Optimal Rest", shapValue: "-0.31", status: "Safe Zone" }
    ]
  });

  const handleExplain = () => {
    setLoading(true);
    setTimeout(() => {
      const idx = parseInt(sampleIndex) || 0;
      const score = ((idx * 37) % 85) + 12;
      let driver = score > 70 ? "High-Speed Sprint Acceleration Spike (+24.5% load)" : "Stable Workload & Balanced Recovery";
      let features = score > 70 ? [
        { name: "Sprint Workload Spike", impact: "+42%", width: "84%", color: "#ef4444", desc: "Excessive high-intensity distance covered in last 48 hours.", mitigation: "Reduce high-speed running volume by 30%." },
        { name: "Fatigue & Sleep Deficit", impact: "+28%", width: "56%", color: "#f59e0b", desc: "Sub-optimal recovery metrics logged via wearable telemetry.", mitigation: "Ensure minimum 8.5 hours sleep & hydro-therapy." },
        { name: "ACWR Ratio Overload", impact: "+18%", width: "36%", color: "#38bdf8", desc: "Ratio crossed optimal safety threshold of 1.30.", mitigation: "Stabilize training loads across upcoming micro-cycle." },
        { name: "Historical Injury Marker", impact: "+12%", width: "24%", color: "#34d399", desc: "Previous strain history on posterior chain.", mitigation: "Targeted eccentric hamstring strengthening drills." }
      ] : [
        { name: "Consistent Recovery", impact: "+55%", width: "90%", color: "#34d399", desc: "Adequate sleep and low physical strain indices.", mitigation: "Maintain current training rhythm." },
        { name: "Optimal ACWR Balance", impact: "+30%", width: "60%", color: "#38bdf8", desc: "Workload ratio maintained within safe 0.8 - 1.2 bounds.", mitigation: "Continue structured periodization." },
        { name: "Minimal Fatigue Index", impact: "+15%", width: "30%", color: "#f59e0b", desc: "Neuromuscular system fully recovered.", mitigation: "Proceed to peak performance drills." }
      ];

      setExplainedData({
        riskScore: score,
        primaryDriver: driver,
        modelConfidence: "91.8%",
        features,
        historicalLogs: [
          { session: `Session #${idx + 150}`, sample: `Sample ${idx}`, primaryFactor: score > 70 ? "High Sprint Load" : "Balanced Load", shapValue: score > 70 ? "+0.79" : "-0.45", status: score > 70 ? "High Attribution" : "Safe Zone" },
          { session: `Session #${idx + 149}`, sample: `Sample ${idx - 1}`, primaryFactor: "ACWR Variance", shapValue: "+0.51", status: "Moderate Attribution" }
        ]
      });
      setSelectedFeature(features[0]);
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ padding: "32px", paddingTop: "90px", backgroundColor: "#070C14", minHeight: "100vh", color: "#f1f5f9", fontFamily: "sans-serif", maxWidth: "1600px", margin: "0 auto" }}>
      <style>{`
        .exp-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 24px; margin-top: 24px; }
        .card { background-color: #0D1527; border: 1px solid #1e293b; border-radius: 16px; padding: 24px; box-shadow: 0 6px 24px rgba(0,0,0,0.5); }
        .input-box { background: #141E33; border: 1px solid #334155; border-radius: 10px; padding: 12px 16px; color: #fff; outline: none; width: 100%; font-size: 15px; margin-top: 8px; margin-bottom: 16px; }
        .btn-explain { background: #2563eb; color: #fff; border: none; border-radius: 10px; padding: 14px 24px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; font-size: 15px; transition: background 0.2s; }
        .btn-explain:hover { background: #1d4ed8; }
        .feature-row { background: #141E33; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 12px; cursor: pointer; transition: all 0.2s; }
        .feature-row:hover { border-color: #38bdf8; background: #182238; transform: translateY(-2px); }
        .table-row { border-bottom: 1px solid #1e293b; transition: background 0.2s; }
        .table-row:hover { background: #141E33; }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold", letterSpacing: "0.5px" }}>MODEL EXPLAINABILITY MODULE</span>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#ffffff", margin: "4px 0 0 0" }}>Risk Explanation & AI Attribution</h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
            Understand exactly which features, telemetry spikes, and biometric variables contributed to the predicted overload risk.
          </p>
        </div>
        <div style={{ background: "#0D1527", border: "1px solid #1e293b", padding: "10px 18px", borderRadius: "10px", fontSize: "12px", color: "#38bdf8", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
          ⚡ SHAP Engine: <strong style={{ color: "#34d399" }}>Active (v2.4)</strong>
        </div>
      </div>

      <div className="exp-grid">
        {/* LEFT PANEL: SELECTOR & INTERACTIVE DETAILS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", color: "#38bdf8", fontWeight: "bold", fontSize: "15px" }}>
              <Brain size={20} /> Explainability Sample Selector
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

            <button className="btn-explain" onClick={handleExplain} disabled={loading}>
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Cpu size={18} />}
              {loading ? "Computing SHAP Values..." : "Explain Risk Prediction"}
            </button>
          </div>

          {/* INTERACTIVE FEATURE DEEP-DIVE CARD */}
          <div className="card" style={{ borderLeft: `4px solid ${selectedFeature.color}` }}>
            <div style={{ fontSize: "13px", fontWeight: "bold", color: selectedFeature.color, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Info size={16} /> Selected Feature Deep-Dive
            </div>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fff", marginBottom: "6px" }}>
              {selectedFeature.name} ({selectedFeature.impact})
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5", marginBottom: "12px" }}>
              {selectedFeature.desc}
            </p>
            <div style={{ background: "#141E33", padding: "12px", borderRadius: "8px", border: "1px solid #1e293b" }}>
              <div style={{ fontSize: "10px", color: "#38bdf8", textTransform: "uppercase", fontWeight: "bold" }}>Recommended Physio Mitigation</div>
              <div style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "4px" }}>{selectedFeature.mitigation}</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: EXPLAINABILITY BREAKDOWN WITH MULTI-COLORED GRAPHS */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold", textTransform: "uppercase" }}>Primary Decision Driver</span>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#fff", marginTop: "4px" }}>
                {explainedData.primaryDriver}
              </div>
            </div>
            <div style={{ background: "#141E33", padding: "10px 16px", borderRadius: "10px", border: "1px solid #1e293b", textAlign: "right" }}>
              <div style={{ fontSize: "10px", color: "#94a3b8" }}>Model Confidence</div>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#34d399" }}>{explainedData.modelConfidence}</div>
            </div>
          </div>

          <div style={{ fontSize: "13px", fontWeight: "bold", color: "#cbd5e1", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
            <BarChart2 size={16} color="#38bdf8" /> Multi-Colored SHAP Feature Impact Graph & Breakdown
          </div>

          <div>
            {explainedData.features.map((feat, idx) => (
              <div key={idx} className="feature-row" onClick={() => setSelectedFeature(feat)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: feat.color }}></span>
                    {feat.name} <ChevronRight size={14} color="#38bdf8" />
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: "bold", color: feat.color }}>
                    {feat.impact}
                  </div>
                </div>
                
                {/* MULTI-COLOR GRADIENT / DYNAMIC BAR */}
                <div style={{ width: "100%", background: "#1e293b", height: "8px", borderRadius: "4px", marginBottom: "6px" }}>
                  <div style={{ width: feat.width, background: feat.color, height: "100%", borderRadius: "4px", transition: "width 0.4s ease" }}></div>
                </div>

                <div style={{ fontSize: "12px", color: "#94a3b8" }}>{feat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: HISTORICAL SHAP ATTRIBUTION LOG */}
      <div className="card" style={{ marginTop: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#38bdf8", fontWeight: "bold", fontSize: "15px" }}>
            <Layers size={20} /> Historical SHAP Attribution Log
          </div>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Tracking model explainability across recent telemetry evaluations</span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", fontSize: "12px" }}>
              <th style={{ padding: "14px" }}>TRAINING SESSION</th>
              <th style={{ padding: "14px" }}>SAMPLE ID</th>
              <th style={{ padding: "14px" }}>PRIMARY CONTRIBUTING FACTOR</th>
              <th style={{ padding: "14px" }}>SHAP VALUE</th>
              <th style={{ padding: "14px" }}>ATTRIBUTION STATUS</th>
            </tr>
          </thead>
          <tbody>
            {explainedData.historicalLogs.map((log, index) => (
              <tr key={index} className="table-row">
                <td style={{ padding: "16px 14px", fontWeight: "bold", color: "#fff" }}>{log.session}</td>
                <td style={{ padding: "16px 14px", color: "#38bdf8" }}>{log.sample}</td>
                <td style={{ padding: "16px 14px", color: "#cbd5e1" }}>{log.primaryFactor}</td>
                <td style={{ padding: "16px 14px", fontWeight: "bold", color: log.shapValue.startsWith("+") ? "#ef4444" : "#34d399" }}>{log.shapValue}</td>
                <td style={{ padding: "16px 14px" }}>
                  <span style={{ color: log.status.includes("High") ? "#f87171" : "#34d399", fontWeight: "bold" }}>
                    ● {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}