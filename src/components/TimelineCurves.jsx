import React from 'react';
import { TrendingUp, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function TimelineCurves({
  readmissionResult,
  mortalityResult,
  combinedWhatIfReadmissionData,
  combinedWhatIfMortalityData,
  whatIfReadmission,
  whatIfMortality,
  readmissionChartData
}) {
  if (!readmissionResult || !mortalityResult) return null;

  return (
    <div className="grid-2col">
      {/* Readmission Probability Curve */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <TrendingUp size={18} /> Nguy cơ Tái nhập viện lũy tiến (30 ngày)
          </span>
        </div>

        <div style={{ height: '240px', width: '100%' }}>
          {combinedWhatIfReadmissionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={combinedWhatIfReadmissionData}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} />
                <YAxis unit="%" stroke="#9ca3af" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                {Object.keys(whatIfReadmission || {}).map((k, idx) => {
                  const colors = ['#60a5fa', '#34d399', '#f472b6'];
                  return (
                    <Line 
                      key={k}
                      type="monotone" 
                      dataKey={whatIfReadmission[k].name} 
                      stroke={colors[idx % colors.length]} 
                      dot={false}
                      strokeWidth={2}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={readmissionChartData}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} />
                <YAxis unit="%" stroke="#9ca3af" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                <Line type="monotone" dataKey="Tái nhập viện hiện tại" stroke="var(--accent-blue)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Mortality Survival Curve */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <Heart size={18} /> Xác suất sinh tồn lũy tiến S(t) (12 tháng)
          </span>
        </div>

        <div style={{ height: '240px', width: '100%' }}>
          {combinedWhatIfMortalityData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={combinedWhatIfMortalityData}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} />
                <YAxis unit="%" stroke="#9ca3af" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                {Object.keys(whatIfMortality || {}).map((k, idx) => {
                  const colors = ['#f472b6', '#34d399', '#60a5fa'];
                  return (
                    <Line 
                      key={k}
                      type="monotone" 
                      dataKey={whatIfMortality[k].name} 
                      stroke={colors[idx % colors.length]} 
                      dot={false}
                      strokeWidth={2}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">Chưa có dữ liệu sinh tồn</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TimelineCurves;
