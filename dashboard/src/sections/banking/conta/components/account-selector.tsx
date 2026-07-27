import type { AccountData } from '../types';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  accounts: AccountData[];
  selectedId: string;
  onChange: (id: string) => void;
};

export function AccountSelector({ accounts, selectedId, onChange }: Props) {
  const theme = useTheme();

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'brl':
        return (
          <Iconify
            icon={'solar:banknotes-bold-duotone' as any}
            width={28}
            sx={{ color: 'success.main' }}
          />
        );
      case 'global':
        return (
          <Iconify
            icon={'solar:global-bold-duotone' as any}
            width={28}
            sx={{ color: 'info.main' }}
          />
        );
      case 'web3':
        return (
          <Iconify
            icon={'solar:safe-square-bold-duotone' as any}
            width={28}
            sx={{ color: 'warning.main' }}
          />
        );
      default:
        return <Iconify icon={'solar:wallet-bold-duotone' as any} width={28} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verificada':
        return 'success';
      case 'Ativa':
        return 'info';
      case 'Limitada':
        return 'warning';
      case 'Bloqueada':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader title="Contas & Carteiras" sx={{ mb: 2 }} />

      {accounts.map((acc) => (
        <ListItemButton
          key={acc.id}
          selected={acc.id === selectedId}
          onClick={() => onChange(acc.id)}
          sx={{
            py: 2,
            borderLeft:
              acc.id === selectedId
                ? `solid 4px ${theme.palette.primary.main}`
                : 'solid 4px transparent',
            '&.Mui-selected': {
              bgcolor: 'action.selected',
            },
          }}
        >
          <ListItemIcon sx={{ mr: 2 }}>{getAccountIcon(acc.type)}</ListItemIcon>
          <ListItemText
            primary={acc.label}
            secondary={
              <Label color={getStatusColor(acc.status) as any} variant="soft" sx={{ mt: 0.5 }}>
                {acc.status}
              </Label>
            }
          />
        </ListItemButton>
      ))}
    </Card>
  );
}
