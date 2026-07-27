'use client';

import type { IPostItem } from 'src/types/blog';

import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import { alpha, styled, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { paths } from 'src/routes/paths';

import { fShortenNumber } from 'src/utils/format-number';

import { favoritePost, useGetPostComments } from 'src/actions/blog-actions';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { JsonLd, generateBreadcrumbs, generateArticleSchema } from 'src/components/seo/json-ld';

import { PostCard } from '../../_item/PostCard';
import { PostCommentForm } from '../../_forms/PostCommentForm';
import { PostCommentList } from '../../_details/PostCommentList';
import { PostDetailsHero } from '../../_details/PostDetailsHero';

// ----------------------------------------------------------------------

type Props = {
  post?: IPostItem;
  latestPosts?: IPostItem[];
};

const StyledAvatarGroup = styled(AvatarGroup)(() => ({
  [`& .${avatarGroupClasses.avatar}`]: {
    width: 32,
    height: 32,
  },
}));

const gridStyles = {
  display: 'grid',
  gap: 3,
  gridTemplateColumns: {
    xs: 'repeat(1, 1fr)',
    sm: 'repeat(2, 1fr)',
    md: 'repeat(4, 1fr)',
  },
};

// ----------------------------------------------------------------------

export function PostDetailsHomeView({ post, latestPosts }: Props) {
  const theme = useTheme();
  const [isFavorited, setIsFavorited] = useState<boolean>(true);

  const [favoritesCount, setFavoritesCount] = useState<number>(Number(post?.totalFavorites ?? 0));

  const title = post?.title ?? '';
  const description = post?.description ?? '';
  const content = post?.content ?? '';
  const coverUrl = post?.coverUrl ?? '';
  const createdAt = post?.createdAt;
  const author = post?.author;

  const tags = post?.tags ?? [];
  const favoritePeople = post?.favoritePerson ?? [];
  const { comments, commentsEmpty } = useGetPostComments(post?.id || '');

  const handleToggleFavorite = useCallback(async () => {
    try {
      await favoritePost(post?.id || '');
      setIsFavorited((prev) => {
        const next = !prev;
        setFavoritesCount((count) => (next ? count + 1 : Math.max(0, count - 1)));
        return next;
      });
    } catch (error) {
      console.error(error);
    }
  }, [post?.id]);

  const recentPosts = useMemo(() => {
    const latest = latestPosts ?? [];
    return latest.slice(-4);
  }, [latestPosts]);

  const breadcrumbs = useMemo(() => {
    const base = [
      { name: 'Home', href: '/' },
      { name: 'News', href: paths.news.root },
    ];

    if (title) {
      base.push({
        name: title,
        href: paths.post.details(post?.slug || title),
      });
    }

    return base;
  }, [title]);

  return (
    <Box sx={{ bgcolor: 'transparent', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <JsonLd schema={generateBreadcrumbs(breadcrumbs)} />

      {/* JSON-LD: Article Schema (Google Rich Results) */}
      {post && (
        <JsonLd
          schema={generateArticleSchema({
            title,
            description,
            coverUrl,
            createdAt: createdAt ? String(createdAt) : new Date().toISOString(),
            authorName: author?.name || 'ASPPIBRA Editorial',
            url: `/post/${post.slug || ''}`,
          })}
        />
      )}

      {/* ZONA 1: HERO — Mantém efeito full-bleed premium */}
      <PostDetailsHero title={title} author={author} coverUrl={coverUrl} createdAt={createdAt} />

      {/* ZONA 2: ÁREA DE LEITURA — Fundo sólido para legibilidade */}
      <Box
        sx={(theme) => ({
          bgcolor: alpha('#020817', 0.9), // 🟢 Fundo escuro premium para leitura
          backdropFilter: 'blur(10px)',
          borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          pt: 5,
          pb: 8,
          position: 'relative',
          zIndex: 1,
        })}
      >
        <Container maxWidth="md">
          <CustomBreadcrumbs
            links={breadcrumbs}
            sx={{ mb: 5, maxWidth: 720, mx: 'auto' }}
          />

          <Stack sx={{ maxWidth: 720, mx: 'auto' }}>
            {/* Descrição / Resumo */}
            {!!description && (
              <Typography
                variant="h6"
                sx={(theme) => ({
                  mb: 4,
                  color: 'text.secondary',
                  fontStyle: 'italic',
                  lineHeight: 1.8,
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  pl: 2.5,
                  fontFamily: "'Public Sans', sans-serif",
                })}
              >
                {description}
              </Typography>
            )}

            {/* Corpo do artigo em Markdown */}
            {!!content && (
              <Box
                sx={(theme) => ({
                  // Tipografia do corpo do artigo
                  '& p': {
                    fontSize: 17,
                    lineHeight: 1.9,
                    color: 'common.white', // 🟢 Forçando branco
                    mb: 2.5,
                    fontFamily: "'Public Sans', sans-serif",
                  },
                  '& h2': {
                    fontSize: { xs: 22, md: 26 },
                    fontWeight: 800,
                    mt: 5,
                    mb: 2,
                    color: 'common.white',
                    fontFamily: "'Orbitron', sans-serif",
                  },
                  '& h3': {
                    fontSize: { xs: 18, md: 21 },
                    fontWeight: 700,
                    mt: 4,
                    mb: 1.5,
                    color: 'common.white',
                    fontFamily: "'Orbitron', sans-serif",
                  },
                  '& ul, & ol': {
                    pl: 3,
                    mb: 2.5,
                    '& li': {
                      fontSize: 16,
                      lineHeight: 1.8,
                      mb: 1,
                      color: 'text.primary',
                    },
                  },
                  '& strong': { color: 'text.primary', fontWeight: 700 },
                  '& blockquote': {
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    pl: 2.5,
                    py: 0.5,
                    my: 3,
                    color: 'text.secondary',
                    fontStyle: 'italic',
                    bgcolor: 'action.hover',
                    borderRadius: '0 8px 8px 0',
                  },
                  '& hr': {
                    border: 'none',
                    borderTop: `1px dashed ${theme.palette.divider}`,
                    my: 4,
                  },
                  '& img': {
                    maxWidth: '100%',
                    borderRadius: 2,
                    my: 3,
                  },
                  '& code': {
                    px: 0.75,
                    py: 0.25,
                    borderRadius: 0.75,
                    fontSize: 14,
                    bgcolor: 'action.selected',
                    color: 'primary.main',
                    fontFamily: 'monospace',
                  },
                  '& pre': {
                    bgcolor: 'grey.900',
                    color: 'common.white',
                    p: 3,
                    borderRadius: 2,
                    overflowX: 'auto',
                    my: 3,
                    '& code': { bgcolor: 'transparent', color: 'inherit', p: 0 },
                  },
                })}
              >
                <Markdown>{content}</Markdown>
              </Box>
            )}

            {/* Tags e Favoritos */}
            <Stack
              spacing={3}
              sx={(theme) => ({
                py: 3,
                my: 5,
                borderTop: `dashed 1px ${theme.palette.divider}`,
                borderBottom: `dashed 1px ${theme.palette.divider}`,
              })}
            >
              {!!tags.length && (
                <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap' }}>
                  {tags.map((tag) => (
                    <Chip key={tag} label={tag} variant="soft" />
                  ))}
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  label={fShortenNumber(favoritesCount)}
                  control={
                    <Checkbox
                      checked={isFavorited}
                      onChange={handleToggleFavorite}
                      size="small"
                      color="error"
                      icon={<Iconify icon="solar:heart-bold" />}
                      checkedIcon={<Iconify icon="solar:heart-bold" />}
                    />
                  }
                  sx={{ mr: 1 }}
                />

                {!!favoritePeople.length && (
                  <StyledAvatarGroup>
                    {favoritePeople.map((person, index) => (
                      <Avatar
                        key={`${person.name ?? 'user'}-${index}`}
                        alt={person.name ?? ''}
                        src={person.avatarUrl}
                      />
                    ))}
                  </StyledAvatarGroup>
                )}
              </Box>
            </Stack>

            {/* Comentários */}
            <Box sx={{ mb: 3, mt: 5, display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Typography variant="h4">Comments</Typography>
              <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                ({comments.length})
              </Typography>
            </Box>

            <PostCommentForm postId={post?.id || ''} />

            <Divider sx={{ mt: 5, mb: 2 }} />

            <PostCommentList comments={comments} />
          </Stack>
        </Container>
      </Box>

      {/* ZONA 3: POSTS RECENTES — Padronizado com o tema Space */}
      {!!recentPosts.length && (
        <Box 
          sx={{ 
            py: 12, 
            position: 'relative', 
            zIndex: 1,
            bgcolor: 'transparent' // 🟢 Libera o fundo Space
          }}
        >
          <Container maxWidth="lg">
            <Typography 
              variant="h3" 
              sx={{ 
                mb: 6,
                fontWeight: 900,
                fontFamily: "'Orbitron', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'common.white',
                textShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.35)}`,
              }}
            >
              Artigos Relacionados
            </Typography>

            <Box sx={gridStyles}>
              {recentPosts.map((latestPost: IPostItem) => (
                <PostCard
                  key={latestPost.id}
                  post={latestPost}
                  detailsHref={paths.post.details(latestPost.slug)}
                />
              ))}
            </Box>
          </Container>
        </Box>
      )}
    </Box>
  );
}
