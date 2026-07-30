import type { IChatConversation } from 'src/types/chat';

import { useCallback, startTransition } from 'react';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListItemButton from '@mui/material/ListItemButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fToNow } from 'src/utils/format-time';

import { clickConversation } from 'src/actions/chat';

import { Iconify } from 'src/components/iconify';

import { useMockedUser } from 'src/auth/hooks';

import { getNavItem } from './utils/get-nav-item';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  collapse: boolean;
  onCloseMobile: () => void;
  conversation: IChatConversation;
};

export function ChatNavItem({ selected, collapse, conversation, onCloseMobile }: Props) {
  const { user } = useMockedUser();

  const router = useRouter();

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const { group, displayName, displayText, participants, lastActivity, hasOnlineInGroup } =
    getNavItem({ conversation, currentUserId: `${user?.id}` });

  const singleParticipant = participants[0];

  const handleClickConversation = useCallback(async () => {
    try {
      if (!mdUp) {
        onCloseMobile();
      }

      await clickConversation(conversation.id);

      const redirectPath = `${paths.dashboard.chat}?id=${conversation.id}`;

      startTransition(() => {
        router.push(redirectPath);
      });
    } catch (error) {
      console.error(error);
    }
  }, [conversation.id, mdUp, onCloseMobile, router]);

  const renderGroup = () => (
    <Badge variant={hasOnlineInGroup ? 'online' : 'invisible'} badgeContent=" ">
      <AvatarGroup variant="compact" sx={{ width: 48, height: 48 }}>
        {participants.slice(0, 2).map((participant) => (
          <Avatar key={participant.id} alt={participant.name} src={participant.avatarUrl} />
        ))}
      </AvatarGroup>
    </Badge>
  );

  const renderSingle = () => (
    <Badge variant={singleParticipant?.status} badgeContent=" ">
      <Avatar
        alt={singleParticipant?.name}
        src={singleParticipant?.avatarUrl}
        sx={{ width: 48, height: 48 }}
      />
    </Badge>
  );

  return (
    <Box component="li" sx={{ display: 'flex' }}>
      <ListItemButton
        onClick={handleClickConversation}
        sx={{
          py: 1.5,
          px: 2.5,
          gap: 2,
          borderRadius: 1.5,
          mb: 0.5,
          transition: (theme) => theme.transitions.create('all'),
          ...(selected && { 
            bgcolor: (theme) => theme.vars.palette.primary.lighter,
            border: (theme) => `solid 1px ${theme.vars.palette.primary.light}`,
          }),
          ...(!selected && {
            border: 'solid 1px transparent',
            '&:hover': {
              bgcolor: 'action.hover',
            }
          })
        }}
      >
        <Badge
          color="error"
          overlap="circular"
          badgeContent={collapse ? conversation.unreadCount : 0}
        >
          {group ? renderGroup() : renderSingle()}
        </Badge>

        {!collapse && (
          <>
            <Box sx={{ flexGrow: 1, minWidth: 0, overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="subtitle2" noWrap sx={{ flexGrow: 1, ...(selected && { color: 'primary.main' }) }}>
                  {displayName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {/* Pinned Icon Mock */}
                  <Iconify icon={"solar:pin-bold" as any} width={14} sx={{ color: 'text.disabled' }} />
                  <Typography variant="caption" sx={{ color: conversation.unreadCount ? 'primary.main' : 'text.disabled', fontWeight: 'fontWeightMedium' }}>
                    {fToNow(lastActivity)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                {/* Typing Indicator Mock */}
                {/* {isTyping ? ( ... ) : ( ... )} */}
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    color: conversation.unreadCount ? 'text.primary' : 'text.secondary',
                    fontWeight: conversation.unreadCount ? 'fontWeightBold' : 'fontWeightRegular',
                  }}
                >
                  {displayText}
                </Typography>

                {!!conversation.unreadCount && (
                  <Box
                    component="span"
                    sx={{
                      flexShrink: 0,
                      minWidth: 20,
                      height: 20,
                      px: 0.75,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  >
                    {conversation.unreadCount}
                  </Box>
                )}
              </Box>
            </Box>
          </>
        )}
      </ListItemButton>
    </Box>
  );
}
