import re

with open('src/sections/overview/analytics/analytics-filters.tsx', 'r') as f:
    content = f.read()

# We will completely rewrite the AnalyticsFilters component
# Let's write the new content out directly.

new_file_content = """import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  years: string[];
  selectedYear: string;
  onSelectYear: (year: string) => void;
  onSearch: (value: string) => void;
  searchQuery: string;
  summary: {
    totalInflow: number;
    count: number;
  };
};

export function AnalyticsFilters({
  years,
  selectedYear,
  onSelectYear,
  onSearch,
  searchQuery,
  summary,
  ...other
}: Props) {
  const displayName = searchQuery || 'ANDRESSA DE LIMA FERREIRA';
  const avatarInitials = searchQuery
    ? searchQuery.charAt(0).toUpperCase() +
      (searchQuery.split(' ')[1]?.charAt(0).toUpperCase() || searchQuery.charAt(1)?.toLowerCase())
    : 'Ad';

  const [showCpf, setShowCpf] = useState(false);
  const [showRg, setShowRg] = useState(false);
  const [showCnh, setShowCnh] = useState(false);

  return (
    <Box
      sx={{
        mb: 5,
        display: 'flex',
        borderRadius: 2,
        overflow: 'hidden',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        boxShadow: (theme) => theme.vars.customShadows.z1,
        border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
      }}
      {...other}
    >
      {/* Header Dark Finance */}
      <Box
        sx={{
          px: { xs: 3, md: 4 },
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#161c24', // Dark mode background
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 88,
              height: 88,
              mr: 3,
              bgcolor: '#00a76f',
              color: 'common.white',
              fontWeight: 800,
              fontSize: 32,
              border: (theme) => `solid 4px ${theme.vars.palette.common.white}`,
              boxShadow: `0 0 24px 0 rgba(0, 167, 111, 0.42)`,
            }}
          >
            AF
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'common.white', letterSpacing: -1 }}>
              {displayName}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Label
                variant="filled"
                sx={{
                  bgcolor: '#00a76f',
                  color: 'common.white',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  px: 1,
                  height: 24,
                  fontSize: 10,
                  borderRadius: 1,
                  boxShadow: `0 4px 12px 0 rgba(0, 167, 111, 0.24)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Iconify icon={'solar:shield-check-bold-duotone' as any} width={14} />
                ATIVO
              </Label>
            </Box>
          </Box>
        </Box>

        {/* --- DADOS DA CONTA --- */}
        <Divider sx={{ mt: 5, mb: 4, '&::before, &::after': { borderColor: 'rgba(255, 255, 255, 0.08)' } }}>
          <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.24)', px: 2, letterSpacing: 1.5 }}>
            DADOS DA CONTA
          </Typography>
        </Divider>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, rowGap: 4, columnGap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:user-id-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>ID</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>#2024001</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:user-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>Categoria</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>ASSOCIADO</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:global-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>Nacionalidade</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>Brasileira</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:user-rounded-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>Gênero</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>Feminino</Typography>
            </Box>
          </Box>
        </Box>

        {/* --- DADOS PESSOAIS --- */}
        <Divider sx={{ mt: 5, mb: 4, '&::before, &::after': { borderColor: 'rgba(255, 255, 255, 0.08)' } }}>
          <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.24)', px: 2, letterSpacing: 1.5 }}>
            DADOS PESSOAIS
          </Typography>
        </Divider>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, rowGap: 4, columnGap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:calendar-date-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>Data de Nasc.</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>22/06/1994</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:users-group-two-rounded-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>Estado Civil</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>Solteira</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:users-group-rounded-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>Nome da Mãe</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>Selma Augusta de Lima</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:users-group-rounded-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>Nome do Pai</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>Marcus Antonio Pereira Ferreira</Typography>
            </Box>
          </Box>
        </Box>

        {/* --- DOCUMENTOS OFICIAIS --- */}
        <Divider sx={{ mt: 5, mb: 4, '&::before, &::after': { borderColor: 'rgba(255, 255, 255, 0.08)' } }}>
          <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.24)', px: 2, letterSpacing: 1.5 }}>
            DOCUMENTOS OFICIAIS E REGISTROS
          </Typography>
        </Divider>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, rowGap: 4, columnGap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:card-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>CPF</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700, minWidth: 110 }}>
                  {showCpf ? '173.793.567-80' : '***.793.567-**'}
                </Typography>
                <IconButton size="small" onClick={() => setShowCpf(!showCpf)} sx={{ p: 0.5, color: 'rgba(255, 255, 255, 0.48)', '&:hover': { color: '#00a76f' } }}>
                  <Iconify icon={showCpf ? 'solar:eye-bold' : 'solar:eye-closed-bold'} width={16} />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:document-text-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>RG</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700, minWidth: 110 }}>
                  {showRg ? '301461414 - Detran/RJ' : '***461414 - Detran/RJ'}
                </Typography>
                <IconButton size="small" onClick={() => setShowRg(!showRg)} sx={{ p: 0.5, color: 'rgba(255, 255, 255, 0.48)', '&:hover': { color: '#00a76f' } }}>
                  <Iconify icon={showRg ? 'solar:eye-bold' : 'solar:eye-closed-bold'} width={16} />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:card-2-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>CNH</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700, minWidth: 110 }}>
                  {showCnh ? '07949472319' : '***494723**'}
                </Typography>
                <IconButton size="small" onClick={() => setShowCnh(!showCnh)} sx={{ p: 0.5, color: 'rgba(255, 255, 255, 0.48)', '&:hover': { color: '#00a76f' } }}>
                  <Iconify icon={showCnh ? 'solar:eye-bold' : 'solar:eye-closed-bold'} width={16} />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:steering-wheel-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>Categoria CNH</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700, lineHeight: 1 }}>
                AB
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', mt: 0.5 }}>
                (Moto e Carro)
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* --- CONTATO E REDES --- */}
        <Divider sx={{ mt: 5, mb: 4, '&::before, &::after': { borderColor: 'rgba(255, 255, 255, 0.08)' } }}>
          <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.24)', px: 2, letterSpacing: 1.5 }}>
            CONTATO E REDES SOCIAIS
          </Typography>
        </Divider>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, rowGap: 4, columnGap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:phone-calling-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>Telefone</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>+55 (21) 96478-4089</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:letter-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>E-mail</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>andressa.ferreira@email.com</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:mention-circle-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>Social</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>@andressa.ferreira</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:case-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>Profissão</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>Manicure</Typography>
            </Box>
          </Box>
        </Box>

        {/* --- ENDEREÇO E LOCALIZAÇÃO --- */}
        <Divider sx={{ mt: 5, mb: 4, '&::before, &::after': { borderColor: 'rgba(255, 255, 255, 0.08)' } }}>
          <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.24)', px: 2, letterSpacing: 1.5 }}>
            ENDEREÇO E LOCALIZAÇÃO
          </Typography>
        </Divider>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, rowGap: 4, columnGap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:mailbox-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>CEP</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>24912-000</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, gridColumn: { md: 'span 2' } }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:map-point-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>LOGRADOURO</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>Rua Palmira F. De Carvalho, lote 05, Quadra D</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:buildings-2-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>BAIRRO</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>São José de Imbassaí</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon={'solar:city-bold' as any} width={24} sx={{ color: '#00a76f', '& path': { fill: '#00a76f' } }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.48)', display: 'block', lineHeight: 1, mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>CIDADE / UF</Typography>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700 }}>Maricá - RJ</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Tabs / Footer original code - we keep it intact! */}
"""

# Read original content and extract everything after `// Tabs / Footer original code` equivalent.
# Looking at original file, there's a Box ending the dark section:
#        </Box>
#      </Box>
#      <Tabs
#        value={selectedYear}

split_marker = "      {/* --- INICIO SESSAO ENDERECO --- */}"
if split_marker in content:
   # Let's find the `      <Tabs` part which comes after the address block.
   # Wait, we can just find `<Tabs` and append the rest.
   tabs_index = content.find("      <Tabs")
   if tabs_index != -1:
      rest_of_content = content[tabs_index:]
      new_file_content += "\n      " + rest_of_content
   else:
      print("Could not find <Tabs")
else:
   print("Split marker logic skipped.")

with open('src/sections/overview/analytics/analytics-filters.tsx', 'w') as f:
    f.write(new_file_content)

print("Done generating analytics-filters.tsx")

