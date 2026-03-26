import { constructMetadata } from '@/lib/seo/metadata';
import { ComingSoonView } from 'src/sections/coming-soon/view';

export const metadata = constructMetadata({
  title: 'Metodologia DAO',
  description: 'Nossa metodologia técnica para a tokenização e governança interplanetária.',
});

export default function MethodologyPage() {
  return <ComingSoonView />;
}
