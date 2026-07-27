import { today } from 'src/utils/format-time';

import { CONFIG } from 'src/global-config';

import { _mock } from './_mock';

// APP
// ----------------------------------------------------------------------

export const _appRelated = [
  'Microsoft office 365',
  'Opera',
  'Adobe acrobat reader DC',
  'Joplin',
  'Topaz photo AI',
].map((name, index) => ({
  id: _mock.id(index),
  name,
  downloaded: _mock.number.nativeL(index),
  ratingNumber: _mock.number.rating(index),
  size: _mock.number.nativeL(index) * 1024,
  totalReviews: _mock.number.nativeL(index),
  shortcut: `${CONFIG.assetsDir}/assets/icons/apps/ic-app-${index + 1}.webp`,
  price: [2, 4].includes(index) ? _mock.number.price(index) : 0,
}));

export const _appInstalled = ['Germany', 'England', 'France', 'Korean', 'USA'].map(
  (country, index) => ({
    id: _mock.id(index),
    countryName: country,
    android: _mock.number.nativeL(index),
    windows: _mock.number.nativeL(index + 1),
    apple: _mock.number.nativeL(index + 2),
    countryCode: ['de', 'gb', 'fr', 'kr', 'us'][index],
  })
);

export const _appAuthors = Array.from({ length: 3 }, (_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
  totalFavorites: _mock.number.nativeL(index),
}));

export const _appInvoices = Array.from({ length: 5 }, (_, index) => {
  const category = ['Android', 'Mac', 'Windows', 'Android', 'Mac'][index];

  const status = ['paid', 'out of date', 'progress', 'paid', 'paid'][index];

  return {
    id: _mock.id(index),
    invoiceNumber: `INV-199${index}`,
    price: _mock.number.price(index),
    category,
    status,
  };
});

export const _appFeatured = Array.from({ length: 3 }, (_, index) => ({
  id: _mock.id(index + 3),
  title: _mock.postTitle(index + 3),
  description: _mock.sentence(index + 3),
  coverUrl: _mock.image.cover(index + 3),
}));

// ANALYTIC
// ----------------------------------------------------------------------

export const _analyticTasks = Array.from({ length: 5 }, (_, index) => ({
  id: _mock.id(index),
  name: _mock.taskNames(index),
}));

export const _analyticPosts = Array.from({ length: 5 }, (_, index) => ({
  id: _mock.id(index),
  postedAt: _mock.time(index),
  title: _mock.postTitle(index),
  coverUrl: _mock.image.cover(index),
  description: _mock.sentence(index),
}));

export const _analyticOrderTimeline = Array.from({ length: 5 }, (_, index) => {
  const title = [
    '1983, orders, $4220',
    '12 Invoices have been paid',
    'Order #37745 from September',
    'New order placed #XF-2356',
    'New order placed #XF-2346',
  ][index];

  return {
    id: _mock.id(index),
    title,
    type: `order${index + 1}`,
    time: _mock.time(index),
  };
});

export const _analyticTraffic = [
  {
    value: 'facebook',
    label: 'Facebook',
    total: _mock.number.nativeL(1),
  },
  {
    value: 'google',
    label: 'Google',
    total: _mock.number.nativeL(2),
  },
  {
    value: 'linkedin',
    label: 'Linkedin',
    total: _mock.number.nativeL(3),
  },
  {
    value: 'twitter',
    label: 'Twitter',
    total: _mock.number.nativeL(4),
  },
];

// ECOMMERCE
// ----------------------------------------------------------------------

export const _ecommerceSalesOverview = ['Total profit', 'Total income', 'Total expenses'].map(
  (label, index) => ({
    label,
    totalAmount: _mock.number.price(index) * 100,
    value: _mock.number.percent(index),
  })
);

export const _ecommerceBestSalesman = Array.from({ length: 5 }, (_, index) => {
  const category = ['CAP', 'Branded shoes', 'Headphone', 'Cell phone', 'Earings'][index];

  return {
    id: _mock.id(index),
    category,
    rank: `Top ${index + 1}`,
    email: _mock.email(index),
    name: _mock.fullName(index),
    totalAmount: _mock.number.price(index),
    avatarUrl: _mock.image.avatar(index + 8),
    countryCode: ['de', 'gb', 'fr', 'kr', 'us'][index],
  };
});

export const _ecommerceLatestProducts = Array.from({ length: 5 }, (_, index) => {
  const colors = (index === 0 && ['#2EC4B6', '#E71D36', '#FF9F1C', '#011627']) ||
    (index === 1 && ['#92140C', '#FFCF99']) ||
    (index === 2 && ['#0CECDD', '#FFF338', '#FF67E7', '#C400FF', '#52006A', '#046582']) ||
    (index === 3 && ['#845EC2', '#E4007C', '#2A1A5E']) || ['#090088'];

  return {
    id: _mock.id(index),
    colors,
    name: _mock.productName(index),
    price: _mock.number.price(index),
    coverUrl: _mock.image.product(index),
    priceSale: [1, 3].includes(index) ? _mock.number.price(index) : 0,
  };
});

export const _ecommerceNewProducts = Array.from({ length: 4 }, (_, index) => ({
  id: _mock.id(index),
  name: _mock.productName(index),
  coverUrl: _mock.image.product(index),
}));

// BANKING
// ----------------------------------------------------------------------

export const _bankingContacts = Array.from({ length: 12 }, (_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  email: _mock.email(index),
  avatarUrl: _mock.image.avatar(index),
}));

export const _bankingCreditCard = [
  {
    id: _mock.id(2),
    balance: 23432.03,
    cardType: 'mastercard',
    cardHolder: _mock.fullName(2),
    cardNumber: '**** **** **** 3640',
    cardValid: '11/22',
  },
  {
    id: _mock.id(3),
    balance: 18000.23,
    cardType: 'visa',
    cardHolder: _mock.fullName(3),
    cardNumber: '**** **** **** 8864',
    cardValid: '11/25',
  },
  {
    id: _mock.id(4),
    balance: 1540.5,
    cardType: 'blockchain',
    cardHolder: '@sandro_da_asppibra',
    cardNumber: '0x8864...7755',
    cardValid: 'Binance Smart Chain',
  },
];

export const _bankingRecentTransitions = [
  {
    id: _mock.id(1),
    name: 'N/A',
    avatarUrl: null,
    type: 'Expenses',
    message: 'AUDITORIA',
    category: 'N/A',
    date: '2026-01-15T10:00:00',
    status: 'completed',
    amount: 0,
  },
  {
    id: _mock.id(2),
    name: 'ASPPIBRA',
    avatarUrl: null,
    type: 'Income',
    message: 'ASPPIBRA (TR)',
    category: 'Nu Pagamentos ➔ Cora SCFI',
    date: '2026-02-10T10:00:00',
    status: 'completed',
    amount: 800,
  },
  {
    id: _mock.id(3),
    name: 'Paulo Roberto Batista Ferreira',
    avatarUrl: null,
    type: 'Income',
    message: 'Paulo Roberto Batista Ferreira (TR)',
    category: 'Nu Pagamentos ➔ Santander',
    date: '2026-02-10T11:00:00',
    status: 'completed',
    amount: 700,
  },
  {
    id: _mock.id(4),
    name: 'ASPPIBRA',
    avatarUrl: null,
    type: 'Income',
    message: 'ASPPIBRA (TR)',
    category: 'Nu Pagamentos ➔ Cora SCFI',
    date: '2026-03-09T10:00:00',
    status: 'completed',
    amount: 250,
  },
  {
    id: _mock.id(5),
    name: 'ASPPIBRA',
    avatarUrl: null,
    type: 'Income',
    message: 'ASPPIBRA (TR)',
    category: 'Itaú Unibanco ➔ Cora SCFI',
    date: '2026-03-11T10:00:00',
    status: 'completed',
    amount: 250,
  },
  {
    id: _mock.id(6),
    name: 'ASPPIBRA',
    avatarUrl: null,
    type: 'Income',
    message: 'ASPPIBRA (TR)',
    category: 'Banco Inter ➔ Cora SCFI',
    date: '2026-03-16T10:00:00',
    status: 'completed',
    amount: 250,
  },
  {
    id: _mock.id(7),
    name: 'Paulo Roberto Batista Ferreira',
    avatarUrl: null,
    type: 'Income',
    message: 'Paulo Roberto Batista Ferreira (TR)',
    category: 'Banco Inter ➔ Santander',
    date: '2026-03-28T10:00:00',
    status: 'completed',
    amount: 672,
  },
  {
    id: _mock.id(8),
    name: 'N/A',
    avatarUrl: null,
    type: 'Expenses',
    message: 'AUDITORIA',
    category: 'N/A',
    date: '2026-04-15T10:00:00',
    status: 'completed',
    amount: 0,
  },
];

// BOOKING
// ----------------------------------------------------------------------

export const _bookings = Array.from({ length: 5 }, (_, index) => {
  const status = ['Paid', 'Paid', 'Pending', 'Cancelled', 'Paid'][index];

  const customer = {
    avatarUrl: _mock.image.avatar(index),
    name: _mock.fullName(index),
    phoneNumber: _mock.phoneNumber(index),
  };

  const destination = Array.from({ length: 5 }, (__, _index) => ({
    name: _mock.tourName(_index + 1),
    coverUrl: _mock.image.travel(_index + 1),
  }))[index];

  return {
    id: _mock.id(index),
    destination,
    status,
    customer,
    checkIn: _mock.time(index),
    checkOut: _mock.time(index),
  };
});

export const _bookingsOverview = Array.from({ length: 3 }, (_, index) => ({
  status: ['Pending', 'Canceled', 'Sold'][index],
  quantity: _mock.number.nativeL(index),
  value: _mock.number.percent(index + 5),
}));

export const _bookingReview = Array.from({ length: 5 }, (_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  postedAt: _mock.time(index),
  rating: _mock.number.rating(index),
  avatarUrl: _mock.image.avatar(index),
  description: _mock.description(index),
  tags: ['Great sevice', 'Recommended', 'Best price'],
}));

export const _bookingNew = Array.from({ length: 8 }, (_, index) => ({
  guests: '3-5',
  id: _mock.id(index),
  bookedAt: _mock.time(index),
  duration: '3 days 2 nights',
  isHot: _mock.boolean(index),
  name: _mock.fullName(index),
  price: _mock.number.price(index),
  avatarUrl: _mock.image.avatar(index),
  coverUrl: _mock.image.travel(index),
}));

// COURSE
// ----------------------------------------------------------------------

export const _coursesContinue = Array.from({ length: 4 }, (_, index) => ({
  id: _mock.id(index),
  title: _mock.courseNames(index),
  coverUrl: _mock.image.course(index),
  totalLesson: 12,
  currentLesson: index + 7,
}));

export const _coursesFeatured = Array.from({ length: 6 }, (_, index) => ({
  id: _mock.id(index),
  title: _mock.courseNames(index),
  coverUrl: _mock.image.course(index + 6),
  totalDuration: 220,
  totalStudents: _mock.number.nativeM(index),
  price: _mock.number.price(index),
}));

export const _coursesReminder = Array.from({ length: 4 }, (_, index) => ({
  id: _mock.id(index),
  title: _mock.courseNames(index),
  totalLesson: 12,
  reminderAt: today(),
  currentLesson: index + 7,
}));
