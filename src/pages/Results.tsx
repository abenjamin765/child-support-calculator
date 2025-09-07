import React from 'react';
import { formatCurrency, formatPercentage } from '../utils/calculations';
import type { CalculationBreakdown } from '../types/wizard';
import Disclaimer from '../components/Disclaimer';

interface ResultsProps {
  result: CalculationBreakdown;
  onRestart: () => void;
}

export const Results: React.FC<ResultsProps> = ({ result, onRestart }) => {
  const getParentDisplayName = (parent: 'A' | 'B') => {
    if (parent === 'A') {
      return result.parentAName || 'Parent A';
    } else {
      return result.parentBName || 'Parent B';
    }
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
    <div className="usa-prose">
      <Disclaimer className="margin-bottom-4" />

      <h1>Child Support Calculation Results</h1>

      {/* Summary Card */}
      <div className="usa-summary-box margin-bottom-4">
        <div className="usa-summary-box__body">
          <h3 className="usa-summary-box__heading">Monthly Child Support Amount</h3>
          <div className="usa-summary-box__text">
            <div className="font-sans-xl margin-bottom-1">{payerInfo.amount}</div>
            <p className="margin-0">{payerInfo.text}</p>
            <p className="margin-0 text-base">{payerInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Quick Facts */}
      <div className="grid-row grid-gap margin-bottom-4">
        <div className="tablet:grid-col-6">
          <div className="usa-card">
            <div className="usa-card__body">
              <h4 className="usa-card__heading">Combined Monthly Income</h4>
              <div className="font-sans-lg">{formatCurrency(result.combinedIncome)}</div>
            </div>
          </div>
        </div>
        <div className="tablet:grid-col-6">
          <div className="usa-card">
            <div className="usa-card__body">
              <h4 className="usa-card__heading">Basic Child Support Obligation</h4>
              <div className="font-sans-lg">{formatCurrency(result.bcso)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Accordion */}
      <div className="usa-accordion" data-allow-multiple>
        <h2>Calculation Breakdown</h2>

        <div className="usa-accordion__content">
          <h3>Step 1: Parent Income Summary</h3>
          <table className="usa-table usa-table--borderless">
            <thead>
              <tr>
                <th>Parent</th>
                <th>Gross Income</th>
                <th>Adjusted Income</th>
                <th>Income Share</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{getParentDisplayName('A')}</td>
                <td>{formatCurrency(result.grossIncomeA)}</td>
                <td>{formatCurrency(result.adjustedIncomeA)}</td>
                <td>{formatPercentage(result.proRataA)}</td>
              </tr>
              <tr>
                <td>{getParentDisplayName('B')}</td>
                <td>{formatCurrency(result.grossIncomeB)}</td>
                <td>{formatCurrency(result.adjustedIncomeB)}</td>
                <td>{formatPercentage(result.proRataB)}</td>
              </tr>
              <tr className="text-bold">
                <td>Combined</td>
                <td>{formatCurrency(result.grossIncomeA + result.grossIncomeB)}</td>
                <td>{formatCurrency(result.combinedIncome)}</td>
                <td>100%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="usa-accordion__content">
          <h3>Step 2: Basic Child Support Obligation</h3>
          <table className="usa-table usa-table--borderless">
            <tbody>
              <tr>
                <td>BCSO Amount</td>
                <td className="text-right">{formatCurrency(result.bcso)}</td>
              </tr>
              <tr>
                <td>{getParentDisplayName('A')} Basic Share</td>
                <td className="text-right">{formatCurrency(result.basicSupportA)}</td>
              </tr>
              <tr>
                <td>{getParentDisplayName('B')} Basic Share</td>
                <td className="text-right">{formatCurrency(result.basicSupportB)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="usa-accordion__content">
          <h3>Step 3: Add Child-Related Expenses</h3>
          <table className="usa-table usa-table--borderless">
            <tbody>
              <tr>
                <td>{getParentDisplayName('A')} Expenses</td>
                <td className="text-right">{formatCurrency(result.expensesA)}</td>
              </tr>
              <tr>
                <td>{getParentDisplayName('B')} Expenses</td>
                <td className="text-right">{formatCurrency(result.expensesB)}</td>
              </tr>
              <tr className="text-bold">
                <td>Total Expenses</td>
                <td className="text-right">
                  {formatCurrency(result.expensesA + result.expensesB)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="usa-accordion__content">
          <h3>Step 4: Presumptive Amount</h3>
          <table className="usa-table usa-table--borderless">
            <tbody>
              <tr>
                <td>{getParentDisplayName('A')} Presumptive Support</td>
                <td className="text-right">{formatCurrency(result.presumptiveSupportA)}</td>
              </tr>
              <tr>
                <td>{getParentDisplayName('B')} Presumptive Support</td>
                <td className="text-right">{formatCurrency(result.presumptiveSupportB)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="usa-accordion__content">
          <h3>Step 5: Final Amount (After Deviations)</h3>
          <table className="usa-table usa-table--borderless">
            <tbody>
              <tr>
                <td>{getParentDisplayName('A')} Final Support</td>
                <td className="text-right">{formatCurrency(result.finalSupportA)}</td>
              </tr>
              <tr>
                <td>{getParentDisplayName('B')} Final Support</td>
                <td className="text-right">{formatCurrency(result.finalSupportB)}</td>
              </tr>
              <tr className="text-bold border-top-2px">
                <td>Net Payment Required</td>
                <td className="text-right">{payerInfo.amount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="usa-button-group margin-top-4">
        <button type="button" className="usa-button usa-button--secondary" onClick={onRestart}>
          Start New Calculation
        </button>
        <button type="button" className="usa-button" onClick={() => window.print()}>
          Print Results
        </button>
      </div>

      {/* Legal Notes */}
      <div className="usa-alert usa-alert--info margin-top-4">
        <div className="usa-alert__body">
          <h3 className="usa-alert__heading">Important Notes</h3>
          <ul className="usa-list margin-0">
            <li>This is an estimate based on Georgia child support guidelines</li>
            <li>Actual court-ordered amounts may differ based on specific circumstances</li>
            <li>Consult an attorney for legal advice and court preparation</li>
            <li>Results should be validated against the official Georgia calculator</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Results;
