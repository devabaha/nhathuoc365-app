import appConfig from 'app-config';
import { VoucherDetail as TickIDVoucherDetail } from 'app-packages/tickid-voucher';
import { Actions } from 'react-native-router-flux';

class VoucherDetail extends TickIDVoucherDetail {
  handlePressCampaignProvider = campaign => {};

  handleOpenScanScreen = campaign => {
    Actions.push(appConfig.routes.voucherScanner, {
      campaign
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
