// Core calculation functions for Georgia Child Support Calculator
// Based on O.C.G.A. § 19-6-15 guidelines

// Type definitions
export interface Deductions {
  selfEmploymentTax: number;
  preexistingSupport: number;
}

export interface Expenses {
  healthInsurance: number;
  childCare: number;
}

export interface DeviationOptions {
  lowIncome: boolean;
  highIncome: boolean;
  parentingTime: number; // Annual overnights
  otherDeviations: number; // Percentage adjustment
}

export interface CalculationResult {
  parentAName?: string;
  parentBName?: string;
  grossIncomeA: number;
  grossIncomeB: number;
  adjustedIncomeA: number;
  adjustedIncomeB: number;
  combinedIncome: number;
  proRataA: number;
  proRataB: number;
  bcso: number;
  basicSupportA: number;
  basicSupportB: number;
  expensesA: number;
  expensesB: number;
  presumptiveSupportA: number;
  presumptiveSupportB: number;
  finalSupportA: number;
  finalSupportB: number;
  payer: 'A' | 'B' | 'None';
  amount: number;
}

// Import BCSO table functions
import { getBCSOAmount } from '../data/bcsoTable';

/**
 * Adjust gross income by subtracting deductions
 * @param gross - Gross monthly income
 * @param deductions - Deduction amounts
 * @returns Adjusted income
 */
export const adjustIncome = (gross: number, deductions: Deductions): number => {
  if (gross <= 0) return 0;

  const { selfEmploymentTax, preexistingSupport } = deductions;
  const adjusted = gross - selfEmploymentTax - preexistingSupport;

  return Math.max(0, adjusted); // Cannot be negative
};

/**
 * Calculate pro-rata shares based on individual incomes
 * @param incomeA - Parent A's adjusted income
 * @param incomeB - Parent B's adjusted income
 * @returns Object with share percentages
 */
export const calculateProRata = (incomeA: number, incomeB: number) => {
  const total = incomeA + incomeB;

  if (total <= 0) {
    return { shareA: 0, shareB: 0 };
  }

  return {
    shareA: incomeA / total,
    shareB: incomeB / total,
  };
};

/**
 * Lookup BCSO amount from the table
 * @param combinedIncome - Combined adjusted income
 * @param numChildren - Number of children
 * @returns BCSO amount
 */
export const lookupBCSO = (combinedIncome: number, numChildren: number): number => {
  return getBCSOAmount(combinedIncome, numChildren);
};

/**
 * Apply adjustments for health insurance and child care expenses
 * @param base - Base BCSO amount
 * @param expenses - Expense amounts
 * @returns Adjusted amount
 */
export const applyAdjustments = (base: number, expenses: Expenses): number => {
  return base + expenses.healthInsurance + expenses.childCare;
};

/**
 * Apply deviations based on Georgia guidelines
 * @param base - Base presumptive amount
 * @param options - Deviation options
 * @param combinedIncome - Combined adjusted income for context
 * @returns Final amount after deviations
 */
export const applyDeviations = (
  base: number,
  options: DeviationOptions,
  combinedIncome: number
): number => {
  let adjustedAmount = base;

  // Low-income adjustment (2025 guidelines: $1,550-$3,950/month sliding scale)
  if (options.lowIncome && combinedIncome >= 1550 && combinedIncome <= 3950) {
    // Simplified sliding scale - reduce by up to 25% based on income level
    const reductionPercent = Math.max(
      0,
      Math.min(0.25, ((3950 - combinedIncome) / (3950 - 1550)) * 0.25)
    );
    adjustedAmount *= 1 - reductionPercent;
  }

  // High-income deviation (incomes > $40,000)
  if (options.highIncome && combinedIncome > 40000) {
    // Courts may apply additional percentage for high incomes
    adjustedAmount *= 1.1; // Simplified 10% increase for high income
  }

  // Parenting time deviation (discretionary until 2026, mandatory in 2026)
  if (options.parentingTime > 0) {
    // Simplified: reduce by 2% per 30 days of parenting time over 73 days
    const overnights = options.parentingTime;
    if (overnights > 73) {
      const reductionPercent = Math.min(0.5, ((overnights - 73) / 30) * 0.02); // Max 50% reduction
      adjustedAmount *= 1 - reductionPercent;
    }
  }

  // Other deviations
  if (options.otherDeviations !== 0) {
    adjustedAmount *= 1 + options.otherDeviations / 100;
  }

  return Math.max(0, adjustedAmount);
};

/**
 * Main calculation function that orchestrates all steps
 * @param incomeA - Parent A's gross monthly income
 * @param incomeB - Parent B's gross monthly income
 * @param deductionsA - Parent A's deductions
 * @param deductionsB - Parent B's deductions
 * @param numChildren - Number of children
 * @param expenses - Shared expenses
 * @param deviations - Deviation options
 * @returns Complete calculation result
 */
export const calculateChildSupport = (
  incomeA: number,
  incomeB: number,
  deductionsA: Deductions,
  deductionsB: Deductions,
  numChildren: number,
  expenses: Expenses,
  deviations: DeviationOptions,
  parentAName?: string,
  parentBName?: string
): CalculationResult => {
  // Step 1: Adjust incomes
  const adjustedIncomeA = adjustIncome(incomeA, deductionsA);
  const adjustedIncomeB = adjustIncome(incomeB, deductionsB);

  // Step 2: Calculate combined income
  const combinedIncome = adjustedIncomeA + adjustedIncomeB;

  // Step 3: Calculate pro-rata shares
  const { shareA, shareB } = calculateProRata(adjustedIncomeA, adjustedIncomeB);

  // Step 4: Lookup BCSO
  const bcso = lookupBCSO(combinedIncome, numChildren);

  // Step 5: Calculate basic support shares
  const basicSupportA = bcso * shareA;
  const basicSupportB = bcso * shareB;

  // Step 6: Apply expense adjustments
  const totalExpenses = expenses.healthInsurance + expenses.childCare;
  const expensesA = totalExpenses * shareA;
  const expensesB = totalExpenses * shareB;

  // Step 7: Calculate presumptive amounts
  const presumptiveSupportA = basicSupportA + expensesA;
  const presumptiveSupportB = basicSupportB + expensesB;

  // Step 8: Apply deviations
  const finalSupportA = applyDeviations(presumptiveSupportA, deviations, combinedIncome);
  const finalSupportB = applyDeviations(presumptiveSupportB, deviations, combinedIncome);

  // Determine payer and amount
  // finalSupportA is what Parent A owes, finalSupportB is what Parent B owes
  const difference = finalSupportA - finalSupportB;

  let payer: 'A' | 'B' | 'None';
  let amount: number;

  if (Math.abs(difference) < 1) {
    // Within $1 tolerance - no payment needed
    payer = 'None';
    amount = 0;
  } else if (difference > 0) {
    // Parent A owes more than Parent B, so Parent B pays Parent A
    payer = 'B';
    amount = difference;
  } else {
    // Parent B owes more than Parent A, so Parent A pays Parent B
    payer = 'A';
    amount = Math.abs(difference);
  }

  return {
    parentAName,
    parentBName,
    grossIncomeA: incomeA,
    grossIncomeB: incomeB,
    adjustedIncomeA,
    adjustedIncomeB,
    combinedIncome,
    proRataA: shareA,
    proRataB: shareB,
    bcso,
    basicSupportA,
    basicSupportB,
    expensesA,
    expensesB,
    presumptiveSupportA,
    presumptiveSupportB,
    finalSupportA,
    finalSupportB,
    payer,
    amount,
  };
};

/**
 * Format currency for display
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format percentage for display
 * @param value - Decimal percentage value
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};
