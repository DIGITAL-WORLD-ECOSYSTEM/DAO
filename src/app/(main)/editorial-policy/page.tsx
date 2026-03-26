import { constructMetadata } from 'src/lib/seo/metadata';
import { ComingSoonView } from 'src/sections/coming-soon/view';

export const metadata = constructMetadata({
  title: 'Política Editorial',
  description: 'Diretrizes editoriais oficiais de conteúdo, publicações e releases da DAO.',
});

export default function EditorialPolicyPage() {
  return <ComingSoonView />;
}
