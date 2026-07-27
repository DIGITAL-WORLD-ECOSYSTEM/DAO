import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useSearchParams } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { BankingRedeGraph } from '../banking-rede-graph';
import { BankingRedeAnalytics } from '../banking-rede-analytics';
import { BankingRedeReferralHub } from '../banking-rede-referral-hub';
import { BankingRedeGovernanceDrawer } from '../banking-rede-governance-drawer';
import { BankingRedeCommissionStream } from '../banking-rede-commission-stream';

// ----------------------------------------------------------------------

export type AffiliateNode = {
  id: string;
  name: string;
  level: number;
  status: 'Ativo' | 'Pendente' | 'Inativo' | 'Suspenso';
  activationScore: number;
  invitedAt: string;
  children?: AffiliateNode[];
};

export type CommissionRow = {
  id: string;
  date: string;
  type: string;
  origin: string;
  asset: 'BRL' | 'USDT' | 'ASPPIBRA';
  amount: number;
  status: 'Pendente' | 'Disponível' | 'Pago';
};

// ----------------------------------------------------------------------

const MOCK_TREE: AffiliateNode[] = [
  {
    id: 'USR-001',
    name: 'Você (Root)',
    level: 0,
    status: 'Ativo',
    activationScore: 100,
    invitedAt: '2025-01-10T10:00:00Z',
    children: [
      {
        id: 'USR-101',
        name: 'João Silva',
        level: 1,
        status: 'Ativo',
        activationScore: 100,
        invitedAt: '2025-02-15T14:30:00Z',
        children: [
          {
            id: 'USR-201',
            name: 'Maria Souza',
            level: 2,
            status: 'Ativo',
            activationScore: 82,
            invitedAt: '2025-03-01T09:15:00Z',
          },
          {
            id: 'USR-202',
            name: 'Pedro Costa',
            level: 2,
            status: 'Pendente',
            activationScore: 40,
            invitedAt: '2025-03-05T11:20:00Z',
          },
        ],
      },
      {
        id: 'USR-102',
        name: 'Ana Carolina',
        level: 1,
        status: 'Ativo',
        activationScore: 100,
        invitedAt: '2025-02-20T16:45:00Z',
        children: [
          {
            id: 'USR-203',
            name: 'Lucas Mendes',
            level: 2,
            status: 'Inativo',
            activationScore: 0,
            invitedAt: '2025-04-10T08:00:00Z',
          },
          {
            id: 'USR-204',
            name: 'Carla Dias',
            level: 2,
            status: 'Suspenso',
            activationScore: 10,
            invitedAt: '2025-04-12T14:10:00Z',
          },
        ],
      },
    ],
  },
];

const MOCK_COMMISSIONS: CommissionRow[] = [
  {
    id: 'c1',
    date: '2026-07-08T10:00:00Z',
    type: 'Bônus de Adesão',
    origin: 'Nível 1: João Silva',
    asset: 'BRL',
    amount: 50.0,
    status: 'Pago',
  },
  {
    id: 'c2',
    date: '2026-07-07T15:30:00Z',
    type: 'Taxa de Swap Co-participativa',
    origin: 'Nível 2: Maria Souza',
    asset: 'USDT',
    amount: 12.5,
    status: 'Disponível',
  },
  {
    id: 'c3',
    date: '2026-07-06T09:15:00Z',
    type: 'Recompensa de Governança',
    origin: 'Pool Global',
    asset: 'ASPPIBRA',
    amount: 450,
    status: 'Pendente',
  },
  {
    id: 'c4',
    date: '2026-07-05T14:20:00Z',
    type: 'Taxa de Liquidação',
    origin: 'Nível 1: Ana Carolina',
    asset: 'BRL',
    amount: 15.75,
    status: 'Pago',
  },
];

// ----------------------------------------------------------------------

export function BankingRedeView() {
  const searchParams = useSearchParams();
  const [govDrawerOpen, setGovDrawerOpen] = useState(false);
  const [focusedAffiliate, setFocusedAffiliate] = useState<string | null>(null);

  useEffect(() => {
    const affiliateId = searchParams.get('affiliate');
    if (affiliateId) {
      setFocusedAffiliate(affiliateId);
      // Log audit trail for deep link access
      console.log(
        JSON.stringify({
          action: 'view_affiliate_deep_link',
          actor: 'current_user',
          affiliateId,
          timestamp: new Date().toISOString(),
          module: 'network',
        })
      );
    }
  }, [searchParams]);

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
        <Typography variant="h4">Rede & Afiliados</Typography>
      </Box>

      {/* Analytics KPIs */}
      <Box sx={{ mb: 4 }}>
        <BankingRedeAnalytics onOpenGovernance={() => setGovDrawerOpen(true)} />
      </Box>

      {/* Main Grid: Graph + Hub */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        <Box sx={{ gridColumn: { md: 'span 2' } }}>
          <BankingRedeGraph treeData={MOCK_TREE} focusedId={focusedAffiliate} />
        </Box>
        <Box sx={{ gridColumn: { md: 'span 1' } }}>
          <BankingRedeReferralHub />
        </Box>
      </Box>

      {/* Commissions Stream */}
      <Box>
        <BankingRedeCommissionStream commissions={MOCK_COMMISSIONS} />
      </Box>

      <BankingRedeGovernanceDrawer open={govDrawerOpen} onClose={() => setGovDrawerOpen(false)} />
    </DashboardContent>
  );
}
