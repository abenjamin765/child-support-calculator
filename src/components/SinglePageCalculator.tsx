import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { WizardFormData, CalculationBreakdown } from '../types/wizard';
import { calculateChildSupport } from '../utils/calculations';
import Disclaimer from './Disclaimer';
import Results from '../pages/Results';

interface SinglePageCalculatorProps {
  onComplete: (result: CalculationBreakdown) => void;
}

export const SinglePageCalculator: React.FC<SinglePageCalculatorProps> = ({ onComplete }) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState<CalculationBreakdown | null>(null);
  const [combinedIncome, setCombinedIncome] = useState<number>(0);

  const methods = useForm<WizardFormData>({
    defaultValues: {
      parentA: {
        name: '',
        grossMonthly: 0,
        selfEmploymentTax: 0,
        preexistingSupport: 0,
        custodyArrangement: 'custodial', // Parent A defaults to custodial
        customOvernights: 0,
      },
      parentB: {
        name: '',
        grossMonthly: 0,
        selfEmploymentTax: 0,
        preexistingSupport: 0,
        custodyArrangement: 'standard', // Parent B defaults to standard visitation
        customOvernights: 0,
      },
      children: {
        numberOfChildren: 1,
      },
      expenses: {
        healthInsurance: 0,
        childCare: 0,
      },
      deviations: {
        lowIncome: false,
        highIncome: false,
        otherAdjustment: 0,
      },
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = methods;

  // Watch for income changes to update combined income
  const watchedParentAIncome = watch('parentA.grossMonthly');
  const watchedParentBIncome = watch('parentB.grossMonthly');

  // Update combined income whenever incomes change
  React.useEffect(() => {
    const incomeA = watchedParentAIncome || 0;
    const incomeB = watchedParentBIncome || 0;
    const combined = incomeA + incomeB;
    setCombinedIncome(combined);
  }, [watchedParentAIncome, watchedParentBIncome]);

  // Helper function to determine automatic deviations and income status
  const getIncomeStatus = (combinedIncome: number) => {
    return {
      lowIncome: combinedIncome >= 1550 && combinedIncome <= 3950,
      highIncome: combinedIncome > 40000,
      veryLowIncome: combinedIncome > 0 && combinedIncome < 800,
      noAdjustments:
        (combinedIncome >= 800 && combinedIncome < 1550) ||
        (combinedIncome > 3950 && combinedIncome <= 40000),
    };
  };

  const onSubmit = async (data: WizardFormData) => {
    setIsCalculating(true);
    try {
      // Calculate combined income
      const adjustedIncomeA =
        data.parentA.grossMonthly -
        data.parentA.selfEmploymentTax -
        data.parentA.preexistingSupport;
      const adjustedIncomeB =
        data.parentB.grossMonthly -
        data.parentB.selfEmploymentTax -
        data.parentB.preexistingSupport;
      const combinedIncome = Math.max(0, adjustedIncomeA + adjustedIncomeB);

      // Automatically determine deviations
      const incomeStatus = getIncomeStatus(combinedIncome);

      const result = calculateChildSupport(
        data.parentA.grossMonthly,
        data.parentB.grossMonthly,
        {
          selfEmploymentTax: data.parentA.selfEmploymentTax,
          preexistingSupport: data.parentA.preexistingSupport,
        },
        {
          selfEmploymentTax: data.parentB.selfEmploymentTax,
          preexistingSupport: data.parentB.preexistingSupport,
        },
        data.children.numberOfChildren,
        {
          healthInsurance: data.expenses.healthInsurance,
          childCare: data.expenses.childCare,
        },
        {
          lowIncome: incomeStatus.lowIncome,
          highIncome: incomeStatus.highIncome,
          visitationSchedule: 'no-visitation', // Will be overridden by custody arrangements
          customOvernights: 0, // Will be overridden by custody arrangements
          otherDeviations: data.deviations.otherAdjustment,
        },
        data.parentA.custodyArrangement,
        data.parentB.custodyArrangement,
        data.parentA.customOvernights,
        data.parentB.customOvernights,
        data.parentA.name || undefined,
        data.parentB.name || undefined
      );

      setCalculationResult(result);
      onComplete(result);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleRestart = () => {
    setCalculationResult(null);
    methods.reset();
  };

  if (calculationResult) {
    return <Results result={calculationResult} onRestart={handleRestart} />;
  }

  return (
    <div className="usa-prose">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Parent Information Section */}
        <div className="margin-bottom-5">
          <h2 className="margin-bottom-3">Parent Information</h2>
          <div className="grid-row grid-gap">
            {/* Parent A */}
            <div className="tablet:grid-col-6">
              <div className="usa-card">
                <div className="usa-card__body">
                  <h3 className="usa-card__heading">Parent A</h3>

                  <div className="usa-form-group">
                    <label className="usa-label" htmlFor="parentA.name">
                      Name (Optional)
                    </label>
                    <input
                      className="usa-input"
                      id="parentA.name"
                      type="text"
                      placeholder="Enter parent name"
                      {...register('parentA.name')}
                    />
                  </div>

                  <div className="usa-form-group">
                    <label className="usa-label" htmlFor="parentA.grossMonthly">
                      Gross Monthly Income *
                    </label>
                    <div className="usa-hint margin-bottom-1">
                      Total monthly income before deductions
                    </div>
                    <input
                      className={`usa-input ${errors.parentA?.grossMonthly ? 'usa-input--error' : ''}`}
                      id="parentA.grossMonthly"
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('parentA.grossMonthly', {
                        required: 'Gross monthly income is required',
                        min: { value: 0, message: 'Income cannot be negative' },
                        valueAsNumber: true,
                      })}
                    />
                    {errors.parentA?.grossMonthly && (
                      <span className="usa-error-message" role="alert">
                        {errors.parentA.grossMonthly.message}
                      </span>
                    )}
                  </div>

                  <div className="usa-form-group">
                    <label className="usa-label" htmlFor="parentA.selfEmploymentTax">
                      Self-Employment Tax Deduction
                    </label>
                    <input
                      className="usa-input"
                      id="parentA.selfEmploymentTax"
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('parentA.selfEmploymentTax', {
                        min: { value: 0, message: 'Deduction cannot be negative' },
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <div className="usa-form-group">
                    <label className="usa-label" htmlFor="parentA.preexistingSupport">
                      Preexisting Child Support
                    </label>
                    <input
                      className="usa-input"
                      id="parentA.preexistingSupport"
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('parentA.preexistingSupport', {
                        min: { value: 0, message: 'Support amount cannot be negative' },
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <div className="usa-form-group">
                    <fieldset className="usa-fieldset">
                      <legend className="usa-legend">Custody & Visitation Arrangement</legend>
                      <div className="grid-row grid-gap">
                        <div className="tablet:grid-col-12">
                          <div className="usa-radio">
                            <input
                              className="usa-radio__input usa-radio__input--tile"
                              id="parentA.custodial"
                              type="radio"
                              value="custodial"
                              {...register('parentA.custodyArrangement')}
                            />
                            <label className="usa-radio__label" htmlFor="parentA.custodial">
                              <strong>Custodial Parent</strong>
                              <span className="usa-checkbox__label-description">
                                Primary physical custody of the children. The other parent will have
                                visitation rights.
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="tablet:grid-col-12">
                          <div className="usa-radio">
                            <input
                              className="usa-radio__input usa-radio__input--tile"
                              id="parentA.no-visitation"
                              type="radio"
                              value="no-visitation"
                              {...register('parentA.custodyArrangement')}
                            />
                            <label className="usa-radio__label" htmlFor="parentA.no-visitation">
                              <strong>No Visitation</strong>
                              <span className="usa-checkbox__label-description">
                                Noncustodial parent has no overnight visits with the children.
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="tablet:grid-col-12">
                          <div className="usa-radio">
                            <input
                              className="usa-radio__input usa-radio__input--tile"
                              id="parentA.minimal"
                              type="radio"
                              value="minimal"
                              {...register('parentA.custodyArrangement')}
                            />
                            <label className="usa-radio__label" htmlFor="parentA.minimal">
                              <strong>Minimal Parenting Time</strong>
                              <span className="usa-checkbox__label-description">
                                Every other weekend (Friday–Sunday, ~2 days every 2 weeks) = 52
                                overnights per year.
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="tablet:grid-col-12">
                          <div className="usa-radio">
                            <input
                              className="usa-radio__input usa-radio__input--tile"
                              id="parentA.standard"
                              type="radio"
                              value="standard"
                              {...register('parentA.custodyArrangement')}
                            />
                            <label className="usa-radio__label" htmlFor="parentA.standard">
                              <strong>Standard Parenting Time</strong>
                              <span className="usa-checkbox__label-description">
                                Every other weekend + 2 weeks in summer + holidays = 80 overnights
                                per year.
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="tablet:grid-col-12">
                          <div className="usa-radio">
                            <input
                              className="usa-radio__input usa-radio__input--tile"
                              id="parentA.extended"
                              type="radio"
                              value="extended"
                              {...register('parentA.custodyArrangement')}
                            />
                            <label className="usa-radio__label" htmlFor="parentA.extended">
                              <strong>Extended Parenting Time</strong>
                              <span className="usa-checkbox__label-description">
                                Every other weekend + one weekday per week + 4 weeks in summer = 110
                                overnights per year.
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="tablet:grid-col-12">
                          <div className="usa-radio">
                            <input
                              className="usa-radio__input usa-radio__input--tile"
                              id="parentA.shared"
                              type="radio"
                              value="shared"
                              {...register('parentA.custodyArrangement')}
                            />
                            <label className="usa-radio__label" htmlFor="parentA.shared">
                              <strong>Shared Custody</strong>
                              <span className="usa-checkbox__label-description">
                                Near 50/50 custody (alternating weeks or 2-2-3 schedule) = 146
                                overnights per year.
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="tablet:grid-col-12">
                          <div className="usa-radio">
                            <input
                              className="usa-radio__input usa-radio__input--tile"
                              id="parentA.custom"
                              type="radio"
                              value="custom"
                              {...register('parentA.custodyArrangement')}
                            />
                            <label className="usa-radio__label" htmlFor="parentA.custom">
                              <strong>Custom Overnights</strong>
                              <span className="usa-checkbox__label-description">
                                Enter exact number of overnight visits per year (0–365 days).
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>

                  {/* Custom overnights input for Parent A - only show when custom is selected */}
                  {watch('parentA.custodyArrangement') === 'custom' && (
                    <div className="usa-form-group margin-left-2">
                      <label className="usa-label" htmlFor="parentA.customOvernights">
                        Custom Annual Overnight Visits
                      </label>
                      <input
                        className="usa-input"
                        id="parentA.customOvernights"
                        type="number"
                        min="0"
                        max="365"
                        {...register('parentA.customOvernights', {
                          min: { value: 0, message: 'Cannot be negative' },
                          max: { value: 365, message: 'Cannot exceed 365 days' },
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Parent B */}
            <div className="tablet:grid-col-6">
              <div className="usa-card">
                <div className="usa-card__body">
                  <h3 className="usa-card__heading">Parent B</h3>

                  <div className="usa-form-group">
                    <label className="usa-label" htmlFor="parentB.name">
                      Name (Optional)
                    </label>
                    <input
                      className="usa-input"
                      id="parentB.name"
                      type="text"
                      placeholder="Enter parent name"
                      {...register('parentB.name')}
                    />
                  </div>

                  <div className="usa-form-group">
                    <label className="usa-label" htmlFor="parentB.grossMonthly">
                      Gross Monthly Income *
                    </label>
                    <div className="usa-hint margin-bottom-1">
                      Total monthly income before deductions
                    </div>
                    <input
                      className={`usa-input ${errors.parentB?.grossMonthly ? 'usa-input--error' : ''}`}
                      id="parentB.grossMonthly"
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('parentB.grossMonthly', {
                        required: 'Gross monthly income is required',
                        min: { value: 0, message: 'Income cannot be negative' },
                        valueAsNumber: true,
                      })}
                    />
                    {errors.parentB?.grossMonthly && (
                      <span className="usa-error-message" role="alert">
                        {errors.parentB.grossMonthly.message}
                      </span>
                    )}
                  </div>

                  <div className="usa-form-group">
                    <label className="usa-label" htmlFor="parentB.selfEmploymentTax">
                      Self-Employment Tax Deduction
                    </label>
                    <input
                      className="usa-input"
                      id="parentB.selfEmploymentTax"
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('parentB.selfEmploymentTax', {
                        min: { value: 0, message: 'Deduction cannot be negative' },
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <div className="usa-form-group">
                    <label className="usa-label" htmlFor="parentB.preexistingSupport">
                      Preexisting Child Support
                    </label>
                    <input
                      className="usa-input"
                      id="parentB.preexistingSupport"
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('parentB.preexistingSupport', {
                        min: { value: 0, message: 'Support amount cannot be negative' },
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <div className="usa-form-group">
                    <fieldset className="usa-fieldset">
                      <legend className="usa-legend">Custody & Visitation Arrangement</legend>
                      <div className="grid-row grid-gap">
                        <div className="tablet:grid-col-12">
                          <div className="usa-radio">
                            <input
                              className="usa-radio__input usa-radio__input--tile"
                              id="parentB.custodial"
                              type="radio"
                              value="custodial"
                              {...register('parentB.custodyArrangement')}
                            />
                            <label className="usa-radio__label" htmlFor="parentB.custodial">
                              <strong>Custodial Parent</strong>
                              <span className="usa-checkbox__label-description">
                                Primary physical custody of the children. The other parent will have
                                visitation rights.
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="tablet:grid-col-12">
                          <div className="usa-radio">
                            <input
                              className="usa-radio__input usa-radio__input--tile"
                              id="parentB.no-visitation"
                              type="radio"
                              value="no-visitation"
                              {...register('parentB.custodyArrangement')}
                            />
                            <label className="usa-radio__label" htmlFor="parentB.no-visitation">
                              <strong>No Visitation</strong>
                              <span className="usa-checkbox__label-description">
                                Noncustodial parent has no overnight visits with the children.
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="tablet:grid-col-12">
                          <div className="usa-radio">
                            <input
                              className="usa-radio__input usa-radio__input--tile"
                              id="parentB.minimal"
                              type="radio"
                              value="minimal"
                              {...register('parentB.custodyArrangement')}
                            />
                            <label className="usa-radio__label" htmlFor="parentB.minimal">
                              <strong>Minimal Parenting Time</strong>
                              <span className="usa-checkbox__label-description">
                                Every other weekend (Friday–Sunday, ~2 days every 2 weeks) = 52
                                overnights per year.
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="tablet:grid-col-12">
                          <div className="usa-radio">
                            <input
                              className="usa-radio__input usa-radio__input--tile"
                              id="parentB.standard"
                              type="radio"
                              value="standard"
                              {...register('parentB.custodyArrangement')}
                            />
                            <label className="usa-radio__label" htmlFor="parentB.standard">
                              <strong>Standard Parenting Time</strong>
                              <span className="usa-checkbox__label-description">
                                Every other weekend + 2 weeks in summer + holidays = 80 overnights
                                per year.
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="tablet:grid-col-12">
                          <div className="usa-radio">
                            <input
                              className="usa-radio__input usa-radio__input--tile"
                              id="parentB.extended"
                              type="radio"
                              value="extended"
                              {...register('parentB.custodyArrangement')}
                            />
                            <label className="usa-radio__label" htmlFor="parentB.extended">
                              <strong>Extended Parenting Time</strong>
                              <span className="usa-checkbox__label-description">
                                Every other weekend + one weekday per week + 4 weeks in summer = 110
                                overnights per year.
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="tablet:grid-col-12">
                          <div className="usa-radio">
                            <input
                              className="usa-radio__input usa-radio__input--tile"
                              id="parentB.shared"
                              type="radio"
                              value="shared"
                              {...register('parentB.custodyArrangement')}
                            />
                            <label className="usa-radio__label" htmlFor="parentB.shared">
                              <strong>Shared Custody</strong>
                              <span className="usa-checkbox__label-description">
                                Near 50/50 custody (alternating weeks or 2-2-3 schedule) = 146
                                overnights per year.
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="tablet:grid-col-12">
                          <div className="usa-radio">
                            <input
                              className="usa-radio__input usa-radio__input--tile"
                              id="parentB.custom"
                              type="radio"
                              value="custom"
                              {...register('parentB.custodyArrangement')}
                            />
                            <label className="usa-radio__label" htmlFor="parentB.custom">
                              <strong>Custom Overnights</strong>
                              <span className="usa-checkbox__label-description">
                                Enter exact number of overnight visits per year (0–365 days).
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>

                  {/* Custom overnights input for Parent B - only show when custom is selected */}
                  {watch('parentB.custodyArrangement') === 'custom' && (
                    <div className="usa-form-group margin-left-2">
                      <label className="usa-label" htmlFor="parentB.customOvernights">
                        Custom Annual Overnight Visits
                      </label>
                      <input
                        className="usa-input"
                        id="parentB.customOvernights"
                        type="number"
                        min="0"
                        max="365"
                        {...register('parentB.customOvernights', {
                          min: { value: 0, message: 'Cannot be negative' },
                          max: { value: 365, message: 'Cannot exceed 365 days' },
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Automatic Income-Based Adjustments Alert */}
        {combinedIncome > 0 && (
          <div className="margin-bottom-5">
            <div className="usa-alert usa-alert--info usa-alert--slim">
              <div className="usa-alert__body">
                <h3 className="usa-alert__heading">
                  <svg aria-hidden="true" className="usa-icon" focusable="false" role="img">
                    <use xlinkHref="#info-circle" />
                  </svg>
                  Automatic Income-Based Adjustments
                </h3>
                <div className="usa-alert__text">
                  <p className="margin-bottom-1">
                    <strong>Combined Monthly Income:</strong> ${combinedIncome.toLocaleString()}
                  </p>
                  {getIncomeStatus(combinedIncome).veryLowIncome && (
                    <p className="margin-bottom-1" style={{ color: '#e41b3a' }}>
                      <strong>Very Low Income Notice:</strong> Combined income below $800 minimum
                      threshold. Using minimum bracket calculation per Georgia guidelines.
                    </p>
                  )}
                  {getIncomeStatus(combinedIncome).lowIncome && (
                    <p className="margin-bottom-1" style={{ color: '#2e8540' }}>
                      <strong>Low-Income Adjustment Applied:</strong> Combined income
                      ($1,550-$3,950) qualifies for automatic reduction under Georgia guidelines.
                    </p>
                  )}
                  {getIncomeStatus(combinedIncome).highIncome && (
                    <p className="margin-bottom-1" style={{ color: '#e49300' }}>
                      <strong>High-Income Adjustment Applied:</strong> Combined income &gt;$40,000
                      qualifies for automatic adjustment under Georgia guidelines.
                    </p>
                  )}
                  {getIncomeStatus(combinedIncome).noAdjustments && (
                    <p className="margin-bottom-1">
                      No automatic income-based adjustments apply to this income level.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Child Information Section */}
        <div className="margin-bottom-5">
          <h2 className="margin-bottom-3">Child Information</h2>
          <div className="usa-card">
            <div className="usa-card__body">
              <div className="usa-form-group">
                <label className="usa-label" htmlFor="children.numberOfChildren">
                  Number of Children *
                </label>
                <div className="usa-hint margin-bottom-1">
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
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="margin-bottom-5">
          <h2 className="margin-bottom-3">Child-Related Expenses</h2>
          <div className="usa-card">
            <div className="usa-card__body">
              <div className="grid-row grid-gap">
                <div className="tablet:grid-col-6">
                  <div className="usa-form-group">
                    <label className="usa-label" htmlFor="expenses.healthInsurance">
                      Monthly Health Insurance Premium
                    </label>
                    <div className="usa-hint margin-bottom-1">
                      Cost of health insurance covering the children
                    </div>
                    <div className="usa-input-group">
                      <div className="usa-input-prefix" aria-hidden="true">
                        <span className="usa-input-prefix__text">$</span>
                      </div>
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
                </div>

                <div className="tablet:grid-col-6">
                  <div className="usa-form-group">
                    <label className="usa-label" htmlFor="expenses.childCare">
                      Monthly Child Care Costs
                    </label>
                    <div className="usa-hint margin-bottom-1">Work-related child care expenses</div>
                    <div className="usa-input-group">
                      <div className="usa-input-prefix" aria-hidden="true">
                        <span className="usa-input-prefix__text">$</span>
                      </div>
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Factors Section */}
        <div className="margin-bottom-5">
          <h2 className="margin-bottom-3">Additional Factors</h2>
          <div className="usa-card">
            <div className="usa-card__body">
              <div className="usa-form-group">
                <label className="usa-label" htmlFor="deviations.otherAdjustment">
                  Other Adjustments
                </label>
                <div className="usa-hint margin-bottom-1">
                  Court-approved deviations from presumptive amount
                </div>
                <div className="usa-input-group">
                  <input
                    className={`usa-input ${errors.deviations?.otherAdjustment ? 'usa-input--error' : ''}`}
                    id="deviations.otherAdjustment"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('deviations.otherAdjustment', {
                      min: { value: -100, message: 'Cannot reduce by more than 100%' },
                      max: { value: 1000, message: 'Cannot increase by more than 1000%' },
                      valueAsNumber: true,
                    })}
                  />
                  <div className="usa-input-suffix" aria-hidden="true">
                    <span className="usa-input-suffix__text">%</span>
                  </div>
                </div>
                {errors.deviations?.otherAdjustment && (
                  <span className="usa-error-message" role="alert">
                    {errors.deviations.otherAdjustment.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center margin-bottom-5">
          <button type="submit" className="usa-button usa-button--primary" disabled={isCalculating}>
            {isCalculating ? 'Calculating...' : 'Calculate Child Support'}
          </button>
        </div>
      </form>

      <Disclaimer className="margin-top-4" />
    </div>
  );
};

export default SinglePageCalculator;
