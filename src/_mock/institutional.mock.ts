/**
 * Mock de Dados Institucionais - ASPPIBRA DAO
 * Versão: 1.0 (Padrão Diamante)
 */

export const _about = {
  mission: "Conectar o agronegócio familiar ao mercado de capitais global através da tecnologia RWA.",
  vision: "Ser a maior plataforma de governança e ativos reais tokenizados do Brasil até 2027.",
  values: [
    { title: "Transparência", description: "Tudo on-chain, tudo auditável." },
    { title: "Soberania", description: "O produtor no controle dos seus ativos." },
    { title: "Inovação", description: "Blockchain e IA a serviço da terra." },
  ],
  history: "Nascida da necessidade de democratizar o crédito para o pequeno produtor...",
};

export const _team = [
  {
    id: 1,
    name: "Sandro",
    role: "Founder & Visionary",
    avatarUrl: "/assets/images/team/team-1.jpg",
    bio: "Especialista em governança descentralizada e ativos reais.",
    socials: { linkedin: "https://linkedin.com", twitter: "https://twitter.com" },
  },
  // Adicionar mais membros conforme necessário
];

export const _faqs = [
  {
    id: 1,
    question: "O que é uma DAO?",
    answer: "É uma Organização Autônoma Descentralizada, onde as decisões são tomadas pela comunidade via votação on-chain.",
  },
  {
    id: 2,
    question: "Como funciona a tokenização RWA?",
    answer: "Transformamos ativos físicos (como terras ou colheitas) em tokens digitais que podem ser usados como garantia ou investimento.",
  },
];
