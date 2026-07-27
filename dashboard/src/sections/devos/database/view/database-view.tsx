import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import axios from 'src/lib/axios';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export function DatabaseView() {
  const [metrics, setMetrics] = useState({
    sizeMB: '0.00',
    latencyMs: 0,
    status: 'Loading',
    score: 0,
    pendingWrites: 0,
    lockedEvents: 0,
  });

  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metricsRes = await axios.get('/api/platform/devos/database/metrics');
        if (metricsRes.data) setMetrics(metricsRes.data);

        const tablesRes = await axios.get('/api/platform/devos/database/tables');
        if (tablesRes.data?.tables) setTables(tablesRes.data.tables);
      } catch (error) {
        console.error('Falha ao buscar D1 Metrics', error);
      }
    };
    fetchData();
  }, []);

  const renderHero = (
    <Card
      sx={{
        p: 3,
        mb: 3,
        background:
          'linear-gradient(135deg, rgba(34, 193, 195, 0.05) 0%, rgba(253, 187, 45, 0.05) 100%)',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        {/* Health Score */}
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'success.main',
              color: 'common.white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              border: '4px solid',
              borderColor: 'success.lighter',
            }}
          >
            {metrics.score || 99}
          </Avatar>
          <Stack spacing={0.5}>
            <Typography variant="h6">Database Health</Typography>
            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold' }}>
              {metrics.status || 'Excellent'}
            </Typography>
          </Stack>
        </Stack>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderStyle: 'dashed', display: { xs: 'none', md: 'block' } }}
        />

        {/* Storage & Operations */}
        <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={4} sx={{ width: '100%' }}>
            <Stack spacing={0.5} sx={{ minWidth: 120 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Storage (D1 Limit)
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
                <Typography variant="h6">{metrics.sizeMB} MB</Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  / 10 GB
                </Typography>
              </Stack>
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Reads (24h)
              </Typography>
              <Typography variant="h6">12.4M</Typography>
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Writes (24h)
              </Typography>
              <Typography variant="h6">184K</Typography>
            </Stack>
          </Stack>
        </Stack>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderStyle: 'dashed', display: { xs: 'none', md: 'block' } }}
        />

        {/* Performance & Locks */}
        <Stack spacing={1.5} sx={{ minWidth: 200 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Latency
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              {metrics.latencyMs}ms
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Pending Writes
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
              {metrics.pendingWrites}
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              DB Locked Events
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 'bold',
                color: metrics.lockedEvents > 0 ? 'error.main' : 'success.main',
              }}
            >
              {metrics.lockedEvents} (Events)
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );

  const renderIdeLayout = (
    <Card sx={{ height: 800, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
      {/* Sidebar Esquerda (Navegador) */}
      <Box
        sx={{
          width: 280,
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Explorer
          </Typography>
        </Box>
        <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }}>
          {tables.length > 0 ? (
            <Stack spacing={1}>
              {tables.map((table: any, index: number) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography
                    variant="body2"
                    sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                  >
                    {table.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      bgcolor: 'background.neutral',
                      px: 1,
                      borderRadius: 1,
                    }}
                  >
                    {table.rows} rows
                  </Typography>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              Buscando tabelas no D1...
            </Typography>
          )}
        </Box>
      </Box>

      {/* Main Content (Central) */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.neutral',
          }}
        >
          <Typography variant="subtitle2">Workspace</Typography>
        </Box>
        <Box
          sx={{
            p: 3,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <Iconify icon={'eva:cube-outline' as any} width={48} sx={{ color: 'text.disabled' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Selecione uma tabela na lateral ou abra o SQL Console.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Card>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1600, mx: 'auto' }}>
      <CustomBreadcrumbs
        heading="Database D1 Studio"
        links={[{ name: 'DevOS', href: paths.devos.root }, { name: 'D1 Studio' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {renderHero}
      {renderIdeLayout}
    </Box>
  );
}
