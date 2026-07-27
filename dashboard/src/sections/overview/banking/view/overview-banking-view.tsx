import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { _bankingContacts, _bankingRecentTransitions } from 'src/_mock';

import { Iconify } from 'src/components/iconify/iconify';

import { BankingContacts } from '../banking-contacts';
import { BankingOverview } from '../banking-overview';
import { BankingQuickTransfer } from '../banking-quick-transfer';
import { BankingInviteFriends } from '../banking-invite-friends';
import { BankingBalanceStatistics } from '../banking-balance-statistics';
import { BankingRecentTransitions } from '../banking-recent-transitions';
import { BankingExpensesCategories } from '../banking-expenses-categories';

// ----------------------------------------------------------------------

export function OverviewBankingView() {
  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <BankingOverview />

            <BankingBalanceStatistics
              title="Estatísticas de Saldo"
              subheader="Evolução do seu saldo ao longo do tempo"
              chart={{
                series: [
                  {
                    name: 'Semanal',
                    categories: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'],
                    data: [
                      { name: 'Entradas', data: [24, 41, 35, 151, 49] },
                      { name: 'Economias', data: [24, 56, 77, 88, 99] },
                      { name: 'Investimentos', data: [40, 34, 77, 88, 99] },
                    ],
                  },
                  {
                    name: 'Mensal',
                    categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
                    data: [
                      { name: 'Entradas', data: [83, 112, 119, 88, 103, 112, 114, 108, 93] },
                      { name: 'Economias', data: [46, 46, 43, 58, 40, 59, 54, 42, 51] },
                      { name: 'Investimentos', data: [25, 40, 38, 35, 20, 32, 27, 40, 21] },
                    ],
                  },
                  {
                    name: 'Anual',
                    categories: ['2018', '2019', '2020', '2021', '2022', '2023'],
                    data: [
                      { name: 'Entradas', data: [76, 42, 29, 41, 27, 96] },
                      { name: 'Economias', data: [46, 44, 24, 43, 44, 43] },
                      { name: 'Investimentos', data: [23, 22, 37, 38, 32, 25] },
                    ],
                  },
                ],
              }}
            />

            <BankingExpensesCategories
              title="Categorias de Despesas"
              chart={{
                series: [
                  { label: 'Entretenimento', value: 22 },
                  { label: 'Combustível', value: 18 },
                  { label: 'Alimentação', value: 16 },
                  { label: 'Café', value: 17 },
                  { label: 'Conectividade', value: 14 },
                  { label: 'Saúde', value: 22 },
                  { label: 'Academia', value: 10 },
                  { label: 'Supermercado', value: 21 },
                ],
                icons: [
                  <Iconify icon="solar:gamepad-bold" />,
                  <Iconify icon="solar:electric-refueling-bold" />,
                  <Iconify icon="custom:fast-food-fill" />,
                  <Iconify icon="solar:tea-cup-bold" />,
                  <Iconify icon="solar:smartphone-2-bold" />,
                  <Iconify icon="solar:medical-kit-bold" />,
                  <Iconify icon="solar:dumbbell-large-minimalistic-bold" />,
                  <Iconify icon="solar:cart-3-bold" />,
                ],
              }}
            />

            <BankingRecentTransitions
              title="Últimas Transações"
              tableData={_bankingRecentTransitions}
              headCells={[
                { id: 'description', label: 'Descrição' },
                { id: 'date', label: 'Data' },
                { id: 'amount', label: 'Valor' },
                { id: 'status', label: 'Status' },
                { id: '' },
              ]}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <BankingQuickTransfer title="Transferência Rápida" list={_bankingContacts} />

            <BankingContacts
              title="Contatos"
              subheader="Você tem 122 contatos"
              list={_bankingContacts.slice(-5)}
            />

            <BankingInviteFriends
              price="R$ 50"
              title={`Convide amigos \n e ganhe`}
              description="Convide seus parceiros para a rede e ganhe recompensas em tokens ASPPIBRA."
              imgUrl={`${CONFIG.assetsDir}/assets/illustrations/illustration-receipt.webp`}
            />
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
