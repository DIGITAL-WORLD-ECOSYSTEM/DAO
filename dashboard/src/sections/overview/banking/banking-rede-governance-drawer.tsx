import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { fShortenNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
};

export function BankingRedeGovernanceDrawer({ open, onClose }: Props) {
  const governanceSources = [
    {
      label: 'Rede Direta',
      value: 256200,
      icon: 'solar:users-group-rounded-bold-duotone',
      color: 'primary.main',
    },
    {
      label: 'Rede Indireta',
      value: 128100,
      icon: 'solar:users-group-two-rounded-bold-duotone',
      color: 'info.main',
    },
    {
      label: 'Tokens Próprios',
      value: 341600,
      icon: 'solar:wallet-money-bold-duotone',
      color: 'success.main',
    },
    {
      label: 'Delegações',
      value: 128100,
      icon: 'solar:hand-shake-bold-duotone',
      color: 'warning.main',
    },
  ];

  const totalPower = 854000;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: 320 }, p: 3 } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Poder de Governança</Typography>
        <IconButton onClick={onClose}>
          <Iconify icon={'solar:close-circle-bold' as any} />
        </IconButton>
      </Box>

      <Box
        sx={{ bgcolor: 'background.neutral', p: 3, borderRadius: 2, textAlign: 'center', mb: 3 }}
      >
        <Iconify
          icon={'solar:diploma-verified-bold-duotone' as any}
          width={48}
          sx={{ color: 'warning.main', mb: 1 }}
        />
        <Typography variant="h3">{fShortenNumber(totalPower)}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          ASPPIBRA Power
        </Typography>
      </Box>

      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Origem do Poder de Voto
      </Typography>

      <Stack spacing={2}>
        {governanceSources.map((source) => (
          <Box
            key={source.label}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: 'background.neutral',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify icon={source.icon as any} sx={{ color: source.color }} />
              </Box>
              <Box>
                <Typography variant="subtitle2">{source.label}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {((source.value / totalPower) * 100).toFixed(0)}% do total
                </Typography>
              </Box>
            </Box>
            <Typography variant="subtitle2">{fShortenNumber(source.value)}</Typography>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Histórico de Crescimento
      </Typography>

      <Stack spacing={1.5}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Hoje
          </Typography>
          <Typography variant="subtitle2">{fShortenNumber(totalPower)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            30 dias atrás
          </Typography>
          <Typography variant="subtitle2">{fShortenNumber(totalPower * 0.82)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            90 dias atrás
          </Typography>
          <Typography variant="subtitle2">{fShortenNumber(totalPower * 0.45)}</Typography>
        </Box>
      </Stack>
    </Drawer>
  );
}
