export {default} from './QRScanner';

import {TFunction} from 'i18next';
import {RNQRCodeScannerProps} from 'react-native-qrcode-scanner';

export interface QRScannerProps extends RNQRCodeScannerProps {
  refQRScanner?: React.Ref<any>;
  t?: TFunction;
  onChangePermission?: Function;
}
