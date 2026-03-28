import { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  minHeight?: number | string;
  margin?: string;
};

/**
 * LazyRender (Padrão 2026 para Performance Zero-TBT)
 * Força o Next.js a reter o download de Chunks pesados (como ThreeJS) 
 * até que o componente se aproxime da *viewport*.
 * 
 * FIX: Utiliza IntersectionObserver nativo. NENHUMA dependência do 'framer-motion', 
 * liberando o TBT e permitindo Code Splitting absoluto pela Engine.
 */
export function LazyRender({ children, minHeight = 800, margin = '300px 0px' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // once: true equivalency
        }
      },
      { rootMargin: margin || '300px 0px' }
    );
    
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [margin]);

  return (
    <Box ref={ref} sx={{ minHeight, position: 'relative', width: '100%' }}>
      {isInView && children}
    </Box>
  );
}
