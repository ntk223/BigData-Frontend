export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fallback features order matching the exact 236 features of the CDSS model
export const DEFAULT_FEATURES_ORDER = [
  "age","gender","admission_type","insurance","marital_status","race","discharge_location","duration_days",
  "sbp_mean","sbp_min","sbp_max","sbp_count","spo2_mean","spo2_count","hr_mean","hr_count","temperature_mean","temperature_count",
  "albumin_max","albumin_mean","albumin_min","alt_max","alt_mean","alt_min","anion_gap_max","anion_gap_mean","anion_gap_min",
  "ast_max","ast_mean","ast_min","bicarbonate_max","bicarbonate_mean","bicarbonate_min","bilirubin_total_max","bilirubin_total_mean","bilirubin_total_min",
  "bun_max","bun_mean","bun_min","calcium_max","calcium_mean","calcium_min","chloride_max","chloride_mean","chloride_min",
  "creatinine_max","creatinine_mean","creatinine_min","glucose_max","glucose_mean","glucose_min","hematocrit_max","hematocrit_mean","hematocrit_min",
  "hemoglobin_max","hemoglobin_mean","hemoglobin_min","inr_max","inr_mean","inr_min","lactate_max","lactate_mean","lactate_min",
  "magnesium_max","magnesium_mean","magnesium_min","phosphate_max","phosphate_mean","phosphate_min","platelet_max","platelet_mean","platelet_min",
  "potassium_max","potassium_mean","potassium_min","pt_max","pt_mean","pt_min","ptt_max","ptt_mean","ptt_min",
  "sodium_max","sodium_mean","sodium_min","wbc_max","wbc_mean","wbc_min",
  "icd10_chap_01_infectious_parasitic","icd10_chap_02_neoplasms","icd10_chap_03_blood_diseases","icd10_chap_04_endocrine_metabolic","icd10_chap_05_mental_disorders",
  "icd10_chap_06_nervous_system","icd10_chap_07_eye_diseases","icd10_chap_08_ear_diseases","icd10_chap_09_circulatory","icd10_chap_10_respiratory",
  "icd10_chap_11_digestive","icd10_chap_12_skin_diseases","icd10_chap_13_musculoskeletal","icd10_chap_14_genitourinary","icd10_chap_15_pregnancy_childbirth",
  "icd10_chap_16_perinatal","icd10_chap_17_congenital","icd10_chap_18_symptoms_signs","icd10_chap_19_injury_poisoning","icd10_chap_20_external_causes",
  "icd10_chap_21_health_status_factors",
  ...Array.from({ length: 128 }, (_, i) => `note_emb_${i + 1}`)
];

export const CATEGORY_MAPPINGS = {
  admission_type: [
    'AMBULATORY OBSERVATION',
    'DIRECT EMER.',
    'DIRECT OBSERVATION',
    'ELECTIVE',
    'EU OBSERVATION',
    'EW EMER.',
    'OBSERVATION ADMIT',
    'SURGICAL SAME DAY ADMISSION',
    'URGENT'
  ],
  insurance: [
    'Medicaid',
    'Medicare',
    'Other'
  ],
  marital_status: [
    'DIVORCED',
    'MARRIED',
    'SINGLE',
    'WIDOWED'
  ],
  race: [
    'AMERICAN INDIAN/ALASKA NATIVE',
    'ASIAN',
    'ASIAN - ASIAN INDIAN',
    'ASIAN - CHINESE',
    'ASIAN - KOREAN',
    'BLACK/AFRICAN',
    'BLACK/AFRICAN AMERICAN',
    'BLACK/CAPE VERDEAN',
    'BLACK/CARIBBEAN ISLAND',
    'HISPANIC OR LATINO',
    'HISPANIC/LATINO - CENTRAL AMERICAN',
    'HISPANIC/LATINO - CUBAN',
    'HISPANIC/LATINO - DOMINICAN',
    'HISPANIC/LATINO - GUATEMALAN',
    'HISPANIC/LATINO - HONDURAN',
    'HISPANIC/LATINO - MEXICAN',
    'HISPANIC/LATINO - PUERTO RICAN',
    'HISPANIC/LATINO - SALVADORAN',
    'MULTIPLE RACE/ETHNICITY',
    'NATIVE HAWAIIAN OR OTHER PACIFIC ISLANDER',
    'OTHER',
    'PORTUGUESE',
    'SOUTH AMERICAN',
    'UNABLE TO OBTAIN',
    'UNKNOWN',
    'WHITE',
    'WHITE - EASTERN EUROPEAN',
    'WHITE - OTHER EUROPEAN',
    'WHITE - RUSSIAN'
  ]
};

export const ICD10_CHAPTERS = {
  icd10_chap_01_infectious_parasitic: 'Infectious and Parasitic Diseases',
  icd10_chap_02_neoplasms: 'Neoplasms / Tumors',
  icd10_chap_03_blood_diseases: 'Diseases of the Blood',
  icd10_chap_04_endocrine_metabolic: 'Endocrine, Nutritional and Metabolic Diseases',
  icd10_chap_05_mental_disorders: 'Mental and Behavioral Disorders',
  icd10_chap_06_nervous_system: 'Diseases of the Nervous System',
  icd10_chap_07_eye_diseases: 'Diseases of the Eye and Adnexa',
  icd10_chap_08_ear_diseases: 'Diseases of the Ear and Mastoid Process',
  icd10_chap_09_circulatory: 'Diseases of the Circulatory System (Heart, Blood Vessels)',
  icd10_chap_10_respiratory: 'Diseases of the Respiratory System (Lung)',
  icd10_chap_11_digestive: 'Diseases of the Digestive System',
  icd10_chap_12_skin_diseases: 'Diseases of the Skin and Subcutaneous Tissue',
  icd10_chap_13_musculoskeletal: 'Diseases of the Musculoskeletal System',
  icd10_chap_14_genitourinary: 'Diseases of the Genitourinary System (Kidney, Urinary Tract)',
  icd10_chap_15_pregnancy_childbirth: 'Pregnancy, Childbirth and the Puerperium',
  icd10_chap_16_perinatal: 'Conditions originating in the Perinatal Period',
  icd10_chap_17_congenital: 'Congenital Malformations and Deformations',
  icd10_chap_18_symptoms_signs: 'Symptoms and Abnormal Clinical Findings',
  icd10_chap_19_injury_poisoning: 'Injury, Poisoning and External Consequences',
  icd10_chap_20_external_causes: 'External Causes of Morbidity',
  icd10_chap_21_health_status_factors: 'Factors influencing Health Status & Contact with Services'
};
