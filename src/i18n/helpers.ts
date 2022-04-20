import {asyncStorageLanguageKey, arrayLanguages} from './constants';

import AsyncStorage from '@react-native-async-storage/async-storage';
import RNLocalize from 'react-native-localize';
import {LocaleConfig} from 'react-native-calendars';
import 'moment/locale/vi';
import moment from 'moment';

const updateMoment = (t, language) => {
  // @ts-ignore
  LocaleConfig.locales[language] = {
    monthNames: [
      t('month.january'),
      t('month.february'),
      t('month.march'),
      t('month.april'),
      t('month.may'),
      t('month.june'),
      t('month.july'),
      t('month.august'),
      t('month.september'),
      t('month.october'),
      t('month.november'),
      t('month.december'),
    ],
    monthNamesShort: [
      t('month.januaryInShort'),
      t('month.februaryInShort'),
      t('month.marchInShort'),
      t('month.aprilInShort'),
      t('month.mayInShort'),
      t('month.juneInShort'),
      t('month.julyInShort'),
      t('month.augustInShort'),
      t('month.septemberInShort'),
      t('month.octoberInShort'),
      t('month.novemberInShort'),
      t('month.decemberInShort'),
    ],
    dayNames: [
      t('day.sunday'),
      t('day.monday'),
      t('day.tuesday'),
      t('day.wednesday'),
      t('day.thursday'),
      t('day.friday'),
      t('day.saturday'),
    ],
    dayNamesShort: [
      t('day.sundayInShort'),
      t('day.mondayInShort'),
      t('day.tuesdayInShort'),
      t('day.wednesdayInShort'),
      t('day.thursdayInShort'),
      t('day.fridayInShort'),
      t('day.saturdayInShort'),
    ],
  };
  LocaleConfig.defaultLocale = language;

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

const changeLanguage = (i18n, language) => {
  i18n.changeLanguage(language, (error, t) => {
    if (error) {
      console.log('%cchange_language', 'background-color: red', error);
    }
    updateMoment(t, language);
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
  const currentLanguage = {languageTag: i18n?.language};
  // console.log(currentLanguage, 'clang');
  AsyncStorage.getItem(asyncStorageLanguageKey).then((language) => {
    console.log(language, 'lang');
    let asyncStorageLanguage = null;
    let languageObj: any = {};
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
        changeLanguage(i18n, selectedLanguage.languageTag);
      });
    } else if (language) {
      const languageTag = languageObj.language;
      // console.log(languageObj, 'no selected');
      if (languageTag) {
        changeLanguage(i18n, languageTag.languageTag);
      }
    } else if (currentLanguage) {
      changeLanguage(i18n, currentLanguage.languageTag);

      asyncStorageLanguage = {
        language: currentLanguage,
        machineLanguage: currentLanguage,
      };
      // console.log(asyncStorageLanguage, 'no language');

      saveAppLanguage(asyncStorageLanguage);
    }
  });
};
