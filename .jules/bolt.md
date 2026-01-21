# BOLT'S JOURNAL - CRITICAL LEARNINGS ONLY

This journal is for capturing critical, codebase-specific performance learnings.

Format:
`## YYYY-MM-DD - [Title]
**Learning:** [Insight]
**Action:** [How to apply next time]`

## 2024-07-29 - Monolithic useEffect Anti-Pattern in ProfessionalView
**Learning:** A large, monolithic `useEffect` hook in `ProfessionalView.tsx` was recalculating multiple independent values (BMI, TAM, TFG, Framingham Risk) on every change to a large state object (`dynamicData`). This caused significant performance degradation due to unnecessary re-renders on every keystroke.
**Action:** When encountering `useEffect` hooks with broad dependency arrays that trigger multiple, unrelated calculations, refactor them into smaller, focused hooks. Each new hook should have a minimal dependency array, ensuring that computations only run when their specific inputs change. This is a critical pattern for maintaining UI responsiveness in state-heavy components.
