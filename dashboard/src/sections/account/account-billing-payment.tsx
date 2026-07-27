import type { CardProps } from '@mui/material/Card';
import type { IPaymentCard } from 'src/types/common';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';


// ----------------------------------------------------------------------

type Props = CardProps & {
  cards: IPaymentCard[];
};

export function AccountBillingPayment({ cards, sx, ...other }: Props) {
  return (
    <Card sx={[{ my: 3 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <CardHeader title="Payment method" />
      <Box sx={{ p: 3, typography: 'body2', color: 'text.secondary' }}>
        Payment management is currently disabled in this dashboard.
      </Box>
    </Card>
  );
}
