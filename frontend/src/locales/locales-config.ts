import type { InitOptions } from 'i18next';
import type { Theme, Components } from '@mui/material/styles';

import resourcesToBackend from 'i18next-resources-to-backend';

// MUI Core Locales
import {
  frFR as frFRCore,
  zhCN as zhCNCore,
  arSA as arSACore,
  ptBR as ptBRCore,
  esES as esESCore,
  ruRU as ruRUCore,
} from '@mui/material/locale';
// MUI Date Pickers Locales
import {
  enUS as enUSDate,
  frFR as frFRDate,
  zhCN as zhCNDate,
  ptBR as ptBRDate,
  esES as esESDate,
  ruRU as ruRUDate,
} from '@mui/x-date-pickers/locales';
// MUI Data Grid Locales
import {
  enUS as enUSDataGrid,
  frFR as frFRDataGrid,
  zhCN as zhCNDataGrid,
  arSD as arSDDataGrid,
  ptBR as ptBRDataGrid,
  esES as esESDataGrid,
  ruRU as ruRUDataGrid,
} from '@mui/x-data-grid/locales';

// ----------------------------------------------------------------------

// Supported languages
export const supportedLngs = ['en', 'pt', 'es', 'ar', 'cn', 'fr', 'ru'] as const;
export type LangCode = (typeof supportedLngs)[number];

// Fallback and default namespace
export const fallbackLng: LangCode = 'en';
export const defaultNS = 'common';

// Storage config
export const storageConfig = {
  cookie: { key: 'i18next', autoDetection: false },
  localStorage: { key: 'i18nextLng', autoDetection: false },
} as const;

// ----------------------------------------------------------------------

/**
 * @countryCode https://flagcdn.com/en/codes.json
 * @adapterLocale https://github.com/iamkun/dayjs/tree/master/src/locale
 * @numberFormat https://simplelocalize.io/data/locales/
 */

export type LangOption = {
  value: LangCode;
  label: string;
  countryCode: string;
  adapterLocale?: string;
  numberFormat: { code: string; currency: string };
  systemValue?: { components: Components<Theme> };
};

export const allLangs: LangOption[] = [
  {
    value: 'en',
    label: 'English',
    countryCode: 'US',
    adapterLocale: 'en',
    numberFormat: { code: 'en-US', currency: 'USD' },
    systemValue: {
      components: { ...enUSDate.components, ...enUSDataGrid.components },
    },
  },
  {
    value: 'pt',
    label: 'Português',
    countryCode: 'BR',
    adapterLocale: 'pt-br',
    numberFormat: { code: 'pt-BR', currency: 'BRL' },
    systemValue: {
      components: { ...ptBRCore.components, ...ptBRDate.components, ...ptBRDataGrid.components },
    },
  },
  {
    value: 'es',
    label: 'Español',
    countryCode: 'ES',
    adapterLocale: 'es',
    numberFormat: { code: 'es-ES', currency: 'EUR' },
    systemValue: {
      components: { ...esESCore.components, ...esESDate.components, ...esESDataGrid.components },
    },
  },
  {
    value: 'ar',
    label: 'Arabic',
    countryCode: 'SA',
    adapterLocale: 'ar-sa',
    numberFormat: { code: 'ar-SA', currency: 'SAR' },
    systemValue: {
      components: { ...arSACore.components, ...arSDDataGrid.components },
    },
  },
  {
    value: 'cn',
    label: 'Chinese',
    countryCode: 'CN',
    adapterLocale: 'zh-cn',
    numberFormat: { code: 'zh-CN', currency: 'CNY' },
    systemValue: {
      components: { ...zhCNCore.components, ...zhCNDate.components, ...zhCNDataGrid.components },
    },
  },
  {
    value: 'fr',
    label: 'French',
    countryCode: 'FR',
    adapterLocale: 'fr',
    numberFormat: { code: 'fr-Fr', currency: 'EUR' },
    systemValue: {
      components: { ...frFRCore.components, ...frFRDate.components, ...frFRDataGrid.components },
    },
  },
  {
    value: 'ru',
    label: 'Русский',
    countryCode: 'RU',
    adapterLocale: 'ru',
    numberFormat: { code: 'ru-RU', currency: 'RUB' },
    systemValue: {
      components: { ...ruRUCore.components, ...ruRUDate.components, ...ruRUDataGrid.components },
    },
  },
];

// ----------------------------------------------------------------------

export const i18nResourceLoader = resourcesToBackend(
  (lang: LangCode, namespace: string) => import(`./langs/${lang}/${namespace}.json`)
);

export function i18nOptions(lang = fallbackLng, namespace = defaultNS): InitOptions {
  return {
    // debug: true,
    supportedLngs,
    fallbackLng,
    lng: lang,
    /********/
    fallbackNS: defaultNS,
    defaultNS,
    ns: namespace,
  };
}

export function getCurrentLang(lang?: string): LangOption {
  const fallbackLang = allLangs.find((l) => l.value === fallbackLng) ?? allLangs[0];

  if (!lang) {
    return fallbackLang;
  }

  return allLangs.find((l) => l.value === lang) ?? fallbackLang;
}
