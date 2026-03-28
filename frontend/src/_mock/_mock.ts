import { fSub } from 'src/utils/format-time';

import { CONFIG } from 'src/global-config';

import {
  _id,
  _ages,
  _roles,
  _prices,
  _emails,
  _ratings,
  _nativeS,
  _nativeM,
  _nativeL,
  _percents,
  _booleans,
  _lastNames,
  _fullNames,
  _tourNames,
  _postTitles,
  _firstNames,
  _fullAddress,
  _productNames,
  _phoneNumbers,
  _countryNames,
} from './assets';

// ----------------------------------------------------------------------

export const _mock = {
  id: (index: number) => _id[index],
  time: (index: number) => fSub({ days: index, hours: index }),
  boolean: (index: number) => _booleans[index],
  role: (index: number) => _roles[index],
  // Text
  postTitle: (index: number) => _postTitles[index],
  tourName: (index: number) => _tourNames[index],
  productName: (index: number) => _productNames[index],
  
  // ✅ CORREÇÃO 1: Mantendo a função description
  description: (index: number) => 
    'The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.',
  
  // ✅ CORREÇÃO 2: Mantendo a função companyNames
  companyNames: (index: number) => 
    ['Minimals UI', 'Google', 'Stripe', 'Airbnb', 'Facebook', 'Amazon', 'Netflix', 'Tesla'][index % 8],

  // ✅ CORREÇÃO 3: Mantendo a função sentence
  sentence: (index: number) => 
    'The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.',

  // ✅ CORREÇÃO 4: Mantendo a função taskNames
  taskNames: (index: number) => 
    ['Prepare Monthly Financial Report', 'Design New Marketing Campaign', 'Analyze Customer Feedback', 'Update Website Content', 'Conduct Market Research'][index % 5],

  // ✅ CORREÇÃO 5 (NOVA): Adicionando a função courseNames que quebrou o último build
  courseNames: (index: number) => 
    ['Minimal UI Design', 'Python for Beginners', 'React Masterclass', 'Data Science 101', 'Digital Marketing Strategy'][index % 5],

  // Contact
  email: (index: number) => _emails[index],
  phoneNumber: (index: number) => _phoneNumbers[index],
  fullAddress: (index: number) => _fullAddress[index],
  // Name
  firstName: (index: number) => _firstNames[index],
  lastName: (index: number) => _lastNames[index],
  fullName: (index: number) => _fullNames[index],
  countryNames: (index: number) => _countryNames[index],
  // Number
  number: {
    percent: (index: number) => _percents[index],
    rating: (index: number) => _ratings[index],
    age: (index: number) => _ages[index],
    price: (index: number) => _prices[index],
    nativeS: (index: number) => _nativeS[index],
    nativeM: (index: number) => _nativeM[index],
    nativeL: (index: number) => _nativeL[index],
  },
  // Image
  image: {
    cover: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/cover/cover-${index + 1}.webp`,
    avatar: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/avatar/avatar-${index + 1}.webp`,
    travel: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/travel/travel-${index + 1}.webp`,
    course: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/course/course-${index + 1}.webp`,
    company: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/company/company-${index + 1}.webp`,
    product: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/m-product/product-${index + 1}.webp`,
    portrait: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/portrait/portrait-${index + 1}.webp`,
  },
};