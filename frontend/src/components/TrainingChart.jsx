import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function TrainingChart({ data = [] }) {
  return (
    <div className="chart-card">

      <div className="chart-header">
        <div>
          <h2>Training Load</h2>
          <p>Training load across recent sessions</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="empty-state">
          No training data available.
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
                tick={{ fontSize: 12 }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="training_load"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
}

export default TrainingChart;