import type { ExtendedCardData } from './view/banking-cartoes-view';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TimelineDot from '@mui/lab/TimelineDot';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import FormControlLabel from '@mui/material/FormControlLabel';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  card: ExtendedCardData | null;
};

export function BankingCardDrawer({ open, onClose, card }: Props) {
  const [currentTab, setCurrentTab] = useState('controls');

  if (!card) return null;

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={(e, val) => setCurrentTab(val)}
      sx={{ px: 2.5, borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}` }}
    >
      <Tab value="controls" label="Limites & Controles" />
      <Tab value="audit" label="Audit Trail (Timeline)" />
    </Tabs>
  );

  const renderControls = (
    <Stack spacing={4} sx={{ p: 3 }}>
      {/* LIMITES */}
      <Box>
        <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
          Gestão de Limites Isolados
        </Typography>

        <Stack spacing={3}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2">Limite E-commerce / Online</Typography>
              <Typography variant="subtitle2">{fCurrency(2500)} USD</Typography>
            </Box>
            <Slider defaultValue={2500} min={0} max={5000} step={100} valueLabelDisplay="auto" />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Aplicar limite temporariamente (24h)"
              sx={{ mt: 1 }}
            />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2">Limite Saque ATM</Typography>
              <Typography variant="subtitle2">{fCurrency(500)} USD</Typography>
            </Box>
            <Slider
              defaultValue={500}
              min={0}
              max={2000}
              step={50}
              valueLabelDisplay="auto"
              color="secondary"
            />
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* CHAVES DE SEGURANÇA */}
      <Box>
        <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
          Chaves de Segurança Avançadas
        </Typography>

        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Iconify
                icon={'solar:global-bold-duotone' as any}
                width={24}
                sx={{ color: 'info.main' }}
              />
              <Typography variant="subtitle2">Compras Internacionais</Typography>
            </Box>
            <Switch defaultChecked />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Iconify
                icon={'solar:cart-large-bold-duotone' as any}
                width={24}
                sx={{ color: 'warning.main' }}
              />
              <Typography variant="subtitle2">Compras Online (Web)</Typography>
            </Box>
            <Switch defaultChecked />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Iconify
                icon={'solar:wallet-money-bold-duotone' as any}
                width={24}
                sx={{ color: 'success.main' }}
              />
              <Typography variant="subtitle2">Saques Físicos (ATM)</Typography>
            </Box>
            <Switch />
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* AÇÕES DE CARTA VIRTUAL/FISICO */}
      <Box>
        <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
          Configurações Operacionais
        </Typography>
        <Stack spacing={1.5} direction="row">
          {card.nature === 'physical' ? (
            <>
              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                startIcon={<Iconify icon="solar:eye-bold" />}
              >
                Ver PIN
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                startIcon={<Iconify icon="solar:pen-bold" />}
              >
                Alterar PIN
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              color="inherit"
              fullWidth
              startIcon={<Iconify icon={'solar:refresh-circle-bold' as any} />}
            >
              Regenerar CVV
            </Button>
          )}
        </Stack>
      </Box>
    </Stack>
  );

  const mockTimeline = [
    {
      id: '1',
      title: 'Cartão Emitido',
      time: new Date(Date.now() - 86400000 * 5),
      type: 'info',
      correlation: 'CR-991A',
    },
    {
      id: '2',
      title: 'Lote de Produção Físico',
      time: new Date(Date.now() - 86400000 * 4),
      type: 'secondary',
      correlation: 'PR-102B',
    },
    {
      id: '3',
      title: 'Despachado (Correios)',
      time: new Date(Date.now() - 86400000 * 2),
      type: 'secondary',
      correlation: 'DL-552C',
    },
    {
      id: '4',
      title: 'Cartão Ativado (App)',
      time: new Date(Date.now() - 86400000),
      type: 'success',
      correlation: 'AT-881D',
    },
    {
      id: '5',
      title: 'CVV Revelado (Audit: Chrome/Mac)',
      time: new Date(),
      type: 'warning',
      correlation: 'AU-001X',
    },
  ];

  const renderAudit = (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="subtitle2">Histórico de Eventos</Typography>
        <Button
          size="small"
          variant="soft"
          color="inherit"
          startIcon={<Iconify icon="solar:download-bold" />}
        >
          Exportar (.CSV)
        </Button>
      </Box>

      <Timeline
        sx={{ p: 0, m: 0, [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 } }}
      >
        {mockTimeline.map((item, index) => (
          <TimelineItem key={item.id}>
            <TimelineSeparator>
              <TimelineDot color={item.type as any} />
              {index !== mockTimeline.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent sx={{ pb: 3 }}>
              <Typography variant="subtitle2">{item.title}</Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
              >
                {fDateTime(item.time)}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.disabled', fontFamily: 'monospace', mt: 0.5, display: 'block' }}
              >
                Correlation ID: {item.correlation}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      slotProps={{ backdrop: { invisible: true } }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: 480 } } }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2.5,
          borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        }}
      >
        <Typography variant="h6">Configuração do Cartão</Typography>
        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Box>

      {renderTabs}

      <Scrollbar>
        {currentTab === 'controls' && renderControls}
        {currentTab === 'audit' && renderAudit}
      </Scrollbar>
    </Drawer>
  );
}
