/**
 * 🛡️ Morpheus: Audit Logging Utility
 * Simulates the recording of sensitive system events for compliance and security auditing.
 */

export interface AuditLogEntry {
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
}

/**
/**
 * Helper to mask sensitive numbers (Identification, etc.)
 */
const maskSensitiveData = (text: string): string => {
  if (!text) return text;

  let masked = text;

  // 1. Mask 6+ digit numbers (like IDs)
  masked = masked.replace(/\b(\d{3})\d+(\d{2,})\b/g, '$1*****$2');

  // 2. Mask Emails
  masked = masked.replace(/\b([a-zA-Z0-9._%+-])([a-zA-Z0-9._%+-]*)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g, (match, firstChar, middle, domain) => {
    return `${firstChar}***@${domain}`;
  });

  return masked;
};

/**
 * Records a security-relevant event in the system audit log.
 * In a production environment, this would send data to a secure, tamper-proof backend.
 */
export const logAuditEvent = (userId: string, action: string, resource: string, details: string) => {
  const entry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    userId,
    action,
    resource,
    details: maskSensitiveData(details),
    ipAddress: '127.0.0.1' // Simulated
  };

  // Optional: persist in a 'system_audit' key in localStorage for session-wide tracking
  if (typeof localStorage !== 'undefined') {
    const logs = JSON.parse(localStorage.getItem('medicore_audit_logs') || '[]');
    logs.push(entry);
    localStorage.setItem('medicore_audit_logs', JSON.stringify(logs.slice(-100))); // Keep last 100
  }
};
