import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------



const RECENT_FILES = [
  {
    name: 'Relatório_Financeiro_Q3.pdf',
    type: 'pdf',
    source: 'Maria (Financeiro)',
    date: 'Hoje, 09:30',
    icon: 'solar:document-bold',
    color: 'error',
  },
  {
    name: 'Comprovante_PIX_Ref_892.png',
    type: 'img',
    source: 'Ticket #8921',
    date: 'Ontem, 16:45',
    icon: 'solar:gallery-bold',
    color: 'info',
  },
  {
    name: 'Contrato_Prestacao_Servicos.docx',
    type: 'doc',
    source: 'Nexus AI',
    date: 'Segunda, 10:15',
    icon: 'solar:document-text-bold',
    color: 'primary',
  },
];

export function ChatDashboard() {
  const { user } = useMockedUser();
  const theme = useTheme();

  return (
    <Scrollbar sx={{ height: 1 }}>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          p: { xs: 3, md: 5, lg: 8 },
        }}
      >
        {/* Welcome Header */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ mb: 1, color: 'text.primary' }}>
            Portal de Comunicação ASPPIBRA
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Bem-vindo, {user?.displayName?.split(' ')[0] || 'Usuário'}. Aqui está o resumo das suas operações hoje.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 4,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, minmax(0, 1fr))',
            },
          }}
        >
          {/* Quick Actions */}
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify icon="solar:play-circle-bold" width={24} sx={{ color: 'primary.main' }} />
              <Typography variant="h6">Ações Rápidas</Typography>
            </Box>

            <Stack spacing={2}>
              {[
                {
                  title: 'Criar Novo Grupo',
                  subtitle: 'Reunir equipe em um canal',
                  icon: 'solar:users-group-rounded-bold',
                  color: 'primary',
                },
                {
                  title: 'Falar com IA (Nexus)',
                  subtitle: 'Assistente corporativo',
                  icon: 'solar:magic-stick-3-bold',
                  color: 'secondary',
                },
                {
                  title: 'Abrir Ticket',
                  subtitle: 'Suporte interno ou externo',
                  icon: 'solar:ticket-bold',
                  color: 'warning',
                },
              ].map((action) => (
                <Card
                  key={action.title}
                  sx={{
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: `${action.color}.main`,
                      bgcolor: 'action.hover',
                    },
                    border: `solid 1px ${theme.vars.palette.divider}`,
                    boxShadow: 'none',
                    transition: theme.transitions.create(['border-color', 'background-color']),
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      color: `${action.color}.main`,
                      bgcolor: alpha(theme.palette[action.color as 'primary' | 'secondary' | 'warning'].main, 0.12),
                    }}
                  >
                    <Iconify icon={action.icon as any} width={24} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {action.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {action.subtitle}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Stack>

          {/* Recent Files */}
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify icon={"solar:folder-with-files-bold" as any} width={24} sx={{ color: 'info.main' }} />
              <Typography variant="h6">Últimos Anexos na Rede</Typography>
            </Box>

            <Stack spacing={2}>
              {RECENT_FILES.map((file) => (
                <Card
                  key={file.name}
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: `${file.color}.main`,
                      bgcolor: 'action.hover',
                    },
                    border: `solid 1px ${theme.vars.palette.divider}`,
                    boxShadow: 'none',
                    transition: theme.transitions.create(['border-color', 'background-color']),
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      color: `${file.color}.main`,
                      bgcolor: alpha(theme.palette[file.color as 'error' | 'info' | 'primary'].main, 0.12),
                    }}
                  >
                    <Iconify icon={file.icon as any} width={24} />
                  </Box>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap sx={{ mb: 0.5 }}>
                      {file.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {file.source}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>
                    {file.date}
                  </Typography>
                </Card>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Scrollbar>
  );
}
