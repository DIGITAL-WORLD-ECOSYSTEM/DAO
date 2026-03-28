'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { varFade, MotionViewport } from 'src/components/animate';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/**
 * Secção 8: Newsletter (PostNewsletter)
 * Bloco de captura de leads adaptado para o tema Space/Glass 2026 com correção de tipagem.
 */
export function PostNewsletter() {
  const theme = useTheme();

  return (
    <Box 
      component="section" 
      sx={{ 
        py: { xs: 8, md: 12 }, 
        bgcolor: 'transparent', // 🟢 Mantém a continuidade do SpaceBackground
        position: 'relative'
      }}
    >
      <Container component={MotionViewport}>
        <Stack
          spacing={5}
          alignItems="center"
          sx={{
            px: { xs: 3, md: 8 },
            py: { xs: 8, md: 10 },
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
            color: 'common.white',
            // 🟢 EFEITO GLASSMORPHISM AVANÇADO
            bgcolor: alpha(theme.palette.grey[900], 0.4),
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            boxShadow: `0 0 40px ${alpha(theme.palette.primary.main, 0.15)}`,
          }}
        >
          {/* Elementos Visuais de Fundo (Nebulosa Interna) */}
          <Box
            sx={{
              top: -120,
              right: -120,
              width: 320,
              height: 320,
              opacity: 0.3,
              borderRadius: '50%',
              position: 'absolute',
              filter: 'blur(100px)',
              bgcolor: theme.palette.primary.main,
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              bottom: -120,
              left: -120,
              width: 280,
              height: 280,
              opacity: 0.15,
              borderRadius: '50%',
              position: 'absolute',
              filter: 'blur(80px)',
              bgcolor: '#FA541C',
              zIndex: 0,
            }}
          />

          <Stack spacing={3} sx={{ zIndex: 9, maxWidth: 640 }}>
            <m.div variants={varFade('inUp')}>
              {/* 🟢 CORREÇÃO TS: 'as any' para aceitar o ícone customizado */}
              <Iconify 
                icon={"solar:letter-bold-duotone" as any} 
                width={80} 
                sx={{ 
                  color: '#FA541C', 
                  mx: 'auto', 
                  mb: 2,
                  filter: `drop-shadow(0 0 12px ${alpha('#FA541C', 0.5)})` 
                }} 
              />
            </m.div>

            <m.div variants={varFade('inUp')}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 900, 
                  fontFamily: "'Orbitron', sans-serif",
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  textShadow: `0 0 20px ${alpha(theme.palette.common.white, 0.2)}`
                }}
              >
                Mantenha-se à Frente no Mercado Cripto
              </Typography>
            </m.div>

            <m.div variants={varFade('inUp')}>
              <Typography variant="body1" sx={{ opacity: 0.8, color: 'grey.300' }}>
                Receba monitorizações de comunidades, vídeos exclusivos e notícias em alta 
                diretamente no seu e-mail. Sem spam, apenas inteligência de mercado.
              </Typography>
            </m.div>
          </Stack>

          {/* Formulário de Subscrição com Design Glass */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ width: 1, maxWidth: 540, zIndex: 9 }}
          >
            <m.div style={{ flexGrow: 1 }} variants={varFade('inLeft')}>
              <TextField
                fullWidth
                placeholder="Digite o seu melhor e-mail"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 56,
                    bgcolor: alpha(theme.palette.common.white, 0.05),
                    '& fieldset': { borderColor: alpha(theme.palette.common.white, 0.12) },
                    '&:hover fieldset': { borderColor: alpha(theme.palette.primary.main, 0.4) },
                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                    '& input': { color: 'common.white', fontFamily: "'Orbitron', sans-serif", fontSize: 14 },
                  },
                }}
              />
            </m.div>

            <m.div variants={varFade('inRight')}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  height: 56,
                  px: 4,
                  fontSize: 14,
                  fontWeight: 800,
                  fontFamily: "'Orbitron', sans-serif",
                  bgcolor: '#FA541C',
                  color: 'common.white',
                  boxShadow: `0 0 20px ${alpha('#FA541C', 0.4)}`,
                  '&:hover': { 
                    bgcolor: alpha('#FA541C', 0.9),
                    boxShadow: `0 0 30px ${alpha('#FA541C', 0.6)}`,
                    transform: 'translateY(-2px)'
                  },
                }}
              >
                Subscrever
              </Button>
            </m.div>
          </Stack>

          <m.div variants={varFade('inUp')}>
            <Typography variant="caption" sx={{ opacity: 0.5, zIndex: 9, display: 'block' }}>
              Ao subscrever, aceita a nossa <strong>Política de Privacidade</strong> e <strong>Termos de Serviço</strong>.
            </Typography>
          </m.div>
        </Stack>
      </Container>
    </Box>
  );
}