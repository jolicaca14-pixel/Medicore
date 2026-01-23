/**
 * 🛠️ Smith: Clinical Logic Utilities
 * Centralized business logic for medical validations and warnings.
 */

/**
 * Evaluates vital signs and returns a warning message if they are outside normal ranges.
 *
 * @param id The field ID (e.g., 'global_sys_bp')
 * @param value The value of the field
 * @returns A string with the warning or null if normal
 */
export const getVitalWarning = (id: string, value: string): string | null => {
  const n = parseFloat(value);
  if (isNaN(n)) return null;

  if (id === 'global_sys_bp') {
    if (n > 140) return 'Hipertensión: Sístole elevada';
    if (n < 90) return 'Hipotensión: Sístole baja';
  }
  if (id === 'global_dia_bp') {
    if (n > 90) return 'Hipertensión: Diástole elevada';
    if (n < 60) return 'Hipotensión: Diástole baja';
  }
  if (id === 'global_heart_rate') {
    if (n > 100) return 'Taquicardia: FC elevada';
    if (n < 60) return 'Bradicardia: FC baja';
  }
  if (id === 'global_temp') {
    if (n > 38.0) return 'Fiebre';
    if (n < 35.5) return 'Hipotermia';
  }
  return null;
};
