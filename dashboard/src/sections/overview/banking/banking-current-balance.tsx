import type { BoxProps } from '@mui/material/Box';
import type { ExtendedCardData } from './view/banking-cartoes-view';

import { useBoolean, usePopover } from 'minimal-shared/hooks';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { BankingStepUpModal } from './banking-step-up-modal';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  item: ExtendedCardData;
  onUpdate?: (updatedCard: ExtendedCardData) => void;
  onManage?: (cardId: string) => void;
};

export function BankingCurrentBalance({ item, onUpdate, onManage, sx, ...other }: Props) {
  const theme = useTheme();
  const showCurrency = useBoolean();
  const menuActions = usePopover();

  const [isFlipped, setIsFlipped] = useState(false);
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Step Up Modal State
  const [stepUpOpen, setStepUpOpen] = useState(false);
  const [stepUpAction, setStepUpAction] = useState<'flip' | 'cancel'>('flip');

  // Auto-hide logic
  useEffect(() => {
    if (isFlipped) {
      flipTimeoutRef.current = setTimeout(() => {
        setIsFlipped(false);
      }, 30000); // 30 seconds
    } else if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current);
    }
    return () => {
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    };
  }, [isFlipped]);

  const handleRevealRequest = useCallback(() => {
    menuActions.onClose();
    if (isFlipped) {
      setIsFlipped(false); // Can manually flip back without auth
    } else {
      setStepUpAction('flip');
      setStepUpOpen(true);
    }
  }, [isFlipped, menuActions]);

  const handleFreezeToggle = useCallback(() => {
    menuActions.onClose();
    if (onUpdate) {
      onUpdate({
        ...item,
        status: item.status === 'frozen' ? 'active' : 'frozen',
      });
    }
  }, [item, menuActions, onUpdate]);

  const handleCancelRequest = useCallback(() => {
    menuActions.onClose();
    setStepUpAction('cancel');
    setStepUpOpen(true);
  }, [menuActions]);

  const handleStepUpSuccess = useCallback(() => {
    setStepUpOpen(false);
    if (stepUpAction === 'flip') {
      setIsFlipped(true);
    } else if (stepUpAction === 'cancel' && onUpdate) {
      onUpdate({ ...item, status: 'cancelled' });
    }
  }, [stepUpAction, item, onUpdate]);

  const isInactive =
    item.status === 'frozen' ||
    item.status === 'blocked' ||
    item.status === 'cancelled' ||
    item.status === 'consumed';

  const getStatusLabel = () => {
    switch (item.status) {
      case 'frozen':
        return 'Congelado';
      case 'blocked':
        return 'Bloqueado';
      case 'cancelled':
        return 'Cancelado';
      case 'consumed':
        return 'Consumido';
      default:
        return null;
    }
  };

  const statusLabel = getStatusLabel();

  return (
    <Box sx={{ perspective: 1000, width: '100%', height: 240, position: 'relative' }} {...other}>
      {/* 3D Container */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          filter: isInactive ? 'grayscale(100%) opacity(0.85)' : 'none',
        }}
      >
        {/* ================= FRONT ================= */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            backfaceVisibility: 'hidden',
            borderRadius: 2,
            p: 3,
            color: 'common.white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: theme.customShadows.z16,
            backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.primary.dark, 0.95)})`,
          }}
        >
          {/* Top Row: Balance & Icons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Box
                sx={{
                  mb: 0.5,
                  typography: 'subtitle2',
                  opacity: 0.7,
                  textTransform: 'uppercase',
                  fontSize: 11,
                  letterSpacing: 1,
                }}
              >
                Saldo atual
              </Box>
              <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
                <Box
                  component="span"
                  sx={{
                    typography: 'h4',
                    fontFamily: 'var(--font-orbitron), sans-serif',
                    letterSpacing: 1,
                  }}
                >
                  {showCurrency.value ? '********' : fCurrency(item.balance)}
                </Box>
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={showCurrency.onToggle}
                  sx={{ opacity: 0.48 }}
                >
                  <Iconify icon={showCurrency.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Iconify
                icon={'solar:wireless-charge-bold' as any}
                sx={{ width: 28, height: 28, opacity: 0.6, transform: 'rotate(90deg)' }}
              />
              <IconButton
                color="inherit"
                onClick={menuActions.onOpen}
                sx={{ opacity: 0.8, mr: -1 }}
              >
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            </Box>
          </Box>

          {/* Middle Row: Chip & Card Number */}
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Iconify
              icon={'solar:sim-card-bold' as any}
              sx={{
                width: 40,
                height: 40,
                color: '#FFD700',
                opacity: 0.85,
                transform: 'rotate(90deg)',
                filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.4))',
              }}
            />
            <Box
              sx={{
                typography: 'h5',
                fontFamily: 'monospace',
                letterSpacing: 6,
                textShadow: '0px 2px 4px rgba(0,0,0,0.6)',
                opacity: 0.9,
              }}
            >
              {item.cardNumber}
            </Box>
          </Box>

          {/* Bottom Row: Details & Logo */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              mt: 'auto',
            }}
          >
            <Box sx={{ gap: 4, display: 'flex', typography: 'subtitle1' }}>
              <Box>
                <Box
                  sx={{
                    mb: 0.5,
                    opacity: 0.6,
                    typography: 'caption',
                    textTransform: 'uppercase',
                    fontSize: 10,
                    letterSpacing: 0.5,
                  }}
                >
                  Titular do cartão
                </Box>
                <Box
                  component="span"
                  sx={{
                    textTransform: 'uppercase',
                    fontFamily: 'monospace',
                    fontSize: 14,
                    letterSpacing: 1,
                    textShadow: '0px 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  {item.cardHolder}
                </Box>
              </Box>
              <Box>
                <Box
                  sx={{
                    mb: 0.5,
                    opacity: 0.6,
                    typography: 'caption',
                    textTransform: 'uppercase',
                    fontSize: 10,
                    letterSpacing: 0.5,
                  }}
                >
                  Validade
                </Box>
                <Box
                  component="span"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: 14,
                    letterSpacing: 1,
                    textShadow: '0px 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  {item.cardValid}
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                py: 0.5,
                px: 1,
                borderRadius: 1,
                display: 'inline-flex',
                bgcolor: 'common.white',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              {item.cardType === 'mastercard' ? (
                <Iconify width={36} height="auto" icon="payments:mastercard" />
              ) : (
                <Iconify width={36} height="auto" icon="payments:visa" />
              )}
            </Box>
          </Box>
        </Box>

        {/* ================= BACK ================= */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            backfaceVisibility: 'hidden',
            borderRadius: 2,
            color: 'common.white',
            boxShadow: theme.customShadows.z16,
            backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.primary.dark, 0.95)})`,
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ width: '100%', height: 40, bgcolor: 'grey.900', mt: 3 }} />{' '}
          {/* Magnetic Stripe */}
          <Box sx={{ px: 3, pt: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Box
                sx={{
                  bgcolor: 'common.white',
                  color: 'grey.800',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  ***
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ fontFamily: 'monospace', fontStyle: 'italic' }}
                >
                  123
                </Typography>
              </Box>
            </Box>

            <Typography variant="caption" sx={{ opacity: 0.7, mb: 0.5 }}>
              Número Completo (Auto-Hide em 30s)
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'monospace',
                letterSpacing: 3,
                textShadow: '0px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              4242 4242 4242 4242
            </Typography>

            <Box
              sx={{
                mt: 'auto',
                mb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  bgcolor: 'warning.main',
                  color: 'warning.darker',
                  px: 1,
                  py: 0.5,
                  borderRadius: 0.5,
                  fontSize: 10,
                  fontWeight: 'bold',
                }}
              >
                AMBIENTE DEMONSTRATIVO
              </Box>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => setIsFlipped(false)}
              >
                Ocultar
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Badges Overlay */}
      <Box sx={{ position: 'absolute', top: -10, left: 24, zIndex: 10, display: 'flex', gap: 1 }}>
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 4,
            bgcolor: 'primary.lighter',
            color: 'primary.darker',
            typography: 'caption',
            fontWeight: 'bold',
          }}
        >
          {item.nature === 'physical'
            ? 'Físico'
            : item.nature === 'virtual_recurring'
              ? 'Virtual'
              : 'Descartável'}
        </Box>
        {statusLabel && (
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 4,
              bgcolor: 'error.main',
              color: 'common.white',
              typography: 'caption',
              fontWeight: 'bold',
            }}
          >
            {statusLabel}
          </Box>
        )}
      </Box>

      {/* Popover Menu */}
      <CustomPopover
        open={menuActions.open}
        anchorEl={menuActions.anchorEl}
        onClose={menuActions.onClose}
      >
        <MenuList>
          <MenuItem onClick={handleRevealRequest} disabled={item.status === 'cancelled'}>
            <Iconify icon={isFlipped ? 'solar:eye-closed-bold' : 'solar:eye-bold'} />
            {isFlipped ? 'Ocultar Dados' : 'Revelar Dados (Step-Up)'}
          </MenuItem>

          <MenuItem
            onClick={() => {
              menuActions.onClose();
              if (onManage) onManage(item.id);
            }}
          >
            <Iconify icon="solar:settings-bold-duotone" />
            Configurar Limites
          </MenuItem>

          <MenuItem onClick={handleFreezeToggle} disabled={item.status === 'cancelled'}>
            <Iconify
              icon={'solar:lock-password-bold-duotone' as any}
              sx={{ color: item.status === 'frozen' ? 'info.main' : 'inherit' }}
            />
            {item.status === 'frozen' ? 'Descongelar' : 'Bloqueio Temporário'}
          </MenuItem>

          {item.status === 'cancelled' || item.status === 'expired' ? (
            <MenuItem
              onClick={() => {
                menuActions.onClose(); /* Mock Re-issue */
              }}
              sx={{ color: 'primary.main' }}
            >
              <Iconify icon={'solar:refresh-bold-duotone' as any} />
              Reemitir Cartão
            </MenuItem>
          ) : (
            <MenuItem onClick={handleCancelRequest} sx={{ color: 'error.main' }}>
              <Iconify icon={'solar:trash-bin-trash-bold-duotone' as any} />
              Cancelar Cartão
            </MenuItem>
          )}
        </MenuList>
      </CustomPopover>

      {/* Security Modal */}
      <BankingStepUpModal
        open={stepUpOpen}
        onClose={() => setStepUpOpen(false)}
        onSuccess={handleStepUpSuccess}
        actionTitle={
          stepUpAction === 'flip' ? 'Revelar Dados do Cartão' : 'Cancelamento Definitivo'
        }
        requireKeyword={stepUpAction === 'cancel' ? 'CANCELAR' : undefined}
      />
    </Box>
  );
}
