import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function RiskTrendChart({ data = [] }) {
  return (
    <div className="chart-card">

      <div className="chart-header">
        <div>
          <h2>Risk Trend</h2>
          <p>Overload risk across training sessions</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="empty-state">
          No risk trend data available.
        </div>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="session"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                domain={[0, 1]}
                tick={{ fontSize: 12 }}
              />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="Low"
                strokeWidth={2}
                dot={{ r: 3 }}
              />

              <Line
                type="monotone"
                dataKey="Moderate"
                strokeWidth={2}
                dot={{ r: 3 }}
              />

              <Line
                type="monotone"
                dataKey="High"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
}

export default RiskTrendChart;