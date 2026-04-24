'use client';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function BountiesPage() {
  const theme = useTheme();

  return (
    <Container maxWidth="xl" sx={{ mt: 5 }}>
      <Stack spacing={1} sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontFamily: 'var(--font-orbitron)', fontWeight: 800 }}>
          Bounties (Recompensas)
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Contribua com a DAO e seja recompensado por suas habilidades.
        </Typography>
      </Stack>

      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          py: 20,
          borderRadius: 2,
          border: `1px dashed ${alpha(theme.palette.divider, 0.5)}`,
          bgcolor: alpha(theme.palette.warning.main, 0.02),
        }}
      >
        <Iconify
          icon="solar:case-minimalistic-bold"
          sx={{ width: 80, height: 80, color: 'warning.main', mb: 3 }}
        />
        <Typography variant="h4" sx={{ mb: 1, fontFamily: 'var(--font-orbitron)' }}>
          Em Breve
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          O programa de recompensas será lançado na Fase 3 do ecossistema ASPPIBRA.
        </Typography>
      </Stack>
    </Container>
  );
}
