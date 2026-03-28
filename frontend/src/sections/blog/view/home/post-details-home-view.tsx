'use client';

import type { IPostItem, IPostComment } from 'src/types/blog';

import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { paths } from 'src/routes/paths';

import { fShortenNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { JsonLd, generateBreadcrumbs } from 'src/components/seo/json-ld';

// CORREÇÃO DOS CAMINHOS: Subindo dois níveis (../../) para achar os componentes
import { PostItem } from '../../item/item';
import { PostCommentForm } from '../../forms/post-comment-form';
import { PostCommentList } from '../../details/post-comment-list';
import { PostDetailsHero } from '../../details/post-details-hero';

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
  gap: 24,
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
};

// ----------------------------------------------------------------------

export function PostDetailsHomeView({ post, latestPosts }: Props) {
  const [isFavorited, setIsFavorited] = useState<boolean>(true);

  const [favoritesCount, setFavoritesCount] = useState<number>(
    Number(post?.totalFavorites ?? 0)
  );

  const title = post?.title ?? '';
  const description = post?.description ?? '';
  const content = post?.content ?? '';
  const coverUrl = post?.coverUrl ?? '';
  const createdAt = post?.createdAt;
  const author = post?.author;

  const tags = post?.tags ?? [];
  const favoritePeople = post?.favoritePerson ?? [];
  const comments: IPostComment[] = post?.comments ?? [];

  const recentPosts = useMemo(() => {
    const latest = latestPosts ?? [];
    return latest.slice(-4);
  }, [latestPosts]);

  const handleToggleFavorite = useCallback(() => {
    setIsFavorited((prev) => {
      const next = !prev;
      setFavoritesCount((count) => (next ? count + 1 : Math.max(0, count - 1)));
      return next;
    });
  }, []);

  const breadcrumbs = useMemo(() => {
    const base = [
      { name: 'Home', href: '/' },
      { name: 'Blog', href: paths.post.root },
    ];

    if (title) {
      base.push({
        name: title,
        href: paths.post.details(title),
      });
    }

    return base;
  }, [title]);

  return (
    <>
      <JsonLd schema={generateBreadcrumbs(breadcrumbs)} />

      <PostDetailsHero
        title={title}
        author={author}
        coverUrl={coverUrl}
        createdAt={createdAt}
      />

      <Container
        maxWidth={false}
        sx={(theme) => ({
          py: 3,
          mb: 5,
          borderBottom: `solid 1px ${theme.palette.divider}`,
        })}
      >
        <CustomBreadcrumbs
          links={breadcrumbs}
          sx={{ maxWidth: 720, mx: 'auto' }}
        />
      </Container>

      <Container maxWidth={false}>
        <Stack sx={{ maxWidth: 720, mx: 'auto' }}>
          {!!description && (
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {description}
            </Typography>
          )}

          {!!content && <Markdown>{content}</Markdown>}

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

          <Box sx={{ mb: 3, mt: 5, display: 'flex', gap: 1 }}>
            <Typography variant="h4">Comments</Typography>
            <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
              ({comments.length})
            </Typography>
          </Box>

          <PostCommentForm />

          <Divider sx={{ mt: 5, mb: 2 }} />

          <PostCommentList comments={comments} />
        </Stack>
      </Container>

      {!!recentPosts.length && (
        <Container sx={{ pb: 15 }}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Recent Posts
          </Typography>

          <Box sx={gridStyles}>
            {recentPosts.map((latestPost) => (
              <PostItem
                key={latestPost.id}
                post={latestPost}
                detailsHref={paths.post.details(latestPost.title)}
              />
            ))}
          </Box>
        </Container>
      )}
    </>
  );
}