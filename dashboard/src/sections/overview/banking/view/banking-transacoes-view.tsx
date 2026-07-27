import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BankingExportHub } from '../banking-export-hub';
import { BankingTransacoesKpis } from '../banking-transacoes-kpis';
import { BankingTransacoesTable } from '../banking-transacoes-table';
import { BankingTransacoesDrawer } from '../banking-transacoes-drawer';
import { BankingTransacoesFilters } from '../banking-transacoes-filters';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'ledger',
    label: 'Livro-Razão',
    icon: <Iconify icon={'solar:document-text-bold' as any} width={24} />,
  },
  {
    value: 'audit',
    label: 'Audit Viewer',
    icon: <Iconify icon={'solar:shield-check-bold' as any} width={24} />,
  },
];

// ----------------------------------------------------------------------

const MOCK_ASSETS = [
  {
    currency: 'BRL',
    inbound: 450000.5,
    outbound: 120000.0,
    fees: 1500.25,
    color: 'success',
    icon: 'solar:wad-of-money-bold',
  },
  {
    currency: 'USD',
    inbound: 85000.0,
    outbound: 45000.0,
    fees: 350.0,
    color: 'info',
    icon: 'solar:dollar-bold',
  },
  {
    currency: 'USDT',
    inbound: 150000.0,
    outbound: 20000.0,
    fees: 15.0,
    color: 'warning',
    icon: 'solar:tag-price-bold',
  },
];

export function BankingTransacoesView() {
  const theme = useTheme();

  const [currentTab, setCurrentTab] = useState('ledger');
  const [isLoadingKpis, setIsLoadingKpis] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleExport = (format: string) => {
    console.info(`Export triggered for format: ${format}`);
    // Here we would push this event to the Audit Event Viewer
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: { xs: 3, md: 5 },
        }}
      >
        <CustomBreadcrumbs
          heading="Extrato e Auditoria"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Bancário', href: paths.dashboard.general.banking.root },
            { name: 'Transações (Ledger)' },
          ]}
          sx={{ mb: 0 }}
        />
        <BankingExportHub onExport={handleExport} />
      </Box>

      <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            iconPosition="end"
            value={tab.value}
            label={tab.label}
            icon={tab.icon}
          />
        ))}
      </Tabs>

      {currentTab === 'ledger' && (
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
          <BankingTransacoesKpis data={MOCK_ASSETS} isLoading={isLoadingKpis} />

          <BankingTransacoesFilters />

          <BankingTransacoesTable onRowClick={setSelectedTransactionId} />
        </Box>
      )}

      {currentTab === 'audit' && (
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            O Audit Event Viewer gravará os eventos de exportação e acessos a dados sensíveis (LGPD)
            aqui em breve.
          </Typography>
        </Box>
      )}

      <BankingTransacoesDrawer
        open={Boolean(selectedTransactionId)}
        onClose={() => setSelectedTransactionId(null)}
        transactionId={selectedTransactionId}
      />
    </DashboardContent>
  );
}
