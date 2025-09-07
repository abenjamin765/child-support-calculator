import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import IncomeInput from '../Wizard/IncomeInput';
import ChildDetails from '../Wizard/ChildDetails';
import ExpensesInput from '../Wizard/ExpensesInput';
import ParentingTime from '../Wizard/ParentingTime';
import Deviations from '../Wizard/Deviations';
import type { WizardFormData } from '../../types/wizard';

// Wrapper component to provide form context for testing
const FormWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const methods = useForm<WizardFormData>();
  return <FormProvider {...methods} children={children} />;
};

describe('Wizard Components', () => {
  describe('IncomeInput', () => {
    it('renders Parent A income input fields', () => {
      render(
        <FormWrapper>
          <IncomeInput parentLabel="Parent A" parentKey="parentA" />
        </FormWrapper>
      );

      expect(screen.getByText('Parent A Income Information')).toBeInTheDocument();
      expect(screen.getByLabelText(/Gross Monthly Income/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Self-Employment Tax Deduction/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Preexisting Child Support/)).toBeInTheDocument();
    });

    it('renders Parent B income input fields', () => {
      render(
        <FormWrapper>
          <IncomeInput parentLabel="Parent B" parentKey="parentB" />
        </FormWrapper>
      );

      expect(screen.getByText('Parent B Income Information')).toBeInTheDocument();
    });
  });

  describe('ChildDetails', () => {
    it('renders child details form', () => {
      render(
        <FormWrapper>
          <ChildDetails />
        </FormWrapper>
      );

      expect(screen.getByText('Child Information')).toBeInTheDocument();
      expect(screen.getByLabelText(/Number of Children/)).toBeInTheDocument();
      expect(screen.getByText(/Count all children under 18/)).toBeInTheDocument();
    });
  });

  describe('ExpensesInput', () => {
    it('renders expenses input form', () => {
      render(
        <FormWrapper>
          <ExpensesInput />
        </FormWrapper>
      );

      expect(screen.getByText('Child-Related Expenses')).toBeInTheDocument();
      expect(screen.getByLabelText(/Monthly Health Insurance Premium/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Monthly Child Care Costs/)).toBeInTheDocument();
    });
  });

  describe('ParentingTime', () => {
    it('renders parenting time form', () => {
      render(
        <FormWrapper>
          <ParentingTime />
        </FormWrapper>
      );

      expect(screen.getByText('Parenting Time')).toBeInTheDocument();
      expect(screen.getByLabelText(/Annual Overnight Visits/)).toBeInTheDocument();
      expect(screen.getByText(/Parenting time adjustments become mandatory/)).toBeInTheDocument();
    });
  });

  describe('Deviations', () => {
    it('renders deviations form', () => {
      render(
        <FormWrapper>
          <Deviations />
        </FormWrapper>
      );

      expect(screen.getByText('Deviations from Presumptive Amount')).toBeInTheDocument();
      expect(screen.getByLabelText(/Apply low-income sliding scale/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Apply high-income adjustment/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Other Adjustments/)).toBeInTheDocument();
    });
  });
});
