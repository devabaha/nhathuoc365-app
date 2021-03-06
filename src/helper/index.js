import {Linking, Alert} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import i18n from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import {
  EULA_AGREEMENT_LAST_UPDATED,
  EULA_AGREEMENT_USER_DECISION_DATA_KEY,
} from 'src/constants';

import {saveTheme, isDarkMode} from './theme';
import getPreciseDistance from 'geolib/es/getPreciseDistance';

export {saveTheme, isDarkMode};

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

export const hexToRgbCode = (hex) => {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
  }
  throw new Error('Bad Hex');
};

export const hexToRgba = (hex, opacity) => {
  return 'rgba(' + hexToRgbCode(hex).join(',') + ',' + opacity + ')';
};

export const rgbaToRgbCode = (rgba, background = '#ffffff') => {
  const [bgRed, bgGreen, bgBlue] = hexToRgbCode(background);
  const [inputRed, inputGreen, inputBlue, inputAlpha] = rgba
    .replace(/rgba|\(|\)/g, '')
    .split(',')
    .map((value) => Number(value));

  const isCorrectFormat =
    inputRed >= 0 &&
    inputRed <= 255 &&
    inputGreen >= 0 &&
    inputGreen <= 255 &&
    inputBlue >= 0 &&
    inputBlue <= 255 &&
    inputAlpha >= 0 &&
    inputAlpha <= 1;

  if (isCorrectFormat) {
    const getColorChanel = (color, alpha, background) =>
      color * alpha + background * (1 - alpha);

    const redChanel = getColorChanel(inputRed, inputAlpha, bgRed);
    const greenChanel = getColorChanel(inputGreen, inputAlpha, bgGreen);
    const blueChanel = getColorChanel(inputBlue, inputAlpha, bgBlue);
    return [redChanel, greenChanel, blueChanel];
  }
  throw new Error('Bad Rgba');
};

export const rgbaToRgb = (rgba, background = '#fff') => {
  return 'rgb(' + rgbaToRgbCode(rgba, background).join(',') + ')';
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

export const elevationShadowStyle = (
  elevation,
  width = 0,
  height = 0,
  shadowOpacity = 0.25,
  shadowColor = 'black',
) => ({
  elevation,
  shadowColor,
  shadowOffset: {width: width, height: height || 0.5 * elevation},
  shadowOpacity,
  shadowRadius: 0.8 * elevation,
});

export const checkIfEULAAgreed = async () => {
  // AsyncStorage.removeItem(EULA_AGREEMENT_USER_DECISION_DATA_KEY);
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

export const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const flashShowMessage = (props) => {
  const flashMessageSuccessTheme = {
    color: 'white',
    backgroundColor: '#007E33',
  };
  const flashMessageDangerTheme = {
    color: 'white',
    backgroundColor: '#CC0000',
  };
  const flashMessageInfoTheme = {
    color: 'white',
    backgroundColor: '#0099CC',
  };
  const flashMessageWarningTheme = {
    color: 'white',
    backgroundColor: '#FF8800',
  };
  let theme = {};
  switch (props.type) {
    case 'danger':
      theme = flashMessageDangerTheme;
      break;
    case 'success':
      theme = flashMessageSuccessTheme;
      break;
    case 'info':
      theme = flashMessageInfoTheme;
      break;
    case 'warning':
      theme = flashMessageWarningTheme;
      break;
    default:
      break;
  }
  showMessage({...props, ...theme});
};

export const calculateDiffDistance = (
  locationStart,
  locationEnd,
  accurate = 100,
) => {
  const preciseDistance = getPreciseDistance(
    locationStart,
    locationEnd,
    accurate,
  );

  return {
    preciseDistance,
    inKm: preciseDistance / 1000,
  };
};

export const toFixed = (
  num,
  totalNumberAfterDecimalPoint = 2,
  isRound = false,
) => {
  return (
    Math[isRound ? 'round' : 'floor'](
      num * Math.pow(10, totalNumberAfterDecimalPoint),
    ) / Math.pow(10, totalNumberAfterDecimalPoint)
  );
};
