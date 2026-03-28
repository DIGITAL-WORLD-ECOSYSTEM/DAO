'use client';

// ----------------------------------------------------------------------
// Imports — tipos e react/motion
// ----------------------------------------------------------------------
import type { BoxProps } from '@mui/material/Box';

import { useState } from 'react';
import { m } from 'framer-motion';

// ----------------------------------------------------------------------
// Imports — MUI
// ----------------------------------------------------------------------
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

// ----------------------------------------------------------------------
// Imports — app (Corrigido para usar useTranslate conforme o padrão do projeto)
// ----------------------------------------------------------------------
import { useTranslate } from 'src/locales'; // Corrigido erro Module '"src/locales"' has no exported member 'useLocales'

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function HomeFAQs({ sx, ...other }: BoxProps) {
  const theme = useTheme();
  const { t } = useTranslate();

  // Busca o array de FAQs do common.json
  const faqs = (t('faqs.items', { returnObjects: true }) as { question: string; answer: string }[]) || [];

  // Estado para controlar qual acordeão está aberto
  const [expanded, setExpanded] = useState<string | false>(faqs.length > 0 ? faqs[0].question : false);

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const FAQ_PADDING = theme.spacing(2.5, 4);

  return (
    <Box
      id="faqs"
      component="section"
      sx={[
        { 
          position: 'relative', 
          overflow: 'hidden', 
          bgcolor: 'transparent', 
          // 3° Padding Vertical Responsivo Padronizado
          py: { xs: 8, md: 15 } 
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* 1° Container e Viewport (Estrutura Base) */}
      <Container 
        component={MotionViewport} 
        sx={{ position: 'relative', zIndex: 9, textAlign: 'center' }}
      >
        
        {/* BADGE / PÍLULA PADRONIZADA */}
        <m.div variants={varFade('inUp')}>
          <Box
            sx={{
              display: 'inline-block',
              border: `1px solid ${theme.palette.info.main}`,
              borderRadius: 2, // borderRadius: 2 padrão
              px: 1.5,
              py: 0.5,
              mb: 5,
              boxShadow: `0 0 12px ${alpha(theme.palette.info.main, 0.4)}`,
            }}
          >
            <Typography
              component="span"
              sx={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'info.main',
              }}
            >
              {t('faqs.badge') || 'FAQs'}
            </Typography>
          </Box>
        </m.div>

        {/* 2° Hierarquia de Tipografia (Título Tri-colorido) */}
        <m.div variants={varFade('inUp')}>
          <Typography
            component="h2"
            sx={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900,
              fontSize: { xs: '2.2rem', md: '3rem' },
              letterSpacing: '0.05em',
              lineHeight: 1.2,
              textTransform: 'uppercase',
            }}
          >
            <Box component="span" sx={{ color: 'common.white' }}>
              {t('faqs.title') || 'TEMOS AS'}
            </Box>
            <br />
            <Box component="span" sx={{ color: 'warning.main' }}>
              {t('faqs.heading_highlight') || 'RESPOSTAS'}
            </Box>
          </Typography>
        </m.div>

        {/* 7. Limitação de Caracteres / MaxWidth Descrição */}
        <m.div variants={varFade('inUp')}>
           <Typography sx={{ mt: 3, mx: 'auto', maxWidth: 640, color: 'text.secondary' }}>
            Tudo o que você precisa saber sobre a infraestrutura digital e governança da ASPPIBRA-DAO.
          </Typography>
        </m.div>

        <m.div variants={varFade('inUp')}>
          <Stack spacing={2} sx={{ mt: { xs: 6, md: 8 }, mx: 'auto', maxWidth: 720, textAlign: 'left' }}>
            {faqs.map((item) => {
              const isOpen = expanded === item.question;

              return (
                <Accordion
                  key={item.question}
                  disableGutters
                  expanded={isOpen}
                  onChange={handleChange(item.question)}
                  sx={{
                    borderRadius: 2,
                    // 5. Padronização de Glassmorphism (blur(10px))
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: `1.5px solid ${alpha(theme.palette.info.main, isOpen ? 0.7 : 0.2)}`, // Espessura 1.5px padronizada
                    bgcolor: alpha(theme.palette.grey[900], isOpen ? 0.55 : 0.25),
                    boxShadow: isOpen
                      ? `0 0 25px ${alpha(theme.palette.info.main, 0.35)}`
                      : `0 0 12px ${alpha(theme.palette.info.main, 0.18)}`,
                    transition: theme.transitions.create(['border-color', 'box-shadow', 'background-color']),
                    '&:before': { display: 'none' },
                    '& .MuiAccordionSummary-content': { margin: 0 },
                    '& .MuiAccordionSummary-root': { padding: FAQ_PADDING, minHeight: 'unset' },
                    '& .MuiAccordionDetails-root': { padding: FAQ_PADDING },

                    // 6. Feedback Visual Hover
                    '&:hover': {
                      borderColor: theme.palette.info.main,
                      bgcolor: alpha(theme.palette.grey[900], 0.4),
                      boxShadow: `0 0 22px ${alpha(theme.palette.info.main, 0.3)}`,
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <Iconify
                        icon="solar:double-alt-arrow-down-bold-duotone"
                        width={20}
                        sx={{ color: isOpen ? 'info.main' : 'inherit', transition: 'color 0.3s' }}
                      />
                    }
                  >
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: "'Orbitron', sans-serif",
                        fontWeight: 700,
                        fontSize: { xs: 15, md: 16 },
                        letterSpacing: '0.03em',
                        color: isOpen ? 'common.white' : alpha(theme.palette.common.white, 0.75),
                      }}
                    >
                      {item.question}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails
                    sx={{
                      color: alpha(theme.palette.common.white, 0.85),
                      lineHeight: 1.75,
                      fontSize: 15,
                    }}
                  >
                    {item.answer}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        </m.div>
      </Container>
    </Box>
  );
}