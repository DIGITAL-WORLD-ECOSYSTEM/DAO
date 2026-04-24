'use client';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function GovernancePage() {
  const theme = useTheme();

  return (
    <Container maxWidth="xl" sx={{ mt: 5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Stack spacing={1}>
          <Typography variant="h3" sx={{ fontFamily: 'var(--font-orbitron)', fontWeight: 800 }}>
            Governança DAO
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Participe das decisões estratégicas da ASPPIBRA através do voto on-chain.
          </Typography>
        </Stack>

        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          sx={{
            bgcolor: 'primary.main',
            color: 'common.white',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          Criar Proposta
        </Button>
      </Stack>

      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          py: 20,
          borderRadius: 2,
          border: `1px dashed ${alpha(theme.palette.divider, 0.5)}`,
          bgcolor: alpha(theme.palette.primary.main, 0.02),
        }}
      >
        <Iconify
          icon="solar:danger-triangle-bold"
          sx={{ width: 80, height: 80, color: 'primary.main', mb: 3 }}
        />
        <Typography variant="h4" sx={{ mb: 1, fontFamily: 'var(--font-orbitron)' }}>
          Nenhuma Proposta Ativa
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          O sistema de votação está aguardando a sincronização com o Smart Contract de Governança.
        </Typography>
      </Stack>
    </Container>
  );
}
