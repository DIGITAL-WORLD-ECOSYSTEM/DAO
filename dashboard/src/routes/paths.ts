import { kebabCase } from 'es-toolkit';

import { _id, _postTitles } from 'src//_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];
const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '',
  DASHBOARD: '',
  DEVOS: '/dev',
};

// ----------------------------------------------------------------------

export const paths = {
  about: '#',
  contact: '#',
  faqs: '#',
  pricing: '#',
  payment: '#',
  comingSoon: '#',
  maintenance: '/maintenance',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '#',
  docs: '#',
  changelog: '#',
  zoneStore: '#',
  minimalStore: '#',
  freeUI: '#',
  figmaUrl: '#',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id: string) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },
  post: {
    root: `/post`,
    details: (title: string) => `/post/${kebabCase(title)}`,
    demo: { details: `/post/${kebabCase(MOCK_TITLE)}` },
  },
  // AUTH
  auth: {
    jwt: {
      signIn: `/login`,
      signUp: `/register`,
      resetPassword: `/forgot-password`,
      updatePassword: `/reset-password`,
      verify: `/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: '/',
    mail: `${ROOTS.DASHBOARD}/communication/email`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: {
        root: `${ROOTS.DASHBOARD}/analytics`,
        global: `${ROOTS.DASHBOARD}/analytics/global`,
        social: {
          root: `${ROOTS.DASHBOARD}/analytics/social`,
          networks: '#',
          analytics: '#',
          api: `${ROOTS.DASHBOARD}/analytics/social/api`,
        },
        user: {
          root: `${ROOTS.DASHBOARD}/analytics/user`,
          associates: '#',
          members: `${ROOTS.DASHBOARD}/analytics/user/members`,
          users: `${ROOTS.DASHBOARD}/analytics/user/list`,
          cards: `${ROOTS.DASHBOARD}/analytics/user/cards`,
          new: `${ROOTS.DASHBOARD}/analytics/user/new`,
          api: '#',
        },
        finance: {
          root: `${ROOTS.DASHBOARD}/analytics/finance`,
          dao: '#',
          contract: `${ROOTS.DASHBOARD}/analytics/contract`,
          api: '#',
        },
      },
      banking: {
        root: `${ROOTS.DASHBOARD}/banking`,
        treasury: `${ROOTS.DASHBOARD}/banking/treasury`,
        payments: `${ROOTS.DASHBOARD}/banking/payments`,
        financialHistory: `${ROOTS.DASHBOARD}/banking/financial-history`,
      },
      file: `${ROOTS.DASHBOARD}/file`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: { edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit` },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
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
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title: string) => `${ROOTS.DASHBOARD}/post/${kebabCase(title)}`,
      edit: (title: string) => `${ROOTS.DASHBOARD}/post/${kebabCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${kebabCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${kebabCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: { details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}` },
    },
    communication: {
      root: `${ROOTS.DASHBOARD}/communication`,
      notifications: `${ROOTS.DASHBOARD}/communication/notifications`,
      email: `${ROOTS.DASHBOARD}/communication/email`,
      whatsapp: `${ROOTS.DASHBOARD}/communication/whatsapp`,
      sms: `${ROOTS.DASHBOARD}/communication/sms`,
      social: `${ROOTS.DASHBOARD}/communication/social`,
      chat: `${ROOTS.DASHBOARD}/communication/chat`,
      settings: `${ROOTS.DASHBOARD}/communication/settings`,
    },
  },
  // DEVOS
  devos: {
    root: ROOTS.DEVOS,
    identity: `${ROOTS.DEVOS}/identity`,
    impersonation: `${ROOTS.DEVOS}/impersonation`,
    database: `${ROOTS.DEVOS}/database`,
    apis: `${ROOTS.DEVOS}/apis`,
    audit: `${ROOTS.DEVOS}/audit`,
    security: `${ROOTS.DEVOS}/security`,
    flags: `${ROOTS.DEVOS}/flags`,
    infrastructure: `${ROOTS.DEVOS}/infrastructure`,
    environment: `${ROOTS.DEVOS}/environment`,
    testing: `${ROOTS.DEVOS}/testing`,
    dao: `${ROOTS.DEVOS}/dao`,
    releases: `${ROOTS.DEVOS}/releases`,
    jobs: `${ROOTS.DEVOS}/jobs`,
    registry: `${ROOTS.DEVOS}/registry`,
    about: `${ROOTS.DEVOS}/about`,
    founder: {
      strategic: `${ROOTS.DEVOS}/founder/strategic`,
      operations: `${ROOTS.DEVOS}/founder/operations`,
      emergency: `${ROOTS.DEVOS}/founder/emergency`,
    }
  }
};
