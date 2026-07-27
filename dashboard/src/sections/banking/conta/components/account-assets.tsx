import type { AccountData } from '../types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = {
  account: AccountData;
  hideBalances: boolean;
};

export function AccountAssets({ account, hideBalances }: Props) {
  return (
    <Card>
      <CardHeader
        title="Composição de Saldo"
        sx={{ mb: 3 }}
        action={
          account.type === 'global' ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                bgcolor: 'background.neutral',
                borderRadius: 1,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 'fontWeightBold' }}>
                USD/BRL 5,47
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                • Atualizado há 2 min
              </Typography>
            </Box>
          ) : null
        }
      />

      <Scrollbar>
        <Table sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              <TableCell>Ativo</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Disponível</TableCell>
              <TableCell align="right">Bloqueado</TableCell>
              <TableCell align="right">Em Liquidação</TableCell>
              <TableCell align="right">Equivalente (BRL)</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {account.balances.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'background.neutral' }}>
                      <Iconify icon={row.icon as any} width={24} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{row.asset}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {row.name}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell align="right">
                  {hideBalances
                    ? '••••••'
                    : (row.available + row.blocked + row.inLiquidation).toLocaleString()}
                </TableCell>

                <TableCell align="right">
                  {hideBalances ? '••••••' : row.available.toLocaleString()}
                </TableCell>

                <TableCell
                  align="right"
                  sx={{ color: row.blocked > 0 ? 'warning.main' : 'text.primary' }}
                >
                  {hideBalances ? '••••••' : row.blocked.toLocaleString()}
                </TableCell>

                <TableCell
                  align="right"
                  sx={{ color: row.inLiquidation > 0 ? 'info.main' : 'text.primary' }}
                >
                  {hideBalances ? '••••••' : row.inLiquidation.toLocaleString()}
                </TableCell>

                <TableCell align="right" sx={{ fontWeight: 'fontWeightBold' }}>
                  {hideBalances ? 'R$ ••••••' : fCurrency(row.fiatValue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
}
