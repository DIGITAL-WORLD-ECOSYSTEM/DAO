import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Divider from '@mui/material/Divider';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const MOCK_BACKUP_CODES = [
  'ABCD-1234',
  'EFGH-5678',
  'IJKL-9012',
  'MNOP-3456',
  'QRST-7890',
  'UVWX-1234',
  'YZAB-5678',
  'CDEF-9012',
];

export function AccountTwoFA() {
  const isEnabled = useBoolean(false);
  const [activeStep, setActiveStep] = useState(0);
  const [code, setCode] = useState('');

  const handleNext = () => {
    if (activeStep === 1) {
      if (code.length < 6) {
        toast.error('O código deve conter 6 dígitos.');
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleEnable = () => {
    isEnabled.onTrue();
    setActiveStep(0);
    setCode('');
    toast.success('Autenticação 2FA ativada com sucesso!');
  };

  const handleDisable = () => {
    isEnabled.onFalse();
    setActiveStep(0);
    toast.warning('Autenticação 2FA desativada.');
  };

  return (
    <Grid container spacing={3}>
      {/* CABEÇALHO GLOBAL */}
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
              Autenticador 2FA (MFA)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Proteja sua identidade no ecossistema ASPPIBRA adicionando uma camada extra de
              segurança.
            </Typography>
          </Box>
          <Box sx={{ flexShrink: 0, textAlign: 'center' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Status da Proteção
            </Typography>
            {isEnabled.value ? (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: 'center',
                  color: 'success.main',
                  bgcolor: 'success.soft',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                <Iconify icon={'solar:shield-check-bold' as any} />
                <Typography variant="button">2FA ATIVADO</Typography>
              </Stack>
            ) : (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: 'center',
                  color: 'error.main',
                  bgcolor: 'error.soft',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                <Iconify icon={'solar:shield-warning-bold' as any} />
                <Typography variant="button">2FA DESATIVADO</Typography>
              </Stack>
            )}
          </Box>
        </Card>
      </Grid>

      {/* COLUNA ESQUERDA: Configuração */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ p: 4, minHeight: 400 }}>
          {isEnabled.value ? (
            <Stack
              spacing={3}
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                minHeight: 300,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'success.soft',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify
                  icon={'solar:shield-check-bold-duotone' as any}
                  width={48}
                  color="success.main"
                />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">Conta Protegida</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 400 }}>
                  Sua conta está utilizando o Autenticador 2FA. Um código será exigido sempre que
                  você fizer login em um novo dispositivo.
                </Typography>
              </Box>
              <Button variant="soft" color="error" onClick={handleDisable} sx={{ mt: 2 }}>
                Desativar 2FA
              </Button>
            </Stack>
          ) : (
            <Stack spacing={4}>
              <Typography variant="h6">Configurar Autenticador</Typography>
              <Stepper activeStep={activeStep} alternativeLabel>
                <Step>
                  <StepLabel>Baixar o App</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Escanear QR Code</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Verificar Código</StepLabel>
                </Step>
              </Stepper>

              {activeStep === 0 && (
                <Stack spacing={3} sx={{ mt: 2, alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Faça o download do Google Authenticator ou Authy no seu celular.
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<Iconify icon={'logos:google-play-icon' as any} />}
                    >
                      Google Play
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Iconify icon={'logos:apple-app-store' as any} />}
                    >
                      App Store
                    </Button>
                  </Stack>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    sx={{ mt: 2, alignSelf: 'flex-end' }}
                  >
                    Próximo Passo
                  </Button>
                </Stack>
              )}

              {activeStep === 1 && (
                <Stack spacing={3} sx={{ mt: 2, alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Abra o aplicativo autenticador e escaneie o código QR abaixo.
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'common.white',
                      borderRadius: 2,
                      border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                    }}
                  >
                    <Box
                      component="img"
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/ASPPIBRA%20DAO:sandro@asppibra.com?secret=JBSWY3DPEHPK3PXP&issuer=ASPPIBRA%20DAO"
                      alt="QR Code"
                      sx={{ width: 150, height: 150 }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      userSelect: 'all',
                      p: 1,
                      bgcolor: 'background.neutral',
                      borderRadius: 1,
                      fontFamily: 'monospace',
                    }}
                  >
                    JBSWY3DPEHPK3PXP
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignSelf: 'flex-end', width: '100%', justifyContent: 'space-between' }}
                  >
                    <Button onClick={handleBack}>Voltar</Button>
                    <Button variant="contained" color="primary" onClick={handleNext}>
                      Já Escaneei
                    </Button>
                  </Stack>
                </Stack>
              )}

              {activeStep === 2 && (
                <Stack spacing={3} sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Digite o código de 6 dígitos gerado pelo seu aplicativo para confirmar a
                    vinculação.
                  </Typography>
                  <TextField
                    fullWidth
                    label="Código de 6 dígitos"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    sx={{
                      input: {
                        letterSpacing: 8,
                        textAlign: 'center',
                        fontSize: 24,
                        fontWeight: 'bold',
                      },
                    }}
                  />
                  <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
                    <Button onClick={handleBack}>Voltar</Button>
                    <Button variant="contained" color="primary" onClick={handleEnable}>
                      Ativar Proteção 2FA
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Stack>
          )}
        </Card>
      </Grid>

      {/* COLUNA DIREITA: Códigos e Ferramentas */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={3}>
          {/* Códigos de Backup */}
          <Card sx={{ p: 3, bgcolor: isEnabled.value ? 'background.paper' : 'background.neutral' }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
              <Iconify
                icon={'solar:safe-square-bold-duotone' as any}
                width={24}
                color={isEnabled.value ? 'primary.main' : 'text.disabled'}
              />
              <Typography variant="h6" color={isEnabled.value ? 'text.primary' : 'text.disabled'}>
                Códigos de Backup
              </Typography>
            </Stack>

            {!isEnabled.value ? (
              <Typography variant="body2" color="text.disabled">
                Ative o 2FA primeiro para gerar seus códigos de recuperação de emergência.
              </Typography>
            ) : (
              <>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Guarde estes códigos em local seguro. Eles são a única forma de recuperar sua
                  conta se perder o celular.
                </Alert>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, mb: 3 }}>
                  {MOCK_BACKUP_CODES.map((backup) => (
                    <Typography
                      key={backup}
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        p: 1,
                        bgcolor: 'background.neutral',
                        borderRadius: 1,
                        textAlign: 'center',
                      }}
                    >
                      {backup}
                    </Typography>
                  ))}
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    startIcon={<Iconify icon={'solar:download-bold' as any} />}
                  >
                    Download
                  </Button>
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    startIcon={<Iconify icon={'solar:refresh-bold' as any} />}
                  >
                    Regerar
                  </Button>
                </Stack>
              </>
            )}
          </Card>

          {/* Dispositivos Confiáveis */}
          <Card sx={{ p: 3 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
              <Iconify icon={'solar:laptop-minimalistic-bold-duotone' as any} width={24} />
              <Typography variant="h6">Dispositivos Confiáveis</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Dispositivos que ignoram a verificação de 2FA por 30 dias.
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2">MacBook Pro (Chrome)</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rio de Janeiro, Brasil
                  </Typography>
                </Box>
                <Button size="small" color="error">
                  Revogar
                </Button>
              </Stack>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2">iPhone 14 (Safari)</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rio de Janeiro, Brasil
                  </Typography>
                </Box>
                <Button size="small" color="error">
                  Revogar
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Grid>
    </Grid>
  );
}
