import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function BankingTransacoesFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('q') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const currencyFilter = searchParams.get('currency') || 'all';

  const updateFilters = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'all') {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      // Reset cursor pagination on filter change
      params.delete('cursor');

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const activeFiltersCount = [
    statusFilter !== 'all',
    currencyFilter !== 'all',
    searchQuery !== '',
  ].filter(Boolean).length;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: { xs: 'flex-end', md: 'center' },
        flexDirection: { xs: 'column', md: 'row' },
        mb: 3,
      }}
    >
      <TextField
        fullWidth
        value={searchQuery}
        onChange={(e) => updateFilters('q', e.target.value)}
        placeholder="Pesquisar por Ledger ID, Beneficiário ou Hash..."
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        select
        value={currencyFilter}
        onChange={(e) => updateFilters('currency', e.target.value)}
        sx={{ minWidth: { md: 160 } }}
      >
        <MenuItem value="all">Todas Moedas</MenuItem>
        <MenuItem value="BRL">Real (BRL)</MenuItem>
        <MenuItem value="USD">Dólar (USD)</MenuItem>
        <MenuItem value="BTC">Bitcoin (BTC)</MenuItem>
        <MenuItem value="USDT">Tether (USDT)</MenuItem>
      </TextField>

      <TextField
        select
        value={statusFilter}
        onChange={(e) => updateFilters('status', e.target.value)}
        sx={{ minWidth: { md: 160 } }}
      >
        <MenuItem value="all">Todos Status</MenuItem>
        <MenuItem value="settled">Liquidado</MenuItem>
        <MenuItem value="pending">Pendente</MenuItem>
        <MenuItem value="failed">Falhou</MenuItem>
      </TextField>

      <Badge badgeContent={activeFiltersCount} color="error">
        <Button
          color="inherit"
          variant="outlined"
          startIcon={<Iconify icon={'solar:filter-bold' as any} />}
          sx={{ height: 48 }}
        >
          Mais Filtros
        </Button>
      </Badge>
    </Box>
  );
}
