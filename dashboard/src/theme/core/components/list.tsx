import type { Theme, Components } from '@mui/material/styles';

import { listItemIconClasses } from '@mui/material/ListItemIcon';

// ----------------------------------------------------------------------

const MuiListItemButton: Components<Theme>['MuiListItemButton'] = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(0.75, 1.25),
      borderRadius: Number(theme.shape.borderRadius) * 0.75,
      '&:hover': {
        backgroundColor: theme.vars.palette.action.hover,
      },
      '&.Mui-selected': {
        backgroundColor: theme.vars.palette.action.selected,
        [`& .${listItemIconClasses.root}`]: {
          color: theme.vars.palette.primary.main,
        },
      },
    }),
  },
};

const MuiListItemText: Components<Theme>['MuiListItemText'] = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    slotProps: {
      primary: { variant: 'subtitle2' },
      secondary: { variant: 'caption' },
    },
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: { marginTop: 0, marginBottom: 0 },
    multiline: { marginTop: 0, marginBottom: 0 },
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const list: Components<Theme> = {
  MuiListItemText,
  MuiListItemButton,
};
