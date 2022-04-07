import React, {Component} from 'react';
import PropTypes from 'prop-types';
// 3-party libs
import ScreenBrightness from 'react-native-screen-brightness';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// entities
import CampaignEntity from '../../entity/CampaignEntity';
// custom components
import ShowBarcodeComponent from '../../component/ShowBarcode';

const MAXIMUM_LUMINOUS = 0.7;
const MIN_LUMINOUS = 0.5;

class ShowBarcode extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    code: PropTypes.string.isRequired,
    voucher: PropTypes.instanceOf(CampaignEntity).isRequired,
  };

  static defaultProps = {
    code: undefined,
    voucher: undefined,
  };

  state = {
    originLuminous: MIN_LUMINOUS,
  };
  eventTracker = new EventTracker();

  updateNavBarDisposer = () => {};

  componentDidMount() {
    this.handleBrightness();
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    ScreenBrightness.setBrightness(this.state.originLuminous);
    this.eventTracker.clearTracking();

    this.updateNavBarDisposer();
  }

  handleBrightness = () => {
    ScreenBrightness.getBrightness().then((originLuminous) => {
      if (originLuminous < MIN_LUMINOUS) {
        this.setState({originLuminous}, () =>
          ScreenBrightness.setBrightness(MAXIMUM_LUMINOUS),
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
