import appConfig from 'app-config';
import { ScanScreen as TickIDVoucherScanScreen } from 'app-packages/tickid-voucher';
import { Actions } from 'react-native-router-flux';

class VoucherScanScreen extends TickIDVoucherScanScreen {
  handlePressEnterCode = ({ onSendCode }) => {
    Actions.push(appConfig.routes.voucherEnterCodeManual, {
      onClose: Actions.pop,
      heading: 'Nhập mã thủ công',
      placeholder: this.props.placeholder,
      /**
       * In case enter code manual
       * @NOTE: pop 2 times to go back `Voucher Detail` screen
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
   * @NOTE: pop 1 time to go back `Voucher Detail` screen
   */
  handleReadedCode = ({ onDone }) => {
    Actions.pop();
    setTimeout(onDone, 0);
  };

  handleShowBarcode = ({ code, voucher }) => {
    Actions.push(appConfig.routes.voucherShowBarcode, {
      code,
      voucher
    });
  };

  handleRefreshMyVoucher() {
    this.props.refreshMyVoucher();
  }
}

export default VoucherScanScreen;
