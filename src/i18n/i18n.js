import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {default as resources} from './translations';
import {asyncStorageLanguageKey, arrayLanguages, languages} from './constants';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import 'moment/locale/vi';
import moment from 'moment';

const updateMoment = (t, language) => {
  moment.locale(language);
  moment.updateLocale(language, {
    relativeTime: {
      future: t('time.relative.future') || undefined,
      past: t('time.relative.past') || undefined,
      s: t('time.relative.s') || undefined,
      ss: t('time.relative.s') || undefined,
      m: t('time.relative.m') || undefined,
      mm: t('time.relative.mm') || undefined,
      h: t('time.relative.h') || undefined,
      hh: t('time.relative.hh') || undefined,
      d: t('time.relative.d') || undefined,
      dd: t('time.relative.dd') || undefined,
      w: t('time.relative.w') || undefined,
      ww: t('time.relative.ww') || undefined,
      M: t('time.relative.M') || undefined,
      MM: t('time.relative.MM') || undefined,
      y: t('time.relative.y') || undefined,
      yy: t('time.relative.yy') || undefined,
    },
  });
};

const saveAppLanguage = async (asyncStorageLanguage, callback = () => {}) => {
  AsyncStorage.setItem(
    asyncStorageLanguageKey,
    JSON.stringify(asyncStorageLanguage),
    (err) => console.log('store new app language', err),
  ).then(() => {
    callback();
  });
};

export const setAppLanguage = async (i18n, selectedLanguage = null) => {
  // const currentLanguage = RNLocalize.findBestAvailableLanguage(arrayLanguages);
  const currentLanguage = null;
  // console.log(currentLanguage, 'clang');
  AsyncStorage.getItem(asyncStorageLanguageKey).then((language) => {
    console.log(language, 'lang');
    let asyncStorageLanguage = null;
    let languageObj = {};
    if (language) {
      languageObj = JSON.parse(language);
    }

    if (selectedLanguage) {
      asyncStorageLanguage = {
        ...languageObj,
        language: selectedLanguage,
      };
      // console.log(asyncStorageLanguage, 'has selected');
      saveAppLanguage(asyncStorageLanguage, () => {
        i18n.changeLanguage(selectedLanguage.languageTag);
        updateMoment(i18n.t.bind(i18n), selectedLanguage.languageTag);
      });
    } else if (language) {
      const languageTag = languageObj.language;
      // console.log(languageObj, 'no selected');
      if (languageTag) {
        i18n.changeLanguage(languageTag.languageTag);
        updateMoment(i18n.t.bind(i18n), languageTag.languageTag);
      }
    } else if (currentLanguage) {
      i18n.changeLanguage(currentLanguage.languageTag);
      updateMoment(i18n.t.bind(i18n), currentLanguage.languageTag);

      asyncStorageLanguage = {
        language: currentLanguage,
        machineLanguage: currentLanguage,
      };
      // console.log(asyncStorageLanguage, 'no language');

      saveAppLanguage(asyncStorageLanguage);
    }
  });
};

i18n.use(initReactI18next).init(
  {
    lng: languages.vi.value,
    fallbackLng: languages.vi.value,
    debug: true,

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
