/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import store from '../../store/Store';

@observer
export default class ItemList extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

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

      Actions.store_orders();
    })();
  }

  // tới màn hình chat
  _goChat(item) {
    action(() => {
      store.setStoreData(item);
    })();

    Actions.chat();
  }

  render() {

    var {item} = this.props;

    var is_chat_active = item.count_chat > 0;
    var is_orders_active = item.count_cart > 0;

    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={this._goStores.bind(this, item)}>

        <View style={[styles.store_result_item, styles.store_result_item_active]}>
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
                  <Icon name="commenting" size={14} color={is_chat_active ? "#ffffff" : DEFAULT_COLOR} />
                  <Text style={[styles.add_btn_label, is_chat_active && styles.add_btn_label_active]}>Tin nhắn{is_chat_active && ` (${item.count_chat})`}</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={this._goCart.bind(this, item)}
                underlayColor="transparent">
                <View style={[styles.add_btn_icon_box, is_orders_active && styles.add_btn_icon_box_active]}>
                  <Icon name="shopping-cart" size={14} color={is_orders_active ? "#ffffff" : DEFAULT_COLOR} />
                  <Text style={[styles.add_btn_label, is_orders_active && styles.add_btn_label_active]}>Đơn hàng{is_orders_active && ` (${item.count_cart})`}</Text>
                </View>
              </TouchableHighlight>
              </View>
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
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    minHeight: 112
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
    resizeMode: 'cover'
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
    lineHeight: isIOS ? 18 : 20
  },
  store_result_item_desc: {
    marginTop: 4,
    color: "#404040",
    fontSize: 12,
    lineHeight: isIOS ? 18 : 20
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
  }
});
