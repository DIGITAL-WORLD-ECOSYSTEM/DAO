'use client';

import type { IPostItem } from 'src/types/blog';

import { orderBy } from 'es-toolkit';
import { useState, useCallback } from 'react';
import { useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { POST_SORT_OPTIONS } from 'src/_mock';
import { useGetPosts, useSearchPosts, useGetBlogStats } from 'src/actions/blog';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PostSort } from '../../components/post-sort';
import { PostSearch } from '../../components/post-search';
import { PostListHorizontal } from '../../item/list-horizontal';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'published', 'draft', 'review', 'archived'] as const;

type StatusType = (typeof STATUS_OPTIONS)[number];

type ViewFilters = {
  status: StatusType;
};

// ----------------------------------------------------------------------

export function PostListView() {
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');

  const { state, setState } = useSetState<ViewFilters>({ status: 'all' });

  const { posts, postsLoading } = useGetPosts({
     status: state.status,
     sortBy,
  });

  const { searchResults } = useSearchPosts(searchQuery);

  const { stats } = useGetBlogStats();

  const dataFiltered = applyFilter({
    inputData: searchQuery ? searchResults : posts,
    filters: state,
    sortBy,
  });

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: StatusType) => {
      setState({ status: newValue });
    },
    [setState]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Blog', href: paths.dashboard.post.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.post.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add post
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box
        sx={{
          gap: 3,
          display: 'flex',
          mb: { xs: 3, md: 5 },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-end', sm: 'center' },
        }}
      >
        <PostSearch
          query={searchQuery}
          results={searchResults}
          onSearch={setSearchQuery}
          redirectPath={(title: string) => paths.dashboard.post.details(title)}
        />

        <PostSort
          sort={sortBy}
          onSort={(newValue: string) => setSortBy(newValue)}
          sortOptions={POST_SORT_OPTIONS}
        />
      </Box>

      <Tabs value={state.status} onChange={handleFilterStatus} sx={{ mb: { xs: 3, md: 5 } }}>
        {STATUS_OPTIONS.map((tab) => (
          <Tab
            key={tab}
            iconPosition="end"
            value={tab}
            label={tab}
            icon={
              <Label
                variant={((tab === 'all' || tab === state.status) && 'filled') || 'soft'}
                color={(tab === 'published' && 'info') || (tab === 'review' && 'warning') || 'default'}
              >
                {tab === 'all' && stats.all}
                {tab === 'published' && stats.published}
                {tab === 'draft' && stats.draft}
                {tab === 'review' && stats.review}
                {tab === 'archived' && stats.archived}
              </Label>
            }
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </Tabs>

      <PostListHorizontal posts={dataFiltered} loading={postsLoading} />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IPostItem[];
  filters: ViewFilters;
  sortBy: string;
};

function applyFilter({ inputData, filters, sortBy }: ApplyFilterProps) {
  // Nota: A filtragem agora é feita predominantemente no lado do servidor via useGetPosts(params)
  // Mas mantemos a lógica caso queira ordenação local adicional.
  const { status } = filters;

  if (sortBy === 'latest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    inputData = orderBy(inputData, ['createdAt'], ['asc']);
  }

  if (sortBy === 'popular') {
    inputData = orderBy(inputData, ['totalViews'], ['desc']);
  }

  if (status && status !== 'all') {
    inputData = inputData.filter((post) => post.status === status);
  }

  return inputData;
}
