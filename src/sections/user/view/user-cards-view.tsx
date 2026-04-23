'use client';

import Button from '@mui/material/Button';

import LinearProgress from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _userCards } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CONFIG } from 'src/global-config';
import { useGetCitizens } from 'src/actions/citizen';

import { UserCardList } from '../user-card-list';

// ----------------------------------------------------------------------

export function UserCardsView() {
  const { citizens, citizensLoading } = useGetCitizens();

  const userCards = citizens.map((c) => ({
    id: c.id,
    name: `${c.firstName} ${c.lastName}`,
    role: c.cargoOsc || 'Membro',
    avatarUrl: c.avatarUrl,
    coverUrl: CONFIG.assets.fallback.banner,
    totalPosts: 0,
    totalFollowers: 0,
    totalFollowing: 0,
  }));

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.user.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add user
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {citizensLoading && (
        <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, width: 1, zIndex: 10 }} />
      )}

      <UserCardList users={userCards} />
    </DashboardContent>
  );
}
