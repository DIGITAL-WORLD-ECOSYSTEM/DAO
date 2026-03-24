'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as ThemeVarsProvider } from '@mui/material/styles';

import { useTranslate } from 'src/locales';
import { Rtl, createTheme } from 'src/theme';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import {
  SettingsDrawer,
  defaultSettings,
  useSettingsContext,
} from 'src/components/settings';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

/**
 * COMPONENTE RAIZ DO CLIENTE (CLIENT-SIDE ENTRY POINT)
 * Gerencia a injeção de tema, internacionalização, direção de layout e notificações.
 */
export default function App({ children }: Props) {
  const settings = useSettingsContext();

  const { currentLang } = useTranslate();

  // Criação dinâmica do tema baseado nas configurações (Dark/Light/Cores) e localização
  const theme = createTheme({
    settingsState: settings.state,
    localeComponents: currentLang?.systemValue,
  });

  return (
    <ThemeVarsProvider theme={theme}>
      {/* CssBaseline: Normaliza o CSS entre navegadores e aplica o background do tema */}
      <CssBaseline />
      
      {/* Rtl: Suporte nativo para idiomas da direita para esquerda (ex: Árabe) */}
      <Rtl direction={settings.state.direction}>
        {/* MotionLazy: Carrega os recursos de animação apenas quando necessário, otimizando o LCP */}
        <MotionLazy>
          <Snackbar />
          <ProgressBar />
          
          {/* Gaveta de configurações visuais (útil para demos e personalização do usuário) */}
          <SettingsDrawer defaultSettings={defaultSettings} />
          
          {children}
        </MotionLazy>
      </Rtl>
    </ThemeVarsProvider>
  );
}