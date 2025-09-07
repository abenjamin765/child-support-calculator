import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { WizardFormData } from '../../types/wizard';

interface IncomeInputProps {
  parentLabel: string;
  parentKey: 'parentA' | 'parentB';
}

export const IncomeInput: React.FC<IncomeInputProps> = ({ parentLabel, parentKey }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<WizardFormData>();

  return (
    <div className="usa-form">
      <h3 className="margin-bottom-3">{parentLabel} Income Information</h3>

      <fieldset className="usa-fieldset">
        <div className="usa-form-group">
          <label className="usa-label" htmlFor={`${parentKey}.grossMonthly`}>
            Gross Monthly Income *
          </label>
          <div className="usa-hint">
            Total monthly income before deductions (salaries, wages, self-employment, etc.)
          </div>
          <input
            className={`usa-input ${errors[parentKey]?.grossMonthly ? 'usa-input--error' : ''}`}
            id={`${parentKey}.grossMonthly`}
            type="number"
            min="0"
            step="0.01"
            {...register(`${parentKey}.grossMonthly`, {
              required: 'Gross monthly income is required',
              min: { value: 0, message: 'Income cannot be negative' },
              valueAsNumber: true,
            })}
          />
          {errors[parentKey]?.grossMonthly && (
            <span className="usa-error-message" role="alert">
              {errors[parentKey].grossMonthly.message}
            </span>
          )}
        </div>

        <div className="usa-form-group">
          <label className="usa-label" htmlFor={`${parentKey}.selfEmploymentTax`}>
            Self-Employment Tax Deduction
          </label>
          <div className="usa-hint">
            Half of FICA/Medicare taxes (typically 7.65% of self-employment income)
          </div>
          <input
            className="usa-input"
            id={`${parentKey}.selfEmploymentTax`}
            type="number"
            min="0"
            step="0.01"
            {...register(`${parentKey}.selfEmploymentTax`, {
              min: { value: 0, message: 'Deduction cannot be negative' },
              valueAsNumber: true,
            })}
          />
        </div>

        <div className="usa-form-group">
          <label className="usa-label" htmlFor={`${parentKey}.preexistingSupport`}>
            Preexisting Child Support
          </label>
          <div className="usa-hint">
            Monthly amount paid for children from previous relationships
          </div>
          <input
            className="usa-input"
            id={`${parentKey}.preexistingSupport`}
            type="number"
            min="0"
            step="0.01"
            {...register(`${parentKey}.preexistingSupport`, {
              min: { value: 0, message: 'Support amount cannot be negative' },
              valueAsNumber: true,
            })}
          />
        </div>

        <div className="usa-alert usa-alert--info usa-alert--slim margin-top-3">
          <div className="usa-alert__body">
            <p className="usa-alert__text">
              <strong>Adjusted Income:</strong> Gross income minus deductions = base for child
              support calculation
            </p>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default IncomeInput;
