import React, { useState } from 'react';
import { Brain, TrendingUp, Shield, ChevronDown, ChevronUp, AlertTriangle, Sparkles, Info } from 'lucide-react';

/**
 * Renders a single factor card with a horizontal bar + metadata.
 */
function FactorBar({ card, maxAbsShap, type }) {
  const absVal = Math.abs(card.shap_value);
  const widthPct = maxAbsShap > 0 ? Math.min((absVal / maxAbsShap) * 100, 100) : 0;
  const isRisk = type === 'risk';

  const importanceBadge = {
    high: { label: 'Quan trọng', className: 'xai-badge-high' },
    medium: { label: 'Trung bình', className: 'xai-badge-medium' },
    low: { label: 'Thấp', className: 'xai-badge-low' },
  }[card.importance] || { label: '', className: '' };

  return (
    <div className="xai-factor-card">
      <div className="xai-factor-header">
        <span className="xai-factor-name">{card.display_name}</span>
        <span className={`xai-badge ${importanceBadge.className}`}>{importanceBadge.label}</span>
      </div>
      <div className="xai-bar-container">
        <div
          className={`xai-bar-fill ${isRisk ? 'xai-bar-risk' : 'xai-bar-protect'}`}
          style={{ width: `${widthPct}%` }}
        />
      </div>
      <div className="xai-factor-meta">
        <span className="xai-factor-value">Giá trị: <b>{card.display_value || (card.value !== undefined ? card.value.toFixed(2) : '')}</b></span>
      </div>
      {card.explanation && (
        <div className="xai-factor-explanation">
          <Info size={13} />
          <span>{card.explanation}</span>
        </div>
      )}
    </div>
  );
}


function XAIExplanation({ readmissionXAI, mortalityXAI, isLoadingXAI }) {
  const [expandedReadmission, setExpandedReadmission] = useState(true);
  const [expandedMortality, setExpandedMortality] = useState(true);

  if (isLoadingXAI) {
    return (
      <div className="card xai-loading-card">
        <div className="scanner-container">
          <div className="pulse-circle">
            <Brain size={32} />
          </div>
          <span className="scanner-text">Hệ thống xAI đang phân tích SHAP explanations...</span>
        </div>
      </div>
    );
  }

  if (!readmissionXAI && !mortalityXAI) {
    return null;
  }

  const renderExplanationPanel = (data, title, icon, glowClass, expanded, setExpanded) => {
    if (!data) return null;

    const allFactors = [...(data.top_risk_factors || []), ...(data.top_protective_factors || [])];
    const maxAbsShap = allFactors.length > 0
      ? Math.max(...allFactors.map(f => Math.abs(f.shap_value)))
      : 1;

    return (
      <div className={`card ${glowClass} xai-panel`}>
        <div className="card-header xai-card-header" onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
          <span className="card-title">
            {icon} {title}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>

        {expanded && (
          <div className="xai-panel-body">
            {/* Risk factors */}
            {data.top_risk_factors && data.top_risk_factors.length > 0 && (
              <div className="xai-section">
                <div className="xai-section-header risk">
                  <AlertTriangle size={16} />
                  <span>Yếu tố TĂNG nguy cơ</span>
                </div>
                <div className="xai-factors-list">
                  {data.top_risk_factors.map((card, idx) => (
                    <FactorBar key={idx} card={card} maxAbsShap={maxAbsShap} type="risk" />
                  ))}
                </div>
              </div>
            )}

            {/* Protective factors */}
            {data.top_protective_factors && data.top_protective_factors.length > 0 && (
              <div className="xai-section">
                <div className="xai-section-header protect">
                  <Shield size={16} />
                  <span>Yếu tố BẢO VỆ</span>
                </div>
                <div className="xai-factors-list">
                  {data.top_protective_factors.map((card, idx) => (
                    <FactorBar key={idx} card={card} maxAbsShap={maxAbsShap} type="protect" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="xai-explanation-container">
      <div className="xai-title-row">
        <Sparkles size={20} style={{ color: 'var(--accent-purple)' }} />
        <h3 className="xai-main-title">Giải thích AI (SHAP Explainability)</h3>
      </div>
      <div className="grid-2col">
        {renderExplanationPanel(
          readmissionXAI,
          'Giải thích Tái nhập viện (30 ngày)',
          <TrendingUp size={18} />,
          'card-glow-blue',
          expandedReadmission,
          setExpandedReadmission
        )}
        {renderExplanationPanel(
          mortalityXAI,
          'Giải thích Tử vong (12 tháng)',
          <Shield size={18} />,
          'card-glow-purple',
          expandedMortality,
          setExpandedMortality
        )}
      </div>
    </div>
  );
}

export default XAIExplanation;
