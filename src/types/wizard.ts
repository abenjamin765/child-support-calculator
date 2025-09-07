// Form data types for the child support calculator wizard
export interface ParentIncome {
  name?: string;
  grossMonthly: number;
  selfEmploymentTax: number;
  preexistingSupport: number;
}

export interface ChildInfo {
  numberOfChildren: number;
}

export interface Expenses {
  healthInsurance: number;
  childCare: number;
}

export interface ParentingTime {
  annualOvernights: number;
}

export interface Deviations {
  lowIncome: boolean;
  highIncome: boolean;
  otherAdjustment: number; // percentage
}

export interface WizardFormData {
  parentA: ParentIncome;
  parentB: ParentIncome;
  children: ChildInfo;
  expenses: Expenses;
  parentingTime: ParentingTime;
  deviations: Deviations;
}

export interface WizardStep {
  id: number;
  title: string;
  description: string;
  component: string;
  isCompleted: boolean;
  isActive: boolean;
}

// Calculation result types
export interface CalculationBreakdown {
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

export interface WizardState {
  currentStep: number;
  formData: WizardFormData;
  calculationResult: CalculationBreakdown | null;
  isCalculating: boolean;
  errors: Record<string, string>;
}
