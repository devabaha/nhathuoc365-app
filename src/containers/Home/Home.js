import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';
import store from 'app-store';
import HomeComponent, {
  SCAN_QR_CODE_TYPE,
  TOP_UP_PHONE_TYPE,
  RADA_SERVICE_TYPE,
  BOOKING_30DAY_TYPE,
  ACCUMULATE_POINTS_TYPE,
  MY_VOUCHER_TYPE,
  TRANSACTION_TYPE
} from '../../components/Home';

@observer
class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      store_data: null,
      refreshing: false,
      loading: false,
      scrollTop: 0,
      promotions: null
    };
  }

  get hasPromotion() {
    return (
      Array.isArray(this.state.promotions) && this.state.promotions.length > 0
    );
  }

  componentDidMount() {
    this.getHomeDataFromApi();
  }

  getHomeDataFromApi = (delay = 0) => {
    if (store.no_refresh_home_change) {
      return;
    }
    this.setState(
      {
        loading: true
      },
      async () => {
        try {
          const response = await APIHandler.user_site_home();
          if (response && response.status == STATUS_SUCCESS) {
            setTimeout(() => {
              const { data } = response;
              this.setState({
                loading: false,
                refreshing: false,
                store_data: data.site,
                newses_data:
                  data.newses && data.newses.length ? data.newses : null,
                farm_newses_data:
                  data.farm_newses && data.farm_newses.length
                    ? data.farm_newses
                    : null,
                promotions:
                  data.promotions && data.promotions.length
                    ? data.promotions
                    : null
              });
              store.setStoreData(data.site);
            }, delay || 0);
          }
        } catch (e) {
          console.warn(e + ' user_home');
          store.addApiQueue('user_home', this.getHomeDataFromApi.bind(this));
        }
      }
    );
  };

  onPullToRefresh() {
    this.setState({ refreshing: true });

    const delayOneSecond = 1000;
    this.getHomeDataFromApi(delayOneSecond);
  }

  handlePressedSurplusNext = () => {};

  handlePromotionPressed(item) {
    Actions.notify_item({
      title: item.title,
      data: item
    });
  }

  handleVoucherPressed = item => {
    Actions.notify_item({
      title: item.title,
      data: item
    });
  };

  handleShowAllVouchers = () => {};

  handleActionPress = action => {
    switch (action.type) {
      case ACCUMULATE_POINTS_TYPE:
        Actions.push(appConfig.routes.qrBarCode);
        break;
      case MY_VOUCHER_TYPE:
        Actions.push(appConfig.routes.mainVoucher);
        break;
      case TRANSACTION_TYPE:
        //
        break;
    }
  };

  handlePressService = service => {
    switch (service.type) {
      case SCAN_QR_CODE_TYPE:
        Actions.push(appConfig.routes.qrBarCode, {
          index: 1,
          title: 'Quét QR Code',
          wallet: store.user_info.default_wallet
        });
        break;
      case TOP_UP_PHONE_TYPE:
        Actions.push(appConfig.routes.upToPhone, {
          service_type: service.type,
          service_id: service.id
        });
        break;
      case RADA_SERVICE_TYPE:
        //
        break;
      case BOOKING_30DAY_TYPE:
        //
        break;
    }
  };

  render() {
    return (
      <HomeComponent
        onActionPress={this.handleActionPress}
        onSurplusNext={this.handlePressedSurplusNext}
        onPromotionPressed={this.handlePromotionPressed}
        onVoucherPressed={this.handleVoucherPressed}
        onShowAllVouchers={this.handleShowAllVouchers}
        onPressService={this.handlePressService}
        hasPromotion={this.hasPromotion}
        refreshing={this.state.refreshing}
        promotions={this.state.promotions}
        farmNewsesData={this.state.farm_newses_data}
        newsesData={this.state.newses_data}
      />
    );
  }
}

export default Home;
