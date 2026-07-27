import type { IUserItem } from 'src/types/user';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { UserQuickEditForm } from './user-quick-edit-form';
import { UserQuickInspectDrawer } from './user-quick-inspect-drawer';

// ----------------------------------------------------------------------

type Props = {
  row: IUserItem;
  selected: boolean;

  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow, onDeleteRow }: Props) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();
  const quickInspectDrawer = useBoolean();

  const renderQuickInspectDrawer = () => (
    <UserQuickInspectDrawer
      currentUser={row}
      open={quickInspectDrawer.value}
      onClose={quickInspectDrawer.onFalse}
    />
  );

  const renderQuickEditForm = () => (
    <UserQuickEditForm
      currentUser={row}
      open={quickEditForm.value}
      onClose={quickEditForm.onFalse}
    />
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem onClick={() => { quickInspectDrawer.onTrue(); menuActions.onClose(); }}>
            <Iconify icon="solar:eye-bold" />
            Inspecionar
          </MenuItem>
        </li>

        <li>
          <MenuItem onClick={() => { quickEditForm.onTrue(); menuActions.onClose(); }}>
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>
        </li>

        <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Excluir
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Excluir Usuário"
      content="Tem certeza de que deseja remover este usuário permanentemente do banco de dados?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Excluir
        </Button>
      }
    />
  );

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            slotProps={{
              input: {
                id: `${row.id}-checkbox`,
                'aria-label': `${row.id} checkbox`,
              },
            }}
          />
        </TableCell>

        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={row.name} src={row.avatarUrl} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link
                onClick={quickInspectDrawer.onTrue}
                color="inherit"
                sx={{ cursor: 'pointer' }}
              >
                {row.name}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.email}
              </Box>
            </Stack>
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="subtitle2" sx={{ fontFamily: 'monospace' }}>
            {row.aspId}
          </Typography>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.company}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={
              (row.role === 'admin' && 'primary') ||
              (row.role === 'dev' && 'info') ||
              'default'
            }
          >
            {row.role === 'admin' && 'ADMIN'}
            {row.role === 'dev' && 'DEV'}
            {row.role === 'user' && 'USER'}
          </Label>
        </TableCell>

        <TableCell>
          <Tooltip
            title={
              row.kycStatus === 'draft' ? 'Não Iniciado' :
                row.kycStatus === 'pending' ? 'Pendente' :
                  row.kycStatus === 'under_review' ? 'Em Análise' :
                    row.kycStatus === 'approved' ? 'Verificado' :
                      row.kycStatus === 'rejected' ? 'Rejeitado' : 'Expirado'
            }
            placement="top"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <Iconify
                icon={
                  row.kycStatus === 'approved' ? 'solar:check-circle-bold' as any :
                    (row.kycStatus === 'rejected' || row.kycStatus === 'expired') ? 'solar:close-circle-bold' as any :
                      (row.kycStatus === 'pending' || row.kycStatus === 'under_review') ? 'solar:clock-circle-bold' as any :
                        'solar:minus-circle-bold' as any
                }
                sx={{
                  width: 24,
                  height: 24,
                  color:
                    row.kycStatus === 'approved' ? 'success.main' :
                      (row.kycStatus === 'rejected' || row.kycStatus === 'expired') ? 'error.main' :
                        (row.kycStatus === 'pending' || row.kycStatus === 'under_review') ? 'warning.main' :
                          'text.disabled'
                }}
              />
            </Box>
          </Tooltip>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.lastActivity ? fToNow(row.lastActivity) : 'Nunca'}
        </TableCell>

        <TableCell>
          <Tooltip
            title={
              row.status === 'active' ? 'Ativo' :
                row.status === 'pending' ? 'Pendente' :
                  row.status === 'suspended' ? 'Suspenso' :
                    row.status === 'inactive' ? 'Inativo' : 'Bloqueado'
            }
            placement="top"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <Iconify
                icon={
                  row.status === 'active' ? 'solar:check-circle-bold' as any :
                    (row.status === 'suspended' || row.status === 'blocked') ? 'solar:close-circle-bold' as any :
                      row.status === 'pending' ? 'solar:clock-circle-bold' as any :
                        'solar:minus-circle-bold' as any
                }
                sx={{
                  width: 24,
                  height: 24,
                  color:
                    row.status === 'active' ? 'success.main' :
                      (row.status === 'suspended' || row.status === 'blocked') ? 'error.main' :
                        row.status === 'pending' ? 'warning.main' :
                          'text.disabled'
                }}
              />
            </Box>
          </Tooltip>
        </TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>


            <IconButton
              color={menuActions.open ? 'inherit' : 'default'}
              onClick={menuActions.onOpen}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>

      {renderQuickEditForm()}
      {renderMenuActions()}
      {renderConfirmDialog()}
      {renderQuickInspectDrawer()}
    </>
  );
}
