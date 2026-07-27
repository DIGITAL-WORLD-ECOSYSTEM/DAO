import { constructMetadata } from 'src/lib/seo/metadata';
import { TeamView } from 'src/sections/team/_view';

// ----------------------------------------------------------------------

export const metadata = constructMetadata({
  title: 'Nossa Equipe | ASPPIBRA DAO',
  description: 'Conheça os especialistas e arquitetos por trás da governança ASPPIBRA DAO e do ecossistema RWA.',
});

export default function TeamPage() {
  return <TeamView />;
}
