# Georgia Child Support Calculator

A web-based application designed to assist divorcing parents, family law professionals, and self-represented individuals in estimating child support obligations under Georgia's child support guidelines (O.C.G.A. § 19-6-15). The calculator employs Georgia's "income shares" model and provides estimates using the 2025 Basic Child Support Obligation (BCSO) table.

## ⚠️ Important Legal Disclaimer

**This tool provides estimates only and is not legal advice.** Results are not binding and should not be used for court purposes. Consult an attorney or the official Georgia Child Support Calculator for legal matters.

## Features

- **Guided Input Process**: Step-by-step wizard for entering parent incomes, child details, expenses, and deviations
- **Accurate Calculations**: Based on 2025 Georgia guidelines with automatic BCSO table lookup
- **Scenario Comparison**: Save and compare multiple calculation scenarios
- **PDF Export**: Generate reports mimicking official Georgia child support worksheets
- **Accessibility**: Built with U.S. Web Design System (USWDS) for Section 508 compliance
- **Educational Resources**: Tooltips and glossary for legal terms
- **Spanish Translation**: Optional language support

## Tech Stack

- **Frontend**: React.js 19 with TypeScript
- **UI Framework**: U.S. Web Design System (USWDS) 3.13.0
- **Build Tool**: Vite
- **Testing**: Jest with React Testing Library
- **Forms**: React Hook Form
- **PDF Generation**: jsPDF
- **Deployment**: Render

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd child-support-calculator
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run Jest tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # Reusable UI components
├── data/               # Static data (BCSO table)
├── pages/              # Page components
├── types/              # TypeScript declarations
├── utils/              # Utility functions and calculations
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles with USWDS
```

## Calculation Methodology

The calculator follows Georgia's official child support worksheet process:

1. **Income Adjustment**: Subtract self-employment taxes and preexisting support
2. **Combined Income**: Sum both parents' adjusted incomes
3. **BCSO Lookup**: Find base obligation from statutory table
4. **Pro Rata Shares**: Calculate each parent's percentage of combined income
5. **Expense Proration**: Add health insurance and child care costs
6. **Deviations**: Apply low-income, high-income, or parenting time adjustments

## Validation and Testing

The calculator has been validated against official Georgia Child Support Commission worksheets and includes:

- Unit tests for all calculation functions
- Integration tests for end-to-end scenarios
- Edge case handling (zero income, split custody, etc.)
- Accessibility testing with USWDS compliance

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to this project.

## Legal Compliance

This project adheres to:

- **O.C.G.A. § 19-6-15**: Georgia child support guidelines
- **Section 508**: Federal accessibility standards
- **WCAG 2.1 AA**: Web accessibility guidelines
- **USWDS**: U.S. Web Design System standards

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions:

- Review the [Help section](src/pages/Help.tsx) in the application
- Visit the [Georgia Child Support Commission website](https://csc.georgiacourts.gov/)
- Consult with a qualified family law attorney

---

**Built with ❤️ for Georgia families**
