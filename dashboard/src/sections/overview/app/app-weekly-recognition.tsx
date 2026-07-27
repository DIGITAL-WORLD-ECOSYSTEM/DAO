import type { RecognitionItem } from 'src/types/home';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  list: RecognitionItem[];
};

export function AppWeeklyRecognition({ list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title="Reconhecimentos da Semana" sx={{ mb: 2 }} />

      <Stack spacing={3} sx={{ p: 3, pt: 0 }}>
        {list.map((item) => (
          <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar src={item.avatarUrl} alt={item.name} sx={{ width: 48, height: 48 }} />
              <Box
                sx={{
                  right: -4,
                  bottom: -4,
                  position: 'absolute',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify icon={item.badgeIcon as any} width={16} sx={{ color: 'warning.main' }} />
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">{item.name}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {item.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
