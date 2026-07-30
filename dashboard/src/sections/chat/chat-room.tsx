import type { BoxProps } from '@mui/material/Box';
import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';
import type { IChatParticipant, IChatConversation } from 'src/types/chat';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { ChatRoomGroup } from './chat-room-group';
import { ChatRoomSkeleton } from './chat-skeleton';
import { ChatRoomSingle } from './chat-room-single';
import { ChatRoomAttachments } from './chat-room-attachments';

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;
const NAV_DRAWER_WIDTH = 320;

type Props = BoxProps & {
  loading: boolean;
  participants: IChatParticipant[];
  collapseNav: UseNavCollapseReturn;
  messages: IChatConversation['messages'];
  conversation?: IChatConversation;
};

export function ChatRoom({
  collapseNav,
  participants,
  messages,
  loading,
  sx,
  conversation,
  ...other
}: Props) {
  const { collapseDesktop, openMobile, onCloseMobile } = collapseNav;

  const [currentTab, setCurrentTab] = useState('info');

  const isGroup = participants.length > 1;

  const attachments = messages?.map((msg) => msg.attachments).flat(1) || [];

  const handleP2PAction = (action: string) => {
    toast.success(`Navegando para: ${action}`);
  };

  const renderContextSpecificContent = () => {
    if (!conversation?.chatCategory) return null;

    if (conversation.chatCategory === 'p2p') {
      return (
        <Stack spacing={2} sx={{ p: 2, bgcolor: 'background.neutral' }}>
          <Typography variant="subtitle2">Ações Financeiras P2P</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleP2PAction('/banking/transferencias')}
            fullWidth
          >
            Transferir Pix
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => handleP2PAction('/banking/solicitacoes')}
            fullWidth
          >
            Solicitar Pagamento
          </Button>
          <Button
            variant="soft"
            color="info"
            onClick={() => handleP2PAction('/banking/cripto')}
            fullWidth
          >
            Enviar Cripto
          </Button>
        </Stack>
      );
    }

    if (conversation.chatCategory === 'ticket') {
      return (
        <Stack spacing={1.5} sx={{ p: 2, bgcolor: 'background.neutral' }}>
          <Typography variant="subtitle2">Auditoria de Suporte</Typography>
          <Divider />
          <Typography variant="caption" color="text.secondary">
            Dispositivo: iPhone 14 Pro
          </Typography>
          <Typography variant="caption" color="text.secondary">
            IP: 192.168.1.5 (BR)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Nível de Conta: Enterprise
          </Typography>
          <Typography variant="caption" color="text.secondary">
            KYC: Aprovado
          </Typography>
          <Button size="small" variant="outlined" color="error" fullWidth sx={{ mt: 2 }}>
            Encerrar Chamado
          </Button>
        </Stack>
      );
    }

    if (conversation.chatCategory === 'dao') {
      return (
        <Stack spacing={1.5} sx={{ p: 2, bgcolor: 'info.lighter', borderRadius: 2, m: 2 }}>
          <Typography variant="subtitle2" color="info.darker">
            Poder da Comunidade
          </Typography>
          <Typography variant="h4" color="info.main">
            450k ASP
          </Typography>
          <Typography variant="caption" color="info.dark">
            3 Propostas em Votação
          </Typography>
        </Stack>
      );
    }

    return null;
  };

  const TABS = [
    { value: 'info', label: 'Info' },
    { value: 'files', label: 'Arquivos' },
    { value: 'participants', label: 'Membros' },
    { value: 'settings', label: 'Config' },
  ];

  const renderContent = () =>
    loading ? (
      <ChatRoomSkeleton />
    ) : (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
        {/* Modular Tabs Row */}
        <Box sx={{ px: 2, pt: 1, borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}` }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            variant="scrollable"
            sx={{
              minHeight: 48,
              '& .MuiTab-root': {
                minHeight: 48,
                minWidth: 72,
                px: 2,
                fontWeight: 'fontWeightSemiBold',
              },
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        <Scrollbar sx={{ flexGrow: 1 }}>
          {currentTab === 'info' && (
            <Box>
              <Box sx={{ p: 3, textAlign: 'center' }}>
                {isGroup ? (
                  <ChatRoomGroup participants={participants} />
                ) : (
                  <ChatRoomSingle participant={participants[0]} />
                )}
              </Box>

              <Stack spacing={2} sx={{ p: 2 }}>
                <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1.5, border: (theme) => `solid 1px ${theme.vars.palette.divider}` }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="overline" sx={{ color: 'text.disabled', display: 'block', mb: 0.5 }}>
                        Departamento
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, typography: 'body2', fontWeight: 'fontWeightMedium' }}>
                        <Iconify icon={"solar:case-bold" as any} width={16} sx={{ color: 'text.secondary' }} />
                        {isGroup ? 'TI & Desenvolvimento' : 'ASPPIBRA'}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="overline" sx={{ color: 'text.disabled', display: 'block', mb: 0.5 }}>
                        Contato / DID
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, typography: 'body2', fontWeight: 'fontWeightMedium' }}>
                        <Iconify icon="solar:letter-bold" width={16} sx={{ color: 'text.secondary' }} />
                        did:asppibra:{conversation?.id?.split('-')[0] || 'unknown'}
                      </Box>
                    </Box>
                  </Stack>
                </Box>
                
                {renderContextSpecificContent()}
              </Stack>
            </Box>
          )}

          {currentTab === 'files' && (
            <Box sx={{ p: 2 }}>
              <ChatRoomAttachments attachments={attachments} />
            </Box>
          )}

          {currentTab === 'participants' && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Iconify icon="solar:users-group-rounded-bold" width={48} sx={{ color: 'text.disabled', mx: 'auto', mb: 2 }} />
              <Typography variant="body2" sx={{ fontWeight: 'fontWeightMedium', color: 'text.secondary', mb: 2 }}>
                {participants.length} membros na sala
              </Typography>
              <Button size="small" variant="soft" color="primary">
                Ver Lista Completa
              </Button>
            </Box>
          )}

          {currentTab === 'settings' && (
            <Stack spacing={2} sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                color="inherit"
                startIcon={<Iconify icon="solar:bell-off-bold" />}
                sx={{ justifyContent: 'flex-start' }}
              >
                Silenciar Notificações
              </Button>
              <Button
                fullWidth
                variant="soft"
                color="error"
                startIcon={<Iconify icon={"solar:shield-bold" as any} />}
                sx={{ justifyContent: 'flex-start' }}
              >
                Bloquear / Sair da Sala
              </Button>
            </Stack>
          )}
        </Scrollbar>
      </Box>
    );

  return (
    <>
      <Box
        sx={[
          (theme) => ({
            minHeight: 0,
            flex: '1 1 auto',
            width: NAV_WIDTH,
            flexDirection: 'column',
            display: { xs: 'none', lg: 'flex' },
            borderLeft: `solid 1px ${theme.vars.palette.divider}`,
            transition: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
            ...(collapseDesktop && { width: 0 }),
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {!collapseDesktop && renderContent()}
      </Box>

      <Drawer
        anchor="right"
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: NAV_DRAWER_WIDTH } },
        }}
      >
        {renderContent()}
      </Drawer>
    </>
  );
}
