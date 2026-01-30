import { test } from 'node:test';
import assert from 'node:assert';
import { calculateTFG, calculateFramingham, calculateBMI } from './clinicalLogic';

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
