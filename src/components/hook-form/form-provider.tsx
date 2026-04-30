'use client';

import type { UseFormReturn } from 'react-hook-form';
import { FormProvider as RHFFormProvider } from 'react-hook-form';

// ----------------------------------------------------------------------

export type FormProps = {
  onSubmit?: () => void;
  children: React.ReactNode;
  methods: UseFormReturn<any>;
};

export function Form({ children, onSubmit, methods }: FormProps) {
  return (
    <RHFFormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate autoComplete="off">
        {children}
      </form>
    </RHFFormProvider>
  );
}
