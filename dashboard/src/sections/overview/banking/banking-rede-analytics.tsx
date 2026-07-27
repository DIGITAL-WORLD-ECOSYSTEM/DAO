import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import { fCurrency, fShortenNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  onOpenGovernance: () => void;
};

export function BankingRedeAnalytics({ onOpenGovernance }: Props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
      }}
    >
      {/* KPI 1: TVL da Rede */}
      <Card sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            TVL da Rede (BRL)
          </Typography>
          <Typography variant="h4">{fCurrency(1250000)}</Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}
          >
            <Iconify icon={'solar:clock-circle-linear' as any} width={14} />
            Atualizado em:{' '}
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Box>
        <Iconify
          icon={'solar:wallet-money-bold-duotone' as any}
          width={48}
          sx={{ color: 'primary.main', opacity: 0.8 }}
        />
      </Card>

      {/* KPI 2: Comissões Recebidas (Receita) */}
      <Card sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Comissões do Mês
          </Typography>
          <Typography variant="h4">{fCurrency(5200)}</Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'success.main',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 1,
              fontWeight: 'fontWeightBold',
            }}
          >
            <Iconify icon={'solar:trend-up-bold' as any} width={14} />
            +18% este mês
          </Typography>
        </Box>
        <Iconify
          icon={'solar:chart-square-bold-duotone' as any}
          width={48}
          sx={{ color: 'success.main', opacity: 0.8 }}
        />
      </Card>

      {/* KPI 3: Profundidade e Saúde (Health) */}
      <Card sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Crescimento e Saúde
          </Typography>
          <Typography variant="h4">
            89{' '}
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
              / 152 ativos
            </Typography>
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
            12 Diretos • 140 Indiretos • Nível 5 Máx.
          </Typography>
        </Box>
        <Iconify
          icon={'solar:users-group-two-rounded-bold-duotone' as any}
          width={48}
          sx={{ color: 'info.main', opacity: 0.8 }}
        />
      </Card>

      {/* KPI 4: Governance Power */}
      <Card>
        <CardActionArea
          onClick={onOpenGovernance}
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Poder de Governança
            </Typography>
            <Typography variant="h4">
              {fShortenNumber(854000)}{' '}
              <Typography component="span" variant="subtitle2">
                ASPPIBRA
              </Typography>
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.warning.main,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 1,
              }}
            >
              <Iconify icon={'solar:star-fall-bold' as any} width={14} />
              Ver Origem do Poder
            </Typography>
          </Box>
          <Iconify
            icon={'solar:diploma-verified-bold-duotone' as any}
            width={48}
            sx={{ color: 'warning.main', opacity: 0.8 }}
          />
        </CardActionArea>
      </Card>
    </Box>
  );
}
