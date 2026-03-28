/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Post Details View (Client Side)
 * Version: 1.4.6 - Fix: Type safety for publish status (TS2322) & UX Refinement
 */

'use client';

import type { IPostItem } from 'src/types/blog';

import { useState, useCallback } from 'react';

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

import { POST_PUBLISH_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';

import { PostCommentForm } from '../forms/post-comment-form';
import { PostDetailsHero } from '../details/post-details-hero';
import { PostCommentList } from '../details/post-comment-list';
import { PostDetailsToolbar } from '../details/post-details-toolbar';

// ----------------------------------------------------------------------

const StyledAvatarGroup = styled(AvatarGroup)({
  [`& .${avatarGroupClasses.avatar}`]: {
    width: 32,
    height: 32,
  },
});

type Props = {
  post?: IPostItem;
};

export function PostDetailsView({ post }: Props) {
  /**
   * ✅ FIX TS2322 (v1.4.6):
   * O componente PostDetailsToolbar exige que 'publish' seja estritamente uma string.
   * Abaixo, garantimos a conversão de tipos caso o dado venha como booleano ou nulo.
   */
  const [publish, setPublish] = useState<string>(() => {
    if (typeof post?.publish === 'string') return post.publish;
    if (post?.publish === true) return 'published';
    return 'draft';
  });

  const handleChangePublish = useCallback((newValue: string) => {
    setPublish(newValue);
  }, []);

  const avatars = (post?.favoritePerson || []).map((person) => (
    <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
  ));

  return (
    <DashboardContent maxWidth={false} disablePadding>
      <Container maxWidth={false} sx={{ px: { sm: 5 } }}>
        <PostDetailsToolbar
          backHref={paths.dashboard.post.root}
          editHref={paths.dashboard.post.edit(`${post?.title}`)}
          liveHref={paths.post.details(`${post?.title}`)}
          publish={publish}
          onChangePublish={handleChangePublish}
          publishOptions={POST_PUBLISH_OPTIONS}
        />
      </Container>

      <PostDetailsHero title={post?.title || ''} coverUrl={post?.coverUrl || ''} />

      <Box
        sx={{
          pb: 5,
          mx: 'auto',
          maxWidth: 720,
          mt: { xs: 5, md: 10 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {post?.description}
        </Typography>

        <Markdown>{post?.content || ''}</Markdown>

        <Stack
          spacing={3}
          sx={(theme) => ({
            py: 3,
            my: 5,
            borderTop: `dashed 1px ${theme.vars.palette.divider}`,
            borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
          })}
        >
          <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap' }}>
            {post?.tags?.map((tag) => (
              <Chip key={tag} label={tag} variant="soft" />
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              label={fShortenNumber(post?.totalFavorites)}
              control={
                <Checkbox
                  defaultChecked
                  size="small"
                  color="error"
                  icon={<Iconify icon="solar:heart-bold" />}
                  checkedIcon={<Iconify icon="solar:heart-bold" />}
                  slotProps={{
                    input: {
                      id: 'favorite-checkbox',
                      'aria-label': 'Favorite checkbox',
                    },
                  }}
                />
              }
              sx={{ mr: 1 }}
            />

            <StyledAvatarGroup>{avatars}</StyledAvatarGroup>
          </Box>
        </Stack>

        <Box sx={{ mb: 3, mt: 5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h4">Comments</Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            ({post?.comments?.length || 0})
          </Typography>
        </Box>

        <PostCommentForm />

        <Divider sx={{ mt: 5, mb: 2 }} />

        <PostCommentList comments={post?.comments ?? []} />
      </Box>
    </DashboardContent>
  );
}