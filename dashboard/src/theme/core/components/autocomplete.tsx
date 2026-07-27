import type { Theme, Components } from '@mui/material/styles';

import { autocompleteClasses } from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

const MuiAutocomplete: Components<Theme>['MuiAutocomplete'] = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    autoHighlight: true,
    slotProps: {
      paper: { elevation: 8 },
      popupIndicator: { size: 'small' },
      clearIndicator: { size: 'small' },
    },
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: { [`& .${autocompleteClasses.popupIndicator}`]: { transform: 'none' } },
    paper: ({ theme }) => ({ boxShadow: theme.vars.customShadows.dialog }),
    listbox: { paddingTop: 0, paddingBottom: 0 },
    option: ({ theme }) => ({
      ...theme.typography.body2,
      padding: theme.spacing(1, 1.5, 1, 1.5),
      borderRadius: Number(theme.shape.borderRadius) * 0.75,
      margin: theme.spacing(0.5, 1, 0.5, 1),
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const autocomplete: Components<Theme> = {
  MuiAutocomplete,
};
