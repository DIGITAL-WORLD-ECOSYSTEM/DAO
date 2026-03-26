import { useRef } from 'react';
import { useInView, UseInViewOptions } from 'framer-motion';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  minHeight?: number | string;
  margin?: any;
};

/**
 * LazyRender (Padrão 2026 para Performance)
 * Força o Next.js a reter o download de Chunks pesados (como ThreeJS) 
 * até que o componente se aproxime da *viewport*. Isso evita o engasgo da Main Thread (Lighthouse Timeout) na hidratação inicial.
 */
export function LazyRender({ children, minHeight = 800, margin = '300px 0px' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // once: true significa que uma vez disparado, ele permanece montado.
  // margin: a distância em px antes do scroll atingir efetivamente a seção.
  const isInView = useInView(ref, { once: true, margin });

  return (
    <Box ref={ref} sx={{ minHeight, position: 'relative', width: '100%' }}>
      {isInView && children}
    </Box>
  );
}
