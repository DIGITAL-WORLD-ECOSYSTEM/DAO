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

export function useNavData(role?: string) {
  const data: NavSectionProps['data'] = [
    /**
     * Overview
     */
    {
      subheader: 'Overview',
      items: [{ title: 'App', path: paths.dashboard.root, icon: ICONS.dashboard }],
    },
    /**
     * Management (Visível apenas para Admin e Partner)
     */
    ...(role === 'admin' || role === 'partner'
      ? [
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
                  { title: 'Create', path: paths.dashboard.user.new },
                  { title: 'Account', path: paths.dashboard.user.account, deepMatch: true },
                ],
              },
              {
                title: 'Blog',
                path: paths.dashboard.post.root,
                icon: ICONS.blog,
                children: [
                  { title: 'List', path: paths.dashboard.post.root },
                  { title: 'Create', path: paths.dashboard.post.new },
                ],
              },
            ],
          },
        ]
      : []),
    /**
     * Ecosystem (DAO Core)
     */
    {
      subheader: 'Ecosystem',
      items: [
        { title: 'Governance', path: paths.dashboard.governance, icon: ICONS.label },
        { title: 'Treasury', path: paths.dashboard.treasury, icon: ICONS.analytics },
        { title: 'Bounties', path: paths.dashboard.bounties, icon: ICONS.blank },
      ],
    },
    /**
     * Personal (Visível para todos)
     */
    {
      subheader: 'Personal',
      items: [
        { title: 'My Profile', path: paths.dashboard.user.root, icon: ICONS.user },
        { title: 'Citizenship', path: paths.dashboard.user.cards, icon: ICONS.label },
      ],
    },
  ];

  return data;
}
