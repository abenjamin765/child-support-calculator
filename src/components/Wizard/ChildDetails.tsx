import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { WizardFormData } from '../../types/wizard';

export const ChildDetails: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<WizardFormData>();

  return (
    <div className="usa-form">
      <h3 className="margin-bottom-3">Child Information</h3>

      <fieldset className="usa-fieldset">
        <div className="usa-form-group">
          <label className="usa-label" htmlFor="children.numberOfChildren">
            Number of Children *
          </label>
          <div className="usa-hint">
            Enter the number of children for whom child support is being calculated (1-6)
          </div>
          <input
            className={`usa-input ${errors.children?.numberOfChildren ? 'usa-input--error' : ''}`}
            id="children.numberOfChildren"
            type="number"
            min="1"
            max="6"
            {...register('children.numberOfChildren', {
              required: 'Number of children is required',
              min: { value: 1, message: 'Must have at least 1 child' },
              max: { value: 6, message: 'Maximum 6 children supported' },
              valueAsNumber: true,
            })}
          />
          {errors.children?.numberOfChildren && (
            <span className="usa-error-message" role="alert">
              {errors.children.numberOfChildren.message}
            </span>
          )}
        </div>

        <div className="usa-alert usa-alert--info usa-alert--slim margin-top-3">
          <div className="usa-alert__body">
            <p className="usa-alert__text">
              <strong>Note:</strong> The Basic Child Support Obligation (BCSO) table provides
              amounts for 1-6 children. For more than 6 children, the amount for 6 children applies.
            </p>
          </div>
        </div>

        <div className="margin-top-3">
          <h4>Important Guidelines:</h4>
          <ul className="usa-list">
            <li>Count all children under 18 (or 20 if still in high school)</li>
            <li>Include children from previous relationships if support is being calculated</li>
            <li>For split custody, calculate separately for each household</li>
          </ul>
        </div>
      </fieldset>
    </div>
  );
};

export default ChildDetails;
