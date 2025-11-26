import React from "react";
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

const AnalyticsChart = ({ data }) => {
  if (!data) return <p>No chart data available.</p>;

  const chartData = data.labels.map((label, i) => ({
    day: label,
    views: data.views[i],
    engagement: data.engagement[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="views"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="engagement"
          stroke="#8B5CF6"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AnalyticsChart;
