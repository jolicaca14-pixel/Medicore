import { test } from 'node:test';
import assert from 'node:assert';
import { logAuditEvent } from './auditLogger';

test('logAuditEvent masks data', () => {
    // Capture console.log
    const originalLog = console.log;
    let capturedEntry: any = null;
    console.log = (msg, entry) => {
        if (msg === '🛡️ [AUDIT LOG]') capturedEntry = entry;
    };

    try {
        logAuditEvent('u1', 'SEARCH', 'Patient', 'Searching for ID 12345678 and email test@example.com');

        assert.ok(capturedEntry.details.includes('123*****78'));
        assert.ok(capturedEntry.details.includes('t***@example.com'));
        assert.ok(!capturedEntry.details.includes('12345678'));
        assert.ok(!capturedEntry.details.includes('test@example.com'));
    } finally {
        console.log = originalLog;
    }
});
