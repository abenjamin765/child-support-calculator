import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { WizardFormData } from '../../types/wizard';

export const ParentingTime: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<WizardFormData>();

  return (
    <div className="usa-form">
      <h3 className="margin-bottom-3">Parenting Time</h3>

      <fieldset className="usa-fieldset">
        <div className="usa-form-group">
          <label className="usa-label" htmlFor="parentingTime.annualOvernights">
            Annual Overnight Visits
          </label>
          <div className="usa-hint">
            Number of nights per year the noncustodial parent has physical custody (0-365)
          </div>
          <input
            className={`usa-input ${errors.parentingTime?.annualOvernights ? 'usa-input--error' : ''}`}
            id="parentingTime.annualOvernights"
            type="number"
            min="0"
            max="365"
            {...register('parentingTime.annualOvernights', {
              required: 'Annual overnights is required',
              min: { value: 0, message: 'Cannot be negative' },
              max: { value: 365, message: 'Cannot exceed 365 days per year' }
            })}
          />
          {errors.parentingTime?.annualOvernights && (
            <span className="usa-error-message" role="alert">
              {errors.parentingTime.annualOvernights.message}
            </span>
          )}
        </div>

        <div className="usa-alert usa-alert--info usa-alert--slim margin-top-3">
          <div className="usa-alert__body">
            <p className="usa-alert__text">
              <strong>Parenting time impact:</strong> More than 73 overnights per year (approximately
              every other weekend) may reduce the child support obligation through a deviation.
            </p>
          </div>
        </div>

        <div className="margin-top-3">
          <h4>How to calculate annual overnights:</h4>
          <ul className="usa-list">
            <li>Count each 24-hour period the children are with the noncustodial parent</li>
            <li>Include holidays, school breaks, and summer visitation</li>
            <li>Include partial days if they exceed 24 hours total</li>
            <li>Exclude regular daytime visitation without overnight stays</li>
          </ul>
        </div>

        <div className="usa-alert usa-alert--warning usa-alert--slim margin-top-3">
          <div className="usa-alert__body">
            <p className="usa-alert__text">
              <strong>Note:</strong> Parenting time adjustments become mandatory in Georgia on January 1, 2026.
              Until then, they are discretionary and require court approval.
            </p>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default ParentingTime;
