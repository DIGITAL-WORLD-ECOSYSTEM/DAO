import type { NavMainProps } from './main/nav/types';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navData: NavMainProps['data'] = [
  { title: 'Home', path: '/', icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" /> },
  {
    title: 'Dashboard',
    path: CONFIG.auth.redirectPath,
    icon: <Iconify width={22} icon="solar:list-bold" />,
  },
];
