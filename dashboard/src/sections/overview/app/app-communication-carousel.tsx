import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';
import type { HomeAnnouncement } from 'src/types/home';

import { useMemo } from 'react';
import Autoplay from 'embla-carousel-autoplay';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { Image } from 'src/components/image';
import {
  Carousel,
  useCarousel,
  CarouselDotButtons,
  CarouselArrowBasicButtons,
} from 'src/components/carousel';

// ----------------------------------------------------------------------

const PRIORITY_WEIGHT = {
  critical: 4,
  high: 3,
  normal: 2,
  low: 1,
};

type Props = CardProps & {
  list: HomeAnnouncement[];
};

export function AppCommunicationCarousel({ list, sx, ...other }: Props) {
  const carousel = useCarousel({ loop: true }, [Autoplay({ playOnInit: true, delay: 6000 })]);

  // Motor de Lógica: Filtra vencidos e ordena por prioridade
  const activeAnnouncements = useMemo(() => {
    const now = new Date().getTime();

    const valid = list.filter((item) => {
      if (!item.published) return false;
      const start = new Date(item.startsAt).getTime();
      const end = new Date(item.endsAt).getTime();
      return now >= start && now <= end;
    });

    return valid.sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]);
  }, [list]);

  if (!activeAnnouncements.length) return null;

  return (
    <Card sx={[{ bgcolor: 'common.black' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <CarouselDotButtons
        scrollSnaps={carousel.dots.scrollSnaps}
        selectedIndex={carousel.dots.selectedIndex}
        onClickDot={carousel.dots.onClickDot}
        sx={{
          top: 16,
          left: 16,
          position: 'absolute',
          color: 'primary.light',
        }}
      />

      <CarouselArrowBasicButtons
        {...carousel.arrows}
        options={carousel.options}
        sx={{
          top: 8,
          right: 8,
          position: 'absolute',
          color: 'common.white',
        }}
      />

      <Carousel carousel={carousel}>
        {activeAnnouncements.map((item) => (
          <CarouselItem key={item.id} item={item} />
        ))}
      </Carousel>
    </Card>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = BoxProps & {
  item: HomeAnnouncement;
};

function CarouselItem({ item, sx, ...other }: CarouselItemProps) {
  const isCritical = item.priority === 'critical';

  // Fallback image based on priority if no image provided
  const coverUrl = item.image || `${CONFIG.assetsDir}/assets/background/background-5.webp`;

  return (
    <Box
      sx={[
        {
          width: 1,
          position: 'relative',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          p: { xs: 3, md: 5 },
          gap: 2,
          width: 1,
          bottom: 0,
          zIndex: 9,
          display: 'flex',
          position: 'absolute',
          color: 'common.white',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Typography
          variant="overline"
          sx={{
            px: 1,
            py: 0.5,
            bgcolor: 'background.paper',
            borderRadius: 1,
            color: isCritical ? 'error.main' : 'text.primary',
          }}
        >
          {isCritical ? '🚨 URGENTE' : '📰 COMUNICADO'}
        </Typography>

        <Typography variant="h4" sx={{ whiteSpace: 'pre-line' }}>
          {item.title}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: 480 }}>
          {item.description}
        </Typography>

        {item.actionLabel && (
          <Button
            component={RouterLink}
            href={item.actionRoute || '#'}
            variant="contained"
            color={isCritical ? 'error' : 'primary'}
            sx={{ mt: 1 }}
          >
            {item.actionLabel}
          </Button>
        )}
      </Box>

      <Image
        alt={item.title}
        src={coverUrl}
        slotProps={{
          overlay: {
            sx: (theme) => ({
              backgroundImage: `linear-gradient(to bottom, transparent 0%, ${
                isCritical ? theme.vars.palette.error.darker : theme.vars.palette.common.black
              } 90%)`,
              opacity: isCritical ? 0.9 : 0.8,
            }),
          },
        }}
        sx={{ width: 1, height: { xs: 320, xl: 360 } }}
      />
    </Box>
  );
}
