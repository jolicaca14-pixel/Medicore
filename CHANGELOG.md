# Changelog - MediCore Pro

All notable changes to this project will be documented in this file.

## [2026-01-23] - 10-Cycle Optimization (Protocol Jules)

### Added
- `hooks/useAuth.ts`: Custom hook for centralized authentication management.
- `utils/security.test.ts`: Unit tests for input sanitization.
- `utils/dataValidation.ts`: CIE-11 code validation utilities.
- `utils/finance.ts`: Colombian labor law surcharge calculations.
- `.jules/system_overview.md`: Comprehensive system documentation.

### Changed
- `App.tsx`:
    - Implemented secure session persistence using `sessionStorage`.
    - Integrated `useAuth` hook.
    - Improved accessibility with `aria-label`, `aria-live`, and `aria-required`.
- `components/views/ProfessionalView.tsx`:
    - Added clinical safety warning for missing antecedents during record finalization.
- `.Jules/Documentacion/task.md`: Updated to reflect Phase 4 completion.

### Fixed
- Fixed session loss on page refresh by implementing `sessionStorage` recovery.
- Improved clinical safety by preventing accidental finalization of records without history.

## [2026-01-23] - 20-Cycle Optimization (Protocol Jules x20)

### Added
- `components/ErrorBoundary.tsx`: Global error handler.
- `utils/auditLogger.ts`: Security auditing utility.
- `tests/auth.spec.ts`: Permanent Playwright E2E tests.
- `.jules/api_spec.md`: Data specification documentation.

### Changed
- `ProfessionalView.tsx`:
    - Dynamic progress messages during finalization.
    - Vital signs threshold alerts.
    - SOAT pricing integration in procedure selection.
- `utils/dataValidation.ts`: Added `validateCUPSCode`.
- `index.tsx`: Integrated `ErrorBoundary`.

## [2026-01-24] - 5-Cycle Advanced Optimization (Protocol Jules x5)

### Added
- `utils/clinicalLogic.ts`: Extracted clinical validation logic.

### Changed
- `ProfessionalView.tsx`:
    - Implemented reactive patient searching and filtering.
    - Added high-visibility Allergy alerts (Badges and Banner).
    - Integrated multi-point security audit logging.
- `types.ts`: Added `allergies` field to `Patient`.
- `constants.ts`: Updated mock data with clinical allergy records.

### Fixed
- **Security**: Removed hardcoded demo credentials from professional views.
- **UX**: Optimized patient list management for high-volume scenarios.

## [2026-01-24] - 20-Cycle Maturity Optimization (Protocol Jules x20)

### Added
- **Calculators**: BMI, CKD Stage, and Framingham color-coding utilities.
- **Persistence**: Auto-save drafts to `localStorage`.

### Changed
- **UX**:
    - "Clear Search" button and Empty States for patient list.
    - Sidebar tooltips and character counters for clinical fields.
    - "Copy ID" shortcut for administrative use.
- **Security**:
    - Input sanitization and audit logging for searches.
    - Sensitive data masking (PII) in system audit logs.
    - Digital signature presence validation.
- **Performance**: Debounced search functionality.

### Fixed
- **Safety**: Added pediatric-specific vital sign thresholds and gender-based clinical logic.

## [2026-01-27] - 5-Cycle Agenda & Audit (Protocol Jules x5)

### Added
- **Agenda Module**: Complete end-to-end implementation for appointment management.
- **Backend**: New `/api/agenda` endpoints with RBAC (admin, secretary, professional).
- **Testing**: `tests/persona_audit.spec.ts` for role-based regression testing (5 iterations per role).
- **Services**: `services/appointmentService.ts` for frontend-backend communication.

### Changed
- **SecretaryView.tsx**: Connected to backend API with asynchronous loading and real-time state management.
- **ProfessionalView.tsx**: Integrated `clinicalRecordService` and fixed redundant declarations.
- **Security**: Applied `requireRole` middleware to all agenda routes.

### Fixed
- **Bug**: Resolved duplicate `handleSaveDraft` declaration in `ProfessionalView.tsx`.
- **UX**: Added `Loader2` spinners for better feedback during data fetching.

## [2026-01-27] - 10-Cycle Multidisciplinary Optimization (Protocol Jules x10)

### Added
- **Backend Persistence**:
    - `historias_clinicas` and `auditoria` tables in PostgreSQL.
    - `facturas` and `detalles_factura` tables for the new billing module.
- **New Modules**:
    - `backend/src/modulos/facturacion/`: Complete billing and invoicing system.
    - `backend/src/modulos/rips/`: Automated RIPS (US/AC) generation service.
    - `backend/src/modulos/metricas/`: Administrative metrics and stats API.
- **Security & Resilience**:
    - `backend/src/middlewares/auditMiddleware.ts`: Centralized action logging.
    - `backend/src/middlewares/errorHandler.ts`: Global backend error handling.
    - `utils/fetchWrapper.ts`: Resilient fetch utility with retries and timeout for frontend.
    - `helmet` and `express-rate-limit` for backend hardening.
- **Utilities**:
    - `maskIdentification` in `utils/security.ts` for PII protection.

### Changed
- **Clinical Logic**:
    - Enhanced pediatric vital signs logic for newborns and infants in `utils/clinicalLogic.ts`.
    - Integrated `ProfessionalView.tsx` with new age-in-months thresholds.
- **Workflow Integration**:
    - HCE finalization now automatically triggers draft invoice generation.
    - Patient list view now masks identification numbers for privacy.

### Fixed
- **Stability**: Standardized database connection pool and implemented transaction safety in complex services.

---
*Generated by Jules (Orchestrator) during Cycle 64 (Phase 11).*
