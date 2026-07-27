'use client';

import type { GlassCardProps } from './types';

import { GlassCardRoot } from './styles';

// ----------------------------------------------------------------------

/**
 * Componente GlassCard (Assinatura Elite)
 * Centraliza a estética de Glassmorphism e bordas Neon para uso em todo o App.
 */
export function GlassCard({ children, ...other }: GlassCardProps) {
  return (
    <GlassCardRoot {...other}>
      {children}
    </GlassCardRoot>
  );
}
