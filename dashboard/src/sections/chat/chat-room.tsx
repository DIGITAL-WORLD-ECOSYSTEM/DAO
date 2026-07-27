import type { BoxProps } from '@mui/material/Box';
import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';
import type { IChatParticipant, IChatConversation } from 'src/types/chat';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';

import { ChatRoomGroup } from './chat-room-group';
import { ChatRoomSkeleton } from './chat-skeleton';
import { ChatRoomSingle } from './chat-room-single';
import { ChatRoomAttachments } from './chat-room-attachments';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

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

  const isGroup = participants.length > 1;

  const attachments = messages.map((msg) => msg.attachments).flat(1) || [];

  const handleP2PAction = (action: string) => {
    toast.success(`Navegando para: ${action}`);
    console.log(`[AUDIT] Action: ${action} initiated in P2P room ${conversation?.id}`);
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

  const renderContent = () =>
    loading ? (
      <ChatRoomSkeleton />
    ) : (
      <Scrollbar>
        <div>
          {isGroup ? (
            <ChatRoomGroup participants={participants} />
          ) : (
            <ChatRoomSingle participant={participants[0]} />
          )}

          {renderContextSpecificContent()}

          <ChatRoomAttachments attachments={attachments} />
        </div>
      </Scrollbar>
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
