import { constructMetadata } from 'src/lib/seo/metadata';

import { ComingSoonView } from 'src/sections/coming-soon/view';

export const metadata = constructMetadata({
  title: 'Política de Cookies e Sessões',
  description: 'Uso de sessões em cache estritas, local storage e identificação de wallets na DAO.',
});

export default function CookiesPolicyPage() {
  return <ComingSoonView />;
}
