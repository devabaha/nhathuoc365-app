import React, { Component } from 'react';
import { Alert } from 'react-native';

import OneSignal from 'react-native-onesignal';
import branch from 'react-native-branch';

import store from 'app-store';
import appConfig from 'app-config';
import { Actions } from 'react-native-router-flux';
import HomeComponent from '../../components/Home';
import { executeJobs } from '../../helper/jobsOnReset';
import { servicesHandler } from '../../helper/servicesHandler';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      apiFetching: false,
      isDarkStatusBar: false,
      site: null,
      sites: null,
      newses: null,
      notices: null,
      campaigns: null,
      promotions: null,
      services: [],
      products: [],
      listService: [],
      primaryActions: [],
      product_groups: {}
    };
  }
  branchIOUnsubcribe = null;
  homeDataLoaded = false;

  componentDidMount() {
    this.getHomeDataFromApi();
    EventTracker.logEvent('home_page');
  }

  componentWillUnmount() {
    this.homeDataLoaded && this.handleRemoveListenerOneSignal();
    if (this.branchIOUnsubcribe) {
      this.branchIOUnsubcribe();
    }
  }

  handleAddListenerOneSignal = () => {
    OneSignal.addEventListener('opened', this.handleOpenningNotification);
  };

  handleRemoveListenerOneSignal = () => {
    OneSignal.removeEventListener('opened', this.handleOpenningNotification);
  };

  handleOpenningNotification(openResult) {
    const { t } = this.props;
    const data = openResult.notification.payload.additionalData;
    servicesHandler(data, t);
  }

  handleSubcribeBranchIO = () => {
    const { t } = this.props;
    this.branchIOUnsubcribe = branch.subscribe(({ error, params }) => {
      if (error) {
        console.error('Error from Branch: ' + error);
        return;
      }

      try {
        console.log(params, this.props);
        if (params['+clicked_branch_link'] && params['+match_guaranteed']) {
          servicesHandler(params, t);
        }
      } catch (err) {
        console.log('branchIO', err);
      }
      // params will never be null if error is null
    });
  };

  getHomeDataFromApi = async (showLoading = true) => {
    if (showLoading) {
      this.setState({
        apiFetching: true
      });
    }

    try {
      const response = await APIHandler.user_site_home();
      if (response && response.status == STATUS_SUCCESS) {
        if (response.data.vote_cart && response.data.vote_cart.site_id) {
          Actions.rating({
            cart_data: response.data.vote_cart
          });
        }
        action(() => {
          store.setStoreData(response.data.site);
        })();
        this.setState({
          site: response.data.site,
          sites: response.data.sites,
          newses: response.data.newses,
          notices: response.data.notices,
          services: response.data.services,
          campaigns: response.data.campaigns,
          products: response.data.products,
          promotions: response.data.promotions,
          listService: response.data.list_service,
          primaryActions: response.data.primary_actions,
          product_groups: response.data.product_groups
        });

        if (!this.homeDataLoaded) {
          this.homeDataLoaded = true;
          this.handleAddListenerOneSignal();
          this.handleSubcribeBranchIO();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState(
        {
          refreshing: false,
          apiFetching: false
        },
        executeJobs
      );
    }
  };

  handlePullToRefresh = () => {
    this.setState({ refreshing: true });

    setTimeout(() => {
      const showLoading = false;
      this.getHomeDataFromApi(showLoading);
    }, 1000);
  };

  handlePressedSurplusNext = () => {
    Actions.push(appConfig.routes.vndWallet, {
      title: store.user_info.default_wallet.name,
      wallet: store.user_info.default_wallet
    });
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

  handleCategoryPress(item) {
    Actions.push('tickidRadaListService', {
      category: item,
      title: item.name,
      onPressItem: item => {
        this.handleServicePress(item);
      },
      onPressCartImage: item => {
        this.handleCartImagePress(item);
      }
    });
  }

  handleOrderHistoryPress(item) {
    const { t } = this.props;
    Actions.push('tickidRadaOrderHistory', {
      category: item,
      title: t('common:screen.radaOrderHistory.mainTitle')
    });
  }

  handleServicePress(item) {
    Actions.push('tickidRadaServiceDetail', {
      service: item,
      title: item.name,
      onPressOrder: item => {
        this.handleOrderButtonPress(item);
      }
    });
  }

  handleCartImagePress(item) {
    this.handleOrderButtonPress(item);
  }

  handleOrderButtonPress(service) {
    Actions.push('tickidRadaBooking', {
      service: service,
      title: service.name || '',
      customerName: '',
      phone: '',
      address: '',
      onBookingSuccess: response => {
        this.handleBookingSuccess(response);
      },
      onBookingFail: err => {
        this.handleBookingFail(err);
      },
      onCallWebHookSuccess: response => {
        this.handleCallWebHookSuccess(response);
      },
      onCallWebHookFail: err => {
        this.handleCallWebHookFail(err);
      }
    });
  }

  handleBookingSuccess(response) {
    const { t } = this.props;
    return Alert.alert(
      t('booking.success.title'),
      t('booking.success.message'),
      [{ text: t('booking.success.accept'), onPress: () => Actions.homeTab() }],
      { cancelable: false }
    );
  }

  handleBookingFail(err) {
    const { t } = this.props;
    if (err && err.data) {
      if (err.data.customer.length != 0) {
        return Alert.alert(
          t('booking.fail.title'),
          err.data.customer[0],
          [{ text: t('booking.fail.accept') }],
          { cancelable: false }
        );
      } else {
        return Alert.alert(
          t('booking.fail.title'),
          err.message || '',
          [{ text: t('booking.fail.accept') }],
          { cancelable: false }
        );
      }
    } else if (err.message) {
      return Alert.alert(
        t('booking.fail.title'),
        err.message,
        [{ text: t('booking.fail.accept') }],
        {
          cancelable: false
        }
      );
    } else {
      return Alert.alert(
        t('booking.fail.title'),
        t('booking.fail.message'),
        [{ text: t('booking.fail.accept') }],
        { cancelable: false }
      );
    }
  }

  handleCallWebHookSuccess(response) {
    const { t } = this.props;
    return Alert.alert(
      t('web.success.title'),
      t('web.success.message'),
      [{ text: t('web.success.accept'), onPress: () => Actions.homeTab() }],
      { cancelable: false }
    );
  }

  handleCallWebHookFail(err) {
    const { t } = this.props;
    if (err && err.data) {
      if (err.data.customer.length != 0) {
        return Alert.alert(
          t('web.fail.title'),
          err.data.customer[0],
          [{ text: t('web.fail.accept') }],
          { cancelable: false }
        );
      } else {
        return Alert.alert(
          t('web.fail.title'),
          err.message || '',
          [{ text: t('web.fail.accept') }],
          { cancelable: false }
        );
      }
    } else if (err.message) {
      return Alert.alert(
        t('web.fail.title'),
        err.message,
        [{ text: t('web.fail.accept') }],
        {
          cancelable: false
        }
      );
    } else {
      return Alert.alert(
        t('web.fail.title'),
        t('web.fail.message'),
        [{ text: t('web.fail.accept') }],
        { cancelable: false }
      );
    }
  }

  handleShowAllVouchers = () => {};

  handlePressService = service => {
    const { t } = this.props;
    if (service.type === 'chat') {
      this.handlePressButtonChat(this.state.site);
    } else if (service.type === 'rada_service') {
      Actions.push('tickidRada', {
        service_type: service.type,
        service_id: service.id,
        title: t('common:screen.rada.mainTitle'),
        onPressItem: item => {
          this.handleCategoryPress(item);
        },
        onPressOrderHistory: item => {
          this.handleOrderHistoryPress(item);
        }
      });
    } else {
      servicesHandler(service, t);
    }
  };

  handleShowAllSites = () => {
    store.setSelectedTab(appConfig.routes.customerCardWallet);
    Actions.jump(appConfig.routes.customerCardWallet); //appConfig.routes.customerCardWallet
  };

  handleShowAllCampaigns = () => {
    Actions.push(appConfig.routes.mainVoucher, {
      from: 'home'
    });
  };

  handleShowAllNews = () => {
    Actions.jump(appConfig.routes.newsTab);
  };

  handlePressSiteItem = site => {
    action(() => {
      store.setStoreData(site);
      Actions.push(appConfig.routes.store, {
        title: site.name
        // goCategory: category_id
      });
    })();
  };

  handlePressCampaignItem = campaign => {
    Actions.push(appConfig.routes.voucherDetail, {
      title: campaign.title,
      campaignId: campaign.id,
      from: 'home'
    });
  };

  handlePressNewItem = item => {
    Actions.notify_item({
      title: item.title,
      data: item
    });
  };

  handlePressButtonChat = () => {
    if (store.user_info && this.state.site) {
      Actions.amazing_chat({
        titleStyle: { width: 220 },
        phoneNumber: this.state.site.tel,
        title: this.state.site.name,
        site_id: this.state.site.id,
        user_id: store.user_info.id
      });
    }
  };

  productOpening;

  handlePressProduct = product => {
    if (this.productOpening) return;
    this.productOpening = true;

    this.setState({
      showLoading: true
    });

    APIHandler.site_info(product.site_id)
      .then(response => {
        if (response && response.status == STATUS_SUCCESS) {
          action(() => {
            store.setStoreData(response.data);
            Actions.item({
              title: product.name,
              item: product
            });
          })();
        }
      })
      .finally(() => {
        this.productOpening = false;
        this.setState({
          showLoading: false
        });
      });
  };

  render() {
    return (
      <HomeComponent
        site={this.state.site}
        sites={this.state.sites}
        newses={this.state.newses}
        notices={this.state.notices}
        services={this.state.services}
        userInfo={store.user_info}
        notify={store.notify}
        products={this.state.products}
        campaigns={this.state.campaigns}
        promotions={this.state.promotions}
        listService={this.state.listService}
        primaryActions={this.state.primaryActions}
        apiFetching={this.state.apiFetching}
        onActionPress={this.handlePressService}
        onPressProduct={this.handlePressProduct}
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
        onPressNoti={this.handlePressButtonChat}
        refreshing={this.state.refreshing}
        product_groups={this.state.product_groups}
      />
    );
  }
}

export default withTranslation(['home', 'common'])(observer(Home));
