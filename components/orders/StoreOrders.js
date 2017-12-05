/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import { CheckBox } from '../../lib/react-native-elements';
import store from '../../store/Store';
import {reaction} from 'mobx';

// components
import ListHeader from '../stores/ListHeader';
import PopupConfirm from '../PopupConfirm';
import OrdersItemComponent from './OrdersItemComponent';
import RightButtonChat from '../RightButtonChat';
import RightButtonCall from '../RightButtonCall';

@observer
export default class StoreOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      refreshing: false,
      cart_check_list: {},
      loading: true,
      store_id: props.store_id || store.store_id,
      title: props.title || store.store_data.name
    }

    this._getData = this._getData.bind(this);
  }

  componentDidMount() {

    Actions.refresh({
      title: this.state.title,
      renderRightButton: this._renderRightButton.bind(this),
      onBack: () => {
        this._unMount();

        Actions.pop();
      }
    });

    this.start_time = time();

    // get data on this screen
    this._getData();

    // callback when unmount this sreen
    store.setStoreUnMount('StoreOrders', this._unMount);

    // Listenner
    Events.on(RELOAD_STORE_ORDERS, RELOAD_STORE_ORDERS + 'ID', this._getData);

    // notify chat
    store.getNoitifyChat();
  }

  _unMount() {
    Events.removeAll(RELOAD_STORE_ORDERS);
  }

  async _getData(delay) {
    try {
      var response = await APIHandler.site_cart_list(this.state.store_id);

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          this.setState({
            data: response.data,
            refreshing: false,
            loading: false
          });
        }, delay || this._delay());
      } else {
        this.setState({
          loading: false
        });
      }
    } catch (e) {
      console.warn(e + ' site_cart_list');

      store.addApiQueue('site_cart_list', this._getData.bind(this, delay));
    } finally {

    }
  }

  // thời gian trễ khi chuyển màn hình
  _delay() {
    var delay = 400 - (Math.abs(time() - this.start_time));
    return delay;
  }

  _onRefresh() {
    this.setState({refreshing: true});

    this._getData(1000);
  }

  _renderRightButton() {
    return(
      <View style={styles.right_btn_box}>
        <RightButtonCall
          tel={this.props.tel}
        />

        <RightButtonChat
          title={this.state.title || undefined}
          store_id={this.state.store_id || undefined}
          tel={this.props.tel}
         />
      </View>
    );
  }

  render() {
    var {loading, data} = this.state;

    if (loading) {
      return <Indicator />
    }

    return (
      <View style={styles.container}>

        {data != null ? (
          <FlatList
            // renderSectionHeader={({section}) => (
            //   <View style={styles.cart_section_box}>
            //     <CachedImage mutable style={styles.cart_section_image} source={{uri: section.image}} />
            //     <Text style={styles.cart_section_title}>{section.key}</Text>
            //   </View>
            // )}
            onEndReached={(num) => {

            }}
            ItemSeparatorComponent={() => <View style={styles.separator}></View>}
            onEndReachedThreshold={0}
            style={styles.items_box}
            data={this.state.data}
            extraData={this.state}
            renderItem={({item, index}) => {
              return(
                <OrdersItemComponent
                  confirmCancelCart={this.confirmCancelCart.bind(this)}
                  confirmCoppyCart={this.confirmCoppyCart.bind(this)}
                  confirmEditCart={this.confirmEditCart.bind(this)}
                  hideContinue={this.props.hideContinue}
                  item={item}
                  from_page="store_orders"
                  goStore={this.props.goStore}
                  />
              );
            }}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          />
        ) : (
          <View style={styles.empty_box}>
            <Icon name="shopping-basket" size={32} color={hexToRgbA(DEFAULT_COLOR, 0.6)} />
            <Text style={styles.empty_box_title}>Chưa có đơn hàng nào</Text>

            <TouchableHighlight
              onPress={() => {
                if (this.props.goStores) {
                  return this.props.goStores();
                }
                Actions.pop();
              }}
              underlayColor="transparent">
              <View style={styles.empty_box_btn}>
                <Text style={styles.empty_box_btn_title}>Mua sắm ngay</Text>
              </View>
            </TouchableHighlight>
          </View>
        )}

        <PopupConfirm
          ref_popup={ref => this.refs_cancel_cart = ref}
          title="Huỷ bỏ đơn hàng này, bạn đã chắc chắn chưa?"
          height={110}
          noConfirm={this._closePopupConfirm.bind(this)}
          yesConfirm={this._cancelCart.bind(this)}
          otherClose={false}
          />

        <PopupConfirm
          ref_popup={ref => this.refs_coppy_cart = ref}
          title="Giỏ hàng đang mua (nếu có) sẽ bị xoá! Bạn vẫn muốn sao chép đơn hàng này?"
          height={110}
          noConfirm={this._closePopupCoppy.bind(this)}
          yesConfirm={this._coppyCart.bind(this)}
          otherClose={false}
          />

        <PopupConfirm
          ref_popup={ref => this.refs_edit_cart = ref}
          title="Giỏ hàng đang mua (nếu có) sẽ bị xoá! Bạn vẫn muốn sửa đơn hàng này?"
          height={110}
          noConfirm={this._closePopupEdit.bind(this)}
          yesConfirm={this._editCart.bind(this)}
          otherClose={false}
          />
      </View>
    );
  }

  _closePopupConfirm() {
    if (this.refs_cancel_cart) {
      this.refs_cancel_cart.close();
    }
  }

  async _cancelCart() {
    if (this.item_cancel) {

      try {
        var response = await APIHandler.site_cart_cancel(store.store_id, this.item_cancel.id);

        if (response && response.status == STATUS_SUCCESS) {
          this._getData(450);

          setTimeout(() => {
            action(() => {
              store.setOrdersKeyChange(store.orders_key_change + 1);
            })();
          }, 450);
        }
      } catch (e) {
        console.warn(e + ' site_cart_cancel');

        store.addApiQueue('site_cart_cancel', this._cancelCart.bind(this));
      } finally {

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

  async _coppyCart() {
    if (this.item_coppy) {
      try {
        var response = await APIHandler.site_cart_reorder(this.item_coppy.site_id, this.item_coppy.id);
        if (response && response.status == STATUS_SUCCESS) {
          action(() => {
            store.setCartData(response.data);
          })();

          this._getData();

          Toast.show(response.message);
        }
      } catch (e) {
        console.warn(e + ' site_cart_reorder');

        store.addApiQueue('site_cart_reorder', this._coppyCart.bind(this));
      } finally {

      }
    }

    this._closePopupCoppy();
  }

  _closePopupCoppy() {
    if (this.refs_coppy_cart) {
      this.refs_coppy_cart.close();
    }
  }

  confirmCoppyCart(item) {
    this.item_coppy = item;

    if (this.refs_coppy_cart) {
      this.refs_coppy_cart.open();
    }
  }

  async _editCart() {
    if (this.item_edit) {
      try {
        var response = await APIHandler.site_cart_edit(this.item_edit.site_id, this.item_edit.id);
        if (response && response.status == STATUS_SUCCESS) {
          action(() => {
            store.setCartData(response.data);
          })();

          this._getData();


        }
      } catch (e) {
        console.warn(e + ' site_cart_edit');

        store.addApiQueue('site_cart_edit', this._editCart.bind(this));
      } finally {

      }
    }

    this._closePopupEdit();
  }

  _closePopupEdit() {
    if (this.refs_edit_cart) {
      this.refs_edit_cart.close();
    }
  }

  confirmEditCart(item) {
    this.item_edit = item;

    if (this.refs_edit_cart) {
      this.refs_edit_cart.open();
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0
  },
  right_btn_box: {
    flexDirection: 'row'
  },

  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#dddddd",
  },

  empty_box: {
    alignItems: 'center',
    marginTop: "50%"
  },
  empty_box_title: {
    fontSize: 12,
    marginTop: 8,
    color: "#404040"
  },
  empty_box_btn: {
    borderWidth: Util.pixel,
    borderColor: DEFAULT_COLOR,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
    borderRadius: 5,
    backgroundColor: DEFAULT_COLOR
  },
  empty_box_btn_title: {
    color: "#ffffff"
  }

});
