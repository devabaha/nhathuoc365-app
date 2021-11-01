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

export const convertSecondsToElementTimeData = (
  timeInSeconds,
  padStart = {
    seconds: 2,
    hours: 2,
    minutes: 2,
  },
) => {
  let h = Math.floor(timeInSeconds / 3600);
  let m = Math.floor((timeInSeconds - h * 3600) / 60);
  let s = Math.floor(timeInSeconds - h * 3600) % 60;

  h = h.toString().padStart(padStart.hours, '0');
  m = m.toString().padStart(padStart.minutes, '0');
  s = s.toString().padStart(padStart.seconds, '0');

  return {
    hours: h,
    minutes: m,
    seconds: s,
  };
};

export const formatTime = (timeInSeconds) => {
  const {hours, minutes, seconds} = convertSecondsToElementTimeData(
    timeInSeconds,
  );
  return [Number(hours) ? hours : '', minutes, seconds]
    .join(':')
    .slice(Number(hours) ? 0 : 1);
};
