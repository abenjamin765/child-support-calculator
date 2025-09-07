import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { WizardFormData } from '../../types/wizard';

export const ExpensesInput: React.FC = () => {
  const { register } = useFormContext<WizardFormData>();

  return (
    <div className="usa-form">
      <h3 className="margin-bottom-3">Child-Related Expenses</h3>

      <fieldset className="usa-fieldset">
        <div className="usa-form-group">
          <label className="usa-label" htmlFor="expenses.healthInsurance">
            Monthly Health Insurance Premium
          </label>
          <div className="usa-hint">
            Cost of health insurance covering the children (child portion only)
          </div>
          <div className="usa-input-prefix">
            <span className="usa-input-prefix__text">$</span>
            <input
              className="usa-input"
              id="expenses.healthInsurance"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              {...register('expenses.healthInsurance', {
                min: { value: 0, message: 'Amount cannot be negative' },
                valueAsNumber: true,
              })}
            />
          </div>
        </div>

        <div className="usa-form-group">
          <label className="usa-label" htmlFor="expenses.childCare">
            Monthly Child Care Costs
          </label>
          <div className="usa-hint">
            Work-related child care expenses (daycare, after-school care, etc.)
          </div>
          <div className="usa-input-prefix">
            <span className="usa-input-prefix__text">$</span>
            <input
              className="usa-input"
              id="expenses.childCare"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              {...register('expenses.childCare', {
                min: { value: 0, message: 'Amount cannot be negative' },
                valueAsNumber: true,
              })}
            />
          </div>
        </div>

        <div className="usa-alert usa-alert--info usa-alert--slim margin-top-3">
          <div className="usa-alert__body">
            <p className="usa-alert__text">
              <strong>How expenses are handled:</strong> These costs are added to the basic child
              support amount and prorated between parents based on their income shares.
            </p>
          </div>
        </div>

        <div className="margin-top-3">
          <h4>Examples of child-related expenses:</h4>
          <ul className="usa-list">
            <li>Health insurance premiums for children</li>
            <li>Daycare or preschool costs</li>
            <li>After-school programs</li>
            <li>Summer camp fees</li>
            <li>Medical expenses not covered by insurance</li>
          </ul>
        </div>
      </fieldset>
    </div>
  );
};

export default ExpensesInput;
