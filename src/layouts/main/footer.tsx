/* eslint-disable perfectionist/sort-imports */
'use client';

import type { Breakpoint } from '@mui/material/styles';

import { useCallback } from 'react';

import Box from '@mui/material/Box'; 
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled, keyframes } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const pulse = keyframes`
  0% { box-shadow: 0 0 8px #00ff7f; opacity: 0.8; }
  50% { box-shadow: 0 0 16px #00ff7f; opacity: 1; }
  100% { box-shadow: 0 0 8px #00ff7f; opacity: 0.8; }
`;

const LINKS = [
  {
    headline: 'ECOSSISTEMA',
    children: [
      { name: 'Swap & Pools', href: '#' },
    ],
  },
  {
    headline: 'DOCUMENTAÇÃO',
    children: [
      { name: 'Whitepaper', href: '#' },
    ],
  },
];

const CUSTOM_SOCIALS = [
  { name: 'Twitter', href: 'https://x.com/ASPPIBRA_ORG', icon: 'ri:twitter-x-fill' },
  { name: 'Instagram', href: 'https://www.instagram.com/asppibra/', icon: 'ri:instagram-fill' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/asppibra-dao/', icon: 'ri:linkedin-fill' },
  { name: 'GitHub', href: 'https://github.com/DIGITAL-WORLD-ECOSYSTEM', icon: 'ri:github-fill' },
  { name: 'Telegram (BR)', href: 'https://t.me/Mundo_Digital_BR', icon: 'ic:baseline-telegram' },
  { name: 'Telegram (EUA)', href: 'https://t.me/Mundo_Digital_EUA', icon: 'ic:baseline-telegram' },
  { name: 'Crunchbase', href: 'https://www.crunchbase.com/organization/sandro', icon: 'simple-icons:crunchbase' },
];

const FooterRoot = styled('footer')(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#000000',
  color: '#FFFFFF',
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(4),
  borderTop: `1px solid rgba(255, 255, 255, 0.08)`,
  fontFamily: '"Public Sans", sans-serif',
}));

export type FooterProps = React.ComponentProps<typeof FooterRoot>;

export function Footer({
  sx,
  layoutQuery = 'md',
  ...other
}: FooterProps & { layoutQuery?: Breakpoint }) {
  
  const contractAddress = "0x0697AB2B003FD2Cbaea2dF1ef9b404E45bE59d4C";

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(contractAddress);
    toast.success('Endereço do contrato copiado!');
  }, [contractAddress]);

  const truncate = (str: string) => `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;

  return (
    <FooterRoot sx={sx} {...other}>
      <Container>
        <Grid container spacing={5} sx={{ mb: 8, alignItems: 'flex-start' }}>
          
          {/* Coluna 1: Logo & Bio */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 3, height: 40, display: 'flex', alignItems: 'center' }}>
               <Logo sx={{ color: '#FFF' }} />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, height: 24 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#00ff7f',
                  animation: `${pulse} 2s infinite ease-in-out`,
                }}
              />
              <Typography
                variant="caption"
                sx={{ 
                  color: '#00ff7f', 
                  fontWeight: 'bold', 
                  letterSpacing: 2, 
                  fontSize: '0.75rem',
                  fontFamily: '"Orbitron", sans-serif',
                  textTransform: 'uppercase'
                }}
              >
                DIGITAL WORLD ECOSYSTEM
              </Typography>
            </Box>

            <Typography 
              variant="body2" 
              sx={{ 
                color: 'grey.500', 
                maxWidth: 360, 
                mb: 5, 
                lineHeight: 1.8, 
                textAlign: 'justify', // Bio Justificada
                fontFamily: '"Public Sans", sans-serif' 
              }}
            >
              A <strong>ASPPIBRA</strong> é a associação desenvolvedora deste ecossistema, 
              redefinindo ativos reais no mundo digital com governança descentralizada, 
              transparência e inovação através de tecnologia Web3.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {CUSTOM_SOCIALS.map((social) => (
                <Tooltip key={social.name} title={social.name} arrow>
                  <IconButton
                    component={Link}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      p: 1,
                      color: 'grey.600',
                      transition: 'all 0.3s',
                      '&:hover': { 
                        color: 'common.white', 
                        bgcolor: 'rgba(255,255,255,0.08)',
                        transform: 'translateY(-2px)' 
                      },
                    }}
                  >
                    <Iconify icon={social.icon as any} width={22} />
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Grid>

          {/* Coluna 2: Links Rápidos */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ height: 40, mb: 3 }} />

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 4,
              }}
            >
              {LINKS.map((list) => (
                <Box key={list.headline} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: 'common.white', 
                      fontWeight: 'bold', 
                      letterSpacing: 1.5, 
                      fontSize: '0.8rem',
                      fontFamily: '"Orbitron", sans-serif',
                      height: 24, 
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      href={link.href}
                      color="inherit"
                      variant="body2"
                      underline="none"
                      sx={{
                        color: 'grey.500',
                        textAlign: 'justify', // Texto Justificado
                        transition: 'all 0.2s',
                        fontFamily: '"Public Sans", sans-serif',
                        '&:hover': { 
                            color: '#00ff7f', 
                            pl: 0.5 
                        },
                      }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Coluna 3: Suporte & Contrato */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ height: 40, mb: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              
              {/* 1° Suporte */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: 'common.white', 
                    fontWeight: 'bold', 
                    letterSpacing: 1.5, 
                    fontSize: '0.8rem',
                    fontFamily: '"Orbitron", sans-serif',
                    textTransform: 'uppercase',
                    height: 24, 
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  SUPORTE
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>                  
                  <Link
                    component={RouterLink}
                    href={paths.faqs}
                    variant="body2"
                    underline="none"
                    sx={{
                      color: 'grey.500',
                      textAlign: 'justify', // Texto Justificado
                      transition: 'all 0.2s',
                      fontFamily: '"Public Sans", sans-serif',
                      fontWeight: 500,
                      '&:hover': { 
                          color: '#00ff7f', 
                          pl: 0.5 
                      },
                    }}
                  >
                    Central de Ajuda
                  </Link>
                </Box>
              </Box>

              {/* 2° Token Contract */}
              <Box sx={{ mt: { xs: 5, md: 9.1 } }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: 'common.white', 
                    fontWeight: 'bold', 
                    mb: 2.5, 
                    letterSpacing: 1.5, 
                    fontSize: '0.8rem',
                    fontFamily: '"Orbitron", sans-serif'
                  }}
                >
                  TOKEN CONTRACT (BEP-20)
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={truncate(contractAddress)}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Copiar endereço" arrow>
                          <IconButton 
                            edge="end" 
                            sx={{ color: 'grey.500', '&:hover': { color: '#00ff7f' } }} 
                            onClick={handleCopy}
                          >
                            <Iconify icon="solar:copy-bold" width={22} />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                    sx: {
                      height: 52,
                      color: 'grey.300',
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 1.5,
                      fontFamily: '"Public Sans", sans-serif',
                      fontSize: '0.9rem',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2) !important' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff7f !important' },
                    },
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 4 }} />

        {/* Rodapé Final */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Typography variant="caption" sx={{ color: 'grey.600', fontSize: '0.8rem' }}>
            © 2026 code by <strong>ASPPIBRA-DAO</strong>. Todos os direitos reservados.
          </Typography>

          <Box sx={{ display: 'flex', gap: 4 }}>
            <Link href="#" variant="caption" underline="none" sx={{ color: 'grey.600', '&:hover': { color: 'grey.400' } }}>
              Privacidade
            </Link>
            <Link href="#" variant="caption" underline="none" sx={{ color: 'grey.600', '&:hover': { color: 'grey.400' } }}>
              Cookies
            </Link>
          </Box>
        </Box>
      </Container>
    </FooterRoot>
  );
}

export { Footer as HomeFooter };