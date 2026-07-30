

import type { IChatParticipant } from 'src/types/chat';

import { toast } from 'sonner';
import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import { useChatRealtime } from 'src/contexts/chat-realtime-context';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  disabled: boolean;
  recipients: IChatParticipant[];
  selectedConversationId: string;
  onAddRecipients: (recipients: IChatParticipant[]) => void;
};

export function ChatMessageInput({
  disabled,
  recipients,
  onAddRecipients,
  selectedConversationId,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState('');
  
  const { sendMessage: sendWsMessage } = useChatRealtime();

  const handleAttach = useCallback(() => {
    toast.info('Recurso em implantação. O envio de anexos será liberado em breve.');
  }, []);

  const handleChangeMessage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessage = useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter' || !message) return;
      
      const payload = {
        id: crypto.randomUUID(),
        body: message,
        contentType: 'text',
        createdAt: new Date(),
        senderId: 'mock-user-id' // Será substituído pelo backend ou context real
      };
      
      sendWsMessage(payload);
      setMessage('');
    },
    [message, sendWsMessage]
  );

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: (theme) => `solid 1px ${theme.vars.palette.divider}`, zIndex: 10 }}>
      <Box
        sx={{
          maxWidth: '100%',
          mx: 'auto',
          border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          borderRadius: 1.5,
          bgcolor: 'background.neutral',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: (theme) => theme.transitions.create(['border-color', 'box-shadow']),
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: (theme) => `0 0 0 1px ${theme.vars.palette.primary.main}`,
          },
        }}
      >
        <InputBase
          multiline
          minRows={2}
          maxRows={6}
          name="chat-message"
          id="chat-message-input"
          value={message}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSendMessage(event as any);
            }
          }}
          onChange={handleChangeMessage}
          placeholder="Digite uma mensagem (use / para atalhos)..."
          disabled={disabled}
          sx={{
            p: 2,
            typography: 'body2',
          }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
            px: 1.5,
            py: 1,
            borderTop: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Emojis">
              <IconButton size="small" onClick={handleAttach}>
                <Iconify icon="eva:smiling-face-fill" width={20} />
              </IconButton>
            </Tooltip>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 16, my: 'auto' }} />
            
            <Tooltip title="Anexar Arquivo">
              <IconButton size="small" onClick={handleAttach}>
                <Iconify icon="eva:attach-2-fill" width={20} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Imagem">
              <IconButton size="small" onClick={handleAttach}>
                <Iconify icon="solar:gallery-add-bold" width={20} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Documento">
              <IconButton size="small" onClick={handleAttach}>
                <Iconify icon={"solar:document-add-bold" as any} width={20} />
              </IconButton>
            </Tooltip>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 16, my: 'auto' }} />
            
            <Tooltip title="NFT / PIX">
              <IconButton 
                size="small" 
                onClick={handleAttach}
                sx={{ 
                  color: 'success.main',
                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.success.main, 0.16),
                  }
                }}
              >
                <Iconify icon={"solar:card-bold" as any} width={20} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Gravar Áudio">
              <IconButton size="small" onClick={handleAttach}>
                <Iconify icon="solar:microphone-bold" width={20} />
              </IconButton>
            </Tooltip>

            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleSendMessage as any}
              disabled={disabled || !message.trim()}
              endIcon={<Iconify icon={"iconamoon:send-fill" as any} />}
              sx={{ borderRadius: 1 }}
            >
              Enviar
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
