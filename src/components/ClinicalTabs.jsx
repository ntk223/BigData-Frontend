import React from 'react';
import { FileText } from 'lucide-react';
import { formatValue } from '../utils/helpers';

function ClinicalTabs({
  selectedPatient,
  activeTab,
  setActiveTab,
  activeDiagnoses,
  labsData
}) {
  return (
    <div className="card tabs-container">
      <div className="tabs-header">
        {/* <button 
          className={`tab-btn ${activeTab === 'vitals' ? 'active' : ''}`}
          onClick={() => setActiveTab('vitals')}
        >
          Tất cả sinh hiệu
        </button> */}
        <button 
          className={`tab-btn ${activeTab === 'labs' ? 'active' : ''}`}
          onClick={() => setActiveTab('labs')}
        >
          Xét nghiệm lâm sàng (Labs)
        </button>
        <button 
          className={`tab-btn ${activeTab === 'icd10' ? 'active' : ''}`}
          onClick={() => setActiveTab('icd10')}
        >
          Mã ICD-10 Chẩn đoán ({activeDiagnoses.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'labs' && (
          <div className="labs-grid">
            {labsData.length === 0 ? (
              <div style={{ gridColumn: 'span 3', color: 'var(--text-muted)' }}>
                Không ghi nhận chỉ số xét nghiệm labs cho bệnh nhân này.
              </div>
            ) : (
              labsData.map(lab => (
                <div key={lab.name} className="lab-item">
                  <span className="lab-name">{lab.name}</span>
                  <span className="lab-val">{lab.val}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'icd10' && (
          <div>
            {activeDiagnoses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Không có chẩn đoán ICD-10 ghi nhận.</p>
            ) : (
              <div className="badge-grid">
                {activeDiagnoses.map(diag => (
                  <span key={diag.key} className="diag-badge">
                    <FileText size={12} /> {diag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClinicalTabs;
