import type { CommissionRow } from './view/banking-rede-view';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = {
  commissions: CommissionRow[];
};

export function BankingRedeCommissionStream({ commissions }: Props) {
  const theme = useTheme();

  const handleExport = (format: string) => {
    // Mock Audit Log
    console.log(
      JSON.stringify({
        action: 'export_commission_report',
        timestamp: new Date().toISOString(),
        actor: 'current_user',
        module: 'network',
        data: { format },
      })
    );

    toast.success(`Relatório exportado em ${format}`);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Pago':
        return <Label color="success">Pago</Label>;
      case 'Disponível':
        return <Label color="info">Disponível</Label>;
      case 'Pendente':
        return <Label color="warning">Pendente</Label>;
      default:
        return <Label>{status}</Label>;
    }
  };

  const getAssetIcon = (asset: string) => {
    switch (asset) {
      case 'BRL':
        return <Iconify icon={'twemoji:flag-brazil' as any} width={20} />;
      case 'USDT':
        return <Iconify icon={'cryptocurrency-color:usdt' as any} width={20} />;
      case 'ASPPIBRA':
        return (
          <Iconify icon={'solar:star-fall-bold' as any} width={20} sx={{ color: 'warning.main' }} />
        );
      default:
        return <Iconify icon={'solar:wallet-bold' as any} width={20} />;
    }
  };

  const formatAmount = (amount: number, asset: string) => {
    if (asset === 'BRL') return fCurrency(amount);
    return amount.toLocaleString();
  };

  return (
    <Card>
      <CardHeader
        title="Extrato de Comissões e Recompensas"
        sx={{ mb: 3 }}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              startIcon={<Iconify icon={'solar:download-bold' as any} />}
              onClick={() => handleExport('PDF')}
            >
              Exportar
            </Button>
            <Button
              component={RouterLink}
              href="/dashboard/banking/transferencias"
              variant="contained"
              color="primary"
              size="small"
              startIcon={<Iconify icon={'solar:export-bold' as any} />}
            >
              Resgatar Comissões
            </Button>
          </Box>
        }
      />

      <Scrollbar>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Origem</TableCell>
              <TableCell>Moeda</TableCell>
              <TableCell align="right">Valor</TableCell>
              <TableCell align="center">Status Financeiro</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {commissions.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Typography variant="body2">{new Date(row.date).toLocaleDateString()}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {new Date(row.date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="subtitle2">{row.type}</Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">{row.origin}</Typography>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getAssetIcon(row.asset)}
                    <Typography variant="body2">{row.asset}</Typography>
                  </Box>
                </TableCell>

                <TableCell align="right">
                  <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                    + {formatAmount(row.amount, row.asset)}
                  </Typography>
                </TableCell>

                <TableCell align="center">{getStatusLabel(row.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
}
