import React from 'react';
import {
  formatCurrency,
  roundUpPercentage,
  getOvernightsFromSchedule,
} from '../utils/calculations';
import type { CalculationBreakdown, WizardFormData } from '../types/wizard';
import Disclaimer from '../components/Disclaimer';

// Calculate potential parenting time impact based on user's actual selections
const calculateParentingTimeImpact = (result: CalculationBreakdown, formData: WizardFormData) => {
  const baseAmount = result.amount;

  // Get actual parenting time for both parents
  // If result.payer === 'A', then Parent A is paying, so Parent B is custodial and Parent A is non-custodial
  // If result.payer === 'B', then Parent B is paying, so Parent A is custodial and Parent B is non-custodial
  const custodialParent = result.payer === 'A' ? 'B' : 'A';
  const nonCustodialParent = result.payer === 'A' ? 'A' : 'B';

  // Custodial parent arrangement
  const custodialArrangement =
    custodialParent === 'A'
      ? formData.parentA.custodyArrangement
      : formData.parentB.custodyArrangement;
  const custodialCustomOvernights =
    custodialParent === 'A' ? formData.parentA.customOvernights : formData.parentB.customOvernights;

  // Non-custodial parent arrangement
  const nonCustodialArrangement =
    nonCustodialParent === 'A'
      ? formData.parentA.custodyArrangement
      : formData.parentB.custodyArrangement;
  const nonCustodialCustomOvernights =
    nonCustodialParent === 'A'
      ? formData.parentA.customOvernights
      : formData.parentB.customOvernights;

  // Convert custodial arrangement to visitation schedule and get overnights
  let custodialVisitationSchedule:
    | 'no-visitation'
    | 'minimal'
    | 'standard'
    | 'extended'
    | 'shared'
    | 'custom';

  // For the custodial parent, their "custody arrangement" represents how much time they have with children
  // If they have 'custodial' arrangement, they have primary custody (most time with children)
  // If they have 'shared' arrangement, they have shared custody (near 50/50 with children)
  // The visitation schedule represents how much time the NON-custodial parent has
  if (custodialArrangement === 'custodial') {
    custodialVisitationSchedule = 'standard'; // Primary custody = standard visitation for the other parent
  } else if (custodialArrangement === 'shared') {
    custodialVisitationSchedule = 'shared'; // Shared custody = shared visitation for the other parent
  } else {
    custodialVisitationSchedule = custodialArrangement as any;
  }

  const custodialOvernights = getOvernightsFromSchedule(
    custodialVisitationSchedule,
    custodialCustomOvernights
  );

  // Convert non-custodial arrangement to visitation schedule and get overnights
  let nonCustodialVisitationSchedule:
    | 'no-visitation'
    | 'minimal'
    | 'standard'
    | 'extended'
    | 'shared'
    | 'custom';
  if (nonCustodialArrangement === 'custodial') {
    nonCustodialVisitationSchedule = 'standard';
  } else {
    nonCustodialVisitationSchedule = nonCustodialArrangement as any;
  }

  const nonCustodialOvernights = getOvernightsFromSchedule(
    nonCustodialVisitationSchedule,
    nonCustodialCustomOvernights
  );

  // Calculate deviation based on non-custodial overnights (Georgia guidelines)
  // Standard visitation (80 overnights): ~10-15% reduction
  // Extended visitation (110 overnights): ~20-30% reduction
  // Shared visitation (146 overnights): ~40-50% reduction

  let currentReductionPercent = 0;
  let reductionReason = '';

  if (nonCustodialOvernights >= 146) {
    currentReductionPercent = 0.45; // Shared visitation - near 50/50
    reductionReason = 'shared visitation (146+ overnights)';
  } else if (nonCustodialOvernights >= 110) {
    currentReductionPercent = 0.25; // Extended visitation
    reductionReason = 'extended visitation (110+ overnights)';
  } else if (nonCustodialOvernights >= 80) {
    currentReductionPercent = 0.12; // Standard visitation
    reductionReason = 'standard visitation (80+ overnights)';
  } else if (nonCustodialOvernights >= 52) {
    currentReductionPercent = 0.06; // Minimal visitation
    reductionReason = 'minimal visitation (52+ overnights)';
  } else {
    currentReductionPercent = 0; // No reduction
    reductionReason = 'no reduction (< 52 overnights)';
  }

  const currentReduction = Math.round(baseAmount * currentReductionPercent);
  const currentAdjusted = Math.max(0, baseAmount - currentReduction);

  // Show potential alternatives
  const standardReduction = Math.round(baseAmount * 0.12);
  const extendedReduction = Math.round(baseAmount * 0.25);
  const sharedReduction = Math.round(baseAmount * 0.45);

  return {
    baseAmount,
    custodialParent,
    nonCustodialParent,
    custodialArrangement,
    nonCustodialArrangement,
    custodialOvernights,
    nonCustodialOvernights,
    currentArrangement: custodialArrangement, // For backward compatibility
    currentOvernights: custodialOvernights, // For backward compatibility
    currentReduction,
    currentAdjusted,
    reductionReason,
    standardReduction,
    extendedReduction,
    sharedReduction,
    standardAdjusted: Math.max(0, baseAmount - standardReduction),
    extendedAdjusted: Math.max(0, baseAmount - extendedReduction),
    sharedAdjusted: Math.max(0, baseAmount - sharedReduction),
  };
};

interface ResultsProps {
  result: CalculationBreakdown;
  formData: WizardFormData;
  onRestart: () => void;
}

export const Results: React.FC<ResultsProps> = ({ result, formData, onRestart }) => {
  const getParentDisplayName = (parent: 'A' | 'B') => {
    if (parent === 'A') {
      return result.parentAName || 'Parent A';
    } else {
      return result.parentBName || 'Parent B';
    }
  };

  const parentingImpact = calculateParentingTimeImpact(result, formData);

  // Get readable description of custody/visitation arrangement
  const getCustodyDescription = (
    arrangement: string,
    overnights: number,
    isCustodial: boolean = false
  ) => {
    const percentage = Math.round((overnights / 365) * 100);
    let result;
    switch (arrangement) {
      case 'custodial':
        result = ''; // Don't mention primary custody as it's the baseline
        break;
      case 'shared':
        result = isCustodial
          ? `shared custody with ${overnights} overnights per year (approximately ${percentage}% of the time)`
          : `shared visitation with ${overnights} overnights per year (approximately ${percentage}% of the time)`;
        break;
      case 'standard':
        result = isCustodial
          ? `standard custody with ${overnights} overnights per year (approximately ${percentage}% of the time)`
          : `standard visitation with ${overnights} overnights per year (approximately ${percentage}% of the time)`;
        break;
      case 'extended':
        result = isCustodial
          ? `extended custody with ${overnights} overnights per year (approximately ${percentage}% of the time)`
          : `extended visitation with ${overnights} overnights per year (approximately ${percentage}% of the time)`;
        break;
      case 'minimal':
        result = isCustodial
          ? `minimal custody with ${overnights} overnights per year (approximately ${percentage}% of the time)`
          : `minimal visitation with ${overnights} overnights per year (approximately ${percentage}% of the time)`;
        break;
      case 'no-visitation':
        result = 'no visitation';
        break;
      case 'custom':
        result = `custom visitation with ${overnights} overnights per year (approximately ${percentage}% of the time)`;
        break;
      default:
        result = `${arrangement} with ${overnights} overnights per year (approximately ${percentage}% of the time)`;
    }

    return result;
  };

  const getPayerInfo = () => {
    if (result.payer === 'None') {
      return {
        text: 'No payment required',
        description: 'Both parents have equal support obligations',
        amount: '$0',
      };
    } else if (result.payer === 'A') {
      return {
        text: `${getParentDisplayName('A')} pays ${getParentDisplayName('B')}`,
        description: `${getParentDisplayName('A')} has the higher support obligation`,
        amount: formatCurrency(result.amount),
      };
    } else {
      return {
        text: `${getParentDisplayName('B')} pays ${getParentDisplayName('A')}`,
        description: `${getParentDisplayName('B')} has the higher support obligation`,
        amount: formatCurrency(result.amount),
      };
    }
  };

  const payerInfo = getPayerInfo();

  return (
    <div>
      <Disclaimer className="margin-bottom-4" />

      {/* Enhanced Result Display */}
      <div className="grid-container margin-bottom-4">
        <div className="result-highlight">
          <h1>
            <span className="result-description">
              {payerInfo.text} {payerInfo.amount}
            </span>
          </h1>

          <div className="calculation-breakdown">
            <ul className="usa-list">
              <li>
                Your combined family income is{' '}
                <strong>{formatCurrency(result.combinedIncome)}</strong> per month, which Georgia
                uses to determine total family resources for child support.
              </li>

              <li>
                According to Georgia's official support table, your base support amount is{' '}
                <strong>{formatCurrency(result.bcso)}</strong> per month, based on your combined
                income and number of children.
              </li>

              <li>
                {result.payer === 'A' ? getParentDisplayName('A') : getParentDisplayName('B')} earns{' '}
                <strong>
                  {roundUpPercentage(result.payer === 'A' ? result.proRataA : result.proRataB)}%
                </strong>{' '}
                of the total family income, determining each parent's proportional share of
                financial responsibility for the children.
              </li>

              <li>
                The non-custodial parent's base support obligation is{' '}
                <strong>
                  {formatCurrency(
                    result.payer === 'A' ? result.basicSupportA : result.basicSupportB
                  )}
                </strong>
                , which is{' '}
                <strong>
                  {roundUpPercentage(result.payer === 'A' ? result.proRataA : result.proRataB)}%
                </strong>{' '}
                of the base support amount from Georgia's guidelines table.
              </li>

              <li>
                {(() => {
                  const expenseAmount = result.payer === 'A' ? result.expensesA : result.expensesB;
                  const totalExpenses = result.expensesA + result.expensesB;

                  if (totalExpenses === 0) {
                    return 'No additional health insurance or childcare expenses were entered for this calculation.';
                  } else if (expenseAmount === 0) {
                    return 'No reimbursement needed for health insurance or childcare expenses - the non-custodial parent has a lower income share.';
                  } else {
                    return (
                      <>
                        Plus <strong>{formatCurrency(expenseAmount)}</strong> for health insurance
                        and childcare expenses, which the custodial parent covers and the
                        non-custodial parent reimburses.
                      </>
                    );
                  }
                })()}
              </li>

              <li>
                Total monthly payment: {payerInfo.text} <strong>{payerInfo.amount}</strong>,
                including both the base child support and any health insurance/childcare expense
                reimbursements.
              </li>
            </ul>
          </div>
          {/* Parenting Time Alert */}
          <div className="margin-top-2">
            <div className="usa-alert usa-alert--info">
              <div className="usa-alert__body">
                <h4 className="usa-alert__heading">Parenting Time Impact</h4>
                <div>
                  {/* Custodial Parent */}
                  {(() => {
                    const custodialDesc = getCustodyDescription(
                      parentingImpact.custodialArrangement,
                      parentingImpact.custodialOvernights,
                      true // This is the custodial parent
                    );

                    return custodialDesc ? (
                      <p className="usa-alert__text">
                        <strong>
                          {getParentDisplayName(parentingImpact.custodialParent as 'A' | 'B')}
                        </strong>{' '}
                        has <strong>{custodialDesc}</strong>.
                      </p>
                    ) : null;
                  })()}

                  {/* Non-Custodial Parent */}
                  <div>
                    {parentingImpact.currentReduction > 0 ? (
                      <div>
                        <p className="usa-alert__text">
                          <strong>
                            {getParentDisplayName(parentingImpact.nonCustodialParent as 'A' | 'B')}
                          </strong>{' '}
                          has{' '}
                          <strong>
                            {getCustodyDescription(
                              parentingImpact.nonCustodialArrangement,
                              parentingImpact.nonCustodialOvernights,
                              false // This is the non-custodial parent
                            ) || 'standard visitation'}
                          </strong>
                          .
                        </p>
                        <p className="usa-alert__text">
                          Because of this parenting time, the child support payment may be reduced
                          by about{' '}
                          <strong>{formatCurrency(parentingImpact.currentReduction)}</strong>,
                          resulting in a payment of{' '}
                          <strong>{formatCurrency(parentingImpact.currentAdjusted)}</strong> per
                          month.
                        </p>
                      </div>
                    ) : (
                      <p className="usa-alert__text">
                        <strong>
                          {getParentDisplayName(parentingImpact.nonCustodialParent as 'A' | 'B')}
                        </strong>{' '}
                        has{' '}
                        <strong>
                          {getCustodyDescription(
                            parentingImpact.nonCustodialArrangement,
                            parentingImpact.nonCustodialOvernights,
                            false // This is the non-custodial parent
                          ) || 'standard visitation'}
                        </strong>
                        .
                      </p>
                    )}
                  </div>
                </div>
                {parentingImpact.currentReduction === 0 && (
                  <p className="usa-alert__text">
                    The non-custodial parent's visitation arrangement does not typically qualify for
                    a parenting time deviation, so the full calculated amount of{' '}
                    <strong>{formatCurrency(parentingImpact.baseAmount)}</strong>/month applies.
                  </p>
                )}

                <p className="usa-alert__text text-italic">
                  Starting in 2026, Georgia will incorporate parenting time as part of the standard
                  child support calculation, which may change how these adjustments are applied.
                </p>
              </div>
            </div>
          </div>
          <p className="text-base margin-bottom-0 opacity-80">
            This estimate is based on Georgia child support guidelines and your provided
            information.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid-container margin-bottom-4">
        <div className="usa-card">
          <div className="usa-card__body">
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-6">
                <h3 className="margin-top-0">Next Steps</h3>
                <ul className="usa-list margin-bottom-0">
                  <li>Use this as a starting point for official calculations</li>
                  <li>Consult with a family law attorney</li>
                  <li>Bring supporting documentation to court</li>
                  <li>Be prepared for judge's final determination</li>
                </ul>
              </div>
              <div className="tablet:grid-col-6">
                <h3 className="margin-top-0">Actions</h3>
                <div className="usa-button-group margin-bottom-2">
                  <button type="button" className="usa-button" onClick={() => window.print()}>
                    Print Results
                  </button>
                  <button
                    type="button"
                    className="usa-button usa-button--outline"
                    onClick={onRestart}
                  >
                    Start New Calculation
                  </button>
                </div>
                <div className="text-base text-base-dark">
                  <strong>Remember:</strong> This is an estimate. Actual court-ordered amounts may
                  differ based on specific circumstances and judicial discretion.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
