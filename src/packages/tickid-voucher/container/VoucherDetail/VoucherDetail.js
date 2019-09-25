import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Linking } from 'react-native';
import config from '../../config';
import BaseContainer from '../BaseContainer';
import VoucherDetailComponent from '../../component/VoucherDetail';
import CampaignEntity from '../../entity/CampaignEntity';
import AddressEntity from '../../entity/AddressEntity';
import { internalFetch } from '../../helper/apiFetch';
import { isLongLat } from '../../helper/validator';
import openMap from 'react-native-open-maps';
import MessageBar from '@tickid/tickid-rn-message-bar';

class VoucherDetail extends BaseContainer {
  static propTypes = {
    campaignId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      canUseNow: false,
      campaign: null,
      addresses: {}
    };
  }

  componentWillMount() {
    this.validateRequiredMethods(['handlePressCampaignProvider']);
  }

  componentDidMount() {
    this.getCampaignById(this.props.campaignId);
  }

  getCampaignById = async id => {
    try {
      const response = await internalFetch(config.rest.detailCampaigns(id));
      if (response.status === config.httpCode.success) {
        // @NOTE: mapping places with address entity
        Object.keys(response.data.addresses).forEach(provinceName => {
          const province = response.data.addresses[provinceName];
          province.forEach(
            (place, index) => (province[index] = new AddressEntity(place))
          );
        });

        this.setState({
          campaign: new CampaignEntity(response.data.campaign),
          addresses: response.data.addresses
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ refreshing: false });
    }
  };

  showMessage(title, message) {
    Alert.alert(title, message, [{ text: 'Đóng lại' }]);
  }

  handleOnRefresh = () => {
    this.setState({ refreshing: true });

    setTimeout(() => {
      this.getCampaignById(this.props.campaignId);
    }, 1000);
  };

  getVoucherFetching;

  handleGetVoucher = async campaign => {
    if (this.getVoucherFetching) return;

    this.getVoucherFetching = true;

    try {
      const response = await internalFetch(
        config.rest.saveCampaign(campaign.data.id)
      );
      if (response.status === config.httpCode.success) {
        MessageBar.showSuccess({
          message: 'Bạn đã nhận thành công voucher này.'
        });
        this.setState({ canUseNow: true });
      } else {
        this.showMessage('Thông báo', response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.getVoucherFetching = false;
    }
  };

  handleUseVoucher = campaign => {
    // @TODO: open camera to scan barcode
    //
  };

  useVoucherFetching;

  useVoucher = async (id, code) => {
    if (this.useVoucherFetching) return;

    this.useVoucherFetching = true;

    try {
      const response = await internalFetch(config.rest.useVoucher(id, code));
      if (response.status === config.httpCode.success) {
        // use voucher success
      } else {
        this.showMessage('Thông báo', response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.useVoucherFetching = false;
    }
  };

  handlePressAddressPhoneNumber = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  handlePressAddressLocation = (latitude, longitude) => {
    if (isLongLat(latitude) && isLongLat(longitude)) {
      openMap({ latitude, longitude });
    }
  };

  render() {
    return (
      <VoucherDetailComponent
        canUseNow={this.state.canUseNow}
        campaign={this.state.campaign}
        addresses={this.state.addresses}
        refreshing={this.state.refreshing}
        onRefresh={this.handleOnRefresh}
        onGetVoucher={this.handleGetVoucher}
        onUseVoucher={this.handleUseVoucher}
        onPressAddressPhoneNumber={this.handlePressAddressPhoneNumber}
        onPressAddressLocation={this.handlePressAddressLocation}
        onPressCampaignProvider={this.handlePressCampaignProvider}
      />
    );
  }
}

export default VoucherDetail;
