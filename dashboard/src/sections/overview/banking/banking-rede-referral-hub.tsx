import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { QrCodeModal } from 'src/components/shared/qr-code-modal';

// ----------------------------------------------------------------------

export function BankingRedeReferralHub() {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [campaignTag, setCampaignTag] = useState('');

  const baseUrl = 'https://asppibra.com/join?ref=USR-001';
  const finalUrl = campaignTag ? `${baseUrl}&utm_source=${campaignTag}` : baseUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(finalUrl);

    // Mock Audit Log (sending to backend)
    console.log(
      JSON.stringify({
        action: 'copy_referral_link',
        timestamp: new Date().toISOString(),
        actor: 'current_user',
        module: 'network',
        data: { url: finalUrl },
      })
    );

    toast.success('Link de indicação copiado!');
  };

  return (
    <>
      <Card sx={{ height: '100%' }}>
        <CardHeader title="Central de Captação" sx={{ mb: 2 }} />
        <Box sx={{ p: 3, pt: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Gere links customizados ou QR Codes para atrair novos afiliados para sua rede.
          </Typography>

          <TextField
            label="Tag de Campanha (Opcional)"
            placeholder="ex: instagram, evento_sp"
            value={campaignTag}
            onChange={(e) => setCampaignTag(e.target.value)}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon={'solar:tag-bold' as any}
                      width={20}
                      sx={{ color: 'text.disabled' }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
              Seu Link Personalizado
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                value={finalUrl}
                size="small"
                fullWidth
                slotProps={{
                  input: {
                    readOnly: true,
                    sx: { fontFamily: 'monospace', fontSize: 13, bgcolor: 'background.neutral' },
                  },
                }}
              />
              <Tooltip title="Copiar Link">
                <IconButton
                  color="primary"
                  onClick={handleCopy}
                  sx={{ bgcolor: 'primary.lighter' }}
                >
                  <Iconify icon={'solar:copy-bold-duotone' as any} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Button
            variant="outlined"
            color="inherit"
            fullWidth
            startIcon={<Iconify icon={'solar:qr-code-bold-duotone' as any} />}
            onClick={() => setQrModalOpen(true)}
          >
            Exibir QR Code de Indicação
          </Button>
        </Box>
      </Card>

      <QrCodeModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="Indicação de Afiliado"
        value={finalUrl}
      />
    </>
  );
}
