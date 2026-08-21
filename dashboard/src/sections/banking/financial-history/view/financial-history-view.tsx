// import type { IFinancialProfile } from '../mock-financial-profile';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetCitizenLedger } from 'src/actions/treasury';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { AssociateSearchCard } from '../components/associate-search-card';
import { BLANK_FINANCIAL_PROFILE } from '../utils/mock-financial-profile';
import { FinancialHistoryPrint } from '../components/financial-history-print';
import { FinancialSummaryHeader } from '../components/financial-summary-header';
import { FinancialTransactionsTable } from '../components/financial-transactions-table';

// ----------------------------------------------------------------------

export function FinancialHistoryView() {
  const [selectedYear, setSelectedYear] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCitizenId, setSelectedCitizenId] = useState<string | null>(null);
  
  const { profile, profileLoading } = useGetCitizenLedger(selectedCitizenId);

  const handleSelectProfile = (id: string | null) => {
    setSelectedCitizenId(id);
  };

  const profileToRender = profile || BLANK_FINANCIAL_PROFILE;

  const transactionYears = Array.from<string>(
    new Set(
      profileToRender.transactions.map((tx: any) => 
        new Date(tx.created_at).getFullYear().toString()
      )
    )
  ).sort((a: string, b: string) => b.localeCompare(a));

  const availableYears = transactionYears.length > 0 ? ['Todos', ...transactionYears] : ['Todos'];

  const dataFiltered = profileToRender.transactions
    .filter((tx: any) => {
      const txYear = tx.created_at ? tx.created_at.substring(0, 4) : '';
      const matchesYear = selectedYear === 'Todos' || txYear === selectedYear;

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        tx.counterparty_name?.toLowerCase().includes(searchLower) ||
        tx.origin_institution?.toLowerCase().includes(searchLower) ||
        tx.destination_institution?.toLowerCase().includes(searchLower) ||
        tx.category?.toLowerCase().includes(searchLower) ||
        tx.payment_method?.toLowerCase().includes(searchLower);

      return matchesYear && matchesSearch;
    })
    .sort((a: any, b: any) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return timeA - timeB;
    });

  return (
    <>
      <Box sx={{ '@media print': { display: 'none' } }}>
        <DashboardContent maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 5 }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="soft"
                color="primary"
                startIcon={<Iconify icon={'solar:share-bold-duotone' as any} />}
                onClick={() => {
                  const url = `${window.location.origin}/share/analytics`;
                  navigator.clipboard.writeText(url);
                  toast.success('Link público copiado para a área de transferência!');
                }}
                sx={{ borderRadius: 1.5 }}
                disabled={!profile}
              >
                Compartilhar
              </Button>

              <Button
                variant="contained"
                color="inherit"
                startIcon={<Iconify icon={'eva:file-text-fill' as any} />}
                onClick={() => window.print()}
                sx={{ borderRadius: 1.5 }}
                disabled={!profile}
              >
                Exportar PDF
              </Button>
            </Box>
          </Box>

          <AssociateSearchCard
            selectedAssociateId={selectedCitizenId}
            onSelectAssociate={handleSelectProfile}
            selectedProfile={profile}
          />

          {profileLoading && (
            <Box sx={{ width: '100%', mt: 5 }}>
              <LinearProgress color="primary" />
            </Box>
          )}

          {!profileLoading && (
            <>
              <FinancialSummaryHeader
                years={availableYears as string[]}
                selectedYear={selectedYear}
                onSelectYear={setSelectedYear}
                onSearch={setSearchQuery}
                searchQuery={searchQuery}
                profile={profileToRender}
              />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <FinancialTransactionsTable title="Histórico Financeiro" tableData={dataFiltered} />
                </Grid>
              </Grid>
            </>
          )}
        </DashboardContent>
      </Box>

      {/* Documento de Impressão (Só aparece no @media print) */}
      {profile && (
        <FinancialHistoryPrint transactions={dataFiltered} profile={profileToRender} />
      )}
    </>
  );
}
