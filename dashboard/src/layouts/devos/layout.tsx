import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

type Props = {
  children: ReactNode;
};

// Layout Isolado e Desacoplado exclusivo para a Plataforma DevOS
export function DevOSLayout({ children }: Props) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* 
        NOTE: A Sidebar e Navbar definitivas do DevOS seriam renderizadas aqui, 
        consumindo o registry.ts. Para o scaffolding, deixamos o wrapper estrutural.
      */}

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header do DevOS (Health Ribbon + Search) */}
        <Box
          sx={{
            px: 4,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              DevOS ⚡ Root Command Center
            </Typography>

            {/* Global Search Stub */}
            <TextField
              size="small"
              placeholder="Search DevOS (Modules, APIs, Flags)..."
              sx={{ width: 300 }}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
                },
              }}
            />
          </Stack>
        </Box>

        {/* Content Area */}
        <Container maxWidth={false} sx={{ p: 4, flexGrow: 1 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
