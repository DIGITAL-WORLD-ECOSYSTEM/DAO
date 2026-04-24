'use client';

import type { IPostItem } from 'src/types/blog';

import { useState, useEffect, useCallback } from 'react';

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

import { POST_STATUS_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { favoritePost, useGetPostComments, useGetLatestPosts } from 'src/actions/blog';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';

import { PostDetailsHero } from '../../details/post-details-hero';
import { PostCommentList } from '../../details/post-comment-list';
import { PostCommentForm } from '../../forms/post-comment-form';
import { PostListHorizontal } from '../../item/list-horizontal';
import { PostDetailsToolbar } from '../../details/post-details-toolbar';

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
  const [status, setStatus] = useState<string>('');
  const [favorite, setFavorite] = useState(false);

  const { comments } = useGetPostComments(post?.id || '');
  const { latestPosts, latestPostsLoading } = useGetLatestPosts(post?.slug || '');

  const handleChangeStatus = useCallback((newValue: string) => {
    setStatus(newValue);
  }, []);

  const handleChangeFavorite = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      await favoritePost(post?.id || '');
      setFavorite(event.target.checked);
      toast.success(event.target.checked ? 'Favoritado!' : 'Removido dos favoritos');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao processar ação');
    }
  }, [post?.id]);

  useEffect(() => {
    if (post) {
      setStatus(post.status || 'draft');
    }
  }, [post]);

  const avatars = (post?.favoritePerson || []).map((person) => (
    <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
  ));

  return (
    <DashboardContent maxWidth={false} disablePadding>
      <Container maxWidth={false} sx={{ px: { sm: 5 } }}>
        <PostDetailsToolbar
          backHref={paths.dashboard.post.root}
          editHref={paths.dashboard.post.edit(`${post?.title}`)}
          liveHref={paths.post.details(`${post?.slug}`)}
          status={`${status}`}
          onChangeStatus={handleChangeStatus}
          statusOptions={POST_STATUS_OPTIONS}
        />
      </Container>

      <PostDetailsHero title={`${post?.title}`} coverUrl={`${post?.coverUrl}`} />

      <Box
        sx={{
          pb: 5,
          mx: 'auto',
          maxWidth: 720,
          mt: { xs: 5, md: 10 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 2 }}>{post?.description}</Typography>

        <Markdown>{post?.content || ''}</Markdown>

        <Stack
          spacing={3}
          sx={[
            (theme) => ({
              py: 3,
              my: 5,
              borderTop: `dashed 1px ${theme.vars.palette.divider}`,
              borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
            }),
          ]}
        >
          <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap' }}>
            {post?.tags.map((tag) => (
              <Chip key={tag} label={tag} variant="soft" />
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              label={fShortenNumber(post?.totalFavorites)}
              control={
                <Checkbox
                  checked={favorite}
                  onChange={handleChangeFavorite}
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
            ({comments.length})
          </Typography>
        </Box>

        <PostCommentForm postId={post?.id || ''} />

        <Divider sx={{ mt: 5, mb: 2 }} />

        <PostCommentList comments={comments} />
      </Box>

      {/* Seção de Posts Recentes conforme solicitado na descrição */}
      <Box sx={{ px: { xs: 2, sm: 5 }, pb: 10 }}>
        <Typography variant="h4" sx={{ mb: 5 }}>Recent Posts</Typography>
        <PostListHorizontal posts={latestPosts} loading={latestPostsLoading} />
      </Box>
    </DashboardContent>
  );
}
