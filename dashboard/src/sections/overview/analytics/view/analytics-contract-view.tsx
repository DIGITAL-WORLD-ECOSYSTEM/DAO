import { useState } from 'react';

import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetTreasuryAnalytics } from 'src/actions/treasury';

import { Iconify } from 'src/components/iconify';

import { MOCK_FINANCIAL_PROFILES } from 'src/sections/banking/financial-history/utils/mock-financial-profile';
import { FinancialSummaryHeader } from 'src/sections/banking/financial-history/components/financial-summary-header';

import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

export function AnalyticsContractView() {
  const [selectedYear, setSelectedYear] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const { analytics, analyticsLoading } = useGetTreasuryAnalytics(selectedYear);

  if (analyticsLoading) {
    return (
      <DashboardContent>
        <LinearProgress color="inherit" sx={{ width: 1, my: 5 }} />
      </DashboardContent>
    );
  }

  const { summary, monthlyTrend, distribution, availableYears } = analytics || {
    summary: { totalInflow: 0, count: 0 },
    monthlyTrend: [],
    distribution: [],
    availableYears: ['All'],
  };

  return (
    <DashboardContent maxWidth="xl">
      <FinancialSummaryHeader
        profile={MOCK_FINANCIAL_PROFILES[0]}
        years={availableYears}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        summary={summary}
      />

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="VALOR DO CONTRATO"
            percent={100}
            total="R$ 65.000,00"
            color="primary"
            icon={<Iconify icon={'solar:diploma-verified-bold-duotone' as any} width={32} />}
            chart={{
              categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
              series: [100, 100, 100, 100, 100, 100, 100, 100],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="VALOR TOTAL PAGO"
            percent={+((summary.totalInflow / 65000) * 100)}
            total={`R$ ${summary.totalInflow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            color="success"
            icon={<Iconify icon={'solar:wad-of-money-bold-duotone' as any} width={32} />}
            chart={{
              categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
              series: [22, 33, 54, 12, 12, 43, 33, 20],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="SALDO PARA QUITAÇÃO"
            percent={-(((65000 - summary.totalInflow) / 65000) * 100)}
            total={`R$ ${(65000 - summary.totalInflow).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            color="info"
            icon={<Iconify icon={'solar:calculator-minimalistic-bold-duotone' as any} width={32} />}
            chart={{
              categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
              series: [80, 70, 60, 50, 45, 40, 35, 30],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="REGRAS DO CONTRATO"
            percent={0}
            total="DIA 20 | 1%"
            color="warning"
            icon={<Iconify icon={'solar:document-text-bold-duotone' as any} width={32} />}
            chart={{
              categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
              series: [20, 20, 20, 20, 20, 20, 20, 20],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Fluxo de Quitação Mensal"
            subheader="Evolução da amortização do contrato de 65k"
            chart={{
              categories: monthlyTrend.map((m: any) => m.month),
              series: [
                {
                  name: 'Amortização Realizada',
                  data: monthlyTrend.map((m: any) => m.total),
                },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Divisão de Custos do Contrato"
            chart={{
              series: distribution,
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
