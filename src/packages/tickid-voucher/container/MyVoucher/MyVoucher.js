import React from 'react';
import PropTypes from 'prop-types';
// configs
import store from 'app-store';
import config from '../../config';
// helpers
import {internalFetch} from '../../helper/apiFetch';
import EventTracker from 'app-helper/EventTracker';
import {getTheme} from 'src/Themes/Theme.context';
import {showMessage} from '../../constants';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {USE_ONLINE} from '../../constants';
// entities
import CampaignEntity from '../../entity/CampaignEntity';
// custom components
import BaseContainer from '../BaseContainer';
import MyVoucherComponent from '../../component/MyVoucher';

const defaultFn = () => {};

class MyVoucher extends BaseContainer {
  static contextType = ThemeContext;

  static propTypes = {
    mode: PropTypes.string,
    from: PropTypes.oneOf(['home']),
    siteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onUseVoucherOnlineSuccess: PropTypes.func,
    onUseVoucherOnlineFailure: PropTypes.func,
    forceReload: PropTypes.func,
  };

  static defaultProps = {
    mode: '',
    from: undefined,
    siteId: '',
    onUseVoucherOnlineSuccess: defaultFn,
    onUseVoucherOnlineFailure: defaultFn,
    forceReload: defaultFn,
  };

  get theme() {
    return getTheme(this);
  }

  get isFromHome() {
    return this.props.from === 'home';
  }

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      apiFetching: false,
      campaigns: [],
    };
    this.eventTracker = new EventTracker();
  }

  get isUseOnlineMode() {
    return this.props.mode === USE_ONLINE;
  }

  componentDidMount() {
    const showLoading = true;
    this.getMyVouchers(showLoading, this.props.siteId);
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  handleScanVoucherFail = () => {
    this.props.forceReload();
    this.getMyVouchers();
  };

  handlePressVoucher = (voucher) => {
    config.route.push(
      config.routes.voucherDetail,
      {
        voucherId: voucher.data.id,
        from: this.props.from,
        title: voucher.data.title,
        orderId: this.props.orderId,
        orderType: this.props.orderType,
        isUseOnlineMode: this.isUseOnlineMode,
        onUseVoucherOnlineSuccess: this.props.onUseVoucherOnlineSuccess,
        onUseVoucherOnlineFailure: this.props.onUseVoucherOnlineFailure,
        forceReload: this.handleScanVoucherFail,
      },
      this.theme,
    );
  };

  handlePressEnterVoucher = (isEnterCode = false) => {
    const {t} = this.props;
    config.route.push(
      config.routes.voucherScanner,
      {
        placeholder: t('scan.enterVoucher'),
        topContentText: t('scan.description'),
        isFromMyVoucher: true,
        refreshMyVoucher: () => {
          this.getMyVouchers();
        },
        isEnterCode,
        onCloseEnterCode: () => {
          if (isEnterCode) {
            config.route.pop();
          }
        },
        onScanVoucherFail: this.handleScanVoucherFail,
      },
      this.theme,
    );
  };

  getMyVouchers = async (showLoading = true, siteId = null) => {
    if (showLoading) {
      this.setState({
        apiFetching: true,
      });
    }
    const {t} = this.props;
    try {
      const url = siteId
        ? config.rest.myVouchersBySiteId(siteId)
        : config.rest.myVouchers();
      const response = await internalFetch(url);
      if (response.status === config.httpCode.success) {
        const campaigns = response.data.campaigns.map(
          (campaign) => new CampaignEntity(campaign),
        );

        if (store.deep_link_data) {
          const campaign = campaigns.find(
            (campaign) => campaign.data.id === store.deep_link_data.id,
          );
          if (campaign) {
            this.handlePressVoucher(campaign);
          } else {
            showMessage({
              type: 'danger',
              message: t('api.error.notFound'),
            });
          }
        }
        this.setState({campaigns});
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        refreshing: false,
        apiFetching: false,
      });

      store.setDeepLinkData(null);
    }
  };

  handleOnRefresh = () => {
    this.setState({refreshing: true});

    setTimeout(() => {
      const showLoading = false;
      this.getMyVouchers(showLoading, this.props.siteId);
    }, 1000);
  };

  useVoucherFetching;

  handlePressUseOnline = async (voucher) => {
    if (this.useVoucherFetching) return;
    this.useVoucherFetching = true;

    this.setState({
      apiFetching: true,
    });

    try {
      const response = await internalFetch(
        config.rest.useVoucherOnline(
          this.props.siteId,
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
        this.props.onUseVoucherOnlineSuccess(response.data);
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
        refreshing: false,
        apiFetching: false,
      });
    }
  };

  render() {
    return (
      <MyVoucherComponent
        t={this.props.t}
        onPressVoucher={this.handlePressVoucher}
        onPressEnterVoucher={() => this.handlePressEnterVoucher()}
        onPressUseOnline={this.handlePressUseOnline}
        campaigns={this.state.campaigns}
        onRefresh={this.handleOnRefresh}
        refreshing={this.state.refreshing}
        apiFetching={this.state.apiFetching}
        isUseOnlineMode={this.isUseOnlineMode}
        onPressEnterCode={() => this.handlePressEnterVoucher(true)}
      />
    );
  }
}

export default withTranslation('voucher')(observer(MyVoucher));
