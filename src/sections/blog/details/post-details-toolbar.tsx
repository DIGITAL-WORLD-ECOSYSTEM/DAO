/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Post Details Toolbar (Admin Actions)
 * Version: 1.4.8 - Fix: Strict type alignment & UI Stability
 */

import type { BoxProps } from '@mui/material/Box';

import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  backHref: string;
  editHref: string;
  liveHref: string;
  /** * ✅ TIPAGEM ROBUSTA: 
   * Definimos como string para aceitar os estados 'published' e 'draft' tratados na View.
   */
  publish: string;
  onChangePublish: (newValue: string) => void;
  publishOptions: { value: string; label: string }[];
};

export function PostDetailsToolbar({
  sx,
  publish,
  backHref,
  editHref,
  liveHref,
  publishOptions,
  onChangePublish,
  ...other
}: Props) {
  const menuActions = usePopover();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'top-right' } }}
    >
      <MenuList>
        {publishOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === publish}
            onClick={() => {
              menuActions.onClose();
              onChangePublish(option.value);
            }}
            sx={{ gap: 1 }}
          >
            {option.value === 'published' && <Iconify icon="eva:cloud-upload-fill" width={20} />}
            {option.value === 'draft' && <Iconify icon="solar:file-text-bold" width={20} />}
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Box
        sx={[
          { gap: 1.5, display: 'flex', alignItems: 'center', mb: { xs: 3, md: 5 } },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Button
          component={RouterLink}
          href={backHref}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          Back
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {/* ✅ LÓGICA DE VISIBILIDADE: Só exibe o link 'Live' se estiver publicado */}
        {publish === 'published' && (
          <Tooltip title="Ver no site público">
            <IconButton component={RouterLink} href={liveHref} color="primary">
              <Iconify icon="eva:external-link-fill" />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Editar Postagem">
          <IconButton component={RouterLink} href={editHref}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>

        <Button
          color="inherit"
          variant="contained"
          /** ✅ ESTABILIDADE: loadingIndicator evita saltos de layout durante trocas de estado */
          loading={!publish}
          loadingIndicator="Carregando..."
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          onClick={menuActions.onOpen}
          sx={{ textTransform: 'capitalize' }}
        >
          {publish || 'Status'}
        </Button>
      </Box>

      {renderMenuActions()}
    </>
  );
}