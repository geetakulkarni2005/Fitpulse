import React, { useState } from "react";
import {
  Bell,
  ChevronDown,
  Menu,
  Phone,
  Mail,
  Shield,
  Upload,
  Trash2,
  X,
  Award,
  Users,
  Edit3,
  AlertTriangle
} from "lucide-react";

function Header({ onMenuClick }) {
  const [coachImage, setCoachImage] = useState(() => {
    return localStorage.getItem("fitpulse_coach_image") || "";
  });
  
  const [coachPhone, setCoachPhone] = useState(() => {
    return localStorage.getItem("fitpulse_coach_phone") || "+91 98765 43210";
  });
  const [coachEmail] = useState("coach@fitpulse.com");

  const [isEditing, setIsEditing] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, text: "A012 High training load detected", time: "2h ago", type: "high" },
    { id: 2, text: "Athlete A045 exceeded recovery threshold", time: "5h ago", type: "warning" },
    { id: 3, text: "Weekly overload report generated", time: "1d ago", type: "info" }
  ]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoachImage(reader.result);
        localStorage.setItem("fitpulse_coach_image", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCoachImage("");
    localStorage.removeItem("fitpulse_coach_image");
  };

  const handleSaveDetails = () => {
    localStorage.setItem("fitpulse_coach_phone", coachPhone);
    setIsEditing(false);
  };

  return (
    <>
      <header className="fitpulse-header">
        <div className="header-left">
          <button
            className="header-menu"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <h2>FitPulse</h2>
            <p>AI Training & Overload Monitoring</p>
          </div>
        </div>

        <div className="header-right">
          {/* Bell Notifications Dropdown */}
          <div style={{ position: "relative" }}>
            <button 
              className="header-icon" 
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileOpen(false);
              }}
              style={{
                cursor: "pointer",
                position: "relative",
                background: "transparent",
                border: "1px solid #334155",
                borderRadius: "8px",
                padding: "8px",
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Bell size={17} />
              <span style={{ position: "absolute", top: "4px", right: "4px", width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%" }}></span>
            </button>

            {isNotificationsOpen && (
              <div style={{ position: "absolute", right: 0, top: "45px", width: "300px", background: "#0D1527", border: "1px solid #334155", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.8)", zIndex: 1000, padding: "16px", color: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid #1e293b", paddingBottom: "8px" }}>
                  <span style={{ fontWeight: "bold", fontSize: "14px" }}>Recent Alerts</span>
                  <span style={{ fontSize: "11px", color: "#38bdf8", background: "rgba(56,189,248,0.1)", padding: "2px 6px", borderRadius: "4px" }}>3 New</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {notifications.map((notif) => (
                    <div key={notif.id} style={{ background: "#141E33", padding: "10px", borderRadius: "8px", border: "1px solid #1e293b", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <AlertTriangle size={16} color="#ef4444" style={{ marginTop: "2px" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "12px", color: "#fff", fontWeight: "500" }}>{notif.text}</div>
                        <div style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>{notif.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Coach Profile Trigger */}
          <div 
            className="coach-profile" 
            onClick={() => {
              setIsProfileOpen(true);
              setIsNotificationsOpen(false);
            }}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
          >
            <div className="coach-avatar" style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {coachImage ? (
                <img
                  src={coachImage}
                  alt="Coach"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                />
              ) : (
                "CP"
              )}
            </div>

            <div>
              <strong>Head Performance</strong>
              <small>Administrator</small>
            </div>

            <ChevronDown size={14} />
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(7, 12, 20, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(6px)" }}>
          <div style={{ background: "#0D1527", border: "1px solid #334155", borderRadius: "20px", width: "440px", padding: "32px", boxShadow: "0 20px 50px rgba(0,0,0,0.8)", position: "relative", color: "#fff", fontFamily: "sans-serif" }}>
            
            <button 
              onClick={() => setIsProfileOpen(false)}
              style={{ position: "absolute", top: "20px", right: "20px", background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
            >
              <X size={20} />
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>Coach Profile Dashboard</h3>
              <button 
                onClick={() => {
                  if (isEditing) handleSaveDetails();
                  else setIsEditing(true);
                }}
                style={{ background: "transparent", border: "1px solid #334155", color: "#38bdf8", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Edit3 size={12} /> {isEditing ? "Save Info" : "Edit Phone"}
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ width: "85px", height: "85px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "2px solid #38bdf8", marginBottom: "12px", boxShadow: "0 0 20px rgba(56,189,248,0.4)" }}>
                {coachImage ? (
                  <img src={coachImage} alt="Coach" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "28px", fontWeight: "bold", color: "#fff" }}>CP</span>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <label style={{ background: "#2563eb", color: "#fff", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 12px rgba(37,99,235,0.4)" }}>
                  <Upload size={12} /> Upload Photo
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                </label>

                {coachImage && (
                  <button 
                    onClick={handleRemoveImage}
                    style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "#141E33", padding: "16px", borderRadius: "12px", border: "1px solid #1e293b", fontSize: "13px" }}>
              
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#94a3b8" }}>
                <Phone size={16} color="#38bdf8" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>Mobile Number</div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={coachPhone} 
                      onChange={(e) => setCoachPhone(e.target.value)}
                      style={{ background: "#0D1527", border: "1px solid #38bdf8", color: "#fff", borderRadius: "6px", padding: "4px 8px", width: "100%", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                    />
                  ) : (
                    <span style={{ color: "#fff", fontWeight: "bold" }}>{coachPhone}</span>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#94a3b8" }}>
                <Mail size={16} color="#38bdf8" />
                <div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>Email Address</div>
                  <span style={{ color: "#fff" }}>{coachEmail}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#94a3b8" }}>
                <Award size={16} color="#38bdf8" />
                <div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>Specialization</div>
                  <span style={{ color: "#fff" }}>Elite Overload & Training Intelligence</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#94a3b8" }}>
                <Users size={16} color="#38bdf8" />
                <div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>Active Roster</div>
                  <span style={{ color: "#fff" }}>400 Monitored Athletes</span>
                </div>
              </div>

            </div>

            <button 
              onClick={() => {
                handleSaveDetails();
                setIsProfileOpen(false);
              }}
              style={{ width: "100%", marginTop: "20px", background: "#2563eb", color: "#fff", border: "none", padding: "11px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 12px rgba(37,99,235,0.4)" }}
            >
              Save & Close
            </button>

          </div>
        </div>
      )}
    </>
  );
}

export default Header;