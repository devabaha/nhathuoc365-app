import appConfig from 'app-config';
import DeviceInfo from 'react-native-device-info';

export default function getTickUniqueID() {
  return `${appConfig.appName}-${DeviceInfo.getUniqueID()}`;
}
