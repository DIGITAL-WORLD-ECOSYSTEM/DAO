import type { ISocialLink } from 'src/types/common';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { updateMyProfile } from 'src/actions/identity';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const CATEGORIES = [
  'Desenvolvedor',
  'Criador de Conteúdo',
  'Investidor',
  'Empreendedor',
  'Produtor Rural',
  'Pesquisador',
  'Designer',
];

// Validação Inteligente com Zod
const SocialsSchema = z.object({
  publicName: z.string().min(1, 'Nome Público é obrigatório'),
  creatorCategory: z.string().min(1, 'Categoria é obrigatória'),

  // Redes Profissionais
  linkedin: z
    .string()
    .url('URL inválida')
    .includes('linkedin.com/in', { message: 'Deve ser um link do LinkedIn (linkedin.com/in/...)' })
    .or(z.literal('')),
  github: z
    .string()
    .url('URL inválida')
    .includes('github.com', { message: 'Deve ser um link do GitHub' })
    .or(z.literal('')),
  website: z.string().url('URL inválida').or(z.literal('')),
  youtube: z
    .string()
    .url('URL inválida')
    .includes('youtube.com', { message: 'Deve ser um link do YouTube' })
    .or(z.literal('')),

  // Redes Pessoais
  instagram: z
    .string()
    .url('URL inválida')
    .includes('instagram.com', { message: 'Deve ser um link do Instagram' })
    .or(z.literal('')),
  facebook: z
    .string()
    .url('URL inválida')
    .includes('facebook.com', { message: 'Deve ser um link do Facebook' })
    .or(z.literal('')),
  tiktok: z
    .string()
    .url('URL inválida')
    .includes('tiktok.com', { message: 'Deve ser um link do TikTok' })
    .or(z.literal('')),
  twitter: z
    .string()
    .url('URL inválida')
    .regex(/twitter\.com|x\.com/, { message: 'Deve ser um link do X/Twitter' })
    .or(z.literal('')),
});

type FormValuesProps = z.infer<typeof SocialsSchema>;

type Props = {
  socialLinks?: ISocialLink;
};

// Utilitário para Username Extraction
const extractUsername = (url: string, platform: string) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.split('/').filter(Boolean);

    if (platform === 'linkedin') return `@${path[1] || path[0]}`; // /in/username
    if (platform === 'youtube' && url.includes('@')) return `@${url.split('@')[1]}`;
    return `@${path[0]}`;
  } catch (e) {
    return url;
  }
};

export function AccountSocials({ socialLinks }: Props) {
  const defaultValues: FormValuesProps = {
    publicName: 'Sandro Amorim',
    creatorCategory: 'Desenvolvedor',
    linkedin: socialLinks?.linkedin || 'https://linkedin.com/in/sandroamorim',
    github: socialLinks?.github || 'https://github.com/sandroamorim',
    website: socialLinks?.website || '',
    youtube: socialLinks?.youtube || '',
    instagram: socialLinks?.instagram || '',
    facebook: socialLinks?.facebook || '',
    tiktok: socialLinks?.tiktok || '',
    twitter: socialLinks?.twitter || '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: zodResolver(SocialsSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { publicName, creatorCategory, ...rest } = data;
      // Simulando a atualização de perfil no backend
      await updateMyProfile({ socialLinks: rest });
      toast.success('Presença Digital atualizada com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar Presença Digital.');
    }
  });

  // Cálculo de Completude
  const socialKeys = [
    'linkedin',
    'github',
    'website',
    'youtube',
    'instagram',
    'facebook',
    'tiktok',
    'twitter',
  ] as const;
  const configuredCount = socialKeys.filter((key) => values[key]).length;
  const totalCount = socialKeys.length;
  const completeness = Math.round((configuredCount / totalCount) * 100);

  let qualityBadge: {
    label: string;
    color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  } = { label: 'Iniciante', color: 'error' };
  if (configuredCount >= 7) qualityBadge = { label: 'Influente', color: 'primary' };
  else if (configuredCount >= 5) qualityBadge = { label: 'Avançado', color: 'success' };
  else if (configuredCount >= 3) qualityBadge = { label: 'Intermediário', color: 'warning' };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* TOPO: Cabeçalho & Completude */}
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 4,
              bgcolor: 'background.neutral',
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Redes Sociais e Presença Digital
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Conecte suas redes para fortalecer sua identidade digital e facilitar conexões
                dentro da comunidade ASPPIBRA.
              </Typography>
            </Box>

            <Stack direction="row" spacing={3} sx={{ flexShrink: 0 }}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={80}
                  thickness={4}
                  sx={{ color: 'divider', position: 'absolute' }}
                />
                <CircularProgress
                  variant="determinate"
                  value={completeness}
                  size={80}
                  thickness={4}
                  color={qualityBadge.color}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="subtitle2" component="div" color="text.primary">
                    {completeness}%
                  </Typography>
                </Box>
              </Box>
              <Stack spacing={0.5}>
                <Typography variant="subtitle2">Presença Digital</Typography>
                <Typography variant="caption" color="text.secondary">
                  {configuredCount} de {totalCount} perfis configurados
                </Typography>
                <Chip
                  label={qualityBadge.label}
                  size="small"
                  color={qualityBadge.color}
                  variant="soft"
                  sx={{ mt: 0.5, width: 'fit-content' }}
                />
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {/* COLUNA ESQUERDA: Formulários Categorizados */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Metadados */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Perfil Público
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field.Text
                    name="publicName"
                    label="Nome de Exibição (Público)"
                    helperText="Seu nome civil, artístico ou marca."
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field.Select name="creatorCategory" label="Categoria Principal">
                    {CATEGORIES.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Grid>
              </Grid>
            </Card>

            {/* Redes Profissionais */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Redes Profissionais
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Conecte seu histórico de trabalho e projetos.
              </Typography>

              <Stack spacing={2.5}>
                <Field.Text
                  name="linkedin"
                  label="LinkedIn"
                  placeholder="https://linkedin.com/in/usuario"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify width={24} icon={'socials:linkedin' as any} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Field.Text
                  name="github"
                  label="GitHub"
                  placeholder="https://github.com/usuario"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify width={24} icon={'mdi:github' as any} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Field.Text
                  name="website"
                  label="Website Oficial"
                  placeholder="https://seusite.com.br"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify width={24} icon={'solar:global-bold' as any} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Field.Text
                  name="youtube"
                  label="YouTube"
                  placeholder="https://youtube.com/@canal"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify width={24} icon={'mdi:youtube' as any} color="error.main" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Stack>
            </Card>

            {/* Redes Pessoais */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Redes Pessoais
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Conecte suas mídias sociais para aumentar seu alcance.
              </Typography>

              <Stack spacing={2.5}>
                <Field.Text
                  name="instagram"
                  label="Instagram"
                  placeholder="https://instagram.com/usuario"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify width={24} icon={'socials:instagram' as any} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Field.Text
                  name="twitter"
                  label="X (Twitter)"
                  placeholder="https://x.com/usuario"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify width={24} icon={'socials:twitter' as any} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Field.Text
                  name="tiktok"
                  label="TikTok"
                  placeholder="https://tiktok.com/@usuario"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify width={24} icon={'ic:baseline-tiktok' as any} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Field.Text
                  name="facebook"
                  label="Facebook"
                  placeholder="https://facebook.com/usuario"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify width={24} icon={'socials:facebook' as any} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Stack>
            </Card>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              loading={isSubmitting}
              sx={{
                alignSelf: 'flex-start',
                px: 4,
                py: 1.5,
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                letterSpacing: 1,
                boxShadow: (theme) => theme.vars.customShadows.primary,
              }}
            >
              Salvar Alterações
            </Button>
          </Stack>
        </Grid>

        {/* COLUNA DIREITA: Preview do Perfil */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Card de Preview Rico */}
            <Card sx={{ overflow: 'hidden' }}>
              <Box sx={{ height: 80, bgcolor: 'primary.main', opacity: 0.8 }} />
              <Box sx={{ p: 3, pt: 0, position: 'relative' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: 'background.paper',
                    mt: -4,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: (theme) => `solid 2px ${theme.vars.palette.background.paper}`,
                    boxShadow: (theme) => theme.vars.customShadows.z8,
                  }}
                >
                  <Iconify
                    icon={'solar:user-bold-duotone' as any}
                    width={40}
                    color="primary.main"
                  />
                </Box>

                <Typography variant="h6">{values.publicName || 'Seu Nome'}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {values.creatorCategory || 'Categoria'}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                  <Iconify icon={'solar:map-point-bold-duotone' as any} color="text.disabled" />
                  <Typography variant="caption" color="text.disabled">
                    Maricá - RJ
                  </Typography>
                </Stack>

                <Divider sx={{ borderStyle: 'dashed', mb: 2 }} />

                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 2 }}
                >
                  Redes Conectadas
                </Typography>

                <Stack spacing={2}>
                  {socialKeys.map((key) => {
                    const url = values[key];
                    if (!url) return null;

                    let icon = 'solar:global-bold' as any;
                    let label = 'Website';

                    if (key === 'linkedin') {
                      icon = 'socials:linkedin' as any;
                      label = 'LinkedIn';
                    }
                    if (key === 'github') {
                      icon = 'mdi:github' as any;
                      label = 'GitHub';
                    }
                    if (key === 'youtube') {
                      icon = 'mdi:youtube' as any;
                      label = 'YouTube';
                    }
                    if (key === 'instagram') {
                      icon = 'socials:instagram' as any;
                      label = 'Instagram';
                    }
                    if (key === 'facebook') {
                      icon = 'socials:facebook' as any;
                      label = 'Facebook';
                    }
                    if (key === 'tiktok') {
                      icon = 'ic:baseline-tiktok' as any;
                      label = 'TikTok';
                    }
                    if (key === 'twitter') {
                      icon = 'socials:twitter' as any;
                      label = 'X/Twitter';
                    }

                    return (
                      <Stack
                        key={key}
                        direction="row"
                        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                          <Iconify icon={icon} width={20} sx={{ color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="subtitle2" sx={{ lineHeight: 1 }}>
                              {label}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              {extractUsername(url, key)}
                            </Typography>
                          </Box>
                        </Stack>
                        <Button
                          size="small"
                          color="inherit"
                          variant="outlined"
                          component="a"
                          href={url}
                          target="_blank"
                          rel="noopener"
                          sx={{ fontSize: '0.75rem', px: 1, py: 0.25 }}
                        >
                          Abrir
                        </Button>
                      </Stack>
                    );
                  })}

                  {configuredCount === 0 && (
                    <Typography
                      variant="body2"
                      color="text.disabled"
                      sx={{ textAlign: 'center', py: 2 }}
                    >
                      Nenhuma rede configurada.
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
