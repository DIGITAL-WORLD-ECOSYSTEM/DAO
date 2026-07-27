import type {
  FeedItem,
  ActiveProject,
  RecognitionItem,
  OpportunityItem,
  HomeAnnouncement,
} from 'src/types/home';

import { fAdd, fSub } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export const _homeAnnouncements: HomeAnnouncement[] = [
  {
    id: 'ann-1',
    priority: 'critical',
    title: 'Atualização de Regulamento',
    description:
      'Novas diretrizes para os afiliados da plataforma entram em vigor dia 01/09. Leia agora.',
    actionLabel: 'Ver Regulamento',
    actionRoute: '#',
    startsAt: fSub({ days: 1 }),
    endsAt: fAdd({ days: 5 }),
    published: true,
  },
  {
    id: 'ann-2',
    priority: 'high',
    title: 'Bem-vindo ao Ecossistema ASPPIBRA',
    description:
      'Plataforma integrada de comunidade, governança, comunicação, projetos e serviços digitais.',
    actionLabel: 'Explorar Comunidade',
    actionRoute: '#',
    startsAt: fSub({ days: 10 }),
    endsAt: fAdd({ days: 365 }),
    published: true,
  },
  {
    id: 'ann-3',
    priority: 'normal',
    title: 'Nova Proposta em Votação',
    description:
      'Participe das decisões que impactam a comunidade e acompanhe o resultado das votações.',
    actionLabel: 'Ver Propostas',
    actionRoute: '/dao',
    startsAt: fSub({ hours: 12 }),
    endsAt: fAdd({ days: 7 }),
    published: true,
  },
  {
    id: 'ann-4',
    priority: 'normal',
    title: 'Próximos Eventos Confirmados',
    description: 'Assembleias, treinamentos, webinars e encontros da comunidade.',
    actionLabel: 'Ver Agenda',
    actionRoute: '#',
    startsAt: fSub({ days: 2 }),
    endsAt: fAdd({ days: 30 }),
    published: true,
  },
  {
    id: 'ann-5',
    priority: 'normal',
    title: 'Expanda Sua Rede',
    description: 'Convide novos participantes e acompanhe o crescimento da sua comunidade.',
    actionLabel: 'Acessar Rede',
    actionRoute: '/banking/rede',
    startsAt: fSub({ days: 20 }),
    endsAt: fAdd({ days: 300 }),
    published: true,
  },
  {
    id: 'ann-6',
    priority: 'normal',
    title: 'Projetos em Destaque',
    description: 'Conheça as iniciativas ativas e acompanhe os resultados da comunidade.',
    actionLabel: 'Ver Projetos',
    actionRoute: '#',
    startsAt: fSub({ days: 15 }),
    endsAt: fAdd({ days: 90 }),
    published: true,
  },
  {
    id: 'ann-7',
    priority: 'low',
    title: 'Precisa de Ajuda?',
    description: 'Fale com o suporte institucional e acompanhe seus atendimentos.',
    actionLabel: 'Abrir Chat',
    actionRoute: '/chat',
    startsAt: fSub({ days: 30 }),
    endsAt: fAdd({ days: 365 }),
    published: true,
  },
];

export const _homeFeeds: FeedItem[] = [
  {
    id: 'feed-1',
    type: 'announcement',
    title: 'Novo portal de afiliados no ar',
    content:
      'O módulo de expansão em rede (Networking Graph) já está disponível para todos os membros ativos.',
    createdAt: fSub({ hours: 2 }),
    authorName: 'Mundo Digital Oficial',
    actionLabel: 'Ver Detalhes',
    actionRoute: '/banking/rede',
  },
  {
    id: 'feed-2',
    type: 'achievement',
    title: 'Marco de 1.000 Parceiros Ativos',
    content:
      'Chegamos hoje à expressiva marca de mais de 1.000 parceiros conectados à rede ASPPIBRA! Um marco histórico.',
    createdAt: fSub({ hours: 14 }),
    authorName: 'Comunidade ASPPIBRA',
    mediaUrl: '/assets/background/background-3.webp',
  },
  {
    id: 'feed-3',
    type: 'project',
    title: 'Cultiva Agro - Fase 2',
    content:
      'O projeto Cultiva Agro acaba de iniciar sua segunda etapa de integração com parceiros logísticos.',
    createdAt: fSub({ days: 1 }),
    authorName: 'Diretoria Executiva',
  },
];

export const _activeProjects: ActiveProject[] = [
  {
    id: 'proj-1',
    name: 'Cultiva Agro',
    description: 'Projeto de fomento e modernização do agronegócio',
    progress: 72,
    status: 'active',
  },
  {
    id: 'proj-2',
    name: 'Mundo Digital V2',
    description: 'Nova versão da plataforma (em rollout)',
    progress: 95,
    status: 'active',
  },
  {
    id: 'proj-3',
    name: 'FFC Hub',
    description: 'Centro logístico compartilhado',
    progress: 30,
    status: 'planning',
  },
];

export const _weeklyRecognitions: RecognitionItem[] = [
  {
    id: 'rec-1',
    type: 'member',
    name: 'João Silva',
    description: 'Maior engajamento na DAO',
    badgeIcon: 'solar:medal-star-bold-duotone',
  },
  {
    id: 'rec-2',
    type: 'project',
    name: 'Cultiva Agro',
    description: 'Projeto com maior avanço semanal',
    badgeIcon: 'solar:rocket-bold-duotone',
  },
  {
    id: 'rec-3',
    type: 'partner',
    name: 'Logística SA',
    description: 'Parceiro Destaque da Semana',
    badgeIcon: 'solar:hand-shake-bold-duotone',
  },
];

export const _opportunities: OpportunityItem[] = [
  {
    id: 'opp-1',
    type: 'grant',
    title: 'Edital de Inovação',
    description: 'Financiamento para soluções ESG em 2026',
    deadline: fAdd({ days: 15 }),
  },
  {
    id: 'opp-2',
    type: 'partnership',
    title: 'Fornecimento Cultiva',
    description: 'Chamada para parceiros de distribuição logística',
  },
];
