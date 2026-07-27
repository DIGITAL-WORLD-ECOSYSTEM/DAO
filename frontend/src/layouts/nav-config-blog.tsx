import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

import type { NavMainProps } from './main/nav/types';

// ----------------------------------------------------------------------

export const navData: NavMainProps['data'] = [
  {
    title: 'ECONOMIA',
    path: `${paths.news.root}#economia`,
    icon: <Iconify width={22} icon={'solar:economy-bold-duotone' as any} />,
  },
  {
    title: 'TECNOLOGIA',
    path: `${paths.news.root}#tecnologia`,
    icon: <Iconify width={22} icon={'solar:laptop-bold-duotone' as any} />,
  },
  {
    title: 'MEIO AMBIENTE',
    path: `${paths.news.root}#meio-ambiente`,
    icon: <Iconify width={22} icon={'solar:leaf-bold-duotone' as any} />,
  },
  {
    title: 'GEOPOLÍTICA',
    path: `${paths.news.root}#geopolitica`,
    icon: <Iconify width={22} icon={'solar:map-bold-duotone' as any} />,
  },
];
