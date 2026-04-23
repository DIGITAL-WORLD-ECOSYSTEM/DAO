import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { varAlpha } from 'minimal-shared/utils';

import { Iconify } from 'src/components/iconify';

import type { ICitizenItem, IMembershipCard } from 'src/types/citizen';

// ----------------------------------------------------------------------

type Props = {
  citizen: ICitizenItem;
  card: IMembershipCard;
};

export function MembershipCard({ citizen, card }: Props) {
  const theme = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const tierColor = {
    founder: theme.vars.palette.warning.main,
    partner: theme.vars.palette.info.main,
    honorary: theme.vars.palette.secondary.main,
    citizen: theme.vars.palette.primary.main,
  }[card.tier];

  const tierColorChannel = {
    founder: theme.vars.palette.warning.mainChannel,
    partner: theme.vars.palette.info.mainChannel,
    honorary: theme.vars.palette.secondary.mainChannel,
    citizen: theme.vars.palette.primary.mainChannel,
  }[card.tier];

  return (
    <Box
      onClick={handleFlip}
      sx={{
        perspective: 1000,
        width: 1,
        maxWidth: 400,
        height: 240,
        cursor: 'pointer',
        mx: 'auto',
      }}
    >
      <m.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front Side */}
        <Card
          sx={{
            width: 1,
            height: 1,
            position: 'absolute',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 3,
            background: `linear-gradient(135deg, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.9)} 0%, ${varAlpha(theme.vars.palette.common.blackChannel, 1)} 100%)`,
            border: `1px solid ${varAlpha(tierColorChannel, 0.2)}`,
            boxShadow: `0 8px 32px 0 ${varAlpha(theme.vars.palette.common.blackChannel, 0.4)}`,
            overflow: 'hidden',
          }}
        >
          {/* Top Row: Logo & Tier */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box sx={{ width: 40, height: 40, bgcolor: tierColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Iconify icon="solar:shield-check-bold" width={24} sx={{ color: 'common.black' }} />
            </Box>
            <Typography variant="overline" sx={{ color: tierColor, fontWeight: 'bold', letterSpacing: 2 }}>
              {card.tier.toUpperCase()} MEMBER
            </Typography>
          </Stack>

          {/* Middle: Avatar & Name */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={citizen.avatarUrl}
              alt={citizen.firstName}
              sx={{ width: 64, height: 64, border: `2px solid ${tierColor}` }}
            />
            <Stack>
              <Typography variant="h6" sx={{ color: 'common.white' }}>
                {citizen.firstName} {citizen.lastName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {citizen.cargoOsc || 'Cidadão da DAO'}
              </Typography>
            </Stack>
          </Stack>

          {/* Bottom: DID & Status */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
            <Stack>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 8 }}>
                DECENTRALIZED ID
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                {citizen.did.substring(0, 24)}...
              </Typography>
            </Stack>
            <Box sx={{ p: 0.5, bgcolor: 'common.white', borderRadius: 0.5 }}>
               <Iconify icon="solar:user-id-bold" width={32} sx={{ color: 'common.black' }} />
            </Box>
          </Stack>
        </Card>

        {/* Back Side */}
        <Card
          sx={{
            width: 1,
            height: 1,
            position: 'absolute',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            p: 3,
            background: theme.vars.palette.grey[900],
            border: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.1)}`,
          }}
        >
          <Typography variant="overline" sx={{ mb: 1, color: 'text.disabled' }}>
            Ficha Cadastral / Detalhes
          </Typography>

          <Stack spacing={1.5}>
            <InfoRow label="CPF" value={citizen.cpf || '---'} />
            <InfoRow label="Mandato" value={citizen.mandato || 'Permanente'} />
            <InfoRow label="Departamento" value={citizen.departamento || 'Geral'} />
            <InfoRow label="Nível" value={citizen.seniorityLevel || 'Membro'} />
            <InfoRow label="DID Full" value={citizen.did} sx={{ fontSize: 9, opacity: 0.7 }} />
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Typography variant="caption" sx={{ textAlign: 'center', color: 'text.disabled', mt: 2 }}>
            Este documento é digital e verificado via Blockchain ASPPIBRA.
          </Typography>
        </Card>
      </m.div>
    </Box>
  );
}

// ----------------------------------------------------------------------

function InfoRow({ label, value, sx }: { label: string; value: string; sx?: TypographyProps['sx'] }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {label}:
      </Typography>
      <Typography variant="caption" sx={[{ color: 'common.white', fontWeight: 'bold' }, ...(Array.isArray(sx) ? sx : [sx])]}>
        {value}
      </Typography>
    </Stack>
  );
}
