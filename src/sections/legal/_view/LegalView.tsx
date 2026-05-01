'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { HomeBackground } from 'src/components/background';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  content: string;
  lastUpdated: string;
};

export function LegalView({ title, content, lastUpdated }: Props) {
  return (
    <>
      <HomeBackground />

      <Box component="main" sx={{ position: 'relative', zIndex: 1, py: 12 }}>
        <Container maxWidth="md">
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant="h1" sx={{ mb: 2 }}>{title}</Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              Última atualização: {lastUpdated}
            </Typography>
          </Box>

          <Box
            sx={{
              p: { xs: 3, md: 8 },
              borderRadius: 3,
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.2),
              backdropFilter: 'blur(10px)',
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.05)}`,
              '& h2': { variant: 'h3', mt: 6, mb: 3, color: 'primary.main' },
              '& p': { variant: 'body1', mb: 3, color: 'text.secondary', lineHeight: 1.8 },
              '& ul': { mb: 3, pl: 3, color: 'text.secondary' },
              '& li': { mb: 1 },
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      </Box>
    </>
  );
}
