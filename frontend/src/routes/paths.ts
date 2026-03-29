import { kebabCase } from 'es-toolkit';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];
const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/identity',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  team: '/team',
  whitepaper: '/whitepaper',
  ecosystem: '/ecosystem',
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.asppibra.com/',
  changelog: 'https://docs.asppibra.com/changelog/',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://asppibra.com/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figmaUrl: 'https://asppibra.com/',

  // SOFI PÚBLICO (Essencial para SEO e Sitemap)
  post: {
    root: `/sofi`,
    details: (title: string) => `/sofi/${kebabCase(title)}`,
    category: (slug: string) => `/sofi/category/${kebabCase(slug)}`,
    demo: { details: `/sofi/${kebabCase(MOCK_TITLE)}` },
  },

  // IDENTITY (AUTH)
  auth: {
    signIn: `${ROOTS.AUTH}/sign-in`,
    signUp: `${ROOTS.AUTH}/sign-up`,
    reset: `${ROOTS.AUTH}/reset`,
    update: `${ROOTS.AUTH}/update`,
    updatePassword: `${ROOTS.AUTH}/update`,
    verify: `${ROOTS.AUTH}/verify`,
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/citizen`,
      new: `${ROOTS.DASHBOARD}/citizen/new`,
      list: `${ROOTS.DASHBOARD}/citizen/list`,
      cards: `${ROOTS.DASHBOARD}/citizen/cards`,
      profile: `${ROOTS.DASHBOARD}/citizen/profile`,
      account: `${ROOTS.DASHBOARD}/citizen/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/citizen/${id}/edit`,
      demo: { edit: `${ROOTS.DASHBOARD}/citizen/${MOCK_ID}/edit` },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/sofi`,
      new: `${ROOTS.DASHBOARD}/sofi/new`,
      details: (title: string) => `${ROOTS.DASHBOARD}/sofi/${kebabCase(title)}`,
      edit: (title: string) => `${ROOTS.DASHBOARD}/sofi/${kebabCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/sofi/${kebabCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/sofi/${kebabCase(MOCK_TITLE)}/edit`,
      },
    },
  },
};