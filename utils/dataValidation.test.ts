import { test } from 'node:test';
import assert from 'node:assert';
import { getSOATFactor, calculateSOATPrice, validateCUPSCode } from './dataValidation';

test('data validation calculations', () => {
    // 890201 has factor 1.00 in mocks
    assert.strictEqual(getSOATFactor('890201'), 1.00);
    assert.strictEqual(calculateSOATPrice('890201', 45000), 45000);

    // 903825 has factor 1.80
    assert.strictEqual(getSOATFactor('903825'), 1.80);
    assert.strictEqual(calculateSOATPrice('903825', 45000), 45000 * 1.80);

    assert.ok(validateCUPSCode('890201'));
    assert.ok(!validateCUPSCode('INVALID'));
});
