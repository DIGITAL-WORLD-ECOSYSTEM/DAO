/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Post List View (Client-Side Filtering & Search)
 * Version: 1.5.7 - Refactored: Background Transparency & UI Consistency
 */

'use client';

import type { IPostItem } from 'src/types/blog';

import { orderBy } from 'es-toolkit';
import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { POST_SORT_OPTIONS } from 'src/_mock';
import { BlogLayout } from 'src/layouts/blog';
import { useGetPosts } from 'src/actions/blog';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PostSort } from '../components/post-sort';
import { PostSearch } from '../components/post-search';
import { PostListHorizontal } from '../item/list-horizontal';

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = ['all', 'published', 'draft'] as const;

type PublishType = (typeof PUBLISH_OPTIONS)[number];

type SortType = 'latest' | 'oldest' | 'popular';

type ViewFilters = {
  publish: PublishType;
};

// ----------------------------------------------------------------------

type Props = {
  posts?: IPostItem[];
};

export function PostListView({ posts: initialPosts }: Props) {
  const theme = useTheme();
  const { posts: fetchedPosts, postsLoading } = useGetPosts();
  
  const posts = useMemo(() => initialPosts || fetchedPosts || [], [initialPosts, fetchedPosts]);

  const [sortBy, setSortBy] = useState<SortType>('latest');
  const [searchQuery, setSearchQuery] = useState('');

  const { state, setState } = useSetState<ViewFilters>({
    publish: 'all',
  });

  const publishCounts = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((post) => post.publish).length,
      draft: posts.filter((post) => !post.publish).length,
    }),
    [posts]
  );

  const searchResults = useMemo(() => {
    if (!searchQuery) return posts;
    return posts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: searchResults,
        filters: state,
        sortBy,
      }),
    [searchResults, state, sortBy]
  );

  const handleFilterPublish = useCallback(
    (_event: React.SyntheticEvent, newValue: PublishType) => {
      setState({ publish: newValue });
    },
    [setState]
  );

  return (
    <BlogLayout sx={{ bgcolor: 'transparent' }}>
      <Box
        sx={{
          position: 'relative',
          zIndex: 1, // Mantém o conteúdo acima do fundo espacial (-1)
          bgcolor: 'transparent',
        }}
      >
        <CustomBreadcrumbs
          heading="Lista de Conteúdos"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Blog', href: paths.dashboard.post.root },
            { name: 'Lista' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.post.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              sx={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.4)}`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                }
              }}
            >
              Novo Post
            </Button>
          }
          sx={{ 
            mb: { xs: 3, md: 5 },
            '& .MuiTypography-h4': { 
              fontFamily: "'Orbitron', sans-serif", 
              fontWeight: 900,
              color: 'common.white',
              textShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
            }
          }}
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

          <PostSort sort={sortBy} onSort={setSortBy} sortOptions={POST_SORT_OPTIONS} />
        </Box>

        <Tabs 
          value={state.publish} 
          onChange={handleFilterPublish} 
          sx={{ 
            mb: { xs: 3, md: 5 },
            '& .MuiTabs-indicator': { bgcolor: 'primary.main' },
            '& .MuiTab-root': { color: alpha(theme.palette.common.white, 0.6) },
            '& .Mui-selected': { color: 'primary.light' },
          }}
        >
          {PUBLISH_OPTIONS.map((tab) => (
            <Tab
              key={tab}
              value={tab}
              iconPosition="end"
              label={tab}
              icon={
                <Label
                  variant={tab === 'all' || tab === state.publish ? 'filled' : 'soft'}
                  color={tab === 'published' ? 'info' : 'default'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {publishCounts[tab]}
                </Label>
              }
              sx={{ textTransform: 'capitalize' }}
            />
          ))}
        </Tabs>

        {/* 📜 LISTAGEM: Agora renderizada sobre o fundo transparente */}
        <PostListHorizontal 
          posts={dataFiltered} 
          loading={postsLoading && posts.length === 0} 
        />
      </Box>
    </BlogLayout>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IPostItem[];
  filters: ViewFilters;
  sortBy: SortType;
};

function applyFilter({ inputData, filters, sortBy }: ApplyFilterProps) {
  let data = [...inputData];

  const { publish } = filters;

  switch (sortBy) {
    case 'latest':
      data = orderBy(data, ['createdAt'], ['desc']);
      break;
    case 'oldest':
      data = orderBy(data, ['createdAt'], ['asc']);
      break;
    case 'popular':
      data = orderBy(data, ['totalViews'], ['desc']);
      break;
    default:
      break;
  }

  if (publish === 'published') {
    data = data.filter((post) => post.publish);
  }
  if (publish === 'draft') {
    data = data.filter((post) => !post.publish);
  }

  return data;
}