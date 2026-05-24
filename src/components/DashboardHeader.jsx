import React from 'react';
import { User, ShieldAlert, Award, Play, RefreshCw } from 'lucide-react';

function DashboardHeader({
  selectedPatient,
  runPredictions,
  isPredicting,
  backendOnline
}) {
  return (
    <header className="dashboard-header">
      <div className="header-patient-info">
        <span className="patient-main-id">Hồ sơ: {selectedPatient.hadm_id}</span>
        <div className="header-badges">
          <span className="header-badge">
            <User size={14} /> Subject ID: {selectedPatient.subject_id}
          </span>
          <span className="header-badge">
            <ShieldAlert size={14} /> Tuổi: {parseInt(selectedPatient.age)}
          </span>
          <span className="header-badge">
            <Award size={14} /> Nhóm: {selectedPatient.insurance}
          </span>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className="btn-primary"
          onClick={() => runPredictions()}
          disabled={isPredicting || backendOnline === false}
        >
          {isPredicting ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Đang xử lý CDSS...
            </>
          ) : (
            <>
              <Play size={16} />
              Chạy phân tích dự báo AI
            </>
          )}
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;
