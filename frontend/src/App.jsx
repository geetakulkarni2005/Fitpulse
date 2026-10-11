import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Zap, User, Lock, ArrowRight } from "lucide-react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Athletes from "./pages/Athletes";
import TrainingAnalytics from "./pages/TrainingAnalytics";
import RiskPrediction from "./pages/RiskPrediction";
import RiskExplanation from "./pages/RiskExplanation";
import WhatIfSimulator from "./pages/WhatIfSimulator";
import Recommendations from "./pages/Recommendations";
import Evidence from "./pages/Evidence";
import AthleteProfile from "./components/AthleteProfile";
import CoachNotes from "./components/CoachNotes";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("FitPulse runtime error:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            padding: "40px",
            background: "#ffffff",
            color: "#111111",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h1>FitPulse Runtime Error</h1>
          <p>The application loaded, but one of the components caused an error.</p>
          <pre
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: "8px",
              whiteSpace: "pre-wrap",
            }}
          >
            {this.state.error?.stack || String(this.state.error)}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

function AthleteProfileRoute() {
  const athleteId = window.location.pathname.split("/")[2];
  const storedAthlete = window.history.state?.usr?.athlete;
  const athlete =
    storedAthlete ||
    {
      Athlete_ID: decodeURIComponent(athleteId || ""),
    };

  return <AthleteProfile athlete={athlete} />;
}

export default function App() {
  // Coach Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [coachEmail, setCoachEmail] = useState("");
  const [coachPassword, setCoachPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (coachEmail.trim() !== "" && coachPassword.trim() !== "") {
      setIsLoggedIn(true);
    } else {
      setLoginError("Please enter valid Coach credentials.");
    }
  };

  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // IF NOT LOGGED IN: Show Splash Screen + Coach Login Form underneath
  if (!isLoggedIn) {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "#070C14", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 9999, fontFamily: "sans-serif", overflowY: "auto", padding: "20px" }}>
        <style>{`
          @keyframes glowPulse {
            0% { transform: scale(0.95); text-shadow: 0 0 10px rgba(56,189,248,0.4), 0 0 20px rgba(56,189,248,0.2); }
            50% { transform: scale(1.05); text-shadow: 0 0 30px rgba(56,189,248,0.8), 0 0 50px rgba(37,99,235,0.6); }
            100% { transform: scale(0.95); text-shadow: 0 0 10px rgba(56,189,248,0.4), 0 0 20px rgba(56,189,248,0.2); }
          }
          .splash-logo {
            animation: glowPulse 2s infinite ease-in-out;
          }
        `}</style>

        {/* Splash Screen Header Branding */}
        <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.3) 0%, rgba(7,12,20,1) 70%)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #38bdf8", boxShadow: "0 0 30px rgba(56,189,248,0.5)", marginBottom: "12px" }}>
          <Zap size={35} color="#38bdf8" />
        </div>
        <h1 className="splash-logo" style={{ fontSize: "36px", fontWeight: "900", color: "#ffffff", letterSpacing: "2px", margin: "0 0 6px 0" }}>
          FITPULSE
        </h1>
        <p style={{ fontSize: "12px", color: "#38bdf8", letterSpacing: "3px", textTransform: "uppercase", fontWeight: "bold", marginBottom: "24px" }}>
          AI Training & Overload Monitoring
        </p>

        {/* Coach Login Form right below splash branding */}
        <div style={{ background: "#0D1527", border: "1px solid #1e293b", borderRadius: "20px", padding: "30px", width: "100%", maxWidth: "380px", boxShadow: "0 20px 50px rgba(0,0,0,0.8)", textAlign: "center" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#fff", marginBottom: "6px" }}>Coach Portal Login</h3>
          <p style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "20px" }}>Sign in to access FitPulse Athlete Intelligence</p>

          {loginError && <div style={{ background: "rgba(239,68,68,0.2)", color: "#f87171", padding: "8px", borderRadius: "8px", fontSize: "11px", marginBottom: "14px", border: "1px solid #ef4444" }}>{loginError}</div>}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "left" }}>
            <div>
              <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Coach Email ID</label>
              <div style={{ position: "relative" }}>
                <User size={15} color="#94a3b8" style={{ position: "absolute", top: "12px", left: "12px" }} />
                <input 
                  type="email" 
                  placeholder="coach@fitpulse.com" 
                  value={coachEmail}
                  onChange={(e) => setCoachEmail(e.target.value)}
                  style={{ background: "#141E33", border: "1px solid #334155", borderRadius: "10px", padding: "10px 14px 10px 38px", color: "#fff", outline: "none", width: "100%", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} color="#94a3b8" style={{ position: "absolute", top: "12px", left: "12px" }} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={coachPassword}
                  onChange={(e) => setCoachPassword(e.target.value)}
                  style={{ background: "#141E33", border: "1px solid #334155", borderRadius: "10px", padding: "10px 14px 10px 38px", color: "#fff", outline: "none", width: "100%", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: "10px", padding: "11px", fontWeight: "bold", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "6px", boxShadow: "0 4px 12px rgba(37,99,235,0.4)" }}
            >
              Login to System <ArrowRight size={15} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ONCE LOGGED IN: Return your exact original full FitPulse monitoring system
  return (
    <ErrorBoundary>
      <div className="app">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="app-main">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />

              <Route
                path="/athletes"
                element={<Athletes />}
              />

              <Route
                path="/athletes/:athleteId"
                element={<AthleteProfileRoute />}
              />

              <Route
                path="/training-analytics"
                element={<TrainingAnalytics />}
              />

              <Route
                path="/risk-prediction"
                element={<RiskPrediction />}
              />

              <Route
                path="/risk-explanation"
                element={<RiskExplanation />}
              />

              <Route
                path="/what-if"
                element={<WhatIfSimulator />}
              />

              <Route
                path="/recommendations"
                element={<Recommendations />}
              />

              <Route
                path="/evidence"
                element={<Evidence />}
              />

              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}