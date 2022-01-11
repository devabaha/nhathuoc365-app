import {Linking, Alert} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import i18n from 'src/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  EULA_AGREEMENT_LAST_UPDATED,
  EULA_AGREEMENT_USER_DECISION_DATA_KEY,
} from 'src/constants';

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

export const copyToClipboard = (
  text,
  config = {isShowCopiedMessage: true, copiedMessage: ''},
) => {
  Clipboard.setString(text);

  if (config.isShowCopiedMessage) {
    if (!config.copiedMessage) {
      config.copiedMessage = i18n.getFixedT(undefined, 'common')('copied');
    }
    Toast.show(config.copiedMessage);
  }
};

export const cancelRequests = (requests) => {
  if (Array.isArray(requests)) {
    requests.forEach((request) => {
      request.cancel();
    });
  } else {
    requests.cancel();
  }
};

export const lightenColor = (color, percent) => {
  var num = parseInt(color.replace('#', ''), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = ((num >> 8) & 0x00ff) + amt,
    G = (num & 0x0000ff) + amt;

  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

export const checkIfEULAAgreed = async () => {
  // AsyncStorage.removeItem(IS_EULA_AGREED_KEY);
  const isEULAAgreed = await AsyncStorage.getItem(
    EULA_AGREEMENT_USER_DECISION_DATA_KEY,
  );

  return !!isEULAAgreed;
};

export const updateEULAUserDecision = async (decision = true) => {
  const information = {
    agreeTime: new Date().toString(),
    isAgree: !!decision,
  };
  await AsyncStorage.setItem(
    EULA_AGREEMENT_USER_DECISION_DATA_KEY,
    JSON.stringify(information),
  );
};

export const getEULAContent = () => {
  const t = i18n.getFixedT(undefined, 'license');

  return (
    t('eula.lastUpdated', {lastUpdated: EULA_AGREEMENT_LAST_UPDATED}) +
    t('eula.content').reduce((prev, next) => prev + next, '')
  );
};
