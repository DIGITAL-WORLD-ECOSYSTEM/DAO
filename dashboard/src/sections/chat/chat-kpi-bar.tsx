import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

const STATS = [
  { label: 'Não Lidas', value: '24', icon: 'solar:chat-square-bold', color: 'error.main' },
  { label: 'Online', value: '156', icon: 'solar:users-group-two-rounded-bold', color: 'success.main' },
  { label: 'Tickets', value: '12', icon: 'solar:ticket-bold', color: 'warning.main' },
  { label: 'Ações de IA', value: '45', icon: 'solar:magic-stick-3-bold', color: 'info.main' },
];

export function ChatKpiBar() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: { xs: 2, md: 3 },
        height: { xs: 64, md: 72 },
        borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        bgcolor: 'background.paper',
        flexShrink: 0,
      }}
    >
      <Stack 
        direction="row" 
        spacing={3}
        sx={{ width: 1, overflowX: 'auto', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'space-between' } }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mr: 2, display: { xs: 'none', lg: 'block' } }}>
          Visão Geral
        </Typography>

        <Stack direction="row" spacing={{ xs: 2, md: 4 }} sx={{ alignItems: 'center' }}>
          {STATS.map((stat) => (
            <Stack key={stat.label} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Iconify icon={stat.icon as any} width={24} sx={{ color: stat.color }} />
              <Typography variant="h6">{stat.value}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                {stat.label}
              </Typography>
            </Stack>
          ))}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Iconify icon="solar:phone-bold" width={24} sx={{ color: 'primary.main' }} />
            <Typography variant="h6">8</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
              Chamadas
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
