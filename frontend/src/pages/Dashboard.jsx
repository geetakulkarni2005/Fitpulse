import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  HeartPulse,
  Zap,
  Bell,
  AlertTriangle,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

const riskTrendData30D = [
  { date: "Sep 15", low: 82, mod: 15, high: 3 },
  { date: "Sep 18", low: 88, mod: 10, high: 2 },
  { date: "Sep 21", low: 85, mod: 12, high: 3 },
  { date: "Sep 24", low: 84, mod: 13, high: 3 },
  { date: "Sep 27", low: 89, mod: 9,  high: 2 },
  { date: "Sep 30", low: 86, mod: 11, high: 3 },
  { date: "Oct 03", low: 90, mod: 8,  high: 2 },
  { date: "Oct 06", low: 85, mod: 12, high: 3 },
  { date: "Oct 08", low: 87, mod: 10, high: 3 },
];

const riskTrendData90D = [
  { date: "Jul 15", low: 80, mod: 16, high: 4 },
  { date: "Jul 30", low: 83, mod: 14, high: 3 },
  { date: "Aug 15", low: 81, mod: 15, high: 4 },
  { date: "Aug 30", low: 86, mod: 11, high: 3 },
  { date: "Sep 15", low: 82, mod: 15, high: 3 },
  { date: "Sep 30", low: 86, mod: 11, high: 3 },
  { date: "Oct 08", low: 87, mod: 10, high: 3 },
];

const loadvsRecoveryData = [
  { date: "Sep 15", load: 60, recovery: 70 },
  { date: "Sep 18", load: 50, recovery: 75 },
  { date: "Sep 21", load: 65, recovery: 68 },
  { date: "Sep 24", load: 55, recovery: 78 },
  { date: "Sep 27", load: 70, recovery: 65 },
  { date: "Sep 30", load: 58, recovery: 76 },
  { date: "Oct 03", load: 62, recovery: 74 },
  { date: "Oct 06", load: 60, recovery: 77 },
  { date: "Oct 08", load: 65, recovery: 72 },
];

const pieData = [
  { name: "Low Risk", value: 340, color: "#10B981" },
  { name: "Moderate Risk", value: 48, color: "#F59E0B" },
  { name: "High Risk", value: 12, color: "#EF4444" },
];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("30D");

  const currentTrendData = timeRange === "30D" ? riskTrendData30D : riskTrendData90D;

  return (
    <div style={{ padding: "24px", backgroundColor: "#070C14", minHeight: "100vh", color: "#f1f5f9", fontFamily: "sans-serif" }}>
      <style>{`
        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px; }
        .bottom-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .card-panel { background-color: #0D1527; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; }
        .kpi-card { background-color: #0D1527; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 16px; }
        .icon-box { padding: 12px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .flex-between { display: flex; justify-content: space-between; align-items: center; }
        .progress-bg { width: 100%; background-color: #1e293b; height: 8px; border-radius: 999px; margin-top: 4px; overflow: hidden; }
        .quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .quick-box { background-color: #141E33; padding: 12px; border-radius: 8px; border: 1px solid #1e293b; }
      `}</style>

      {/* PAGE TITLE */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#ffffff", margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
          Overview of athlete performance, training load and risk analysis
        </p>
      </div>

      {/* TOP KPI CARDS */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="icon-box" style={{ backgroundColor: "rgba(37, 99, 235, 0.2)", color: "#60a5fa" }}><Users size={22} /></div>
          <div>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Total Athletes</span>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ffffff" }}>400</div>
            <span style={{ fontSize: "10px", color: "#34d399" }}>↑ 0% vs last week</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="icon-box" style={{ backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#34d399" }}><ShieldCheck size={22} /></div>
          <div>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Current Risk</span>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#34d399" }}>Low</div>
            <span style={{ fontSize: "10px", color: "#94a3b8" }}>Most athletes are in low risk zone</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="icon-box" style={{ backgroundColor: "rgba(147, 51, 234, 0.2)", color: "#c084fc" }}><HeartPulse size={22} /></div>
          <div>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Recovery</span>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ffffff" }}>78%</div>
            <span style={{ fontSize: "10px", color: "#34d399" }}>↑ 6% vs last week</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="icon-box" style={{ backgroundColor: "rgba(217, 119, 6, 0.2)", color: "#fbbf24" }}><Zap size={22} /></div>
          <div>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Training Load</span>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ffffff" }}>62</div>
            <span style={{ fontSize: "10px", color: "#34d399" }}>↑ 4% vs last week</span>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION */}
      <div className="main-grid">
        {/* Overload Risk Trend */}
        <div className="card-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div className="flex-between" style={{ marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp size={16} color="#34d399" />
                Overload Risk Trend
              </h3>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0 0" }}>Percentage of athletes in each risk category over time</p>
            </div>
            
            {/* Interactive 30D / 90D Toggle */}
            <div style={{ backgroundColor: "#141E33", padding: "4px", borderRadius: "8px", border: "1px solid #334155", display: "flex", gap: "2px" }}>
              <button 
                onClick={() => setTimeRange("30D")}
                style={{ 
                  padding: "4px 10px", 
                  borderRadius: "4px", 
                  backgroundColor: timeRange === "30D" ? "#2563eb" : "transparent", 
                  color: timeRange === "30D" ? "#fff" : "#94a3b8", 
                  border: "none", 
                  fontSize: "11px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                30D
              </button>
              <button 
                onClick={() => setTimeRange("90D")}
                style={{ 
                  padding: "4px 10px", 
                  borderRadius: "4px", 
                  backgroundColor: timeRange === "90D" ? "#2563eb" : "transparent", 
                  color: timeRange === "90D" ? "#fff" : "#94a3b8", 
                  border: "none", 
                  fontSize: "11px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                90D
              </button>
            </div>
          </div>

          <div style={{ height: "240px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentTrendData}>
                <CartesianGrid stroke="#1E293B" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#1E293B", borderColor: "#334155", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="low" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="mod" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="high" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "24px", fontSize: "12px", borderTop: "1px solid #1e293b", paddingTop: "12px", marginTop: "8px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981" }}></span> Low Risk <b>87%</b></span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#F59E0B" }}></span> Moderate Risk <b>10%</b></span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#EF4444" }}></span> High Risk <b>3%</b></span>
          </div>
        </div>

        {/* Right Side: Risk Distribution + Recent Alerts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card-panel">
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff", margin: "0 0 8px 0" }}>Risk Distribution</h3>
            <div style={{ height: "160px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={50} outerRadius={65} dataKey="value" stroke="none">
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: "#fff" }}>400</span>
                <span style={{ fontSize: "10px", color: "#94a3b8" }}>Athletes</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", marginTop: "8px" }}>
              <div className="flex-between"><span style={{ color: "#94a3b8" }}>🟢 Low Risk</span><b>340 (85%)</b></div>
              <div className="flex-between"><span style={{ color: "#94a3b8" }}>🟡 Moderate Risk</span><b>48 (12%)</b></div>
              <div className="flex-between"><span style={{ color: "#94a3b8" }}>🔴 High Risk</span><b>12 (3%)</b></div>
            </div>
          </div>

          <div className="card-panel">
            <div className="flex-between" style={{ marginBottom: "12px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <Bell size={15} color="#fbbf24" />
                Recent Alerts
              </h3>
              <a href="#" style={{ fontSize: "11px", color: "#60a5fa", textDecoration: "none" }}>View All →</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px" }}>
              <div className="flex-between" style={{ borderBottom: "1px solid #1e293b", paddingBottom: "8px" }}>
                <div>
                  <span style={{ fontWeight: "bold", color: "#f87171" }}>A012</span>
                  <p style={{ color: "#94a3b8", fontSize: "11px", margin: 0 }}>High training load detected</p>
                </div>
                <span style={{ fontSize: "10px", color: "#64748b" }}>2h ago</span>
              </div>
              <div className="flex-between" style={{ borderBottom: "1px solid #1e293b", paddingBottom: "8px" }}>
                <div>
                  <span style={{ fontWeight: "bold", color: "#fbbf24" }}>A067</span>
                  <p style={{ color: "#94a3b8", fontSize: "11px", margin: 0 }}>Recovery score below 60%</p>
                </div>
                <span style={{ fontSize: "10px", color: "#64748b" }}>5h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="bottom-grid">
        <div className="card-panel">
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff", margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertTriangle size={15} color="#fbbf24" /> Key Risk Factors
          </h3>
          <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 16px 0" }}>Top factors contributing to overload risk</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px" }}>
            <div>
              <div className="flex-between" style={{ marginBottom: "4px" }}><span>Fatigue</span><b>32%</b></div>
              <div className="progress-bg"><div style={{ backgroundColor: "#ef4444", height: "100%", width: "32%" }}></div></div>
            </div>
            <div>
              <div className="flex-between" style={{ marginBottom: "4px" }}><span>Soreness</span><b>24%</b></div>
              <div className="progress-bg"><div style={{ backgroundColor: "#f59e0b", height: "100%", width: "24%" }}></div></div>
            </div>
            <div>
              <div className="flex-between" style={{ marginBottom: "4px" }}><span>Pain</span><b>18%</b></div>
              <div className="progress-bg"><div style={{ backgroundColor: "#a855f7", height: "100%", width: "18%" }}></div></div>
            </div>
            <div>
              <div className="flex-between" style={{ marginBottom: "4px" }}><span>Low Recovery</span><b>15%</b></div>
              <div className="progress-bg"><div style={{ backgroundColor: "#3b82f6", height: "100%", width: "15%" }}></div></div>
            </div>
          </div>
        </div>

        <div className="card-panel">
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff", margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={15} color="#60a5fa" /> Training Load vs Recovery
          </h3>
          <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 16px 0" }}>Average values (last 7 days)</p>
          
          <div style={{ height: "170px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={loadvsRecoveryData}>
                <XAxis dataKey="date" stroke="#64748B" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={9} tickLine={false} axisLine={false} />
                <Line type="monotone" dataKey="load" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="recovery" stroke="#10B981" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff", margin: "0 0 12px 0" }}>Quick Stats</h3>
          <div className="quick-grid" style={{ fontSize: "12px" }}>
            <div className="quick-box">
              <span style={{ color: "#94a3b8", fontSize: "10px" }}>Avg. Age</span>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fff", marginTop: "2px" }}>16.8 <small style={{ fontSize: "10px", color: "#64748b" }}>years</small></div>
            </div>
            <div className="quick-box">
              <span style={{ color: "#94a3b8", fontSize: "10px" }}>Avg. Training Load</span>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fff", marginTop: "2px" }}>62 <small style={{ fontSize: "10px", color: "#64748b" }}>(0-100)</small></div>
            </div>
            <div className="quick-box">
              <span style={{ color: "#94a3b8", fontSize: "10px" }}>Avg. Recovery Score</span>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fff", marginTop: "2px" }}>78 <small style={{ fontSize: "10px", color: "#64748b" }}>(0-100)</small></div>
            </div>
            <div className="quick-box">
              <span style={{ color: "#94a3b8", fontSize: "10px" }}>Avg. Overload Risk</span>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#34d399", marginTop: "2px" }}>12 <small style={{ fontSize: "10px", color: "#64748b" }}>(0-100)</small></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}