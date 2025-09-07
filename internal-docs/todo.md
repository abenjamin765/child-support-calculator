# Child Support Calculator To-Do List for AI Agent (Using USWDS)

This document outlines the development phases for an AI agent to build the Georgia Child Support Calculator, a web-based app to help divorcing parents estimate child support obligations per Georgia’s O.C.G.A. §19-6-15 guidelines (2025 updates). The app uses the "income shares" model, embedding the 2025 Basic Child Support Obligation (BCSO) table and handling adjustments/deviations. It leverages the U.S. Web Design System (USWDS) for accessible, mobile-friendly components instead of Material-UI, ensuring compliance with federal standards like Section 508 and 21st Century IDEA. Phases are designed for sequential AI execution, prioritizing accurate calculations, usability, and maintainability. The tech stack is React.js with TypeScript, USWDS for UI, Jest for testing, Vite for bundling, and client-side logic, with GitHub for version control.

## Phase 1: Project Setup & Calculation Logic (Immediate Execution)

**Goal**: Initialize the project and implement precise calculation logic aligned with 2025 Georgia guidelines.

- **Tasks**:
  - Create a GitHub repository with:
    - `README.md`: Project overview, setup instructions, and USWDS usage notes.
    - `CONTRIBUTING.md`: Guidelines for contributing to the project. (e.g., commit message format: "Add [feature]").
    - `.gitignore`: Ignore `node_modules`, `.env`, build artifacts.
  - Initialize Vite project: `npm create vite@latest` (React, TypeScript template).
  - Install dependencies: `npm install eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser jest @testing-library/react jsdom @uswds/uswds`.
  - Configure ESLint/Prettier for consistent code style; add `.eslintrc.json` and `.prettierrc`.
  - Set up Jest: Add `jest.config.js` for TypeScript and React Testing Library.
  - Import USWDS styles in `/src/index.css`: `@import '@uswds/uswds/css/uswds.css';` and initialize USWDS JavaScript in `/src/index.tsx`: `import { initAll } from '@uswds/uswds'; initAll();`.
  - Create `/src/data/bcsoTable.ts` with 2025 BCSO table as JSON (income brackets $800–$40,000, 1-6 children; source from Georgia Child Support Commission).
  - Implement pure functions in `/src/utils/calculations.ts`:
    - `adjustIncome(gross: number, deductions: Deductions): number`: Subtract self-employment tax (7.65% half), preexisting support.
    - `lookupBCSO(combinedAGI: number, numChildren: number): number`: Linear search in BCSO table.
    - `calculateProRata(incomeA: number, incomeB: number): { shareA: number, shareB: number }`: Compute percentage shares.
    - `applyAdjustments(base: number, expenses: Expenses): number`: Add prorated health insurance/child care.
    - `applyDeviations(base: number, options: DeviationOptions): number`: Handle low-income ($1,550–$3,950/month sliding scale), parenting time (2025 discretionary, 2026 mandatory).
  - Write Jest unit tests in `/tests/calculations.test.ts`:
    - Cover edge cases: zero income, split custody, high-income (>40,000), 6+ children.
    - Validate against official Georgia worksheet examples.
  - Set up GitHub Actions in `.github/workflows/ci.yml` to run tests on push/PR.
  - Generate `/docs/calculations.md` with function descriptions, inputs/outputs, and example calculations.
  - Commit changes with message: "Phase 1: Setup repo with USWDS and core calculations with tests".

- **Deliverables**:
  - Initialized Git repo with CI pipeline and USWDS setup.
  - Tested calculation module matching 2025 guidelines.
  - Documentation for calculations.

- **Execution Notes**: Ensure calculations align with O.C.G.A. §19-6-15. Use TypeScript interfaces for inputs (e.g., `interface Deductions { selfEmploymentTax: number; preexistingSupport: number }`). Validate outputs with official calculator. Confirm USWDS CSS/JavaScript loads correctly.

## Phase 2: UI & Input Workflow (Sequential Post-Phase 1)

**Goal**: Develop a minimal, accessible UI using USWDS components for data entry and result display.

- **Tasks**:
  - Install dependencies: `npm install react-hook-form`.
  - Create folder structure: `/src/components`, `/src/pages`, `/src/styles`.
  - Build input wizard in `/src/components/Wizard` using USWDS components:
    - Components: `<IncomeInput />`, `<ChildDetails />`, `<ExpensesInput />`, `<ParentingTime />`, `<Deviations />`.
    - Use React Hook Form for validation (e.g., positive numbers for incomes, max 6 children).
    - Structure as 5-step form with USWDS `usa-step-indicator` for navigation; use `usa-button` for "Back/Next".
    - Apply USWDS form controls (e.g., `usa-input`, `usa-select`) with classes like `usa-form-group`.
  - Add tooltips using USWDS `usa-tooltip` for terms (e.g., “Pro rata: Share of combined income”).
  - Create results page in `/src/pages/Results.tsx`:
    - Display presumptive amount, payer/payee, monthly breakdown using `usa-table`.
    - Use USWDS `usa-accordion` for step-by-step breakdown (e.g., “Step 3: BCSO = $X for Y children”).
  - Apply USWDS responsive grid (`usa-grid`, `usa-grid-full`) for mobile-friendly layout.
  - Ensure accessibility per Section 508: Use USWDS ARIA attributes, `usa-sr-only` for screen readers, and high-contrast styles.
  - Add disclaimer component in `/src/components/Disclaimer.tsx` with USWDS `usa-alert--warning`: “Estimate only, not legal advice. Consult an attorney or official calculator.” Show on every page.
  - Write Jest snapshot tests for components in `/tests/components`.
  - Write integration tests in `/tests/wizard.test.ts` for input-to-output flow.
  - Install Cypress: `npm install cypress --save-dev`; add E2E tests in `/cypress/e2e` for full wizard flow.
  - Commit changes with message: "Phase 2: Add USWDS-based UI wizard and results with tests".

- **Deliverables**:
  - Functional SPA with USWDS-styled input wizard and results page.
  - Accessible, responsive UI with disclaimers.
  - Unit, integration, and E2E tests.

- **Execution Notes**: Use USWDS design tokens (e.g., `color-blue-60v` for primary buttons) and utilities (e.g., `padding-2`) for styling. Test accessibility with USWDS validator tools. Ensure calculations integrate seamlessly with UI.

## Phase 3: Advanced Features & Enhancements (Post-Phase 2)

**Goal**: Add scenario simulation, PDF exports, and educational resources using USWDS.

- **Tasks**:
  - Install dependencies: `npm install jspdf react-i18next recharts`.
  - Implement scenario simulator in `/src/components/ScenarioSimulator.tsx`:
    - Use `useState` and localStorage to store multiple input sets.
    - Create comparison table with USWDS `usa-table`; use Recharts for visuals (e.g., bar chart of base vs. deviated amounts).
  - Add PDF export in `/src/utils/exportPDF.ts` using jsPDF:
    - Mimic Georgia Schedules A-E with USWDS typography classes (e.g., `usa-font-lead`).
    - Add button in `/src/pages/Results.tsx` using `usa-button`.
  - Create help page in `/src/pages/Help.tsx`:
    - FAQ section with USWDS `usa-accordion`.
    - Glossary for terms using `usa-list`.
    - Links to O.C.G.A. §19-6-15, Georgia Child Support Commission calculator, DHS resources with `usa-link`.
  - Add alert banner in `/src/components/AlertBanner.tsx` using USWDS `usa-alert--info` for 2026 parenting time changes.
  - Configure react-i18next for Spanish translations; add toggle with USWDS `usa-button--secondary`.
  - Write tests:
    - Jest for scenario logic and PDF output.
    - Cypress for scenario comparison and help page navigation.
  - Optimize performance: Memoize calculations with `useMemo`, lazy-load components with `React.lazy`.
  - Run Lighthouse audits (via npm script) for accessibility/performance; fix issues using USWDS guidelines.
  - Update `/docs` with USWDS component usage and feature guides.
  - Commit changes with message: "Phase 3: Add USWDS scenarios, PDF export, help page, and translations".

- **Deliverables**:
  - Scenario simulator, PDF export, and help page with USWDS styling.
  - Spanish translation support.
  - Optimized, accessible app with comprehensive tests.

- **Execution Notes**: Ensure PDF output uses USWDS typography and spacing tokens. Validate translations for legal accuracy. Cache BCSO lookups for performance.

## Phase 4: Deployment & Maintenance Prep (Post-Phase 3)

**Goal**: Deploy the app and set up structures for AI-driven updates.

- **Tasks**:
  - Configure deployment on Render: Add `render.yaml` for configuration; deploy via Render dashboard.
  - Install Sentry: `npm install @sentry/react`; initialize in `/src/index.tsx` for error tracking.
  - Create `/src/data/config.ts` for BCSO table updates and feature toggles (e.g., 2026 parenting time).
  - Update `CONTRIBUTING.md` with AI-specific instructions for USWDS updates (e.g., “Use USWDS tokens for styling”).
  - Add Husky: `npm install husky --save-dev`; configure pre-commit hooks for tests/linters.
  - Create GitHub issue templates for bugs/features in `.github/ISSUE_TEMPLATE`.
  - Simulate user flows with Cypress to validate production behavior with USWDS components.
  - Commit changes with message: "Phase 4: Deploy app with USWDS and configure maintenance setup".

- **Deliverables**:
  - Live app on Render with USWDS styling.
  - AI-ready repo with update mechanisms.
  - Production-validated tests.

- **Execution Notes**: Verify USWDS components render correctly in production. Monitor Sentry for errors post-launch.

## Phase 5: Ongoing Updates (Continuous)

**Goal**: Maintain accuracy and implement future enhancements (e.g., 2026 parenting time rules).

- **Tasks**:
  - Monitor Georgia Child Support Commission for law changes; update `/src/data/bcsoTable.ts`.
  - Implement 2026 mandatory parenting time formula in `/src/utils/calculations.ts` by January 1, 2026.
  - Add optional cost estimator in `/src/components/CostEstimator.tsx` using USWDS `usa-form`.
  - Write tests for new features; update CI pipeline.
  - Periodically run Lighthouse audits; fix accessibility issues per USWDS guidelines.
  - Process feedback from in-app form (add to `/src/components/Feedback.tsx` with USWDS `usa-form`).
  - Tag releases (e.g., v1.1.0 for fixes, v2.0.0 for 2026 changes).
  - Commit changes with messages like: "Update BCSO table for [year]" or "Add 2026 parenting time formula".

- **Deliverables**:
  - Updated app reflecting law changes.
  - New features per user feedback.
  - Maintained repo with release tags.

- **Execution Notes**: Schedule BCSO updates annually. Ensure new features use USWDS components and tokens. Test updates against official guidelines.

## Notes

- **AI Execution**: Execute phases sequentially; validate deliverables before proceeding. Use USWDS design tokens (e.g., `font-sans`, `color-blue-warm-60`) and utilities for consistency. Ensure Section 508 compliance.
- **Testing Priority**: Achieve >90% test coverage for calculations. Use official worksheet examples for test cases (e.g., combined income $5,000, 2 children).
- **Maintainability**: Structure code for easy updates (e.g., config-driven BCSO). Log commits clearly for auditability.
- **Assumptions**: AI has access to npm, Git, Render dashboard, and official Georgia resources. USWDS ensures accessibility and federal compliance.
- **Next Steps**: Begin Phase 1 by creating repo, setting up USWDS, and implementing calculations. Validate outputs against official calculator before UI development.
