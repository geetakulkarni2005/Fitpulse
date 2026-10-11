import { AlertTriangle, CheckCircle, Activity } from "lucide-react";

function RiskCard({
  title = "Overload Risk",
  risk = "Unknown",
  probability = null,
}) {
  const normalizedRisk = String(risk).toLowerCase();

  const isHigh = normalizedRisk === "high";
  const isModerate = normalizedRisk === "moderate";
  const isLow = normalizedRisk === "low";

  const Icon = isHigh
    ? AlertTriangle
    : isModerate
      ? Activity
      : CheckCircle;

  return (
    <div className="risk-card">

      <div className="risk-card-top">
        <div className={`risk-card-icon risk-${normalizedRisk}`}>
          <Icon size={22} />
        </div>

        {probability !== null && (
          <span className="risk-probability">
            {(Number(probability) * 100).toFixed(1)}%
          </span>
        )}
      </div>

      <div className="risk-card-content">
        <span>{title}</span>

        <h2 className={`risk-${normalizedRisk}`}>
          {risk}
        </h2>
      </div>

    </div>
  );
}

export default RiskCard;