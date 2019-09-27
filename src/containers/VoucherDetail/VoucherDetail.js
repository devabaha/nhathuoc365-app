import appConfig from 'app-config';
import { VoucherDetail as TickIDVoucherDetail } from 'app-packages/tickid-voucher';
import { Actions } from 'react-native-router-flux';

class VoucherDetail extends TickIDVoucherDetail {
  handlePressCampaignProvider = campaign => {};

  handleOpenScanScreen = voucher => {
    Actions.push(appConfig.routes.voucherScanner, {
      voucher
    });
  };

  handleAlreadyThisVoucher = ({ message, onCheckMyVoucher, onClose }) => {
    Actions.push(appConfig.routes.alreadyVoucher, {
      onClose: () => {
        Actions.pop();
        onClose();
      },
      heading: 'Đã lấy mã giảm giá',
      message,
      onCheckMyVoucher: () => {
        /**
         * @NOTE:
         * step 1: `Actions.pop` to back/close `Already Voucher Modal`
         * step 2: Navigate user to `My Voucher` screen (logic in JS call stack at bottom)
         */
        Actions.pop();

        setTimeout(() => {
          Actions.push(appConfig.routes.myVoucher, {
            title: 'Voucher của tôi'
          });
          onCheckMyVoucher();
        }, 0);
      }
    });
  };
}

export default VoucherDetail;
