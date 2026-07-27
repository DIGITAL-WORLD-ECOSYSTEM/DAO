import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { useBankAccount } from '../hooks';
import { AccountAssets, AccountActions, AccountSummary, AccountSelector } from '../components';

// ----------------------------------------------------------------------

export function ContaView() {
  const { accounts, isLoading } = useBankAccount();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [hideBalances, setHideBalances] = useState(false);

  // Initialize selected account ID once accounts are loaded
  if (!selectedAccountId && accounts.length > 0) {
    setSelectedAccountId(accounts[0].id);
  }

  const selectedAccount =
    accounts.find((acc) => acc.id === selectedAccountId) || accounts[0];

  // Calculate Consolidated Patrimonio in BRL
  const totalPatrimonio = accounts.reduce(
    (acc, account) => acc + account.balances.reduce((sum, bal) => sum + bal.fiatValue, 0),
    0
  );

  const handleExportData = () => {
    // Mock export action
    console.log('Exporting banking data as PDF...');
    alert('Os dados de recebimento foram exportados para PDF.');
  };

  if (isLoading) {
    return (
      <DashboardContent maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </DashboardContent>
    );
  }

  if (!selectedAccount) return null;

  return (
    <DashboardContent maxWidth="xl">
      <Box
        sx={{
          mb: { xs: 3, md: 5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4">Saldos & Custódia</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={hideBalances ? 'Mostrar Saldos' : 'Ocultar Saldos'}>
            <IconButton onClick={() => setHideBalances(!hideBalances)} color="default">
              <Iconify icon={hideBalances ? 'solar:eye-closed-bold' : 'solar:eye-bold'} />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon={'solar:document-bold' as any} />}
            onClick={handleExportData}
          >
            Exportar Dados
          </Button>
        </Box>
      </Box>

      {/* KPI Global Consolidation */}
      <Card
        sx={{ mb: 4, p: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Patrimônio Consolidado Global (BRL)
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h3">
              {hideBalances ? 'R$ •••••' : fCurrency(totalPatrimonio)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <Iconify icon={'solar:clock-circle-linear' as any} width={16} />
            Atualizado em: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3,
        }}
      >
        {/* Left Column: Selector & Identity */}
        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: 3, gridColumn: { md: 'span 1' } }}
        >
          <AccountSelector
            accounts={accounts}
            selectedId={selectedAccountId || ''}
            onChange={(id) => setSelectedAccountId(id)}
          />
          <AccountSummary account={selectedAccount} hideSensitive={hideBalances} />
          <AccountActions account={selectedAccount} />
        </Box>

        {/* Right Column: Sub-Ledger (Assets) */}
        <Box sx={{ gridColumn: { md: 'span 2' } }}>
          <AccountAssets account={selectedAccount} hideBalances={hideBalances} />
        </Box>
      </Box>
    </DashboardContent>
  );
}
