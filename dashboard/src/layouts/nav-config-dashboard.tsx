import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  folder: icon('ic-folder'),
  params: icon('ic-params'),
  banking: icon('ic-banking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  subpaths: icon('ic-subpaths'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  /**
   * 🌐 OVERVIEW GLOBAL
   */
  {
    subheader: 'OVERVIEW',
    items: [{ title: 'Início', path: paths.dashboard.root, icon: ICONS.dashboard }],
  },
  /**
   * 📂 GRUPO 1: ADMIN
   */
  {
    subheader: 'ADMINISTRATIVO',
    items: [
      {
        title: 'E-commerce',
        path: paths.dashboard.general.ecommerce,
        icon: ICONS.ecommerce,
        allowedRoles: ['admin', 'dev'],
        children: [
          {
            title: 'Produto',
            path: paths.dashboard.product.root,
            children: [
              { title: 'Lista', path: paths.dashboard.product.root },
              { title: 'Detalhes', path: paths.dashboard.product.demo.details },
              { title: 'Criar', path: paths.dashboard.product.new },
              { title: 'Editar', path: paths.dashboard.product.demo.edit },
            ],
          },
          {
            title: 'Pedido',
            path: paths.dashboard.order.root,
            children: [
              { title: 'Lista', path: paths.dashboard.order.root },
              { title: 'Detalhes', path: paths.dashboard.order.demo.details },
            ],
          },
        ],
      },
      {
        title: 'Análise',
        path: paths.dashboard.general.analytics.root,
        icon: ICONS.analytics,
        allowedRoles: ['admin', 'dev'],
        children: [
          {
            title: 'Social Hub',
            path: paths.dashboard.general.analytics.social.root,
            children: [
              { title: 'Redes Sociais', path: paths.dashboard.general.analytics.social.networks },
              { title: 'Analytics', path: paths.dashboard.general.analytics.social.analytics },
            ],
          },
          {
            title: 'User Hub',
            path: paths.dashboard.general.analytics.user.root,
            children: [
              { title: 'Usuários', path: paths.dashboard.general.analytics.user.users },
              { title: 'Membros', path: paths.dashboard.general.analytics.user.members },
            ],
          },
          {
            title: 'Finance Hub',
            path: paths.dashboard.general.analytics.finance.root,
            children: [
              { title: 'Finanças da DAO', path: paths.dashboard.general.analytics.finance.dao },
              { title: 'Contrato', path: paths.dashboard.general.analytics.finance.contract },
            ],
          },
          { title: 'Visão Global', path: paths.dashboard.general.analytics.global },
        ],
      },
      {
        title: 'Faturas',
        path: paths.dashboard.invoice.root,
        icon: ICONS.invoice,
        allowedRoles: ['admin', 'dev'],
        children: [
          { title: 'Lista', path: paths.dashboard.invoice.root },
          { title: 'Detalhes', path: paths.dashboard.invoice.demo.details },
          { title: 'Criar', path: paths.dashboard.invoice.new },
          { title: 'Editar', path: paths.dashboard.invoice.demo.edit },
        ],
      },
      {
        title: 'Blog',
        path: paths.dashboard.post.root,
        icon: ICONS.blog,
        allowedRoles: ['admin', 'dev'],
        children: [
          { title: 'Lista', path: paths.dashboard.post.root },
          { title: 'Detalhes', path: paths.dashboard.post.demo.details },
          { title: 'Criar', path: paths.dashboard.post.new },
          { title: 'Editar', path: paths.dashboard.post.demo.edit },
        ],
      },
      {
        title: 'Calendário',
        path: paths.dashboard.calendar,
        icon: ICONS.calendar,
        allowedRoles: ['admin', 'dev'],
      },
    ],
  },
  /**
   * 📂 GRUPO 2: USUÁRIOS
   */
  {
    subheader: 'USUÁRIO',
    items: [
      {
        title: 'Usuário',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Perfil', path: paths.dashboard.user.root },
          { title: 'Novo Usuário', path: paths.dashboard.user.new },
          { title: 'Conta', path: paths.dashboard.user.account, deepMatch: true },
        ],
      },
      {
        title: 'Bancário',
        path: paths.dashboard.general.banking.root,
        icon: ICONS.banking,
        children: [
          { title: 'Visão Geral', path: paths.dashboard.general.banking.root },
          { title: 'Transações', path: `${paths.dashboard.general.banking.root}/transacoes` },
          { title: 'Cartões', path: `${paths.dashboard.general.banking.root}/cartoes` },
          { title: 'Sua Rede', path: `${paths.dashboard.general.banking.root}/rede` },
          { title: 'Conta', path: `${paths.dashboard.general.banking.root}/conta` },
          { 
            title: 'Tesouraria DAO', 
            path: paths.dashboard.general.banking.treasury,
            allowedRoles: ['admin', 'dev']
          },
          { 
            title: 'Fluxo Pagamentos', 
            path: paths.dashboard.general.banking.payments,
            allowedRoles: ['admin', 'dev']
          },
          { 
            title: 'Histórico Financeiro', 
            path: paths.dashboard.general.banking.financialHistory,
            allowedRoles: ['admin', 'dev']
          },
        ],
      },
      {
        title: 'Gestor de Arquivos',
        path: paths.dashboard.fileManager,
        icon: ICONS.folder,
        children: [
          { title: 'Arquivos App', path: paths.dashboard.general.file },
          { title: 'Gerenciador', path: paths.dashboard.fileManager },
          { title: 'Fotos', path: `${paths.dashboard.fileManager}/image` },
          { title: 'Vídeos', path: `${paths.dashboard.fileManager}/video` },
          { title: 'Documentos', path: `${paths.dashboard.fileManager}/document` },
        ],
      },
      { title: 'Chat', path: paths.dashboard.chat, icon: ICONS.chat },
    ],
  },
  /**
   * 📢 GRUPO 3: COMUNICAÇÃO
   */
  {
    subheader: 'COMUNICAÇÃO',
    items: [
      {
        title: 'Central de Notificações',
        path: paths.dashboard.communication.root,
        icon: ICONS.mail,
        children: [
          {
            title: 'Visão Geral',
            path: paths.dashboard.communication.notifications,
          },
          {
            title: 'E-mail',
            path: paths.dashboard.communication.email,
            allowedRoles: ['admin', 'dev'],
          },
          {
            title: 'WhatsApp',
            path: paths.dashboard.communication.whatsapp,
            allowedRoles: ['admin', 'dev'],
          },
          {
            title: 'SMS',
            path: paths.dashboard.communication.sms,
            allowedRoles: ['admin', 'dev'],
          },
          {
            title: 'Redes Sociais',
            path: paths.dashboard.communication.social,
            allowedRoles: ['admin', 'dev'],
          },
          {
            title: 'Chat',
            path: paths.dashboard.communication.chat,
          },
          {
            title: 'Configurações',
            path: paths.dashboard.communication.settings,
          },
        ],
      },
    ],
  },
  /**
   * 🛠️ DEVELOPER
   */
  {
    subheader: '🛠️ DEVELOPER',
    items: [
      {
        title: 'Command Center',
        path: paths.devos.root,
        icon: ICONS.dashboard,
        allowedRoles: ['dev'],
      },
      {
        title: 'API',
        path: paths.devos.apis,
        icon: ICONS.lock,
        allowedRoles: ['dev'],
      },
      {
        title: 'Identity Lab',
        path: paths.devos.identity,
        icon: ICONS.user,
        allowedRoles: ['dev'],
      },
      {
        title: 'Impersonation',
        path: paths.devos.impersonation,
        icon: ICONS.external,
        allowedRoles: ['dev'],
      },
      {
        title: 'Database D1',
        path: paths.devos.database,
        icon: ICONS.folder,
        allowedRoles: ['dev'],
      },
      {
        title: 'Audit Explorer',
        path: paths.devos.audit,
        icon: ICONS.analytics,
        allowedRoles: ['dev'],
      },
      {
        title: 'Security Center',
        path: paths.devos.security,
        icon: ICONS.lock,
        allowedRoles: ['dev'],
      },
      {
        title: 'Feature Flags',
        path: paths.devos.flags,
        icon: ICONS.menuItem,
        allowedRoles: ['dev'],
      },
      {
        title: 'Infrastructure',
        path: paths.devos.infrastructure,
        icon: ICONS.params,
        allowedRoles: ['dev'],
      },
      {
        title: 'Environment',
        path: paths.devos.environment,
        icon: ICONS.file,
        allowedRoles: ['dev'],
      },
      {
        title: 'Testing Lab',
        path: paths.devos.testing,
        icon: ICONS.analytics,
        allowedRoles: ['dev'],
      },
      {
        title: 'DAO Console',
        path: paths.devos.dao,
        icon: ICONS.dashboard,
        allowedRoles: ['dev'],
      },
      {
        title: 'Release Center',
        path: paths.devos.releases,
        icon: ICONS.label,
        allowedRoles: ['dev'],
      },
      {
        title: 'Jobs & Queues',
        path: paths.devos.jobs,
        icon: ICONS.calendar,
        allowedRoles: ['dev'],
      },
      {
        title: 'System Registry',
        path: paths.devos.registry,
        icon: ICONS.folder,
        allowedRoles: ['dev'],
      },
      {
        title: 'About (Meta)',
        path: paths.devos.about,
        icon: ICONS.menuItem,
        allowedRoles: ['dev'],
      },
    ],
  },
];
