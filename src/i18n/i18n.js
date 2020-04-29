import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { default as resources } from './translations';
import {
  asyncStorageLanguageKey,
  arrayLanguages,
  languages
} from './constants';

import AsyncStorage from '@react-native-community/async-storage';
import * as RNLocalize from 'react-native-localize';
import 'moment/locale/vi';
import moment from 'moment';

const saveAppLanguage = async (asyncStorageLanguage, callback = () => {}) => {
  AsyncStorage.setItem(
    asyncStorageLanguageKey,
    JSON.stringify(asyncStorageLanguage),
    err => console.log('store new app language', err)
  ).then(() => {
    callback();
  });
};

export const setAppLanguage = async (i18n, selectedLanguage = null) => {
  // const currentLanguage = RNLocalize.findBestAvailableLanguage(arrayLanguages);
  const currentLanguage = null;
  // console.log(currentLanguage, 'clang');
  AsyncStorage.getItem(asyncStorageLanguageKey).then(language => {
    // console.log(language, 'lang');
    let asyncStorageLanguage = null;
    if (language) {
      const languageObj = JSON.parse(language);
      if (selectedLanguage) {
        asyncStorageLanguage = {
          ...languageObj,
          language: selectedLanguage
        };
        // console.log(asyncStorageLanguage, 'has selected');
        saveAppLanguage(asyncStorageLanguage, () => {
          moment.locale(selectedLanguage.locale);
          i18n.changeLanguage(selectedLanguage.languageTag);
        });
      } else {
        const languageTag = languageObj.language.languageTag;
        // console.log(languageObj, 'no selected');
        moment.locale(languageTag);
        i18n.changeLanguage(languageTag);
      }
    } else if (currentLanguage) {
      moment.locale(currentLanguage.languageTag);
      i18n.changeLanguage(currentLanguage.languageTag);

      asyncStorageLanguage = {
        language: currentLanguage,
        machineLanguage: currentLanguage
      };
      // console.log(asyncStorageLanguage, 'no language');

      saveAppLanguage(asyncStorageLanguage);
    } else {
      let asyncStorageLanguage = {
        language: selectedLanguage
      };
      // console.log(asyncStorageLanguage, 'has selected');
      saveAppLanguage(asyncStorageLanguage, () => {
        moment.locale(selectedLanguage.locale);
        i18n.changeLanguage(selectedLanguage.languageTag);
      });
    }
  });
};

i18n.use(initReactI18next).init(
  {
    lng: languages.vi.value,
    fallbackLng: languages.vi.value,
    debug: true,

    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    resources,
    ns: ['common'],
    defaultNS: 'common'
  },
  () => {
    setAppLanguage(i18n);
    console.log('from init', i18n.language);
  }
);

export default i18n;
