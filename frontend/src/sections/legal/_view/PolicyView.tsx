'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { HomeBackground } from 'src/components/background';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  subtitle: string;
  content: string;
};

export function PolicyView({ title, subtitle, content }: Props) {
  return (
    <>
      <HomeBackground />

      <Box component="main" sx={{ position: 'relative', zIndex: 1, py: 12 }}>
        <Container maxWidth="md">
          <Box sx={{ mb: 10 }}>
            <Typography variant="h1" sx={{ mb: 3 }}>{title}</Typography>
            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 400 }}>
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              '& h2': { variant: 'h3', mt: 8, mb: 3, borderLeft: (theme) => `4px solid ${theme.palette.primary.main}`, pl: 2 },
              '& p': { variant: 'body1', mb: 3, color: 'text.secondary', fontSize: 18, lineHeight: 1.8 },
              '& strong': { color: 'text.primary' },
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      </Box>
    </>
  );
}
