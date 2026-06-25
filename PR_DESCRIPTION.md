## Summary

Adds an interactive LP yield calculator to the landing page right panel, replacing the previous SME-focused "Finance Your Invoice" quick-action panel.

## Changes

- **New component** `apps/web/components/shared/LpYieldCalculator.tsx`
  - "I'm an LP" tab header
  - Deposit amount input via existing `AmountInput` component (USDC, default $10K)
  - Pool utilization slider (default 75%, range 10-100%)
  - Instant-updating outputs: estimated annual yield %, monthly earnings in USDC
  - Plain CSS comparison bar chart: TrusTrove vs Savings Account (5%) vs T-Bills (4.5%)
  - Disclaimer always visible: *"Yield depends on pool utilization and invoice repayment rate. Smart contract risk exists."*
- **Updated** `apps/web/app/page.tsx` — right panel now renders `<LpYieldCalculator />`; unused imports removed

## Acceptance Criteria

- [x] All calculations update without page interaction
- [x] Bar chart built with plain CSS bars — no chart library
- [x] Disclaimer always visible
- [x] Works on mobile viewport

## Tech

Next.js 14 · TypeScript · Tailwind CSS · React state
