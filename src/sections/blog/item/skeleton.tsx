'use client';

import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

type PostItemSkeletonProps = BoxProps & {
  itemCount?: number;
  variant?: 'vertical' | 'horizontal';
};

export function PostItemSkeleton({
  sx,
  itemCount = 1, // Geralmente controlado pelo componente pai
  variant = 'vertical',
  ...other
}: PostItemSkeletonProps) {
  
  // Estilo Glassmorphism comum para os skeletons
  const glassStyle = (theme: any) => ({
    display: 'flex',
    borderRadius: 2,
    bgcolor: alpha(theme.palette.grey[900], 0.2), // Transparência estratégica
    backdropFilter: 'blur(10px)',
    border: `solid 1px ${alpha(theme.palette.primary.main, 0.08)}`,
    // Ajuste da cor da animação do pulso para combinar com o tema Space
    '& .MuiSkeleton-root': {
      bgcolor: alpha(theme.palette.common.white, 0.05),
      '&::after': {
        background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.05)}, transparent)`,
      },
    },
  });

  if (variant === 'horizontal') {
    return (
      <>
        {Array.from({ length: itemCount }, (_, index) => (
          <Box
            key={`skeleton-horizontal-${index}`}
            sx={[
              glassStyle,
              ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
          >
            <Box
              sx={{
                p: 3,
                gap: 2,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
                <Skeleton sx={{ width: 40, height: 12 }} />
              </Box>

              <Skeleton sx={{ width: 1, height: 12 }} />
              <Skeleton sx={{ width: `calc(100% - 40px)`, height: 12 }} />
              <Skeleton sx={{ width: `calc(100% - 80px)`, height: 12 }} />
            </Box>

            <Box sx={{ p: 1, display: { xs: 'none', sm: 'block' } }}>
              <Skeleton variant="rectangular" sx={{ width: 170, height: '100%', borderRadius: 1.5 }} />
            </Box>
          </Box>
        ))}
      </>
    );
  }

  return (
    <>
      {Array.from({ length: itemCount }, (_, index) => (
        <Box
          key={`skeleton-vertical-${index}`}
          sx={[
            (theme) => ({
              ...glassStyle(theme),
              flexDirection: 'column',
            }),
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
          {...other}
        >
          <Box sx={{ p: 1 }}>
            <Skeleton variant="rectangular" sx={{ pt: '100%', borderRadius: 1.5 }} />
          </Box>

          <Box
            sx={{
              p: 3,
              pt: 2,
              gap: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Skeleton variant="circular" sx={{ width: 40, height: 40, flexShrink: 0 }} />
            <Box
              sx={{
                gap: 1.5,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Skeleton sx={{ height: 12 }} />
              <Skeleton sx={{ width: 0.5, height: 12 }} />
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
}

// ----------------------------------------------------------------------

export function PostDetailsSkeleton({ sx, ...other }: BoxProps) {
  return (
    <Box 
      sx={[
        {
          bgcolor: 'transparent',
          '& .MuiSkeleton-root': {
            bgcolor: (theme) => alpha(theme.palette.common.white, 0.05),
          }
        },
        ...(Array.isArray(sx) ? sx : [sx])
      ]} 
      {...other}
    >
      <Skeleton variant="rectangular" sx={{ height: 480, borderRadius: 0 }} />

      <Box sx={{ width: 1, maxWidth: 720, mx: 'auto' }}>
        <Box
          sx={{
            my: 8,
            gap: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Skeleton height={14} />
          <Skeleton height={14} sx={{ width: 0.9 }} />
          <Skeleton height={14} sx={{ width: 0.8 }} />
        </Box>
        <Skeleton variant="rectangular" sx={{ height: 720, mb: 8, borderRadius: 2 }} />
      </Box>
    </Box>
  );
}