import type { IChatMessage, IChatParticipant } from 'src/types/chat';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { useMockedUser } from 'src/auth/hooks';

import { getMessage } from './utils/get-message';

// ----------------------------------------------------------------------

type Props = {
  message: IChatMessage;
  participants: IChatParticipant[];
  onOpenLightbox: (value: string) => void;
};

export function ChatMessageItem({ message, participants, onOpenLightbox }: Props) {
  const { user } = useMockedUser();

  const { me, senderDetails, hasImage } = getMessage({
    message,
    participants,
    currentUserId: `${user?.id}`,
  });

  const { firstName, avatarUrl } = senderDetails;

  const { body, createdAt } = message;

  const renderInfo = () => (
    <Typography
      noWrap
      variant="caption"
      sx={{ mb: 1, color: 'text.disabled', ...(!me && { mr: 'auto' }) }}
    >
      {!me && `${firstName}, `}
      {fToNow(createdAt)}
    </Typography>
  );

  const renderReadReceipt = () => {
    if (!me || !message.readReceipt) return null;

    let icon = 'solar:check-read-linear';
    let color = 'text.disabled';

    if (message.readReceipt === 'sent') {
      icon = 'solar:check-circle-linear';
    } else if (message.readReceipt === 'delivered') {
      icon = 'solar:check-read-linear';
    } else if (message.readReceipt === 'read') {
      icon = 'solar:check-read-linear';
      color = 'info.main';
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
        <Iconify icon={icon as any} width={14} sx={{ color }} />
      </Box>
    );
  };

  const renderBody = () => (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: 'background.neutral',
        ...(me && { color: 'grey.800', bgcolor: 'primary.lighter' }),
        ...(hasImage && { p: 0, bgcolor: 'transparent' }),
      }}
    >
      {hasImage ? (
        <Box
          component="img"
          alt="Attachment"
          src={body}
          onClick={() => onOpenLightbox(body)}
          sx={{
            width: 400,
            height: 'auto',
            borderRadius: 1.5,
            cursor: 'pointer',
            objectFit: 'cover',
            aspectRatio: '16/11',
            '&:hover': { opacity: 0.9 },
          }}
        />
      ) : message.messageType === 'invoice' ? (
        <Stack spacing={1.5} sx={{ minWidth: 240 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="solar:bill-list-bold" sx={{ color: 'warning.main' }} />
            <Typography variant="subtitle2">Invoice Recebida</Typography>
          </Box>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Typography variant="body2">{body}</Typography>
          {message.systemData && (
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              {message.systemData.amount} {message.systemData.currency}
            </Typography>
          )}
          <Button variant="contained" color="primary" size="small" fullWidth>
            Pagar Agora
          </Button>
        </Stack>
      ) : message.messageType === 'proposal' ? (
        <Stack spacing={1.5} sx={{ minWidth: 240 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon={'solar:document-text-bold' as any} sx={{ color: 'info.main' }} />
            <Typography variant="subtitle2">Proposta #{message.systemData?.proposalId}</Typography>
          </Box>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Typography variant="body2">{body}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {message.systemData?.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="soft" color="success" size="small" fullWidth>
              Aprovar
            </Button>
            <Button variant="soft" color="error" size="small" fullWidth>
              Rejeitar
            </Button>
          </Box>
        </Stack>
      ) : (
        body
      )}
    </Stack>
  );

  const renderSystemMessage = () => (
    <Box sx={{ width: 1, display: 'flex', justifyContent: 'center', my: 2 }}>
      <Stack
        spacing={1}
        sx={{
          alignItems: 'center',
          p: 2,
          bgcolor: 'background.neutral',
          borderRadius: 2,
          border: (theme) => `1px dashed ${theme.vars.palette.divider}`,
          minWidth: 320,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:info-circle-bold" sx={{ color: 'text.secondary' }} />
          <Typography variant="subtitle2">{body}</Typography>
        </Box>
        {message.systemData && (
          <Typography
            variant="h6"
            sx={{ color: message.systemData.action === 'pix_in' ? 'success.main' : 'text.primary' }}
          >
            + R$ {message.systemData.amount.toFixed(2)}
          </Typography>
        )}
        <Button variant="outlined" size="small" sx={{ mt: 1 }}>
          Ver Transação
        </Button>
      </Stack>
    </Box>
  );

  const renderActions = () => (
    <Box
      className="message-actions"
      sx={(theme) => ({
        pt: 0.5,
        left: 0,
        opacity: 0,
        top: '100%',
        display: 'flex',
        position: 'absolute',
        transition: theme.transitions.create(['opacity'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(me && { right: 0, left: 'unset' }),
      })}
    >
      <IconButton size="small">
        <Iconify icon="solar:reply-bold" width={16} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="eva:smiling-face-fill" width={16} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
      </IconButton>
    </Box>
  );

  if (!message.body) {
    return null;
  }

  if (message.messageType === 'system') {
    return renderSystemMessage();
  }

  return (
    <Box sx={{ mb: 5, display: 'flex', justifyContent: me ? 'flex-end' : 'unset' }}>
      {!me && <Avatar alt={firstName} src={avatarUrl} sx={{ width: 32, height: 32, mr: 2 }} />}

      <Stack sx={{ alignItems: me ? 'flex-end' : 'flex-start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderInfo()}
          {renderReadReceipt()}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            '&:hover': { '& .message-actions': { opacity: 1 } },
          }}
        >
          {renderBody()}
          {renderActions()}
        </Box>
      </Stack>
    </Box>
  );
}
