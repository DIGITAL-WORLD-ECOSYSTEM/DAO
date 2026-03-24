
import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  blog: icon('ic-blog'),
  user: icon('ic-user'),
  lock: icon('ic-lock'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  folder: icon('ic-folder'),
  params: icon('ic-params'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  subpaths: icon('ic-subpaths'),
  menuItem: icon('ic-menu-item'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
      { title: 'App', path: paths.dashboard.root, icon: ICONS.dashboard },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'User',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Profile', path: paths.dashboard.user.root },
          { title: 'Cards', path: paths.dashboard.user.cards },
          { title: 'List', path: paths.dashboard.user.list },
          { title: 'Create', path: 'paths.dashboard.user.new' },
          { title: 'Edit', path: paths.dashboard.user.demo.edit },
          { title: 'Account', path: paths.dashboard.user.account, deepMatch: true },
        ],
      },
      {
        title: 'Blog',
        path: paths.dashboard.post.root,
        icon: ICONS.blog,
        children: [
          { title: 'List', path: paths.dashboard.post.root },
          { title: 'Details', path: paths.dashboard.post.demo.details },
          { title: 'Create', path: paths.dashboard.post.new },
          { title: 'Edit', path: paths.dashboard.post.demo.edit },
        ],
      },
    ],
  },
];
