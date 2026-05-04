'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function PostNewsletter() {
  const theme = useTheme();

  return (
    <Box
      component={MotionViewport}
      sx={{
        py: 4,
        bgcolor: 'transparent',
        position: 'relative',
      }}
    >
      <Stack
        spacing={3}
        alignItems="center"
        sx={{
          px: { xs: 3, md: 8 },
          py: 6,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
          color: 'common.white',
          
          // 🟢 GLASSMORPHISM ELITE
          bgcolor: alpha('#020817', 0.6),
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          
          // 💎 BORDA DE CRISTAL REATIVA
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: '1px',
            background: `linear-gradient(135deg, ${alpha('#FA541C', 0.5)}, transparent 50%, ${alpha('#00B8D9', 0.3)})`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            zIndex: 2,
          },
          boxShadow: `0 20px 40px -10px ${alpha('#000', 0.5)}, 0 0 30px ${alpha('#FA541C', 0.1)}`,
        }}
      >
        {/* 🕸️ GRID PATTERN OVERLAY */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            zIndex: 1,
            backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.2)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.2)} 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />

        {/* 🎆 NEBULOSAS INTERNAS */}
        <Box
          sx={{
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            opacity: 0.2,
            borderRadius: '50%',
            position: 'absolute',
            filter: 'blur(80px)',
            bgcolor: '#FA541C',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            bottom: -80,
            left: -80,
            width: 250,
            height: 250,
            opacity: 0.15,
            borderRadius: '50%',
            position: 'absolute',
            filter: 'blur(60px)',
            bgcolor: '#00B8D9',
            zIndex: 0,
          }}
        />

        {/* CONTEÚDO */}
        <Stack spacing={2} sx={{ zIndex: 9, maxWidth: 560, position: 'relative' }}>
          <m.div variants={varFade('inUp')}>
            <Box
              sx={{
                width: 72,
                height: 72,
                mx: 'auto',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '20px',
                position: 'relative',
                bgcolor: alpha('#FA541C', 0.1),
                border: `1px solid ${alpha('#FA541C', 0.2)}`,
                boxShadow: `0 0 20px ${alpha('#FA541C', 0.2)}`,
              }}
            >
              <Iconify
                icon={"solar:letter-bold-duotone" as any}
                width={40}
                sx={{ color: '#FA541C' }}
              />
            </Box>
          </m.div>

          <m.div variants={varFade('inUp')}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontFamily: "'Orbitron', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: { xs: '1.5rem', md: '2.25rem' },
                lineHeight: 1.2,
                background: `linear-gradient(to bottom, #FFF, ${alpha(theme.palette.common.white, 0.7)})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: `0 0 30px ${alpha('#FA541C', 0.3)}`,
              }}
            >
              Mantenha-se à Frente
            </Typography>
          </m.div>

          <m.div variants={varFade('inUp')}>
            <Typography 
              variant="body1" 
              sx={{ 
                opacity: 0.8, 
                color: 'grey.300',
                fontSize: { xs: 15, md: 17 },
                lineHeight: 1.6,
                fontWeight: 500
              }}
            >
              Receba inteligência de mercado e insights exclusivos diretamente no seu e-mail.
            </Typography>
          </m.div>
        </Stack>

        {/* FORMULÁRIO */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ width: 1, maxWidth: 500, zIndex: 9, mt: 2 }}
        >
          <m.div style={{ flexGrow: 1 }} variants={varFade('inLeft')}>
            <TextField
              fullWidth
              placeholder="Seu melhor e-mail"
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 54,
                  bgcolor: alpha(theme.palette.common.white, 0.03),
                  borderRadius: 1.5,
                  '& fieldset': { borderColor: alpha(theme.palette.common.white, 0.1) },
                  '&:hover fieldset': { borderColor: alpha('#FA541C', 0.4) },
                  '&.Mui-focused fieldset': { borderColor: '#FA541C' },
                  '& input': {
                    color: 'common.white',
                    fontFamily: "'Public Sans', sans-serif",
                    fontSize: 15,
                  },
                },
              }}
            />
          </m.div>

          <m.div variants={varFade('inRight')}>
            <Button
              variant="contained"
              size="large"
              sx={{
                height: 54,
                px: 4,
                fontSize: 14,
                fontWeight: 900,
                fontFamily: "'Orbitron', sans-serif",
                textTransform: 'uppercase',
                bgcolor: '#FA541C',
                color: 'common.white',
                borderRadius: 1.5,
                boxShadow: `0 10px 20px -5px ${alpha('#FA541C', 0.5)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: '#FF6B3D',
                  boxShadow: `0 15px 30px -5px ${alpha('#FA541C', 0.6)}`,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Subscrever
            </Button>
          </m.div>
        </Stack>

        <m.div variants={varFade('inUp')}>
          <Typography variant="caption" sx={{ opacity: 0.4, zIndex: 9, display: 'block', mt: 2 }}>
            Sem spam. Apenas tecnologia e mercado.
          </Typography>
        </m.div>
      </Stack>
    </Box>
  );
}
