// Debug script to test calculations
const { calculateChildSupport, getBCSOAmount } = require('./dist/utils/calculations.js');

// Test the BCSO lookup first
console.log('Testing BCSO lookup for income 5000, 2 children:');
console.log('BCSO Amount:', getBCSOAmount(5000, 2));

// Test full calculation
console.log('\nTesting full calculation (Parent A: $3000, Parent B: $2000, 2 children):');
const result = calculateChildSupport(
  3000, // Parent A income
  2000, // Parent B income
  { selfEmploymentTax: 0, preexistingSupport: 0 },
  { selfEmploymentTax: 0, preexistingSupport: 0 },
  2, // 2 children
  { healthInsurance: 0, childCare: 0 },
  { lowIncome: false, highIncome: false, parentingTime: 0, otherDeviations: 0 }
);

console.log('Result:', JSON.stringify(result, null, 2));
