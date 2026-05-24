import React from 'react';
import { User } from 'lucide-react';

function Demographics({ selectedPatient }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">
          <User size={18} /> Thông tin cá nhân
        </span>
      </div>
      <table className="demo-table">
        <tbody>
          <tr>
            <td className="label">Giới tính</td>
            <td className="value">{selectedPatient.gender === 'M' ? 'Nam' : 'Nữ'}</td>
          </tr>
          <tr>
            <td className="label">Nhập viện kiểu</td>
            <td className="value">{selectedPatient.admission_type}</td>
          </tr>
          <tr>
            <td className="label">Tình trạng hôn nhân</td>
            <td className="value">{selectedPatient.marital_status || 'Không rõ'}</td>
          </tr>
          {/* <tr>
            <td className="label">Chủng tộc</td>
            <td className="value">{selectedPatient.race || 'Không rõ'}</td>
          </tr>
          <tr>
            <td className="label">Xuất viện dự kiến</td>
            <td className="value">{selectedPatient.discharge_location || 'HOME'}</td>
          </tr> */}
        </tbody>
      </table>
    </div>
  );
}

export default Demographics;
