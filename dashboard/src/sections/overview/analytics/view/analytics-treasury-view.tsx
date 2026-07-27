import { useState } from 'react';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import InputAdornment from '@mui/material/InputAdornment';

import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetTreasuryAnalytics } from 'src/actions/treasury';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { FinancialTransactionsTable } from 'src/sections/banking/financial-history/components/financial-transactions-table';

import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';

// ----------------------------------------------------------------------

export function AnalyticsTreasuryView() {
  const [selectedYear, setSelectedYear] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const { analytics, analyticsLoading } = useGetTreasuryAnalytics(
    selectedYear === 'Todos' ? undefined : selectedYear
  );

  if (analyticsLoading) {
    return (
      <DashboardContent>
        <LinearProgress color="inherit" sx={{ width: 1, my: 5 }} />
      </DashboardContent>
    );
  }

  const { transactions, availableYears, summary, monthlyTrend, distribution } = analytics || {
    availableYears: ['Todos'],
    transactions: [],
    summary: { totalInflow: 0, avgTicket: 0, count: 0, topRecipient: 'Nenhum' },
    monthlyTrend: [],
    distribution: [],
  };

  const yearsOptions = ['Todos', ...availableYears.filter((y) => y !== 'Todos')];

  const dataFiltered = transactions.filter((tx) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      tx.counterparty_name?.toLowerCase().includes(searchLower) ||
      tx.origin_institution?.toLowerCase().includes(searchLower) ||
      tx.destination_institution?.toLowerCase().includes(searchLower) ||
      tx.category?.toLowerCase().includes(searchLower) ||
      tx.payment_method?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Tesouraria"
        action={
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              flexWrap: 'wrap',
              gap: 1.5,
              justifyContent: { xs: 'flex-start', sm: 'flex-end' },
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon={'solar:share-bold-duotone' as any} />}
              onClick={() => {
                const url = `${window.location.origin}/share/analytics`;
                navigator.clipboard.writeText(url);
                toast.success('Link público copiado para a área de transferência!');
              }}
            >
              Compartilhar
            </Button>

            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon={'eva:file-text-fill' as any} />}
              onClick={() => toast.info('Exportando relatório...')}
            >
              Exportar PDF
            </Button>
          </Stack>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        {/* Cartão 1: Saldo Recebido */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Saldo Recebido"
            percent={2.6}
            total={fCurrency(summary.totalInflow / 100)}
            color="success"
            icon={<Iconify icon={'solar:double-alt-arrow-up-bold-duotone' as any} width={24} />}
            chart={{
              categories: monthlyTrend.map((m) => m.month),
              series: monthlyTrend.map((m) => m.total / 100),
            }}
          />
        </Grid>

        {/* Cartão 2: Ticket Médio */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Ticket Médio"
            percent={0.2}
            total={fCurrency(summary.avgTicket / 100)}
            color="info"
            icon={<Iconify icon={'solar:bank-bold-duotone' as any} width={24} />}
            chart={{
              categories: monthlyTrend.map((m) => m.month),
              series: monthlyTrend.map((m) => m.total / 100),
            }}
          />
        </Grid>

        {/* Cartão 3: Transações */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Transações"
            percent={-0.1}
            total={summary.count}
            color="warning"
            icon={<Iconify icon={'solar:card-transfer-bold-duotone' as any} width={24} />}
            chart={{
              categories: monthlyTrend.map((m) => m.month),
              series: monthlyTrend.map((m) => m.total / 100),
            }}
          />
        </Grid>

        {/* Cartão 4: Destinatário Principal */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Principal Favorecido"
            percent={1.5}
            total={summary.topRecipient}
            color="primary"
            icon={<Iconify icon={'solar:user-rounded-bold-duotone' as any} width={24} />}
            chart={{
              categories: monthlyTrend.map((m) => m.month),
              series: monthlyTrend.map((m) => m.total / 100),
            }}
          />
        </Grid>

        {/* Evolução Mensal */}
        <Grid size={{ xs: 12, md: 8 }}>
          <AnalyticsWebsiteVisits
            title="Evolução Mensal de Recebimentos"
            subheader="Fluxo total acumulado"
            chart={{
              categories: monthlyTrend.map((m) => m.month),
              series: [
                {
                  name: 'Entradas',
                  data: monthlyTrend.map((m) => m.total / 100),
                },
              ],
            }}
          />
        </Grid>

        {/* Distribuição */}
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsCurrentVisits
            title="Distribuição por Categoria"
            subheader="Proporção de fundos alocados"
            chart={{
              series: distribution.map((d) => ({
                label: d.label,
                value: d.value,
              })),
            }}
          />
        </Grid>

        {/* Toolbar de Filtros */}
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              p: 2.5,
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
            }}
          >
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar transações por contraparte, banco ou categoria..."
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon={'eva:search-fill' as any} sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              select
              label="Ano"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              sx={{ minWidth: { xs: 1, md: 150 } }}
            >
              {yearsOptions.map((year) => (
                <MenuItem key={year} value={year}>
                  {year === 'Todos' ? 'Todos os Anos' : year}
                </MenuItem>
              ))}
            </TextField>
          </Card>
        </Grid>

        {/* Tabela de Transações */}
        <Grid size={{ xs: 12 }}>
          <FinancialTransactionsTable title="Histórico de Transações" tableData={dataFiltered} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
