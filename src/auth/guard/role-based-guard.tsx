'use client';

import { m } from 'framer-motion';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { type Theme, type SxProps } from '@mui/material/styles';

import { ForbiddenIllustration } from 'src/assets/illustrations';

// ✅ Importação utilizando caminho relativo correto para o módulo auth
import { varBounce, MotionContainer } from '../components';

// ----------------------------------------------------------------------

type RoleBasedGuardProp = {
  hasContent?: boolean;
  allowedRoles: string[];
  currentRole: string | undefined;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export default function RoleBasedGuard({
  hasContent,
  allowedRoles,
  currentRole,
  children,
  sx,
}: RoleBasedGuardProp) {
  // Converte allowedRoles para array para garantir a comparação correta
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!currentRole || !roles.includes(currentRole)) {
    return hasContent ? (
      <Container component={MotionContainer} sx={{ textAlign: 'center', ...sx }}>
        <m.div variants={varBounce('in')}>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontFamily: '"Orbitron", sans-serif',
              fontWeight: 700,
            }}
          >
            Acesso não autorizado
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <Typography
            sx={{
              color: 'text.secondary',
              fontFamily: '"Public Sans", sans-serif',
            }}
          >
            Você não possui as permissões necessárias para acessar esta área.
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <ForbiddenIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>
      </Container>
    ) : null;
  }

  return <>{children}</>;
}