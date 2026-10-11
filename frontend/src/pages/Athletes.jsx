import React, { useState, useEffect } from "react";
import { Users, Search, ChevronRight, X, Edit3, CheckCircle2, Calendar, Award, Dumbbell, Activity, Upload, Plus, Trash2 } from "lucide-react";

export default function Athletes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [activeDay, setActiveDay] = useState("Mon");
  const [isEditing, setIsEditing] = useState(false);
  const [tempImage, setTempImage] = useState("");
  
  // State for editing training plan
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [customPlans, setCustomPlans] = useState(() => {
    const savedPlans = localStorage.getItem("fitpulse_custom_plans");
    return savedPlans ? JSON.parse(savedPlans) : {};
  });

  // Default training plan template
  const defaultTrainingPlan = {
    Mon: [
      { activity: "Warm Up", duration: "10 min" },
      { activity: "Sprint Drills", duration: "40 min" },
      { activity: "Cool Down", duration: "10 min" }
    ],
    Tue: [
      { activity: "Dynamic Stretching", duration: "15 min" },
      { activity: "Endurance Running", duration: "45 min" },
      { activity: "Core Stability", duration: "20 min" }
    ],
    Wed: [
      { activity: "Mobility Drills", duration: "15 min" },
      { activity: "Agility Training", duration: "35 min" },
      { activity: "Hydro-Therapy", duration: "20 min" }
    ],
    Thu: [
      { activity: "Light Jogging", duration: "20 min" },
      { activity: "Technique Focus", duration: "30 min" }
    ],
    Fri: [
      { activity: "Speed Workouts", duration: "40 min" },
      { activity: "Resistance Training", duration: "30 min" }
    ],
    Sat: [
      { activity: "Simulated Race Pace", duration: "50 min" },
      { activity: "Ice Bath Recovery", duration: "15 min" }
    ],
    Sun: [
      { activity: "Active Rest & Recovery", duration: "Day Off" }
    ]
  };

  // 400 ID-based Athletes Generator with LocalStorage Persistence
  const [athletesList, setAthletesList] = useState(() => {
    const savedData = localStorage.getItem("fitpulse_athletes_roster");
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Error loading saved athletes", e);
      }
    }

    return Array.from({ length: 400 }, (_, index) => {
      const idNum = index + 1;
      const formattedId = `A${String(idNum).padStart(3, '0')}`;
      const riskTypes = ["LOW", "MODERATE", "HIGH"];
      const risk = riskTypes[(index * 7) % 3];
      const score = risk === "HIGH" ? 75 + (index % 20) : risk === "MODERATE" ? 45 + (index % 25) : 15 + (index % 25);
      
      return {
        id: formattedId,
        label: `Athlete ${formattedId}`,
        age: 16 + (index % 9),
        gender: index % 2 === 0 ? "Female" : "Male",
        event: index % 3 === 0 ? "100m / 400m" : index % 3 === 1 ? "400m Hurdles" : "Long Jump",
        risk: risk,
        score: score,
        experience: `${2 + (index % 6)} years`,
        height: `${158 + (index % 12)} cm`,
        weight: `${52 + (index % 18)} kg`,
        bmi: `${(20 + (index % 3) + 0.5).toFixed(1)} (Healthy)`,
        customImage: "",
        achievements: [
          `College Athletics Champion (${2025 - (index % 2)})`,
          `100m – ${index % 3 + 1}rd Place (Inter-College)`,
          `400m – ${5 + (index % 3)}th Place (District Level)`
        ]
      };
    });
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("fitpulse_athletes_roster", JSON.stringify(athletesList));
  }, [athletesList]);

  useEffect(() => {
    localStorage.setItem("fitpulse_custom_plans", JSON.stringify(customPlans));
  }, [customPlans]);

  useEffect(() => {
    if (selectedAthlete) {
      const current = athletesList.find(a => a.id === selectedAthlete.id);
      if (current) {
        setSelectedAthlete(current);
      }
    }
  }, [athletesList]);

  // Get training plan for selected athlete (fallback to default)
  const athletePlan = (selectedAthlete && customPlans[selectedAthlete.id]) || defaultTrainingPlan;

  const filteredAthletes = athletesList.filter(ath => {
    const matchesSearch = ath.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ath.event.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === "ALL" || ath.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = () => {
    if (tempImage.trim() !== "") {
      const updatedList = athletesList.map(item => 
        item.id === selectedAthlete.id ? { ...item, customImage: tempImage } : item
      );
      setAthletesList(updatedList);
      setSelectedAthlete({ ...selectedAthlete, customImage: tempImage });
    }
    setIsEditing(false);
    setTempImage("");
  };

  // Update training plan activity
  const handleUpdateActivity = (day, index, field, value) => {
    const currentPlan = JSON.parse(JSON.stringify(athletePlan));
    currentPlan[day][index][field] = value;
    setCustomPlans({
      ...customPlans,
      [selectedAthlete.id]: currentPlan
    });
  };

  const handleAddActivity = (day) => {
    const currentPlan = JSON.parse(JSON.stringify(athletePlan));
    if (!currentPlan[day]) currentPlan[day] = [];
    currentPlan[day].push({ activity: "New Drills", duration: "20 min" });
    setCustomPlans({
      ...customPlans,
      [selectedAthlete.id]: currentPlan
    });
  };

  const handleDeleteActivity = (day, index) => {
    const currentPlan = JSON.parse(JSON.stringify(athletePlan));
    currentPlan[day].splice(index, 1);
    setCustomPlans({
      ...customPlans,
      [selectedAthlete.id]: currentPlan
    });
  };

  return (
    <div style={{ padding: "32px", paddingTop: "90px", backgroundColor: "#070C14", minHeight: "100vh", color: "#f1f5f9", fontFamily: "sans-serif", maxWidth: "1600px", margin: "0 auto" }}>
      <style>{`
        .card { background-color: #0D1527; border: 1px solid #1e293b; border-radius: 16px; padding: 24px; box-shadow: 0 6px 24px rgba(0,0,0,0.5); }
        .input-box { background: #141E33; border: 1px solid #334155; border-radius: 10px; padding: 12px 16px; color: #fff; outline: none; width: 100%; font-size: 14px; }
        .badge { padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; display: inline-flex; align-items: center; gap: 6px; }
        .badge-low { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
        .badge-moderate { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
        .badge-high { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
        .table-row { border-bottom: 1px solid #1e293b; transition: background 0.2s; cursor: pointer; }
        .table-row:hover { background: #141E33; }
        
        .stat-box { background: #141E33; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; text-align: center; }
        .day-tab { padding: 8px 12px; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer; border: 1px solid #1e293b; background: #141E33; color: #94a3b8; transition: all 0.2s; text-align: center; }
        .day-tab.active { background: #2563eb; color: #fff; border-color: #2563eb; }
        .plan-row { display: flex; justify-content: space-between; align-items: center; background: #141E33; border: 1px solid #1e293b; border-radius: 8px; padding: 12px 16px; margin-bottom: 8px; }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(7, 12, 20, 0.85); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(6px); overflow-y: auto; padding: 40px 20px; }
        .modal-content { background: #0D1527; border: 1px solid #334155; border-radius: 20px; width: 920px; max-height: 90vh; overflow-y: auto; padding: 36px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); position: relative; }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "bold", letterSpacing: "0.5px" }}>ATHLETE MANAGEMENT MODULE</span>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#ffffff", margin: "4px 0 0 0" }}>Athletes Directory</h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
            Monitor all 400 athletes by ID. Click any row to inspect their profile dashboard.
          </p>
        </div>
        <div style={{ background: "#0D1527", border: "1px solid #1e293b", padding: "10px 18px", borderRadius: "10px", fontSize: "12px", color: "#38bdf8", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
          👥 Total Roster: <strong style={{ color: "#34d399" }}>400 Athletes</strong>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="card" style={{ padding: "20px", marginBottom: "24px", display: "flex", gap: "16px", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={18} color="#94a3b8" style={{ position: "absolute", top: "15px", left: "16px" }} />
          <input
            type="text"
            className="input-box"
            placeholder="Search athlete by ID (e.g. A045)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "45px", margin: 0 }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Filter Risk:</span>
          <select 
            value={riskFilter} 
            onChange={(e) => setRiskFilter(e.target.value)}
            style={{ background: "#141E33", border: "1px solid #334155", borderRadius: "10px", padding: "10px 14px", color: "#fff", outline: "none", fontSize: "13px" }}
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MODERATE">Moderate Risk</option>
            <option value="HIGH">High Risk</option>
          </select>
        </div>
      </div>

      {/* ATHLETES TABLE */}
      <div className="card">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", fontSize: "12px" }}>
              <th style={{ padding: "14px" }}>ATHLETE ID</th>
              <th style={{ padding: "14px" }}>AGE</th>
              <th style={{ padding: "14px" }}>GENDER</th>
              <th style={{ padding: "14px" }}>EVENT</th>
              <th style={{ padding: "14px" }}>RISK LEVEL</th>
              <th style={{ padding: "14px", textAlign: "right" }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredAthletes.map((ath, index) => (
              <tr key={index} className="table-row" onClick={() => setSelectedAthlete(ath)}>
                <td style={{ padding: "16px 14px", fontWeight: "bold", color: "#38bdf8", display: "flex", alignItems: "center", gap: "12px" }}>
                  {ath.customImage ? (
                    <img 
                      src={ath.customImage} 
                      alt="Avatar" 
                      style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "2px solid #38bdf8" }} 
                    />
                  ) : (
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: "12px" }}>
                      {ath.id.slice(1)}
                    </div>
                  )}
                  <div>
                    <div style={{ color: "#fff", fontSize: "14px" }}>{ath.label}</div>
                    <div style={{ fontSize: "11px", color: "#38bdf8", fontWeight: "normal" }}>Profile Dashboard</div>
                  </div>
                </td>
                <td style={{ padding: "16px 14px", color: "#cbd5e1" }}>{ath.age}</td>
                <td style={{ padding: "16px 14px", color: "#cbd5e1" }}>{ath.gender}</td>
                <td style={{ padding: "16px 14px", color: "#cbd5e1" }}>{ath.event}</td>
                <td style={{ padding: "16px 14px" }}>
                  <span className={`badge ${ath.risk === "HIGH" ? "badge-high" : ath.risk === "MODERATE" ? "badge-moderate" : "badge-low"}`}>
                    {ath.risk}
                  </span>
                </td>
                <td style={{ padding: "16px 14px", textAlign: "right" }}>
                  <span style={{ color: "#38bdf8", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    Open <ChevronRight size={16} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ATHLETE PROFILE DASHBOARD MODAL */}
      {selectedAthlete && (
        <div className="modal-overlay" onClick={() => setSelectedAthlete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={() => { setSelectedAthlete(null); setIsEditing(false); setIsEditingPlan(false); }}
              style={{ position: "absolute", top: "24px", right: "24px", background: "#141E33", border: "1px solid #334155", borderRadius: "50%", width: "36px", height: "36px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <X size={18} />
            </button>

            <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#fff", marginBottom: "20px" }}>Athlete Profile</h2>

            {/* Profile Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", background: "#141E33", padding: "20px", borderRadius: "14px", border: "1px solid #1e293b" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                {tempImage || selectedAthlete.customImage ? (
                  <img 
                    src={tempImage || selectedAthlete.customImage} 
                    alt="Profile" 
                    style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "3px solid #38bdf8", boxShadow: "0 0 20px rgba(56,189,248,0.4)" }} 
                  />
                ) : (
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #2563eb, #38bdf8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 0 20px rgba(56,189,248,0.4)" }}>
                    <Users size={38} />
                  </div>
                )}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#fff", margin: 0 }}>{selectedAthlete.label}</h3>
                  </div>
                  <span style={{ fontSize: "12px", color: "#38bdf8" }}>Risk Score: <strong style={{ color: "#f87171" }}>{selectedAthlete.score}/100</strong></span>
                </div>
              </div>

              <div>
                {!isEditing ? (
                  <button 
                    onClick={() => { setIsEditing(true); setTempImage(selectedAthlete.customImage || ""); }}
                    style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 22px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px" }}
                  >
                    <Edit3 size={14} /> Edit Photo
                  </button>
                ) : (
                  <button 
                    onClick={handleSaveImage}
                    style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 22px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px" }}
                  >
                    <CheckCircle2 size={14} /> Save
                  </button>
                )}
              </div>
            </div>

            {/* Select Photo Upload Option */}
            {isEditing && (
              <div style={{ background: "#141E33", border: "2px dashed #38bdf8", borderRadius: "14px", padding: "20px", marginBottom: "20px", textAlign: "center" }}>
                <label style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "rgba(56,189,248,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8" }}>
                    <Upload size={22} />
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: "bold", color: "#fff" }}>Select Photo from Gallery / Device</span>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Click here to browse your device files</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    style={{ display: "none" }} 
                  />
                </label>
              </div>
            )}

            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" }}>
              <div className="stat-box">
                <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Age</div>
                <div style={{ fontSize: "22px", fontWeight: "bold", color: "#fff", marginTop: "4px" }}>{selectedAthlete.age}</div>
              </div>
              <div className="stat-box">
                <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Gender</div>
                <div style={{ fontSize: "22px", fontWeight: "bold", color: "#fff", marginTop: "4px" }}>{selectedAthlete.gender}</div>
              </div>
              <div className="stat-box">
                <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Primary Event</div>
                <div style={{ fontSize: "15px", fontWeight: "bold", color: "#38bdf8", marginTop: "6px" }}>{selectedAthlete.event}</div>
              </div>
              <div className="stat-box">
                <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Experience</div>
                <div style={{ fontSize: "22px", fontWeight: "bold", color: "#34d399", marginTop: "4px" }}>{selectedAthlete.experience}</div>
              </div>
            </div>

            {/* Physical Details & Goals */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div style={{ background: "#141E33", border: "1px solid #1e293b", borderRadius: "14px", padding: "20px" }}>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "#cbd5e1", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Activity size={16} color="#38bdf8" /> Academic & Physical Details
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                  <div style={{ background: "#0D1527", padding: "12px", borderRadius: "10px", textAlign: "center", border: "1px solid #1e293b" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>Height</div>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fff", marginTop: "4px" }}>{selectedAthlete.height}</div>
                  </div>
                  <div style={{ background: "#0D1527", padding: "12px", borderRadius: "10px", textAlign: "center", border: "1px solid #1e293b" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>Weight</div>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fff", marginTop: "4px" }}>{selectedAthlete.weight}</div>
                  </div>
                  <div style={{ background: "#0D1527", padding: "12px", borderRadius: "10px", textAlign: "center", border: "1px solid #1e293b" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>BMI</div>
                    <div style={{ fontSize: "14px", fontWeight: "bold", color: "#34d399", marginTop: "4px" }}>{selectedAthlete.bmi}</div>
                  </div>
                </div>
              </div>

              <div style={{ background: "#141E33", border: "1px solid #1e293b", borderRadius: "14px", padding: "20px" }}>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "#cbd5e1", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Award size={16} color="#38bdf8" /> Goals
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "#cbd5e1" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#34d399" /> Improve performance</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#34d399" /> Reduce injury risk</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={15} color="#34d399" /> Build endurance</div>
                </div>
              </div>
            </div>

            {/* Recent Achievements with Running Athlete Logo Illustration */}
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "16px", background: "#141E33", border: "1px solid #1e293b", borderRadius: "14px", padding: "20px", marginBottom: "20px", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "#cbd5e1", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Award size={16} color="#38bdf8" /> Recent Achievements
                </div>
                <ul style={{ paddingLeft: "20px", color: "#94a3b8", fontSize: "13px", lineHeight: "1.8", margin: 0 }}>
                  {selectedAthlete.achievements.map((ach, idx) => (
                    <li key={idx}><strong style={{ color: "#fff" }}>{ach}</strong></li>
                  ))}
                </ul>
              </div>

              {/* Running Athlete Graphic Logo Illustration */}
              <div style={{ textAlign: "center", background: "#0D1527", padding: "14px", borderRadius: "12px", border: "1px solid #1e293b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "65px", height: "65px", borderRadius: "50%", background: "rgba(37,99,235,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px", border: "2px solid #38bdf8", boxShadow: "0 0 15px rgba(56,189,248,0.3)" }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="19" cy="4" r="2"></circle>
                    <path d="M10.5 13.5L13 11l-2-4-3 2"></path>
                    <path d="M14 17l-3-3-2 3v3"></path>
                    <path d="M5 21l3-5.5L7 13l-3 3"></path>
                    <path d="M19 15l-3-2 1-3.5"></path>
                  </svg>
                </div>
                <div style={{ fontSize: "12px", fontWeight: "bold", color: "#38bdf8" }}>Elite Sprint Track</div>
                <div style={{ fontSize: "9px", color: "#94a3b8", marginTop: "2px" }}>High Velocity Performance</div>
              </div>
            </div>

            {/* Weekly Training Plan with Interactive Editor */}
            <div style={{ background: "#141E33", border: "1px solid #1e293b", borderRadius: "14px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "#cbd5e1", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Calendar size={16} color="#38bdf8" /> Weekly Training Plan (Interactive Editor)
                </div>
                <button 
                  onClick={() => setIsEditingPlan(!isEditingPlan)}
                  style={{ background: isEditingPlan ? "#10b981" : "#334155", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 14px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                >
                  {isEditingPlan ? "Done Editing" : "Edit Plan"}
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", marginBottom: "16px" }}>
                {Object.keys(athletePlan).map((day) => (
                  <div 
                    key={day} 
                    className={`day-tab ${activeDay === day ? "active" : ""}`}
                    onClick={() => setActiveDay(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div>
                {(athletePlan[activeDay] || []).map((item, idx) => (
                  <div key={idx} className="plan-row">
                    {!isEditingPlan ? (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#fff", fontWeight: "bold", fontSize: "13px" }}>
                          <Dumbbell size={15} color="#38bdf8" /> {item.activity}
                        </div>
                        <div style={{ color: "#34d399", fontWeight: "bold", fontSize: "13px" }}>
                          {item.duration}
                        </div>
                      </>
                    ) : (
                      <div style={{ display: "flex", width: "100%", gap: "10px", alignItems: "center" }}>
                        <input 
                          type="text" 
                          value={item.activity} 
                          onChange={(e) => handleUpdateActivity(activeDay, idx, "activity", e.target.value)}
                          className="input-box"
                          style={{ padding: "6px 10px", fontSize: "12px" }}
                        />
                        <input 
                          type="text" 
                          value={item.duration} 
                          onChange={(e) => handleUpdateActivity(activeDay, idx, "duration", e.target.value)}
                          className="input-box"
                          style={{ padding: "6px 10px", fontSize: "12px", width: "100px" }}
                        />
                        <button 
                          onClick={() => handleDeleteActivity(activeDay, idx)}
                          style={{ background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid #ef4444", borderRadius: "6px", padding: "6px", cursor: "pointer" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {isEditingPlan && (
                  <button 
                    onClick={() => handleAddActivity(activeDay)}
                    style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid #38bdf8", borderRadius: "8px", padding: "8px 16px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", width: "100%", justifyContent: "center", marginTop: "10px" }}
                  >
                    <Plus size={14} /> Add Workout Activity
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}