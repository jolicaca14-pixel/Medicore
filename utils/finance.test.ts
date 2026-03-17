import { test } from 'node:test';
import assert from 'node:assert';
import { calculateSurcharge, calculateTotalWithSurcharge, calculateLiquidatedPay, calculateTaxRetentions } from './finance';

test('finance calculations', () => {
    assert.strictEqual(calculateSurcharge(100000, 'NIGHT'), 35000);
    assert.strictEqual(calculateTotalWithSurcharge(100000, 'HOLIDAY'), 175000);
    assert.strictEqual(calculateLiquidatedPay(50000, 10, 'NIGHT_HOLIDAY'), 500000 + 500000 * 1.10);
});

test('tax retentions', () => {
    const res = calculateTaxRetentions(1000000);
    assert.strictEqual(res.retefuente, 110000);
    assert.strictEqual(res.ica, 9660);
    assert.strictEqual(res.total, 119660);
    assert.strictEqual(res.net, 880340);
});
