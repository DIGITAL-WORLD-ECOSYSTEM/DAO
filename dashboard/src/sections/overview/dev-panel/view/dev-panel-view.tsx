import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

import { useUserProfile } from 'src/auth/facades';

// ----------------------------------------------------------------------

export function DevPanelView() {
  const user = useUserProfile();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const nativeRole = 'Nativo do Banco';

  const handleRoleSwitch = (role: string | null) => {
    setSuccessMsg(`Simulador desativado por segurança. Você está usando seu cargo real.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Cabeçalho */}
        <Box>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
            🛠️ Developer Tools & Control Panel
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Gerencie variáveis de sessão, depure tokens de segurança e simule perfis de acesso em
            tempo real.
          </Typography>
        </Box>

        {successMsg && (
          <Alert severity="success" variant="filled" sx={{ borderRadius: 1 }}>
            {successMsg}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* 1. Simulador de Perfis de Acesso */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 3, height: '100%', boxShadow: (theme) => theme.customShadows.card }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                🎭 Simulador de Níveis de Acesso
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Selecione um cargo para simular visualmente a filtragem do menu lateral, controle de
                acesso e permissões das páginas.
              </Typography>

              <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                  <Button
                    fullWidth
                    variant={user?.role === 'user' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => handleRoleSwitch('user')}
                    sx={{ py: 1.5, fontWeight: 'bold' }}
                    disabled
                  >
                    User (Cidadão)
                  </Button>

                  <Button
                    fullWidth
                    variant={user?.role === 'admin' ? 'contained' : 'outlined'}
                    color="warning"
                    onClick={() => handleRoleSwitch('admin')}
                    sx={{ py: 1.5, fontWeight: 'bold' }}
                    disabled
                  >
                    Admin (Gestor)
                  </Button>

                  <Button
                    fullWidth
                    variant={user?.role === 'dev' ? 'contained' : 'outlined'}
                    color="error"
                    onClick={() => handleRoleSwitch('dev')}
                    sx={{ py: 1.5, fontWeight: 'bold' }}
                    disabled
                  >
                    Developer (Super)
                  </Button>
                </Stack>

                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  onClick={() => handleRoleSwitch(null)}
                  sx={{ py: 1, borderStyle: 'dashed' }}
                  disabled
                >
                  Simulador Desativado
                </Button>
              </Stack>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Stack
                  direction="row"
                  sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="subtitle2">Estado Atual do Perfil:</Typography>
                  <Chip
                    label={user?.role?.toUpperCase()}
                    color={
                      user?.role === 'dev'
                        ? 'error'
                        : user?.role === 'admin'
                          ? 'warning'
                          : 'primary'
                    }
                    size="small"
                  />
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 1 }}
                >
                  Origem do Cargo: <strong>{nativeRole}</strong>
                </Typography>
              </Box>
            </Card>
          </Grid>

          {/* 2. JWT Debugger */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 3, height: '100%', boxShadow: (theme) => theme.customShadows.card }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                🔑 Informações da Sessão Ativa
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Dados extraídos e decodificados a partir do payload do seu token JWT de
                autenticação.
              </Typography>

              <Stack spacing={2} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    ID do Usuário:
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {user?.id || 'N/A'}
                  </Typography>
                </Stack>

                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Nome Completo:
                  </Typography>
                  <Typography variant="body2">
                    {user?.displayName || 'N/A'}
                  </Typography>
                </Stack>

                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    E-mail:
                  </Typography>
                  <Typography variant="body2">{user?.displayEmail || 'N/A'}</Typography>
                </Stack>

                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Web3 Wallet:
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 11 }}>
                    {user?.walletAddress || 'N/A'}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          {/* 3. Diagnóstico de Ambiente */}
          <Grid size={{ xs: 12 }}>
            <Card sx={{ p: 3, boxShadow: (theme) => theme.customShadows.card }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                📡 Status dos Serviços do Aplicativo
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Frontend Build Mode
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ mt: 1, color: 'success.main', fontWeight: 'bold' }}
                    >
                      Development (Vite)
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Gateway API URL
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ mt: 1, fontFamily: 'monospace', wordBreak: 'break-all' }}
                    >
                      {CONFIG.serverUrl || 'http://localhost:8787'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Database Persistence
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 1, color: 'info.main', fontWeight: 'bold' }}>
                      Cloudflare D1 Local
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
