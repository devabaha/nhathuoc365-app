import moment from 'moment';
import i18n from 'i18next';

export const formatUniversalDate = (date: string, formatter?: string) => {
  return moment(date, formatter, i18n.language).format('L');
};
