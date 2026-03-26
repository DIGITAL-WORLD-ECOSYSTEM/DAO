import { constructMetadata } from '@/lib/seo/metadata';
import { ComingSoonView } from 'src/sections/coming-soon/view';

export const metadata = constructMetadata({
  title: 'Fatos e Verificação (Fact-Checking)',
  description: 'Página oficial de desmistificação de FUDs estruturais e comprovação de relatórios da DAO.',
});

export default function FactCheckingPage() {
  return <ComingSoonView />;
}
