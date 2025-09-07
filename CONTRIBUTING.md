# Contributing to Georgia Child Support Calculator

Thank you for your interest in contributing to the Georgia Child Support Calculator! This document provides guidelines and best practices for contributors.

## Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. Please be respectful and constructive in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/child-support-calculator.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Run tests: `npm test`
7. Run linting: `npm run lint`
8. Commit your changes: `git commit -m "Add [feature]: Brief description"`
9. Push to your fork: `git push origin feature/your-feature-name`
10. Create a Pull Request

## Development Guidelines

### Commit Message Format

Use the following format for commit messages:

```
Type: Brief description of the change

- Detailed explanation if needed
- Additional context
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style/formatting changes
- `refactor`: Code refactoring
- `test`: Test additions/modifications
- `chore`: Maintenance tasks

Examples:

- `feat: Add parenting time deviation calculation`
- `fix: Correct BCSO table lookup for edge cases`
- `docs: Update calculation methodology documentation`

### Code Style

This project uses:

- **ESLint** for JavaScript/TypeScript linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Run these commands before committing:

```bash
npm run lint:fix
npm run format
npm run type-check
```

### Testing

- Write tests for all new features and bug fixes
- Aim for >90% test coverage
- Include edge cases and error scenarios
- Test accessibility features
- Validate calculations against official Georgia worksheets

### USWDS Integration

When adding UI components:

- Use USWDS design tokens and utilities
- Follow USWDS accessibility guidelines
- Ensure Section 508 compliance
- Test with screen readers and keyboard navigation
- Maintain consistent spacing and typography

## Legal and Compliance Considerations

### Calculation Accuracy

- All calculations must match Georgia O.C.G.A. § 19-6-15 guidelines
- Validate against official Georgia Child Support Calculator
- Include appropriate disclaimers and warnings
- Document calculation methodology clearly

### Accessibility

- Meet WCAG 2.1 AA standards
- Follow Section 508 guidelines
- Provide alternative text for images
- Ensure keyboard navigation
- Test with assistive technologies

### Privacy and Security

- No data storage or transmission
- Client-side processing only
- Clear privacy statements
- Comply with legal requirements

## Pull Request Process

1. **Create a Draft PR** for work in progress
2. **Update Documentation** for any new features
3. **Add Tests** for new functionality
4. **Update CHANGELOG** for user-facing changes
5. **Request Review** when ready

### PR Requirements

Before merging, PRs must:

- ✅ Pass all CI checks (tests, linting, build)
- ✅ Have descriptive commit messages
- ✅ Include appropriate tests
- ✅ Update documentation if needed
- ✅ Follow code style guidelines
- ✅ Have at least one approved review

## Issue Reporting

When reporting bugs or requesting features:

- Use the provided issue templates
- Include steps to reproduce (for bugs)
- Specify browser/OS information
- Provide example calculations (for calculation issues)
- Include screenshots for UI issues

## Areas for Contribution

### High Priority

- UI/UX improvements with USWDS
- Additional calculation scenarios
- Enhanced accessibility features
- Performance optimizations
- Multi-language support

### Medium Priority

- PDF report enhancements
- Scenario comparison features
- Educational content
- Integration with legal resources

### Future Enhancements

- Backend API for advanced features
- Mobile app development
- Integration with court systems
- Advanced analytics

## Legal Review

All contributions affecting:

- Calculation logic
- Legal disclaimers
- User-facing text
- Documentation

Should be reviewed by someone familiar with Georgia family law.

## Questions?

If you have questions about contributing:

1. Check existing issues and documentation
2. Create a discussion in the repository
3. Contact the maintainers

Thank you for contributing to making child support calculations more accessible and transparent for Georgia families!
