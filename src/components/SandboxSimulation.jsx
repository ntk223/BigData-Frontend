import React from 'react';
import { Sliders, RefreshCw, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function SandboxSimulation({
  sandboxOverrides,
  setSandboxOverrides,
  runPredictions,
  whatIfReadmission,
  whatIfMortality
}) {
  return (
    <div className="grid-2col">
      {/* Sandbox Overrides Panel */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <Sliders size={18} /> Mô phỏng What-If (Sandbox)
          </span>
        </div>

        <div className="whatif-sandbox">
          {/* Age Slider */}
          <div className="slider-group">
            <div className="slider-label">
              <span>Tuổi bệnh nhân</span>
              <span className="value">{sandboxOverrides.age}</span>
            </div>
            <input 
              type="range" min="18" max="100" 
              value={sandboxOverrides.age}
              onChange={e => setSandboxOverrides({...sandboxOverrides, age: parseInt(e.target.value)})}
            />
          </div>

          {/* SBP Slider */}
          <div className="slider-group">
            <div className="slider-label">
              <span>Huyết áp (SBP Mean)</span>
              <span className="value">{sandboxOverrides.sbp_mean} mmHg</span>
            </div>
            <input 
              type="range" min="70" max="200" 
              value={sandboxOverrides.sbp_mean}
              onChange={e => setSandboxOverrides({...sandboxOverrides, sbp_mean: parseInt(e.target.value)})}
            />
          </div>

          {/* SPO2 Slider */}
          <div className="slider-group">
            <div className="slider-label">
              <span>Nồng độ Oxy (SPO2)</span>
              <span className="value">{sandboxOverrides.spo2_mean} %</span>
            </div>
            <input 
              type="range" min="70" max="100" 
              value={sandboxOverrides.spo2_mean}
              onChange={e => setSandboxOverrides({...sandboxOverrides, spo2_mean: parseInt(e.target.value)})}
            />
          </div>

          {/* Heart Rate Slider */}
          <div className="slider-group">
            <div className="slider-label">
              <span>Nhịp tim (Heart Rate)</span>
              <span className="value">{sandboxOverrides.hr_mean} bpm</span>
            </div>
            <input 
              type="range" min="40" max="160" 
              value={sandboxOverrides.hr_mean}
              onChange={e => setSandboxOverrides({...sandboxOverrides, hr_mean: parseInt(e.target.value)})}
            />
          </div>

          {/* Duration Days Slider */}
          <div className="slider-group">
            <div className="slider-label">
              <span>Số ngày điều trị</span>
              <span className="value">{sandboxOverrides.duration_days} ngày</span>
            </div>
            <input 
              type="range" min="1" max="30" 
              value={sandboxOverrides.duration_days}
              onChange={e => setSandboxOverrides({...sandboxOverrides, duration_days: parseInt(e.target.value)})}
            />
          </div>

          {/* Discharge Location Select */}
          <div className="select-group">
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Hình thức xuất viện</label>
            <select 
              value={sandboxOverrides.discharge_location}
              onChange={e => setSandboxOverrides({...sandboxOverrides, discharge_location: e.target.value})}
            >
              <option value="HOME">Về nhà (HOME)</option>
              <option value="HOME HEALTH CARE">HOME HEALTH CARE (Có điều dưỡng)</option>
              <option value="SKILLED NURSING FACILITY">Skilled Nursing Facility (SNF)</option>
              <option value="REHAB">Phục hồi chức năng (REHAB)</option>
              <option value="HOSPICE">Hospice (HOSPICE)</option>
            </select>
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={() => runPredictions(sandboxOverrides)}
          style={{ marginTop: '10px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))' }}
        >
          <RefreshCw size={16} />
          Cập nhật Sandbox và dự báo lại
        </button>
      </div>

      {/* What-If discharge scenarios bar chart */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <BarChart3 size={18} /> So sánh các phương án Xuất viện
          </span>
        </div>

        {whatIfReadmission && whatIfMortality ? (
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: 'HOME',
                    'Tái nhập viện (30d)': (whatIfReadmission['HOME'].readmission_probability * 100).toFixed(1),
                    'Tử vong (12m)': (whatIfMortality['HOME'].mortality_risk_12m * 100).toFixed(1)
                  },
                  {
                    name: 'HOME HEALTH',
                    'Tái nhập viện (30d)': (whatIfReadmission['HOME HEALTH CARE'].readmission_probability * 100).toFixed(1),
                    'Tử vong (12m)': (whatIfMortality['HOME HEALTH CARE'].mortality_risk_12m * 100).toFixed(1)
                  },
                  {
                    name: 'VIỆN ĐIỀU DƯỠNG',
                    'Tái nhập viện (30d)': (whatIfReadmission['SKILLED NURSING FACILITY'].readmission_probability * 100).toFixed(1),
                    'Tử vong (12m)': (whatIfMortality['SKILLED NURSING FACILITY'].mortality_risk_12m * 100).toFixed(1)
                  }
                ]}
                margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#223046" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" unit="%" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Tái nhập viện (30d)" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Tử vong (12m)" fill="var(--accent-purple)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty-state">Đang chờ dữ liệu What-If...</div>
        )}
      </div>
    </div>
  );
}

export default SandboxSimulation;
