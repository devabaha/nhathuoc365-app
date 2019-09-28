import DeviceBrightness from 'react-native-device-brightness';
import { ShowBarcode as TickIDVoucherShowBarcode } from 'app-packages/tickid-voucher';

const MAXIMUM_LUMINOUS = 1;

class VoucherShowBarcode extends TickIDVoucherShowBarcode {
  constructor(props) {
    super(props);

    this.state = {
      originLuminous: 0.5
    };
  }

  componentDidMount() {
    this.handleBrightnessLevel();
  }

  componentWillUnmount() {
    DeviceBrightness.setBrightnessLevel(this.state.originLuminous);
  }

  handleBrightnessLevel = () => {
    DeviceBrightness.getBrightnessLevel().then(originLuminous => {
      this.setState({ originLuminous }, () =>
        DeviceBrightness.setBrightnessLevel(MAXIMUM_LUMINOUS)
      );
    });
  };
}

export default VoucherShowBarcode;
