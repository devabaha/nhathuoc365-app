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
      refreshing: false,
      site: null,
      sites: null,
      newses: null,
      notices: null,
      campaigns: null,
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

  getHomeDataFromApi = async () => {
    try {
      const response = await APIHandler.user_site_home();
      if (response && response.status == STATUS_SUCCESS) {
        this.setState({
          site: response.data.site,
          sites: response.data.sites,
          newses: response.data.newses,
          notices: response.data.notices,
          campaigns: response.data.campaigns,
          promotions: response.data.promotions
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        refreshing: false
      });
    }
  };

  handlePullToRefresh = () => {
    this.setState({ refreshing: true });

    const oneSecond = 1000;
    setTimeout(this.getHomeDataFromApi, oneSecond);
  };

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

  handleShowAllSites = () => {};

  handleShowAllCampaigns = () => {
    Actions.push(appConfig.routes.mainVoucher);
  };

  handleShowAllNews = () => {};

  handlePressSiteItem = site => {};

  handlePressCampaignItem = campaign => {
    Actions.push(appConfig.routes.voucherDetail, {
      title: campaign.title
    });
  };

  handlePressNewItem = newItem => {};

  render() {
    return (
      <HomeComponent
        sites={this.state.sites}
        newses={this.state.newses}
        notices={this.state.notices}
        campaigns={this.state.campaigns}
        promotions={this.state.promotions}
        onActionPress={this.handleActionPress}
        onSurplusNext={this.handlePressedSurplusNext}
        onPromotionPressed={this.handlePromotionPressed}
        onVoucherPressed={this.handleVoucherPressed}
        onShowAllVouchers={this.handleShowAllVouchers}
        onPressService={this.handlePressService}
        onPullToRefresh={this.handlePullToRefresh}
        onShowAllSites={this.handleShowAllSites}
        onShowAllCampaigns={this.handleShowAllCampaigns}
        onShowAllNews={this.handleShowAllNews}
        onPressSiteItem={this.handlePressSiteItem}
        onPressCampaignItem={this.handlePressCampaignItem}
        onPressNewItem={this.handlePressNewItem}
        hasPromotion={this.hasPromotion}
        refreshing={this.state.refreshing}
      />
    );
  }
}

export default Home;
