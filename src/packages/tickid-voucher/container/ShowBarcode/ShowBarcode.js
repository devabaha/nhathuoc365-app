import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ScreenBrightness from 'react-native-screen-brightness';
import ShowBarcodeComponent from '../../component/ShowBarcode';
import CampaignEntity from '../../entity/CampaignEntity';

const MAXIMUM_LUMINOUS = 0.7;
const MIN_LUMINOUS = 0.5;

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
      originLuminous: MIN_LUMINOUS
    };
  }

  componentDidMount() {
    this.handleBrightness();
    EventTracker.logEvent('voucher_show_barcode_page');
  }

  componentWillUnmount() {
    ScreenBrightness.setBrightness(this.state.originLuminous);
  }

  handleBrightness = () => {
    ScreenBrightness.getBrightness().then(originLuminous => {
      if (originLuminous < MIN_LUMINOUS) {
        this.setState({ originLuminous }, () =>
          ScreenBrightness.setBrightness(MAXIMUM_LUMINOUS)
        );
      }
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
