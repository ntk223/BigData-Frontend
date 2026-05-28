import React from 'react';
import { Activity } from 'lucide-react';
import { formatValue, getVitalStatus } from '../utils/helpers';

function VitalsSummary({ selectedPatient }) {
  return (
    <div className="card" style={{ gridColumn: 'span 2' }}>
      <div className="card-header">
        <span className="card-title">
          <Activity size={18} /> Chỉ số sinh tồn (Vitals)
        </span>
      </div>
      <div className="grid-metrics">
        {/* SBP */}
        <div className="metric-box">
          <span className="metric-label">Huyết áp (Mean SBP)</span>
          <div className="metric-value-container">
            <span className="metric-value">{formatValue(selectedPatient.sbp_mean, 0)}</span>
            {formatValue(selectedPatient.sbp_mean, 0) !== '--' && <span className="metric-unit">mmHg</span>}
          </div>
          <span className={`metric-status ${getVitalStatus('sbp_mean', selectedPatient.sbp_mean).alert ? 'status-alert' : 'status-normal'}`}>
            {getVitalStatus('sbp_mean', selectedPatient.sbp_mean).label}
          </span>
        </div>

        {/* SPO2 */}
        <div className="metric-box">
          <span className="metric-label">Nồng độ Oxy (SPO2)</span>
          <div className="metric-value-container">
            <span className="metric-value">{formatValue(selectedPatient.spo2_mean, 1)}</span>
            {formatValue(selectedPatient.spo2_mean, 1) !== '--' && <span className="metric-unit">%</span>}
          </div>
          <span className={`metric-status ${getVitalStatus('spo2_mean', selectedPatient.spo2_mean).alert ? 'status-alert' : 'status-normal'}`}>
            {getVitalStatus('spo2_mean', selectedPatient.spo2_mean).label}
          </span>
        </div>

        {/* Heart Rate */}
        <div className="metric-box">
          <span className="metric-label">Nhịp tim (Heart Rate)</span>
          <div className="metric-value-container">
            <span className="metric-value">{formatValue(selectedPatient.hr_mean, 0)}</span>
            {formatValue(selectedPatient.hr_mean, 0) !== '--' && <span className="metric-unit">bpm</span>}
          </div>
          <span className={`metric-status ${getVitalStatus('hr_mean', selectedPatient.hr_mean).alert ? 'status-alert' : 'status-normal'}`}>
            {getVitalStatus('hr_mean', selectedPatient.hr_mean).label}
          </span>
        </div>

        {/* Temp */}
        <div className="metric-box">
          <span className="metric-label">Thân nhiệt (Temp)</span>
          <div className="metric-value-container">
            <span className="metric-value">{formatValue(selectedPatient.temperature_mean, 1)}</span>
            {formatValue(selectedPatient.temperature_mean, 1) !== '--' && <span className="metric-unit">°C</span>}
          </div>
          <span className={`metric-status ${getVitalStatus('temperature_mean', selectedPatient.temperature_mean).alert ? 'status-alert' : 'status-normal'}`}>
            {getVitalStatus('temperature_mean', selectedPatient.temperature_mean).label}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VitalsSummary;
