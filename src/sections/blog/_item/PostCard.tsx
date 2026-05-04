'use client';

import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';
import type { IPostItem } from 'src/types/blog';

import { deletePost } from 'src/actions/blog-actions';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import { AvatarShape } from 'src/assets/illustrations';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type PostItemProps = CardProps & {
  post: IPostItem;
  detailsHref: string;
};

export function PostCard({ post, detailsHref, sx, ...other }: PostItemProps) {
  const theme = useTheme();

  return (
    <Card
      sx={[
        {
          // 🟢 ESTILO GLASSMORPHISM AVANÇADO
          bgcolor: alpha('#020817', 0.6),
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden',
          transition: theme.transitions.create(['transform', 'box-shadow', 'background-color']),
          
          // 💎 BORDA REATIVA DE 1PX (Assinatura Elite)
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: '1px',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.5)}, transparent 50%, ${alpha(theme.palette.primary.main, 0.3)})`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            zIndex: 2,
            transition: 'all 0.4s ease-in-out',
          },

          '&:hover': {
            transform: 'translateY(-6px)',
            bgcolor: alpha('#020817', 0.8),
            boxShadow: `0 12px 24px 0 ${alpha(theme.palette.primary.main, 0.25)}`,
            '&::before': {
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ position: 'relative' }}>
        <AvatarShape
          sx={{
            left: 0,
            zIndex: 9,
            width: 88,
            height: 36,
            bottom: -16,
            position: 'absolute',
            color: alpha(theme.palette.grey[900], 0.4), // Combinando com o card
          }}
        />

        <Avatar
          alt={post.author.name}
          src={post.author.avatarUrl}
          sx={{
            left: 24,
            zIndex: 9,
            bottom: -24,
            position: 'absolute',
            border: `2px solid ${theme.palette.primary.main}`,
          }}
        />

        <Image alt={post.title} src={post.coverUrl} ratio="4/3" />
      </Box>

      <CardContent sx={{ pt: 6, color: 'common.white' }}>
        <Typography
          variant="caption"
          component="div"
          sx={{ mb: 1, color: alpha(theme.palette.common.white, 0.5) }}
        >
          {fDate(post.createdAt)}
        </Typography>

        <Link
          component={RouterLink}
          href={detailsHref}
          color="inherit"
          variant="subtitle2"
          sx={{
            ...theme.mixins.maxLine({ line: 2, persistent: theme.typography.subtitle2 }),
            fontFamily: "'Orbitron', sans-serif", // Toque futurista no título do card
            '&:hover': { color: 'primary.light' },
          }}
        >
          {post.title}
        </Link>

        <InfoBlock
          totalViews={post.totalViews}
          totalShares={post.totalShares}
          totalComments={post.totalComments}
          sx={{ color: alpha(theme.palette.common.white, 0.5) }}
        />
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

type PostItemLatestProps = {
  post: IPostItem;
  index: number;
  detailsHref: string;
};

export function PostItemLatest({ post, index, detailsHref }: PostItemLatestProps) {
  const theme = useTheme();
  const postSmall = index === 1 || index === 2;

  return (
    <Card
      sx={{
        bgcolor: 'transparent',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        transition: theme.transitions.create(['transform', 'box-shadow']),
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
        },
      }}
    >
      <Avatar
        alt={post.author.name}
        src={post.author.avatarUrl}
        sx={{
          top: 24,
          left: 24,
          zIndex: 9,
          position: 'absolute',
          border: `2px solid ${theme.palette.primary.main}`,
        }}
      />

      <Image
        alt={post.title}
        src={post.coverUrl}
        ratio="4/3"
        sx={{ height: 360 }}
        slotProps={{
          overlay: {
            sx: (overlayTheme) => ({
              background: `linear-gradient(to bottom, transparent 0%, ${alpha(overlayTheme.palette.grey[900], 0.9)} 100%)`,
            }),
          },
        }}
      />

      <CardContent
        sx={{
          width: 1,
          zIndex: 9,
          bottom: 0,
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <Typography variant="caption" component="div" sx={{ mb: 1, opacity: 0.64 }}>
          {fDate(post.createdAt)}
        </Typography>

        <Link
          component={RouterLink}
          href={detailsHref}
          color="inherit"
          variant={postSmall ? 'subtitle2' : 'h5'}
          sx={{
            ...theme.mixins.maxLine({
              line: 2,
              persistent: postSmall ? theme.typography.subtitle2 : theme.typography.h5,
            }),
            fontFamily: "'Orbitron', sans-serif",
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          {post.title}
        </Link>

        <InfoBlock
          totalViews={post.totalViews}
          totalShares={post.totalShares}
          totalComments={post.totalComments}
          sx={{ opacity: 0.64, color: 'common.white' }}
        />
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

type InfoBlockProps = BoxProps & Pick<IPostItem, 'totalViews' | 'totalShares' | 'totalComments'>;

function InfoBlock({ sx, totalViews, totalShares, totalComments, ...other }: InfoBlockProps) {
  return (
    <Box
      sx={[
        () => ({
          mt: 3,
          gap: 1.5,
          display: 'flex',
          typography: 'caption',
          color: 'text.disabled',
          justifyContent: 'flex-end',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
        <Iconify width={16} icon="solar:chat-round-dots-bold" />
        {fShortenNumber(totalComments)}
      </Box>

      <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
        <Iconify width={16} icon="solar:eye-bold" />
        {fShortenNumber(totalViews)}
      </Box>

      <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
        <Iconify width={16} icon="solar:share-bold" />
        {fShortenNumber(totalShares)}
      </Box>
    </Box>
  );
}
