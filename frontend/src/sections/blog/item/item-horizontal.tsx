'use client';

import type { CardProps } from '@mui/material/Card';
import type { IPostItem } from 'src/types/blog';

import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = CardProps & {
  post: IPostItem;
  editHref: string;
  detailsHref: string;
};

export function PostItemHorizontal({ sx, post, editHref, detailsHref, ...other }: Props) {
  const theme = useTheme();
  const menuActions = usePopover();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'bottom-center' } }}
    >
      <MenuList>
        <MenuItem component={RouterLink} href={detailsHref} onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:eye-bold" />
          Ver Detalhes
        </MenuItem>

        <MenuItem component={RouterLink} href={editHref} onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:pen-bold" />
          Editar
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Excluir
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Card
        sx={[
          {
            display: 'flex',
            // 🟢 ESTILO GLASSMORPHISM
            bgcolor: alpha(theme.palette.grey[900], 0.4),
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            transition: theme.transitions.create(['transform', 'box-shadow', 'background-color']),
            '&:hover': {
              bgcolor: alpha(theme.palette.grey[900], 0.6),
              boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.2)}`,
              borderColor: alpha(theme.palette.primary.main, 0.4),
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Stack
          spacing={1}
          sx={{
            flexGrow: 1,
            p: theme.spacing(3, 3, 2, 3),
          }}
        >
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Label
              variant="soft"
              color={String(post.publish) === 'published' ? 'info' : 'default'}
              sx={{ textTransform: 'uppercase', fontFamily: "'Orbitron', sans-serif", fontSize: 10 }}
            >
              {String(post.publish)}
            </Label>

            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {fDate(post.createdAt)}
            </Box>
          </Box>

          <Stack spacing={1} sx={{ flexGrow: 1 }}>
            <Link
              component={RouterLink}
              href={detailsHref}
              color="inherit"
              variant="subtitle2"
              sx={{
                ...theme.mixins.maxLine({ line: 2 }),
                fontFamily: "'Orbitron', sans-serif", // Toque futurista
                fontWeight: 700,
                '&:hover': { color: 'primary.light' },
              }}
            >
              {post.title}
            </Link>

            <Typography
              variant="body2"
              sx={{
                ...theme.mixins.maxLine({ line: 2 }),
                color: 'text.secondary',
              }}
            >
              {post.description}
            </Typography>
          </Stack>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <IconButton
              color={menuActions.open ? 'primary' : 'default'}
              onClick={menuActions.onOpen}
              sx={{ bgcolor: alpha(theme.palette.common.white, 0.05) }}
            >
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>

            <Box
              sx={{
                gap: 1.5,
                flexGrow: 1,
                display: 'flex',
                flexWrap: 'wrap',
                typography: 'caption',
                color: 'text.disabled',
                justifyContent: 'flex-end',
              }}
            >
              <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                <Iconify icon="solar:chat-round-dots-bold" width={16} />
                {fShortenNumber(post.totalComments)}
              </Box>

              <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                <Iconify icon="solar:eye-bold" width={16} />
                {fShortenNumber(post.totalViews)}
              </Box>

              <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                <Iconify icon="solar:share-bold" width={16} />
                {fShortenNumber(post.totalShares)}
              </Box>
            </Box>
          </Box>
        </Stack>

        <Box
          sx={{
            p: 1,
            width: 180,
            height: 'auto',
            flexShrink: 0,
            position: 'relative',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <Avatar
            alt={post.author.name}
            src={post.author.avatarUrl}
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              border: `2px solid ${theme.palette.primary.main}`,
              boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
            }}
          />
          <Image
            alt={post.title}
            src={post.coverUrl}
            sx={{ height: 1, borderRadius: 1.5, filter: 'brightness(0.8)' }}
          />
        </Box>
      </Card>

      {renderMenuActions()}
    </>
  );
}