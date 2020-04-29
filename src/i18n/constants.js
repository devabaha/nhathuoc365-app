export const asyncStorageLanguageKey = 'appLanguage';

export const languages = {
  vi: {
    label: 'Tiếng Việt',
    value: 'vi',
    isRTL: false,
    locale: 'vi'
  },
  en: {
    label: 'English',
    value: 'en',
    isRTL: false,
    locale: 'en'
  },
  zh: {
    label: '中文',
    value: 'zh',
    isRTL: false,
    locale: 'zh-cn'
  }
  // jp: {
  //     label: 'Japanese',
  //     value: 'jp',
  //     isRTL: false
  // },
  // fr: {
  //     label: 'French',
  //     value: 'fr',
  //     isRTL: false
  // },
  // gr: {
  //     label: 'German',
  //     value: 'gr',
  //     isRTL: false
  // },
  // ru: {
  //     label: 'Russian',
  //     value: 'ru',
  //     isRTL: false
  // },
  // gb: {
  //     label: 'Global',
  //     value: 'gb',
  //     isRTL: false
  // }
};

export const arrayLanguages = Object.keys(languages);
