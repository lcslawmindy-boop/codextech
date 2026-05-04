import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DailyRhythmChart({ data, title = 'Daily Anxiety Rhythm (Hourly Avg)' }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 backdrop-blur text-center">
        <p className="text-gray-400 text-sm">No data available for this period</p>
      </div>
    );
  }

  // Aggregate by hour of day
  const hourlyAgg = {};
  data.forEach(reading => {
    const hour = new Date(reading.timestamp).getHours();
    if (!hourlyAgg[hour]) {
      hourlyAgg[hour] = { anxiety: [], hrv: [], gsr: [], count: 0 };
    }
    hourlyAgg[hour].anxiety.push(reading.anxiety_level);
    hourlyAgg[hour].hrv.push(reading.hrv);
    hourlyAgg[hour].gsr.push(reading.gsr);
    hourlyAgg[hour].count++;
  });

  const chartData = Object.entries(hourlyAgg).map(([hour, values]) => ({
    hour: `${hour}:00`,
    avgAnxiety: Math.round((values.anxiety.reduce((a, b) => a + b, 0) / values.count) * 10) / 10,
    avgHRV: Math.round((values.hrv.reduce((a, b) => a + b, 0) / values.count) * 10) / 10,
    avgGSR: Math.round((values.gsr.reduce((a, b) => a + b, 0) / values.count) * 10) / 10,
  })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

  return (
    <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 backdrop-blur">
      <h3 className="text-white font-black text-sm mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="hour" stroke="rgba(255,255,255,0.5)" fontSize={12} />
          <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a2e',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#ffffff' }}
          />
          <Legend />
          <Bar dataKey="avgAnxiety" fill="#ff6b6b" name="Avg Anxiety" />
          <Bar dataKey="avgHRV" fill="#00d9ff" name="Avg HRV" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}