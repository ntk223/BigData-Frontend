import React, { useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  Heart, 
  Clock, 
  Activity, 
  ShieldAlert, 
  PieChart as PieIcon, 
  BarChart3, 
  Layers, 
  Stethoscope 
} from 'lucide-react';
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';

function OverviewDashboard({ patients }) {
  const stats = useMemo(() => {
    if (!patients || patients.length === 0) return null;
    
    const totalPatients = patients.length;
    let maleCount = 0;
    let femaleCount = 0;
    
    let totalAge = 0;
    let totalDuration = 0;
    
    let readmissionCount = 0;
    let readmission30dCount = 0;
    let mortalityCount = 0;
    let mortality12mCount = 0;
    
    const admissionTypes = {};
    const insurances = {};
    
    // Age groups
    const ageGroups = {
      'Dưới 30': { count: 0, readmit: 0, mort: 0 },
      '30 - 39': { count: 0, readmit: 0, mort: 0 },
      '40 - 49': { count: 0, readmit: 0, mort: 0 },
      '50 - 59': { count: 0, readmit: 0, mort: 0 },
      '60 - 69': { count: 0, readmit: 0, mort: 0 },
      '70 - 79': { count: 0, readmit: 0, mort: 0 },
      '80 - 89': { count: 0, readmit: 0, mort: 0 },
      '90+': { count: 0, readmit: 0, mort: 0 },
    };
    
    // ICD chapters count
    const icdChapters = {
      icd10_chap_01_infectious_parasitic: 0,
      icd10_chap_02_neoplasms: 0,
      icd10_chap_03_blood_diseases: 0,
      icd10_chap_04_endocrine_metabolic: 0,
      icd10_chap_05_mental_disorders: 0,
      icd10_chap_06_nervous_system: 0,
      icd10_chap_07_eye_diseases: 0,
      icd10_chap_08_ear_diseases: 0,
      icd10_chap_09_circulatory: 0,
      icd10_chap_10_respiratory: 0,
      icd10_chap_11_digestive: 0,
      icd10_chap_12_skin_diseases: 0,
      icd10_chap_13_musculoskeletal: 0,
      icd10_chap_14_genitourinary: 0,
      icd10_chap_15_pregnancy_childbirth: 0,
      icd10_chap_16_perinatal: 0,
      icd10_chap_17_congenital: 0,
      icd10_chap_18_symptoms_signs: 0,
      icd10_chap_19_injury_poisoning: 0,
      icd10_chap_20_external_causes: 0,
      icd10_chap_21_health_status_factors: 0,
    };
    
    // Vitals totals
    let sbpSum = 0; let sbpCountNum = 0;
    let spo2Sum = 0; let spo2CountNum = 0;
    let hrSum = 0; let hrCountNum = 0;
    let tempSum = 0; let tempCountNum = 0;
    
    patients.forEach(p => {
      // Gender
      if (p.gender === 'M') maleCount++;
      else if (p.gender === 'F') femaleCount++;
      
      // Age
      const age = parseFloat(p.age);
      if (!isNaN(age)) {
        totalAge += age;
        if (age < 30) {
          ageGroups['Dưới 30'].count++;
          if (p.readmission_event_30d === '1') ageGroups['Dưới 30'].readmit++;
          if (p.mortality_event_12m === '1') ageGroups['Dưới 30'].mort++;
        } else if (age < 40) {
          ageGroups['30 - 39'].count++;
          if (p.readmission_event_30d === '1') ageGroups['30 - 39'].readmit++;
          if (p.mortality_event_12m === '1') ageGroups['30 - 39'].mort++;
        } else if (age < 50) {
          ageGroups['40 - 49'].count++;
          if (p.readmission_event_30d === '1') ageGroups['40 - 49'].readmit++;
          if (p.mortality_event_12m === '1') ageGroups['40 - 49'].mort++;
        } else if (age < 60) {
          ageGroups['50 - 59'].count++;
          if (p.readmission_event_30d === '1') ageGroups['50 - 59'].readmit++;
          if (p.mortality_event_12m === '1') ageGroups['50 - 59'].mort++;
        } else if (age < 70) {
          ageGroups['60 - 69'].count++;
          if (p.readmission_event_30d === '1') ageGroups['60 - 69'].readmit++;
          if (p.mortality_event_12m === '1') ageGroups['60 - 69'].mort++;
        } else if (age < 80) {
          ageGroups['70 - 79'].count++;
          if (p.readmission_event_30d === '1') ageGroups['70 - 79'].readmit++;
          if (p.mortality_event_12m === '1') ageGroups['70 - 79'].mort++;
        } else if (age < 90) {
          ageGroups['80 - 89'].count++;
          if (p.readmission_event_30d === '1') ageGroups['80 - 89'].readmit++;
          if (p.mortality_event_12m === '1') ageGroups['80 - 89'].mort++;
        } else {
          ageGroups['90+'].count++;
          if (p.readmission_event_30d === '1') ageGroups['90+'].readmit++;
          if (p.mortality_event_12m === '1') ageGroups['90+'].mort++;
        }
      }
      
      // Duration
      const dur = parseFloat(p.duration_days);
      if (!isNaN(dur)) totalDuration += dur;
      
      // Outcomes
      if (p.event_flag_readmission === '1') readmissionCount++;
      if (p.readmission_event_30d === '1') readmission30dCount++;
      if (p.event_flag_mortality === '1') mortalityCount++;
      if (p.mortality_event_12m === '1') mortality12mCount++;
      
      // Admission Type
      const admType = p.admission_type || 'UNKNOWN';
      admissionTypes[admType] = (admissionTypes[admType] || 0) + 1;
      
      // Insurance
      const ins = p.insurance || 'UNKNOWN';
      insurances[ins] = (insurances[ins] || 0) + 1;
      
      // ICD chapters
      Object.keys(icdChapters).forEach(chapKey => {
        if (parseFloat(p[chapKey]) === 1.0) {
          icdChapters[chapKey]++;
        }
      });
      
      // Vitals
      const sbp = parseFloat(p.sbp_mean);
      if (!isNaN(sbp) && sbp > 0) { sbpSum += sbp; sbpCountNum++; }
      const spo2 = parseFloat(p.spo2_mean);
      if (!isNaN(spo2) && spo2 > 0) { spo2Sum += spo2; spo2CountNum++; }
      const hr = parseFloat(p.hr_mean);
      if (!isNaN(hr) && hr > 0) { hrSum += hr; hrCountNum++; }
      const temp = parseFloat(p.temperature_mean);
      if (!isNaN(temp) && temp > 0) { tempSum += temp; tempCountNum++; }
    });
    
    // Format Admission Type data for chart
    const admissionChartData = Object.keys(admissionTypes).map(key => ({
      name: key,
      value: admissionTypes[key]
    })).sort((a, b) => b.value - a.value);

    // Format Insurance data for chart
    const insuranceChartData = Object.keys(insurances).map(key => ({
      name: key === 'Medicare' ? 'Medicare' : key === 'Medicaid' ? 'Medicaid' : 'Khác/Tư nhân',
      value: insurances[key]
    }));
    
    // Format Age group chart data
    const ageGroupChartData = Object.keys(ageGroups).map(key => {
      const group = ageGroups[key];
      return {
        name: key,
        'Bệnh nhân': group.count,
        'Tỷ lệ Tái nhập viện 30d (%)': group.count > 0 ? parseFloat(((group.readmit / group.count) * 100).toFixed(1)) : 0,
        'Tỷ lệ Tử vong 12m (%)': group.count > 0 ? parseFloat(((group.mort / group.count) * 100).toFixed(1)) : 0
      };
    });
    
    // ICD Chapter Mapping to VN
    const icdNamesVN = {
      icd10_chap_01_infectious_parasitic: 'Nhiễm trùng & Ký sinh trùng',
      icd10_chap_02_neoplasms: 'Khối u / Ung thư',
      icd10_chap_03_blood_diseases: 'Bệnh về Máu',
      icd10_chap_04_endocrine_metabolic: 'Nội tiết & Chuyển hóa',
      icd10_chap_05_mental_disorders: 'Tâm thần & Hành vi',
      icd10_chap_06_nervous_system: 'Hệ Thần kinh',
      icd10_chap_07_eye_diseases: 'Bệnh về Mắt',
      icd10_chap_08_ear_diseases: 'Bệnh về Tai',
      icd10_chap_09_circulatory: 'Hệ Tuần hoàn (Tim mạch)',
      icd10_chap_10_respiratory: 'Hệ Hô hấp (Phổi)',
      icd10_chap_11_digestive: 'Hệ Tiêu hóa',
      icd10_chap_12_skin_diseases: 'Da & Mô dưới da',
      icd10_chap_13_musculoskeletal: 'Cơ xương khớp',
      icd10_chap_14_genitourinary: 'Hệ Tiết niệu - Sinh dục',
      icd10_chap_15_pregnancy_childbirth: 'Thai sản & Sinh nở',
      icd10_chap_16_perinatal: 'Chu sinh',
      icd10_chap_17_congenital: 'Dị tật bẩm sinh',
      icd10_chap_18_symptoms_signs: 'Lâm sàng bất thường',
      icd10_chap_19_injury_poisoning: 'Chấn thương & Ngộ độc',
      icd10_chap_20_external_causes: 'Nguyên nhân bên ngoài',
      icd10_chap_21_health_status_factors: 'Yếu tố sức khỏe khác',
    };
    
    // Format ICD data for chart
    const icdChartData = Object.keys(icdChapters).map(key => ({
      name: icdNamesVN[key] || key,
      value: icdChapters[key],
      percentage: parseFloat(((icdChapters[key] / totalPatients) * 100).toFixed(1))
    })).sort((a, b) => b.value - a.value).slice(0, 8); // Top 8
    
    // Averages
    const avgAge = totalAge / totalPatients;
    const avgDuration = totalDuration / totalPatients;
    const avgSbp = sbpCountNum > 0 ? sbpSum / sbpCountNum : 120;
    const avgSpo2 = spo2CountNum > 0 ? spo2Sum / spo2CountNum : 98;
    const avgHr = hrCountNum > 0 ? hrSum / hrCountNum : 80;
    const avgTemp = tempCountNum > 0 ? tempSum / tempCountNum : 37;

    return {
      totalPatients,
      maleCount,
      femaleCount,
      avgAge: avgAge.toFixed(1),
      avgDuration: avgDuration.toFixed(1),
      readmission30dRate: ((readmission30dCount / totalPatients) * 100).toFixed(1),
      mortality12mRate: ((mortality12mCount / totalPatients) * 100).toFixed(1),
      genderData: [
        { name: 'Nam (Male)', value: maleCount, color: '#06b6d4' },
        { name: 'Nữ (Female)', value: femaleCount, color: '#a855f7' }
      ],
      admissionChartData,
      insuranceChartData,
      ageGroupChartData,
      icdChartData,
      vitalsList: [
        { name: 'Huyết áp tâm thu TB (sbp)', value: `${Math.round(avgSbp)} mmHg`, status: avgSbp > 130 ? 'Hơi cao' : avgSbp < 90 ? 'Thấp' : 'Bình thường', statusClass: avgSbp > 130 ? 'status-alert' : 'status-normal' },
        { name: 'Nhịp tim TB (hr)', value: `${Math.round(avgHr)} bpm`, status: avgHr > 100 ? 'Nhanh' : avgHr < 60 ? 'Chậm' : 'Bình thường', statusClass: avgHr > 100 || avgHr < 60 ? 'status-alert' : 'status-normal' },
        { name: 'SpO2 TB (spo2)', value: `${avgSpo2.toFixed(1)} %`, status: avgSpo2 < 95 ? 'Thấp' : 'Tốt', statusClass: avgSpo2 < 95 ? 'status-alert' : 'status-normal' },
        { name: 'Nhiệt độ TB (temp)', value: `${avgTemp.toFixed(1)} °C`, status: avgTemp > 37.5 ? 'Sốt nhẹ' : 'Bình thường', statusClass: avgTemp > 37.5 ? 'status-alert' : 'status-normal' }
      ]
    };
  }, [patients]);

  if (!stats) {
    return (
      <div className="empty-state" style={{ height: '100%' }}>
        <Activity size={48} className="animate-spin" style={{ color: 'var(--accent-cyan)' }} />
        <p>Đang xử lý dữ liệu tổng quan lâm sàng...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: 700 }}>
          Tổng quan Dữ liệu Lâm sàng
        </h2>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid-metrics" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        
        {/* KPI 1 */}
        <div className="card card-glow-blue" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Tổng số bệnh nhân
            </span>
            <Users size={20} style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <div>
            <span style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {stats.totalPatients.toLocaleString()}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px' }}>
              ca bệnh án
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Thời gian nằm viện TB
            </span>
            <Clock size={20} style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <div>
            <span style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {stats.avgDuration}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px' }}>
              ngày/bệnh nhân
            </span>
          </div>
        </div>

      </div>

      {/* Row 2: Age groups & Outcomes */}
      <div className="grid-2col" style={{ gridTemplateColumns: '1fr' }}>
        
        {/* Card: Age Groups distribution */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <BarChart3 size={18} /> Phân bố Bệnh nhân theo nhóm tuổi
            </span>
          </div>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.ageGroupChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                <Bar dataKey="Bệnh nhân" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 3: Demographics distribution details */}
      <div className="grid-3col">
        
        {/* Gender Pie Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <PieIcon size={18} /> Phân bố Giới tính
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
            <div style={{ height: '140px', width: '100%', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} ca (${((value/stats.totalPatients)*100).toFixed(1)}%)`} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '12px',
                color: 'var(--text-muted)',
                textAlign: 'center',
                pointerEvents: 'none'
              }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                  {((stats.maleCount / stats.totalPatients) * 100).toFixed(0)}%
                </span>
                Nam giới
              </div>
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06b6d4' }}></span>
                Nam: {stats.maleCount}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a855f7' }}></span>
                Nữ: {stats.femaleCount}
              </span>
            </div>
          </div>
        </div>

        {/* Admission Type distribution */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Layers size={18} /> Phân loại Nhập viện
            </span>
          </div>
          <div style={{ height: '200px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.admissionChartData}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={9} width={80} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                <Bar dataKey="value" name="Số ca" fill="var(--accent-cyan)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insurance Pie/Bar Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <PieIcon size={18} /> Bảo hiểm Y tế
            </span>
          </div>
          <div style={{ height: '200px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.insuranceChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                <YAxis stroke="#9ca3af" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                <Bar dataKey="value" name="Bệnh nhân" fill="var(--accent-purple)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 4: ICD-10 Chapters & Vital summary statistics */}
      <div className="grid-2col">
        
        {/* ICD chapters prevalence */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Stethoscope size={18} /> Top 8 Bệnh lý/Nhóm chẩn đoán phổ biến nhất
            </span>
          </div>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.icdChartData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={10} width={130} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  formatter={(value, name, props) => [`${value} ca (${props.payload.percentage}%)`, 'Prevalence']}
                />
                <Bar dataKey="value" fill="var(--accent-blue)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Average Vitals summary panel */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Activity size={18} /> Chỉ số sinh tồn trung bình của tệp dữ liệu
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center', height: '100%' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Thống kê trung bình các chỉ số sinh tồn của toàn bộ 1000 bệnh nhân trong thời gian nằm viện:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats.vitalsList.map((vital, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {vital.name}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Chẩn đoán chung: <span className={vital.statusClass}>{vital.status}</span>
                    </span>
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                    {vital.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default OverviewDashboard;
