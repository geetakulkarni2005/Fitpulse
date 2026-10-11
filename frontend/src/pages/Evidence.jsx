import React, { useState } from "react";
import { BookOpen, ShieldCheck, Search, AlertCircle, FileText } from "lucide-react";

function Evidence() {
  const [searchTerm, setSearchTerm] = useState("");

  const evidenceList = [
    { id: 1, title: "Hamstring Pull", category: "Sprint & Overload", description: "Injury and training-related evidence regarding hamstring strains during high-speed running." },
    { id: 2, title: "Adductor Groin Strain", category: "Lower Body", description: "Monitoring metrics and thresholds to prevent groin tightness and sudden tears." },
    { id: 3, title: "Hip Flexor Tightness", category: "Flexibility & Mobility", description: "Impact of accumulated fatigue on hip mobility and stride efficiency." },
    { id: 4, title: "Achilles Tendinopathy", category: "Tendons", description: "Tracking repetitive load progression and recovery scores to avoid chronic Achilles flare-ups." },
    { id: 5, title: "Shin Splints", category: "Impact Stress", description: "Managing cumulative impact stress during intensive running and multidirectional drills." }
  ];

  const filteredEvidence = evidenceList.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", color: "#fff", fontFamily: "sans-serif" }}>
      
      {/* Header Section */}
      <div style={{ background: "#0D1527", border: "1px solid #334155", borderRadius: "16px", padding: "24px" }}>
        <div style={{ fontSize: "11px", color: "#38bdf8", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "1px", marginBottom: "4px" }}>Evidence Base</div>
        <h2 style={{ fontSize: "22px", fontWeight: "bold", margin: "0 0 6px 0" }}>Evidence Knowledge Hub</h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>Evidence-based information and research utilized by FitPulse for accurate athlete recommendations.</p>

        {/* Stats Badges */}
        <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
          <div style={{ background: "#141E33", border: "1px solid #1e293b", padding: "10px 16px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
            <FileText size={18} color="#38bdf8" />
            <div>
              <div style={{ fontSize: "10px", color: "#64748b" }}>Evidence Records</div>
              <div style={{ fontSize: "15px", fontWeight: "bold" }}>{evidenceList.length} Active</div>
            </div>
          </div>

          <div style={{ background: "#141E33", border: "1px solid #1e293b", padding: "10px 16px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
            <ShieldCheck size={18} color="#34d399" />
            <div>
              <div style={{ fontSize: "10px", color: "#64748b" }}>Knowledge Base</div>
              <div style={{ fontSize: "15px", fontWeight: "bold" }}>100m Sprint & Overload</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar for Evidence */}
      <div style={{ display: "flex", alignItems: "center", background: "#0D1527", border: "1px solid #334155", borderRadius: "12px", padding: "10px 16px", gap: "10px" }}>
        <Search size={16} color="#94a3b8" />
        <input 
          type="text" 
          placeholder="Search evidence records by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ background: "transparent", border: "none", color: "#fff", outline: "none", width: "100%", fontSize: "13px" }}
        />
      </div>

      {/* Relevant Evidence Grid */}
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "14px" }}>Relevant Evidence Items</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {filteredEvidence.length > 0 ? (
            filteredEvidence.map((item) => (
              <div key={item.id} style={{ background: "#0D1527", border: "1px solid #334155", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "10px", background: "rgba(56,189,248,0.1)", color: "#38bdf8", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold" }}>{item.category}</span>
                    <BookOpen size={15} color="#94a3b8" />
                  </div>
                  <h4 style={{ fontSize: "15px", fontWeight: "bold", color: "#fff", margin: "0 0 6px 0" }}>{item.title}</h4>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: "1.5" }}>{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "30px", color: "#64748b", background: "#0D1527", borderRadius: "12px", border: "1px solid #334155" }}>
              No matching evidence records found.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Evidence;