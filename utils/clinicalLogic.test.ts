import { validateDosage, getVitalWarning } from './clinicalLogic';

describe('Clinical Logic Utilities', () => {
  describe('validateDosage', () => {
    it('should allow normal dosages', () => {
      expect(validateDosage('Acetaminofen', '500')).toBeNull();
      expect(validateDosage('Ibuprofeno', '400')).toBeNull();
    });

    it('should return warning for high dosages', () => {
      expect(validateDosage('Acetaminofen', '1500')).toContain('Dosis máxima');
      expect(validateDosage('Ibuprofeno', '1000')).toContain('Dosis máxima');
    });
  });

  describe('getVitalWarning', () => {
    it('should alert on high heart rate', () => {
      expect(getVitalWarning('global_heart_rate', '120')).toContain('Taquicardia');
    });

    it('should alert on low SpO2', () => {
      expect(getVitalWarning('v_sat', '88')).toContain('Crítica');
    });
  });
});
