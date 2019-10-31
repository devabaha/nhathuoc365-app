import React, { Component } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import store from 'app-store';
import appConfig from 'app-config';
import { Actions } from 'react-native-router-flux';
import Communications from 'react-native-communications';
import HomeComponent from '../../components/Home';

@observer
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
      primaryActions: []
    };
  }

  componentDidMount() {
    this.getHomeDataFromApi();
  }

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
          primaryActions: response.data.primary_actions
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        refreshing: false,
        apiFetching: false
      });
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
    Actions.vnd_wallet({
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
    return Alert.alert(
      'Thông báo',
      'Bạn đã đặt dịch vụ thành công!',
      [{ text: 'Đồng ý', onPress: () => Actions.homeTab() }],
      { cancelable: false }
    );
  }

  handleBookingFail(err) {
    if (err && err.data) {
      if (err.data.customer.length != 0) {
        return Alert.alert(
          'Thông báo',
          err.data.customer[0],
          [{ text: 'Đồng ý' }],
          { cancelable: false }
        );
      } else {
        return Alert.alert(
          'Thông báo',
          err.message || '',
          [{ text: 'Đồng ý' }],
          { cancelable: false }
        );
      }
    } else if (err.message) {
      return Alert.alert('Thông báo', err.message, [{ text: 'Đồng ý' }], {
        cancelable: false
      });
    } else {
      return Alert.alert(
        'Thông báo',
        'Có lỗi xảy ra, vui lòng thử lại',
        [{ text: 'Đồng ý' }],
        { cancelable: false }
      );
    }
  }

  handleCallWebHookSuccess(response) {
    return Alert.alert(
      'Thông báo',
      'Bạn đã đặt dịch vụ thành công!',
      [{ text: 'Đồng ý', onPress: () => Actions.homeTab() }],
      { cancelable: false }
    );
  }

  handleCallWebHookFail(err) {
    if (err && err.data) {
      if (err.data.customer.length != 0) {
        return Alert.alert(
          'Thông báo',
          err.data.customer[0],
          [{ text: 'Đồng ý' }],
          { cancelable: false }
        );
      } else {
        return Alert.alert(
          'Thông báo',
          err.message || '',
          [{ text: 'Đồng ý' }],
          { cancelable: false }
        );
      }
    } else if (err.message) {
      return Alert.alert('Thông báo', err.message, [{ text: 'Đồng ý' }], {
        cancelable: false
      });
    } else {
      return Alert.alert(
        'Thông báo',
        'Có lỗi xảy ra, vui lòng thử lại',
        [{ text: 'Đồng ý' }],
        { cancelable: false }
      );
    }
  }

  handleShowAllVouchers = () => {};

  handlePressAction = action => {
    switch (action.type) {
      case 'ACCUMULATE_POINTS_TYPE':
        Actions.push(appConfig.routes.qrBarCode, {
          title: 'Mã tài khoản'
        });
        break;
      case 'MY_VOUCHER_TYPE':
        Actions.push(appConfig.routes.myVoucher, {
          title: 'Voucher của tôi'
        });
        break;
      case 'TRANSACTION_TYPE':
        Actions.vnd_wallet({
          title: store.user_info.default_wallet.name,
          wallet: store.user_info.default_wallet
        });
        break;
      case 'ORDERS_TYPE':
        Actions.jump(appConfig.routes.ordersTab);
        break;
      case 'QRCODE_SCAN_TYPE':
        Actions.push(appConfig.routes.qrBarCode, {
          index: 1,
          title: 'Quét QR Code',
          wallet: store.user_info.default_wallet
        });
        break;
    }
  };

  shopOpening;

  handlePressService = service => {
    switch (service.type) {
      case 'qrscan':
        Actions.push(appConfig.routes.qrBarCode, {
          index: 1,
          title: 'Quét QR Code',
          wallet: store.user_info.default_wallet
        });
        break;
      case 'up_to_phone':
        Actions.push(appConfig.routes.upToPhone, {
          service_type: service.type,
          service_id: service.id
        });
        break;
      case 'list_voucher':
        Actions.push(appConfig.routes.mainVoucher);
        break;
      case 'rada_service':
        Actions.push('tickidRada', {
          service_type: service.type,
          service_id: service.id,
          title: 'Dịch vụ Rada',
          onPressItem: item => {
            this.handleCategoryPress(item);
          }
        });
        break;
      case '30day_service':
        Alert.alert(
          'Thông báo',
          'Chức năng đặt lịch giữ chỗ 30DAY tới các cửa hàng đang được phát triển.',
          [{ text: 'Đồng ý' }]
        );
        break;
      case 'my_voucher':
        Actions.push(appConfig.routes.myVoucher);
        break;
      case 'my_address':
        Actions.push(appConfig.routes.myAddress, {
          from_page: 'account'
        });
        break;
      case 'news':
        Actions.jump(appConfig.routes.newsTab);
        break;
      case 'orders':
        Actions.jump(appConfig.routes.ordersTab);
        break;
      case 'chat':
        this.handlePressButtonChat(this.state.site);
        break;
      case 'open_shop':
        if (this.shopOpening) return;
        this.setState({
          showLoading: true
        });
        APIHandler.site_info(service.siteId)
          .then(response => {
            if (response && response.status == STATUS_SUCCESS) {
              action(() => {
                store.setStoreData(response.data);
                Actions.push(appConfig.routes.store, {
                  title: service.name || response.data.name,
                  categoryId: service.categoryId || 0
                });
              })();
            }
          })
          .finally(() => {
            this.shopOpening = false;
            this.setState({
              showLoading: false
            });
          });
        break;
      case 'call':
        Communications.phonecall(service.tel, true);
        break;
      case 'news_category':
        Actions.push(appConfig.routes.notifies, {
          title: service.title,
          news_type: `/${service.categoryId}`
        });
        break;
    }
  };

  handleShowAllSites = () => {};

  handleShowAllCampaigns = () => {
    Actions.push(appConfig.routes.mainVoucher);
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
      campaignId: campaign.id
    });
  };

  handlePressNewItem = item => {
    Actions.notify_item({
      title: item.title,
      data: item
    });
  };

  handlePressButtonChat = () => {
    action(() => {
      store.setStoreData(this.state.site);
    })();

    Actions.chat({
      tel: this.state.site.tel,
      title: this.state.site.name
    });
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
        onActionPress={this.handlePressAction}
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
        onPressButtonChat={this.handlePressButtonChat}
        refreshing={this.state.refreshing}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  }
});

export default Home;
