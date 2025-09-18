import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import resource bundles
import enCommon from './locales/en/common.json';
import swCommon from './locales/sw/common.json';

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      sw: { common: swCommon },
    },
    lng: 'en',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });

export default i18n;
