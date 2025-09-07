import {
  getBCSOAmount,
  getBCSOAmountWithFallback,
  findBCSOBracket,
  isValidIncome
} from '../bcsoTable';

describe('BCSO Table', () => {
  describe('Normal income ranges', () => {
    it('returns correct BCSO for valid income and children', () => {
      const result = getBCSOAmount(800, 1);
      expect(result).toBe(170);
    });

    it('returns correct BCSO for higher income', () => {
      const result = getBCSOAmount(2050, 2);
      expect(result).toBe(633);
    });

    it('returns 0 for invalid children count', () => {
      const result = getBCSOAmount(2000, 7);
      expect(result).toBe(0);
    });
  });

  describe('Very low incomes (below $800)', () => {
    it('uses minimum bracket for income below $800', () => {
      const result = getBCSOAmount(700, 1);
      // Should use $800 bracket amount for 1 child
      expect(result).toBe(170);
    });

    it('uses minimum bracket for very low combined income', () => {
      const result = getBCSOAmount(300, 2);
      // Should use $800 bracket amount for 2 children
      expect(result).toBe(260);
    });

    it('returns 0 for zero income', () => {
      const result = getBCSOAmount(0, 1);
      expect(result).toBe(0);
    });

    it('returns 0 for negative income', () => {
      const result = getBCSOAmount(-100, 1);
      expect(result).toBe(0);
    });
  });

  describe('Test helper function', () => {
    it('indicates when minimum bracket is used for very low income', () => {
      const result = getBCSOAmountWithFallback(600, 1);
      expect(result.amount).toBe(170);
      expect(result.usedMinimumBracket).toBe(true);
    });

    it('indicates when normal bracket is used', () => {
      const result = getBCSOAmountWithFallback(2050, 2);
      expect(result.amount).toBe(633);
      expect(result.usedMinimumBracket).toBe(false);
    });
  });

  describe('findBCSOBracket', () => {
    it('returns null for income below minimum', () => {
      const result = findBCSOBracket(700);
      expect(result).toBeNull();
    });

    it('returns minimum bracket for income at minimum', () => {
      const result = findBCSOBracket(800);
      expect(result?.income).toBe(800);
    });

    it('rounds income to nearest $50', () => {
      const result = findBCSOBracket(825); // Should round to 850
      expect(result?.income).toBe(850);
    });
  });

  describe('Validation helpers', () => {
    it('validates income range correctly', () => {
      expect(isValidIncome(800)).toBe(true);
      expect(isValidIncome(700)).toBe(false); // Below minimum
      expect(isValidIncome(41000)).toBe(false); // Above maximum
    });
  });
});
