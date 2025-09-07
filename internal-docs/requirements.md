# Georgia Child Support Calculator Requirements Document

## 1. Project Overview

### 1.1 Purpose

The Georgia Child Support Calculator is a web-based application designed to assist divorcing parents, family law professionals, and self-represented individuals in estimating child support obligations under Georgia's child support guidelines (O.C.G.A. § 19-6-15). It employs the state's "income shares" model, which calculates support based on both parents' combined incomes and the presumed amount needed to raise the child(ren) as if the family were intact. The app provides a presumptive child support amount using the Basic Child Support Obligation (BCSO) table, adjustments for expenses, and potential deviations.

The tool emphasizes education, transparency, and usability while clearly stating that results are estimates only and not legal advice. Users are directed to consult attorneys or the official Georgia Child Support Calculator for binding determinations.

### 1.2 Scope

- **In Scope**:
  - Guided input forms for parent incomes, child details, expenses, and deviations.
  - Automated calculations with step-by-step explanations.
  - Scenario simulations, PDF reports, and educational resources.
  - Support for 2025 guidelines, with alerts for 2026 parenting time changes.
  - Responsive design for mobile and desktop.
  - Privacy-focused: Client-side processing, no data storage.
- **Out of Scope**:
  - Integration with state enforcement systems or payment processing.
  - Multi-state support.
  - User authentication or account management.
  - Advanced analytics or AI-driven predictions.

### 1.3 Target Audience

- Divorcing or separated parents in Georgia.
- Family law attorneys, mediators, and financial advisors.
- Self-represented litigants seeking preliminary estimates.

### 1.4 Assumptions and Constraints

- Built as a Single Page Application (SPA) using React.js with TypeScript.
- Calculations based on 2025 BCSO table and guidelines; must be updatable for future changes.
- No backend initially; all logic client-side.
- Compliance with accessibility standards (WCAG 2.1 Level AA).
- Development assumes access to official Georgia resources for validation.

### 1.5 Success Criteria

- Accurate calculations matching official worksheets (validated via testing).
- User-friendly interface with positive feedback from beta testers.
- Easy maintenance for law updates (e.g., BCSO table revisions).
- Open-source codebase with contributions enabled.

## 2. Functional Requirements

### 2.1 Core Calculation Engine

- Embed 2025 BCSO table (income $800–$40,000/month, 1-6 children) as JSON.
- Implement step-by-step logic:
  1. Gross income input and adjustments (deductions for self-employment taxes, preexisting support).
  2. Combined adjusted income calculation.
  3. BCSO lookup.
  4. Pro rata share determination.
  5. Addition of prorated expenses (health insurance, child care).
  6. Application of deviations (low-income sliding scale, parenting time, high-income).
  7. Credits for benefits (e.g., Social Security).
- Handle special cases: Split parenting, imputed income, multiple families.
- Provide detailed breakdowns with formulas and intermediate values.

### 2.2 Input Collection

- Multi-step wizard for data entry:
  - Parent details: Gross monthly incomes, deductions.
  - Child details: Number (1-6+), ages.
  - Expenses: Health premiums (child portion), child care (averaged monthly).
  - Parenting time: Annual overnights per parent.
  - Deviations: Toggle options with justifications.
- Real-time validation (e.g., non-negative numbers, tooltips for terms).

### 2.3 Output and Reporting

- Display presumptive and final amounts, payer/payee, breakdowns.
- Generate PDF reports mimicking official Schedules A-E.
- Scenario simulator: Save/compare multiple inputs (e.g., "what-if" income changes).

### 2.4 Educational and Compliance Features

- Tooltips and glossary for legal terms (e.g., "imputed income").
- Links to official resources (e.g., Georgia Child Support Commission calculator, O.C.G.A. § 19-6-15).
- Prominent disclaimers: "Estimate only; consult professional."
- Alert for 2026 mandatory parenting time formula.
- Optional Spanish translation.

### 2.5 Additional Functionality

- FAQ/Help section.
- Feedback form for improvements.
- Update mechanism for BCSO table and rules.

## 3. Non-Functional Requirements

### 3.1 Performance

- Load time < 2 seconds on standard connections.
- Calculations instant (< 100ms).
- Support 100+ concurrent users (if hosted).

### 3.2 Usability

- Intuitive wizard interface with progress indicators.
- Mobile-responsive (breakpoints for phones/tablets).
- Keyboard-navigable and screen-reader compatible.

### 3.3 Security and Privacy

- No server-side data storage; all processing client-side.
- HTTPS deployment.
- Comply with GDPR/CCPA principles (anonymized usage).

### 3.4 Reliability

- 99% uptime if hosted.
- Error handling for invalid inputs.
- Graceful degradation (e.g., offline calculations).

### 3.5 Maintainability

- Modular code with clear documentation.
- Unit/integration/E2E tests (>90% coverage).
- GitHub repo with CI/CD for contributions.

### 3.6 Scalability

- Easy to add features (e.g., backend for API).
- Configurable for future law changes.

## 4. User Stories

As a [role], I want [feature] so that [benefit].

1. As a divorcing parent, I want to input incomes so that I can get a base calculation.
2. As a divorcing parent, I want to specify children details so that the correct BCSO applies.
3. As a divorcing parent, I want to enter expenses so that they are prorated.
4. As a divorcing parent, I want parenting time simulations so that I see deviation impacts.
5. As a divorcing parent, I want step-by-step explanations so that I understand the result.
6. As a divorcing parent, I want to compare scenarios so that I plan negotiations.
7. As a divorcing parent, I want PDF reports so that I can share with attorneys.
8. As a self-represented individual, I want tooltips so that I learn terms.
9. As an attorney, I want quick inputs and deviations so that I advise clients.
10. As any user, I want disclaimers so that I'm aware of limitations.
11. As a mobile user, I want responsive design so that I use on phone.
12. As a non-English speaker, I want Spanish options so that it's accessible.

## 5. UI/UX Design Requirements

### 5.1 Overall Design

- Neutral color scheme (blues/grays for trust).
- Sans-serif fonts (e.g., Roboto) for readability.
- Clean, empathetic layout avoiding legal jargon overload.

### 5.2 Key Screens

- **Landing Page**: Welcome, disclaimer, "Start" button, quick links.
- **Wizard Screens**: Stepped forms with labels, tooltips, validation.
- **Results Screen**: Summary card, accordion breakdown, edit/export buttons.
- **Scenario Comparison**: Table/chart view.
- **Help Page**: Searchable FAQ, glossary, links.

### 5.3 User Flows

1. Accept disclaimer → Enter data in wizard → View results → Edit/simulate → Export.
2. Browse help → Search terms → Link to external resources.

### 5.4 Accessibility

- High contrast ratios.
- Alt text for images/icons.
- ARIA attributes for dynamic elements.

## 6. Technical Requirements

### 6.1 Tech Stack

- Frontend: React.js, TypeScript, USWDS (U.S. Web Design System).
- Forms: React Hook Form.
- PDF: jsPDF.
- Testing: Jest, React Testing Library, Cypress.
- Build: Vite.
- Deployment: Render.

### 6.2 Data Handling

- BCSO table as static JSON.
- LocalStorage for temporary scenarios.

### 6.3 Testing

- Unit tests for calculations.
- Integration tests for flows.
- E2E tests for user journeys.
- Manual validation against official calculator.

## 7. Appendix

### 7.1 References

- O.C.G.A. § 19-6-15.
- Georgia Child Support Commission guidelines and calculator.
- WCAG 2.1 standards.

### 7.2 Version History

- v1.0: Initial draft (September 2025).

This document serves as a blueprint for development. It should be reviewed and updated as needed.
