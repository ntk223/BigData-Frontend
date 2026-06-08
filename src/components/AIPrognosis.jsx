import React from 'react';
import { Activity, ShieldAlert, TrendingUp, BarChart3 } from 'lucide-react';

function AIPrognosis({ isPredicting, readmissionResult, mortalityResult }) {
  if (isPredicting) {
    return (
      <div className="card card-glow-purple">
        <div className="scanner-container">
          <div className="pulse-circle">
            <Activity size={36} />
          </div>
          <span className="scanner-text">Hệ thống AI đang thực hiện phân tích CDSS cho bệnh nhân...</span>
        </div>
      </div>
    );
  }

  if (readmissionResult && mortalityResult) {
    return (
      <div className="grid-2col">
        {/* Readmission Gauge */}
        <div className="card card-glow-blue">
          <div className="card-header">
            <span className="card-title">
              <TrendingUp size={18} /> Nguy cơ tái nhập viện (30 ngày)
            </span>
          </div>

          <div className="ai-outcome-body">
            <div className="radial-gauge">
              <svg className="gauge-svg">
                <circle cx="60" cy="60" r="50" className="gauge-bg" />
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  className="gauge-fill" 
                  stroke={
                    readmissionResult.readmission_probability > 0.4 
                      ? 'var(--status-danger)' 
                      : readmissionResult.readmission_probability > 0.2 
                        ? 'var(--status-warning)' 
                        : 'var(--status-success)'
                  }
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - readmissionResult.readmission_probability)}`}
                />
              </svg>
              <span className="gauge-value-text">
                {(readmissionResult.readmission_probability * 100).toFixed(0)}%
              </span>
            </div>

            <div className="ai-meta">
              <span className={`ai-class ${
                readmissionResult.prediction === 1 ? 'high' : 'low'
              }`}>
                {readmissionResult.prediction === 1 ? 'NGUY CƠ CAO (Tái nhập)' : 'NGUY CƠ THẤP'}
              </span>
              <p className="ai-desc">
                Độ tin cậy của thuật toán: <b>{(readmissionResult.confidence * 100).toFixed(1)}%</b>.<br />
                Thời gian không tái nhập viện trung bình (RMST 30 ngày): <b>{readmissionResult.rmst_30d !== undefined ? readmissionResult.rmst_30d.toFixed(1) : '-'} ngày</b>.<br />
                Bệnh nhân có khả năng phải tái nhập viện trong vòng 30 ngày kể từ ngày xuất viện.
              </p>
            </div>
          </div>
        </div>

        {/* Mortality Gauge */}
        <div className="card card-glow-purple">
          <div className="card-header">
            <span className="card-title">
              <ShieldAlert size={18} /> Nguy cơ tử vong (12 tháng)
            </span>
          </div>

          <div className="ai-outcome-body">
            <div className="radial-gauge">
              <svg className="gauge-svg">
                <circle cx="60" cy="60" r="50" className="gauge-bg" />
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  className="gauge-fill" 
                  stroke={
                    mortalityResult.mortality_risk_12m > 0.4 
                      ? 'var(--status-danger)' 
                      : mortalityResult.mortality_risk_12m > 0.2 
                        ? 'var(--status-warning)' 
                        : 'var(--status-success)'
                  }
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - mortalityResult.mortality_risk_12m)}`}
                />
              </svg>
              <span className="gauge-value-text">
                {(mortalityResult.mortality_risk_12m * 100).toFixed(0)}%
              </span>
            </div>

            <div className="ai-meta">
              <span className={`ai-class ${
                mortalityResult.mortality_risk_12m > 0.4 ? 'high' : mortalityResult.mortality_risk_12m > 0.2 ? 'medium' : 'low'
              }`}>
                {mortalityResult.mortality_risk_12m > 0.4 ? 'NGUY CƠ TỬ VONG CAO' : mortalityResult.mortality_risk_12m > 0.2 ? 'NGUY CƠ TRUNG BÌNH' : 'NGUY CƠ THẤP'}
              </span>
              <p className="ai-desc">
                Thời gian sống thêm trung bình (RMST 12 tháng): <b>{mortalityResult.rmst_12m !== undefined ? mortalityResult.rmst_12m.toFixed(1) : '-'} ngày</b>.<br />
                Xác suất tử vong tích lũy trong vòng 1 năm là {(mortalityResult.mortality_risk_12m * 100).toFixed(1)}%.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="empty-state">
        <BarChart3 size={32} />
        <p>Nhấp vào nút <b>"Chạy phân tích dự báo AI"</b> ở góc trên bên phải để nhận kết quả phân tích CDSS chi tiết.</p>
      </div>
    </div>
  );
}

export default AIPrognosis;
