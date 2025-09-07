// Form data types for the child support calculator wizard
export type CustodyArrangement =
  | 'custodial'
  | 'no-visitation'
  | 'minimal'
  | 'standard'
  | 'extended'
  | 'shared'
  | 'custom';

export interface ParentIncome {
  name?: string;
  grossMonthly: number;
  selfEmploymentTax: number;
  preexistingSupport: number;
  custodyArrangement: CustodyArrangement;
  customOvernights?: number; // Only used when custodyArrangement is 'custom'
}

export interface ChildInfo {
  numberOfChildren: number;
}

export interface Expenses {
  healthInsurance: {
    totalCost: number;
    payingParent: 'A' | 'B' | 'shared';
  };
  childCare: {
    totalCost: number;
    payingParent: 'A' | 'B' | 'shared';
  };
}

// ParentingTime interface removed - now handled through custody arrangements

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
