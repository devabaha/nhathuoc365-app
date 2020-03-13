import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translateVI from './translations/vi/common.json';
import translateEN from './translations/en/common.json';

i18n.use(initReactI18next).init(
  {
    lng: 'vi',
    fallbackLng: 'vi',
    debug: true,

    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    resources: {
      vi: {
        common: translateVI
      },
      en: {
        common: translateEN
      }
    },
    ns: ['common'],
    defaultNS: 'common'
  },
  () => {
    console.log('from init', i18n.language);
  }
);

export default i18n;
