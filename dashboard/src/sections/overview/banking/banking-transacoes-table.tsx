import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type TransactionRow = {
  id: string;
  timestamp: string;
  description: string;
  origin: string;
  rail: string;
  status: 'settled' | 'pending' | 'failed';
  currency: string;
  amount: number;
  reconciled: boolean;
};

// Mock data builder for testing virtualization (would come from API cursor)
const _mockTransactions: TransactionRow[] = [...Array(100)].map((_, index) => ({
  id: `LGR-${Date.now()}-${index}`,
  timestamp: new Date(Date.now() - index * 3600000).toISOString(),
  description: index % 2 === 0 ? 'Recebido de João Silva' : 'Pagamento Amazon Web Services',
  origin: index % 3 === 0 ? 'Core Banking' : index % 2 === 0 ? 'Treasury' : 'Engine',
  rail: index % 4 === 0 ? 'Blockchain' : index % 2 === 0 ? 'PIX' : 'TED',
  status: index % 5 === 0 ? 'pending' : index % 7 === 0 ? 'failed' : 'settled',
  currency: index % 3 === 0 ? 'USD' : 'BRL',
  amount: (index % 2 === 0 ? 1 : -1) * (Math.random() * 5000),
  reconciled: index % 4 !== 0,
}));

// ----------------------------------------------------------------------

type Props = {
  onRowClick: (id: string) => void;
};

export function BankingTransacoesTable({ onRowClick }: Props) {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const columns: GridColDef[] = [
    {
      field: 'timestamp',
      headerName: 'Data/Hora',
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">{fDateTime(params.value)}</Typography>
      ),
    },
    {
      field: 'description',
      headerName: 'Identificação',
      flex: 1,
      minWidth: 220,
    },
    {
      field: 'origin',
      headerName: 'Origem / Trilho',
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2">{params.row.origin}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {params.row.rail}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'reconciled',
      headerName: 'Auditoria',
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Label variant="soft" color={params.value ? 'success' : 'warning'}>
          {params.value ? 'Conciliado' : 'Pendente'}
        </Label>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Label
          variant="filled"
          color={
            (params.value === 'settled' && 'success') ||
            (params.value === 'pending' && 'warning') ||
            'error'
          }
        >
          {params.value === 'settled'
            ? 'Liquidado'
            : params.value === 'pending'
              ? 'Pendente'
              : 'Falhou'}
        </Label>
      ),
    },
    {
      field: 'amount',
      headerName: 'Valor',
      width: 160,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams) => {
        const isPositive = params.value > 0;
        return (
          <Typography
            variant="subtitle2"
            sx={{ color: isPositive ? 'success.main' : 'error.main' }}
          >
            {isPositive ? '+' : ''}
            {fCurrency(params.value)} {params.row.currency}
          </Typography>
        );
      },
    },
  ];

  return (
    <Card sx={{ height: 680, width: '100%', display: 'flex', flexDirection: 'column' }}>
      <DataGrid
        rows={_mockTransactions}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[25, 50, 100]}
        disableRowSelectionOnClick
        onRowClick={(params) => onRowClick(params.id as string)}
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell': {
            cursor: 'pointer',
          },
        }}
      />
    </Card>
  );
}
