'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';

import { useTranslate } from 'src/locales';
import { CONFIG } from 'src/global-config';
import { HomeBackground } from 'src/components/background';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function TeamView() {
  const { t } = useTranslate();

  const members = t('team.members', { returnObjects: true }) as {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    bio?: string;
  }[];

  return (
    <>
      <HomeBackground />

      <Box component="main" sx={{ position: 'relative', zIndex: 1, py: 10 }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography variant="h1" sx={{ mb: 2 }}>
              {t('team.badge')}
            </Typography>
            <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}>
              {t('team.description')}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {Array.isArray(members) &&
              members.map((member) => (
                <Grid key={member.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      p: 5,
                      textAlign: 'center',
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.4),
                      backdropFilter: 'blur(10px)',
                      border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      transition: (theme) => theme.transitions.create('transform'),
                      '&:hover': { transform: 'translateY(-10px)' },
                    }}
                  >
                    <Avatar
                      src={member.avatarUrl}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 3,
                        border: (theme) => `solid 4px ${theme.palette.primary.main}`,
                      }}
                    />
                    <Typography variant="h4">{member.name}</Typography>
                    <Typography variant="subtitle1" sx={{ color: 'primary.main', mb: 2 }}>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                      {member.bio}
                    </Typography>

                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        color="inherit"
                        onClick={() => window.open(CONFIG.socials.linkedin, '_blank')}
                      >
                        <Iconify icon={"eva:linkedin-fill" as any} />
                      </IconButton>
                      <IconButton
                        color="inherit"
                        onClick={() => window.open(CONFIG.socials.twitter, '_blank')}
                      >
                        <Iconify icon={"bi:twitter-x" as any} />
                      </IconButton>
                    </Stack>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
