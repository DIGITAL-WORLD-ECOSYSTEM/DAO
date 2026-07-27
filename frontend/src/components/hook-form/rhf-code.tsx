'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import { Controller, useFormContext } from 'react-hook-form';
import { MuiOtpInput, type MuiOtpInputProps } from 'mui-one-time-password-input';

import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import { inputBaseClasses } from '@mui/material/InputBase';

import { HelperText } from '.';

// ----------------------------------------------------------------------

export type RHFCodeProps = MuiOtpInputProps & {
  name: string;
  helperText?: React.ReactNode;
  sx?: SxProps<Theme>;
};

export default function RHFCode({ name, helperText, sx, ...other }: RHFCodeProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={sx}>
          <MuiOtpInput
            {...field}
            autoFocus
            gap={1.5}
            length={6}
            TextFieldsProps={{
              error: !!error,
              placeholder: '-',
              sx: {
                [`& .${inputBaseClasses.input}`]: {
                  py: 0,
                  height: 56,
                  fontSize: 24,
                  boxSizing: 'border-box',
                  fontVariantNumeric: 'tabular-nums',
                },
              },
            }}
            {...other}
          />

          {(!!error || helperText) && (
            <FormHelperText sx={{ px: 2 }} error={!!error}>
              {error ? error?.message : <HelperText>{helperText}</HelperText>}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
}
