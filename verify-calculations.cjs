// Simple verification of calculation logic
const { calculateChildSupport, getBCSOAmount } = require('./dist/utils/calculations.js');

// Test BCSO lookup
console.log('=== BCSO Table Verification ===');
console.log('Income $5,000, 2 children:', getBCSOAmount(5000, 2));
console.log('Income $5,000, 1 child:', getBCSOAmount(5000, 1));
console.log('Income $5,000, 3 children:', getBCSOAmount(5000, 3));

// Test full calculation
console.log('\n=== Full Calculation Test ===');
console.log('Scenario: Parent A ($3,000), Parent B ($2,000), 2 children');

const result = calculateChildSupport(
  3000, // Parent A income
  2000, // Parent B income
  { selfEmploymentTax: 0, preexistingSupport: 0 },
  { selfEmploymentTax: 0, preexistingSupport: 0 },
  2, // 2 children
  { healthInsurance: 0, childCare: 0 },
  { lowIncome: false, highIncome: false, parentingTime: 0, otherDeviations: 0 }
);

console.log('Combined Income:', result.combinedIncome);
console.log('Parent A Share:', result.proRataA.toFixed(3));
console.log('Parent B Share:', result.proRataB.toFixed(3));
console.log('BCSO Amount:', result.bcso);
console.log('Parent A Basic Support:', result.basicSupportA.toFixed(2));
console.log('Parent B Basic Support:', result.basicSupportB.toFixed(2));
console.log('Parent A Final Support:', result.finalSupportA.toFixed(2));
console.log('Parent B Final Support:', result.finalSupportB.toFixed(2));
console.log('Payer:', result.payer);
console.log('Amount:', result.amount.toFixed(2));

console.log('\n=== Verification ===');
console.log('Parent A owes:', result.finalSupportA.toFixed(2));
console.log('Parent B owes:', result.finalSupportB.toFixed(2));
console.log('Difference (A - B):', (result.finalSupportA - result.finalSupportB).toFixed(2));
if (result.payer === 'B') {
  console.log('✅ CORRECT: Parent B pays Parent A $' + result.amount.toFixed(2));
} else if (result.payer === 'A') {
  console.log('✅ CORRECT: Parent A pays Parent B $' + result.amount.toFixed(2));
} else {
  console.log('✅ CORRECT: No payment needed');
}
