import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type EventItem = {
  id: string;
  title: string;
  date: Date;
  type: 'assembly' | 'webinar' | 'training';
};

const _mockEvents: EventItem[] = [
  {
    id: 'ev-1',
    title: 'Assembleia Geral',
    date: new Date(Date.now() + 86400000 * 2),
    type: 'assembly',
  },
  {
    id: 'ev-2',
    title: 'Webinar de Governança',
    date: new Date(Date.now() + 86400000 * 5),
    type: 'webinar',
  },
  {
    id: 'ev-3',
    title: 'Treinamento de Embaixadores',
    date: new Date(Date.now() + 86400000 * 12),
    type: 'training',
  },
];

export function AppUpcomingEvents({ ...other }) {
  return (
    <Card {...other}>
      <CardHeader title="Próximos Eventos" sx={{ mb: 2 }} />

      <Stack spacing={2} sx={{ p: 3, pt: 0 }}>
        {_mockEvents.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1.5,
              borderRadius: 1.5,
              border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                flexShrink: 0,
                display: 'flex',
                borderRadius: 1,
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.neutral',
                mr: 2,
              }}
            >
              <Iconify
                icon={'solar:calendar-bold-duotone' as any}
                width={24}
                sx={{ color: 'text.secondary' }}
              />
            </Box>

            <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">{item.title}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {fDate(item.date)}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
