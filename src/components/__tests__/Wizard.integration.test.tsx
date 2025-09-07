// React is imported automatically with JSX
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Wizard from '../Wizard';

// Mock the calculation function
jest.mock('../../utils/calculations', () => ({
  calculateChildSupport: jest.fn(() => ({
    grossIncomeA: 3000,
    grossIncomeB: 2000,
    adjustedIncomeA: 3000,
    adjustedIncomeB: 2000,
    combinedIncome: 5000,
    proRataA: 0.6,
    proRataB: 0.4,
    bcso: 1000,
    basicSupportA: 600,
    basicSupportB: 400,
    expensesA: 300,
    expensesB: 200,
    presumptiveSupportA: 900,
    presumptiveSupportB: 600,
    finalSupportA: 900,
    finalSupportB: 600,
    payer: 'A',
    amount: 300,
  })),
}));

describe('Wizard Integration', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
  });

  it('completes full wizard flow', async () => {
    render(<Wizard onComplete={mockOnComplete} />);

    // Step 1: Parent A Income
    expect(screen.getByText('Parent A Income Information')).toBeInTheDocument();

    // Fill Parent A income
    fireEvent.change(screen.getByLabelText(/Gross Monthly Income/), {
      target: { value: '3000' }
    });

    // Click Next
    fireEvent.click(screen.getByText('Next'));

    // Step 2: Parent B Income
    expect(screen.getByText('Parent B Income Information')).toBeInTheDocument();

    // Fill Parent B income
    fireEvent.change(screen.getByLabelText(/Gross Monthly Income/), {
      target: { value: '2000' }
    });

    // Click Next
    fireEvent.click(screen.getByText('Next'));

    // Step 3: Child Details
    expect(screen.getByText('Child Information')).toBeInTheDocument();

    // Select number of children
    fireEvent.change(screen.getByLabelText(/Number of Children/), {
      target: { value: '2' }
    });

    // Click Next
    fireEvent.click(screen.getByText('Next'));

    // Step 4: Expenses
    expect(screen.getByText('Child-Related Expenses')).toBeInTheDocument();

    // Fill expenses
    fireEvent.change(screen.getByLabelText(/Monthly Health Insurance Premium/), {
      target: { value: '500' }
    });

    // Click Next
    fireEvent.click(screen.getByText('Next'));

    // Step 5: Parenting Time
    expect(screen.getByText('Parenting Time')).toBeInTheDocument();

    // Fill parenting time
    fireEvent.change(screen.getByLabelText(/Annual Overnight Visits/), {
      target: { value: '100' }
    });

    // Click Next
    fireEvent.click(screen.getByText('Next'));

    // Step 6: Deviations
    expect(screen.getByText('Deviations from Presumptive Amount')).toBeInTheDocument();

    // Click Calculate
    fireEvent.click(screen.getByText('Calculate Child Support'));

    // Verify calculation was called
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  it('navigates backward through steps', () => {
    render(<Wizard onComplete={mockOnComplete} />);

    // Start at Step 1
    expect(screen.getByText('Parent A Income Information')).toBeInTheDocument();

    // Go to Step 2
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Parent B Income Information')).toBeInTheDocument();

    // Go back to Step 1
    fireEvent.click(screen.getByText('Previous'));
    expect(screen.getByText('Parent A Income Information')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<Wizard onComplete={mockOnComplete} />);

    // Try to proceed without filling required fields
    fireEvent.click(screen.getByText('Next'));

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/Gross monthly income is required/)).toBeInTheDocument();
    });
  });
});
