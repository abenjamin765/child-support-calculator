// Simple test to verify the calculation fix works
import { calculateChildSupport } from './src/utils/calculations.ts';

console.log('Testing calculation with $5000 + $5000 = $10,000');

const result = calculateChildSupport(
  5000, // Parent A income
  5000, // Parent B income
  { selfEmploymentTax: 0, preexistingSupport: 0 },
  { selfEmploymentTax: 0, preexistingSupport: 0 },
  2, // 2 children
  { healthInsurance: 0, childCare: 0 },
  { lowIncome: false, highIncome: false, parentingTime: 0, otherDeviations: 0 }
);

console.log('Combined Income:', result.combinedIncome);
console.log('Expected: 10000');
console.log('Match:', result.combinedIncome === 10000 ? '✅ YES' : '❌ NO');

console.log('\nBCSO Amount:', result.bcso);
console.log('Parent A Share:', result.proRataA);
console.log('Parent B Share:', result.proRataB);
console.log('Parent A Basic Support:', result.basicSupportA);
console.log('Parent B Basic Support:', result.basicSupportB);
console.log('Payer:', result.payer);
console.log('Amount:', result.amount);
