import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translateVI from './translations/vi/common.json';
import translateEN from './translations/en/common.json';
import vi_account from './translations/vi/account.json';
import en_account from './translations/en/account.json';
import vi_affiliate from './translations/vi/affiliate.json';
import en_affiliate from './translations/en/affiliate.json';

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
        common: translateVI,
        account: vi_account,
        affiliate: vi_affiliate
      },
      en: {
        common: translateEN,
        account: en_account,
        affiliate: en_affiliate
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
