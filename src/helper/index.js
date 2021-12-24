import {Linking, Alert} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
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
