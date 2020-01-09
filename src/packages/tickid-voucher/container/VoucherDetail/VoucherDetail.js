import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Linking, View, StyleSheet } from 'react-native';
import config from '../../config';
import BaseContainer from '../BaseContainer';
import { USE_ONLINE } from '../../constants';
import VoucherDetailComponent from '../../component/VoucherDetail';
import ModalConfirm from '../../component/ModalConfirm';
import CampaignEntity from '../../entity/CampaignEntity';
import AddressEntity from '../../entity/AddressEntity';
import SiteEntity from '../../entity/SiteEntity';
import { internalFetch } from '../../helper/apiFetch';
import { isLatitude, isLongitude } from '../../helper/validator';
import openMap from 'react-native-open-maps';
import { showMessage } from 'react-native-flash-message';

const defaultFn = () => {};

class VoucherDetail extends BaseContainer {
  /**
   * Transfer campaignId or voucherId to load the corresponding data
   */
  static propTypes = {
    mode: PropTypes.string,
    from: PropTypes.oneOf(['home']),
    campaignId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    voucherId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onRemoveVoucherSuccess: PropTypes.func,
    onRemoveVoucherFailure: PropTypes.func,
    onUseVoucherOnlineSuccess: PropTypes.func,
    onUseVoucherOnlineFailure: PropTypes.func
  };

  static defaultProps = {
    mode: '',
    from: undefined,
    campaignId: undefined,
    voucherId: undefined,
    onRemoveVoucherSuccess: defaultFn,
    onRemoveVoucherFailure: defaultFn,
    onUseVoucherOnlineSuccess: defaultFn,
    onUseVoucherOnlineFailure: defaultFn
  };

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      canUseNow: false,
      showLoading: false,
      useOnlineConfirmVisible: false,
      buyCampaignVisible: false,
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

  get isFromHome() {
    return this.props.from === 'home';
  }

  get isCampaign() {
    return !!this.props.campaignId;
  }

  get isFromMyVoucher() {
    return !!this.props.voucherId;
  }

  get isUseOnlineMode() {
    return this.props.mode === USE_ONLINE;
  }

  get campaignPoint() {
    if (!this.state.campaign) return 0;
    return this.state.campaign.point;
  }

  get campaignCurrency() {
    if (!this.state.campaign) return '';
    return this.state.campaign.data.point_currency;
  }

  get canBuyCampaign() {
    return this.campaignPoint > 0 && this.isCampaign;
  }

  componentDidMount() {
    if (this.props.voucherId) {
      this.getVoucherById(this.props.voucherId);
    } else if (this.props.campaignId) {
      this.getCampaignById(this.props.campaignId);
    }
  }

  handlePressCampaignProvider = store => {
    config.route.pushToStoreBySiteData(store.data);
  };

  handleOpenScanScreen = voucher => {
    config.route.push(config.routes.voucherScanner, {
      voucher,
      placeholder: 'Nhập mã cửa hàng',
      topContentText:
        'Hướng máy ảnh của bạn về phía mã QR Code để sử dụng voucher',
      isFromMyVoucher: false
    });
  };

  handleAlreadyThisVoucher = ({ message, onCheckMyVoucher, onClose }) => {
    config.route.push(config.routes.alreadyVoucher, {
      onClose: () => {
        config.route.pop();
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
        config.route.pop();

        setTimeout(() => {
          config.route.push(config.routes.myVoucher, {
            title: 'Voucher của tôi'
          });
          onCheckMyVoucher();
        }, 0);
      }
    });
  };

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
          type: 'success'
        });
        this.setState({
          campaign: new CampaignEntity(response.data.campaign),
          canUseNow: true
        });

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
    // @NOTE: if only use online
    if (this.state.campaign.isOnlyUseOnline) {
      this.setState({
        useOnlineConfirmVisible: true
      });
    } else {
      // @NOTE: is from my voucher (from orders) screen with user-online mode
      if (this.props.isUseOnlineMode) {
        this.handlePressUseOnline(voucher);
      } else {
        this.handleOpenScanScreen(voucher);
      }
    }
  };

  useVoucherFetching;

  handlePressUseOnline = async voucher => {
    if (this.useVoucherFetching) return;
    this.useVoucherFetching = true;

    this.setState({
      showLoading: true
    });

    try {
      const response = await internalFetch(
        config.rest.useVoucherOnline(voucher.data.site_id, voucher.data.id)
      );
      if (response.status === config.httpCode.success) {
        showMessage({
          type: 'success',
          message: response.message
        });
        this.props.onUseVoucherOnlineSuccess(response.data, true);
        if (this.isFromHome) {
          config.route.backToMainAndOpenShop(response.data.site);
        }
      } else {
        showMessage({
          type: 'danger',
          message: response.message
        });
        this.props.onUseVoucherOnlineFailure(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.useVoucherFetching = false;
      this.setState({
        showLoading: false
      });
    }
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

  voucherRemoving;

  handleRemoveVoucherOnline = async () => {
    if (this.voucherRemoving) return;
    this.voucherRemoving = true;

    this.setState({
      showLoading: true
    });
    try {
      const response = await internalFetch(
        config.rest.removeVoucherOnline(
          this.state.campaign.data.site_id,
          this.state.campaign.data.id
        )
      );
      if (response.status === config.httpCode.success) {
        showMessage({
          type: 'success',
          message: response.message
        });
        this.props.onRemoveVoucherSuccess(response.data);
      } else {
        showMessage({
          type: 'danger',
          message: response.message
        });
        this.props.onRemoveVoucherFailure(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        showLoading: false
      });
      this.voucherRemoving = false;
    }
  };

  handleUseOnlineConfirm = () => {
    this.setState({ useOnlineConfirmVisible: false });
    this.handlePressUseOnline(this.state.campaign);
  };

  handleBuyCampaign = () => {
    this.setState({
      buyCampaignVisible: true
    });
  };

  campaignBuying;

  handleBuyCampaignConfirm = async () => {
    if (this.campaignBuying) return;
    this.campaignBuying = true;

    this.setState({
      showLoading: true,
      buyCampaignVisible: false
    });

    try {
      const response = await internalFetch(
        config.rest.buyCampaign(this.state.campaign.data.id)
      );
      if (response.status === config.httpCode.success) {
        showMessage({
          type: 'success',
          message: response.message
        });
        this.setState({
          campaign: new CampaignEntity(response.data.campaign),
          canUseNow: true
        });
      } else {
        showMessage({
          type: 'danger',
          message: response.message
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        showLoading: false
      });
      this.campaignBuying = false;
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <VoucherDetailComponent
          canUseNow={this.state.canUseNow || this.isFromMyVoucher}
          canBuyCampaign={this.canBuyCampaign}
          campaignPoint={this.campaignPoint}
          campaignCurrency={this.campaignCurrency}
          site={this.state.site}
          campaign={this.state.campaign}
          addresses={this.state.addresses}
          refreshing={this.state.refreshing}
          showLoading={this.state.showLoading}
          isFromMyVoucher={this.isFromMyVoucher}
          isUseOnlineMode={this.isUseOnlineMode}
          onRefresh={this.handleOnRefresh}
          onGetVoucher={this.handleGetVoucher}
          onUseVoucher={this.handleUseVoucher}
          onRemoveVoucherOnline={this.handleRemoveVoucherOnline}
          onBuyCampaign={this.handleBuyCampaign}
          onPressAddressPhoneNumber={this.handlePressAddressPhoneNumber}
          onPressAddressLocation={this.handlePressAddressLocation}
          onPressCampaignProvider={this.handlePressCampaignProvider}
        />

        <ModalConfirm
          hideCloseTitle
          visible={this.state.buyCampaignVisible}
          heading="Đổi thưởng"
          textMessage={`Đổi ${this.campaignPoint} điểm lấy khuyến mại này?`}
          onCancel={() => this.setState({ buyCampaignVisible: false })}
          onConfirm={this.handleBuyCampaignConfirm}
        />

        <ModalConfirm
          hideCloseTitle
          visible={this.state.useOnlineConfirmVisible}
          heading="Sử dụng khuyến mại"
          textMessage="Sử dụng khuyến mại này với đơn hàng của bạn?"
          onCancel={() => this.setState({ useOnlineConfirmVisible: false })}
          onConfirm={this.handleUseOnlineConfirm}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  confirmContent: {
    padding: 16
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#666'
  },
  confirmBtnWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32
  },
  confirmBtnContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#666',
    paddingVertical: 8,
    borderRadius: 6
  },
  btnContainerCancel: {
    marginRight: 8
  },
  btnContainerOk: {
    marginLeft: 8,
    borderColor: config.colors.primary,
    backgroundColor: config.colors.primary
  },
  confirmBtn: {},
  btnCancel: {
    color: '#666'
  },
  btnOk: {
    color: '#fff'
  }
});

export default VoucherDetail;
