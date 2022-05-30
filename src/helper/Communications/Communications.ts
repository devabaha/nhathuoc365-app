import {Linking, Alert, Platform} from 'react-native';
import {default as RNCommunications} from 'react-native-communications';
import i18n from 'i18next';

class Communications {
  phonecall(phoneNumber: string, message: string) {
    const t = i18n.getFixedT(undefined, 'common');

    let formatPhoneNumber = phoneNumber;
    if (Platform.OS !== 'android') {
      formatPhoneNumber = `telprompt:${phoneNumber}`;
    } else {
      formatPhoneNumber = `tel:${phoneNumber}`;
    }
    Linking.openURL(formatPhoneNumber).catch((err) => {
      if (typeof message === 'string') {
        message = message || t('cantCall');
      } else {
        message = t('cantCall');
      }
      Alert.alert(message);
      console.log('error_open_phone_url', err);
    });
  }

  email(
    to: string[] | null,
    cc: string[] | null,
    bcc: string[] | null,
    subject: string | null,
    body: string | null,
  ) {
    RNCommunications.email(to, cc, bcc, subject, body);
  }

  text(phoneNumber?: string | null, body?: string | null) {
    RNCommunications.text(phoneNumber, body);
  }

  web(address?: string | null) {
    RNCommunications.web(address);
  }

  textWithoutEncoding(phoneNumber?: string | null, body?: string | null) {
    RNCommunications.textWithoutEncoding(phoneNumber, body);
  }
}

export default new Communications();
