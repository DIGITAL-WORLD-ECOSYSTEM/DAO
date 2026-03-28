import { useState, useEffect, useCallback } from 'react';
import type { DialogProps } from '@mui/material';
import { m, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import { alpha, useTheme, keyframes } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// Removida importação estática da fonte orbitron para evitar Render Blocking

// ----------------------------------------------------------------------
// 1. CONSTANTES E TIPAGENS
// ----------------------------------------------------------------------

interface Tier {
  id: string;
  label: string;
  price: string;
  color: string;
  benefits: string;
  limit: number;
}

const SEED_TIERS: Tier[] = [
  { id: 'semente', label: 'SEMENTE', price: '100', color: '#91E391', benefits: 'Reserva de @arroba comum', limit: 5000 },
  { id: 'bronze', label: 'BRONZE', price: '1.000', color: '#CD7F32', benefits: 'Reserva @arroba + Ganhos 2x', limit: 100 },
  { id: 'prata', label: 'PRATA', price: '5.000', color: '#C0C0C0', benefits: 'Prioridade Alpha + Ganhos 3x', limit: 100 },
  { id: 'ouro', label: 'OURO', price: '10.000', color: '#FFD700', benefits: 'Acesso Antecipado + Ganhos 5x', limit: 100 },
  { id: 'diamante', label: 'DIAMANTE', price: '50.000', color: '#B9F2FF', benefits: 'Participação Direta nos Lucros', limit: 20 },
];

interface Props extends DialogProps {
  targetDate: Date;
  onClose: VoidFunction;
  contractAddress?: string;
  pixCode?: string;
  walletAddress?: string;
}

type ViewMode = 'COUNTDOWN' | 'TIERS' | 'CHECKOUT';

const pulseAnimation = keyframes`
  0% { opacity: 1; } 
  50% { opacity: 0.4; } 
  100% { opacity: 1; }
`;

// ----------------------------------------------------------------------
// 2. CUSTOM HOOKS
// ----------------------------------------------------------------------

function useCountdown(targetDate: Date, isActive: boolean) {
  const [countdown, setCountdown] = useState({
    days: '00', hours: '00', minutes: '00', seconds: '00',
  });

  const updateTime = useCallback(() => {
    const startTime = new Date().getTime();
    const endTime = targetDate.getTime();
    const distance = endTime - startTime;

    if (distance < 0) {
      setCountdown({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      return;
    }

    setCountdown({
      days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0'),
      hours: String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
      minutes: String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
      seconds: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0'),
    });
  }, [targetDate]);

  useEffect(() => {
    if (!isActive) return;

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [updateTime, isActive]);

  return countdown;
}

// ----------------------------------------------------------------------
// 3. COMPONENTE PRINCIPAL
// ----------------------------------------------------------------------

export default function HomeCountdownDialog({ 
  targetDate, 
  open, 
  onClose, 
  contractAddress = "0x71C...8e42",
  pixCode = "00020126580014br.gov.bcb.pix...", 
  walletAddress = "0x71C...8e42", 
  ...other 
}: Props) {
  const theme = useTheme();
  
  const [viewMode, setViewMode] = useState<ViewMode>('COUNTDOWN');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [paymentTab, setPaymentTab] = useState(0);
  const [copied, setCopied] = useState(false);
  
  const countdown = useCountdown(targetDate, viewMode === 'COUNTDOWN');
  const selectedTier = SEED_TIERS[selectedIdx];

  const onCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => setViewMode('COUNTDOWN'), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // --- O SEU ESTILO ORIGINAL "CRYSTAL NEON" DO HOME HERO ---
  const getCrystalButtonStyle = (colorColor: string) => ({
    height: 56,
    fontSize: 15,
    fontFamily: 'var(--font-orbitron), "Orbitron", sans-serif', 
    fontWeight: 700,
    borderRadius: 1.5,
    textTransform: 'uppercase',
    color: 'common.white',
    border: 'none',
    position: 'relative',
    bgcolor: alpha('#020817', 0.8), 
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      padding: '1px',
      background: `linear-gradient(180deg, 
        ${alpha(colorColor, 1)} 0%, 
        ${alpha(colorColor, 0.1)} 50%, 
        ${alpha(colorColor, 0.6)} 100%
      )`,
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
    },
    transition: theme.transitions.create(['all']),
    '&:hover': {
      bgcolor: alpha(colorColor, 0.1),
      transform: 'scale(1.02)', 
      boxShadow: `0 0 20px ${alpha(colorColor, 0.4)}`,
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="countdown-dialog-title"
      aria-describedby="countdown-dialog-description"
      {...other}
      PaperProps={{
        sx: {
          width: 440,
          height: 640,
          maxWidth: 'calc(100% - 32px)', 
          overflow: 'hidden', 
          borderRadius: 3,
          bgcolor: '#0B0F13',
          backgroundImage: `radial-gradient(circle at top right, ${alpha('#00A76F', 0.15)}, transparent)`,
          border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
          color: 'common.white',
          position: 'relative',
          zIndex: (theme) => theme.zIndex.modal + 1, 
        },
      }}
    >
      <IconButton
        onClick={onClose}
        aria-label="close dialog"
        sx={{ 
            position: 'absolute', right: 12, top: 12,
            bgcolor: '#1C252E', color: 'grey.500', 
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            '&:hover': { bgcolor: '#252F38', color: 'common.white' },
            zIndex: 9 
        }}
      >
        <Iconify icon="mingcute:close-line" width={20} />
      </IconButton>

      <DialogContent 
        sx={{ 
          p: 4, 
          textAlign: 'center', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        <AnimatePresence mode="wait">
          
          {/* VIEW: COUNTDOWN */}
          {viewMode === 'COUNTDOWN' && (
            <m.div
              key="view-countdown"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ mb: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#00E599', filter: 'drop-shadow(0 0 5px #00E599)', animation: `${pulseAnimation} 2s infinite` }} />
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'grey.500', letterSpacing: 0.5 }}>
                      Digital WORLD: <Box component="span" sx={{ color: 'common.white' }}>$0.0423</Box>
                    </Typography>
                  </Stack>
                  <Box sx={{ py: 0.3, px: 0.8, borderRadius: 0.5, bgcolor: alpha('#00E599', 0.1), display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Iconify icon="solar:double-alt-arrow-up-bold-duotone" width={12} sx={{ color: '#00E599' }} />
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#00E599' }}>+12.5%</Typography>
                  </Box>
                </Stack>

                <Typography id="countdown-dialog-title" variant="h3" sx={{ mb: 2, fontWeight: 900, letterSpacing: -1 }}>
                  RESERVE SEU <Box component="span" sx={{ color: '#00E599', textShadow: '0 0 20px rgba(0, 229, 153, 0.3)' }}>@ARROBA</Box>
                </Typography>

                <Typography id="countdown-dialog-description" sx={{ color: 'grey.500', mb: 4, fontSize: '0.9rem', lineHeight: 1.6, textAlign: 'center', px: 1 }}>
                  Membros da DAO serão os primeiros beneficiados no sistema de remuneração.                
                  Garanta seu <strong>@arroba exclusivo</strong> na gênese da <strong>Digital World</strong> e posicione-se agora.
                </Typography>

                <Stack direction="row" justifyContent="center" spacing={1.5} sx={{ mb: 4 }}>
                  <TimeBlock label="DIAS" value={countdown.days} />
                  <TimeBlock label="HORAS" value={countdown.hours} />
                  <TimeBlock label="MIN" value={countdown.minutes} />
                  <TimeBlock label="SEG" value={countdown.seconds} isLast />
                </Stack>
              </Box>

              <Stack spacing={1} sx={{ mt: 'auto' }}>
                <Button
                  fullWidth 
                  onClick={() => setViewMode('TIERS')}
                  sx={getCrystalButtonStyle('#00E599')} 
                >
                  RESERVAR MEU PERFIL
                </Button>
                <Box sx={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="caption" sx={{ color: alpha('#FFAB00', 0.8), fontWeight: 700 }}>
                    ⚠️ Nomes de usuário curtos estão esgotando
                  </Typography>
                </Box>
              </Stack>
            </m.div>
          )}

          {/* VIEW: TIERS */}
          {viewMode === 'TIERS' && (
            <m.div
              key="view-tiers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 900 }}>PLANOS SEED</Typography>
                <Typography variant="body2" sx={{ color: 'grey.500', mb: 4 }}>Arraste para escolher seu nível</Typography>

                <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 4 }}>
                  <IconButton 
                    onClick={() => setSelectedIdx(prev => Math.max(0, prev - 1))}
                    disabled={selectedIdx === 0}
                    sx={{ 
                      color: 'common.white', bgcolor: alpha('#fff', 0.05),
                      '&:hover': { bgcolor: alpha('#fff', 0.1) },
                      '&.Mui-disabled': { opacity: 0.2, bgcolor: 'transparent' } 
                    }}
                  >
                    <Iconify icon={"solar:alt-arrow-left-bold" as any} />
                  </IconButton>

                  <Box sx={{ 
                    width: 220, height: 220, p: 3, borderRadius: 3, textAlign: 'center',
                    border: `1px solid ${selectedTier.color}`, bgcolor: alpha(selectedTier.color, 0.05),
                    boxShadow: `0 0 20px ${alpha(selectedTier.color, 0.15)}`, position: 'relative',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'        
                  }}>
                    <Box sx={{ 
                      position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', 
                      bgcolor: selectedTier.color, color: '#000', px: 1.5, py: 0.5, borderRadius: 1, 
                      fontSize: '0.65rem', fontWeight: 900, whiteSpace: 'nowrap'
                    }}>
                      APENAS {selectedTier.limit} VAGAS
                    </Box>
                    <Typography variant="overline" sx={{ color: selectedTier.color, fontWeight: 900, mt: 1 }}>{selectedTier.label}</Typography>
                    <Typography variant="h3" sx={{ my: 2, fontWeight: 900, letterSpacing: -1 }}>R$ {selectedTier.price}</Typography>
                    <Box sx={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'grey.400', lineHeight: 1.2 }}>{selectedTier.benefits}</Typography>
                    </Box>
                  </Box>

                  <IconButton 
                    onClick={() => setSelectedIdx(prev => Math.min(SEED_TIERS.length - 1, prev + 1))}
                    disabled={selectedIdx === SEED_TIERS.length - 1}
                    sx={{ 
                      color: 'common.white', bgcolor: alpha('#fff', 0.05),
                      '&:hover': { bgcolor: alpha('#fff', 0.1) },
                      '&.Mui-disabled': { opacity: 0.2, bgcolor: 'transparent' } 
                    }}
                  >
                    <Iconify icon={"solar:alt-arrow-right-bold" as any} /> 
                  </IconButton>
                </Stack>

                <Stack direction="row" justifyContent="center" spacing={1} sx={{ mb: 4 }}>
                  {SEED_TIERS.map((_, index) => (
                    <Box key={index} sx={{ width: index === selectedIdx ? 24 : 8, height: 8, borderRadius: 4, bgcolor: index === selectedIdx ? selectedTier.color : alpha('#fff', 0.1), transition: '0.3s' }} />
                  ))}
                </Stack>
              </Box>

              <Stack spacing={1} sx={{ mt: 'auto' }}>
                <Button
                  fullWidth 
                  onClick={() => setViewMode('CHECKOUT')}
                  sx={getCrystalButtonStyle(selectedTier.color)} // Dinâmico com a cor do plano!
                >
                  PAGAR R$ {selectedTier.price}
                </Button>
                <Button 
                  onClick={() => setViewMode('COUNTDOWN')} 
                  disableRipple
                  sx={{ height: 48, color: 'grey.500', fontWeight: 600, fontSize: '0.85rem', '&:hover': { color: 'common.white', bgcolor: 'transparent' } }}
                >
                  Voltar
                </Button>
              </Stack>
            </m.div>
          )}

          {/* VIEW: CHECKOUT */}
          {viewMode === 'CHECKOUT' && (
            <m.div
              key="view-checkout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 900 }}>CHECKOUT SEED</Typography>
                <Typography variant="subtitle2" sx={{ color: selectedTier.color, mb: 3 }}>Plano {selectedTier.label}</Typography>

                <Tabs value={paymentTab} onChange={(_, v) => setPaymentTab(v)} variant="fullWidth" sx={{ mb: 3, '& .MuiTabs-indicator': { bgcolor: '#00E599' }, '& .MuiTab-root': { color: 'grey.600', fontWeight: 700, '&.Mui-selected': { color: '#00E599' } } }}>
                  <Tab label="PIX" />
                  <Tab label="CRIPTO" />
                </Tabs>

                <Box sx={{ 
                  p: 1.5, bgcolor: '#fff', borderRadius: 2, width: 170, height: 170, mx: 'auto', mb: 3, 
                  boxShadow: '0 0 30px rgba(0,229,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                }}>
                  <Box 
                    component="img" 
                    alt="QR Code de Pagamento para reserva" 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${paymentTab === 0 ? pixCode : walletAddress}`} 
                    sx={{ width: 1, height: 1 }} 
                  />
                </Box>
              </Box>

              <Stack spacing={1} sx={{ mt: 'auto' }}>
                <Tooltip title={copied ? "Copiado!" : "Copiar código"}>
                  <Button 
                    fullWidth 
                    onClick={() => onCopy(paymentTab === 0 ? pixCode : walletAddress)} 
                    startIcon={<Iconify icon={copied ? "solar:check-circle-bold" : "solar:copy-bold"} />} 
                    sx={getCrystalButtonStyle('#00E599')} 
                  >
                    {paymentTab === 0 ? "PIX COPIA E COLA" : "COPIAR ENDEREÇO"}
                  </Button>
                </Tooltip>
                <Button 
                  onClick={() => setViewMode('TIERS')} 
                  disableRipple
                  sx={{ height: 48, color: 'grey.500', fontWeight: 600, fontSize: '0.85rem', '&:hover': { color: 'common.white', bgcolor: 'transparent' } }}
                >
                  Alterar Plano
                </Button>
              </Stack>
            </m.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------
// 4. SUB-COMPONENTES
// ----------------------------------------------------------------------

function TimeBlock({ label, value, isLast }: { label: string; value: string; isLast?: boolean }) {
  return (
    <Stack spacing={1} alignItems="center" sx={{ position: 'relative' }}>
      <Box sx={{ width: 72, height: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 2, background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: 'common.white', lineHeight: 1 }}>{value}</Typography>
        <Typography variant="caption" sx={{ color: 'grey.600', fontWeight: 800, fontSize: '0.65rem', mt: 0.5 }}>{label}</Typography>
      </Box>
      {!isLast && <Typography variant="h4" sx={{ position: 'absolute', right: -12, top: 20, color: 'rgba(255,255,255,0.1)', fontWeight: 300 }}>:</Typography>}
    </Stack>
  );
}