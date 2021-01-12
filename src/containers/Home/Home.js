import React, {Component} from 'react';

import store from 'app-store';
import appConfig from 'app-config';
import {Actions} from 'react-native-router-flux';
import HomeComponent from '../../components/Home';
import {executeJobs} from '../../helper/jobsOnReset';
import {servicesHandler, SERVICES_TYPE} from '../../helper/servicesHandler';
import {
  LIST_SERVICE_TYPE,
  MIN_ITEMS_PER_ROW,
} from '../../components/Home/constants';
import EventTracker from '../../helper/EventTracker';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      apiFetching: false,
      isDarkStatusBar: false,
      site: null,
      sites: null,
      title_sites: null,
      newses: null,
      notices: null,
      campaigns: null,
      promotions: null,
      services: [],
      products: [],
      listService: [],
      listServiceConfig: {
        type: LIST_SERVICE_TYPE.VERTICAL,
        items_per_row: MIN_ITEMS_PER_ROW,
      },
      primaryActions: null,
      product_groups: {},
    };
    this.eventTracker = new EventTracker();
  }
  homeDataLoaded = false;

  componentDidMount() {
    this.getHomeDataFromApi();
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    store.updateHomeLoaded(false);
    this.eventTracker.clearTracking();
  }

  handleExecuteTempDeepLink() {
    if (store.tempDeepLinkData) {
      servicesHandler(store.tempDeepLinkData.params, store.tempDeepLinkData.t);
      store.setTempDeepLinkData(null);
    }
  }

  async getHomeDataFromApi(showLoading = true) {
    if (showLoading) {
      this.setState({
        apiFetching: true,
      });
    }

    try {
      const response = await APIHandler.user_site_home();
      if (response && response.status == STATUS_SUCCESS) {
        if (response.data.vote_cart && response.data.vote_cart.site_id) {
          Actions.rating({
            cart_data: response.data.vote_cart,
          });
        }

        store.setStoreData(response.data.site);
        store.setAppData(response.data.site);

        if (
          Array.isArray(response.data.popups) &&
          response.data.popups.length > 0
        ) {
          const popup = response.data.popups[0];
          this.handlePopup(popup);
        }

        this.setState((prevState) => ({
          site: response.data.site,
          sites: response.data.sites,
          title_sites: response.data.title_sites,
          newses: response.data.newses,
          notices: response.data.notices,
          services: response.data.services,
          campaigns: response.data.campaigns,
          products: response.data.products,
          promotions: response.data.promotions,
          listService: response.data.list_service,
          listServiceConfig: response.data.list_service_config
            ? {
                ...prevState.listServiceConfig,
                ...response.data.list_service_config,
              }
            : prevState.listServiceConfig,
          primaryActions: response.data.primary_actions,
          showPrimaryActions: response.data.showPrimaryActions,
          product_groups: response.data.product_groups,
        }));

        this.executeDeepLink();
        this.getCartData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState(
        {
          refreshing: false,
          apiFetching: false,
        },
        executeJobs,
      );
    }
  }

  handlePopup(popup) {
    if (store.popupClickedID !== popup.modified) {
      const popupService = {
        type: SERVICES_TYPE.POP_UP,
        image: popup.image_url,
        // image: "https://www.erevollution.com/public/upload/citizen/48526.jpg",
        delay: popup.delay !== undefined ? popup.delay : 2000,
        data: popup,
      };
      servicesHandler(popupService, this.props.t);
      store.setPopupClickedID(popup.modified);
    }
  }

  executeDeepLink() {
    if (!this.homeDataLoaded) {
      this.homeDataLoaded = true;
      store.updateHomeLoaded(true);
      this.handleExecuteTempDeepLink();
    }
  }

  async getCartData() {
    try {
      const response = await APIHandler.site_cart_show(store.store_id);
      if (response && response.status == STATUS_SUCCESS) {
        store.setCartData(response.data);
      } else {
        store.resetCartData();
      }
    } catch (e) {
      console.log('home_site_cart_show' + e);
    }
  }

  handlePullToRefresh = () => {
    this.setState({refreshing: true});

    setTimeout(() => {
      const showLoading = false;
      this.getHomeDataFromApi(showLoading);
    }, 1000);
  };

  handlePressedSurplusNext = () => {
    Actions.push(appConfig.routes.vndWallet, {
      title: store.user_info.default_wallet.name,
      wallet: store.user_info.default_wallet,
    });
  };

  handlePromotionPressed = (item) => {
    servicesHandler(item, this.props.t);
  };

  handleVoucherPressed = (item) => {
    Actions.notify_item({
      title: item.title,
      data: item,
    });
  };

  handleShowAllVouchers = () => {};

  handlePressService(service, callBack) {
    const {t} = this.props;
    if (service.type === 'chat') {
      this.handlePressButtonChat(this.state.site);
    } else {
      servicesHandler(service, t, callBack);
    }
  }

  handleShowAllSites = () => {};

  handleShowAllGroupProduct = (group) => {
    const service = {
      type: SERVICES_TYPE.GROUP_PRODUCT,
      title: group.title,
      groupId: group.id,
    };
    this.handlePressService(service);
  };

  handleShowAllCampaigns = () => {
    Actions.push(appConfig.routes.mainVoucher, {
      from: 'home',
    });
  };

  handleShowAllNews = () => {
    Actions.push(appConfig.routes.newsTab);
  };

  handlePressSiteItem = (store, callBack) => {
    servicesHandler(
      {type: SERVICES_TYPE.OPEN_SHOP, siteId: store.id},
      this.props.t,
      callBack,
    );
  };

  handlePressCampaignItem = (campaign) => {
    Actions.push(appConfig.routes.voucherDetail, {
      title: campaign.title,
      campaignId: campaign.id,
      from: 'home',
    });
  };

  handlePressNewItem = (item) => {
    Actions.notify_item({
      title: item.title,
      data: item,
    });
  };

  handlePressButtonChat = () => {
    if (store.user_info && this.state.site) {
      Actions.amazing_chat({
        titleStyle: {width: 220},
        phoneNumber: this.state.site.tel,
        title: this.state.site.name,
        site_id: this.state.site.id,
        user_id: store.user_info.id,
      });
    }
  };

  productOpening;

  handlePressProduct = (product, callBack) => {
    const service = {
      type: SERVICES_TYPE.PRODUCT_DETAIL,
      siteId: product.site_id,
      productId: product.id,
    };
    servicesHandler(service, this.props.t, callBack);
  };

  render() {
    return (
      <HomeComponent
        site={this.state.site}
        sites={this.state.sites}
        title_sites={this.state.title_sites}
        newses={this.state.newses}
        notices={this.state.notices}
        services={this.state.services}
        userInfo={store.user_info}
        products={this.state.products}
        campaigns={this.state.campaigns}
        promotions={this.state.promotions}
        listService={this.state.listService}
        listServiceType={this.state.listServiceConfig.type}
        listServiceItemsPerRow={this.state.listServiceConfig.items_per_row}
        primaryActions={this.state.primaryActions}
        showPrimaryActions={this.state.showPrimaryActions}
        apiFetching={this.state.apiFetching}
        onActionPress={this.handlePressService.bind(this)}
        onPressProduct={this.handlePressProduct}
        onSurplusNext={this.handlePressedSurplusNext}
        onPromotionPressed={this.handlePromotionPressed}
        onVoucherPressed={this.handleVoucherPressed}
        onShowAllVouchers={this.handleShowAllVouchers}
        onPressService={this.handlePressService.bind(this)}
        onPullToRefresh={this.handlePullToRefresh}
        onShowAllGroupProduct={this.handleShowAllGroupProduct}
        onShowAllSites={this.handleShowAllSites}
        onShowAllCampaigns={this.handleShowAllCampaigns}
        onShowAllNews={this.handleShowAllNews}
        onPressSiteItem={this.handlePressSiteItem}
        onPressCampaignItem={this.handlePressCampaignItem}
        onPressNewItem={this.handlePressNewItem}
        onPressNoti={this.handlePressButtonChat}
        refreshing={this.state.refreshing}
        product_groups={this.state.product_groups}
      />
    );
  }
}

export default withTranslation(['home', 'common'])(observer(Home));
