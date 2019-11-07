import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeviceBrightness from 'react-native-device-brightness';
import ShowBarcodeComponent from '../../component/ShowBarcode';
import CampaignEntity from '../../entity/CampaignEntity';

const MAXIMUM_LUMINOUS = 1;

class ShowBarcode extends Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    voucher: PropTypes.instanceOf(CampaignEntity).isRequired
  };

  static defaultProps = {
    code: undefined,
    voucher: undefined
  };

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

  render() {
    return (
      <ShowBarcodeComponent
        code={this.props.code}
        voucher={this.props.voucher}
      />
    );
  }
}

export default ShowBarcode;
