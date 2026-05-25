import React from 'react';
import { 
  Activity, 
  Search, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  LayoutDashboard, 
  User,
  Sun,
  Moon
} from 'lucide-react';

function Sidebar({
  loadingCsv,
  filteredPatients,
  selectedPatient,
  setSelectedPatient,
  searchQuery,
  setSearchQuery,
  backendOnline,
  currentView,
  setCurrentView,
  theme,
  toggleTheme
}) {
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setCurrentView('patient');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="brand">
            <div className="brand-icon">
              <Activity size={24} />
            </div>
            <span className="brand-name">PredictCare AI</span>
          </div>
          <button 
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              transition: 'all 0.2s ease'
            }}
            title={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
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

        {/* View Toggle Tabs */}
        <div className="sidebar-nav">
          <button 
            className={`nav-item ${currentView === 'overview' ? 'active' : ''}`}
            onClick={() => setCurrentView('overview')}
          >
            <LayoutDashboard size={15} />
            <span>Tổng quan dữ liệu</span>
          </button>
          <button 
            className={`nav-item ${currentView === 'patient' ? 'active' : ''}`}
            onClick={() => setCurrentView('patient')}
          >
            <User size={15} />
            <span>Hồ sơ bệnh nhân</span>
          </button>
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
              onClick={() => handleSelectPatient(p)}
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
