import React, { useState, useEffect } from "react";
import { Edit3, Save, Trash2, CheckCircle } from "lucide-react";

function CoachNotes() {
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem("fitpulse_coach_notes") || "";
  });
  const [saved, setSaved] = useState(false);

  const handleSaveNotes = () => {
    localStorage.setItem("fitpulse_coach_notes", notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearNotes = () => {
    setNotes("");
    localStorage.removeItem("fitpulse_coach_notes");
  };

  return (
    <div style={{ background: "#0D1527", border: "1px solid #334155", borderRadius: "16px", padding: "20px", color: "#fff", marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Edit3 size={18} color="#38bdf8" />
          <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>Coach Daily Training Notes</h3>
        </div>
        {saved && (
          <span style={{ fontSize: "12px", color: "#34d399", display: "flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle size={14} /> Saved Successfully!
          </span>
        )}
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Type important session observations, athlete reminders, or overload instructions here..."
        style={{ width: "100%", height: "100px", background: "#141E33", border: "1px solid #1e293b", borderRadius: "8px", color: "#fff", padding: "12px", fontSize: "13px", resize: "none", outline: "none", boxSizing: "border-box" }}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
        <button
          onClick={handleClearNotes}
          style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Trash2 size={13} /> Clear
        </button>

        <button
          onClick={handleSaveNotes}
          style={{ background: "#2563eb", color: "#fff", border: "none", padding: "6px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 12px rgba(37,99,235,0.4)" }}
        >
          <Save size={13} /> Save Notes
        </button>
      </div>
    </div>
  );
}

export default CoachNotes;