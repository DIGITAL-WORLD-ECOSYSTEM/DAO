
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ==============================
// CONFIGURAÇÃO DOS ÍCONES (PLACEHOLDERS)
// ==============================

type OrbitIcon = {
  id: string;
  icon: string;
  cx: number;
  cy: number;
  size: number;
  color?: string;
};

// SUBSTITUA os ícones abaixo pelas tecnologias reais do seu projeto.
const ORBIT_1_ICONS: OrbitIcon[] = [
  { id: 'tech1', icon: 'logos:react', cx: -180, cy: -60, size: 32 },
  { id: 'tech2', icon: 'logos:aws', cx: 180, cy: -60, size: 32 },
  { id: 'tech3', icon: 'logos:nodejs-icon', cx: -100, cy: 160, size: 32 },
  { id: 'tech4', icon: 'logos:python', cx: 100, cy: 160, size: 32 },
];

const ORBIT_2_ICONS: OrbitIcon[] = [
  { id: 'tech5', icon: 'logos:vue', cx: 0, cy: -120, size: 28 },
  { id: 'tech6', icon: 'logos:docker-icon', cx: 0, cy: 120, size: 28 },
  { id: 'tech7', icon: 'logos:typescript-icon', cx: -130, cy: 0, size: 28 },
  { id: 'tech8', icon: 'simple-icons:ethereum', cx: 130, cy: 0, size: 28, color: '#627EEA' },
];

// ==============================
// COMPONENTES AUXILIARES SVG
// ==============================

const TechBubble = ({ cx, cy, children }: any) => {
  const theme = useTheme();
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <circle r={30} fill={theme.palette.background.paper} filter="url(#glow)" opacity={0.5} />
      <circle r={25} fill={theme.palette.background.paper} />
      <foreignObject x={-15} y={-15} width={30} height={30}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          {children}
        </Box>
      </foreignObject>
    </g>
  );
};

const DataParticle = ({ startX, startY, delay = 0 }: any) => {
  const theme = useTheme();
  return (
    <m.circle
      r={3}
      fill={theme.palette.primary.main}
      initial={{ opacity: 0, cx: startX, cy: startY }}
      animate={{
        opacity: [0, 1, 1, 0],
        cx: [startX, startX * 0.8, 0],
        cy: [startY, startY * 0.8, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
        repeatDelay: 1,
      }}
      style={{ filter: 'url(#glow-particle)' }}
    />
  );
};

// ==============================
// COMPONENTE PRINCIPAL
// ==============================

export function IntegrationsDiagram() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const gridColor = isLight ? theme.palette.grey[300] : theme.palette.grey[700];
  const centerColor = theme.palette.primary.main;

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 600,
        aspectRatio: '1/1',
        margin: 'auto',
        position: 'relative',
      }}
    >
      <svg
        viewBox="-250 -250 500 500"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-particle" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g stroke={gridColor} strokeWidth={1} strokeDasharray="4 4" fill="none" opacity={0.6}>
          <circle r={80} />
          <circle r={130} />
          <circle r={190} />
          {[...ORBIT_1_ICONS, ...ORBIT_2_ICONS].map((item) => (
            <line key={`line-${item.id}`} x1={0} y1={0} x2={item.cx} y2={item.cy} />
          ))}
        </g>

        {[...ORBIT_1_ICONS, ...ORBIT_2_ICONS].map((item, index) => (
          <DataParticle
            key={`particle-${item.id}`}
            startX={item.cx}
            startY={item.cy}
            delay={index * 0.3}
          />
        ))}

        <g filter="url(#glow)">
          <m.path
            d="M0 -45 L39 -22.5 L39 22.5 L0 45 L-39 22.5 L-39 -22.5 Z"
            fill={theme.palette.background.paper}
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          />
          <foreignObject x="-20" y="-20" width="40" height="40">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: centerColor,
              }}
            >
              <Iconify icon="solar:atom-bold-duotone" width={32} />
            </Box>
          </foreignObject>
        </g>

        <m.g animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}>
          {ORBIT_1_ICONS.map((item) => (
            <m.g
              key={item.id}
              animate={{ rotate: -360 }}
              transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            >
              <TechBubble cx={item.cx} cy={item.cy}>
                <Iconify icon={item.icon as any} width={item.size} sx={{ ...(item.color && { color: item.color }) }} />
              </TechBubble>
            </m.g>
          ))}
        </m.g>

        <m.g
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        >
          {ORBIT_2_ICONS.map((item) => (
            <m.g
              key={item.id}
              animate={{ rotate: 360 }}
              transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            >
              <TechBubble cx={item.cx} cy={item.cy}>
                 <Iconify icon={item.icon as any} width={item.size} sx={{ ...(item.color && { color: item.color }) }} />
              </TechBubble>
            </m.g>
          ))}
        </m.g>
      </svg>
    </Box>
  );
}
