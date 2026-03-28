'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { varFade, MotionViewport } from 'src/components/animate';
import { Image } from 'src/components/image';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaHref?: string;
};

/**
 * Secção: Publicidade (PostAdvertisement)
 * Banner atualizado para o padrão Deep Space / Crystal 2026.
 */
export function PostAdvertisement({
  title = 'Anuncie no Maior Portal Cripto',
  description = 'Alcance milhares de investidores e entusiastas do ecossistema blockchain todos os dias.',
  imageUrl = '/assets/illustrations/illustration-crypto-ads.svg',
  ctaText = 'Saiba Mais',
  ctaHref = '#',
}: Props) {
  const theme = useTheme();

  return (
    <Box 
      component="section" 
      sx={{ 
        py: { xs: 5, md: 10 }, 
        bgcolor: 'transparent',
        position: 'relative' 
      }}
    >
      <Container component={MotionViewport}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            p: { xs: 5, md: 8 },
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            color: 'common.white',
            // 🟢 FUNDO DEEP SPACE (NAVY + VIDRO)
            bgcolor: alpha('#020817', 0.8),
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            
            // 💎 BORDA REATIVA DO BANNER (CIANO -> ÂMBAR)
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              padding: '1px',
              background: `linear-gradient(180deg, 
                ${alpha(theme.palette.primary.main, 1)} 0%, 
                ${alpha(theme.palette.common.white, 0.05)} 50%, 
                ${alpha(theme.palette.primary.main, 0.6)} 100%
              )`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              zIndex: 2,
            },
            boxShadow: `0 0 40px ${alpha(theme.palette.primary.main, 0.15)}`,
          }}
        >
          {/* Conteúdo do Banner */}
          <Stack
            spacing={3}
            sx={{
              zIndex: 9,
              textAlign: { xs: 'center', md: 'left' },
              maxWidth: { md: 480 },
            }}
          >
            <m.div variants={varFade('inLeft')}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 900,
                  fontFamily: "'Orbitron', sans-serif",
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  textShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.35)}`,
                }}
              >
                {title}
              </Typography>
            </m.div>

            <m.div variants={varFade('inLeft')}>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#919EAB', 
                  fontFamily: "'Public Sans', sans-serif",
                  lineHeight: 1.6 
                }}
              >
                {description}
              </Typography>
            </m.div>

            <m.div variants={varFade('inUp')}>
              {/* 🟢 BOTÃO ESTILO CRYSTAL ESMERALDA (REATIVO) */}
              <Button
                variant="contained"
                size="large"
                href={ctaHref}
                sx={{
                  alignSelf: { xs: 'center', md: 'flex-start' },
                  height: 54,
                  px: 4,
                  fontSize: 15,
                  fontWeight: 800,
                  fontFamily: "'Orbitron', sans-serif",
                  textTransform: 'uppercase',
                  borderRadius: 1.5,
                  position: 'relative',
                  // Fundo translúcido para efeito de vidro no botão
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'common.white',
                  border: 'none',
                  // Borda reativa de 1px interna ao botão
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'inherit',
                    padding: '1px',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.2)})`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  },
                  transition: theme.transitions.create(['all']),
                  '&:hover': { 
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    boxShadow: `0 0 25px ${alpha(theme.palette.primary.main, 0.5)}`,
                    transform: 'translateY(-2px)'
                  },
                }}
              >
                {ctaText}
              </Button>
            </m.div>
          </Stack>

          {/* Imagem com Drop Shadow Neon */}
          <Box
            component={m.div}
            variants={varFade('inRight')}
            sx={{
              mt: { xs: 5, md: 0 },
              width: { xs: 240, md: 320 },
              zIndex: 9,
              filter: `drop-shadow(0 0 25px ${alpha(theme.palette.primary.main, 0.3)})`
            }}
          >
            <Image alt="Publicidade" src={imageUrl} />
          </Box>

          {/* Efeito Glow de Fundo (Nebulosa) */}
          <Box
            sx={{
              top: -80,
              right: -80,
              width: 320,
              height: 320,
              opacity: 0.2,
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: 'primary.main',
              filter: 'blur(100px)',
              zIndex: 0,
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
}