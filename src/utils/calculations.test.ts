import {
  adjustIncome,
  calculateProRata,
  lookupBCSO,
  applyAdjustments,
  applyDeviations,
  calculateChildSupport,
  formatCurrency,
  formatPercentage,
  type Deductions,
  type Expenses,
  type DeviationOptions,
} from './calculations';

describe('Child Support Calculations', () => {
  describe('adjustIncome', () => {
    it('should adjust income by subtracting deductions', () => {
      const deductions: Deductions = {
        selfEmploymentTax: 100,
        preexistingSupport: 200,
      };

      expect(adjustIncome(1000, deductions)).toBe(700);
    });

    it('should not return negative income', () => {
      const deductions: Deductions = {
        selfEmploymentTax: 600,
        preexistingSupport: 500,
      };

      expect(adjustIncome(1000, deductions)).toBe(0);
    });

    it('should handle zero gross income', () => {
      const deductions: Deductions = {
        selfEmploymentTax: 0,
        preexistingSupport: 0,
      };

      expect(adjustIncome(0, deductions)).toBe(0);
    });
  });

  describe('calculateProRata', () => {
    it('should calculate correct percentage shares', () => {
      const result = calculateProRata(3000, 2000);
      expect(result.shareA).toBe(0.6);
      expect(result.shareB).toBe(0.4);
    });

    it('should handle equal incomes', () => {
      const result = calculateProRata(2500, 2500);
      expect(result.shareA).toBe(0.5);
      expect(result.shareB).toBe(0.5);
    });

    it('should handle zero total income', () => {
      const result = calculateProRata(0, 0);
      expect(result.shareA).toBe(0);
      expect(result.shareB).toBe(0);
    });

    it('should handle one parent with zero income', () => {
      const result = calculateProRata(5000, 0);
      expect(result.shareA).toBe(1);
      expect(result.shareB).toBe(0);
    });
  });

  describe('lookupBCSO', () => {
    it('should return correct BCSO for valid inputs', () => {
      // Test with known values from BCSO table
      expect(lookupBCSO(2050, 2)).toBeGreaterThan(0);
      expect(lookupBCSO(40000, 3)).toBeGreaterThan(0);
    });

    it('should return 0 for invalid number of children', () => {
      expect(lookupBCSO(3000, 0)).toBe(0);
      expect(lookupBCSO(3000, 7)).toBe(0);
    });

    it('should handle income outside table range', () => {
      expect(lookupBCSO(500, 2)).toBe(0); // Below minimum
      expect(lookupBCSO(50000, 2)).toBeGreaterThan(0); // Above maximum, should use highest bracket
    });
  });

  describe('applyAdjustments', () => {
    it('should add expenses to base amount', () => {
      const expenses: Expenses = {
        healthInsurance: 200,
        childCare: 300,
      };

      expect(applyAdjustments(1000, expenses)).toBe(1500);
    });

    it('should handle zero expenses', () => {
      const expenses: Expenses = {
        healthInsurance: 0,
        childCare: 0,
      };

      expect(applyAdjustments(1000, expenses)).toBe(1000);
    });
  });

  describe('applyDeviations', () => {
    const baseAmount = 1000;

    it('should apply low-income adjustment', () => {
      const options: DeviationOptions = {
        lowIncome: true,
        highIncome: false,
        parentingTime: 0,
        otherDeviations: 0,
      };

      const result = applyDeviations(baseAmount, options, 2000);
      expect(result).toBeLessThan(baseAmount);
    });

    it('should apply high-income adjustment', () => {
      const options: DeviationOptions = {
        lowIncome: false,
        highIncome: true,
        parentingTime: 0,
        otherDeviations: 0,
      };

      const result = applyDeviations(baseAmount, options, 45000);
      expect(result).toBeGreaterThan(baseAmount);
    });

    it('should apply parenting time adjustment', () => {
      const options: DeviationOptions = {
        lowIncome: false,
        highIncome: false,
        parentingTime: 100, // More than 73 days
        otherDeviations: 0,
      };

      const result = applyDeviations(baseAmount, options, 3000);
      expect(result).toBeLessThan(baseAmount);
    });

    it('should apply other deviations', () => {
      const options: DeviationOptions = {
        lowIncome: false,
        highIncome: false,
        parentingTime: 0,
        otherDeviations: 10, // 10% increase
      };

      const result = applyDeviations(baseAmount, options, 3000);
      expect(result).toBe(1100);
    });

    it('should handle no deviations', () => {
      const options: DeviationOptions = {
        lowIncome: false,
        highIncome: false,
        parentingTime: 0,
        otherDeviations: 0,
      };

      expect(applyDeviations(baseAmount, options, 3000)).toBe(baseAmount);
    });
  });

  describe('calculateChildSupport - Integration Tests', () => {
    const defaultDeductions: Deductions = {
      selfEmploymentTax: 0,
      preexistingSupport: 0,
    };

    const defaultExpenses: Expenses = {
      healthInsurance: 0,
      childCare: 0,
    };

    const defaultDeviations: DeviationOptions = {
      lowIncome: false,
      highIncome: false,
      parentingTime: 0,
      otherDeviations: 0,
    };

    it('should calculate basic child support scenario', () => {
      const result = calculateChildSupport(
        3000, // Parent A income
        2000, // Parent B income
        defaultDeductions,
        defaultDeductions,
        2, // 2 children
        defaultExpenses,
        defaultDeviations
      );

      expect(result.combinedIncome).toBe(5000);
      expect(result.proRataA).toBe(0.6);
      expect(result.proRataB).toBe(0.4);
      expect(result.bcso).toBeGreaterThan(0);
      expect(result.amount).toBeGreaterThan(0);
    });

    it('should handle equal incomes', () => {
      const result = calculateChildSupport(
        2500,
        2500,
        defaultDeductions,
        defaultDeductions,
        1,
        defaultExpenses,
        defaultDeviations
      );

      expect(result.proRataA).toBe(0.5);
      expect(result.proRataB).toBe(0.5);
      expect(result.amount).toBe(0); // Should be equal, no payment needed
    });

    it('should handle expenses correctly', () => {
      const expenses: Expenses = {
        healthInsurance: 200,
        childCare: 300,
      };

      const result = calculateChildSupport(
        4000,
        2000,
        defaultDeductions,
        defaultDeductions,
        2,
        expenses,
        defaultDeviations
      );

      expect(result.expensesA).toBeCloseTo(333.33, 1); // 2/3 of total expenses based on income share (within $0.1 tolerance)
      expect(result.expensesB).toBeCloseTo(166.67, 1); // 1/3 of total expenses based on income share (within $0.1 tolerance)
    });

    it('should handle zero income edge case', () => {
      const result = calculateChildSupport(
        0,
        5000,
        defaultDeductions,
        defaultDeductions,
        1,
        defaultExpenses,
        defaultDeviations
      );

      expect(result.proRataA).toBe(0);
      expect(result.proRataB).toBe(1);
      expect(result.payer).toBe('A'); // Parent A (with zero income) would pay
      expect(result.amount).toBeGreaterThan(0);
    });

    it('should handle high-income deviation', () => {
      const highIncomeDeviations: DeviationOptions = {
        lowIncome: false,
        highIncome: true,
        parentingTime: 0,
        otherDeviations: 0,
      };

      const result = calculateChildSupport(
        25000,
        20000,
        defaultDeductions,
        defaultDeductions,
        2,
        defaultExpenses,
        highIncomeDeviations
      );

      expect(result.combinedIncome).toBe(45000);
      expect(result.finalSupportA).toBeGreaterThan(result.presumptiveSupportA);
      expect(result.finalSupportB).toBeGreaterThan(result.presumptiveSupportB);
    });

    it('should validate against official worksheet example', () => {
      // Example: Combined income $5,000, 2 children, equal split
      const result = calculateChildSupport(
        2500,
        2500,
        defaultDeductions,
        defaultDeductions,
        2,
        defaultExpenses,
        defaultDeviations
      );

      expect(result.bcso).toBeGreaterThan(0);
      expect(result.payer).toBe('None');
      expect(result.amount).toBe(0);
    });
  });

  describe('Formatting Functions', () => {
    describe('formatCurrency', () => {
      it('should format amounts correctly', () => {
        expect(formatCurrency(1234)).toBe('$1,234');
        expect(formatCurrency(0)).toBe('$0');
        expect(formatCurrency(1234.56)).toBe('$1,235'); // Rounds to nearest dollar
      });
    });

    describe('formatPercentage', () => {
      it('should format percentages correctly', () => {
        expect(formatPercentage(0.6)).toBe('60.0%');
        expect(formatPercentage(0.333)).toBe('33.3%');
        expect(formatPercentage(0)).toBe('0.0%');
      });
    });
  });
});
