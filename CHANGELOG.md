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

## [2026-01-26] - 10-Cycle Intelligence & Security Expansion (Protocol Jules x10)

### Added
- **AI Intelligence**: "Resumen Rápido (AI)" using geminiService to aggregate patient history.
- **Admin Insights**: "Nómina Proyectada" card for real-time labor cost visibility.
- **Micro-UX**: "Quick Look" tooltips for patient cards with vitals and allergies.
- **Quality**: `tests/autonomous_audit.spec.ts` for automated verification of Phase 10 features.

### Changed
- **Security**:
    - Implemented PII masking for identifiers in all list views.
    - Enhanced RDA Viewer with one-click JSON copying and feedback.
- **Clinical**:
    - Added critical SpO2 (<90%) and Hypertensive Crisis alerts.
    - Consolidated draft saving logic to prevent data loss.
- **Admin/Reception**:
    - Professional HTML invoice printing in `SecretaryView.tsx`.

### Fixed
- Resolved duplicate `handleSaveDraft` declarations in `ProfessionalView.tsx`.
- Corrected unit test suite `utils/clinicalLogic.test.ts` to include vital warning validations.

## [2026-03-17] - 10-Cycle Administrative & Clinical Expansion (Protocol Jules x10)

### Added
- **Backend Expansion**: New modules for `Facturación` and `RRHH` with full API support.
- **Security**: `hooks/useSessionTimeout.ts` for automatic 15-minute logout.
- **Clinical Components**:
    - `components/Anexo2Form.tsx`: Standardized referrals with HTML print support.
    - `components/PatientTimeline.tsx`: Chronological clinical history visualization.
- **Services**: `billingService.ts` and `hrService.ts` for frontend-backend data exchange.

### Changed
- **Professional Workspace**: Integrated patient timeline and referral tools into the sidebar.
- **Secretary Workspace**: Real-time billing and payment registration with backend persistence.
- **Admin Dashboard**: Refined RBAC for Talent Management and Financial modules.

### Fixed
- **System Stability**: Standardized backend route protection using `authenticateToken`.
- **UI Performance**: Refactored component loading and state management in `SecretaryView.tsx`.

---
*Generated by Jules during Cycle 128 (Phase 11).*
