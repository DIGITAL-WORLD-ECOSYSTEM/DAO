import type { DashboardContentProps } from 'src/layouts/dashboard';

import { removeLastSlash } from 'minimal-shared/utils';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  {
    label: 'Perfil Geral',
    icon: <Iconify width={24} icon="solar:user-id-bold" />,
    href: paths.dashboard.user.account,
  },
  {
    label: 'Notificações',
    icon: <Iconify width={24} icon="solar:bell-bing-bold" />,
    href: `${paths.dashboard.user.account}/notifications`,
  },
  {
    label: 'Redes Sociais',
    icon: <Iconify width={24} icon="solar:share-bold" />,
    href: `${paths.dashboard.user.account}/socials`,
  },
  {
    label: 'Segurança',
    icon: <Iconify width={24} icon="ic:round-vpn-key" />,
    href: `${paths.dashboard.user.account}/change-password`,
  },
  {
    label: 'Autenticador 2FA',
    icon: <Iconify width={24} icon={'solar:shield-keyhole-bold' as any} />,
    href: `${paths.dashboard.user.account}/2fa`,
  },
];

// ----------------------------------------------------------------------

export function AccountLayout({ children, ...other }: DashboardContentProps) {
  const pathname = usePathname();

  return (
    <DashboardContent {...other}>
      <CustomBreadcrumbs
        heading="Central de Identidade Digital"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Minha Conta', href: paths.dashboard.user.root },
          { name: 'Identidade Digital' },
        ]}
        sx={{ mb: 3 }}
      />

      <Card
        sx={{
          mb: { xs: 3, md: 5 },
          p: 1,
          borderRadius: 2,
          boxShadow: (theme) => theme.vars.customShadows.z4,
        }}
      >
        <Tabs
          value={removeLastSlash(pathname)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 48,
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTab-root': {
              minHeight: 48,
              minWidth: 120,
              borderRadius: 1.5,
              mx: 0.5,
              transition: 'all 0.3s',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                boxShadow: (theme) => theme.vars.customShadows.primary,
              },
              '&:hover:not(.Mui-selected)': {
                bgcolor: 'background.neutral',
              },
            },
          }}
        >
          {NAV_ITEMS.map((tab) => (
            <Tab
              component={RouterLink}
              key={tab.href}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              value={tab.href}
              href={tab.href}
              sx={{ fontWeight: 'fontWeightSemiBold' }}
            />
          ))}
        </Tabs>
      </Card>

      {children}
    </DashboardContent>
  );
}
