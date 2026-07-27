import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ActionItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  actionLabel: string;
};

const _mockActions: ActionItem[] = [
  {
    id: 'act-1',
    title: 'Votação Pendente',
    description: '1 proposta aguardando seu voto.',
    icon: 'solar:hand-stars-bold',
    color: 'info.main',
    actionLabel: 'Votar',
  },
  {
    id: 'act-2',
    title: 'Chat e Suporte',
    description: '2 mensagens não lidas no chat.',
    icon: 'solar:chat-round-dots-bold',
    color: 'primary.main',
    actionLabel: 'Abrir Chat',
  },
  {
    id: 'act-3',
    title: 'Perfil Incompleto',
    description: 'Adicione sua carteira Web3.',
    icon: 'solar:user-id-bold',
    color: 'warning.main',
    actionLabel: 'Completar Perfil',
  },
];

export function AppMyActions({ ...other }) {
  return (
    <Card {...other}>
      <CardHeader title="Minhas Pendências" sx={{ mb: 2 }} />

      <Stack spacing={2} sx={{ p: 3, pt: 0 }}>
        {_mockActions.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.neutral',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  borderRadius: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color,
                  bgcolor: (theme) => `rgba(${theme.vars.palette.grey['500Channel']} / 0.12)`,
                }}
              >
                <Iconify icon={item.icon as any} width={24} />
              </Box>
              <Box>
                <Typography variant="subtitle2">{item.title}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {item.description}
                </Typography>
              </Box>
            </Box>

            <Button size="small" variant="outlined" color="inherit">
              {item.actionLabel}
            </Button>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
