# MediCore Pro - API & Data Specification 📑

## Core Interfaces

### Patient
Defined in `types.ts`. Represents a patient in the system.
- `id`: UUID-like string.
- `fullName`: String.
- `identification`: National ID (Documento).
- `birthDate`: ISO Date string.
- `gender`: 'M' | 'F' | 'OTHER'.
- `insuranceType`: String (e.g., 'Sanitas', 'Sura').

### ClinicalRecord
Defined in `types.ts`. Immutable once finalized.
- `id`: Unique record ID.
- `patientId`: FK to Patient.
- `professionalId`: FK to User.
- `recordType`: Enum (GENERAL, PROCEDURE, LAB_RESULT, etc.).
- `status`: DRAFT | FINALIZED | VOID.
- `chiefComplaint`: String (Motivo de consulta).
- `diagnoses`: Array of `DiagnosisItem` (CIE-11).
- `antecedents`: Text block for clinical history.
- `dynamicData`: JSON object containing template-specific field values.

### User
Defined in `types.ts`. System user with RBAC.
- `id`: User ID.
- `username`: Login name.
- `roles`: Array of `UserRole`.
- `documentNumber`: Used for mock authentication.

## Persistence Strategy
- **Session**: Stored in `sessionStorage` (`medicore_session`) to ensure persistence across reloads but isolation to the browser tab.
- **Audit Logs**: Simulated in `localStorage` (`medicore_audit_logs`) for demonstration.

---
*Documented by Link (Documentation Agent) during Cycle 17.*
