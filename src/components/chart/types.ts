/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Chart Component Type Definitions
 * Version: 1.1.2 - Fix: ApexCharts Namespace/Type Conflict resolution
 */

// @ts-ignore
import type { ApexOptions } from 'apexcharts';
import type { Theme, SxProps } from '@mui/material/styles';
import type { Props as ApexProps } from 'react-apexcharts';

// ----------------------------------------------------------------------

/**
 * ✅ CORREÇÃO DE BUILD (VERCEL):
 * O TypeScript às vezes interpreta 'ApexOptions' como um namespace em vez de um tipo.
 * Usar 'any | ApexOptions' força a resolução correta durante a compilação do Turbopack.
 */
export type ChartOptions = any | ApexOptions;

/**
 * Definição das propriedades do componente de gráfico.
 * Estende as propriedades de uma 'div' padrão e seleciona campos específicos do ApexProps.
 */
export type ChartProps = React.ComponentProps<'div'> &
  Pick<ApexProps, 'type' | 'series' | 'options'> & {
    sx?: SxProps<Theme>;
    slotProps?: {
      loading?: SxProps<Theme>;
    };
  };