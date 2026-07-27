import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import axios from 'src/lib/axios';

import { Iconify } from 'src/components/iconify';

import { NuclearModal } from './nuclear-modal';

// ----------------------------------------------------------------------

type ApiConfigDrawerProps = {
  open: boolean;
  onClose: () => void;
  integration: any; // Tipagem básica para agilizar
};

export function ApiConfigDrawer({ open, onClose, integration }: ApiConfigDrawerProps) {
  const [currentTab, setCurrentTab] = useState('config');
  const [showSecret, setShowSecret] = useState(false);
  const [secretValue, setSecretValue] = useState(
    'sk_live_v8_encrypted_dummy_string_that_represents_the_secret'
  );

  const [nuclearOpen, setNuclearOpen] = useState(false);
  const [nuclearConfig, setNuclearConfig] = useState({
    actionName: '',
    expectedText: '',
    onConfirm: () => {},
  });

  if (!integration) return null;

  const executeRotation = async () => {
    try {
      await axios.post('/api/platform/devos/apis/rotate', {
        providerId: integration.provider,
        keyName: 'default_master',
        plainTextSecret: secretValue,
        ownerTeam: integration.owner,
        expiresInDays: 90,
      });
      alert('Chave rotacionada com sucesso e assinada no D1!');
    } catch (e) {
      console.error('Falha na rotação', e);
      alert('Falha catastrófica ao tentar rotacionar a chave.');
    }
  };

  const handleOpenNuclear = (actionName: string, expectedText: string, onConfirm: () => void) => {
    setNuclearConfig({ actionName, expectedText, onConfirm });
    setNuclearOpen(true);
  };

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={(e, val) => setCurrentTab(val)}
      sx={{ px: 2.5, boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.vars.palette.divider}` }}
    >
      <Tab value="config" label="Config" />
      <Tab value="secrets" label="Secrets 🔒" />
      <Tab value="dependencies" label="Dependências" />
      <Tab value="versions" label="Versions" />
      <Tab value="audit" label="Auditoria" />
    </Tabs>
  );

  const renderConfig = (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        Configurações Globais
      </Typography>
      <TextField
        fullWidth
        label="Base URL"
        defaultValue={`https://api.${integration.provider?.toLowerCase() || 'service'}.com/v1`}
      />
      <Stack direction="row" spacing={2}>
        <TextField fullWidth type="number" label="Rate Limit (req/s)" defaultValue={100} />
        <TextField fullWidth label="Timeout (ms)" defaultValue={5000} />
      </Stack>
    </Stack>
  );

  const renderSecrets = (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          Cofre de Segredos (KMS)
        </Typography>
        <Button
          size="small"
          color="error"
          variant="soft"
          startIcon={<Iconify icon={'eva:refresh-fill' as any} />}
          onClick={() =>
            handleOpenNuclear(
              'Rotação de Chave Mestra',
              `ROTACIONAR_${integration.id?.toUpperCase()}_PROD`,
              executeRotation
            )
          }
        >
          Rotacionar Chave
        </Button>
      </Stack>

      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          bgcolor: 'background.neutral',
          border: '1px dashed',
          borderColor: 'divider',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
          MASTER SECRET KEY
        </Typography>
        <TextField
          fullWidth
          value={secretValue}
          onChange={(e) => setSecretValue(e.target.value)}
          type={showSecret ? 'text' : 'password'}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowSecret(!showSecret)} edge="end">
                    <Iconify
                      icon={showSecret ? ('eva:eye-fill' as any) : ('eva:eye-off-fill' as any)}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box
        sx={{ p: 2, borderRadius: 1, bgcolor: 'error.main', color: 'common.white', opacity: 0.1 }}
      >
        {/* Simulação de um alerta de Step-Up no futuro */}
      </Box>
    </Stack>
  );

  const renderDependencies = (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        Raio de Explosão (Impacto Estimado)
      </Typography>
      <Box sx={{ p: 3, borderRadius: 1, bgcolor: 'background.neutral', fontFamily: 'monospace' }}>
        {`[${integration.provider || 'Service'}]
  ├─ Billing Module
  ├─ Subscriptions Worker
  └─ Marketplace Edge`}
      </Box>
      <Typography variant="caption" color="warning.main">
        ⚠️ Alterar esta chave impactará 3 módulos do sistema.
      </Typography>
    </Stack>
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      slotProps={{
        backdrop: { invisible: false },
        paper: {
          sx: { width: { xs: 1, sm: 480 } },
        },
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2.5 }}>
        <Typography variant="h6"> Gerenciar {integration.name} </Typography>
        <IconButton onClick={onClose}>
          <Iconify icon={'mingcute:close-line' as any} />
        </IconButton>
      </Stack>

      <Divider />

      {renderTabs}

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {currentTab === 'config' && renderConfig}
        {currentTab === 'secrets' && renderSecrets}
        {currentTab === 'dependencies' && renderDependencies}
        {/* Placeholder para os outros */}
        {['versions', 'audit'].includes(currentTab) && (
          <Box sx={{ p: 3 }}>
            <Typography sx={{ color: 'text.secondary' }}>
              Funcionalidade de {currentTab} em construção.
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />

      <Stack direction="row" spacing={1.5} sx={{ p: 2.5, justifyContent: 'flex-end' }}>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            handleOpenNuclear(
              'Salvar Configurações Globais',
              `SALVAR_${integration.id?.toUpperCase()}`,
              () => alert('Configurações Salvas no D1!')
            )
          }
        >
          Salvar Alterações
        </Button>
      </Stack>

      <NuclearModal
        open={nuclearOpen}
        onClose={() => setNuclearOpen(false)}
        onConfirm={nuclearConfig.onConfirm}
        actionName={nuclearConfig.actionName}
        expectedText={nuclearConfig.expectedText}
      />
    </Drawer>
  );
}
