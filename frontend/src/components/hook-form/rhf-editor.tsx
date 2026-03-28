"use client";
'use client';

import type { EditorProps } from '../editor';

import { Controller, useFormContext } from 'react-hook-form';

import { Editor } from '../editor';

// ----------------------------------------------------------------------

export type RHFEditorProps = EditorProps & {
  name: string;
  helperText?: React.ReactNode;
};

export function RHFEditor({ name, helperText, ...other }: RHFEditorProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Editor
          {...field}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}
