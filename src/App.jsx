import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { Activity, AlertCircle } from 'lucide-react';

// Constants
import { API_BASE_URL, DEFAULT_FEATURES_ORDER, ICD10_CHAPTERS } from './constants';

// Helpers
import { buildPayload } from './utils/helpers';

// Components
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import Demographics from './components/Demographics';
import VitalsSummary from './components/VitalsSummary';
import AIPrognosis from './components/AIPrognosis';
import SandboxSimulation from './components/SandboxSimulation';
import TimelineCurves from './components/TimelineCurves';
import ClinicalTabs from './components/ClinicalTabs';
import OverviewDashboard from './components/OverviewDashboard';
import XAIExplanation from './components/XAIExplanation';
import PatientList from './components/PatientList';

function App() {
  const [patients, setPatients] = useState([]);
  const [loadingCsv, setLoadingCsv] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentView, setCurrentView] = useState('overview');

  const [featuresOrder, setFeaturesOrder] = useState([]);

  const [isPredicting, setIsPredicting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [backendOnline, setBackendOnline] = useState(null);
  const [readmissionResult, setReadmissionResult] = useState(null);
  const [mortalityResult, setMortalityResult] = useState(null);
  const [whatIfReadmission, setWhatIfReadmission] = useState(null);
  const [whatIfMortality, setWhatIfMortality] = useState(null);
  const [readmissionXAI, setReadmissionXAI] = useState(null);
  const [mortalityXAI, setMortalityXAI] = useState(null);
  const [isLoadingXAI, setIsLoadingXAI] = useState(false);

  const [activeTab, setActiveTab] = useState('labs');
  const [sandboxOverrides, setSandboxOverrides] = useState({});

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    fetch(API_BASE_URL + '/')
      .then(res => res.json())
      .then(data => {
        setBackendOnline(true);
        fetch(API_BASE_URL + '/metadata')
          .then(r => r.json())
          .then(meta => {
            if (meta.features_order) {
              setFeaturesOrder(meta.features_order);
            }
          })
          .catch(err => {
            console.error('Error loading metadata:', err);
            setFeaturesOrder(DEFAULT_FEATURES_ORDER);
          });
      })
      .catch(err => {
        console.error('Backend offline:', err);
        setBackendOnline(false);
        setFeaturesOrder(DEFAULT_FEATURES_ORDER);
      });

    Papa.parse(`${import.meta.env.BASE_URL}dataset_test_1000.csv`, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setPatients(results.data);
        if (results.data.length > 0) {
          setSelectedPatient(results.data[0]);
        }
        setLoadingCsv(false);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setLoadingCsv(false);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      setSandboxOverrides({
        age: Math.round(parseFloat(selectedPatient.age)) || 60,
        sbp_mean: Math.round(parseFloat(selectedPatient.sbp_mean)) || 120,
        spo2_mean: Math.round(parseFloat(selectedPatient.spo2_mean)) || 98,
        hr_mean: Math.round(parseFloat(selectedPatient.hr_mean)) || 80,
        temperature_mean: parseFloat((parseFloat(selectedPatient.temperature_mean) || 37.0).toFixed(1)),
        duration_days: Math.round(parseFloat(selectedPatient.duration_days)) || 4,
        discharge_location: selectedPatient.discharge_location || 'HOME'
      });
      setReadmissionResult(null);
      setMortalityResult(null);
      setWhatIfReadmission(null);
      setWhatIfMortality(null);
      setReadmissionXAI(null);
      setMortalityXAI(null);
      setApiError(null);
    }
  }, [selectedPatient]);

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients.slice(0, 100);
    const query = searchQuery.toLowerCase().trim();
    return patients.filter(p =>
      (p.hadm_id && p.hadm_id.toLowerCase().includes(query)) ||
      (p.subject_id && p.subject_id.toLowerCase().includes(query))
    ).slice(0, 100);
  }, [patients, searchQuery]);

  const runPredictions = async (overrides = sandboxOverrides, skipXAI = false) => {
    if (!selectedPatient) return;
    setIsPredicting(true);
    setApiError(null);

    const payload = buildPayload(selectedPatient, featuresOrder, overrides);

    try {
      const [predReadmitRes, whatifReadmitRes, predMortRes, whatifMortRes] = await Promise.all([
        fetch(API_BASE_URL + '/predict/readmission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(res => {
          if (!res.ok) throw new Error('API Readmission error');
          return res.json();
        }),
        fetch(API_BASE_URL + '/what-if/readmission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(res => {
          if (!res.ok) throw new Error('API What-If Readmission error');
          return res.json();
        }),
        fetch(API_BASE_URL + '/predict/mortality', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(res => {
          if (!res.ok) throw new Error('API Mortality error');
          return res.json();
        }),
        fetch(API_BASE_URL + '/what-if/mortality', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(res => {
          if (!res.ok) throw new Error('API What-If Mortality error');
          return res.json();
        })
      ]);

      if (predReadmitRes.status === 'success') {
        setReadmissionResult(predReadmitRes.data);
      }
      if (whatifReadmitRes.status === 'success') {
        setWhatIfReadmission(whatifReadmitRes.data);
      }
      if (predMortRes.status === 'success') {
        setMortalityResult(predMortRes.data);
      }
      if (whatifMortRes.status === 'success') {
        setWhatIfMortality(whatifMortRes.data);
      }

      if (!skipXAI) {
        // Fetch XAI explanations in parallel (non-blocking)
        setIsLoadingXAI(true);
        Promise.all([
          fetch(API_BASE_URL + '/explain/readmission', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).then(res => res.ok ? res.json() : null).catch(() => null),
          fetch(API_BASE_URL + '/explain/mortality', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).then(res => res.ok ? res.json() : null).catch(() => null)
        ]).then(([xaiReadmit, xaiMort]) => {
          if (xaiReadmit && xaiReadmit.status === 'success') {
            setReadmissionXAI(xaiReadmit.data);
          }
          if (xaiMort && xaiMort.status === 'success') {
            setMortalityXAI(xaiMort.data);
          }
        }).finally(() => {
          setIsLoadingXAI(false);
        });
      }

    } catch (error) {
      console.error(error);
      setApiError(error.message || 'Lỗi kết nối với API Backend.');
    } finally {
      setIsPredicting(false);
    }
  };

  const readmissionChartData = useMemo(() => {
    if (!readmissionResult) return [];
    return readmissionResult.curve_30day.days.map((day, idx) => ({
      day,
      'Tái nhập viện hiện tại': (readmissionResult.curve_30day.probabilities[idx] * 100).toFixed(1)
    }));
  }, [readmissionResult]);

  const readmissionHazardChartData = useMemo(() => {
    if (!readmissionResult || !readmissionResult.curve_30day.hazard_rates) return [];
    return readmissionResult.curve_30day.days.map((day, idx) => ({
      day,
      'Tỷ lệ Hazard hiện tại': (readmissionResult.curve_30day.hazard_rates[idx] * 100).toFixed(3)
    }));
  }, [readmissionResult]);

  const combinedWhatIfReadmissionData = useMemo(() => {
    if (!whatIfReadmission) return [];
    const keys = Object.keys(whatIfReadmission);
    if (keys.length === 0) return [];

    const firstKey = keys[0];
    return whatIfReadmission[firstKey].curve_30day.days.map((day, idx) => {
      const dataObj = { day };
      keys.forEach(k => {
        dataObj[whatIfReadmission[k].name] = (whatIfReadmission[k].curve_30day.probabilities[idx] * 100).toFixed(1);
      });
      return dataObj;
    });
  }, [whatIfReadmission]);

  const combinedWhatIfReadmissionHazardData = useMemo(() => {
    if (!whatIfReadmission) return [];
    const keys = Object.keys(whatIfReadmission);
    if (keys.length === 0) return [];

    const firstKey = keys[0];
    if (!whatIfReadmission[firstKey].curve_30day.hazard_rates) return [];
    return whatIfReadmission[firstKey].curve_30day.days.map((day, idx) => {
      const dataObj = { day };
      keys.forEach(k => {
        dataObj[whatIfReadmission[k].name] = (whatIfReadmission[k].curve_30day.hazard_rates[idx] * 100).toFixed(3);
      });
      return dataObj;
    });
  }, [whatIfReadmission]);

  const combinedWhatIfMortalityData = useMemo(() => {
    if (!whatIfMortality) return [];
    const keys = Object.keys(whatIfMortality);
    if (keys.length === 0) return [];

    const firstKey = keys[0];
    return whatIfMortality[firstKey].survival_curve.days.map((day, idx) => {
      const dataObj = { day };
      keys.forEach(k => {
        dataObj[whatIfMortality[k].name] = (whatIfMortality[k].survival_curve.probabilities[idx] * 100).toFixed(1);
      });
      return dataObj;
    });
  }, [whatIfMortality]);

  const combinedWhatIfMortalityHazardData = useMemo(() => {
    if (!whatIfMortality) return [];
    const keys = Object.keys(whatIfMortality);
    if (keys.length === 0) return [];

    const firstKey = keys[0];
    if (!whatIfMortality[firstKey].survival_curve.hazard_rates) return [];
    return whatIfMortality[firstKey].survival_curve.days.map((day, idx) => {
      const dataObj = { day };
      keys.forEach(k => {
        dataObj[whatIfMortality[k].name] = (whatIfMortality[k].survival_curve.hazard_rates[idx] * 100).toFixed(3);
      });
      return dataObj;
    });
  }, [whatIfMortality]);

  const activeDiagnoses = useMemo(() => {
    if (!selectedPatient) return [];
    return Object.keys(ICD10_CHAPTERS).filter(key =>
      parseFloat(selectedPatient[key]) === 1.0
    ).map(key => ({
      key,
      name: ICD10_CHAPTERS[key]
    }));
  }, [selectedPatient]);

  const labsData = useMemo(() => {
    if (!selectedPatient) return [];
    const labsList = [];
    Object.keys(selectedPatient).forEach(k => {
      if (k.endsWith('_mean') && !['sbp_mean', 'spo2_mean', 'hr_mean', 'temperature_mean'].includes(k)) {
        const value = parseFloat(selectedPatient[k]);
        if (!isNaN(value) && value > 0) {
          const cleanName = k.replace('_mean', '').toUpperCase();
          labsList.push({ name: cleanName, val: value.toFixed(2) });
        }
      }
    });
    return labsList;
  }, [selectedPatient]);

  return (
    <>
      {/* Sidebar: Patient Search and Select */}
      <Sidebar
        loadingCsv={loadingCsv}
        filteredPatients={filteredPatients}
        selectedPatient={selectedPatient}
        setSelectedPatient={setSelectedPatient}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        backendOnline={backendOnline}
        currentView={currentView}
        setCurrentView={setCurrentView}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Panel */}
      <main className="dashboard">
        {currentView === 'overview' ? (
          <OverviewDashboard patients={patients} />
        ) : currentView === 'list' ? (
          <PatientList
            patients={patients}
            onSelectPatient={(p) => {
              setSelectedPatient(p);
              setCurrentView('patient');
            }}
          />
        ) : selectedPatient ? (
          <>
            {/* Header patient bar */}
            <DashboardHeader
              selectedPatient={selectedPatient}
              runPredictions={runPredictions}
              isPredicting={isPredicting}
              backendOnline={backendOnline}
            />

            {/* Dashboard Content */}
            <div className="dashboard-content">
              {apiError && (
                <div className="card" style={{ borderColor: 'var(--status-danger)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                  <div style={{ display: 'flex', gap: '10px', color: 'var(--status-danger)', fontWeight: 600 }}>
                    <AlertCircle size={20} />
                    <span>Lỗi API Backend: {apiError}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Vui lòng đảm bảo backend FastAPI đang chạy trên `http://127.0.0.1:8000` (xem hướng dẫn ở `api.md`).
                  </p>
                </div>
              )}

              {/* Row 1: Demographics & Key Clinical Vitals */}
              <div className="grid-3col">
                <Demographics selectedPatient={selectedPatient} />
                <VitalsSummary selectedPatient={selectedPatient} />
              </div>

              {/* Row 2: AI Prognosis Prognosis Result Indicators */}
              <AIPrognosis
                isPredicting={isPredicting}
                readmissionResult={readmissionResult}
                mortalityResult={mortalityResult}
              />

              {/* Row 3: XAI Explanation */}
              {(readmissionResult || mortalityResult) && (
                <XAIExplanation
                  readmissionXAI={readmissionXAI}
                  mortalityXAI={mortalityXAI}
                  isLoadingXAI={isLoadingXAI}
                />
              )}

              {/* Row 4: Interactive Sandbox & What-If comparison */}
              {readmissionResult && mortalityResult && (
                <SandboxSimulation
                  selectedPatient={selectedPatient}
                  readmissionXAI={readmissionXAI}
                  mortalityXAI={mortalityXAI}
                  sandboxOverrides={sandboxOverrides}
                  setSandboxOverrides={setSandboxOverrides}
                  runPredictions={runPredictions}
                  whatIfReadmission={whatIfReadmission}
                  whatIfMortality={whatIfMortality}
                />
              )}

              {/* Row 4: Timeline Curves Charts */}
              <TimelineCurves
                readmissionResult={readmissionResult}
                mortalityResult={mortalityResult}
                combinedWhatIfReadmissionData={combinedWhatIfReadmissionData}
                combinedWhatIfMortalityData={combinedWhatIfMortalityData}
                combinedWhatIfReadmissionHazardData={combinedWhatIfReadmissionHazardData}
                combinedWhatIfMortalityHazardData={combinedWhatIfMortalityHazardData}
                whatIfReadmission={whatIfReadmission}
                whatIfMortality={whatIfMortality}
                readmissionChartData={readmissionChartData}
                readmissionHazardChartData={readmissionHazardChartData}
              />

              {/* Row 5: Detailed Clinical Labs & ICD10 diagnoses chapters */}
              <ClinicalTabs
                selectedPatient={selectedPatient}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeDiagnoses={activeDiagnoses}
                labsData={labsData}
              />
            </div>
          </>
        ) : (
          <div className="empty-state" style={{ height: '100%' }}>
            <Activity size={64} className="animate-pulse" style={{ color: 'var(--accent-cyan)' }} />
            <h2 style={{ color: 'var(--text-primary)' }}>Không có bệnh nhân được chọn</h2>
            <p>Vui lòng chọn một bệnh nhân từ danh sách bên trái để tải thông tin bệnh án.</p>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
