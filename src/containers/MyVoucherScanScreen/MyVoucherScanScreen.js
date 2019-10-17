import appConfig from 'app-config';
import { ScanScreen as TickIDVoucherScanScreen } from 'app-packages/tickid-voucher';
import { Actions } from 'react-native-router-flux';

class MyVoucherScanScreen extends TickIDVoucherScanScreen {
  handlePressEnterCode = ({ onSendCode }) => {
    Actions.push(appConfig.routes.voucherEnterCodeManual, {
      onClose: Actions.pop,
      heading: 'Nhập mã thủ công',
      placeholder: 'Nhập mã Voucher',
      /**
       * In case enter code manual
       * @NOTE: pop 2 times to go back `My Voucher` screen
       */
      onSendCode: code => {
        Actions.pop();
        setTimeout(() => {
          Actions.pop();
          setTimeout(() => onSendCode(code), 0);
        }, 0);
      }
    });
  };

  /**
   * In case scan QR code with camera
   * @NOTE: pop 1 time to go back `My Voucher` screen
   */
  handleReadedCode = ({ onDone }) => {
    Actions.pop();
    setTimeout(onDone, 0);
  };

  handleShowBarcode = ({ code, voucher }) => {};
  topContentText = 'Hướng máy ảnh của bạn về phía mã QR Code để nhận voucher';
  isFromMyVoucher = true;
}

export default MyVoucherScanScreen;
