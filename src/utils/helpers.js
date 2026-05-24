import { CATEGORY_MAPPINGS, DEFAULT_FEATURES_ORDER } from '../constants';

/**
 * Encodes category values to numbers based on mappings for model input
 */
export const encodeCategory = (column, val) => {
  if (!val || val === '') {
    return CATEGORY_MAPPINGS[column] ? parseFloat(CATEGORY_MAPPINGS[column].length) : 0.0;
  }
  const mapping = CATEGORY_MAPPINGS[column];
  if (mapping) {
    const idx = mapping.indexOf(val);
    return idx !== -1 ? parseFloat(idx) : parseFloat(mapping.length);
  }
  return 0.0;
};

/**
 * Builds the payload for XGBoost and XGBSE models
 */
export const buildPayload = (selectedPatient, featuresOrder, overrides = {}) => {
  const payload = {};
  const features = featuresOrder.length > 0 ? featuresOrder : DEFAULT_FEATURES_ORDER;

  features.forEach(feat => {
    const cleanFeat = feat.replace('\ufeff', '');
    let val = overrides[cleanFeat] !== undefined ? overrides[cleanFeat] : selectedPatient[cleanFeat];

    if (cleanFeat === 'gender') {
      payload[cleanFeat] = val || 'M';
    } else if (cleanFeat === 'discharge_location') {
      payload[cleanFeat] = val || null;
    } else if (CATEGORY_MAPPINGS[cleanFeat]) {
      payload[cleanFeat] = encodeCategory(cleanFeat, val);
    } else {
      if (val === undefined || val === null || val === '') {
        payload[cleanFeat] = 0.0;
      } else {
        const parsed = parseFloat(val);
        payload[cleanFeat] = isNaN(parsed) ? 0.0 : parsed;
      }
    }
  });

  return payload;
};

/**
 * Formats decimal numbers cleanly, replacing NaN/0 with placeholder
 */
export const formatValue = (val, decimals = 0) => {
  if (val === undefined || val === null || val === '') return '--';
  const num = parseFloat(val);
  return isNaN(num) || num === 0 ? '--' : num.toFixed(decimals);
};

/**
 * Evaluates physiological state based on common clinical ranges
 */
export const getVitalStatus = (name, val) => {
  if (val === undefined || val === null || val === '') return { label: 'CHƯA GHI NHẬN', alert: false };
  const num = parseFloat(val);
  if (isNaN(num) || num === 0) return { label: 'CHƯA GHI NHẬN', alert: false };

  switch(name) {
    case 'sbp_mean':
      if (num < 90 || num > 140) return { label: 'BẤT THƯỜNG', alert: true };
      return { label: 'BÌNH THƯỜNG', alert: false };
    case 'spo2_mean':
      if (num < 94) return { label: 'HẠ OXY MÁU', alert: true };
      return { label: 'BÌNH THƯỜNG', alert: false };
    case 'hr_mean':
      if (num < 55 || num > 105) return { label: 'NHỊP TIM NHANH/CHẬM', alert: true };
      return { label: 'BÌNH THƯỜNG', alert: false };
    case 'temperature_mean':
      if (num < 36.0 || num > 38.0) return { label: 'SỐT/HẠ THÂN NHIỆT', alert: true };
      return { label: 'BÌNH THƯỜNG', alert: false };
    default:
      return { label: 'BÌNH THƯỜNG', alert: false };
  }
};
