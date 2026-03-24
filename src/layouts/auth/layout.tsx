'use client';

import type { Theme, CSSObject, Breakpoint } from '@mui/material/styles';
import type { AuthCenteredContentProps } from './content';
import type { MainSectionProps, HeaderSectionProps, LayoutSectionProps } from '../core';

import { merge } from 'es-toolkit';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';

import { AuthCenteredContent } from './content';
import { AuthBackgroundAnimation } from './background-animation';
import { MainSection, LayoutSection, HeaderSection } from '../core';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type AuthCenteredLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
    content?: AuthCenteredContentProps;
  };
};

export function AuthCenteredLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'md',
}: AuthCenteredLayoutProps) {
  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = { container: { maxWidth: false } };

    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: <Logo />,
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          <Link
            href={paths.faqs}
            component={RouterLink}
            color="inherit"
            sx={{ typography: 'subtitle2' }}
          >
            Need help?
          </Link>
        </Box>
      ),
    };

    return (
      <HeaderSection
        disableElevation
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={[
          { 
            position: { [layoutQuery]: 'fixed' },
            bgcolor: 'transparent', // Garante que o header não bloqueie o fundo
          },
          ...(Array.isArray(slotProps?.header?.sx) ? slotProps.header.sx : [slotProps?.header?.sx]),
        ]}
      />
    );
  };

  const renderFooter = () => null;

  const renderMain = () => (
    <MainSection
      {...slotProps?.main}
      sx={[
        (theme) => ({
          alignItems: 'center',
          display: 'flex',
          background: 'transparent', // ✅ OBRIGATÓRIO: Remove o fundo sólido do Main
          p: theme.spacing(3, 2, 10, 2),
          [theme.breakpoints.up(layoutQuery)]: {
            justifyContent: 'center',
            p: theme.spacing(10, 0, 10, 0),
          },
        }),
        ...(Array.isArray(slotProps?.main?.sx) ? slotProps.main.sx : [slotProps?.main?.sx]),
      ]}
    >
      <AuthCenteredContent {...slotProps?.content}>{children}</AuthCenteredContent>
    </MainSection>
  );

  return (
    <LayoutSection
      headerSection={renderHeader()}
      footerSection={renderFooter()}
      cssVars={{ '--layout-auth-content-width': '380px', ...cssVars }}
      sx={[
        { 
            position: 'relative',
            overflow: 'hidden', // Evita scroll causado pelas partículas
            bgcolor: '#030712' // Cor de base bem escura (DEX World)
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* 1. O fundo 3D fica na camada mais baixa */}
      <AuthBackgroundAnimation />

      {/* 2. O conteúdo da autenticação fica por cima */}
      {renderMain()}
    </LayoutSection>
  );
}

// ----------------------------------------------------------------------

// Ajustamos o backgroundStyles para ser apenas uma camada de suporte transparente
const backgroundStyles = (theme: Theme): CSSObject => ({
  zIndex: -1, // Empurra para trás do Canvas de animação
  width: '100%',
  height: '100%',
  content: "''",
  position: 'absolute',
  backgroundColor: 'transparent',
});