'use client';

import type { ISoFiItem } from 'src/types/blog';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { SoFiItemSkeleton } from './skeleton';
import { SoFiItemHorizontal } from './item-horizontal';

// ----------------------------------------------------------------------

type Props = {
  sofi: ISoFiItem[];
  loading?: boolean;
};

export function SoFiListHorizontal({ sofi, loading }: Props) {
  const theme = useTheme();

  const renderLoading = () => (
    <>
      {[...Array(4)].map((_, index) => (
        <SoFiItemSkeleton key={index} variant="horizontal" />
      ))}
    </>
  );

  const renderList = () =>
    sofi.map((post) => (
      <SoFiItemHorizontal
        key={post.id}
        post={post}
        detailsHref={paths.dashboard.sofi.details(post.title)}
        editHref={paths.dashboard.sofi.edit(post.title)}
      />
    ));

  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          bgcolor: 'transparent', // Garante que o grid não bloqueie o SpaceScene
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
        }}
      >
        {loading ? renderLoading() : renderList()}
      </Box>

      {sofi.length > 0 && (
        <Pagination
          count={Math.ceil(sofi.length / 8)}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
              // Estilização para legibilidade sobre o background espacial
              '& .MuiPaginationItem-root': {
                color: 'common.white',
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 600,
                border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                bgcolor: alpha(theme.palette.common.white, 0.03),
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                },
                '&.Mui-selected': {
                  color: 'common.white',
                  bgcolor: theme.palette.primary.main,
                  boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                },
              },
            },
          }}
        />
      )}
    </>
  );
}