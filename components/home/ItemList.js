/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  Alert
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import store from '../../store/Store';

@observer
export default class ItemList extends Component {

  // tới màn hình store
  _goStores(item) {
    action(() => {
      store.setStoreData(item);
    })();

    Actions.stores({
      title: item.name
    });
  }

  // tới màn hình giỏ hàng
  _goCart(item) {
    action(() => {
      store.setStoreData(item);

      Actions.store_orders({
        goStores: () => {
          Actions.stores({
            title: item.name,
            type: ActionConst.REPLACE
          });
        },
        tel: item.tel,
        goStore: true
      });
    })();
  }

  // tới màn hình chat
  _goChat(item) {
    action(() => {
      store.setStoreData(item);
    })();

    Actions.chat({
      tel: item.tel
    });
  }

  _showOptions(item) {
    // Works on both iOS and Android
    Alert.alert(
      item.name,
      null,
      [
        {text: 'Huỷ', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Xoá cửa hàng', onPress: this._removeStore.bind(this, item), style: 'destructive'}
      ],
      { cancelable: false }
    );
  }

  _removeStore(item) {
    Alert.alert(
      'Xoá cửa hàng',
      'Bạn sẽ không nhận được thông báo khuyến mãi từ cửa hàng này nữa.',
      [
        {text: 'Huỷ', onPress: () => false, style: 'cancel'},
        {text: 'Xoá cửa hàng', onPress: () => {

          this._removeStoreTrue(item);

        }, style: 'destructive'}
      ],
      { cancelable: false }
    );
  }

  async _removeStoreTrue(item) {
    try {
      var response = await APIHandler.user_remove_site(item.site_code);

      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          store.setRefreshHomeChange(store.refresh_home_change + 1);
        })();

        Events.trigger(KEY_EVENTS_STORE);
      }
    } catch (e) {
      console.warn(e + ' user_remove_site');

      return Alert.alert(
        'Thông báo',
        'Kết nối mạng bị lỗi',
        [
          {text: 'Thử lại', onPress: this._removeStoreTrue.bind(this, item)},
        ],
        { cancelable: false }
      );
    } finally {

    }
  }

  render() {

    var {item} = this.props;

    var count_chat = parseInt(store.notify_chat[item.id]);

    var is_chat_active = count_chat > 0;
    var is_orders_active = item.count_cart > 0;

    return (
      <TouchableHighlight
        underlayColor="transparent"
        onLongPress={this._showOptions.bind(this, item)}
        onPress={this._goStores.bind(this, item)}>

        <View style={[styles.store_result_item, styles.store_result_item_active, {
          borderTopWidth: this.props.index > 0 ? Util.pixel : 0
        }]}>
          <View style={styles.store_result_item_image_box}>
            <Image style={styles.store_result_item_image} source={{uri: item.logo_url}} />
          </View>

          <View style={styles.store_result_item_content}>
            <View style={styles.store_result_item_content_box}>
              <Text style={styles.store_result_item_title}>{item.name}</Text>
              <Text style={styles.store_result_item_desc}>{item.address}</Text>

              <View style={styles.store_result_item_add_box}>
                <TouchableHighlight
                  onPress={this._goChat.bind(this, item)}
                  underlayColor="transparent">
                  <View style={[styles.add_btn_icon_box, is_chat_active && styles.add_btn_icon_box_active]}>
                    <Icon name="comments" size={14} color={is_chat_active ? "#ffffff" : DEFAULT_COLOR} />
                    <Text style={[styles.add_btn_label, is_chat_active && styles.add_btn_label_active]}>Chat</Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  onPress={this._goCart.bind(this, item)}
                  underlayColor="transparent">
                  <View style={[
                    styles.add_btn_icon_box,
                    is_orders_active && styles.add_btn_icon_box_active,
                    {marginRight: 15}
                  ]}>
                    <Icon name="shopping-cart" size={14} color={is_orders_active ? "#ffffff" : DEFAULT_COLOR} />
                    <Text style={[styles.add_btn_label, is_orders_active && styles.add_btn_label_active]}>Đơn hàng</Text>
                  </View>
                </TouchableHighlight>
              </View>

              {is_orders_active > 0 && <View style={styles.stores_info_action_notify}><Text style={styles.stores_info_action_notify_value}>{item.count_cart}</Text></View>}
              {is_chat_active > 0 && <View style={[styles.stores_info_action_notify, styles.stores_info_action_notify_chat]}><Text style={styles.stores_info_action_notify_value}>{count_chat}</Text></View>}
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

ItemList.PropTypes = {
  item: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  stores_result_box: {
    marginTop: 8,
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  store_result_item: {
    backgroundColor: "#ffffff",
    paddingVertical: 4,
    paddingLeft: 15,
    flexDirection: 'row',
    minHeight: 104,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd",
    marginBottom: 8
  },
  store_result_item_active: {
    // backgroundColor: "#ebebeb"
  },
  store_result_item_image_box: {
    backgroundColor: "#ebebeb",
    width: 60,
    height: 60,
    marginTop: 8
  },
  store_result_item_image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 2
  },
  store_result_item_content: {
    flex: 1
  },
  store_result_item_content_box: {
    flex: 1,
    paddingLeft: 15
  },
  store_result_item_title: {
    fontSize: 14,
    color: "#000000",
    fontWeight: '500',
    lineHeight: isIOS ? 16 : 18,
    marginTop: 8
  },
  store_result_item_desc: {
    marginTop: 4,
    color: "#404040",
    fontSize: 12,
    lineHeight: isIOS ? 16 : 18,
    paddingRight: 15
  },
  store_result_item_time: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 4
  },
  store_result_item_add_box: {
    position: 'absolute',
    bottom: 4,
    right: 0,
    flexDirection: 'row'
  },
  add_btn_icon_box: {
    borderWidth: Util.pixel,
    borderColor: DEFAULT_COLOR,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 8
  },
  add_btn_icon_box_active: {
    backgroundColor: DEFAULT_COLOR
  },
  add_btn_icon: {
    color: DEFAULT_COLOR,
    fontSize: 14,
    marginTop: -2
  },
  add_btn_label: {
    color: DEFAULT_COLOR,
    fontSize: 14,
    marginLeft: 4
  },
  add_btn_label_active: {
    color: "#ffffff"
  },

  stores_info_action_notify: {
    position: 'absolute',
    minWidth: 16,
    paddingHorizontal: 2,
    height: 16,
    backgroundColor: 'red',
    bottom: 22,
    right: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8
  },
  stores_info_action_notify_chat: {
    right: isIOS ? 118 : 114
  },
  stores_info_action_notify_value: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600'
  }
});
