import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function AppChatHubSummary({ ...other }) {
  return (
    <Card {...other}>
      <CardHeader
        title="Chat Hub"
        action={
          <Button component={RouterLink} href="/chat" size="small" color="inherit">
            Abrir Todos
          </Button>
        }
        sx={{ mb: 2 }}
      />
      <Stack spacing={2} sx={{ p: 3, pt: 0 }}>
        {/* Suporte */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Iconify
            icon={'solar:headphones-round-sound-bold' as any}
            width={24}
            sx={{ color: 'warning.main' }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">Suporte Institucional</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              2 mensagens novas
            </Typography>
          </Box>
        </Box>

        {/* DAO */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Iconify
            icon={'solar:users-group-two-rounded-bold' as any}
            width={24}
            sx={{ color: 'info.main' }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">Governança DAO</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              1 menção
            </Typography>
          </Box>
        </Box>

        {/* IA */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Iconify
            icon={'solar:magic-stick-3-bold' as any}
            width={24}
            sx={{ color: 'primary.main' }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">Assistente IA</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Aguardando sua resposta
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Card>
  );
}
