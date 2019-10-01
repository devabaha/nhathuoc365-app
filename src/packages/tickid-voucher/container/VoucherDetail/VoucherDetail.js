import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Linking } from 'react-native';
import config from '../../config';
import BaseContainer from '../BaseContainer';
import VoucherDetailComponent from '../../component/VoucherDetail';
import CampaignEntity from '../../entity/CampaignEntity';
import AddressEntity from '../../entity/AddressEntity';
import SiteEntity from '../../entity/SiteEntity';
import { internalFetch } from '../../helper/apiFetch';
import { isLatitude, isLongitude } from '../../helper/validator';
import openMap from 'react-native-open-maps';
import { showMessage } from 'react-native-flash-message';

class VoucherDetail extends BaseContainer {
  /**
   * Transfer campaignId or voucherId to load the corresponding data
   */
  static propTypes = {
    campaignId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    voucherId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  static defaultProps = {
    campaignId: undefined,
    voucherId: undefined
  };

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      canUseNow: false,
      showLoading: false,
      site: null,
      campaign: null,
      addresses: {}
    };

    if (
      props.campaignId &&
      props.voucherId &&
      (!props.campaignId && !props.voucherId)
    ) {
      throw new Error('Need to pass 1 of 2 props campaignId or voucherId');
    }
  }

  get isFromMyVoucher() {
    return !!this.props.voucherId;
  }

  componentWillMount() {
    this.validateRequiredMethods([
      'handlePressCampaignProvider',
      'handleOpenScanScreen',
      'handleAlreadyThisVoucher'
    ]);
  }

  componentDidMount() {
    if (this.props.voucherId) {
      this.getVoucherById(this.props.voucherId);
    } else if (this.props.campaignId) {
      this.getCampaignById(this.props.campaignId);
    }
  }

  getVoucherById = async (id, showLoading = true) => {
    if (showLoading) {
      this.setState({
        showLoading: true
      });
    }
    try {
      const response = await internalFetch(config.rest.detailVoucher(id));
      if (response.status === config.httpCode.success) {
        this.handleApiResponseSuccess(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        refreshing: false,
        showLoading: false
      });
    }
  };

  getCampaignById = async (id, showLoading = true) => {
    if (showLoading) {
      this.setState({
        showLoading: true
      });
    }

    try {
      const response = await internalFetch(config.rest.detailCampaign(id));
      if (response.status === config.httpCode.success) {
        this.handleApiResponseSuccess(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        refreshing: false,
        showLoading: false
      });
    }
  };

  handleApiResponseSuccess = response => {
    // @NOTE: mapping places with address entity
    Object.keys(response.data.addresses).forEach(provinceName => {
      const province = response.data.addresses[provinceName];
      province.forEach(
        (place, index) => (province[index] = new AddressEntity(place))
      );
    });

    this.setState({
      campaign: new CampaignEntity(response.data.campaign),
      addresses: response.data.addresses,
      site: response.data.site ? new SiteEntity(response.data.site) : null
    });
  };

  showMessage(title, message) {
    Alert.alert(title, message, [{ text: 'Đóng lại' }]);
  }

  handleOnRefresh = () => {
    this.setState({ refreshing: true });

    setTimeout(() => {
      const showLoading = false;

      if (this.props.voucherId) {
        this.getVoucherById(this.props.voucherId, showLoading);
      } else if (this.props.campaignId) {
        this.getCampaignById(this.props.campaignId, showLoading);
      }
    }, 1000);
  };

  getVoucherDisabled;

  handleGetVoucher = async campaign => {
    if (this.getVoucherDisabled) return;

    this.getVoucherDisabled = true;

    this.setState({
      showLoading: true
    });

    try {
      const response = await internalFetch(
        config.rest.saveCampaign(campaign.data.id)
      );
      if (response.status === config.httpCode.success) {
        this.getVoucherDisabled = false;

        showMessage({
          message: 'Bạn đã nhận thành công voucher này.',
          type: 'danger'
        });
        this.setState({ canUseNow: true });

        /**
         * @NOTE: 201 means the user has this voucher
         * thuclh said
         */
      } else if (response.status === 201) {
        this.handleAlreadyThisVoucher({
          campaign,
          message: response.message,
          onCheckMyVoucher: () => {
            // prevent duplicate touchs to `Get Voucher` button
            setTimeout(() => (this.getVoucherDisabled = false), 1000);
          },
          onClose: () => {
            this.getVoucherDisabled = false;
          }
        });
      } else {
        setTimeout(() => {
          this.getVoucherDisabled = false;
          this.showMessage('Thông báo', response.message);
        }, 500);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        showLoading: false
      });
    }
  };

  handleUseVoucher = voucher => {
    this.handleOpenScanScreen(voucher);
  };

  handlePressAddressPhoneNumber = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  handlePressAddressLocation = ({ latitude, longitude }) => {
    if (isLatitude(latitude) && isLongitude(longitude)) {
      openMap({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      });
    }
  };

  render() {
    return (
      <VoucherDetailComponent
        canUseNow={this.state.canUseNow || this.isFromMyVoucher}
        site={this.state.site}
        campaign={this.state.campaign}
        addresses={this.state.addresses}
        refreshing={this.state.refreshing}
        showLoading={this.state.showLoading}
        isFromMyVoucher={this.isFromMyVoucher}
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
