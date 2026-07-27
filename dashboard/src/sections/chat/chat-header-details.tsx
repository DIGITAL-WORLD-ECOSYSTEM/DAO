import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';
import type { IChatParticipant, IChatConversation } from 'src/types/chat';

import { useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { ChatHeaderSkeleton } from './chat-skeleton';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  participants: IChatParticipant[];
  collapseNav: UseNavCollapseReturn;
  conversation?: IChatConversation;
};

export function ChatHeaderDetails({ collapseNav, participants, loading, conversation }: Props) {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const menuActions = usePopover();

  const isGroup = participants.length > 1;

  const singleParticipant = participants[0];

  const { collapseDesktop, onCollapseDesktop, onOpenMobile } = collapseNav;

  const handleToggleNav = useCallback(() => {
    if (lgUp) {
      onCollapseDesktop();
    } else {
      onOpenMobile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lgUp]);

  const renderGroup = () => (
    <AvatarGroup
      max={3}
      sx={{
        [`& .${avatarGroupClasses.avatar}`]: {
          width: 32,
          height: 32,
        },
      }}
    >
      {participants.map((participant) => (
        <Avatar key={participant.id} alt={participant.name} src={participant.avatarUrl} />
      ))}
    </AvatarGroup>
  );

  const renderSingle = () => (
    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
      <Badge variant={singleParticipant?.status} badgeContent=" ">
        <Avatar src={singleParticipant?.avatarUrl} alt={singleParticipant?.name} />
      </Badge>

      <ListItemText
        primary={singleParticipant?.name}
        secondary={
          singleParticipant?.status === 'offline'
            ? fToNow(singleParticipant?.lastActivity)
            : singleParticipant?.status
        }
      />
    </Box>
  );

  if (loading) {
    return <ChatHeaderSkeleton />;
  }

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
    >
      <MenuList>
        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:bell-off-bold" />
          Hide notifications
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:forbidden-circle-bold" />
          Block
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:danger-triangle-bold" />
          Report
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={() => menuActions.onClose()} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderContextBar = () => {
    if (!conversation?.chatCategory) return null;

    let icon = '';
    let text = '';
    let color = 'text.secondary';
    let bgcolor = 'background.neutral';

    switch (conversation.chatCategory) {
      case 'ticket':
        icon = 'solar:ticket-bold';
        text = `Ticket ${conversation.id} • SLA: ${conversation.ticketSla || '24h'} • Status: ${conversation.ticketStatus || 'Aberto'}`;
        color = 'warning.main';
        bgcolor = 'warning.lighter';
        break;
      case 'p2p':
        icon = 'solar:shield-keyhole-bold';
        text = 'Comunicação End-to-End Criptografada (Seguro)';
        color = 'success.main';
        bgcolor = 'success.lighter';
        break;
      case 'dao':
        icon = 'solar:users-group-two-rounded-bold';
        text = 'Canal #governança • 3 Propostas Ativas';
        color = 'info.main';
        bgcolor = 'info.lighter';
        break;
      case 'system':
        icon = 'solar:bell-bing-bold';
        text = 'Notificações Institucionais do Sistema';
        color = 'text.secondary';
        break;
      case 'ai':
        icon = 'solar:magic-stick-3-bold';
        text = 'Assistente Operacional da DAO';
        color = 'primary.main';
        bgcolor = 'primary.lighter';
        break;
      default:
        break;
    }

    if (!text) return null;

    return (
      <Box
        sx={{
          px: 2,
          py: 0.75,
          bgcolor,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: (theme) => `1px solid ${theme.vars.palette.divider}`,
        }}
      >
        <Iconify icon={icon as any} width={16} sx={{ color }} />
        <Box sx={{ typography: 'caption', color, fontWeight: 'fontWeightBold' }}>{text}</Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 1, width: 1 }}>
        {isGroup ? renderGroup() : renderSingle()}

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton>
            <Iconify icon="solar:phone-bold" />
          </IconButton>

          <IconButton>
            <Iconify icon="solar:videocamera-record-bold" />
          </IconButton>

          <IconButton onClick={handleToggleNav}>
            <Iconify
              icon={!collapseDesktop ? 'custom:sidebar-unfold-fill' : 'custom:sidebar-fold-fill'}
            />
          </IconButton>

          <IconButton onClick={menuActions.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Box>
      </Box>

      {renderContextBar()}
      {renderMenuActions()}
    </Box>
  );
}
