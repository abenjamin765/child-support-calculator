import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SinglePageCalculator from '../SinglePageCalculator';

// Mock the calculation function
jest.mock('../../utils/calculations', () => ({
  calculateChildSupport: jest.fn(() => ({
    grossIncomeA: 5000,
    grossIncomeB: 3000,
    adjustedIncomeA: 5000,
    adjustedIncomeB: 3000,
    combinedIncome: 8000,
    proRataA: 0.625,
    proRataB: 0.375,
    bcso: 1200,
    basicSupportA: 750,
    basicSupportB: 450,
    expensesA: 250,
    expensesB: 150,
    presumptiveSupportA: 1000,
    presumptiveSupportB: 600,
    finalSupportA: 1000,
    finalSupportB: 600,
    payer: 'A',
    amount: 400,
  })),
  formatCurrency: jest.fn((amount) => `$${amount}`),
  formatPercentage: jest.fn((value) => `${(value * 100).toFixed(1)}%`),
}));

describe('SinglePageCalculator', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
  });

  it('renders all form sections', () => {
    render(<SinglePageCalculator onComplete={mockOnComplete} />);

    expect(screen.getByText('Parent Information')).toBeInTheDocument();
    expect(screen.getByText('Child Information')).toBeInTheDocument();
    expect(screen.getByText('Child-Related Expenses')).toBeInTheDocument();
    expect(screen.getByText('Additional Factors')).toBeInTheDocument();
    expect(screen.getByText('Calculate Child Support')).toBeInTheDocument();
  });

  it('renders parent information inputs', () => {
    render(<SinglePageCalculator onComplete={mockOnComplete} />);

    expect(screen.getByText('Parent A')).toBeInTheDocument();
    expect(screen.getByText('Parent B')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Gross Monthly Income/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Self-Employment Tax Deduction/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Preexisting Child Support/)).toHaveLength(2);
  });

  it('renders child information inputs', () => {
    render(<SinglePageCalculator onComplete={mockOnComplete} />);

    expect(screen.getByLabelText(/Number of Children/)).toBeInTheDocument();
  });

  it('renders expense inputs', () => {
    render(<SinglePageCalculator onComplete={mockOnComplete} />);

    expect(screen.getByLabelText(/Monthly Health Insurance Premium/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly Child Care Costs/)).toBeInTheDocument();
  });

  it('renders additional factors', () => {
    render(<SinglePageCalculator onComplete={mockOnComplete} />);

    expect(screen.getByLabelText(/Annual Overnight Visits/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Other Adjustments/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apply low-income adjustment/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apply high-income adjustment/)).toBeInTheDocument();
  });

  it('submits form and calls onComplete', async () => {
    render(<SinglePageCalculator onComplete={mockOnComplete} />);

    // Fill in required fields
    const grossIncomeInputs = screen.getAllByLabelText(/Gross Monthly Income/);
    fireEvent.change(grossIncomeInputs[0], { target: { value: '5000' } });
    fireEvent.change(grossIncomeInputs[1], { target: { value: '3000' } });

    fireEvent.change(screen.getByLabelText(/Number of Children/), { target: { value: '2' } });

    // Submit form
    fireEvent.click(screen.getByText('Calculate Child Support'));

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  it('renders disclaimer', () => {
    render(<SinglePageCalculator onComplete={mockOnComplete} />);

    expect(screen.getByText('Important Disclaimer')).toBeInTheDocument();
    expect(screen.getByText(/This tool provides estimates only/)).toBeInTheDocument();
  });
});
