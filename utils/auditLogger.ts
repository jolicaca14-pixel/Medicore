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
 * Records a security-relevant event in the system audit log.
 * In a production environment, this would send data to a secure, tamper-proof backend.
 */
export const logAuditEvent = (userId: string, action: string, resource: string, details: string) => {
  const entry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    userId,
    action,
    resource,
    details,
    ipAddress: '127.0.0.1' // Simulated
  };

  // For simulation purposes, we log to console and could also store in a hidden global state/localStorage
  console.log('🛡️ [AUDIT LOG]', entry);

  // Optional: persist in a 'system_audit' key in localStorage for session-wide tracking
  const logs = JSON.parse(localStorage.getItem('medicore_audit_logs') || '[]');
  logs.push(entry);
  localStorage.setItem('medicore_audit_logs', JSON.stringify(logs.slice(-100))); // Keep last 100
};
