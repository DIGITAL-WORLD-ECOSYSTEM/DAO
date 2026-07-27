import type { BoxProps } from '@mui/material/Box';

export type GlassCardProps = BoxProps & {
  gradientColor?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  borderOpacity?: number;
  blur?: number;
};
