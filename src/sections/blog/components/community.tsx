'use client';

import { m } from 'framer-motion';

// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

// components
import { Image } from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const COMMUNITIES = [
  { name: 'CoinTelegraph', logo: '/assets/icons/communities/cointelegraph.svg', url: 'https://cointelegraph.com' },
  { name: 'Binance Academy', logo: '/assets/icons/communities/binance.svg', url: 'https://academy.binance.com' },
  { name: 'Ethereum Org', logo: '/assets/icons/communities/eth.svg', url: 'https://ethereum.org' },
  { name: 'CoinDesk', logo: '/assets/icons/communities/coindesk.svg', url: 'https://coindesk.com' },
  { name: 'CryptoPanic', logo: '/assets/icons/communities/cryptopanic.svg', url: 'https://cryptopanic.com' },
  { name: 'Solana Foundation', logo: '/assets/icons/communities/solana.svg', url: 'https://solana.com' },
];

export function PostCommunity() {
  const theme = useTheme();

  const renderMarqueeRow = (reverse = false) => (
    <Box
      sx={{
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
        // Máscara de gradiente para suavizar bordas laterais
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        py: 1.5,
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <Stack
          key={index}
          component={m.div}
          direction="row"
          spacing={3}
          sx={{ px: 1.5, flexShrink: 0 }}
          animate={{ x: reverse ? ['-100%', '0%'] : ['0%', '-100%'] }}
          transition={{
            duration: 60, // Velocidade premium suavizada
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {COMMUNITIES.map((community) => (
            <Box
              key={`${index}-${community.name}`}
              component="a"
              href={community.url}
              target="_blank"
              rel="noopener"
              sx={{
                p: 3,
                width: 180,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden',
                // 🟢 FUNDO DEEP SPACE SCIFI
                bgcolor: alpha('#020817', 0.7),
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                
                // 💎 BORDA REATIVA DE 1PX (Assinatura Visual)
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 'inherit',
                  padding: '1px',
                  background: `linear-gradient(180deg, 
                    ${alpha(theme.palette.info.main, 0.8)} 0%, 
                    ${alpha(theme.palette.common.white, 0.05)} 50%, 
                    ${alpha(theme.palette.warning.main, 0.8)} 100%
                  )`,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  zIndex: 2,
                },

                transition: theme.transitions.create(['all']),
                '&:hover': {
                  bgcolor: alpha(theme.palette.info.main, 0.08),
                  transform: 'translateY(-8px)',
                  boxShadow: `0 0 25px ${alpha(theme.palette.info.main, 0.3)}`,
                  '&::before': {
                    background: `linear-gradient(180deg, 
                      ${theme.palette.info.main} 0%, 
                      ${alpha(theme.palette.common.white, 0.2)} 50%, 
                      ${theme.palette.info.main} 100%
                    )`,
                  }
                },
              }}
            >
              <Image 
                alt={community.name} 
                src={community.logo} 
                sx={{ 
                  width: 48, 
                  height: 48, 
                  mb: 2,
                  zIndex: 3,
                  filter: `drop-shadow(0 0 12px ${alpha(theme.palette.info.main, 0.4)})`
                }} 
              />
              <Typography 
                variant="subtitle2" 
                noWrap 
                sx={{ 
                  zIndex: 3,
                  color: 'common.white',
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: 11,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                {community.name}
              </Typography>
            </Box>
          ))}
        </Stack>
      ))}
    </Box>
  );

  return (
    <Box 
      component="section" 
      sx={{ 
        py: { xs: 8, md: 12 },
        bgcolor: 'transparent',
        position: 'relative'
      }}
    >
      <Container component={MotionViewport}>
        <Stack spacing={6}>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <m.div variants={varFade('inDown')}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 900, 
                  fontFamily: "'Orbitron', sans-serif",
                  textTransform: 'uppercase',
                  color: 'common.white',
                  letterSpacing: '0.05em',
                  textShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                }}
              >
                Comunidades Cripto
              </Typography>
            </m.div>
            
            <m.div variants={varFade('inUp')}>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'grey.400', 
                  maxWidth: 600, 
                  mx: 'auto',
                  fontFamily: "'Public Sans', sans-serif"
                }}
              >
                Monitorizamos os principais ecossistemas globais em tempo real para trazer insights exclusivos.
              </Typography>
            </m.div>
          </Stack>

          <Stack spacing={2}>
            <m.div variants={varFade('inRight')}>
              {renderMarqueeRow(false)}
            </m.div>
            
            <m.div variants={varFade('inLeft')}>
              {renderMarqueeRow(true)}
            </m.div>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}