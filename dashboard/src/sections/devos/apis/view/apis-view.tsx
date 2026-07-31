import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';

import axios from 'src/lib/axios';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { IdentityAvatar } from 'src/auth/components';

import { ApiConfigDrawer } from './api-config-drawer';

// ----------------------------------------------------------------------

const MOCK_INTEGRATIONS = [
  {
    id: 'stripe',
    name: 'Stripe Production',
    provider: 'Stripe',
    category: 'Finance',
    env: 'Production',
    risk: 'NUCLEAR',
    criticality: 'MISSION CRITICAL',
    status: 'Online',
    drift: 'Sincronizado',
    owner: 'Finance Team',
    expiresIn: 130, // dias
    healthPct: 99.98,
    logoUrl: '/assets/icons/brands/ic-stripe.svg', // Assumindo icone local ou fallback
  },
  {
    id: 'openai',
    name: 'OpenAI API',
    provider: 'OpenAI',
    category: 'AI',
    env: 'Production',
    risk: 'HIGH',
    criticality: 'IMPORTANT',
    status: 'Online',
    drift: 'Sincronizado',
    owner: 'AI Lab',
    expiresIn: 45, // dias (Amarelo)
    healthPct: 99.5,
    logoUrl: '/assets/icons/brands/ic-openai.svg',
  },
  {
    id: 'binance',
    name: 'Binance Master Account',
    provider: 'Binance',
    category: 'Web3',
    env: 'Production',
    risk: 'CRITICAL',
    criticality: 'MISSION CRITICAL',
    status: 'Failing',
    drift: 'Divergente',
    owner: 'Core Team',
    expiresIn: 3, // dias (Vermelho/Alerta)
    healthPct: 82.0,
    logoUrl: '/assets/icons/brands/ic-binance.svg',
  },
];

export function ApisView() {
  const [currentTab, setCurrentTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [integrations, setIntegrations] = useState<any[]>(MOCK_INTEGRATIONS);

  // Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);

  useEffect(() => {
    // Busca dados reais do backend (substituindo o MOCK no futuro)
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/platform/devos/apis');
        if (response.data?.integrations && response.data.integrations.length > 0) {
          // Quando houver dados reais no D1, eles sobrepõem o MOCK
          setIntegrations(response.data.integrations);
        }
      } catch (error) {
        console.error('Falha ao buscar integrações reais:', error);
      }
    };
    fetchData();
  }, []);

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesTab = currentTab === 'All' || integration.category === currentTab;
    const searchLower = searchQuery.toLowerCase();

    // Suporte para busca simples ou pseudo-sintaxe (e.g., "risk:critical")
    const matchesSearch =
      integration.name.toLowerCase().includes(searchLower) ||
      integration.provider.toLowerCase().includes(searchLower) ||
      integration.owner.toLowerCase().includes(searchLower) ||
      (searchLower.includes('risk:') &&
        integration.risk.toLowerCase().includes(searchLower.replace('risk:', '').trim()));

    return matchesTab && matchesSearch;
  });

  const handleOpenDrawer = (integration: any) => {
    setSelectedIntegration(integration);
    setDrawerOpen(true);
  };

  const renderHero = (
    <Card
      sx={{
        p: 3,
        mb: 3,
        background:
          'linear-gradient(135deg, rgba(34, 193, 195, 0.1) 0%, rgba(253, 187, 45, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        {/* Security Score */}
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <IdentityAvatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'success.main',
                color: 'common.white',
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
            >
              96
            </IdentityAvatar>
          </Box>
          <Stack spacing={0.5}>
            <Typography variant="h6">Security Risk Score</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Cofre Criptográfico V8 Operacional
            </Typography>
          </Stack>
        </Stack>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderStyle: 'dashed', display: { xs: 'none', md: 'block' } }}
        />

        {/* Secrets Lifecycle Center */}
        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            SECRETS LIFECYCLE CENTER
          </Typography>
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                  17 Saudáveis
                </Typography>
                <Typography variant="body2" color="warning.main">
                  8 Rotação Prox.
                </Typography>
                <Typography variant="body2" color="error.main">
                  2 Expiradas
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={70}
                color="success"
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>
          </Stack>
        </Stack>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderStyle: 'dashed', display: { xs: 'none', md: 'block' } }}
        />

        {/* Últimas Alterações */}
        <Stack spacing={1} sx={{ minWidth: 200 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            ÚLTIMAS ALTERAÇÕES
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'info.main' }} />
            <Typography variant="caption">Hoje: OpenAI rotacionada</Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'text.disabled' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Ontem: Stripe Sandbox
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );

  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}
    >
      <Tabs
        value={currentTab}
        onChange={(e, val) => setCurrentTab(val)}
        sx={{
          bgcolor: 'background.paper',
          px: 1,
          borderRadius: 1.5,
          boxShadow: (theme) => theme.customShadows.z1,
        }}
      >
        {['All', 'Finance', 'Web3', 'AI', 'Communications', 'OAuth', 'Infra'].map((tab) => (
          <Tab key={tab} value={tab} label={tab} disableRipple />
        ))}
      </Tabs>

      <TextField
        placeholder="Search (e.g. risk:critical env:production)..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ width: { xs: '100%', md: 320 } }}
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
    </Stack>
  );

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'NUCLEAR':
        return 'error';
      case 'CRITICAL':
        return 'error';
      case 'HIGH':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getExpirationColor = (days: number) => {
    if (days > 120) return 'success.main';
    if (days > 60) return 'info.main';
    if (days > 15) return 'warning.main';
    return 'error.main';
  };

  const renderGrid = (
    <Box
      sx={{
        gap: 3,
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
      }}
    >
      {filteredIntegrations.map((integration) => (
        <Card
          key={integration.id}
          sx={{ p: 3, display: 'flex', flexDirection: 'column', position: 'relative' }}
        >
          {/* Status Pulse */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 'bold',
                color: integration.status === 'Online' ? 'success.main' : 'error.main',
              }}
            >
              {integration.status}
            </Typography>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: integration.status === 'Online' ? 'success.main' : 'error.main',
                animation: integration.status === 'Online' ? 'pulse 2s infinite' : 'none',
              }}
            />
          </Box>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
            <IdentityAvatar variant="rounded" sx={{ width: 48, height: 48, bgcolor: 'background.neutral' }}>
              <Iconify
                icon={'eva:cube-outline' as any}
                width={24}
                sx={{ color: 'text.secondary' }}
              />
            </IdentityAvatar>
            <Stack>
              <Typography variant="subtitle1">{integration.name}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Owner: {integration.owner}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 2 }}>
            <Chip
              size="small"
              label={integration.risk}
              color={getRiskColor(integration.risk) as any}
              variant="soft"
            />
            <Chip size="small" label={integration.criticality} variant="outlined" />
            {integration.drift !== 'Sincronizado' && (
              <Chip
                size="small"
                label={integration.drift}
                color="warning"
                icon={<Iconify icon={'eva:alert-triangle-fill' as any} />}
              />
            )}
          </Stack>

          <Divider sx={{ borderStyle: 'dashed', my: 2 }} />

          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Expira em:
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 'bold', color: getExpirationColor(integration.expiresIn) }}
              >
                {integration.expiresIn} dias
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Disponibilidade (30d):
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {integration.healthPct}%
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              sx={{ flexGrow: 1 }}
              startIcon={<Iconify icon={'eva:activity-outline' as any} />}
            >
              Ping
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              sx={{ flexGrow: 2 }}
              onClick={() => handleOpenDrawer(integration)}
            >
              Gerenciar
            </Button>
          </Stack>
        </Card>
      ))}
    </Box>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <CustomBreadcrumbs
        heading="API & Secrets Vault"
        links={[{ name: 'DevOS', href: paths.devos.root }, { name: 'APIs Vault' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={
          <Button variant="contained" startIcon={<Iconify icon={'mingcute:add-line' as any} />}>
            Nova Integração
          </Button>
        }
      />

      {renderHero}
      {renderFilters}
      {renderGrid}

      <ApiConfigDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        integration={selectedIntegration}
      />
    </Box>
  );
}
