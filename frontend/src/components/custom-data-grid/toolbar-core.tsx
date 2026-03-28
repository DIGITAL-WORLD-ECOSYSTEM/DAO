'use client';

import type { ButtonProps } from '@mui/material/Button';
import type { Theme, SxProps } from '@mui/material/styles';
import type { IconButtonProps } from '@mui/material/IconButton';
import type { GridToolbarQuickFilterProps } from '@mui/x-data-grid';

import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { useGridApiContext, GridToolbarQuickFilter } from '@mui/x-data-grid';

import { ExportIcon, FilterIcon } from 'src/theme/core/components/mui-x-data-grid';

// ----------------------------------------------------------------------

type BaseProps = Partial<ButtonProps & IconButtonProps>;

export type ToolbarButtonBaseProps = BaseProps & {
  label?: string;
  showLabel?: boolean;
  icon: React.ReactNode;
};

export function ToolbarButtonBase({
  sx,
  label,
  icon,
  showLabel = true,
  ...other
}: ToolbarButtonBaseProps) {
  const Component: React.ElementType = showLabel ? Button : IconButton;

  const baseProps: BaseProps = showLabel ? { size: 'small' } : {};

  return (
    <Tooltip title={label}>
      <Component
        {...baseProps}
        {...other}
        sx={[
          {
            gap: showLabel ? 0.75 : 0,
            '& svg': {
              width: showLabel ? 18 : 20,
              height: showLabel ? 18 : 20,
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {icon}
        {showLabel && label}
      </Component>
    </Tooltip>
  );
}

// ----------------------------------------------------------------------

export function CustomToolbarFilterButton({
  showLabel,
}: Pick<ToolbarButtonBaseProps, 'showLabel'>) {
  const apiRef = useGridApiContext();
  const label = apiRef.current.getLocaleText('toolbarFilters');
  const filterCount = apiRef.current.state.filter.filterModel.items.length;

  return (
    <ToolbarButtonBase
      onClick={() => apiRef.current.showFilterPanel()}
      label={String(label)}
      showLabel={showLabel}
      icon={
        <Badge variant="dot" color="error" badgeContent={filterCount}>
          <FilterIcon />
        </Badge>
      }
    />
  );
}

// ----------------------------------------------------------------------

export function CustomToolbarExportButton({
  showLabel,
}: Pick<ToolbarButtonBaseProps, 'showLabel'>) {
  const apiRef = useGridApiContext();
  const label = apiRef.current.getLocaleText('toolbarExport');
  const csvLabel = apiRef.current.getLocaleText('toolbarExportCSV');

  const { open, anchorEl, onClose, onOpen } = usePopover();

  return (
    <>
      <ToolbarButtonBase
        id="export-menu-trigger"
        aria-controls="export-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={onOpen}
        label={String(label)}
        icon={<ExportIcon />}
        showLabel={showLabel}
      />

      <Menu
        id="export-menu"
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          list: {
            'aria-labelledby': 'export-menu-trigger',
          },
        }}
      >
        <MenuItem
          onClick={() => {
            apiRef.current.exportDataAsCsv();
            onClose();
          }}
        >
          {csvLabel}
        </MenuItem>
      </Menu>
    </>
  );
}

// ----------------------------------------------------------------------

export type CustomToolbarQuickFilterProps = GridToolbarQuickFilterProps & {
  sx?: SxProps<Theme>;
};

export function CustomToolbarQuickFilter({
  sx,
  ...other
}: CustomToolbarQuickFilterProps) {
  return (
    <Box
      sx={[{ width: 1, maxWidth: { md: 260 } }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <GridToolbarQuickFilter {...other} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export const ToolbarContainer = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    alignItems: 'center',
    flexDirection: 'row',
  },
}));

export const ToolbarLeftPanel = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

export const ToolbarRightPanel = styled('div')(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
}));
