import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BiometricsChart({ data, metric = 'anxiety_level', title = 'Anxiety Over Time' }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 backdrop-blur text-center">
        <p className="text-gray-400 text-sm">No data available for this period</p>
      </div>
    );
  }

  const chartData = data.map(reading => ({
    time: new Date(reading.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    value: reading[metric],
    hrv: reading.hrv,
    gsr: reading.gsr,
    anxiety: reading.anxiety_level,
  }));

  const colors = {
    anxiety_level: '#ff6b6b',
    hrv: '#00d9ff',
    gsr: '#ffd700',
    eeg_alpha: '#7c3aed',
  };

  return (
    <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 backdrop-blur">
      <h3 className="text-white font-black text-sm mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={12} />
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
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={colors[metric]} 
            dot={{ r: 3 }} 
            name={metric.replace(/_/g, ' ').toUpperCase()} 
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}