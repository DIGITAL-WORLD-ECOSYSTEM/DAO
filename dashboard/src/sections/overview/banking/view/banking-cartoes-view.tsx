import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { _bankingCreditCard } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BankingCardDrawer } from '../banking-card-drawer';
import { BankingNewCardModal } from '../banking-new-card-modal';
import { BankingCurrentBalance } from '../banking-current-balance';

// ----------------------------------------------------------------------

export type CardStatus = 'active' | 'frozen' | 'blocked' | 'expired' | 'cancelled' | 'consumed';
export type CardNature = 'physical' | 'virtual_recurring' | 'virtual_disposable';

export interface ExtendedCardData {
  id: string;
  cardType: string;
  balance: number;
  cardHolder: string;
  cardNumber: string;
  cardValid: string;
  status: CardStatus;
  nature: CardNature;
  isPrimary?: boolean;
}

const initialCards: ExtendedCardData[] = _bankingCreditCard.map((card, index) => ({
  ...card,
  status: 'active',
  nature: index === 0 ? 'physical' : 'virtual_recurring',
  isPrimary: index === 0,
}));

export function BankingCartoesView() {
  const theme = useTheme();
  const [cards, setCards] = useState<ExtendedCardData[]>(initialCards);

  const [issuingModalOpen, setIssuingModalOpen] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleOpenIssuingModal = () => setIssuingModalOpen(true);
  const handleCloseIssuingModal = () => setIssuingModalOpen(false);

  const handleEmitCard = (type: CardNature) => {
    const newCard: ExtendedCardData = {
      id: Math.random().toString(36).substring(7),
      cardType: type === 'physical' ? 'mastercard' : 'visa',
      balance: 0,
      cardHolder: 'SANDRO SILVA',
      cardNumber: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
      cardValid: '12/29',
      status: 'active',
      nature: type,
    };
    setCards([newCard, ...cards]);
  };

  const handleOpenDrawer = (cardId: string) => {
    setSelectedCardId(cardId);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedCardId(null);
  };

  const selectedCard = cards.find((c) => c.id === selectedCardId) || null;

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Central Operacional de Cartões"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Bancário', href: paths.dashboard.general.banking.root },
          { name: 'Cartões' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid size={{ xs: 12, md: 4 }} key={card.id}>
            <BankingCurrentBalance
              item={card}
              onUpdate={(updated) =>
                setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
              }
              onManage={handleOpenDrawer}
            />
          </Grid>
        ))}

        {/* Ghost Card - Emitir Novo Cartão */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            onClick={handleOpenIssuingModal}
            sx={{
              p: 3,
              height: 240, // Match the exact height of BankingCurrentBalance inner box
              display: 'flex',
              cursor: 'pointer',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'transparent',
              border: `2px dashed ${alpha(theme.palette.grey[500], 0.24)}`,
              transition: theme.transitions.create(['border', 'background-color']),
              '&:hover': {
                bgcolor: alpha(theme.palette.grey[500], 0.08),
                border: `2px dashed ${alpha(theme.palette.grey[500], 0.48)}`,
              },
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                mb: 2,
                display: 'flex',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
                bgcolor: alpha(theme.palette.grey[500], 0.12),
              }}
            >
              <Iconify icon={'solar:add-circle-bold-duotone' as any} width={28} />
            </Box>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              Emitir Novo Cartão
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.disabled', mt: 0.5, textAlign: 'center' }}
            >
              Físico, Virtual Recorrente ou Virtual Descartável
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <BankingNewCardModal
        open={issuingModalOpen}
        onClose={handleCloseIssuingModal}
        onEmit={handleEmitCard}
      />

      <BankingCardDrawer open={drawerOpen} onClose={handleCloseDrawer} card={selectedCard} />
    </DashboardContent>
  );
}
