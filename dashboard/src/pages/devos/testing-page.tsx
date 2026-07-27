import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function TestingPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        Testing Page
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        Module under construction. Reserved for DevOS engineering suite.
      </Typography>
    </Box>
  );
}
