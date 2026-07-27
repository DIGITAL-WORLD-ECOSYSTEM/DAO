import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function AppGovernanceHighlight({ ...other }) {
  return (
    <Card {...other}>
      <CardHeader
        title="Governança em Destaque"
        sx={{ mb: 2 }}
        action={
          <Button component={RouterLink} href="/dao" size="small" color="inherit">
            Ver DAO
          </Button>
        }
      />

      <Stack spacing={2} sx={{ p: 3, pt: 0 }}>
        <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'primary.lighter', color: 'primary.darker' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
            <Iconify icon={'solar:archive-bold' as any} width={20} />
            <Typography variant="subtitle2">Proposta Ativa #203</Typography>
          </Stack>
          <Typography variant="body2" sx={{ mb: 1.5, opacity: 0.8 }}>
            Aprovação de orçamento para o projeto Cultiva Agro V2.
          </Typography>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ fontWeight: 'fontWeightBold' }}>
              Encerra em 3 dias
            </Typography>
            <Button size="small" variant="contained" color="primary">
              Participar
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}
