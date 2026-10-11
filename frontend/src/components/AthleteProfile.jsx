import { useEffect, useState } from "react";
import {
  User,
  Activity,
  HeartPulse,
  ShieldAlert,
  TrendingUp,
  Moon,
} from "lucide-react";
import { getTrainingHistory } from "../services/trainingApi";

function getValue(object, fields, fallback = "N/A") {
  for (const field of fields) {
    if (
      object?.[field] !== undefined &&
      object?.[field] !== null &&
      object[field] !== ""
    ) {
      return object[field];
    }
  }

  return fallback;
}

function getRiskClass(risk) {
  const value = String(risk || "Low").toLowerCase();

  if (value.includes("high")) return "high";
  if (value.includes("moderate")) return "moderate";

  return "low";
}

function getRiskValue(session) {
  return getValue(
    session,
    [
      "Overload_Risk",
      "overload_risk",
      "Risk",
      "risk",
      "Risk_Level",
      "risk_level",
    ],
    "Low"
  );
}

function getNumber(session, fields, fallback = 0) {
  const value = getValue(session, fields, fallback);
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function AthleteProfile({ athlete }) {
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [loadingTraining, setLoadingTraining] = useState(true);
  const [trainingError, setTrainingError] = useState("");

  const athleteId = getValue(
    athlete,
    ["Athlete_ID", "athlete_id", "id"],
    ""
  );

  const name = getValue(
    athlete,
    ["Athlete_Name", "athlete_name", "Name", "name"],
    athleteId
  );

  const age = getValue(
    athlete,
    ["Age", "age"],
    "N/A"
  );

  const gender = getValue(
    athlete,
    ["Gender", "gender", "Sex", "sex"],
    "N/A"
  );

  const event = getValue(
    athlete,
    ["Event", "event", "Event_Type", "event_type"],
    "100m Sprint"
  );

  useEffect(() => {
    let cancelled = false;

    async function loadTrainingHistory() {
      if (!athleteId) {
        setTrainingHistory([]);
        setLoadingTraining(false);
        return;
      }

      try {
        setLoadingTraining(true);
        setTrainingError("");

        const result = await getTrainingHistory(athleteId);

        const history = Array.isArray(result?.training_history)
          ? result.training_history
          : Array.isArray(result)
          ? result
          : [];

        if (!cancelled) {
          setTrainingHistory(history);
        }
      } catch (error) {
        console.error("Failed to load athlete training history:", error);

        if (!cancelled) {
          setTrainingHistory([]);
          setTrainingError("Unable to load training data.");
        }
      } finally {
        if (!cancelled) {
          setLoadingTraining(false);
        }
      }
    }

    loadTrainingHistory();

    return () => {
      cancelled = true;
    };
  }, [athleteId]);

  const latestSession =
    trainingHistory.length > 0
      ? trainingHistory[trainingHistory.length - 1]
      : null;

  const latestRisk = latestSession
    ? getRiskValue(latestSession)
    : getValue(
        athlete,
        ["Overload_Risk", "overload_risk", "Risk", "risk"],
        "Low"
      );

  const latestTrainingLoad = latestSession
    ? getValue(
        latestSession,
        ["Training_Load", "TrainingLoad", "training_load"],
        "—"
      )
    : "—";

  const latestFatigue = latestSession
    ? getNumber(latestSession, ["Fatigue", "fatigue"], 0)
    : 0;

  const latestSoreness = latestSession
    ? getNumber(latestSession, ["Soreness", "soreness"], 0)
    : 0;

  const latestPain = latestSession
    ? getNumber(latestSession, ["Pain", "pain"], 0)
    : 0;

  const latestRecovery = latestSession
    ? getNumber(
        latestSession,
        ["Recovery", "Perceived_Recovery", "Perceived Recovery", "recovery"],
        0
      )
    : 0;

  const latestSleep = latestSession
    ? getNumber(
        latestSession,
        ["Sleep", "Sleep_Hours", "SleepHours", "sleep"],
        0
      )
    : 0;

  const riskClass = getRiskClass(latestRisk);

  const riskTrend = trainingHistory.slice(-30);

  const issues = [];

  if (latestPain > 0) {
    issues.push(`Pain reported: ${latestPain}/10`);
  }

  if (latestSoreness > 0) {
    issues.push(`Soreness reported: ${latestSoreness}/10`);
  }

  if (latestFatigue >= 7) {
    issues.push(`High fatigue: ${latestFatigue}/10`);
  }

  if (latestRecovery > 0 && latestRecovery <= 3) {
    issues.push(`Low recovery: ${latestRecovery}/10`);
  }

  return (
    <div className="athlete-profile">
      <div className="athlete-profile-header">
        <div className="athlete-profile-avatar">
          <User size={28} />
        </div>

        <div>
          <div className="dashboard-eyebrow">
            ATHLETE PROFILE
          </div>

          <h1>{name}</h1>

          <p>
            {gender} • {age} years • {event}
          </p>
        </div>

        <div className={`risk-badge ${riskClass}`}>
          {String(latestRisk).toUpperCase()}
        </div>
      </div>

      <div className="athlete-profile-details">
        <div>
          <span>Athlete ID</span>
          <strong>{athleteId}</strong>
        </div>

        <div>
          <span>Gender</span>
          <strong>{gender}</strong>
        </div>

        <div>
          <span>Age</span>
          <strong>{age} years</strong>
        </div>

        <div>
          <span>Event</span>
          <strong>{event}</strong>
        </div>
      </div>

      {loadingTraining ? (
        <div className="dashboard-panel">
          <div className="empty-state">
            Loading training data...
          </div>
        </div>
      ) : trainingError ? (
        <div className="dashboard-panel">
          <div className="empty-state">
            {trainingError}
          </div>
        </div>
      ) : (
        <>
          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Current Status</h2>
                <p>Latest recorded athlete status.</p>
              </div>
            </div>

            <div className="dashboard-summary-grid">
              <div className="dashboard-summary-card">
                <div className="summary-icon cyan">
                  <ShieldAlert size={20} />
                </div>

                <div>
                  <span>Current Risk</span>
                  <strong className={`risk-${riskClass}`}>
                    {String(latestRisk).toUpperCase()}
                  </strong>
                </div>
              </div>

              <div className="dashboard-summary-card">
                <div className="summary-icon cyan">
                  <Activity size={20} />
                </div>

                <div>
                  <span>Training Load</span>
                  <strong>
                    {latestTrainingLoad}
                    {latestTrainingLoad !== "—" ? " AU" : ""}
                  </strong>
                </div>
              </div>

              <div className="dashboard-summary-card">
                <div className="summary-icon cyan">
                  <HeartPulse size={20} />
                </div>

                <div>
                  <span>Recovery</span>
                  <strong>{latestRecovery}/10</strong>
                </div>
              </div>

              <div className="dashboard-summary-card">
                <div className="summary-icon cyan">
                  <Moon size={20} />
                </div>

                <div>
                  <span>Sleep</span>
                  <strong>{latestSleep} h</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Overload Risk Trend</h2>
                <p>Recent risk measurements.</p>
              </div>

              <span>{trainingHistory.length} sessions</span>
            </div>

            {riskTrend.length === 0 ? (
              <div className="empty-state">
                No training data available.
              </div>
            ) : (
              <div className="risk-trend-list">
                {riskTrend.map((session, index) => {
                  const risk = getRiskValue(session);
                  const riskClassName = getRiskClass(risk);

                  return (
                    <div
                      className="risk-trend-row"
                      key={`${athleteId}-${index}`}
                    >
                      <span>
                        Session{" "}
                        {getValue(
                          session,
                          ["Session_ID", "Session", "session_id"],
                          index + 1
                        )}
                      </span>

                      <strong className={`risk-${riskClassName}`}>
                        {risk}
                      </strong>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Risk Factors</h2>
                <p>Current athlete indicators.</p>
              </div>
            </div>

            <div className="metric-grid">
              <div className="metric-box">
                <span>Fatigue</span>
                <strong>{latestFatigue}</strong>
              </div>

              <div className="metric-box">
                <span>Soreness</span>
                <strong>{latestSoreness}</strong>
              </div>

              <div className="metric-box">
                <span>Pain</span>
                <strong>{latestPain}</strong>
              </div>

              <div className="metric-box">
                <span>Low Recovery</span>
                <strong>{latestRecovery <= 3 ? 1 : 0}</strong>
              </div>
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Training Load</h2>
                <p>Recent training workload.</p>
              </div>
            </div>

            <div className="metric-grid">
              <div className="metric-box">
                <span>Latest</span>
                <strong>
                  {latestTrainingLoad}
                  {latestTrainingLoad !== "—" ? " AU" : ""}
                </strong>
              </div>

              <div className="metric-box">
                <span>Sessions</span>
                <strong>{trainingHistory.length}</strong>
              </div>
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Recovery Status</h2>
                <p>Latest recorded values.</p>
              </div>
            </div>

            <div className="metric-grid">
              <div className="metric-box">
                <span>Fatigue</span>
                <strong>{latestFatigue}/10</strong>
              </div>

              <div className="metric-box">
                <span>Soreness</span>
                <strong>{latestSoreness}/10</strong>
              </div>

              <div className="metric-box">
                <span>Pain</span>
                <strong>{latestPain}/10</strong>
              </div>

              <div className="metric-box">
                <span>Recovery</span>
                <strong>{latestRecovery}/10</strong>
              </div>

              <div className="metric-box">
                <span>Sleep</span>
                <strong>{latestSleep} h</strong>
              </div>
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Current / Recent Issues</h2>
                <p>Information from the latest session.</p>
              </div>
            </div>

            {issues.length === 0 ? (
              <div className="empty-state">
                No pain reported
              </div>
            ) : (
              <div className="issue-list">
                {issues.map((issue, index) => (
                  <div className="issue-item" key={index}>
                    <span>!</span>
                    <strong>{issue}</strong>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default AthleteProfile;