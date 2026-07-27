import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  transactionId: string | null;
  // In a real scenario, this would fetch from an API based on transactionId
};

export function BankingTransacoesDrawer({ open, onClose, transactionId }: Props) {
  // Mock RBAC permission check
  const hasFullAccess = false; // "viewer" role (LGPD masking enabled)

  if (!transactionId) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      slotProps={{
        backdrop: { invisible: true },
      }}
      sx={{
        '& .MuiDrawer-paper': { width: { xs: '100%', md: 480 } },
      }}
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
        <Typography variant="h6"> Detalhes da Transação </Typography>
        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Box>

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Alert severity="success" icon={<Iconify icon="solar:shield-check-bold" />}>
            <strong>Registro Imutável</strong> — Hash e Assinaturas digitais foram validadas pelo
            sistema.
          </Alert>

          <Stack spacing={1.5}>
            <Typography
              variant="subtitle2"
              sx={{ color: 'text.secondary', textTransform: 'uppercase' }}
            >
              Rastreabilidade (Trace)
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Ledger ID
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {transactionId}
                </Typography>

                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  Correlation ID
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  cor_8f92bd3a8b41
                </Typography>

                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                  Blockchain Hash
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'monospace', color: 'primary.main', cursor: 'pointer' }}
                >
                  0x7a2...3f8c
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack spacing={1.5}>
            <Typography
              variant="subtitle2"
              sx={{ color: 'text.secondary', textTransform: 'uppercase' }}
            >
              Discriminação Financeira
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Valor Bruto
              </Typography>
              <Typography variant="subtitle2">{fCurrency(1250)} USD</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Taxas (Gas/IOF)
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
                -{fCurrency(12.5)} USD
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Valor Líquido
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'success.main' }}>
                {fCurrency(1237.5)} USD
              </Typography>
            </Box>

            <Box
              sx={{ mt: 1, p: 1.5, bgcolor: 'info.lighter', color: 'info.darker', borderRadius: 1 }}
            >
              <Typography variant="caption" sx={{ display: 'block' }}>
                Valor Original: R$ 6.875,00
              </Typography>
              <Typography variant="caption">Cotação Base: 5,50 BRL/USD</Typography>
            </Box>
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack spacing={1.5}>
            <Typography
              variant="subtitle2"
              sx={{ color: 'text.secondary', textTransform: 'uppercase' }}
            >
              Dados das Partes (LGPD)
            </Typography>

            <Stack spacing={1}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Origem
              </Typography>
              <Typography variant="body2">Amazon Web Services</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                CNPJ: {hasFullAccess ? '10.123.456/0001-99' : '***.123.***/****-99'}
              </Typography>
            </Stack>

            <Stack spacing={1} sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Destino
              </Typography>
              <Typography variant="body2">Conta Custódia Alpha</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Conta: {hasFullAccess ? '89123-4' : '***23-4'}
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack spacing={1.5}>
            <Typography
              variant="subtitle2"
              sx={{ color: 'text.secondary', textTransform: 'uppercase' }}
            >
              Timeline Operacional
            </Typography>
            {/* Mock Timeline */}
            <Stack
              spacing={1}
              sx={{
                position: 'relative',
                ml: 1,
                borderLeft: '2px solid',
                borderColor: 'divider',
                pl: 2,
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: 'success.main',
                    borderRadius: '50%',
                    position: 'absolute',
                    left: -22,
                    top: 4,
                  }}
                />
                <Typography variant="body2">Liquidado (Settled)</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {fDateTime(new Date())}
                </Typography>
              </Box>
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: 'success.main',
                    borderRadius: '50%',
                    position: 'absolute',
                    left: -22,
                    top: 4,
                  }}
                />
                <Typography variant="body2">Processado (Processed)</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {fDateTime(new Date(Date.now() - 5000))}
                </Typography>
              </Box>
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: 'success.main',
                    borderRadius: '50%',
                    position: 'absolute',
                    left: -22,
                    top: 4,
                  }}
                />
                <Typography variant="body2">Autorizado (Authorized)</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {fDateTime(new Date(Date.now() - 15000))}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Scrollbar>

      <Box sx={{ p: 2.5, borderTop: (theme) => `dashed 1px ${theme.vars.palette.divider}` }}>
        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="solar:download-bold" />}
          >
            Comprovante (V1)
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<Iconify icon="solar:danger-triangle-bold" />}
          >
            Contestar
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
