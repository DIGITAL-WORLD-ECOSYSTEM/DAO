import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function AppNetworkGrowth({ ...other }) {
  return (
    <Card
      sx={{
        p: 3,
        bgcolor: 'primary.dark',
        color: 'primary.lighter',
        ...other,
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Crescimento da Comunidade</Typography>
        <Iconify icon={'solar:chart-square-bold' as any} width={24} sx={{ opacity: 0.48 }} />
      </Stack>

      <Stack spacing={2}>
        <GrowthItem icon="solar:users-group-rounded-bold" label="Novos Membros" value="+23" />
        <GrowthItem icon="solar:link-circle-bold" label="Indicações" value="+4" />
        <GrowthItem icon="solar:hand-shake-bold" label="Parceiros" value="+2" />
      </Stack>
    </Card>
  );
}

function GrowthItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Iconify icon={icon as any} width={20} sx={{ opacity: 0.72 }} />
        <Typography variant="body2">{label}</Typography>
      </Stack>
      <Typography variant="subtitle2" sx={{ color: 'success.light' }}>
        {value}
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function AppEcosystemNumbers({ ...other }) {
  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)', ...other }}>
      <NumberCard title="Membros" value="1.240" icon="solar:user-id-bold" color="info" />
      <NumberCard title="Projetos" value="18" icon="solar:rocket-bold" color="warning" />
      <NumberCard title="Parceiros" value="7" icon="solar:buildings-bold" color="primary" />
      <NumberCard title="Propostas" value="3" icon="solar:archive-bold" color="success" />
    </Box>
  );
}

function NumberCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <Card
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          mb: 1,
          width: 40,
          height: 40,
          display: 'flex',
          borderRadius: '50%',
          alignItems: 'center',
          justifyContent: 'center',
          color: `${color}.main`,
          bgcolor: (t) =>
            `rgba(${t.vars.palette[color as 'primary' | 'info' | 'warning' | 'success'].mainChannel} / 0.16)`,
        }}
      >
        <Iconify icon={icon as any} width={24} />
      </Box>
      <Typography variant="h6">{value}</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {title}
      </Typography>
    </Card>
  );
}
