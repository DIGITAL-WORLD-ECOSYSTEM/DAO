import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useGetAccounts } from 'src/actions/mail';

// ----------------------------------------------------------------------
import { Iconify } from 'src/components/iconify';

type Props = {
  selectedAccountId: string;
  onChangeAccount: (accountId: string) => void;
  onToggleCompose: () => void;
  onSync: () => void;
  isSyncing?: boolean;
};

export function MailTopBar({ selectedAccountId, onChangeAccount, onToggleCompose, onSync, isSyncing }: Props) {
  const { accounts, accountsLoading } = useGetAccounts();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ mb: { xs: 3, md: 5 }, alignItems: { md: 'center' } }}
    >
      <TextField
        select
        size="small"
        value={selectedAccountId}
        onChange={(e) => onChangeAccount(e.target.value)}
        disabled={accountsLoading || accounts.length === 0}
        sx={{ minWidth: 240 }}
      >
        {accounts.map((acc) => (
          <MenuItem key={acc.id} value={acc.id}>
            {acc.email}
          </MenuItem>
        ))}
        {accounts.length === 0 && (
          <MenuItem value="" disabled>
            Nenhuma conta
          </MenuItem>
        )}
      </TextField>

      <TextField
        fullWidth
        size="small"
        placeholder="Pesquisar mensagens..."
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

      <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
        <Button
          variant="contained"
          startIcon={<Iconify icon="solar:pen-bold" />}
          onClick={onToggleCompose}
        >
          Novo
        </Button>

        <Button
          variant="outlined"
          startIcon={<Iconify icon="solar:restart-bold" />}
          onClick={onSync}
          disabled={isSyncing || !selectedAccountId}
        >
          {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
        </Button>

        <IconButton sx={{ border: (theme) => `solid 1px ${theme.vars.palette.divider}` }}>
          <Iconify icon="ic:round-filter-list" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
