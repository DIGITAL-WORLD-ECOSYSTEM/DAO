import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  value: string;
};

export function QrCodeModal({ open, onClose, title, value }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        Receber via {title.includes('PIX') ? 'PIX' : title}
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Placeholder for actual QR Code generation like react-qr-code */}
        <Box
          sx={{
            width: 200,
            height: 200,
            bgcolor: 'background.neutral',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: (theme) => `dashed 2px ${theme.vars.palette.divider}`,
            my: 3,
          }}
        >
          <Iconify icon={'solar:qr-code-bold' as any} width={80} sx={{ color: 'text.disabled' }} />
        </Box>
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
          }}
        >
          {value}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" fullWidth onClick={onClose}>
          Fechar
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<Iconify icon={'solar:share-bold' as any} />}
        >
          Compartilhar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
