import { test } from 'node:test';
import assert from 'node:assert';
import { calculateTFG, calculateFramingham, calculateBMI, getVitalWarning } from './clinicalLogic';

test('getVitalWarning', () => {
  // SpO2
  assert.strictEqual(getVitalWarning('v_sat', '98'), null);
  assert.strictEqual(getVitalWarning('v_sat', '92'), 'Precaución: Saturación baja (SpO2 < 94%)');
  assert.strictEqual(getVitalWarning('v_sat', '85'), 'CRÍTICO: Hipoxia severa (SpO2 < 90%)');

  // BP Crisis
  assert.strictEqual(getVitalWarning('global_sys_bp', '120'), null);
  assert.strictEqual(getVitalWarning('global_sys_bp', '185'), 'URGENCIA: Crisis Hipertensiva (Sístole >= 180)');
  assert.strictEqual(getVitalWarning('global_dia_bp', '115'), 'URGENCIA: Crisis Hipertensiva (Diástole >= 110)');
});

test('calculateBMI', () => {
  assert.strictEqual(calculateBMI(70, 1.75), "22.86");
  assert.strictEqual(calculateBMI(0, 1.75), "0.00");
});

test('calculateTFG', () => {
  // Male, 40 years, 70kg, 1.0 creatinine
  assert.strictEqual(Math.round(calculateTFG(40, 70, 1.0, 'M')), 97);
  // Female, 40 years, 70kg, 1.0 creatinine
  assert.strictEqual(Math.round(calculateTFG(40, 70, 1.0, 'F')), 83);
});

test('calculateFramingham', () => {
  // Healthy young person
  const risk1 = calculateFramingham(25, 'F', 110, 180, 50, false);
  assert.ok(risk1 < 5);

  // High risk person
  const risk2 = calculateFramingham(65, 'M', 165, 250, 35, true);
  assert.ok(risk2 > 15);
});
