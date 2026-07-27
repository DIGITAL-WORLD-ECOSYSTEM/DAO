import type { AffiliateNode } from './view/banking-rede-view';

import Box from '@mui/material/Box';
import Timeline from '@mui/lab/Timeline';
import Drawer from '@mui/material/Drawer';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TimelineContent from '@mui/lab/TimelineContent';
import LinearProgress from '@mui/material/LinearProgress';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  node: AffiliateNode;
};

export function BankingRedeAffiliateDrawer({ open, onClose, node }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'success';
      case 'Pendente':
        return 'warning';
      case 'Inativo':
        return 'default';
      case 'Suspenso':
        return 'error';
      default:
        return 'default';
    }
  };

  const timelineSteps = [
    { title: 'Convidado', date: node.invitedAt, completed: true },
    { title: 'Registrado', date: '2025-02-15T15:00:00Z', completed: node.activationScore >= 20 },
    { title: 'KYC Aprovado', date: '2025-02-16T10:00:00Z', completed: node.activationScore >= 50 },
    { title: 'Conta Ativada', date: '2025-02-17T09:00:00Z', completed: node.activationScore >= 80 },
    {
      title: 'Primeira Operação',
      date: '2025-02-20T14:30:00Z',
      completed: node.activationScore === 100,
    },
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: 320 }, p: 3 } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Detalhes do Afiliado</Typography>
        <IconButton onClick={onClose}>
          <Iconify icon={'solar:close-circle-bold' as any} />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'background.neutral',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Iconify
            icon={'solar:user-rounded-bold-duotone' as any}
            width={32}
            sx={{ color: 'text.secondary' }}
          />
        </Box>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          {node.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          ID: {node.id}
        </Typography>
        <Label color={getStatusColor(node.status) as any}>{node.status}</Label>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2">Score de Ativação</Typography>
          <Typography variant="subtitle2">{node.activationScore}%</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={node.activationScore}
          color={node.activationScore === 100 ? 'success' : 'primary'}
          sx={{ height: 8, borderRadius: 1 }}
        />
      </Box>

      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Timeline de Conversão
      </Typography>

      <Timeline
        sx={{
          p: 0,
          m: 0,
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {timelineSteps.map((step, index) => {
          const isLast = index === timelineSteps.length - 1;

          return (
            <TimelineItem key={step.title}>
              <TimelineSeparator>
                <TimelineDot color={step.completed ? 'primary' : 'grey'} />
                {!isLast && (
                  <TimelineConnector
                    sx={{ bgcolor: step.completed ? 'primary.main' : 'grey.300' }}
                  />
                )}
              </TimelineSeparator>
              <TimelineContent sx={{ pb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: step.completed ? 'text.primary' : 'text.disabled' }}
                >
                  {step.title}
                </Typography>
                {step.completed && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {new Date(step.date).toLocaleDateString()}
                  </Typography>
                )}
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Drawer>
  );
}
