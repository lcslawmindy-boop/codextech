import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DATA = [
  { month: "Jan 2024", value: 500000, grantedValue: 0 },
  { month: "Mar 2024", value: 1200000, grantedValue: 0 },
  { month: "Jun 2024", value: 2100000, grantedValue: 0 },
  { month: "Sep 2024", value: 3500000, grantedValue: 0 },
  { month: "Dec 2024", value: 5200000, grantedValue: 1500000 },
  { month: "Mar 2025", value: 6800000, grantedValue: 2500000 },
  { month: "Jun 2025", value: 7500000, grantedValue: 2500000 },
];

export default function PortfolioValueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={DATA}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: "12px" }} />
        <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #4B5563" }}
          labelStyle={{ color: "#E5E7EB" }}
          formatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
        />
        <Legend wrapperStyle={{ paddingTop: "20px" }} />
        <Line type="monotone" dataKey="value" stroke="#06B6D4" strokeWidth={2} name="Total Portfolio Value" dot={{ fill: "#06B6D4", r: 4 }} />
        <Line type="monotone" dataKey="grantedValue" stroke="#10B981" strokeWidth={2} name="Granted Patents Value" dot={{ fill: "#10B981", r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}