import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { WizardFormData } from '../../types/wizard';

export const Deviations: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<WizardFormData>();

  return (
    <div className="usa-form">
      <h3 className="margin-bottom-3">Deviations from Presumptive Amount</h3>

      <fieldset className="usa-fieldset">
        <div className="usa-form-group">
          <fieldset className="usa-fieldset">
            <legend className="usa-legend">Low-Income Adjustment</legend>
            <div className="usa-hint margin-bottom-2">
              For noncustodial parents with combined adjusted income $1,550-$3,950/month
            </div>
            <div className="usa-checkbox">
              <input
                className="usa-checkbox__input"
                id="deviations.lowIncome"
                type="checkbox"
                {...register('deviations.lowIncome')}
              />
              <label className="usa-checkbox__label" htmlFor="deviations.lowIncome">
                Apply low-income sliding scale reduction
              </label>
            </div>
          </fieldset>
        </div>

        <div className="usa-form-group">
          <fieldset className="usa-fieldset">
            <legend className="usa-legend">High-Income Adjustment</legend>
            <div className="usa-hint margin-bottom-2">
              For combined adjusted income over $40,000/month
            </div>
            <div className="usa-checkbox">
              <input
                className="usa-checkbox__input"
                id="deviations.highIncome"
                type="checkbox"
                {...register('deviations.highIncome')}
              />
              <label className="usa-checkbox__label" htmlFor="deviations.highIncome">
                Apply high-income adjustment
              </label>
            </div>
          </fieldset>
        </div>

        <div className="usa-form-group">
          <label className="usa-label" htmlFor="deviations.otherAdjustment">
            Other Adjustments
          </label>
          <div className="usa-hint">
            Court-approved deviations from presumptive amount (enter as percentage)
          </div>
          <div className="usa-input-prefix">
            <input
              className={`usa-input ${errors.deviations?.otherAdjustment ? 'usa-input--error' : ''}`}
              id="deviations.otherAdjustment"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('deviations.otherAdjustment', {
                min: { value: -100, message: 'Cannot reduce by more than 100%' },
                max: { value: 1000, message: 'Cannot increase by more than 1000%' }
              })}
            />
            <span className="usa-input-prefix__text">%</span>
          </div>
          {errors.deviations?.otherAdjustment && (
            <span className="usa-error-message" role="alert">
              {errors.deviations.otherAdjustment.message}
            </span>
          )}
        </div>

        <div className="usa-alert usa-alert--info usa-alert--slim margin-top-3">
          <div className="usa-alert__body">
            <p className="usa-alert__text">
              <strong>Deviation Guidelines:</strong> Courts may deviate from the presumptive amount if it
              would be unjust or inappropriate. Deviations must be supported by written findings.
            </p>
          </div>
        </div>

        <div className="margin-top-3">
          <h4>Common deviation factors:</h4>
          <ul className="usa-list">
            <li>Extraordinary educational expenses</li>
            <li>Uninsured medical expenses</li>
            <li>Travel costs for visitation</li>
            <li>Parenting time arrangements</li>
            <li>Age and special needs of children</li>
            <li>Earning capacity and employment opportunities</li>
          </ul>
        </div>

        <div className="usa-alert usa-alert--warning usa-alert--slim margin-top-3">
          <div className="usa-alert__body">
            <p className="usa-alert__text">
              <strong>Legal Note:</strong> Deviations require court approval and must serve the best
              interests of the child. This calculator provides estimates only.
            </p>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default Deviations;
