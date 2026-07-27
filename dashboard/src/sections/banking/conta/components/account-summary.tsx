import type { AccountData } from '../types';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { QrCodeModal } from 'src/components/shared/qr-code-modal';

// ----------------------------------------------------------------------

type Props = {
  account: AccountData;
  hideSensitive: boolean;
};

export function AccountSummary({ account, hideSensitive }: Props) {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrData, setQrData] = useState<{ title: string; value: string }>({ title: '', value: '' });

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);

    // Mock Audit Log (sending to backend)
    console.log(
      JSON.stringify({
        action: 'copy_credential',
        timestamp: new Date().toISOString(),
        accountId: account.id,
        credentialType: label,
        actor: 'current_user',
      })
    );

    toast.success(`${label} copiado!`);
  };

  const handleOpenQR = (title: string, value: string) => {
    setQrData({ title, value });
    setQrModalOpen(true);
  };

  const renderDataRow = (label: string, value: string, showQR: boolean = false) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
          {hideSensitive ? '••••••••••••••••' : value}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {showQR && (
          <Tooltip title="Gerar QR Code">
            <IconButton size="small" onClick={() => handleOpenQR(label, value)}>
              <Iconify icon={'solar:qr-code-bold-duotone' as any} />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Copiar">
          <IconButton size="small" onClick={() => handleCopy(label, value)}>
            <Iconify icon={'solar:copy-bold-duotone' as any} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <>
      <Card>
        <CardHeader title="Credenciais de Recebimento" sx={{ mb: 2 }} />
        <Box sx={{ px: 3, pb: 3 }}>
          {account.type === 'brl' && (
            <>
              {renderDataRow('Banco', account.bankName || '')}
              {renderDataRow('Agência / Conta', `${account.agency} / ${account.accountNumber}`)}
              {account.pixKeys?.map((pix) => (
                <Box key={pix.id}>{renderDataRow(`Chave PIX (${pix.type})`, pix.value, true)}</Box>
              ))}
            </>
          )}

          {account.type === 'global' && (
            <>
              {renderDataRow('IBAN', account.iban || '', true)}
              {renderDataRow('SWIFT', account.swift || '')}
              {renderDataRow('ABA / Routing Number', account.aba || '')}
            </>
          )}

          {account.type === 'web3' && (
            <>
              {account.web3Addresses?.map((web3) => (
                <Box key={web3.id} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Iconify icon={web3.icon as any} width={20} />
                    <Typography variant="subtitle2">{web3.network}</Typography>
                    {web3.isFavorite && (
                      <Tooltip title="Endereço Principal">
                        <Iconify
                          icon={'solar:star-bold' as any}
                          sx={{ color: 'warning.main', width: 14 }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      bgcolor: 'background.neutral',
                      p: 1.5,
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', fontSize: 13, wordBreak: 'break-all' }}
                    >
                      {hideSensitive ? '0x••••...••••' : web3.address}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, pl: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenQR(web3.network, web3.address)}
                      >
                        <Iconify icon={'solar:qr-code-bold-duotone' as any} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(web3.network, web3.address)}
                      >
                        <Iconify icon={'solar:copy-bold-duotone' as any} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Button size="small" color="inherit" sx={{ mt: 1, fontSize: 12 }}>
                    Ver no Explorer
                  </Button>
                </Box>
              ))}
            </>
          )}
        </Box>
      </Card>

      <QrCodeModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title={qrData.title}
        value={qrData.value}
      />
    </>
  );
}
