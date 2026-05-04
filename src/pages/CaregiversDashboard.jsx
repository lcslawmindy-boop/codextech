import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Download, Filter, Calendar, AlertCircle, TrendingDown } from 'lucide-react';
import BiometricsChart from '@/components/biometrics/BiometricsChart';
import DailyRhythmChart from '@/components/biometrics/DailyRhythmChart';
import jsPDF from 'jspdf';

export default function CaregiversDashboard() {
  const [childId, setChildId] = useState(() => localStorage.getItem('childId') || 'child-001');
  const [readings, setReadings] = useState([]);
  const [filteredReadings, setFilteredReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');
  const [stats, setStats] = useState({});
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    localStorage.setItem('childId', childId);
    fetchReadings();
  }, [childId]);

  const fetchReadings = async () => {
    setLoading(true);
    try {
      const allReadings = await base44.entities.BiometricReading.filter(
        { child_id: childId },
        '-timestamp',
        1000
      );
      setReadings(allReadings);
      filterByDateRange(allReadings, '7days');
    } catch (error) {
      console.error('Failed to fetch readings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByDateRange = (data, range) => {
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case '24hours':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        return data;
    }

    const filtered = data.filter(r => new Date(r.timestamp) >= startDate);
    setFilteredReadings(filtered);
    calculateStats(filtered);
    setDateRange(range);
  };

  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats({ avgAnxiety: 0, maxAnxiety: 0, minAnxiety: 0, meltdowns: 0 });
      return;
    }

    const anxietyLevels = data.map(r => r.anxiety_level);
    const meltdownCount = data.filter(r => r.sensory_state === 'meltdown_precursor').length;

    setStats({
      avgAnxiety: Math.round((anxietyLevels.reduce((a, b) => a + b, 0) / anxietyLevels.length) * 10) / 10,
      maxAnxiety: Math.max(...anxietyLevels),
      minAnxiety: Math.min(...anxietyLevels),
      meltdowns: meltdownCount,
      totalReadings: data.length,
    });
  };

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      const now = new Date().toLocaleDateString();

      // Title
      doc.setFontSize(18);
      doc.text('Biometric Report', 20, 20);
      doc.setFontSize(10);
      doc.text(`Child ID: ${childId} | Period: Last ${dateRange.replace('days', ' days').replace('hours', ' hours')} | Date: ${now}`, 20, 30);

      // Stats summary
      doc.setFontSize(12);
      doc.text('Summary Statistics', 20, 45);
      doc.setFontSize(10);
      doc.text(`Average Anxiety Level: ${stats.avgAnxiety}`, 25, 55);
      doc.text(`Peak Anxiety: ${stats.maxAnxiety}`, 25, 62);
      doc.text(`Minimum Anxiety: ${stats.minAnxiety}`, 25, 69);
      doc.text(`Meltdown Precursors Detected: ${stats.meltdowns}`, 25, 76);
      doc.text(`Total Readings: ${stats.totalReadings}`, 25, 83);

      // Detailed readings table
      doc.setFontSize(12);
      doc.text('Detailed Readings', 20, 100);
      doc.setFontSize(9);

      const tableData = filteredReadings.slice(0, 50).map(r => [
        new Date(r.timestamp).toLocaleString(),
        r.anxiety_level,
        r.hrv,
        r.gsr,
        r.eeg_alpha,
        r.sensory_state,
      ]);

      doc.autoTable({
        startY: 110,
        head: [['Timestamp', 'Anxiety', 'HRV', 'GSR', 'EEG Alpha', 'State']],
        body: tableData,
        headStyles: { fillColor: [124, 58, 237], textColor: [255, 255, 255] },
        bodyStyles: { textColor: [0, 0, 0] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        columnStyles: {
          0: { cellWidth: 45 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 25 },
          5: { cellWidth: 30 },
        },
      });

      // Insights section
      const finalY = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(12);
      doc.text('Clinical Insights', 20, finalY);
      doc.setFontSize(10);
      doc.text('This data is intended to support caregiver awareness and should be reviewed with specialists.', 25, finalY + 10);
      doc.text('Anxiety patterns, sensory triggers, and intervention effectiveness can be tracked over time.', 25, finalY + 17);

      // Disclaimer
      doc.setFontSize(8);
      doc.text('CONFIDENTIAL: Parent/Caregiver Use Only. Not a medical report.', 20, doc.internal.pageSize.height - 10);

      // Download
      doc.save(`Biometrics_${childId}_${now.replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-6 py-10 relative" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 border border-cyan-500/40 bg-cyan-950/30">
            <AlertCircle size={13} className="text-cyan-400" />
            <span className="text-xs font-black tracking-widest text-cyan-400 uppercase">Biometric Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Caregiver Portal</h1>
          <p className="text-gray-400 text-base max-w-xl">Track biometric patterns, detect anxiety precursors, and share insights with specialists.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8 bg-gray-900/50 border border-gray-800 rounded-xl p-5 backdrop-blur">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-gray-400 text-xs font-bold uppercase">Child ID:</label>
            <input
              type="text"
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            {['24hours', '7days', '30days'].map(range => (
              <button
                key={range}
                onClick={() => filterByDateRange(readings, range)}
                className={`px-3 py-1.5 rounded text-xs font-black uppercase transition ${
                  dateRange === range
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {range === '24hours' ? '24H' : range === '7days' ? '7D' : '30D'}
              </button>
            ))}
          </div>

          <button
            onClick={exportToPDF}
            disabled={exporting || filteredReadings.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            <Download size={16} />
            {exporting ? 'Generating...' : 'Export PDF'}
          </button>
        </div>

        {/* Stats Cards */}
        {!loading && filteredReadings.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {[
              { label: 'Avg Anxiety', value: stats.avgAnxiety, unit: '/100', icon: '📊' },
              { label: 'Peak Anxiety', value: stats.maxAnxiety, unit: '/100', icon: '⚠️' },
              { label: 'Min Anxiety', value: stats.minAnxiety, unit: '/100', icon: '😌' },
              { label: 'Precursors', value: stats.meltdowns, unit: 'detected', icon: '🚨' },
              { label: 'Total Readings', value: stats.totalReadings, unit: '', icon: '📈' },
            ].map((stat, i) => (
              <div key={i} className="bg-gray-900/70 border border-gray-800 rounded-lg p-4 text-center backdrop-blur">
                <p className="text-2xl mb-1">{stat.icon}</p>
                <p className="text-white font-black text-lg">{stat.value}</p>
                <p className="text-gray-500 text-xs">{stat.label}</p>
                {stat.unit && <p className="text-gray-600 text-xs">{stat.unit}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Charts */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400"></div>
            <p className="text-gray-400 mt-3 text-sm">Loading biometric data...</p>
          </div>
        ) : filteredReadings.length === 0 ? (
          <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-10 text-center backdrop-blur">
            <p className="text-gray-400">No biometric readings found for this period. Sessions will begin recording data when the bed is first used.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <BiometricsChart data={filteredReadings} metric="anxiety_level" title="Anxiety Level Over Time" />
            <BiometricsChart data={filteredReadings} metric="hrv" title="Heart Rate Variability" />
            <BiometricsChart data={filteredReadings} metric="gsr" title="Galvanic Skin Response" />
            <DailyRhythmChart data={filteredReadings} />
          </div>
        )}

        {/* Sensory State Distribution */}
        {filteredReadings.length > 0 && (
          <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 backdrop-blur">
            <h3 className="text-white font-black text-sm mb-4">Sensory State Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['calm', 'baseline', 'elevated', 'high_alert', 'meltdown_precursor'].map(state => {
                const count = filteredReadings.filter(r => r.sensory_state === state).length;
                const pct = Math.round((count / filteredReadings.length) * 100);
                return (
                  <div key={state} className="text-center">
                    <p className="text-2xl mb-2">
                      {state === 'calm' ? '😌' : state === 'baseline' ? '😊' : state === 'elevated' ? '😐' : state === 'high_alert' ? '😟' : '🚨'}
                    </p>
                    <p className="text-white font-black text-lg">{pct}%</p>
                    <p className="text-gray-500 text-xs capitalize">{state.replace(/_/g, ' ')}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-10 border-t border-gray-800 pt-6 text-xs text-gray-600 text-center">
          <p>This dashboard is for caregiver awareness only. Data should be reviewed with qualified specialists. Not a medical diagnosis tool.</p>
        </div>
      </div>
    </div>
  );
}