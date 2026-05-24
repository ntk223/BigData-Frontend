import React from 'react';
import { Activity, Search, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

function Sidebar({
  loadingCsv,
  filteredPatients,
  selectedPatient,
  setSelectedPatient,
  searchQuery,
  setSearchQuery,
  backendOnline
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-icon">
            <Activity size={24} />
          </div>
          <span className="brand-name">PredictCare AI</span>
        </div>

        <div className="server-status-pill-container">
          {backendOnline === true && (
            <span className="server-status-pill">
              <CheckCircle2 size={12} /> CDSS Backend Online
            </span>
          )}
          {backendOnline === false && (
            <span className="server-status-pill offline">
              <AlertCircle size={12} /> Backend Offline (Port 8000)
            </span>
          )}
          {backendOnline === null && (
            <span className="server-status-pill offline">
              Đang kiểm tra kết nối...
            </span>
          )}
        </div>

        <div className="search-box">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Tìm HADM ID hoặc Patient ID..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="patient-list">
        {loadingCsv ? (
          <div className="empty-state">
            <RefreshCw size={24} className="animate-spin" />
            <p>Đang tải dữ liệu 1000 bệnh nhân...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={24} />
            <p>Không tìm thấy bệnh nhân</p>
          </div>
        ) : (
          filteredPatients.map(p => (
            <div 
              key={p.hadm_id} 
              className={`patient-item ${selectedPatient && selectedPatient.hadm_id === p.hadm_id ? 'active' : ''}`}
              onClick={() => setSelectedPatient(p)}
            >
              <div className="patient-item-header">
                <span className="patient-id">HADM: {p.hadm_id}</span>
                <span className={`patient-gender-tag ${p.gender}`}>
                  {p.gender}
                </span>
              </div>
              <div className="patient-brief-details">
                <span>Tuổi: {parseInt(p.age)}</span>
                <span>Thời gian nằm: {p.duration_days} ngày</span>
              </div>
              <span className="patient-adm-type">
                {p.admission_type}
              </span>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
