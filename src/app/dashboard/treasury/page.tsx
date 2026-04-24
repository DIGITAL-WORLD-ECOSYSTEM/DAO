'use client';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

import { Iconify, type IconifyName } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function TreasuryPage() {
  const theme = useTheme();

  const metrics: { label: string; value: string; icon: IconifyName; color: string }[] = [
    { label: 'Total Value Locked (TVL)', value: '$0.00', icon: 'solar:bill-list-bold', color: 'primary.main' },
    { label: 'Ativos RWA', value: '0', icon: 'solar:file-text-bold', color: 'info.main' },
    { label: 'Fluxo Mensal', value: '$0.00', icon: 'solar:restart-bold', color: 'success.main' },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 5 }}>
      <Stack spacing={1} sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontFamily: 'var(--font-orbitron)', fontWeight: 800 }}>
          Tesouraria & RWA
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Gestão transparente de fundos e ativos reais tokenizados da ASPPIBRA.
        </Typography>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {metrics.map((item) => (
          <Grid key={item.label} size={{ xs: 12, md: 4 }}>
            <Stack
              spacing={2}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Iconify
                icon={item.icon}
                sx={{ width: 48, height: 48, color: item.color, opacity: 0.8 }}
              />
              <Stack spacing={0.5}>
                <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                  {item.label}
                </Typography>
                <Typography variant="h4" sx={{ fontFamily: 'var(--font-orbitron)' }}>
                  {item.value}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        ))}
      </Grid>

      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          py: 15,
          borderRadius: 2,
          border: `1px dashed ${alpha(theme.palette.divider, 0.5)}`,
          bgcolor: alpha(theme.palette.info.main, 0.02),
        }}
      >
        <Iconify
          icon="solar:danger-bold"
          sx={{ width: 64, height: 64, color: 'info.main', mb: 2 }}
        />
        <Typography variant="h5" sx={{ mb: 1 }}>
          Aguardando Ativos on-chain
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          As métricas da tesouraria serão ativadas após o deploy do contrato de Vault.
        </Typography>
      </Stack>
    </Container>
  );
}
