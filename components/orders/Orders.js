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
  ScrollView,
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

@observer
export default class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      refreshing: false,
      cart_check_list: {},
      loading: true,
      empty: false,
      finish: false,
      scrollTop: 0
    }

    this._getData = this._getData.bind(this);

    // refresh
    reaction(() => store.orders_key_change, this._getData);
  }

  componentDidMount() {
    this._getData();

    store.is_stay_orders = true;
    store.parentTab = '_orders';
  }

  componentWillReceiveProps() {
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
          scrollTop: top
        });
      }, 500);
    }
  }

  _scrollOverTopAndReload() {
    this.setState({
      refreshing: true
    }, () => {
      this._scrollToTop(-60);

      this._getData(1000);
    });
  }

  async _getData(delay, noScroll = false) {
    try {
      var response = await APIHandler.user_cart_list();

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {

          this.setState({
            data: response.data,
            refreshing: false,
            loading: false,
            empty: false,
            finish: true
          });

          if (!noScroll) {
            this._scrollToTop(0);
          }
        }, delay || 0);
      } else {

        setTimeout(() => {
          this.setState({
            loading: false,
            data: null,
            refreshing: false
          });
        }, delay || 0);
      }
    } catch (e) {
      console.warn(e + ' user_cart_list');

      return Alert.alert(
        'Thông báo',
        'Kết nối mạng bị lỗi',
        [
          {text: 'Thử lại', onPress: this._getData.bind(this, delay, noScroll)},
        ],
        { cancelable: false }
      );
    } finally {
      store.getNoitify();
    }
  }

  _closePopupConfirm() {
    if (this.refs_cancel_cart) {
      this.refs_cancel_cart.close();
    }
  }

  _onRefresh() {
    this.setState({
      refreshing: true
    }, this._getData.bind(this, 1000));
  }

  render() {

    var {loading, data} = this.state;

    if (loading) {
      return <Indicator />
    }

    return (
      <View style={styles.container}>

        {data != null ? (
          <ScrollView
            onScroll={(event) => {
              this.setState({
                scrollTop: event.nativeEvent.contentOffset.y
              });
            }}
            ref={ref => this.refs_orders = ref}
            // renderSectionHeader={({section}) => (
            //   <View style={styles.cart_section_box}>
            //     <Image style={styles.cart_section_image} source={{uri: section.image}} />
            //     <Text style={styles.cart_section_title}>{section.key}</Text>
            //   </View>
            // )}
            onEndReached={(num) => {

            }}
            onEndReachedThreshold={0}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }>
            <FlatList
              ItemSeparatorComponent={() => <View style={styles.separator}></View>}
              style={styles.items_box}
              data={this.state.data}
              extraData={this.state}
              renderItem={({item, index}) => {
                return(
                  <OrdersItemComponent
                    confirmCancelCart={this.confirmCancelCart.bind(this)}
                    confirmCoppyCart={this.confirmCoppyCart.bind(this)}
                    confirmEditCart={this.confirmEditCart.bind(this)}
                    item={item}
                    />
                );
              }}
              keyExtractor={item => item.id}
            />
          </ScrollView>
        ) : (
          <View style={styles.empty_box}>
            <Icon name="shopping-basket" size={32} color={hexToRgbA(DEFAULT_COLOR, 0.6)} />
            <Text style={styles.empty_box_title}>Chưa có đơn hàng nào</Text>

            <TouchableHighlight
              onPress={() => {
                Actions._home({type: ActionConst.REFRESH});
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

        return Alert.alert(
          'Thông báo',
          'Kết nối mạng bị lỗi',
          [
            {text: 'Thử lại', onPress: this._coppyCart.bind(this)},
          ],
          { cancelable: false }
        );
      } finally {

      }
    }

    this._closePopupCoppy();
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

        return Alert.alert(
          'Thông báo',
          'Kết nối mạng bị lỗi',
          [
            {text: 'Thử lại', onPress: this._editCart.bind(this)},
          ],
          { cancelable: false }
        );
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

  _closePopupCoppy() {
    if (this.refs_coppy_cart) {
      this.refs_coppy_cart.close();
    }
  }

  async _cancelCart() {
    if (this.item_cancel) {

      try {
        var response = await APIHandler.site_cart_cancel(this.item_cancel.site_id, this.item_cancel.id);

        if (response && response.status == STATUS_SUCCESS) {
          this._getData(450, true);
        }
      } catch (e) {
        console.warn(e + ' site_cart_cancel');

        return Alert.alert(
          'Thông báo',
          'Kết nối mạng bị lỗi',
          [
            {text: 'Thử lại', onPress: this._cancelCart.bind(this)},
          ],
          { cancelable: false }
        );
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN
  },
  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8,
    paddingTop: isAndroid ? 4 : 0
  },
  right_btn_box: {
    flexDirection: 'row'
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
    borderRadius: 8
  },
  stores_info_action_notify_value: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600'
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
