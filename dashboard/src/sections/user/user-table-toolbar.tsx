import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { IUserTableFilters } from 'src/types/user';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IUserTableFilters>;
  options: {
    roles: string[];
    kycStatus: string[];
  };
};

export function UserTableToolbar({ filters, options, onResetPage }: Props) {
  const { state: currentFilters, setState: updateFilters } = filters;

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      updateFilters({ name: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  const handleFilterRole = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

      onResetPage();
      updateFilters({ role: newValue });
    },
    [onResetPage, updateFilters]
  );

  const handleFilterKycStatus = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

      onResetPage();
      updateFilters({ kycStatus: newValue });
    },
    [onResetPage, updateFilters]
  );

  const kycLabelMap: Record<string, string> = {
    draft: 'Não Iniciado',
    pending: 'Pendente',
    under_review: 'Em Análise',
    approved: 'Verificado',
    rejected: 'Rejeitado',
    expired: 'Expirado'
  };

  return (
    <Box
      sx={{
        p: 2.5,
        gap: 2,
        display: 'flex',
        pr: { xs: 2.5, md: 2.5 },
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-end', md: 'center' },
      }}
    >
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
        <InputLabel htmlFor="filter-role-select">Nível de Acesso</InputLabel>
        <Select
          multiple
          label="Nível de Acesso"
          value={currentFilters.role}
          onChange={handleFilterRole}
          renderValue={(selected) => selected.map((value) => value.toUpperCase()).join(', ')}
          inputProps={{ id: 'filter-role-select' }}
          MenuProps={{
            slotProps: { paper: { sx: { maxHeight: 240 } } },
          }}
        >
          {options.roles.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox
                disableRipple
                size="small"
                checked={currentFilters.role.includes(option)}
              />
              {option.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
        <InputLabel htmlFor="filter-kyc-select">KYC</InputLabel>
        <Select
          multiple
          label="KYC"
          value={currentFilters.kycStatus || []}
          onChange={handleFilterKycStatus}
          renderValue={(selected) => selected.map((val) => kycLabelMap[val] || val).join(', ')}
          inputProps={{ id: 'filter-kyc-select' }}
          MenuProps={{
            slotProps: { paper: { sx: { maxHeight: 240 } } },
          }}
        >
          {options.kycStatus.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox
                disableRipple
                size="small"
                checked={(currentFilters.kycStatus || []).includes(option)}
              />
              {kycLabelMap[option]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box
        sx={{
          gap: 2,
          width: 1,
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TextField
          fullWidth
          value={currentFilters.name}
          onChange={handleFilterName}
          placeholder="Pesquisar nome, e-mail ou ASP-ID..."
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

        <Button 
          variant="outlined" 
          color="inherit" 
          startIcon={<Iconify icon="solar:export-bold" />}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          Exportar
        </Button>
      </Box>
    </Box>
  );
}
