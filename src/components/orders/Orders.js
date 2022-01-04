import React, {Component} from 'react';
import {StyleSheet, StatusBar} from 'react-native';
// 3-party libs
import {reaction} from 'mobx';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// network
import APIHandler from 'src/network/APIHandler';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {push, jump} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, ButtonRoundedType} from 'src/components/base';
// custom components
import {
  FlatList,
  AppFilledButton,
  ScreenWrapper,
  RefreshControl,
} from 'src/components/base';
import OrdersItemComponent from './OrdersItemComponent';
import NoResult from '../NoResult';
import Indicator from '../Indicator';

class Orders extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      data: null,
      refreshing: false,
      cart_check_list: {},
      loading: true,
      empty: false,
      finish: false,
      scrollTop: 0,
    };

    this._getData = this._getData.bind(this);
    this.unmounted = false;
    this.autoUpdateDisposer = null;

    // refresh
    reaction(() => store.orders_key_change, this._getData);
    this.eventTracker = new EventTracker();

    this.updateNavBarDisposer = () => {};
  }

  get theme() {
    getTheme(this);
  }

  componentDidMount() {
    this._getData();

    store.is_stay_orders = true;
    store.parentTab = `${appConfig.routes.newsTab}_1`;
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();
    this.autoUpdateDisposer && this.autoUpdateDisposer();

    this.updateNavBarDisposer();
  }

  UNSAFE_componentWillReceiveProps() {
    store.parentTab = '_orders';

    if (this.state.finish && store.is_stay_orders) {
      if (this.state.scrollTop == 0) {
        this._scrollOverTopAndReload();
      } else {
        this._scrollToTop(0);
      }
    }
    if (!store.is_stay_orders) {
      this._getData(0, true);
    }

    store.is_stay_orders = true;
  }

  _scrollToTop(top = 0) {
    if (this.refs_orders) {
      this.refs_orders.scrollTo({x: 0, y: top, animated: true});

      clearTimeout(this._scrollTimer);
      this._scrollTimer = setTimeout(() => {
        if (this.unmounted) return;

        this.setState({
          scrollTop: top,
        });
      }, 500);
    }
  }

  _scrollOverTopAndReload() {
    if (this.unmounted) return;

    this.setState(
      {
        refreshing: true,
      },
      () => {
        this._scrollToTop(-60);

        this._getData(1000);
      },
    );
  }

  async _getData(delay, noScroll = false) {
    const {t} = this.props;

    appConfig.device.isIOS &&
      StatusBar.setNetworkActivityIndicatorVisible(true);
    try {
      const response = await APIHandler.user_cart_list();
      if (this.unmounted) return;

      if (response && response.status == STATUS_SUCCESS) {
        if (store.deep_link_data) {
          const item = response.data.find(
            (order) => order.id === store.deep_link_data.id,
          );
          if (item) {
            store.setStoreData(item.site);
            push(
              appConfig.routes.ordersDetail,
              {
                data: item,
                title: `#${item.cart_code}`,
                tel: item.tel,
              },
              this.theme,
            );
          } else {
            flashShowMessage({
              type: 'danger',
              message: t('getOrders.error.notFoundMessage'),
            });
          }
        }

        // setTimeout(() => {
        this.setState({
          data: response.data,
          empty: false,
          finish: true,
        });

        if (!noScroll) {
          this._scrollToTop(0);
        }
        // }, delay || 0);
      } else {
        setTimeout(() => {
          this.setState({
            data: null,
          });
        }, delay || 0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      store.setUpdateOrders(false);
      store.getNotify();
      store.setDeepLinkData(null);

      appConfig.device.isIOS &&
        StatusBar.setNetworkActivityIndicatorVisible(false);

      if (this.unmounted) return;

      this.setState({
        loading: false,
        refreshing: false,
      });

      !this.autoUpdateDisposer && this.forceUpdateOrders();
    }
  }

  _closePopupConfirm() {
    if (this.refs_cancel_cart) {
      this.refs_cancel_cart.close();
    }
  }

  async _coppyCart() {
    if (this.item_coppy) {
      try {
        var response = await APIHandler.site_cart_reorder(
          this.item_coppy.site_id,
          this.item_coppy.id,
        );
        if (response && response.status == STATUS_SUCCESS) {
          action(() => {
            store.setCartData(response.data);
          })();

          this._getData();

          flashShowMessage({
            type: 'success',
            message: response.message,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    this._closePopupCoppy();
  }

  async _editCart() {
    const {t} = this.props;
    if (this.item_edit) {
      try {
        const response = await APIHandler.site_cart_update_ordering(
          this.item_edit.site_id,
          this.item_edit.id,
        );

        if (!this.unmounted) {
          if (response && response.status == STATUS_SUCCESS) {
            store.setCartData(response.data);
            flashShowMessage({
              type: 'success',
              message: response.message,
            });

            this._getData();
          } else {
            flashShowMessage({
              type: 'danger',
              message: response.message || t('common:api.error.message'),
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    this._closePopupEdit();
  }

  _closePopupEdit() {
    if (this.refs_edit_cart) {
      this.refs_edit_cart.close();
    }
  }

  _closePopupCoppy() {
    if (this.refs_coppy_cart) {
      this.refs_coppy_cart.close();
    }
  }

  async _cancelCart() {
    const {t} = this.props;
    if (this.item_cancel) {
      try {
        const response = await APIHandler.site_cart_canceling(
          this.item_cancel.site_id,
          this.item_cancel.id,
        );
        if (!this.unmounted) {
          if (response && response.status == STATUS_SUCCESS) {
            this._getData(450, true);
            flashShowMessage({
              type: 'success',
              message: response.message,
            });
          } else {
            flashShowMessage({
              type: 'danger',
              message: response.message || t('common:api.error.message'),
            });
          }
        }
      } catch (error) {
        console.log(error);
        flashShowMessage({
          type: 'danger',
          message: t('common:api.error.message'),
        });
      }
    }

    this._closePopupConfirm();
  }

  confirmCancelCart(item) {
    this.item_cancel = item;

    if (this.refs_cancel_cart) {
      this.refs_cancel_cart.open();
    }
  }

  confirmCoppyCart(item) {
    this.item_coppy = item;

    if (this.refs_coppy_cart) {
      this.refs_coppy_cart.open();
    }
  }

  confirmEditCart(item) {
    this.item_edit = item;

    if (this.refs_edit_cart) {
      this.refs_edit_cart.open();
    }
  }

  _onRefresh() {
    this.setState(
      {
        refreshing: true,
      },
      this._getData.bind(this, 1000),
    );
  }

  forceUpdateOrders() {
    if (this.autoUpdateDisposer) return;

    this.autoUpdateDisposer = reaction(
      () => store.isUpdateOrders,
      (isUpdateOrders) => {
        if (isUpdateOrders && !this.state.refreshing) {
          setTimeout(() => this._getData(0, true));
        }
      },
    );
  }

  goToStore() {
    jump(appConfig.routes.homeTab);
  }

  renderFooterEmptyComponent = () => {
    return (
      <AppFilledButton
        rounded={ButtonRoundedType.EXTRA_SMALL}
        onPress={this.goToStore.bind(this)}
        style={styles.empty_box_btn}
        titleStyle={styles.empty_box_btn_title}>
        {this.props.t('encourageMessage')}
      </AppFilledButton>
    );
  };

  ListEmptyComponent() {
    return (
      <NoResult
        iconBundle={BundleIconSetName.FONT_AWESOME}
        iconName="shopping-basket"
        message={this.props.t('emptyMessage')}
        renderFooterComponent={this.renderFooterEmptyComponent}
      />
    );
  }

  renderItem({item, index}) {
    return (
      <OrdersItemComponent
        confirmCancelCart={this.confirmCancelCart.bind(this)}
        confirmCoppyCart={this.confirmCoppyCart.bind(this)}
        confirmEditCart={this.confirmEditCart.bind(this)}
        item={item}
        index={index}
      />
    );
  }

  render() {
    const {loading, data} = this.state;
    if (loading) {
      return (
        <ScreenWrapper>
          <Indicator />
        </ScreenWrapper>
      );
    }

    return (
      <ScreenWrapper>
        <FlatList
          safeLayout
          scrollIndicatorInsets={{right: 0.01}}
          style={styles.items_box}
          data={data || []}
          extraData={this.state}
          ListEmptyComponent={this.ListEmptyComponent.bind(this)}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  items_box: {
    flex: 1,
  },
  empty_box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty_box_btn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 30,
  },
  empty_box_btn_title: {},
  iconShoppingBasket: {
    fontSize: 32,
  },
});

export default withTranslation(['orders', 'common'])(observer(Orders));
