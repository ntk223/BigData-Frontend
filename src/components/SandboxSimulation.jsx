import React, { useState, useEffect, useMemo } from 'react';
import { Sliders, RefreshCw, BarChart3, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CATEGORY_MAPPINGS, DEFAULT_FEATURES_ORDER } from '../constants';

const FEATURE_META_MAP = {
  age: { displayName: 'Tuổi bệnh nhân', min: 18, max: 100, step: 1, unit: 'tuổi' },
  duration_days: { displayName: 'Số ngày nằm viện', min: 1, max: 30, step: 1, unit: 'ngày' },
  sbp_mean: { displayName: 'Huyết áp tâm thu TB', min: 70, max: 200, step: 1, unit: 'mmHg' },
  sbp_min: { displayName: 'Huyết áp tâm thu Min', min: 50, max: 150, step: 1, unit: 'mmHg' },
  sbp_max: { displayName: 'Huyết áp tâm thu Max', min: 90, max: 250, step: 1, unit: 'mmHg' },
  spo2_mean: { displayName: 'Nồng độ Oxy TB (SpO2)', min: 70, max: 100, step: 1, unit: '%' },
  hr_mean: { displayName: 'Nhịp tim trung bình', min: 40, max: 160, step: 1, unit: 'bpm' },
  temperature_mean: { displayName: 'Thân nhiệt trung bình', min: 35.0, max: 42.0, step: 0.1, unit: '°C' },
  bun_mean: { displayName: 'BUN trung bình', min: 5, max: 120, step: 1, unit: 'mg/dL' },
  bun_min: { displayName: 'BUN Min', min: 2, max: 80, step: 1, unit: 'mg/dL' },
  bun_max: { displayName: 'BUN Max', min: 10, max: 150, step: 1, unit: 'mg/dL' },
  creatinine_mean: { displayName: 'Creatinine TB', min: 0.2, max: 10.0, step: 0.1, unit: 'mg/dL' },
  creatinine_min: { displayName: 'Creatinine Min', min: 0.1, max: 5.0, step: 0.1, unit: 'mg/dL' },
  creatinine_max: { displayName: 'Creatinine Max', min: 0.3, max: 15.0, step: 0.1, unit: 'mg/dL' },
  glucose_mean: { displayName: 'Glucose trung bình', min: 50, max: 400, step: 1, unit: 'mg/dL' },
  glucose_min: { displayName: 'Glucose Min', min: 30, max: 200, step: 1, unit: 'mg/dL' },
  glucose_max: { displayName: 'Glucose Max', min: 70, max: 600, step: 1, unit: 'mg/dL' },
  hemoglobin_mean: { displayName: 'Hemoglobin TB', min: 5.0, max: 20.0, step: 0.1, unit: 'g/dL' },
  hemoglobin_min: { displayName: 'Hemoglobin Min', min: 4.0, max: 18.0, step: 0.1, unit: 'g/dL' },
  hemoglobin_max: { displayName: 'Hemoglobin Max', min: 6.0, max: 22.0, step: 0.1, unit: 'g/dL' },
  wbc_mean: { displayName: 'Bạch cầu TB (WBC)', min: 1.0, max: 50.0, step: 0.1, unit: 'K/uL' },
  wbc_min: { displayName: 'Bạch cầu Min', min: 0.5, max: 30.0, step: 0.1, unit: 'K/uL' },
  wbc_max: { displayName: 'Bạch cầu Max', min: 1.5, max: 100.0, step: 0.1, unit: 'K/uL' },
  lactate_mean: { displayName: 'Lactate trung bình', min: 0.5, max: 15.0, step: 0.1, unit: 'mmol/L' },
  lactate_min: { displayName: 'Lactate Min', min: 0.2, max: 10.0, step: 0.1, unit: 'mmol/L' },
  lactate_max: { displayName: 'Lactate Max', min: 0.8, max: 20.0, step: 0.1, unit: 'mmol/L' },
  sodium_mean: { displayName: 'Natri trung bình', min: 110, max: 160, step: 1, unit: 'mEq/L' },
  sodium_min: { displayName: 'Natri Min', min: 100, max: 150, step: 1, unit: 'mEq/L' },
  sodium_max: { displayName: 'Natri Max', min: 120, max: 170, step: 1, unit: 'mEq/L' },
  potassium_mean: { displayName: 'Kali trung bình', min: 2.0, max: 8.0, step: 0.1, unit: 'mEq/L' },
  potassium_min: { displayName: 'Kali Min', min: 1.5, max: 6.0, step: 0.1, unit: 'mEq/L' },
  potassium_max: { displayName: 'Kali Max', min: 2.5, max: 10.0, step: 0.1, unit: 'mEq/L' },
  platelet_mean: { displayName: 'Tiểu cầu trung bình', min: 10, max: 800, step: 5, unit: 'K/uL' },
  platelet_min: { displayName: 'Tiểu cầu Min', min: 5, max: 600, step: 5, unit: 'K/uL' },
  platelet_max: { displayName: 'Tiểu cầu Max', min: 20, max: 1000, step: 5, unit: 'K/uL' },
};

const getFeatureMeta = (featName) => {
  const custom = FEATURE_META_MAP[featName];
  if (custom) return custom;
  
  let displayName = featName
    .replace('_mean', ' TB')
    .replace('_min', ' Min')
    .replace('_max', ' Max')
    .replace('_', ' ')
    .toUpperCase();
    
  if (featName.startsWith('icd10_chap_')) {
    displayName = "ICD: " + featName.replace('icd10_chap_', '').replace('_', ' ').toUpperCase();
  }
  
  return {
    displayName,
    min: 0,
    max: 100,
    step: 1,
    unit: ''
  };
};

function SandboxSimulation({
  selectedPatient,
  readmissionXAI,
  mortalityXAI,
  sandboxOverrides,
  setSandboxOverrides,
  runPredictions,
  whatIfReadmission,
  whatIfMortality
}) {
  const defaultFeatures = ['sbp_mean', 'spo2_mean', 'hr_mean', 'temperature_mean', 'duration_days'];
  const [activeFeatures, setActiveFeatures] = useState(defaultFeatures);
  const [featureToAdd, setFeatureToAdd] = useState('');

  // 1. Reset or set active features to top 5 based on XAI results
  useEffect(() => {
    if (!selectedPatient) return;
    
    // Default fallback
    let topFeatures = [...defaultFeatures];
    
    // Extract top features from XAI if available
    const list = [];
    const extractFromXAI = (xaiData) => {
      if (!xaiData) return;
      const factors = [...(xaiData.top_risk_factors || []), ...(xaiData.top_protective_factors || [])];
      factors.forEach(f => {
        let baseFeat = f.feature;
        // Map back categories to baseline
        if (baseFeat.startsWith('discharge_location_')) baseFeat = 'discharge_location';
        else if (baseFeat.startsWith('gender_')) baseFeat = 'gender';
        else if (baseFeat.startsWith('race_')) baseFeat = 'race';
        else if (baseFeat.startsWith('insurance_')) baseFeat = 'insurance';
        else if (baseFeat.startsWith('marital_status_')) baseFeat = 'marital_status';
        
        list.push({ feature: baseFeat, absShap: Math.abs(f.shap_value) });
      });
    };

    extractFromXAI(readmissionXAI);
    extractFromXAI(mortalityXAI);

    if (list.length > 0) {
      list.sort((a, b) => b.absShap - a.absShap);
      const unique = [];
      list.forEach(item => {
        if (
          !item.feature.startsWith('note_emb_') && 
          item.feature !== 'discharge_location' && 
          item.feature !== 'age' && 
          item.feature !== 'gender' && 
          !unique.includes(item.feature)
        ) {
          unique.push(item.feature);
        }
      });
      if (unique.length > 0) {
        topFeatures = unique.slice(0, 5);
      }
    }

    setActiveFeatures(topFeatures);
  }, [selectedPatient?.subject_id, readmissionXAI, mortalityXAI]);

  // 2. Determine which features are available to add
  const availableFeaturesToAdd = useMemo(() => {
    return DEFAULT_FEATURES_ORDER.filter(feat => 
      !feat.startsWith('note_emb_') && 
      feat !== 'discharge_location' &&
      feat !== 'age' &&
      feat !== 'gender' &&
      !activeFeatures.includes(feat)
    ).sort((a, b) => {
      const nameA = getFeatureMeta(a).displayName.toLowerCase();
      const nameB = getFeatureMeta(b).displayName.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [activeFeatures]);

  const handleAddFeature = () => {
    if (!featureToAdd) return;
    if (!activeFeatures.includes(featureToAdd)) {
      setActiveFeatures([...activeFeatures, featureToAdd]);
      
      // Initialize sandboxOverride with patient's original value if not present
      if (sandboxOverrides[featureToAdd] === undefined) {
        const patientVal = selectedPatient[featureToAdd];
        let defaultVal = 0.0;
        if (patientVal !== undefined && patientVal !== null && patientVal !== '') {
          const parsed = parseFloat(patientVal);
          defaultVal = isNaN(parsed) ? patientVal : parsed;
        }
        setSandboxOverrides(prev => ({ ...prev, [featureToAdd]: defaultVal }));
      }
    }
    setFeatureToAdd('');
  };

  const handleRemoveFeature = (feat) => {
    setActiveFeatures(activeFeatures.filter(f => f !== feat));
  };

  const handleReset = () => {
    if (!selectedPatient) return;
    const initialOverrides = {
      age: Math.round(parseFloat(selectedPatient.age)) || 60,
      sbp_mean: Math.round(parseFloat(selectedPatient.sbp_mean)) || 120,
      spo2_mean: Math.round(parseFloat(selectedPatient.spo2_mean)) || 98,
      hr_mean: Math.round(parseFloat(selectedPatient.hr_mean)) || 80,
      temperature_mean: parseFloat((parseFloat(selectedPatient.temperature_mean) || 37.0).toFixed(1)),
      duration_days: Math.round(parseFloat(selectedPatient.duration_days)) || 4,
      discharge_location: selectedPatient.discharge_location || 'HOME'
    };
    setSandboxOverrides(initialOverrides);

    // Reset active features to top 5 based on XAI
    let topFeatures = [...defaultFeatures];
    const list = [];
    const extractFromXAI = (xaiData) => {
      if (!xaiData) return;
      const factors = [...(xaiData.top_risk_factors || []), ...(xaiData.top_protective_factors || [])];
      factors.forEach(f => {
        let baseFeat = f.feature;
        if (baseFeat.startsWith('discharge_location_')) baseFeat = 'discharge_location';
        else if (baseFeat.startsWith('gender_')) baseFeat = 'gender';
        else if (baseFeat.startsWith('race_')) baseFeat = 'race';
        else if (baseFeat.startsWith('insurance_')) baseFeat = 'insurance';
        else if (baseFeat.startsWith('marital_status_')) baseFeat = 'marital_status';
        
        list.push({ feature: baseFeat, absShap: Math.abs(f.shap_value) });
      });
    };
    extractFromXAI(readmissionXAI);
    extractFromXAI(mortalityXAI);
    if (list.length > 0) {
      list.sort((a, b) => b.absShap - a.absShap);
      const unique = [];
      list.forEach(item => {
        if (
          !item.feature.startsWith('note_emb_') && 
          item.feature !== 'discharge_location' && 
          item.feature !== 'age' && 
          item.feature !== 'gender' && 
          !unique.includes(item.feature)
        ) {
          unique.push(item.feature);
        }
      });
      if (unique.length > 0) {
        topFeatures = unique.slice(0, 5);
      }
    }
    setActiveFeatures(topFeatures);

    // Call predictions with original values, skipping XAI recalc to preserve original explanation
    runPredictions(initialOverrides, true);
  };

  const renderFeatureControl = (feat) => {
    const meta = getFeatureMeta(feat);
    const currentVal = sandboxOverrides[feat] !== undefined 
      ? sandboxOverrides[feat] 
      : (selectedPatient[feat] !== undefined ? parseFloat(selectedPatient[feat]) : 0);

    const isReadOnly = feat === 'age' || feat === 'gender';

    // Render select controls for categorical & binary features
    if (feat === 'gender') {
      return (
        <div className="select-group" style={isReadOnly ? { opacity: 0.75 } : {}}>
          <div className="slider-label">
            <span>{meta.displayName} {isReadOnly && <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>(Cố định)</span>}</span>
            <span className="value">{currentVal === 'F' ? 'Nữ' : 'Nam'}</span>
          </div>
          <select
            value={currentVal}
            onChange={e => setSandboxOverrides({...sandboxOverrides, [feat]: e.target.value})}
            disabled={isReadOnly}
            style={isReadOnly ? { cursor: 'not-allowed', backgroundColor: 'var(--bg-card)' } : {}}
          >
            <option value="M">Nam (M)</option>
            <option value="F">Nữ (F)</option>
          </select>
        </div>
      );
    }

    if (CATEGORY_MAPPINGS[feat]) {
      const options = CATEGORY_MAPPINGS[feat];
      return (
        <div className="select-group" style={isReadOnly ? { opacity: 0.75 } : {}}>
          <div className="slider-label">
            <span>{meta.displayName} {isReadOnly && <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>(Cố định)</span>}</span>
            <span className="value">{currentVal}</span>
          </div>
          <select
            value={currentVal}
            onChange={e => setSandboxOverrides({...sandboxOverrides, [feat]: e.target.value})}
            disabled={isReadOnly}
            style={isReadOnly ? { cursor: 'not-allowed', backgroundColor: 'var(--bg-card)' } : {}}
          >
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    }

    if (feat.startsWith('icd10_chap_') || feat.startsWith('icd_chap_')) {
      return (
        <div className="select-group" style={isReadOnly ? { opacity: 0.75 } : {}}>
          <div className="slider-label">
            <span>{meta.displayName} {isReadOnly && <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>(Cố định)</span>}</span>
            <span className="value">{currentVal >= 1.0 ? 'Có' : 'Không'}</span>
          </div>
          <select
            value={currentVal >= 1.0 ? "1" : "0"}
            onChange={e => setSandboxOverrides({...sandboxOverrides, [feat]: parseFloat(e.target.value)})}
            disabled={isReadOnly}
            style={isReadOnly ? { cursor: 'not-allowed', backgroundColor: 'var(--bg-card)' } : {}}
          >
            <option value="0">Không (0)</option>
            <option value="1">Có (1)</option>
          </select>
        </div>
      );
    }

    // Default numeric slider control
    return (
      <div className="slider-group" style={isReadOnly ? { opacity: 0.75 } : {}}>
        <div className="slider-label">
          <span>{meta.displayName} {isReadOnly && <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>(Cố định)</span>}</span>
          <span className="value">
            {typeof currentVal === 'number' ? currentVal.toFixed(meta.step % 1 === 0 ? 0 : 1) : currentVal} {meta.unit}
          </span>
        </div>
        <input 
          type="range" 
          min={meta.min} 
          max={meta.max} 
          step={meta.step}
          value={currentVal}
          onChange={e => setSandboxOverrides({...sandboxOverrides, [feat]: parseFloat(e.target.value)})}
          disabled={isReadOnly}
          style={isReadOnly ? { cursor: 'not-allowed' } : {}}
        />
      </div>
    );
  };

  return (
    <div className="grid-2col">
      {/* Sandbox Overrides Panel */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <Sliders size={18} /> Mô phỏng What-If (Sandbox)
          </span>
        </div>

        <div className="whatif-sandbox" style={{ position: 'relative' }}>
          {activeFeatures.map(feat => (
            <div key={feat} className="sandbox-control-wrapper">
              {feat !== 'age' && feat !== 'gender' && (
                <button 
                  className="btn-remove-control" 
                  onClick={() => handleRemoveFeature(feat)}
                  title="Xóa chỉ số khỏi Sandbox"
                >
                  ×
                </button>
              )}
              {renderFeatureControl(feat)}
            </div>
          ))}
        </div>

        {/* Feature addition dropdown and + button */}
        <div className="sandbox-add-feature-row">
          <select 
            value={featureToAdd} 
            onChange={e => setFeatureToAdd(e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            <option value="">-- Chọn chỉ số muốn thêm để thử nghiệm --</option>
            {availableFeaturesToAdd.map(feat => (
              <option key={feat} value={feat}>
                {getFeatureMeta(feat).displayName}
              </option>
            ))}
          </select>
          <button 
            className="btn-add-feature" 
            onClick={handleAddFeature}
            disabled={!featureToAdd}
            title="Thêm chỉ số vào Sandbox"
          >
            +
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button 
            className="btn-primary" 
            onClick={() => runPredictions(sandboxOverrides, true)}
            style={{ flex: 2, background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))' }}
          >
            <RefreshCw size={16} />
            Cập nhật Sandbox và dự báo lại
          </button>
          
          <button 
            className="btn-secondary" 
            onClick={handleReset}
            style={{ flex: 1, border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            Khôi phục mặc định
          </button>
        </div>
      </div>

      {/* What-If discharge scenarios bar chart */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <BarChart3 size={18} /> So sánh các phương án Xuất viện
          </span>
        </div>

        {whatIfReadmission && whatIfMortality ? (
          <>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" unit="%" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="Tái nhập viện (30d)" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Tử vong (12m)" fill="var(--accent-purple)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="sandbox-table-container" style={{ marginTop: '20px', overflowX: 'auto' }}>
              <table className="demo-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: '600' }}>Kịch bản xuất viện</th>
                    <th style={{ textAlign: 'center', padding: '8px 4px', fontWeight: '600' }}>Nguy cơ tái nhập (30d)</th>
                    <th style={{ textAlign: 'center', padding: '8px 4px', fontWeight: '600' }}>RMST Tái nhập (30d)</th>
                    <th style={{ textAlign: 'center', padding: '8px 4px', fontWeight: '600' }}>Nguy cơ tử vong (12m)</th>
                    <th style={{ textAlign: 'center', padding: '8px 4px', fontWeight: '600' }}>RMST Tử vong (12m)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      key: 'HOME',
                      label: 'HOME',
                      readmitRes: whatIfReadmission['HOME'],
                      mortRes: whatIfMortality['HOME'],
                    },
                    {
                      key: 'HOME HEALTH CARE',
                      label: 'HOME HEALTH CARE',
                      readmitRes: whatIfReadmission['HOME HEALTH CARE'],
                      mortRes: whatIfMortality['HOME HEALTH CARE'],
                    },
                    {
                      key: 'SKILLED NURSING FACILITY',
                      label: 'SKILLED NURSING',
                      readmitRes: whatIfReadmission['SKILLED NURSING FACILITY'],
                      mortRes: whatIfMortality['SKILLED NURSING FACILITY'],
                    }
                  ].map((row) => (
                    <tr key={row.key} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '8px 4px', fontWeight: '500', color: 'var(--text-primary)' }}>{row.label}</td>
                      <td style={{ textAlign: 'center', padding: '8px 4px', color: 'var(--accent-blue)', fontWeight: '600' }}>
                        {(row.readmitRes?.readmission_probability * 100).toFixed(1)}%
                      </td>
                      <td style={{ textAlign: 'center', padding: '8px 4px', color: 'var(--accent-blue)' }}>
                        {row.readmitRes?.rmst_30d !== undefined ? `${row.readmitRes.rmst_30d.toFixed(1)} ngày` : '-'}
                      </td>
                      <td style={{ textAlign: 'center', padding: '8px 4px', color: 'var(--accent-purple)', fontWeight: '600' }}>
                        {(row.mortRes?.mortality_risk_12m * 100).toFixed(1)}%
                      </td>
                      <td style={{ textAlign: 'center', padding: '8px 4px', color: 'var(--accent-purple)' }}>
                        {row.mortRes?.rmst_12m !== undefined ? `${row.mortRes.rmst_12m.toFixed(1)} ngày` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="empty-state">Đang chờ dữ liệu What-If...</div>
        )}
      </div>
    </div>
  );
}

export default SandboxSimulation;
