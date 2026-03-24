import type { BoxProps } from '@mui/material/Box';
import type { Variants, MotionProps } from 'framer-motion';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

// Infraestrutura e Protocolos auditados para o ecossistema RWA/ASPPIBRA
const PLATFORMS = [
  { name: 'Cloudflare Edge', icon: 'logos:cloudflare' },
  { name: 'Bitcoin Network', icon: 'logos:bitcoin' },
  { name: 'Ethereum', icon: 'logos:ethereum' },
  { name: 'Binance Smart Chain', icon: 'logos:binance' },
  { name: 'IPFS Storage', icon: 'simple-icons:ipfs' },
  { name: 'SQLite D1', icon: 'logos:sqlite' },
  { name: 'React 19', icon: 'logos:react' },
  { name: 'Typescript', icon: 'logos:typescript-icon' },
];

// ----------------------------------------------------------------------

const drawLineX: Variants = {
  hidden: { x2: 0, strokeOpacity: 0 },
  visible: (i: number) => ({
    x2: '100%',
    strokeOpacity: 1,
    transition: {
      strokeOpacity: { delay: 1 + i * 0.5, duration: 0.01 },
      x2: { delay: 1 + i * 0.5, bounce: 0, duration: 1.5 },
    },
  }),
};

const drawLineY: Variants = {
  hidden: { y2: 0, strokeOpacity: 0 },
  visible: (i: number) => ({
    y2: '100%',
    strokeOpacity: 1,
    transition: {
      strokeOpacity: { delay: 1 + i * 0.5, duration: 0.01 },
      y2: { delay: 1 + i * 0.5, bounce: 0, duration: 1.5 },
    },
  }),
};

export function Lines({ strokeCount }: { strokeCount: number }) {
  const translateY = (index: number) =>
    strokeCount / 2 > index
      ? `translateY(calc(((${index} * var(--stroke-spacing)) + var(--stroke-spacing) / 2) * -1))`
      : `translateY(calc(((${strokeCount - (index + 1)} * var(--stroke-spacing)) + var(--stroke-spacing) / 2)))`;

  const translateX = (index: number) =>
    strokeCount / 2 > index
      ? `translateX(calc(((${index} * var(--stroke-spacing)) + var(--stroke-spacing) / 2) * -1))`
      : `translateX(calc(((${strokeCount - (index + 1)} * var(--stroke-spacing)) + var(--stroke-spacing) / 2)))`;

  return (
    <>
      {Array.from({ length: strokeCount }, (_, index) => (
        <m.line
          key={`x-${index}`}
          x1="0"
          x2="100%"
          y1="50%"
          y2="50%"
          custom={index}
          variants={drawLineX}
          style={{
            transform: translateY(index),
            stroke: 'var(--hero-line-stroke-color)',
            strokeDasharray: 'var(--stroke-dasharray)',
            strokeWidth: 'var(--hero-line-stroke-width)',
          }}
        />
      ))}
      {Array.from({ length: strokeCount }, (_, index) => (
        <m.line
          key={`y-${index}`}
          x1="50%"
          x2="50%"
          y1="0%"
          y2="100%"
          custom={index}
          variants={drawLineY}
          style={{
            transform: translateX(index),
            stroke: 'var(--hero-line-stroke-color)',
            strokeDasharray: 'var(--stroke-dasharray)',
            strokeWidth: 'var(--hero-line-stroke-width)',
          }}
        />
      ))}
    </>
  );
}

// ----------------------------------------------------------------------

export function Texts({ sx, ...other }: BoxProps & MotionProps) {
  const theme = useTheme();

  return (
    <Box
      component={m.div}
      variants={varFade('in')}
      sx={[
        {
          left: 0,
          width: 1,
          bottom: 24,
          position: 'absolute',
          zIndex: 9,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          overflow: 'hidden',
          display: 'flex',
          userSelect: 'none',
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        }}
      >
        <m.div
          animate={{ x: [0, -2000] }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', gap: '100px', paddingRight: '100px' }}
        >
          {[...PLATFORMS, ...PLATFORMS, ...PLATFORMS].map((platform, index) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{
                opacity: 0.4,
                filter: 'grayscale(1)',
                transition: theme.transitions.create(['all']),
                '&:hover': { 
                  filter: 'grayscale(0)', 
                  opacity: 1, 
                  color: 'primary.main',
                  transform: 'scale(1.1)' 
                },
              }}
            >
              <Iconify icon={platform.icon as any} width={40} />
              <Typography variant="h6" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                {platform.name}
              </Typography>
            </Stack>
          ))}
        </m.div>
      </Box>
    </Box>
  );
}