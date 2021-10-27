import {Linking, Alert} from 'react-native';
import i18n from 'src/i18n';

export const openLink = (url) => {
  const t = i18n.getFixedT(undefined, 'common');
  Linking.openURL(url).catch((error) => {
    console.log('open_link', error);
    Alert.alert(t('cantOpenLink'));
  });
};

export const isValidDate = (date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  return date instanceof Date && !isNaN(date);
};

export const convertSecondsToFormattedTimeData = (
  seconds,
  padStart = {
    second: 2,
    hour: 2,
    minute: 2,
  },
) => {
  let h = Math.floor(seconds / 3600);
  let m = Math.floor((seconds - h * 3600) / 60);
  let s = Math.floor(seconds - h * 3600) % 60;

  h = h.toString().padStart(padStart.hour, '0');
  m = m.toString().padStart(padStart.minute, '0');
  s = s.toString().padStart(padStart.second, '0');

  return {
    hour: h,
    minute: m,
    second: s,
  };
};
