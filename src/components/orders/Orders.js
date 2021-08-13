import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import {reaction} from 'mobx';
import appConfig from 'app-config';
import store from '../../store/Store';
import PopupConfirm from '../PopupConfirm';
import {Actions} from 'react-native-router-flux';
import OrdersItemComponent from './OrdersItemComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import EventTracker from '../../helper/EventTracker';
import {StatusBar} from 'react-native';

class Orders extends Component {
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
  }

  componentDidMount() {
    this._getData();

    store.is_stay_orders = true;
    store.parentTab = `${appConfig.routes.newsTab}_1`;
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();
    this.autoUpdateDisposer && this.autoUpdateDisposer();
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
        this.setState({
          scrollTop: top,
        });
      }, 500);
    }
  }

  _scrollOverTopAndReload() {
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
      if (response && response.status == STATUS_SUCCESS) {
        if (store.deep_link_data) {
          const item = response.data.find(
            (order) => order.id === store.deep_link_data.id,
          );
          if (item) {
            store.setStoreData(item.site);
            Actions.orders_item({
              data: item,
              title: `#${item.cart_code}`,
              tel: item.tel,
            });
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
    if(this.autoUpdateDisposer) return;

    this.autoUpdateDisposer = reaction(
      () => store.isUpdateOrders,
      (isUpdateOrders) => {
        if (isUpdateOrders && !this.state.refreshing) {
          setTimeout(() => this._getData(0, true));
        }
      },
    );
  }

  render() {
    const {loading, data} = this.state;
    const {t} = this.props;

    if (loading) {
      return <Indicator />;
    }

    return (
      <View style={styles.container}>
        <FlatList
          scrollIndicatorInsets={{right: 0.01}}
          style={styles.items_box}
          contentContainerStyle={{flexGrow: 1, paddingBottom: appConfig.device.bottomSpace}}
          data={data || []}
          extraData={this.state}
          // ItemSeparatorComponent={() => <View style={styles.separator}></View>}
          ListEmptyComponent={
            <View style={styles.empty_box}>
              <Icon
                name="shopping-basket"
                size={32}
                color={hexToRgbA(appConfig.colors.primary, 0.6)}
              />
              <Text style={styles.empty_box_title}>{t('emptyMessage')}</Text>

              <TouchableHighlight
                onPress={() => {
                  Actions.jump(appConfig.routes.homeTab);
                }}
                underlayColor="transparent">
                <View style={styles.empty_box_btn}>
                  <Text style={styles.empty_box_btn_title}>
                    {t('encourageMessage')}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          }
          renderItem={({item, index}) => {
            return (
              <OrdersItemComponent
                confirmCancelCart={this.confirmCancelCart.bind(this)}
                confirmCoppyCart={this.confirmCoppyCart.bind(this)}
                confirmEditCart={this.confirmEditCart.bind(this)}
                item={item}
                index={index}
              />
            );
          }}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />

        <PopupConfirm
          ref_popup={(ref) => (this.refs_cancel_cart = ref)}
          title="Huỷ bỏ đơn hàng này, bạn đã chắc chắn chưa?"
          height={110}
          noConfirm={this._closePopupConfirm.bind(this)}
          yesConfirm={this._cancelCart.bind(this)}
          otherClose={false}
        />

        <PopupConfirm
          ref_popup={(ref) => (this.refs_coppy_cart = ref)}
          title="Giỏ hàng đang mua (nếu có) sẽ bị xoá! Bạn vẫn muốn sao chép đơn hàng này?"
          height={110}
          noConfirm={this._closePopupCoppy.bind(this)}
          yesConfirm={this._coppyCart.bind(this)}
          otherClose={false}
        />

        <PopupConfirm
          ref_popup={(ref) => (this.refs_edit_cart = ref)}
          title="Giỏ hàng đang mua (nếu có) sẽ bị xoá! Bạn vẫn muốn sửa đơn hàng này?"
          height={110}
          noConfirm={this._closePopupEdit.bind(this)}
          yesConfirm={this._editCart.bind(this)}
          otherClose={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8,
    paddingTop: isAndroid ? 4 : 0,
  },
  right_btn_box: {
    flexDirection: 'row',
  },
  stores_info_action_notify: {
    position: 'absolute',
    minWidth: 16,
    paddingHorizontal: 2,
    height: 16,
    backgroundColor: 'red',
    top: isAndroid ? 0 : -4,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8,
  },
  stores_info_action_notify_value: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },

  separator: {
    width: '100%',
    height: appConfig.device.pixel,
    backgroundColor: '#dddddd',
  },
  items_box: {
    flex: 1,
  },
  empty_box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 200,
  },
  empty_box_title: {
    fontSize: 12,
    marginTop: 8,
    color: '#404040',
  },
  empty_box_btn: {
    borderWidth: appConfig.device.pixel,
    borderColor: appConfig.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
    borderRadius: 5,
    backgroundColor: appConfig.colors.primary,
  },
  empty_box_btn_title: {
    color: '#ffffff',
  },
});

export default withTranslation(['orders', 'common'])(observer(Orders));
