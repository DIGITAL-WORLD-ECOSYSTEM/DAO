import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function AnalyticsAIInsights() {
  const theme = useTheme();

  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            }}
          >
            <Iconify icon={'solar:magic-stick-bold-duotone' as any} width={24} />
          </Box>
          <Typography variant="h6">Insights Financeiros</Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon={'eva:flash-fill' as any} />}
        >
          Analyze Patterns
        </Button>
      </Box>

      <Box
        sx={{
          py: 8,
          px: 3,
          borderRadius: 2,
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          border: (t) => `dashed 1px ${t.palette.divider}`,
          bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
        }}
      >
        <Iconify
          icon={'solar:mask-hiding-linear' as any}
          width={48}
          sx={{ mb: 2, color: 'text.disabled', opacity: 0.48 }}
        />
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360 }}>
          Click the button above to generate AI-powered insights from your transaction history.
        </Typography>
      </Box>
    </Card>
  );
}
