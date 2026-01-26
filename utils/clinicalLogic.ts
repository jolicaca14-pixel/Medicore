/**
 * 🛠️ Smith: Clinical Logic Utilities
 * Centralized business logic for medical validations and warnings.
 */

/**
 * Evaluates vital signs and returns a warning message if they are outside normal ranges.
 *
 * @param id The field ID (e.g., 'global_sys_bp')
 * @param value The value of the field
 * @param age Optional age for context-aware thresholds
 * @returns A string with the warning or null if normal
 */
export const getVitalWarning = (id: string, value: string, age?: number): string | null => {
  const n = parseFloat(value);
  if (isNaN(n)) return null;

  const isPediatric = age !== undefined && age < 15;

  if (id === 'global_sys_bp') {
    if (isPediatric) {
        if (n > 120) return 'Sístole elevada para edad pediátrica';
        if (n < 80) return 'Hipotensión pediátrica';
    }
    if (n > 140) return 'Hipertensión: Sístole elevada';
    if (n < 90) return 'Hipotensión: Sístole baja';
  }
  if (id === 'global_dia_bp') {
    if (n > 90) return 'Hipertensión: Diástole elevada';
    if (n < 60) return 'Hipotensión: Diástole baja';
  }
  if (id === 'global_heart_rate' || id === 'v_fc') {
    if (n > 100) return 'Taquicardia: FC elevada';
    if (n < 60) return 'Bradicardia: FC baja';
  }
  if (id === 'v_sat' || id === 'global_sat') {
    if (n < 90) return 'Alerta: Saturación de Oxígeno (SpO2) Crítica (<90%)';
    if (n < 94) return 'Precaución: Saturación de Oxígeno (SpO2) Baja';
  }
  if (id === 'global_temp') {
    if (n > 38.0) return 'Fiebre';
    if (n < 35.5) return 'Hipotermia';
  }
  return null;
};

/**
 * Calculates BMI (Body Mass Index)
 */
export const calculateBMI = (weightKg: number, heightM: number): string => {
  if (!weightKg || !heightM) return '0.00';
  return (weightKg / (heightM * heightM)).toFixed(2);
};

/**
 * Classifies Chronic Kidney Disease (CKD) based on GFR (Glomerular Filtration Rate)
 * Standards: KDIGO 2012
 */
export const classifyCKD = (gfr: number): { stage: string, description: string, color: string } => {
  if (gfr >= 90) return { stage: 'G1', description: 'Normal o elevado', color: 'text-green-600' };
  if (gfr >= 60) return { stage: 'G2', description: 'Ligeramente disminuido', color: 'text-green-500' };
  if (gfr >= 45) return { stage: 'G3a', description: 'Disminución ligera a moderada', color: 'text-yellow-600' };
  if (gfr >= 30) return { stage: 'G3b', description: 'Disminución moderada a grave', color: 'text-orange-600' };
  if (gfr >= 15) return { stage: 'G4', description: 'Disminución grave', color: 'text-red-500' };
  return { stage: 'G5', description: 'Fallo renal', color: 'text-red-700' };
};

/**
 * Returns color coding for Framingham Cardiovascular Risk
 */
export const getFraminghamColor = (risk: number | string): string => {
  const n = typeof risk === 'string' ? parseFloat(risk) : risk;
  if (isNaN(n)) return 'text-slate-500';
  if (n < 10) return 'text-green-600';
  if (n < 20) return 'text-orange-500';
  return 'text-red-600';
};
