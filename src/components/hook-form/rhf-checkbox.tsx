"use client";

import type { CheckboxProps } from '@mui/material/Checkbox';
import type { FormGroupProps } from '@mui/material/FormGroup'; // ✅ Adicionado para tipagem correta
import type { FormHelperTextProps } from '@mui/material/FormHelperText';
import type { FormControlLabelProps } from '@mui/material/FormControlLabel';

import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';

// ----------------------------------------------------------------------

export type RHFCheckboxProps = CheckboxProps & {
  name: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  slotProps?: {
    formControl?: Omit<FormControlLabelProps, 'control' | 'label'>;
    formHelper?: FormHelperTextProps;
  };
};

export function RHFCheckbox({ name, label, helperText, slotProps, ...other }: RHFCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <FormControlLabel
            {...slotProps?.formControl}
            control={<Checkbox {...field} checked={!!field.value} {...other} />}
            label={label}
          />

          {(!!error || helperText) && (
            <FormHelperText {...slotProps?.formHelper} error={!!error}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
}

// ----------------------------------------------------------------------

export type RHFMultiCheckboxProps = CheckboxProps & {
  name: string;
  label?: string;
  helperText?: React.ReactNode;
  options: { value: any; label: string }[];
  slotProps?: {
    formGroup?: FormGroupProps; // ✅ CORREÇÃO: Usando a tipagem correta para o container
    formHelper?: FormHelperTextProps;
    checkbox?: CheckboxProps;
  };
};

export function RHFMultiCheckbox({
  name,
  label,
  options,
  slotProps,
  helperText,
  ...other
}: RHFMultiCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onSelected = (option: any) =>
          field.value.includes(option)
            ? field.value.filter((value: any) => value !== option)
            : [...field.value, option];

        return (
          <Box>
            {label && <FormLabel sx={{ mb: 1, display: 'block' }}>{label}</FormLabel>}

            {/* ✅ CORREÇÃO PARA O BUILD: Limpamos o onError para evitar conflito React 19/MUI */}
            <FormGroup {...slotProps?.formGroup} onError={undefined as any}>
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      {...slotProps?.checkbox}
                      checked={field.value.includes(option.value)}
                      onChange={() => field.onChange(onSelected(option.value))}
                      {...other}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>

            {(!!error || helperText) && (
              <FormHelperText {...slotProps?.formHelper} error={!!error}>
                {error ? error?.message : helperText}
              </FormHelperText>
            )}
          </Box>
        );
      }}
    />
  );
}