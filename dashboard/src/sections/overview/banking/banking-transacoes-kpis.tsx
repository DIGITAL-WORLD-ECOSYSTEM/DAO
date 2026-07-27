import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type AssetData = {
  currency: string;
  inbound: number;
  outbound: number;
  fees: number;
  color: string;
  icon: string;
};

type Props = CardProps & {
  data: AssetData[];
  isLoading?: boolean;
};

export function BankingTransacoesKpis({ data, isLoading, sx, ...other }: Props) {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
          ...sx,
        }}
        {...other}
      >
        {[...Array(3)].map((_, index) => (
          <Card key={index} sx={{ p: 3 }}>
            <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: 1 }} />
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
        ...sx,
      }}
      {...other}
    >
      {data.map((asset) => (
        <AssetWidget key={asset.currency} asset={asset} />
      ))}
    </Box>
  );
}

// ----------------------------------------------------------------------

type AssetWidgetProps = {
  asset: AssetData;
};

function AssetWidget({ asset }: AssetWidgetProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        boxShadow: 'none',
        color: `${asset.color}.darker`,
        bgcolor: `${asset.color}.lighter`,
        backgroundImage: `linear-gradient(135deg, ${alpha((theme.palette as any)[asset.color]?.light || '#fff', 0.2)}, ${alpha((theme.palette as any)[asset.color]?.main || '#fff', 0.2)})`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography variant="h6">{asset.currency}</Typography>
        <Box
          sx={{
            width: 48,
            height: 48,
            display: 'flex',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            color: `${asset.color}.lighter`,
            bgcolor: `${asset.color}.dark`,
          }}
        >
          <Iconify icon={asset.icon as any} width={24} />
        </Box>
      </Box>

      <Stack spacing={1.5}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ opacity: 0.72 }}>
            Total Entradas
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
            +{fCurrency(asset.inbound)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ opacity: 0.72 }}>
            Total Saídas
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
            -{fCurrency(asset.outbound)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ opacity: 0.72 }}>
            Tarifas/Gas
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'warning.main' }}>
            -{fCurrency(asset.fees)}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
