import type { NavMainProps } from './main/nav/types';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const navData: NavMainProps['data'] = [
  { title: 'Home', path: '/' },
  { title: 'Ecosystem', path: '/#ecosystem' },
  { title: 'Community', path: '/#community' },
  { title: 'Team', path: '/#team' },
  { title: 'Roadmap', path: '/#roadmap' },
  { title: 'FAQ', path: '/#faqs' },
  { title: 'Blog', path: paths.post.root },
];
