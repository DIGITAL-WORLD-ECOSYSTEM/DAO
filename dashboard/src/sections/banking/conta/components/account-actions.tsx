import type { AccountData } from '../types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  account: AccountData;
};

export function AccountActions({ account }: Props) {
  return (
    <Card>
      <CardHeader title="Ações Rápidas" sx={{ mb: 2 }} />
      <Box sx={{ p: 3, pt: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          Atalhos operacionais com origem já pré-selecionada para esta conta.
        </Typography>

        <Button
          component={RouterLink}
          href="/dashboard/banking/receber"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          startIcon={<Iconify icon={'solar:import-bold' as any} />}
        >
          Depositar nesta Conta
        </Button>

        <Button
          component={RouterLink}
          href="/dashboard/banking/transferencias"
          variant="outlined"
          color="inherit"
          size="large"
          fullWidth
          startIcon={<Iconify icon={'solar:export-bold' as any} />}
        >
          Usar para Pagamentos
        </Button>
      </Box>
    </Card>
  );
}
