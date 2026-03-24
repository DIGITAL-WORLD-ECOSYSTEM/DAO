'use client';

import type { Breakpoint } from '@mui/material/styles';
import type { FooterProps } from '../main/footer';
import type { NavMainProps } from '../main/nav/types';
import type { MainSectionProps, HeaderSectionProps, LayoutSectionProps } from '../core';

import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import { usePathname } from 'src/routes/hooks';

import { allLangs } from 'src/locales/locales-config';

import { Logo } from 'src/components/logo';

// 🟢 Importação do componente de fundo espacial
import { SpaceScene } from 'src/components/background/space';

import { NavMobile } from '../main/nav/mobile';
import { NavDesktop } from '../main/nav/desktop';
import { CoreNav } from '../components/core-nav';
import { Footer, HomeFooter } from '../main/footer';
import { MenuButton } from '../components/menu-button';
import { navData as blogNavData } from '../nav-config-blog';
import { LanguagePopover } from '../components/language-popover';
import { MainSection, LayoutSection, HeaderSection } from '../core';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type BlogLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    nav?: {
      data?: NavMainProps['data'];
    };
    main?: MainSectionProps;
    footer?: FooterProps;
  };
};

export function BlogLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'md',
}: BlogLayoutProps) {
  const pathname = usePathname();

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const isHomePage = pathname === '/';

  const navData = slotProps?.nav?.data ?? blogNavData;

  const renderHeader = () => {
    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={(theme) => ({
              mr: 1,
              ml: -1,
              [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
            })}
          />
          <NavMobile data={navData} open={open} onClose={onClose} />

          {/** @slot Logo */}
          <Logo />
        </>
      ),
      centerArea: (
        <NavDesktop
          data={navData}
          sx={(theme) => ({
            display: 'none',
            [theme.breakpoints.up(layoutQuery)]: { display: 'flex' },
          })}
        />
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          {/** @slot Language popover */}
          <LanguagePopover data={allLangs} />
          {/** @slot Settings button */}
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={slotProps?.header?.slotProps}
        // ✅ Transparência no Header para não bloquear as estrelas
        sx={{ ...slotProps?.header?.sx, bgcolor: 'transparent' }}
      />
    );
  };

  const renderFooter = () =>
    isHomePage ? (
      <HomeFooter sx={slotProps?.footer?.sx} />
    ) : (
      <Footer sx={slotProps?.footer?.sx} layoutQuery={layoutQuery} />
    );

  const renderMain = () => (
    <MainSection 
      {...slotProps?.main}
      // ✅ Transparência no container principal do Blog
      sx={{ bgcolor: 'transparent', ...slotProps?.main?.sx }}
    >
      {children}
    </MainSection>
  );

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={cssVars}
      // ✅ Base do LayoutSection transparente para revelar o fundo fixo
      sx={{ ...sx, bgcolor: 'transparent' }}
    >
      {/* 1. Camada de Fundo Fixa (Z-Index -1 definido no space.tsx) */}
      <SpaceScene />

      {/* 2. Camada de Conteúdo (Z-Index 1 relativo) */}
      {renderMain()}
      
      <CoreNav />
    </LayoutSection>
  );
}