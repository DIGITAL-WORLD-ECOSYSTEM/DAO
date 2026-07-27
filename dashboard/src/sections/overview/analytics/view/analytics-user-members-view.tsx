import { varAlpha } from 'minimal-shared/utils';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _mock } from 'src/_mock';
import { useGetCitizens } from 'src/actions/identity';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Carousel, useCarousel, CarouselArrowBasicButtons } from 'src/components/carousel';

import { UserCard } from 'src/sections/user/user-card';

// ----------------------------------------------------------------------

export function AnalyticsUserMembersView() {
  const { citizens, citizensLoading } = useGetCitizens();
  const [searchName, setSearchName] = useState('');
  const [statusTab, setStatusTab] = useState('all');

  const STATUS_OPTIONS = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Ativos' },
    { value: 'pending', label: 'Pendentes' },
    { value: 'banned', label: 'Banidos' },
    { value: 'rejected', label: 'Rejeitados' },
  ];

  const handleFilterStatus = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setStatusTab(newValue);
  }, []);

  const handleSearchName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  }, []);

  // Filter citizens based on tab and search text
  const filteredCitizens = useMemo(() => {
    let result = citizens || [];

    if (statusTab !== 'all') {
      result = result.filter((citizen) => citizen.status === statusTab);
    }

    if (searchName) {
      result = result.filter(
        (citizen) =>
          citizen.name.toLowerCase().includes(searchName.toLowerCase()) ||
          citizen.email.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    return result;
  }, [citizens, statusTab, searchName]);

  // Map to IUserCard
  const mappedUserCards = useMemo(
    () =>
      filteredCitizens.map((citizen, index) => ({
        id: citizen.id,
        name: citizen.name,
        role: citizen.role || 'Cidadão',
        avatarUrl: citizen.avatarUrl || _mock.image.avatar(index % 20),
        coverUrl: _mock.image.cover(index % 20),
        totalFollowers: 0,
        totalFollowing: 0,
        totalPosts: 0,
      })),
    [filteredCitizens]
  );

  // Initialize Carousel
  const carousel = useCarousel({
    align: 'start',
    slideSpacing: '24px',
    slidesToShow: {
      xs: 1,
      sm: 2,
      md: 3,
    },
  });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Membros"
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.user.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Novo Membro
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: 5 }}>
        <Tabs
          value={statusTab}
          onChange={handleFilterStatus}
          sx={[
            (theme) => ({
              px: { md: 2.5 },
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }),
          ]}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={((tab.value === 'all' || tab.value === statusTab) && 'filled') || 'soft'}
                  color={
                    (tab.value === 'active' && 'success') ||
                    (tab.value === 'pending' && 'warning') ||
                    (tab.value === 'banned' && 'error') ||
                    'default'
                  }
                >
                  {tab.value === 'all'
                    ? (citizens || []).length
                    : (citizens || []).filter((user) => user.status === tab.value).length}
                </Label>
              }
            />
          ))}
        </Tabs>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ p: 2.5, alignItems: 'center' }}
        >
          <TextField
            fullWidth
            value={searchName}
            onChange={handleSearchName}
            placeholder="Pesquisar membro por nome ou e-mail..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
      </Card>

      {citizensLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>Carregando membros...</Box>
      ) : mappedUserCards.length === 0 ? (
        <Card sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
          Nenhum membro encontrado com os filtros selecionados.
        </Card>
      ) : (
        <Box sx={{ position: 'relative' }}>
          <Stack
            direction="row"
            sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}
          >
            <Typography variant="h5">Galeria de Membros ({mappedUserCards.length})</Typography>
            <CarouselArrowBasicButtons {...carousel.arrows} options={carousel.options} />
          </Stack>

          <Carousel carousel={carousel}>
            {mappedUserCards.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </Carousel>
        </Box>
      )}
    </DashboardContent>
  );
}
