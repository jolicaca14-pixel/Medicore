# BOLT'S JOURNAL - CRITICAL LEARNINGS ONLY

This journal is for CRITICAL learnings that will help Bolt avoid mistakes or make better decisions in this specific codebase.

**Format:**
`## YYYY-MM-DD - [Title]`
`**Learning:** [Insight]`
`**Action:** [How to apply next time]`

## 2024-07-25 - Monolithic useEffects are Performance Killers
**Learning:** I discovered a significant performance anti-pattern in `ProfessionalView.tsx`. A single, large `useEffect` hook was being used to run multiple, independent calculations (BMI, TFG, etc.) triggered by any change in a large state object (`dynamicData`). This caused all calculations to re-run on every single keystroke in the form, even if the relevant data for a specific calculation hadn't changed.
**Action:** The correct pattern is to refactor such monolithic hooks into multiple, focused `useMemo` hooks. Each `useMemo` should handle one expensive calculation and have a minimal dependency array containing only the direct inputs for that calculation. A separate, clean `useEffect` can then watch the results of these memoized values and update the component's state. This prevents unnecessary re-computations and dramatically improves UI responsiveness. I will actively hunt for this anti-pattern in other state-heavy components.
