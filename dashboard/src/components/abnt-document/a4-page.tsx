import React from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
};

export function A4Page({ children, headerContent, footerContent }: Props) {
  return (
    <>
      <style>
        {`
          @media print {
            @page {
              size: A4 portrait;
              margin: 15mm 15mm 0mm 15mm !important; /* Zera a margem inferior para esconder URLs */
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              background-color: white !important;
              margin: 0 !important;
              box-sizing: border-box !important;
            }

            .print-container {
              display: block !important;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              margin: 0;
              padding: 0;
              background-color: white !important;
              user-select: text !important;
            }
            .a4-sheet {
              box-shadow: none !important;
              margin: 0 !important;
              width: 210mm !important;
              min-height: 297mm !important;
              background-color: white !important;
            }
          }
        `}
      </style>

      {/* Na tela normal fica escondido, na impressão ele domina o body */}
      <Box
        className="print-container"
        sx={{
          display: 'none',
          '@media print': {
            display: 'block',
            width: '100%',
            bgcolor: 'white',
            color: 'black',
            zIndex: 9999,
          },
        }}
      >
        <Box
          className="a4-sheet"
          sx={{
            width: { xs: '100%', md: '210mm' },
            minHeight: '297mm',
            bgcolor: 'white',
            mx: 'auto',
            mb: 5,
            boxShadow: (theme) => theme.customShadows.z20,
            color: 'text.primary',
            // Margens ABNT para visualização em TELA
            pt: '0.9cm',
            pb: '0.7cm',
            pl: '3cm',
            pr: '2cm',
            '@media print': {
              p: 0, // Zera os paddings internos na impressão, pois o @page já assumiu as margens
              m: 0,
              boxShadow: 'none',
            }
          }}
        >
          {/* Tabela Multigeração */}
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
            {/* Header repetitivo */}
            {headerContent && (
              <Box component="thead" sx={{ display: 'table-header-group' }}>
                <Box component="tr">
                  <Box component="th" sx={{ pb: 0, fontWeight: 'normal', textAlign: 'left' }}>
                    {headerContent}
                  </Box>
                </Box>
              </Box>
            )}

            {/* Corpo dinâmico que quebra página suavemente */}
            <Box component="tbody" sx={{ display: 'table-row-group' }}>
              <Box component="tr">
                <Box component="td" sx={{ verticalAlign: 'top', p: 0 }}>{children}</Box>
              </Box>
            </Box>

            {/* Espaçador invisível para impedir que a tabela atropele o rodapé fixo */}
            {footerContent && (
              <Box component="tfoot" sx={{ display: 'table-footer-group' }}>
                <Box component="tr">
                  <Box component="td" sx={{ height: '30mm', p: 0, border: 'none' }} />
                </Box>
              </Box>
            )}
          </Box>

          {/* Rodapé real colado no final do papel físico */}
          {footerContent && (
            <Box
              sx={{
                position: 'fixed',
                bottom: 0,
                left: '15mm',
                right: '15mm',
                pb: '15mm', /* Margem inferior de segurança */
                pt: 2,
                bgcolor: 'white',
                '@media screen': {
                  position: 'static',
                  mt: 5,
                  pb: 0,
                },
              }}
            >
              {footerContent}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
