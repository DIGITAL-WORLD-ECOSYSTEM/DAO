"use client";
'use client';

import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import type { TimePickerProps } from '@mui/x-date-pickers/TimePicker';
import type { DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';

import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// ----------------------------------------------------------------------

export type RHFDatePickerProps = DatePickerProps<any> & {
  name: string;
  helperText?: React.ReactNode;
};

export function RHFDatePicker({ name, helperText, ...other }: RHFDatePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          value={dayjs(field.value)}
          onChange={(newValue) => field.onChange(newValue)}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error ? error?.message : helperText,
            },
          }}
          {...other}
        />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export type RHFTimePickerProps = TimePickerProps<any> & {
  name: string;
  helperText?: React.ReactNode;
};

export function RHFTimePicker({ name, helperText, ...other }: RHFTimePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TimePicker
          {...field}
          value={dayjs(field.value)}
          onChange={(newValue) => field.onChange(newValue)}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error ? error?.message : helperText,
            },
          }}
          {...other}
        />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export type RHFDateTimePickerProps = DateTimePickerProps<any> & {
  name: string;
  helperText?: React.ReactNode;
};

export function RHFDateTimePicker({ name, helperText, ...other }: RHFDateTimePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DateTimePicker
          {...field}
          value={dayjs(field.value)}
          onChange={(newValue) => field.onChange(newValue)}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error ? error?.message : helperText,
            },
          }}
          {...other}
        />
      )}
    />
  );
}
