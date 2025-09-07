// Georgia Child Support Basic Child Support Obligation (BCSO) Table - 2025
// Based on O.C.G.A. § 19-6-15 guidelines, updated for cost-of-living adjustments
// Monthly amounts for combined adjusted income, rounded to nearest $50

export interface BCSOEntry {
  income: number; // Combined adjusted monthly income (rounded to nearest $50)
  children: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
  };
}

// BCSO Table - 2025 Updated Values
// Source: Georgia Child Support Commission
export const BCSO_TABLE: BCSOEntry[] = [
  // Low income brackets ($800 - $2,000)
  { income: 800, children: { 1: 170, 2: 260, 3: 313, 4: 350, 5: 0, 6: 0 } },
  { income: 850, children: { 1: 180, 2: 275, 3: 332, 4: 371, 5: 0, 6: 0 } },
  { income: 900, children: { 1: 191, 2: 291, 3: 351, 4: 392, 5: 0, 6: 0 } },
  { income: 950, children: { 1: 201, 2: 307, 3: 370, 4: 413, 5: 0, 6: 0 } },
  { income: 1000, children: { 1: 212, 2: 323, 3: 389, 4: 434, 5: 0, 6: 0 } },

  // Mid-range incomes ($2,050 - $10,000)
  { income: 2050, children: { 1: 435, 2: 633, 3: 732, 4: 818, 5: 0, 6: 0 } },
  { income: 2100, children: { 1: 446, 2: 649, 3: 750, 4: 839, 5: 0, 6: 0 } },
  { income: 2150, children: { 1: 457, 2: 665, 3: 768, 4: 860, 5: 0, 6: 0 } },
  { income: 2200, children: { 1: 468, 2: 681, 3: 786, 4: 881, 5: 0, 6: 0 } },
  { income: 2250, children: { 1: 479, 2: 697, 3: 804, 4: 902, 5: 0, 6: 0 } },

  // Higher incomes ($10,050 - $20,000)
  { income: 10050, children: { 1: 1078, 2: 1570, 3: 1813, 4: 2029, 5: 2229, 6: 2421 } },
  { income: 10100, children: { 1: 1083, 2: 1577, 3: 1820, 4: 2036, 5: 2237, 6: 2429 } },
  { income: 10150, children: { 1: 1089, 2: 1584, 3: 1827, 4: 2043, 5: 2244, 6: 2437 } },
  { income: 10200, children: { 1: 1094, 2: 1591, 3: 1834, 4: 2050, 5: 2252, 6: 2445 } },
  { income: 10250, children: { 1: 1099, 2: 1598, 3: 1841, 4: 2057, 5: 2259, 6: 2452 } },

  // High incomes ($20,050 - $40,000)
  { income: 20400, children: { 1: 2079, 2: 3038, 3: 3518, 4: 3930, 5: 4323, 6: 4699 } },
  { income: 20450, children: { 1: 2084, 2: 3045, 3: 3525, 4: 3937, 5: 4331, 6: 4707 } },
  { income: 20500, children: { 1: 2089, 2: 3052, 3: 3532, 4: 3944, 5: 4338, 6: 4715 } },
  { income: 20550, children: { 1: 2094, 2: 3059, 3: 3539, 4: 3951, 5: 4346, 6: 4723 } },
  { income: 20600, children: { 1: 2099, 2: 3066, 3: 3546, 4: 3958, 5: 4353, 6: 4731 } },

  // Maximum income bracket
  { income: 40000, children: { 1: 3378, 2: 5041, 3: 5928, 4: 6627, 5: 7290, 6: 7923 } },
];

// Utility functions for BCSO table operations
export const findBCSOBracket = (income: number): BCSOEntry | null => {
  // Round income to nearest $50 as per guidelines
  const roundedIncome = Math.round(income / 50) * 50;

  // Find exact match first
  const exactMatch = BCSO_TABLE.find((entry) => entry.income === roundedIncome);
  if (exactMatch) return exactMatch;

  // Find the highest bracket that is less than or equal to the income
  const validBrackets = BCSO_TABLE.filter((entry) => entry.income <= roundedIncome);
  if (validBrackets.length === 0) return null;

  return validBrackets[validBrackets.length - 1];
};

export const getBCSOAmount = (income: number, children: number): number => {
  const bracket = findBCSOBracket(income);
  if (!bracket || children < 1 || children > 6) return 0;

  return bracket.children[children as keyof typeof bracket.children] || 0;
};

// Validation helpers
export const isValidIncome = (income: number): boolean => {
  return income >= 800 && income <= 40000;
};

export const isValidChildren = (children: number): boolean => {
  return Number.isInteger(children) && children >= 1 && children <= 6;
};
