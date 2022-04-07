import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {default as resources} from './translations';
import {languages} from './constants';

import 'moment/locale/vi';
import {setAppLanguage} from './helpers';

i18n.use(initReactI18next).init(
  {
    lng: languages.vi.value,
    fallbackLng: languages.vi.value,
    debug: true,
    returnObjects: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources,
    ns: ['common'],
    defaultNS: 'common',
  },
  () => {
    setAppLanguage(i18n);
    console.log('from init', i18n.language);
  },
);

export default i18n;
