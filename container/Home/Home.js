import React, { Component } from 'react';
import HomeComponent from '../../components/Home';
import { Actions } from 'react-native-router-flux';
import store from 'app-store';

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

  handlePressedSavePoint = () => {
    Actions.qr_bar_code({
      title: 'Quét QR Code',
      index: 1,
      wallet: store.user_info.default_wallet
    });
  };

  handlePressedSurplusNext = () => {};

  handlePressedMyVoucher = () => {};

  handlePressedTransaction = () => {};

  handleServicePressed = (serviceType, serviceId) => {
    switch (serviceType) {
      case 'scan_qc_code':
        Actions.qr_bar_code({
          title: 'Quét QR Code',
          index: 1,
          wallet: store.user_info.default_wallet
        });
        break;
      case 'phone_card':
        Actions.phonecard({
          service_type: serviceType,
          service_id: serviceId
        });
        break;
      case 'nap_tkc':
        Actions.nap_tkc({
          service_type: serviceType,
          service_id: serviceId
        });
        break;
      case 'md_card':
        Actions.md_card({
          service_type: serviceType,
          service_id: serviceId
        });
        break;
    }
  };

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

  render() {
    return (
      <HomeComponent
        onSavePoint={this.handlePressedSavePoint}
        onSurplusNext={this.handlePressedSurplusNext}
        onMyVoucher={this.handlePressedMyVoucher}
        onTransaction={this.handlePressedTransaction}
        onServicePressed={this.handleServicePressed}
        onPromotionPressed={this.handlePromotionPressed}
        onVoucherPressed={this.handleVoucherPressed}
        onShowAllVouchers={this.handleShowAllVouchers}
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
