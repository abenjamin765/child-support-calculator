import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import type { WizardFormData, WizardStep } from '../../types/wizard';
import { calculateChildSupport } from '../../utils/calculations';
import IncomeInput from './IncomeInput';
import ChildDetails from './ChildDetails';
import ExpensesInput from './ExpensesInput';
import ParentingTime from './ParentingTime';
import Deviations from './Deviations';

const STEPS: WizardStep[] = [
  {
    id: 1,
    title: 'Parent A Income',
    description: 'Enter Parent A\'s income information',
    component: 'incomeA',
    isCompleted: false,
    isActive: true,
  },
  {
    id: 2,
    title: 'Parent B Income',
    description: 'Enter Parent B\'s income information',
    component: 'incomeB',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 3,
    title: 'Child Details',
    description: 'Specify number of children',
    component: 'children',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 4,
    title: 'Expenses',
    description: 'Enter child-related expenses',
    component: 'expenses',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 5,
    title: 'Parenting Time',
    description: 'Annual overnight visits',
    component: 'parenting',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 6,
    title: 'Deviations',
    description: 'Adjustments from presumptive amount',
    component: 'deviations',
    isCompleted: false,
    isActive: false,
  },
];

interface WizardProps {
  onComplete: (result: any) => void;
}

export const Wizard: React.FC<WizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const methods = useForm<WizardFormData>({
    defaultValues: {
      parentA: {
        grossMonthly: 0,
        selfEmploymentTax: 0,
        preexistingSupport: 0,
      },
      parentB: {
        grossMonthly: 0,
        selfEmploymentTax: 0,
        preexistingSupport: 0,
      },
      children: {
        numberOfChildren: 1,
      },
      expenses: {
        healthInsurance: 0,
        childCare: 0,
      },
      parentingTime: {
        annualOvernights: 0,
      },
      deviations: {
        lowIncome: false,
        highIncome: false,
        otherAdjustment: 0,
      },
    },
  });

  const { handleSubmit, trigger } = methods;

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: WizardFormData) => {
    setIsCalculating(true);
    try {
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
          lowIncome: data.deviations.lowIncome,
          highIncome: data.deviations.highIncome,
          parentingTime: data.parentingTime.annualOvernights,
          otherDeviations: data.deviations.otherAdjustment,
        }
      );
      onComplete(result);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <IncomeInput parentLabel="Parent A" parentKey="parentA" />;
      case 1:
        return <IncomeInput parentLabel="Parent B" parentKey="parentB" />;
      case 2:
        return <ChildDetails />;
      case 3:
        return <ExpensesInput />;
      case 4:
        return <ParentingTime />;
      case 5:
        return <Deviations />;
      default:
        return null;
    }
  };

  const currentStepData = STEPS[currentStep];

  return (
    <FormProvider {...methods}>
      <div className="usa-prose">
        <div
          className="usa-step-indicator"
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
        >
          <ol className="usa-step-indicator__segments">
            {STEPS.map((step, index) => (
              <li
                key={step.id}
                className={`usa-step-indicator__segment ${
                  index < currentStep ? 'usa-step-indicator__segment--complete' : ''
                } ${index === currentStep ? 'usa-step-indicator__segment--current' : ''}`}
              >
                <span className="usa-step-indicator__segment-label">{step.title}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="margin-top-4">
          <h2>{currentStepData.title}</h2>
          <p className="usa-intro">{currentStepData.description}</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {renderCurrentStep()}

            <div className="usa-button-group margin-top-4">
              {currentStep > 0 && (
                <button
                  type="button"
                  className="usa-button usa-button--secondary"
                  onClick={handlePrevious}
                >
                  Previous
                </button>
              )}

              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  className="usa-button"
                  onClick={handleNext}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="usa-button"
                  disabled={isCalculating}
                >
                  {isCalculating ? 'Calculating...' : 'Calculate Child Support'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};

export default Wizard;
