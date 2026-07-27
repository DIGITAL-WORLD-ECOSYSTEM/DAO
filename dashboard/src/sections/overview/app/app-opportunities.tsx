import type { OpportunityItem } from 'src/types/home';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  list: OpportunityItem[];
};

export function AppOpportunities({ list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title="Oportunidades" sx={{ mb: 2 }} />

      <Stack spacing={2} sx={{ p: 3, pt: 0 }}>
        {list.map((item) => (
          <Box key={item.id} sx={{ display: 'flex', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                flexShrink: 0,
                display: 'flex',
                borderRadius: 1.5,
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.neutral',
                color: item.type === 'grant' ? 'success.main' : 'info.main',
              }}
            >
              <Iconify
                icon={
                  item.type === 'grant'
                    ? 'solar:bill-list-bold-duotone'
                    : ('solar:hand-shake-bold-duotone' as any)
                }
                width={24}
              />
            </Box>

            <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">{item.title}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {item.description}
              </Typography>
              {item.deadline && (
                <Typography
                  variant="caption"
                  sx={{ color: 'error.main', fontWeight: 'fontWeightMedium' }}
                >
                  Encerra {fToNow(item.deadline)}
                </Typography>
              )}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
