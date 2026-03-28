import { constructMetadata } from 'src/lib/seo/metadata';
import { ComingSoonView } from 'src/sections/coming-soon/view';

export const metadata = constructMetadata({
  title: 'Nossos Autores e Especialistas',
  description: 'Conheça o time de analistas on-chain, desenvolvedores Solidity e fundadores do Mundo Digital.',
});

export default function AuthorsIndexPage() {
  return <ComingSoonView />;
}
