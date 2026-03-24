"use client";
'use client';

import type { CountrySelectProps } from '../country-select';

import { Controller, useFormContext } from 'react-hook-form';

import { CountrySelect } from '../country-select';

// ----------------------------------------------------------------------

export type RHFCountrySelectProps = CountrySelectProps & {
  name: string;
  helperText?: React.ReactNode;
};

export function RHFCountrySelect({ name, helperText, ...other }: RHFCountrySelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <CountrySelect
          {...field}
          id={`${name}-rhf-country-select`}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}
