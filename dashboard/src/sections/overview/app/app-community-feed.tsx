import type { FeedItem } from 'src/types/home';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

import { fToNow } from 'src/utils/format-time';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  list: FeedItem[];
};

export function AppCommunityFeed({ list, ...other }: Props) {
  return (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }} {...other}>
      {list.map((item) => (
        <FeedItemView key={item.id} item={item} />
      ))}
    </Box>
  );
}

// ----------------------------------------------------------------------

function FeedItemView({ item }: { item: FeedItem }) {
  const getIcon = () => {
    switch (item.type) {
      case 'announcement':
        return { icon: 'solar:megaphone-bold', color: 'info.main' };
      case 'event':
        return { icon: 'solar:calendar-bold', color: 'warning.main' };
      case 'proposal':
        return { icon: 'solar:archive-bold', color: 'primary.main' };
      case 'project':
        return { icon: 'solar:rocket-bold', color: 'success.main' };
      case 'achievement':
        return { icon: 'solar:medal-star-bold', color: 'warning.dark' };
      case 'partnership':
        return { icon: 'solar:hand-shake-bold', color: 'secondary.main' };
      default:
        return { icon: 'solar:bell-bing-bold', color: 'text.secondary' };
    }
  };

  const { icon, color } = getIcon();

  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={
          <Avatar
            alt={item.authorName}
            src={item.authorAvatar}
            sx={{ bgcolor: 'background.neutral', color }}
          >
            {item.authorAvatar ? null : <Iconify icon={icon as any} width={24} />}
          </Avatar>
        }
        title={
          <Typography variant="subtitle2">{item.authorName || 'Equipe Institucional'}</Typography>
        }
        subheader={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {fToNow(item.createdAt)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              •
            </Typography>
            <Typography variant="caption" sx={{ color, fontWeight: 'fontWeightBold' }}>
              {item.type.toUpperCase()}
            </Typography>
          </Stack>
        }
        action={
          <IconButton>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        }
      />

      <Box sx={{ p: 3, pt: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {item.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
          {item.content}
        </Typography>
      </Box>

      {item.mediaUrl && (
        <Box sx={{ p: 1 }}>
          <Image alt={item.title} src={item.mediaUrl} ratio="16/9" sx={{ borderRadius: 1.5 }} />
        </Box>
      )}

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 1 }}>
        <IconButton color="default">
          <Iconify icon="solar:heart-bold" />
        </IconButton>
        <IconButton color="default">
          <Iconify icon="solar:share-bold" />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {item.actionLabel && (
          <Button size="small" variant="contained" color="primary">
            {item.actionLabel}
          </Button>
        )}
      </Box>
    </Card>
  );
}
