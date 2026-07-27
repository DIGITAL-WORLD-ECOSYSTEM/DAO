import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TimelineContent from '@mui/lab/TimelineContent';
import InputAdornment from '@mui/material/InputAdornment';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import CircularProgress from '@mui/material/CircularProgress';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { changeMyPassword } from 'src/actions/identity';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type ChangePassWordSchemaType = z.infer<typeof ChangePassWordSchema>;

export const ChangePassWordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, { message: 'A senha atual é obrigatória!' })
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres!' }),
    newPassword: z.string().min(1, { message: 'A nova senha é obrigatória!' }),
    confirmNewPassword: z.string().min(1, { message: 'A confirmação de senha é obrigatória!' }),
  })
  .refine((val) => val.oldPassword !== val.newPassword, {
    message: 'A nova senha deve ser diferente da senha atual',
    path: ['newPassword'],
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    message: 'As senhas não coincidem!',
    path: ['confirmNewPassword'],
  });

// ----------------------------------------------------------------------

export function AccountChangePassword() {
  const showPassword = useBoolean();

  const defaultValues: ChangePassWordSchemaType = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await changeMyPassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      reset();
      toast.success('Senha alterada com sucesso!');
    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.message || 'Erro ao alterar a senha.';
      toast.error(msg);
    }
  });

  // MOCK DATA PARA APRESENTAÇÃO UX
  const securityScore = 78;
  const trustLevel = 'Ouro';
  const scoreColor = 'warning'; // 78 = Amarelo/Bom

  return (
    <Grid container spacing={3}>
      {/* 1. SECURITY SCORE & RECOMENDAÇÕES (Largura Total) */}
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
          {/* Score & Trust Level */}
          <Stack direction="row" spacing={4} sx={{ flexShrink: 0 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={100}
                thickness={4}
                sx={{ color: 'divider', position: 'absolute' }}
              />
              <CircularProgress
                variant="determinate"
                value={securityScore}
                size={100}
                thickness={4}
                color={scoreColor}
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
                <Typography variant="h5" component="div" color="text.primary">
                  {securityScore}
                </Typography>
              </Box>
            </Box>

            <Stack spacing={1}>
              <Typography variant="h6">Security Score</Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Nível de Confiança:
                </Typography>
                <Chip
                  label={trustLevel}
                  size="small"
                  color="warning"
                  variant="soft"
                  icon={<Iconify icon={'solar:star-bold' as any} />}
                />
              </Stack>

              {/* Mini Gráfico Mock (Trend) */}
              <Box sx={{ width: 120, mt: 1 }}>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ mb: 0.5, display: 'block' }}
                >
                  Últimos 90 dias
                </Typography>
                <Stack direction="row" spacing={0.5} sx={{ height: 24 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: '40%',
                      bgcolor: 'error.main',
                      borderRadius: 0.5,
                      opacity: 0.4,
                    }}
                  />
                  <Box
                    sx={{
                      width: 16,
                      height: '60%',
                      bgcolor: 'warning.main',
                      borderRadius: 0.5,
                      opacity: 0.6,
                    }}
                  />
                  <Box
                    sx={{
                      width: 16,
                      height: '70%',
                      bgcolor: 'warning.main',
                      borderRadius: 0.5,
                      opacity: 0.8,
                    }}
                  />
                  <Box
                    sx={{ width: 16, height: '90%', bgcolor: 'success.main', borderRadius: 0.5 }}
                  />
                </Stack>
              </Box>
            </Stack>
          </Stack>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

          {/* Recomendações (Guided Engine) */}
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Como melhorar sua segurança:
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Iconify icon={'solar:check-circle-bold' as any} color="success.main" />
                    <Typography
                      variant="body2"
                      sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                    >
                      Email e Telefone validados
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Iconify icon={'solar:check-circle-bold' as any} color="success.main" />
                    <Typography
                      variant="body2"
                      sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                    >
                      Senha forte configurada
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Iconify icon={'solar:danger-circle-bold' as any} color="warning.main" />
                    <Typography variant="body2" color="warning.main">
                      Ative MFA{' '}
                      <Typography component="span" variant="caption" color="text.secondary">
                        (+15 pts)
                      </Typography>
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Iconify icon={'solar:danger-circle-bold' as any} color="warning.main" />
                    <Typography variant="body2" color="warning.main">
                      Cadastre uma Passkey{' '}
                      <Typography component="span" variant="caption" color="text.secondary">
                        (+10 pts)
                      </Typography>
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Grid>

      {/* 2. COLUNA ESQUERDA (Tamanho 8) */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Stack spacing={3}>
          {/* Alertas & Última Revisão */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Card
              sx={{
                p: 2.5,
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'success.soft',
              }}
            >
              <Iconify
                icon={'solar:shield-check-bold-duotone' as any}
                width={40}
                color="success.main"
              />
              <Box>
                <Typography variant="subtitle2" color="success.darker">
                  Tudo tranquilo por aqui
                </Typography>
                <Typography variant="caption" color="success.dark">
                  Nenhuma atividade suspeita detectada recentemente.
                </Typography>
              </Box>
            </Card>

            <Card sx={{ p: 2.5, flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Iconify icon={'solar:history-bold-duotone' as any} width={40} color="primary.main" />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">Última Revisão</Typography>
                <Typography variant="caption" color="text.secondary">
                  Há 87 dias
                </Typography>
              </Box>
              <Button size="small" variant="soft" color="primary">
                Revisar
              </Button>
            </Card>
          </Stack>

          {/* Sessões Ativas */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Sessões Ativas
            </Typography>
            <Stack spacing={2} divider={<Divider />}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'background.neutral' }}>
                  <Iconify icon={'logos:chrome' as any} width={24} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2">Chrome no Linux</Typography>
                  <Typography variant="caption" color="text.secondary">
                    São Paulo, Brasil •{' '}
                    <Typography
                      component="span"
                      variant="caption"
                      color="success.main"
                      sx={{ fontWeight: 'bold' }}
                    >
                      Online agora
                    </Typography>
                  </Typography>
                </Box>
                <Button size="small" color="error">
                  Encerrar
                </Button>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'background.neutral' }}>
                  <Iconify icon={'logos:android-icon' as any} width={24} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2">App Android</Typography>
                  <Typography variant="caption" color="text.secondary">
                    São Paulo, Brasil • Visto ontem às 14:30
                  </Typography>
                </Box>
                <Button size="small" color="error">
                  Encerrar
                </Button>
              </Stack>
            </Stack>
          </Card>

          {/* Device Trust Center */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Dispositivos Confiáveis
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Dispositivos persistentes onde você não precisa fazer login com frequência.
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              sx={{
                p: 2,
                borderRadius: 2,
                border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
              }}
            >
              <Iconify
                icon={'solar:laptop-minimalistic-bold-duotone' as any}
                width={32}
                color="primary.main"
              />
              <Box>
                <Typography variant="subtitle2">Notebook Principal (Sandro)</Typography>
                <Typography variant="caption" color="text.secondary">
                  Autorizado em 10/01/2026
                </Typography>
              </Box>
            </Stack>
          </Card>

          {/* Alteração de Senha (Formulário Original) */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Alterar Senha
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Atualize sua senha periodicamente para manter sua conta segura.
            </Typography>

            <Form methods={methods} onSubmit={onSubmit}>
              <Stack spacing={3}>
                <Field.Text
                  name="oldPassword"
                  type={showPassword.value ? 'text' : 'password'}
                  label="Senha Atual"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={showPassword.onToggle} edge="end">
                            <Iconify
                              icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Field.Text
                  name="newPassword"
                  label="Nova Senha"
                  type={showPassword.value ? 'text' : 'password'}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={showPassword.onToggle} edge="end">
                            <Iconify
                              icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  helperText={
                    <Box component="span" sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                      <Iconify icon={'solar:info-circle-bold' as any} width={16} /> A senha deve ter
                      no mínimo 6 caracteres
                    </Box>
                  }
                />

                <Field.Text
                  name="confirmNewPassword"
                  type={showPassword.value ? 'text' : 'password'}
                  label="Confirmar Nova Senha"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={showPassword.onToggle} edge="end">
                            <Iconify
                              icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

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
                  Atualizar Senha
                </Button>
              </Stack>
            </Form>
          </Card>
        </Stack>
      </Grid>

      {/* 3. COLUNA DIREITA (Tamanho 4) */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={3}>
          {/* Centro de Recuperação */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Métodos de Recuperação
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Iconify icon={'solar:letter-bold' as any} color="text.secondary" />
                  <Typography variant="body2">Email</Typography>
                </Stack>
                <Iconify icon={'solar:check-circle-bold' as any} color="success.main" />
              </Stack>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Iconify icon={'solar:phone-bold' as any} color="text.secondary" />
                  <Typography variant="body2">Telefone</Typography>
                </Stack>
                <Iconify icon={'solar:check-circle-bold' as any} color="success.main" />
              </Stack>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Iconify icon={'solar:shield-warning-bold' as any} color="warning.main" />
                  <Typography variant="body2" color="warning.main">
                    Chave de Emergência
                  </Typography>
                </Stack>
                <Button size="small" variant="text" color="warning">
                  Configurar
                </Button>
              </Stack>
            </Stack>
          </Card>

          {/* MFA */}
          <Card sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Iconify
                icon={'solar:shield-keyhole-bold-duotone' as any}
                width={32}
                color="warning.main"
              />
              <Box>
                <Typography variant="h6">Autenticação 2FA</Typography>
                <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                  Status: Inativo
                </Typography>
              </Box>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Adicione uma camada extra de segurança à sua conta exigindo mais do que apenas uma
              senha para fazer login.
            </Typography>
            <Button
              fullWidth
              variant="soft"
              color="primary"
              component={RouterLink}
              href={`${paths.dashboard.user.account}/2fa`}
            >
              Configurar MFA
            </Button>
          </Card>

          {/* Passkeys (Empty State) */}
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Box
              sx={{
                mb: 2,
                mx: 'auto',
                width: 64,
                height: 64,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.neutral',
              }}
            >
              <Iconify
                icon={'solar:fingerprint-bold-duotone' as any}
                width={32}
                color="text.disabled"
              />
            </Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Passkeys
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Nenhuma Passkey cadastrada. Cadastre uma chave de acesso para login sem senha.
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon={'solar:add-circle-bold' as any} />}
            >
              Registrar Chave
            </Button>
          </Card>

          {/* Timeline de Segurança */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Histórico de Segurança
            </Typography>
            <Timeline
              sx={{
                p: 0,
                m: 0,
                [`& .${timelineItemClasses.root}:before`]: {
                  flex: 0,
                  padding: 0,
                },
              }}
            >
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ pb: 3 }}>
                  <Typography variant="subtitle2">Senha Alterada</Typography>
                  <Typography variant="caption" color="text.secondary">
                    12 de Julho, 2026 - 15:30
                  </Typography>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="success" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ pb: 3 }}>
                  <Typography variant="subtitle2">Email Confirmado</Typography>
                  <Typography variant="caption" color="text.secondary">
                    05 de Fevereiro, 2026
                  </Typography>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="info" />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="subtitle2">Novo Login (Linux)</Typography>
                  <Typography variant="caption" color="text.secondary">
                    01 de Fevereiro, 2026
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </Card>
        </Stack>
      </Grid>
    </Grid>
  );
}
