import { constructMetadata } from 'src/lib/seo/metadata';
import { ComingSoonView } from 'src/sections/coming-soon/view';

export const metadata = constructMetadata({
  title: 'Política de Privacidade',
  description: 'Como a ASPPIBRA-DAO protege, coleta e trata seus dados on-chain e off-chain.',
});

export default function PrivacyPolicyPage() {
  return <ComingSoonView />;
}
