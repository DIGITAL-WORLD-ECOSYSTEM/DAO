import type { IUserItem } from 'src/types/user';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { fDate, fToNow } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentUser?: IUserItem | null;
};

export function UserQuickInspectDrawer({ open, onClose, currentUser }: Props) {
  if (!currentUser) {
    return null;
  }

  const renderHead = (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 2, pr: 1, pl: 2.5 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Dossiê de Identidade
      </Typography>
      <IconButton onClick={onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Box>
  );

  const renderIdentity = (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Avatar src={currentUser.avatarUrl} alt={currentUser.name} sx={{ width: 96, height: 96, mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        {currentUser.name}
      </Typography>
      
      <Stack spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
          {currentUser.aspId}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {currentUser.did}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {currentUser.company}
        </Typography>
      </Stack>

      <Label variant="soft" color="primary">
        {currentUser.role.toUpperCase()}
      </Label>
    </Box>
  );

  const renderContact = (
    <Box sx={{ p: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Contato
      </Typography>

      <Stack spacing={2}>
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
          <Iconify icon="solar:letter-bold" width={20} sx={{ color: 'text.secondary' }} />
          <Typography variant="body2">{currentUser.email}</Typography>
        </Stack>
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
          <Iconify icon="solar:phone-bold" width={20} sx={{ color: 'text.secondary' }} />
          <Typography variant="body2">{currentUser.phoneNumber || 'Não informado'}</Typography>
        </Stack>
      </Stack>
    </Box>
  );

  const kycStatusColor = 
    currentUser.kycStatus === 'approved' ? 'success' :
    currentUser.kycStatus === 'rejected' ? 'error' :
    currentUser.kycStatus === 'expired' ? 'error' :
    currentUser.kycStatus === 'draft' ? 'default' : 'warning';

  const renderCompliance = (
    <Box sx={{ p: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Conformidade
      </Typography>

      <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Situação KYC
        </Typography>
        <Label variant="soft" color={kycStatusColor}>
            {currentUser.kycStatus === 'draft' && 'Não Iniciado'}
            {currentUser.kycStatus === 'pending' && 'Pendente'}
            {currentUser.kycStatus === 'under_review' && 'Em Análise'}
            {currentUser.kycStatus === 'approved' && 'Verificado'}
            {currentUser.kycStatus === 'rejected' && 'Rejeitado'}
            {currentUser.kycStatus === 'expired' && 'Expirado'}
        </Label>
      </Stack>
    </Box>
  );

  const renderCredentials = (
    <Box sx={{ p: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Credenciais
      </Typography>

      <Stack spacing={2}>
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
          {currentUser.emailVerified ? (
            <Iconify icon={"eva:checkmark-circle-2-fill" as any} width={20} sx={{ color: 'success.main' }} />
          ) : (
            <Iconify icon={"eva:alert-triangle-fill" as any} width={20} sx={{ color: 'warning.main' }} />
          )}
          <Typography variant="body2" sx={{ color: currentUser.emailVerified ? 'text.primary' : 'text.disabled' }}>
            E-mail Verificado
          </Typography>
        </Stack>

        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
          {currentUser.phoneVerified ? (
            <Iconify icon={"eva:checkmark-circle-2-fill" as any} width={20} sx={{ color: 'success.main' }} />
          ) : (
            <Iconify icon={"eva:alert-triangle-fill" as any} width={20} sx={{ color: 'warning.main' }} />
          )}
          <Typography variant="body2" sx={{ color: currentUser.phoneVerified ? 'text.primary' : 'text.disabled' }}>
            Telefone Verificado
          </Typography>
        </Stack>

        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
          {currentUser.mfaEnabled ? (
            <Iconify icon={"eva:checkmark-circle-2-fill" as any} width={20} sx={{ color: 'success.main' }} />
          ) : (
            <Iconify icon={"eva:alert-triangle-fill" as any} width={20} sx={{ color: 'warning.main' }} />
          )}
          <Typography variant="body2" sx={{ color: currentUser.mfaEnabled ? 'text.primary' : 'text.disabled' }}>
            {currentUser.mfaEnabled ? 'MFA Ativado' : 'MFA Desativado'}
          </Typography>
        </Stack>

        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
          {currentUser.passkeyCount > 0 ? (
            <Iconify icon={"eva:checkmark-circle-2-fill" as any} width={20} sx={{ color: 'success.main' }} />
          ) : (
            <Iconify icon={"eva:alert-triangle-fill" as any} width={20} sx={{ color: 'warning.main' }} />
          )}
          <Typography variant="body2" sx={{ color: currentUser.passkeyCount > 0 ? 'text.primary' : 'text.disabled' }}>
            {currentUser.passkeyCount > 0 ? `${currentUser.passkeyCount} Passkey(s) Configuradas` : 'Passkey Não Configurada'}
          </Typography>
        </Stack>

        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
          {currentUser.biometricVerified ? (
            <Iconify icon={"eva:checkmark-circle-2-fill" as any} width={20} sx={{ color: 'success.main' }} />
          ) : (
            <Iconify icon={"eva:alert-triangle-fill" as any} width={20} sx={{ color: 'warning.main' }} />
          )}
          <Typography variant="body2" sx={{ color: currentUser.biometricVerified ? 'text.primary' : 'text.disabled' }}>
            {currentUser.biometricVerified ? 'Biometria Validada' : 'Sem Biometria'}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );

  const renderActivity = (
    <Box sx={{ p: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Atividade
      </Typography>

      <Stack spacing={2}>
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Último Acesso</Typography>
          <Typography variant="body2" sx={{ fontWeight: 'fontWeightMedium' }}>
            {currentUser.lastActivity ? fToNow(currentUser.lastActivity) : 'Nunca'}
          </Typography>
        </Stack>
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Criado em</Typography>
          <Typography variant="body2">
            {currentUser.createdAt ? fDate(currentUser.createdAt) : 'N/A'}
          </Typography>
        </Stack>
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Atualizado em</Typography>
          <Typography variant="body2">
            {currentUser.updatedAt ? fDate(currentUser.updatedAt) : 'N/A'}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );

  const statusColor = 
    currentUser.status === 'active' ? 'success' :
    currentUser.status === 'pending' ? 'warning' :
    currentUser.status === 'suspended' ? 'error' :
    currentUser.status === 'blocked' ? 'error' : 'default';

  const renderGovernance = (
    <Box sx={{ p: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Governança
      </Typography>

      <Stack spacing={2}>
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Nível de Confiança</Typography>
          <Label variant="soft" color={currentUser.trustLevel === 'Alto' ? 'success' : currentUser.trustLevel === 'Médio' ? 'warning' : 'error'}>
            {currentUser.trustLevel || 'Baixo'}
          </Label>
        </Stack>

        <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Associado Desde</Typography>
          <Typography variant="body2">
            {currentUser.createdAt ? fDate(currentUser.createdAt) : 'N/A'}
          </Typography>
        </Stack>

        <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Status Institucional</Typography>
          <Label variant="soft" color={statusColor}>
            {currentUser.status === 'active' && 'Ativo'}
            {currentUser.status === 'pending' && 'Pendente'}
            {currentUser.status === 'suspended' && 'Suspenso'}
            {currentUser.status === 'inactive' && 'Inativo'}
            {currentUser.status === 'blocked' && 'Bloqueado'}
          </Label>
        </Stack>
      </Stack>
    </Box>
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      slotProps={{ backdrop: { invisible: true } }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 1, sm: 400 } } }}
    >
      {renderHead}

      <Divider />

      <Scrollbar>
        {renderIdentity}
        <Divider sx={{ borderStyle: 'dashed' }} />
        {renderContact}
        <Divider sx={{ borderStyle: 'dashed' }} />
        {renderCompliance}
        <Divider sx={{ borderStyle: 'dashed' }} />
        {renderCredentials}
        <Divider sx={{ borderStyle: 'dashed' }} />
        {renderActivity}
        <Divider sx={{ borderStyle: 'dashed' }} />
        {renderGovernance}
      </Scrollbar>

      <Box sx={{ p: 2 }}>
        <Button variant="outlined" color="inherit" fullWidth startIcon={<Iconify icon="solar:eye-bold" />}>
          Ver Perfil Completo
        </Button>
      </Box>
    </Drawer>
  );
}
