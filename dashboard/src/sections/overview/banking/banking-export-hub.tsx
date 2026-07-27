import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type ExportFormat = 'PDF' | 'CSV' | 'XLSX' | 'OFX' | 'JSON' | 'SNAPSHOT';

type Props = {
  onExport: (format: ExportFormat) => void;
  disabled?: boolean;
};

export function BankingExportHub({ onExport, disabled }: Props) {
  const popover = usePopover();

  const handleExport = (format: ExportFormat) => {
    popover.onClose();
    onExport(format);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Gerar Snapshot Auditável">
          <IconButton
            color="primary"
            onClick={() => handleExport('SNAPSHOT')}
            disabled={disabled}
            sx={{ bgcolor: 'primary.lighter' }}
          >
            <Iconify icon={'solar:camera-bold-duotone' as any} />
          </IconButton>
        </Tooltip>

        <Button
          disabled={disabled}
          variant="contained"
          color="inherit"
          onClick={popover.onOpen}
          startIcon={<Iconify icon="eva:cloud-download-fill" />}
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
        >
          Exportar Relatório
        </Button>
      </Box>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-right' } }}
      >
        <MenuList>
          <Typography
            variant="overline"
            sx={{ px: 2, py: 1, color: 'text.secondary', display: 'block' }}
          >
            Formatos Contábeis
          </Typography>

          <MenuItem onClick={() => handleExport('XLSX')}>
            <Iconify icon={'vscode-icons:file-type-excel' as any} />
            Planilha (XLSX)
          </MenuItem>

          <MenuItem onClick={() => handleExport('OFX')}>
            <Iconify icon={'solar:banknotes-bold' as any} sx={{ color: 'success.main' }} />
            Padrão Bancário (OFX)
          </MenuItem>

          <MenuItem onClick={() => handleExport('CSV')}>
            <Iconify icon={'solar:file-text-bold' as any} sx={{ color: 'info.main' }} />
            Dados Brutos (CSV)
          </MenuItem>

          <Typography
            variant="overline"
            sx={{ px: 2, py: 1, color: 'text.secondary', display: 'block' }}
          >
            Formatos Legais
          </Typography>

          <MenuItem onClick={() => handleExport('PDF')}>
            <Iconify icon={'vscode-icons:file-type-pdf2' as any} />
            Comprovante Visual (PDF)
          </MenuItem>

          <MenuItem onClick={() => handleExport('JSON')}>
            <Iconify icon={'vscode-icons:file-type-json' as any} />
            Data Dump API (JSON)
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
