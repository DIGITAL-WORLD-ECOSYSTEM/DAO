import type { IUserItem } from 'src/types/user';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { fShortenNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  tableData: IUserItem[];
};

export function DirectoryHeroMetrics({ tableData }: Props) {
  const theme = useTheme();

  const totalMembers = tableData.length;
  const activeMembers = tableData.filter((user) => user.status === 'active').length;
  const pendingMembers = tableData.filter((user) => user.status === 'pending').length;
  const suspendedMembers = tableData.filter((user) => user.status === 'suspended').length;
  const verifiedMembers = tableData.filter((user) => user.isVerified).length;

  const alerts = [];
  if (pendingMembers > 0) {
    alerts.push(`⚠ ${pendingMembers} membros aguardando análise de KYC`);
  }
  const inactiveCount = tableData.filter(
    (u) => u.lastActivity && (Date.now() - new Date(u.lastActivity).getTime()) > 30 * 24 * 60 * 60 * 1000
  ).length;
  if (inactiveCount > 0) {
    alerts.push(`⚠ ${inactiveCount} contas inativas há mais de 30 dias`);
  }

  return (
    <Box sx={{ mb: { xs: 3, md: 5 } }}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            md: 'repeat(5, 1fr)',
          },
        }}
      >
        <MetricCard
          title="Total de Membros"
          total={totalMembers}
          icon="solar:users-group-rounded-bold"
          color={theme.vars.palette.primary.main}
        />
        <MetricCard
          title="Ativos"
          total={activeMembers}
          icon="solar:user-check-bold"
          color={theme.vars.palette.success.main}
        />
        <MetricCard
          title="Pendentes"
          total={pendingMembers}
          icon="solar:user-id-bold"
          color={theme.vars.palette.warning.main}
        />
        <MetricCard
          title="Suspensos"
          total={suspendedMembers}
          icon="solar:user-cross-bold"
          color={theme.vars.palette.error.main}
        />
        <MetricCard
          title="KYC Completo"
          total={verifiedMembers}
          icon="solar:shield-check-bold"
          color={theme.vars.palette.info.main}
        />
      </Box>

      {alerts.length > 0 && (
        <Stack spacing={1} sx={{ mt: 2 }}>
          {alerts.map((alert, index) => (
            <Card
              key={index}
              sx={{
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                typography: 'subtitle2',
                color: 'warning.dark',
                bgcolor: 'warning.lighter',
                boxShadow: 'none',
              }}
            >
              <Iconify icon="solar:danger-triangle-bold" width={24} sx={{ mr: 1.5 }} />
              {alert}
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

type MetricCardProps = {
  title: string;
  total: number;
  icon: string;
  color: string;
};

function MetricCard({ title, total, icon, color }: MetricCardProps) {
  return (
    <Card sx={{ p: 2, display: 'flex', alignItems: 'center', boxShadow: 2 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ mt: 0.5 }}>
          {fShortenNumber(total)}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 48,
          height: 48,
          lineHeight: 0,
          borderRadius: '50%',
          bgcolor: (theme) => `rgba(${theme.vars.palette.primary.mainChannel} / 0.08)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
        }}
      >
        <Iconify icon={icon as any} width={24} />
      </Box>
    </Card>
  );
}
