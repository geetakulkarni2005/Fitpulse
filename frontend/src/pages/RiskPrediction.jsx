
import React, { useState } from "react";
import humanAnatomy from "../assets/human-anatomy.png";

export default function RiskPrediction() {
  const [sampleIndex, setSampleIndex] = useState("42");
  const [prediction, setPrediction] = useState({
    score: 78,
    level: "HIGH",
    confidence: "94.2%",
    zone: "Right Hamstring",
    sprint: 88,
    fatigue: 79,
    recovery: 42,
  });
  const [loading, setLoading] = useState(false);

  const riskColor =
    prediction.level === "HIGH"
      ? "#ff5b65"
      : prediction.level === "MODERATE"
      ? "#fbbf24"
      : "#34d399";

  const predictRisk = () => {
    const index = Number(sampleIndex);

    if (
      sampleIndex.trim() === "" ||
      !Number.isInteger(index) ||
      index < 0 ||
      index > 2279
    ) {
      window.alert("Enter a sample index between 0 and 2279.");
      return;
    }

    setLoading(true);

    // Demo calculation only; replace with your actual prediction API.
    window.setTimeout(() => {
      const score = ((index * 37) % 85) + 12;
      const level =
        score > 70 ? "HIGH" : score > 40 ? "MODERATE" : "LOW";

      setPrediction({
        score,
        level,
        confidence: "94.2%",
        zone:
          level === "HIGH"
            ? "Right Hamstring"
            : level === "MODERATE"
            ? "Right Knee Patella"
            : "Left Calf",
        sprint: level === "HIGH" ? 88 : level === "MODERATE" ? 65 : 40,
        fatigue: level === "HIGH" ? 79 : level === "MODERATE" ? 58 : 30,
        recovery: level === "HIGH" ? 42 : level === "MODERATE" ? 60 : 85,
      });

      setLoading(false);
    }, 300);
  };

  const features = [
    { name: "Sprint Workload Spike", value: prediction.sprint, color: "#ff484f" },
    { name: "Fatigue Index", value: prediction.fatigue, color: "#ffa500" },
    { name: "Recovery Score", value: prediction.recovery, color: "#2ed6a1" },
  ];

  const strainRows = [
    {
      muscle: "Left Calf",
      strain: "68% (Moderate)",
      status: "Monitor Daily",
      color: "#2ed6a1",
      action: "Foam Rolling & Stretching",
    },
    {
      muscle: "Lower Lumbar Spine",
      strain: "74% (High)",
      status: "Rest Required",
      color: "#ff656b",
      action: "Core Mobility & Professional Assessment",
    },
    {
      muscle: "Right Knee Patella",
      strain: "45% (Safe)",
      status: "Optimal",
      color: "#2ed6a1",
      action: "Continue Planned Training",
    },
  ];

  const panelStyle = {
    background: "#0d1527",
    border: "1px solid #202c40",
    borderRadius: 16,
    padding: 22,
    minWidth: 0,
    boxSizing: "border-box",
  };

  const muted = { color: "#94a9c3", fontSize: 13 };

  return (
    <main className="rp-page">
      <style>{`
        .rp-page {
          box-sizing: border-box;
          width: 100%;
          min-height: 100vh;
          padding: 28px;
          background: #070c14;
          color: #f1f5f9;
          font-family: Arial, sans-serif;
        }

        .rp-layout {
          display: grid;
          grid-template-columns: minmax(260px, 0.85fr) minmax(0, 1.35fr);
          gap: 24px;
          align-items: start;
        }

        .rp-button {
          width: 100%;
          padding: 15px;
          background: #2864ed;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .rp-button:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .rp-input {
          box-sizing: border-box;
          width: 100%;
          padding: 14px;
          background: #141e33;
          border: 1px solid #334155;
          border-radius: 10px;
          color: white;
          font-size: 16px;
          margin: 10px 0 18px;
        }

        .rp-table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .rp-table {
          width: 100%;
          min-width: 680px;
          border-collapse: collapse;
          text-align: left;
        }

        .rp-table th {
          padding: 16px;
          background: #081426;
          color: #9bb0c9;
          font-size: 12px;
          letter-spacing: 0.3px;
        }

        .rp-table td {
          padding: 18px 16px;
          border-bottom: 1px solid #243249;
          font-size: 14px;
        }

        .rp-table th {
          border-bottom: 1px solid #243249;
        }

        @media (max-width: 900px) {
          .rp-page {
            padding: 16px;
          }

          .rp-layout {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (max-width: 500px) {
          .rp-page {
            padding: 12px;
          }
        }
      `}</style>

      {/* PAGE HEADING */}
      <header style={{ marginBottom: 24 }}>
        <div style={{ color: "#38bdf8", fontSize: 12, fontWeight: 700 }}>
          FITPULSE · ATHLETE INTELLIGENCE
        </div>
        <h1 style={{ margin: "8px 0", fontSize: 28 }}>
          Risk Prediction
        </h1>
        <p style={{ ...muted, margin: 0 }}>
          AI Training & Overload Monitoring
        </p>
      </header>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="rp-layout">
        {/* LEFT COLUMN */}
        <div style={{ display: "grid", gap: 24 }}>
          <section style={panelStyle}>
            <h3 style={{ color: "#38bdf8", marginTop: 0 }}>
              🧠 LSTM Test Sample Selector
            </h3>

            <label htmlFor="rp-sample-index" style={muted}>
              Test Sample Index (Valid range: 0–2279)
            </label>

            <input
              id="rp-sample-index"
              className="rp-input"
              type="number"
              min="0"
              max="2279"
              value={sampleIndex}
              onChange={(event) => setSampleIndex(event.target.value)}
            />

            <button
              className="rp-button"
              onClick={predictRisk}
              disabled={loading}
            >
              ⚡ {loading ? "Analyzing..." : "Run AI Risk Prediction"}
            </button>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 12,
                marginTop: 18,
              }}
            >
              <div
                style={{
                  ...panelStyle,
                  padding: 14,
                  textAlign: "center",
                }}
              >
                <div style={muted}>Sample A</div>
                <strong style={{ color: "#ff656b" }}>High Risk Test</strong>
              </div>

              <div
                style={{
                  ...panelStyle,
                  padding: 14,
                  textAlign: "center",
                }}
              >
                <div style={muted}>Sample B</div>
                <strong style={{ color: "#2ed6a1" }}>Safe Zone Test</strong>
              </div>
            </div>
          </section>

          <section style={panelStyle}>
            <h3 style={{ marginTop: 0 }}>
              <span style={{ color: "#38bdf8" }}>⌁</span>{" "}
              AI Feature Importance Breakdown
            </h3>

            {features.map((feature) => (
              <div key={feature.name} style={{ marginBottom: 22 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    marginBottom: 8,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "#b9c8db" }}>{feature.name}</span>
                  <strong style={{ color: feature.color }}>
                    {feature.value}%
                  </strong>
                </div>

                <div
                  style={{
                    height: 9,
                    background: "#19243a",
                    borderRadius: 20,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${feature.value}%`,
                      background: feature.color,
                      borderRadius: 20,
                    }}
                  />
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <section style={panelStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <strong style={{ color: "#38bdf8" }}>
              AI ASSESSMENT RESULTS
            </strong>

            <strong style={{ color: riskColor }}>
              ◈ {prediction.level} RISK ALERT
            </strong>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 14,
              margin: "20px 0",
            }}
          >
            <div style={{ ...panelStyle, padding: 17 }}>
              <div style={muted}>CALCULATED RISK SCORE</div>
              <div style={{ marginTop: 5 }}>
                <strong style={{ fontSize: 32, color: riskColor }}>
                  {prediction.score}
                </strong>
                <span style={muted}> / 100</span>
              </div>
            </div>

            <div style={{ ...panelStyle, padding: 17 }}>
              <div style={muted}>MODEL CONFIDENCE</div>
              <strong
                style={{
                  display: "block",
                  fontSize: 30,
                  color: "#38bdf8",
                  marginTop: 5,
                }}
              >
                {prediction.confidence}
              </strong>
            </div>
          </div>

          {/* SAVED HUMAN ANATOMY IMAGE */}
          <div
            style={{
              background: "#020b1b",
              border: "1px solid #202c40",
              borderRadius: 14,
              overflow: "hidden",
              padding: 8,
            }}
          >
            <img
              src={humanAnatomy}
              alt="Front and back human muscular anatomy showing the right hamstring vulnerability zone"
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          </div>

          <div style={{ marginTop: 22 }}>
            <div
              style={{
                color: "#38bdf8",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              PRIMARY INJURY VULNERABILITY ZONE
            </div>

            <h2 style={{ fontSize: 25, margin: "9px 0" }}>
              {prediction.zone}
            </h2>

            <p style={{ color: "#9bb0c9", lineHeight: 1.8, marginBottom: 0 }}>
              {prediction.level === "HIGH"
                ? "High risk indicated in this demo. Consider reducing training load and seeking assessment from a qualified sports professional."
                : prediction.level === "MODERATE"
                ? "Moderate risk indicated in this demo. Monitor workload, soreness, fatigue and recovery."
                : "Lower risk indicated in this demo. Continue monitoring training load and recovery."}
            </p>
          </div>
        </section>
      </div>

      {/* FULL-WIDTH STRAIN LOG TABLE BELOW */}
      <section style={{ ...panelStyle, marginTop: 26 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 22,
          }}
        >
          <h3 style={{ color: "#38bdf8", margin: 0 }}>
            ◈ Comprehensive Anatomical Strain Log &amp; Action Plan
          </h3>

          <span style={muted}>
            Training strain monitoring across muscle groups
          </span>
        </div>

        <div className="rp-table-wrap">
          <table className="rp-table">
            <thead>
              <tr>
                <th>BODY ZONE / MUSCLE</th>
                <th>DETECTED STRAIN</th>
                <th>STATUS</th>
                <th>PHYSIO RECOMMENDED ACTION</th>
              </tr>
            </thead>

            <tbody>
              {strainRows.map((item) => (
                <tr key={item.muscle}>
                  <td style={{ fontWeight: 700 }}>{item.muscle}</td>
                  <td>{item.strain}</td>
                  <td
                    style={{
                      color: item.color,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    ● {item.status}
                  </td>
                  <td style={{ color: "#38bdf8" }}>{item.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ ...muted, lineHeight: 1.7, marginBottom: 0, marginTop: 16 }}>
          Note: The strain log currently contains sample values. Connect it to
          your dataset or backend to display actual athlete-specific results.
        </p>
      </section>
    </main>
  );
}
