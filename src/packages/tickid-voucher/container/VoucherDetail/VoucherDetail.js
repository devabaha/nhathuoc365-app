import React from 'react';
import PropTypes from 'prop-types';
import {Alert} from 'react-native';
// configs
import store from 'app-store';
import config from '../../config';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {openMap} from 'app-helper/map';
import {internalFetch} from '../../helper/apiFetch';
import {isLatitude, isLongitude} from '../../helper/validator';
import {showMessage} from '../../constants';
import {getTheme} from 'src/Themes/Theme.context';
import {openLink} from 'app-helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {USE_ONLINE} from '../../constants';
// entities
import CampaignEntity from '../../entity/CampaignEntity';
import AddressEntity from '../../entity/AddressEntity';
import SiteEntity from '../../entity/SiteEntity';
// custom components
import {ScreenWrapper} from 'src/components/base';
import BaseContainer from '../BaseContainer';
import VoucherDetailComponent from '../../component/VoucherDetail';
import ModalConfirm from '../../component/ModalConfirm';

const defaultFn = () => {};

class VoucherDetail extends BaseContainer {
  static contextType = ThemeContext;
  /**
   * Transfer campaignId or voucherId to load the corresponding data
   */
  static propTypes = {
    mode: PropTypes.string,
    from: PropTypes.oneOf(['home', 'deeplink']),
    campaignId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    voucherId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onRemoveVoucherSuccess: PropTypes.func,
    onRemoveVoucherFailure: PropTypes.func,
    onUseVoucherOnlineSuccess: PropTypes.func,
    onUseVoucherOnlineFailure: PropTypes.func,
    forceReload: PropTypes.func,
  };

  static defaultProps = {
    mode: '',
    from: undefined,
    campaignId: undefined,
    voucherId: undefined,
    onRemoveVoucherSuccess: defaultFn,
    onRemoveVoucherFailure: defaultFn,
    onUseVoucherOnlineSuccess: defaultFn,
    onUseVoucherOnlineFailure: defaultFn,
    forceReload: defaultFn,
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
      addresses: {},
    };

    if (
      props.campaignId &&
      props.voucherId &&
      !props.campaignId &&
      !props.voucherId
    ) {
      throw new Error('Need to pass 1 of 2 props campaignId or voucherId');
    }

    this.eventTracker = new EventTracker();
  }

  get theme() {
    return getTheme(this);
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
    const point = Number(this.state.campaign.point);
    if (!isNaN(point)) {
      return numberFormat(point);
    }
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

    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  handlePressCampaignProvider = (store) => {
    config.route.pushToStoreBySiteData(store.data, this.theme);
  };

  handleOpenScanScreen = (voucher) => {
    const {t} = this.props;
    config.route.push(config.routes.voucherScanner, {
      voucher,
      placeholder: t('scan.enterStore'),
      topContentText: t('scan.description'),
      isFromMyVoucher: false,
      onScanVoucherFail: this.handleGetVoucherFail,
    });
  };

  handleGetVoucherFail = () => {
    this.props.forceReload();
    config.route.pop();
  };

  handleAlreadyThisVoucher = ({message, onCheckMyVoucher, onClose}) => {
    const {t} = this.props;
    config.route.push(config.routes.alreadyVoucher, {
      onClose: () => {
        config.route.pop();
        onClose();
      },
      heading: t('alreadyTaken.title'),
      message,
      onCheckMyVoucher: () => {
        /**
         * @NOTE:
         * step 1: `Actions.pop` to back/close `Already Voucher Modal`
         * step 2: Navigate user to `My Voucher` screen (logic in JS call stack at bottom)
         */
        config.route.pop();

        setTimeout(() => {
          config.route.push(config.routes.myVoucher, {}, this.theme);
          onCheckMyVoucher();
        }, 0);
      },
    });
  };

  getVoucherById = async (id, showLoading = true) => {
    if (showLoading) {
      this.setState({
        showLoading: true,
      });
    }
    try {
      const response = await internalFetch(config.rest.detailVoucher(id));
      if (response.status === config.httpCode.success) {
        this.handleApiResponseSuccess(response);
      } else {
        this.handleGetVoucherFail();
        showMessage({
          type: 'danger',
          message: response.message || this.props.t('api.error.message'),
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        refreshing: false,
        showLoading: false,
      });
    }
  };

  getCampaignById = async (id, showLoading = true) => {
    if (showLoading) {
      this.setState({
        showLoading: true,
      });
    }

    try {
      const response = await internalFetch(config.rest.detailCampaign(id));
      if (response.status === config.httpCode.success) {
        this.handleApiResponseSuccess(response);
      } else {
        this.handleGetVoucherFail();
        showMessage({
          type: 'danger',
          message: response.message || this.props.t('api.error.message'),
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        refreshing: false,
        showLoading: false,
      });
    }
  };

  handleApiResponseSuccess = (response) => {
    // @NOTE: mapping places with address entity
    Object.keys(response.data.addresses).forEach((provinceName) => {
      const province = response.data.addresses[provinceName];
      province.forEach(
        (place, index) => (province[index] = new AddressEntity(place)),
      );
    });

    this.setState({
      campaign: new CampaignEntity(response.data.campaign),
      addresses: response.data.addresses,
      site: response.data.site ? new SiteEntity(response.data.site) : null,
    });
  };

  showNotification(title, message) {
    const {t} = this.props;
    Alert.alert(title, message, [{text: t('notification.accept')}]);
  }

  handleOnRefresh = () => {
    this.setState({refreshing: true});

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

  handleGetVoucher = async (campaign) => {
    if (this.getVoucherDisabled) return;

    this.getVoucherDisabled = true;

    this.setState({
      showLoading: true,
    });
    const {t} = this.props;
    try {
      const response = await internalFetch(
        config.rest.saveCampaign(campaign.data.id),
      );
      if (response.status === config.httpCode.success) {
        this.getVoucherDisabled = false;

        showMessage({
          message: t('api.success.taken'),
          type: 'success',
        });
        this.setState({
          campaign: new CampaignEntity(response.data.campaign),
          canUseNow: true,
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
          },
        });
      } else {
        setTimeout(() => {
          this.getVoucherDisabled = false;
          this.showNotification(t('notification.title'), response.message);
        }, 500);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState(
        {
          showLoading: false,
        },
        () => {
          this.props.forceReload();
        },
      );
    }
  };

  handleUseVoucher = (voucher) => {
    // @NOTE: if only use online
    if (this.state.campaign.isOnlyUseOnline) {
      this.setState({
        useOnlineConfirmVisible: true,
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

  handlePressUseOnline = async (voucher) => {
    if (this.useVoucherFetching) return;
    this.useVoucherFetching = true;

    this.setState({
      showLoading: true,
    });

    try {
      const siteId = this.props.siteId || store.store_id;
      const response = await internalFetch(
        config.rest.useVoucherOnline(
          siteId,
          voucher.data.id,
          this.props.orderId,
          this.props.orderType,
        ),
      );
      if (response.status === config.httpCode.success) {
        showMessage({
          type: 'success',
          message: response.message,
        });
        this.props.onUseVoucherOnlineSuccess(response.data, true);
        if (this.isFromHome) {
          config.route.backToMainAndOpenShop(response.data.site, this.theme);
        }
      } else {
        showMessage({
          type: 'danger',
          message: response.message,
        });
        this.props.onUseVoucherOnlineFailure(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.useVoucherFetching = false;
      this.setState({
        showLoading: false,
      });
    }
  };

  handlePressAddressPhoneNumber = (phoneNumber) => {
    openLink(`tel:${phoneNumber}`);
  };

  handlePressAddressLocation = ({latitude, longitude}) => {
    if (isLatitude(latitude) && isLongitude(longitude)) {
      openMap(latitude, longitude);
    }
  };

  voucherRemoving;

  handleRemoveVoucherOnline = async () => {
    if (this.voucherRemoving) return;
    this.voucherRemoving = true;

    this.setState({
      showLoading: true,
    });
    try {
      const response = await internalFetch(
        config.rest.removeVoucherOnline(
          this.state.campaign.data.site_id,
          this.state.campaign.data.id,
          this.props.orderId,
          this.props.orderType,
        ),
      );
      if (response.status === config.httpCode.success) {
        showMessage({
          type: 'success',
          message: response.message,
        });
        this.props.onRemoveVoucherSuccess(response.data);
      } else {
        showMessage({
          type: 'danger',
          message: response.message,
        });
        this.props.onRemoveVoucherFailure(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        showLoading: false,
      });
      this.voucherRemoving = false;
    }
  };

  handleUseOnlineConfirm = () => {
    this.setState({useOnlineConfirmVisible: false});
    this.handlePressUseOnline(this.state.campaign);
  };

  handleBuyCampaign = () => {
    this.setState({
      buyCampaignVisible: true,
    });
  };

  campaignBuying;

  handleBuyCampaignConfirm = async () => {
    if (this.campaignBuying) return;
    this.campaignBuying = true;

    this.setState({
      showLoading: true,
      buyCampaignVisible: false,
    });

    try {
      const response = await internalFetch(
        config.rest.buyCampaign(this.state.campaign.data.id),
      );
      if (response.status === config.httpCode.success) {
        showMessage({
          type: 'success',
          message: response.message,
        });
        this.setState({
          campaign: new CampaignEntity(response.data.campaign),
          canUseNow: true,
        });
      } else {
        showMessage({
          type: 'danger',
          message: response.message,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        showLoading: false,
      });
      this.campaignBuying = false;
    }
  };

  render() {
    const {t} = this.props;
    return (
      <ScreenWrapper>
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
          heading={t('confirm.redeem.title')}
          textMessage={t('confirm.redeem.message', {
            point: this.campaignPoint,
          })}
          cancelLabel={t('modal.cancel')}
          confirmLabel={t('modal.accept')}
          onCancel={() => this.setState({buyCampaignVisible: false})}
          onConfirm={this.handleBuyCampaignConfirm}
        />

        <ModalConfirm
          hideCloseTitle
          visible={this.state.useOnlineConfirmVisible}
          heading={t('confirm.usePromotion.title')}
          textMessage={t('confirm.usePromotion.message')}
          cancelLabel={t('modal.cancel')}
          confirmLabel={t('modal.accept')}
          onCancel={() => this.setState({useOnlineConfirmVisible: false})}
          onConfirm={this.handleUseOnlineConfirm}
        />
      </ScreenWrapper>
    );
  }
}

export default withTranslation(['voucher', 'common'])(observer(VoucherDetail));
