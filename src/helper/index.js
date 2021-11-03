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
