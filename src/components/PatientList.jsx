import React, { useState, useMemo } from 'react';
import { Search, User } from 'lucide-react';

function PatientList({ patients, onSelectPatient }) {
  const [filterGender, setFilterGender] = useState('ALL');
  const [filterAge, setFilterAge] = useState('ALL');
  const [filterDuration, setFilterDuration] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      // Gender filter
      if (filterGender !== 'ALL' && p.gender !== filterGender) return false;
      
      // Age filter
      if (filterAge !== 'ALL') {
        const age = Math.round(p.age);
        if (filterAge === '<50' && age >= 50) return false;
        if (filterAge === '50-70' && (age < 50 || age > 70)) return false;
        if (filterAge === '>70' && age <= 70) return false;
      }

      // Duration filter
      if (filterDuration !== 'ALL') {
        const duration = Math.round(p.duration_days);
        if (filterDuration === '<5' && duration >= 5) return false;
        if (filterDuration === '5-10' && (duration < 5 || duration > 10)) return false;
        if (filterDuration === '>10' && duration <= 10) return false;
      }

      // Search filter
      if (search) {
        const query = search.toLowerCase();
        if (!(p.hadm_id?.toLowerCase().includes(query) || p.subject_id?.toLowerCase().includes(query))) {
          return false;
        }
      }

      return true;
    });
  }, [patients, filterGender, filterAge, filterDuration, search]);

  return (
    <div className="dashboard-content" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: 700 }}>
          Danh sách Bệnh nhân
        </h2>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="search-box" style={{ width: '250px' }}>
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Tìm HADM ID, Subject ID..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <select 
            className="filter-select"
            value={filterAge}
            onChange={e => setFilterAge(e.target.value)}
          >
            <option value="ALL">Tất cả độ tuổi</option>
            <option value="<50">Dưới 50 tuổi</option>
            <option value="50-70">Từ 50 - 70 tuổi</option>
            <option value=">70">Trên 70 tuổi</option>
          </select>

          <select 
            className="filter-select"
            value={filterDuration}
            onChange={e => setFilterDuration(e.target.value)}
          >
            <option value="ALL">Tất cả ngày ĐT</option>
            <option value="<5">Dưới 5 ngày</option>
            <option value="5-10">Từ 5 - 10 ngày</option>
            <option value=">10">Trên 10 ngày</option>
          </select>

          <select 
            className="filter-select"
            value={filterGender}
            onChange={e => setFilterGender(e.target.value)}
          >
            <option value="ALL">Tất cả giới tính</option>
            <option value="M">Nam</option>
            <option value="F">Nữ</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 160px)' }}>
          <table className="patient-table">
            <thead>
              <tr>
                <th>HADM ID</th>
                <th>Subject ID</th>
                <th>Tuổi</th>
                <th>Giới tính</th>
                <th>Loại nhập viện</th>
                <th>Ngày điều trị</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Không tìm thấy bệnh nhân phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredPatients.map(p => (
                  <tr key={p.hadm_id}>
                    <td><b>{p.hadm_id}</b></td>
                    <td>{p.subject_id}</td>
                    <td>{Math.round(p.age)}</td>
                    <td>
                      <span className={`patient-gender-tag ${p.gender}`}>
                        {p.gender === 'M' ? 'Nam' : 'Nữ'}
                      </span>
                    </td>
                    <td>{p.admission_type}</td>
                    <td>{Math.round(p.duration_days)} ngày</td>
                    <td>
                      <button 
                        className="btn-action"
                        onClick={() => onSelectPatient(p)}
                        title="Xem hồ sơ dự báo"
                      >
                        <User size={14} /> Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <span>Đang hiển thị <b>{filteredPatients.length}</b> bệnh nhân</span>
        </div>
      </div>
    </div>
  );
}

export default PatientList;
