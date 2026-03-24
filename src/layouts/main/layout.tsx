'use client';

import type { Breakpoint } from '@mui/material/styles';
import type { FooterProps } from './footer';
import type { NavMainProps } from './nav/types';
import type { MainSectionProps, HeaderSectionProps, LayoutSectionProps } from '../core';

import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import { allLangs } from 'src/locales/locales-config';

import { Logo } from 'src/components/logo';
// Importação do fundo espacial que atualizamos com z-index -1
import { SpaceScene } from 'src/components/background/space';

import { Footer } from './footer';
import { NavMobile } from './nav/mobile';
import { NavDesktop } from './nav/desktop';
import { CoreNav } from '../components/core-nav';
import { MenuButton } from '../components/menu-button';
import { navData as mainNavData } from '../nav-config-main';
import { LanguagePopover } from '../components/language-popover';
import { MainSection, LayoutSection, HeaderSection } from '../core';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type MainLayoutProps = LayoutBaseProps & {
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

export function MainLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'md',
}: MainLayoutProps) {
  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const navData = slotProps?.nav?.data ?? mainNavData;

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
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={slotProps?.header?.slotProps}
        // Forçamos transparência no Header para ver o fundo através dele
        sx={{ ...slotProps?.header?.sx, bgcolor: 'transparent' }}
      />
    );
  };

  const renderFooter = () => <Footer sx={slotProps?.footer?.sx} layoutQuery={layoutQuery} />;

  const renderMain = () => (
    <MainSection 
      {...slotProps?.main} 
      // Garante que o container principal não tenha cor de fundo
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
      sx={{
        ...sx,
        bgcolor: 'transparent', // Base do layout transparente
      }}
    >
      {/* 1. O Fundo Espacial (SpaceScene)
          Como ele tem z-index: -1 e position: fixed no space.tsx, 
          ele ficará atrás de tudo o que for renderizado abaixo.
      */}
      <SpaceScene />

      {/* 2. O Conteúdo da Página
          Injetado após o SpaceScene para respeitar a ordem do DOM,
          mesmo com o z-index controlado.
      */}
      {renderMain()}

      <CoreNav />
    </LayoutSection>
  );
}