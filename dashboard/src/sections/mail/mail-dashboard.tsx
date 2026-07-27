import type { IMails } from 'src/types/mail';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { fShortenNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = {
  mails: IMails;
};

export function MailDashboard({ mails }: Props) {
  const theme = useTheme();

  // Basic aggregations
  const mailList = mails.allIds.map((id) => mails.byId[id]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const metrics = {
    today: mailList.filter((m) => m.createdAt && new Date(m.createdAt as any) >= today).length,
    unread: mailList.filter((m) => m.isUnread).length,
    sent: mailList.filter((m) => m.folder === 'sent').length,
    received: mailList.filter((m) => m.folder === 'inbox').length,
    failed: 0, // Placeholder for failed status
    drafts: mailList.filter((m) => m.folder === 'drafts').length,
  };

  const CARDS = [
    { title: 'Hoje', value: metrics.today, color: theme.vars.palette.primary.main },
    { title: 'Não Lidos', value: metrics.unread, color: theme.vars.palette.info.main },
    { title: 'Enviados', value: metrics.sent, color: theme.vars.palette.success.main },
    { title: 'Recebidos', value: metrics.received, color: theme.vars.palette.warning.main },
    { title: 'Falhas', value: metrics.failed, color: theme.vars.palette.error.main },
    { title: 'Rascunhos', value: metrics.drafts, color: theme.vars.palette.text.secondary },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(6, 1fr)',
        },
        mb: { xs: 3, md: 5 },
      }}
    >
      {CARDS.map((card) => (
        <Card
          key={card.title}
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.neutral',
            boxShadow: 'none',
          }}
        >
          <Typography variant="h4" sx={{ color: card.color }}>
            {fShortenNumber(card.value)}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}>
            {card.title}
          </Typography>
        </Card>
      ))}
    </Box>
  );
}
