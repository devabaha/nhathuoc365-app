import React, {Component} from 'react';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import {executeJobs} from '../../helper/jobsOnReset';
import {servicesHandler} from '../../helper/servicesHandler';
import {getTheme} from 'src/Themes/Theme.context';
import {checkIfEULAAgreed, updateEULAUserDecision} from 'app-helper';
import {isConfigActive} from 'app-helper/configKeyHandler';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {
  LIST_SERVICE_TYPE,
  MIN_ITEMS_PER_ROW,
} from '../../components/Home/constants';
import {SERVICES_TYPE} from '../../helper/servicesHandler';
import {CONFIG_KEY} from 'app-helper/configKeyHandler';
// entities
import EventTracker from '../../helper/EventTracker';
// custom components
import HomeComponent from '../../components/Home';

class Home extends Component {
  static contextType = ThemeContext;

  state = {
    refreshing: false,
    apiFetching: false,
    storeFetching: false,
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
    product_groups: [],
    news_categories: [],
    product_categories: [],
  };
  eventTracker = new EventTracker();
  homeDataLoaded = false;

  get theme() {
    return getTheme(this);
  }

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
      servicesHandler(
        {...(store.tempDeepLinkData.params || {}), theme: this.theme},
        store.tempDeepLinkData.t,
      );
      store.setTempDeepLinkData(null);
    }
  }

  async getHomeDataFromApi(showLoading = true) {
    if (showLoading) {
      this.setState({
        apiFetching: true,
      });
    }

    if (isConfigActive(CONFIG_KEY.ENABLE_EULA_KEY)) {
      const isEULAAgreed = await checkIfEULAAgreed();

      if (!isEULAAgreed) {
        servicesHandler({
          type: SERVICES_TYPE.EULA_AGREEMENT,
          backdropPressToClose: false,
          onAgree: async () => {
            await updateEULAUserDecision();
            this.getHomeDataFromApi();
          },
        });
        return;
      }
    }

    try {
      const response = await APIHandler.user_site_home();
      if (response && response.status == STATUS_SUCCESS) {
        if (response.data.vote_cart && response.data.vote_cart.site_id) {
          servicesHandler({
            type: SERVICES_TYPE.RATING,
            theme: this.theme,
            cart_data: response.data.vote_cart,
          });
        }
        console.log(response.data);
        action(() => {
          store.setStoreData(response.data.site);
          store.setAppData(response.data.app);
          store.setPackageOptions(response.data.package_options || {});
        })();

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
          news_categories: response.data.news_categories,
          product_categories: response.data.product_categorys,
          social_posts: response.data.social_posts,
        }));

        this.executeDeepLink();
        this.getCartData();
        if (response.data?.social_posts?.length) {
          // store.resetSocialPosts();
        }
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
        theme: this.theme,
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
    servicesHandler({type: SERVICES_TYPE.WALLET, theme: this.theme});
  };

  handlePressCommission = () => {
    servicesHandler({
      type: SERVICES_TYPE.COMMISSION_INCOME_STATEMENT,
      theme: this.theme,
    });
  };

  handlePromotionPressed = (item) => {
    servicesHandler({...item, theme: this.theme}, this.props.t);
  };

  /**
   *
   * @deprecated
   */
  handleVoucherPressed = (item) => {
    servicesHandler({
      type: SERVICES_TYPE.NEWS_DETAIL,
      theme: this.theme,
      title: item.title,
      news: item,
    });
  };

  handleShowAllVouchers = () => {};

  handlePressService(service, callBack) {
    const {t} = this.props;
    service.theme = this.theme;

    if (service.type === 'chat') {
      this.handlePressButtonChat(this.state.site);
    } else {
      servicesHandler(service, t, callBack);
    }
  }

  handleShowAllSites = () => {
    // store.setSelectedTab(appConfig.routes.customerCardWallet);
    servicesHandler({
      type: SERVICES_TYPE.GPS_LIST_SITE,
      theme: this.theme,
    });
  };

  handleShowAllGroupProduct = (group) => {
    const service = {
      type: SERVICES_TYPE.GROUP_PRODUCT,
      title: group.title,
      groupId: group.id,
    };
    this.handlePressService(service);
  };

  handleShowAllCampaigns = () => {
    servicesHandler({
      type: SERVICES_TYPE.LIST_VOUCHER,
      theme: this.theme,
      from: 'home',
    });
  };

  handleShowAllNews = (title, categoryId) => {
    servicesHandler({
      type: SERVICES_TYPE.NEWS_CATEGORY,
      theme: this.theme,
      title,
      categoryId,
    });
  };

  handlePressSiteItem = (store, callBack) => {
    servicesHandler(
      {
        type: SERVICES_TYPE.OPEN_SHOP,
        theme: this.theme,
        siteId: store.id,
      },
      this.props.t,
      callBack,
    );
  };

  handlePressCampaignItem = (campaign) => {
    servicesHandler({
      type: SERVICES_TYPE.VOUCHER_CAMPAIGN_DETAIL,
      theme: this.theme,
      title: campaign.title,
      campaignId: campaign.id,
      from: 'home',
    });
  };

  handlePressNewsItem = (item) => {
    servicesHandler({
      type: SERVICES_TYPE.NEWS_DETAIL,
      theme: this.theme,
      title: item.title,
      news: item,
    });
  };

  handlePressButtonChat = () => {
    if (store.user_info && this.state.site) {
      servicesHandler({
        type: SERVICES_TYPE.CHAT,
        titleStyle: {width: 220},
        phoneNumber: this.state.site.tel,
        title: this.state.site.name,
        site_id: this.state.site.id,
        user_id: store.user_info.id,
        theme: this.theme,
      });
    }
  };

  goToSocial = () => {
    servicesHandler({
      type: SERVICES_TYPE.SOCIAL,
      siteId: store?.store_data?.id,
      theme: this.theme,
    });
  };

  getStore(id, onSuccess = () => {}, onFail = () => {}, onFinally = () => {}) {
    const {t} = this.props;
    APIHandler.site_info(id)
      .then((response) => {
        if (response) {
          onSuccess(response);
        } else {
          flashShowMessage({
            type: 'danger',
            message: t('common:api.error.message'),
          });
        }
      })
      .catch(onFail)
      .finally(onFinally);
  }

  productOpening;

  handlePressProduct = (product, callBack) => {
    // const service = {
    //   type: SERVICES_TYPE.PRODUCT_DETAIL,
    //   siteId: product.site_id,
    //   productId: product.id,
    // };
    // servicesHandler(service, this.props.t, callBack);
    servicesHandler({
      type: SERVICES_TYPE.PRODUCT_DETAIL,
      theme: this.theme,
      title: product.name,
      product,
    });
  };

  goToSearch = () => {
    const {t} = this.props;
    this.setState({storeFetching: true});

    this.getStore(
      store.store_id || appConfig.defaultSiteId,
      (response) => {
        if (response.status == STATUS_SUCCESS && response.data) {
          store.setStoreData(response.data);
          servicesHandler({
            type: SERVICES_TYPE.SEARCH_STORE,
            categories: null,
            category_id: 0,
            category_name: '',
            autoFocus: true,
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('common:api.error.message'),
          });
        }
      },
      (error) => {},
      () => {
        setTimeout(() => this.setState({storeFetching: false}), 400);
      },
    );
  };

  render() {
    return (
      <HomeComponent
        navigation={this.props.navigation}
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
        listServiceItemsPerRow={Number(
          this.state.listServiceConfig.items_per_row,
        )}
        primaryActions={this.state.primaryActions}
        showPrimaryActions={this.state.showPrimaryActions}
        apiFetching={this.state.apiFetching}
        storeFetching={this.state.storeFetching}
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
        onShowAllNews={(title, id) => this.handleShowAllNews(title, id)}
        onPressSiteItem={this.handlePressSiteItem}
        onPressCampaignItem={this.handlePressCampaignItem}
        onPressNewItem={this.handlePressNewsItem}
        onPressNoti={this.handlePressButtonChat}
        onPressCommission={this.handlePressCommission}
        goToSocial={this.goToSocial}
        refreshing={this.state.refreshing}
        product_groups={this.state.product_groups}
        goToSearch={this.goToSearch}
        news_categories={this.state.news_categories}
        product_categories={this.state.product_categories}
        social_posts={this.state.social_posts}
      />
    );
  }
}

export default withTranslation(['home', 'common'])(observer(Home));
