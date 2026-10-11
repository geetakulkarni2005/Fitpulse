import React, { useEffect, useMemo, useState } from "react";
import { Zap, Activity, HeartPulse, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { getAthletes } from "../services/athleteApi";
import { getTrainingHistory } from "../services/trainingApi";

export default function TrainingAnalytics() {
  const [athletes, setAthletes] = useState([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");
  const [range, setRange] = useState(7);

  // Load all athletes
  useEffect(() => {
    let cancelled = false;

    async function loadAthletes() {
      try {
        const res = await getAthletes();

        const list = Array.isArray(res?.athletes)
          ? res.athletes
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

        if (cancelled) return;

        setAthletes(list);

        if (list.length > 0) {
          const firstId =
            list[0]?.Athlete_ID ??
            list[0]?.athlete_id ??
            list[0]?.id ??
            "";

          setSelectedAthleteId(String(firstId));
        } else {
          setError("Athletes सापडले नाहीत. Backend तपासा.");
        }
      } catch (err) {
        console.error("Failed to load athletes:", err);
        if (!cancelled) {
          setError("Athletes load झाले नाहीत. Backend चालू आहे का तपासा.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAthletes();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load selected athlete's real training history
  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      if (!selectedAthleteId) {
        setHistory([]);
        return;
      }

      setLoadingHistory(true);
      setError("");
      setHistory([]);

      try {
        const res = await getTrainingHistory(selectedAthleteId);

        const list =
          res?.training_history ??
          res?.history ??
          res?.sessions ??
          res?.data?.training_history ??
          res?.data?.history ??
          res?.data ??
          (Array.isArray(res) ? res : []);

        if (cancelled) return;

        if (Array.isArray(list)) {
          setHistory(list);

          if (list.length === 0) {
            setError("या athlete साठी training sessions मिळाले नाहीत.");
          }
        } else {
          setHistory([]);
          setError("API response मधील training data योग्य format मध्ये नाही.");
        }
      } catch (err) {
        console.error("Failed to load training history:", err);

        if (!cancelled) {
          setHistory([]);
          setError(
            "Training history load झाली नाही. Backend आणि API तपासा."
          );
        }
      } finally {
        if (!cancelled) setLoadingHistory(false);
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [selectedAthleteId]);

  // Convert backend fields into chart-friendly fields
  const allChartData = useMemo(() => {
    return history.map((session, index) => {
      const date =
        session?.Session_Date ??
        session?.session_date ??
        session?.Date ??
        session?.date;

      const sessionNumber =
        session?.Session_Number ??
        session?.session_number ??
        session?.Session_ID ??
        session?.session_id;

      return {
        name: date
          ? String(date).slice(0, 10)
          : sessionNumber != null
          ? `Session ${sessionNumber}`
          : `Session ${index + 1}`,

        load: Number(
          session?.Training_Load ?? session?.training_load ?? 0
        ),

        fatigue: Number(
          session?.Fatigue ?? session?.fatigue ?? 0
        ),

        soreness: Number(
          session?.Soreness ?? session?.soreness ?? 0
        ),

        pain: Number(
          session?.Pain ?? session?.pain ?? 0
        ),

        sleepDuration:
          session?.Sleep_Hours != null
            ? `${session.Sleep_Hours} hrs`
            : session?.sleep_hours != null
            ? `${session.sleep_hours} hrs`
            : session?.Sleep_Duration ??
              session?.sleep_duration ??
              "Not available",

        recovery: Number(
          session?.Perceived_Recovery ??
            session?.Recovery ??
            session?.recovery ??
            0
        ),

        riskScore: Number(
          session?.Overload_Risk_Score ??
            session?.risk_score ??
            0
        ),
      };
    });
  }, [history]);

  // Show only the last 7, 14, or 30 sessions in charts and table
  const chartData = useMemo(
    () => allChartData.slice(-range),
    [allChartData, range]
  );

  const totalSessionsCount = history.length;
  const latestSession = allChartData[allChartData.length - 1] || {};

  return (
    <div
      style={{
        padding: "24px",
        paddingTop: "80px",
        backgroundColor: "#070C14",
        minHeight: "100vh",
        color: "#f1f5f9",
        fontFamily: "sans-serif",
      }}
    >
      <style>{`
        .page-header {
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .analytics-card {
          background-color: #0D1527;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .icon-wrap {
          padding: 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .main-layout {
          display: grid;
          grid-template-columns: minmax(0, 2.2fr) minmax(0, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }

        .chart-panel {
          background-color: #0D1527;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 20px;
          overflow-x: auto;
          min-width: 0;
        }

        .flex-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .custom-select {
          background: #141E33;
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 8px 14px;
          color: #fff;
          font-size: 13px;
          outline: none;
          max-width: 100%;
        }

        .btn-group {
          display: flex;
          flex-wrap: wrap;
        }

        .btn-group button {
          background: #141E33;
          border: 1px solid #334155;
          color: #94a3b8;
          padding: 7px 12px;
          font-size: 11px;
          cursor: pointer;
        }

        .btn-group button.active {
          background: #2563eb;
          color: #fff;
          border-color: #2563eb;
        }

        .btn-group button:first-child {
          border-radius: 6px 0 0 6px;
        }

        .btn-group button:last-child {
          border-radius: 0 6px 6px 0;
        }

        .session-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          white-space: nowrap;
        }

        .session-table th {
          background: #141E33;
          padding: 10px 14px;
          color: #94a3b8;
          text-align: left;
          font-weight: 600;
          border-bottom: 1px solid #1e293b;
        }

        .session-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #1e293b;
          color: #e2e8f0;
        }

        .status-pill {
          padding: 3px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: bold;
        }

        @media (max-width: 900px) {
          .analytics-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .main-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {
          .analytics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Page header */}
      <div className="page-header">
        <div>
          <span
            style={{
              fontSize: "11px",
              color: "#38bdf8",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            TRAINING MONITORING
          </span>

          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#ffffff",
              margin: "4px 0 0",
            }}
          >
            Training Analytics
          </h1>

          <p
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              marginTop: "4px",
            }}
          >
            Analyze workload progression, fatigue, soreness, pain, and recovery.
          </p>
        </div>

        <div>
          <label
            htmlFor="athlete-select"
            style={{
              display: "block",
              fontSize: "11px",
              color: "#94a3b8",
              marginBottom: "6px",
            }}
          >
            Select Athlete
          </label>

          <select
            id="athlete-select"
            className="custom-select"
            value={selectedAthleteId}
            onChange={(e) => setSelectedAthleteId(e.target.value)}
            disabled={loading || athletes.length === 0}
          >
            {athletes.map((ath, index) => {
              const id =
                ath?.Athlete_ID ??
                ath?.athlete_id ??
                ath?.id ??
                `athlete-${index}`;

              return (
                <option key={id} value={String(id)}>
                  {String(id)} — {ath?.Athlete_Name ?? ath?.Name ?? "Athlete"}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          style={{
            marginBottom: "16px",
            padding: "12px 14px",
            borderRadius: "8px",
            border: "1px solid #7f1d1d",
            background: "#2a1118",
            color: "#fca5a5",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="analytics-grid">
        <div className="analytics-card">
          <div
            className="icon-wrap"
            style={{
              backgroundColor: "rgba(37, 99, 235, 0.2)",
              color: "#60a5fa",
            }}
          >
            <Zap size={20} />
          </div>

          <div>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#fff" }}>
              {loadingHistory ? "…" : totalSessionsCount}
            </div>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>
              📊 Sessions for Selected Athlete
            </span>
          </div>
        </div>

        <div className="analytics-card">
          <div
            className="icon-wrap"
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              color: "#34d399",
            }}
          >
            <Activity size={20} />
          </div>

          <div>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#34d399" }}>
              {latestSession.load ? Math.round(latestSession.load) : "—"}
            </div>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>
              ⚡ Latest Load (AU)
            </span>
          </div>
        </div>

        <div className="analytics-card">
          <div
            className="icon-wrap"
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.2)",
              color: "#fbbf24",
            }}
          >
            <TrendingUp size={20} />
          </div>

          <div>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#fff" }}>
              {latestSession.fatigue ? `${latestSession.fatigue} / 10` : "—"}
            </div>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>
              😫 Fatigue Score
            </span>
          </div>
        </div>

        <div className="analytics-card">
          <div
            className="icon-wrap"
            style={{
              backgroundColor: "rgba(168, 85, 247, 0.2)",
              color: "#c084fc",
            }}
          >
            <HeartPulse size={20} />
          </div>

          <div>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#fff" }}>
              {latestSession.recovery ? `${latestSession.recovery} / 10` : "—"}
            </div>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>
              🔋 Recovery Score
            </span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="main-layout">
        <div className="chart-panel">
          <div className="flex-row" style={{ marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#fff", margin: 0 }}>
                Training Load Progression
              </h3>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0" }}>
                Workload per session for selected athlete
              </p>
            </div>

            <div className="btn-group">
              {[7, 14, 30].map((number) => (
                <button
                  key={number}
                  type="button"
                  className={range === number ? "active" : ""}
                  onClick={() => setRange(number)}
                >
                  {number} Sessions
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: "250px" }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="loadColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#1E293B", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
                  <Area type="monotone" dataKey="load" stroke="#38bdf8" strokeWidth={2.5} fill="url(#loadColor)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ color: "#94a3b8", fontSize: "13px", paddingTop: "40px", textAlign: "center" }}>
                {loadingHistory ? "Loading training sessions..." : "No training data to display."}
              </div>
            )}
          </div>
        </div>

        <div
          className="chart-panel"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#fff", margin: 0 }}>
              Overload Risk Trend
            </h3>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0" }}>
              Calculated risk score
            </p>
          </div>

          <div style={{ height: "200px", marginTop: "16px" }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "#1E293B", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
                  <Line type="monotone" dataKey="riskScore" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ color: "#94a3b8", fontSize: "13px", paddingTop: "40px", textAlign: "center" }}>
                No risk data to display.
              </div>
            )}
          </div>

          <div
            style={{
              backgroundColor: "#141E33",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "11px",
              color: "#94a3b8",
              textAlign: "center",
              fontWeight: "500",
              marginTop: "12px",
            }}
          >
            Risk status is based on the selected athlete's latest session.
          </div>
        </div>
      </div>

      {/* Session table */}
      <div className="chart-panel">
        <div className="flex-row" style={{ marginBottom: "12px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#fff", margin: 0 }}>
            Detailed Session Log
          </h3>
          <span style={{ fontSize: "11px", color: "#64748b" }}>
            Showing {chartData.length} of {totalSessionsCount} sessions
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="session-table">
            <thead>
              <tr>
                <th>Session / Date</th>
                <th>Training Load</th>
                <th>Fatigue</th>
                <th>Soreness</th>
                <th>Pain</th>
                <th>Sleep Duration</th>
                <th>Recovery</th>
                <th>Risk Score</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {chartData.map((row, index) => {
                const moderateRisk = row.riskScore > 40;

                return (
                  <tr key={`${row.name}-${index}`}>
                    <td style={{ fontWeight: "600", color: "#fff" }}>{row.name}</td>
                    <td>{row.load} AU</td>
                    <td>{row.fatigue} / 10</td>
                    <td>{row.soreness} / 10</td>
                    <td>{row.pain} / 10</td>
                    <td>{row.sleepDuration}</td>
                    <td>{row.recovery} / 10</td>
                    <td>{row.riskScore}%</td>
                    <td>
                      <span
                        className="status-pill"
                        style={{
                          backgroundColor: moderateRisk
                            ? "rgba(239, 68, 68, 0.15)"
                            : "rgba(16, 185, 129, 0.15)",
                          color: moderateRisk ? "#f87171" : "#34d399",
                          border: `1px solid ${
                            moderateRisk
                              ? "rgba(239, 68, 68, 0.3)"
                              : "rgba(16, 185, 129, 0.3)"
                          }`,
                        }}
                      >
                        {moderateRisk ? "⚠️ MODERATE RISK" : "🟢 OPTIMAL"}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {!loadingHistory && chartData.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", color: "#94a3b8" }}>
                    No sessions found for this athlete.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}