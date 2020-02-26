import appConfig from 'app-config';
import { getUniqueId } from 'react-native-device-info';

export default function getTickUniqueID() {
  return `${appConfig.appName}-${getUniqueId()}`;
}
