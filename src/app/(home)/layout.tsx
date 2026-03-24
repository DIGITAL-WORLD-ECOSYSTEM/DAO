import { MainLayout } from 'src/layouts/main';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

/**
 * LAYOUT DA HOME (PÁGINAS PÚBLICAS)
 * Este layout envolve a Landing Page e outras páginas externas,
 * injetando o Header (Navegação), Footer e a estrutura de visualização principal
 * configurada para atrair investidores e parceiros do ecossistema ASPPIBRA.
 */
export default function Layout({ children }: Props) {
  return (
    <MainLayout>
      {/* O MainLayout gerencia a lógica de navegação pública, 
        incluindo o suporte a Dark Mode e Sticky Header, essenciais 
        para a estética Web3/Tech que definimos.
      */}
      {children}
    </MainLayout>
  );
}