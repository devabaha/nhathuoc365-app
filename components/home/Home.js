/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  RefreshControl,
  TouchableHighlight,
  FlatList
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import { Button } from 'react-native-elements';

@autobind
@observer
export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      dataSource: [
        {id: 1, image: 'http://cosp.com.vn/images/stores/2017/06/27/thiet-ke-shop-thuc-pham-sach.jpg'},
        {id: 2, image: 'http://cosp.com.vn/images/stores/2017/01/05/shop-thuc-pham-sach-co-tam-dienbien2.jpg'},
        {id: 3, image: 'http://cosp.com.vn/images/stores/2016/10/31/shop-thuc-pham-sach-anh-tinh-linh-dam.jpg'},
        {id: 4, image: 'http://cosp.com.vn/images/stores/2016/09/06/thiet-ke-cua-hang-thuc-pham-sach%20(7).jpg'},
        {id: 5, title: 'add_store'}
      ],
      refreshing: false,
    };
  }

  componentWillMount() {
    Actions.refresh({
      renderRightButton: this._renderRightButton
    });
  }

  _renderRightButton() {
    return(
      <TouchableHighlight
        style={styles.right_btn_add_store}
        underlayColor="transparent"
        onPress={() => {
          if (this.refs && this.refs.modal_add_store) {
              this.refs.modal_add_store.open()
          }
        }}>
        <Icon name="plus-square" size={20} color="#ffffff" />
      </TouchableHighlight>
    );
  }

  _onRefresh() {
    this.setState({refreshing: true});

    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
  }

  _keyExtractor = (item, index) => item.id;

  renderRow({item}) {
    // box add store
    if (_.isObject(item) && item.title == 'add_store') {
      return(
        <View style={styles.add_store_box}>
          <Text style={styles.add_store_title}>Chọn cách bạn thêm cửa hàng</Text>

          <View style={styles.add_store_actions_box}>
            <TouchableHighlight
              onPress={() => 1}
              underlayColor="transparent"
              style={styles.add_store_action_btn}>
              <View style={styles.add_store_action_btn_box}>
                <Icon name="qrcode" size={28} color="#333333" />
                <Text style={styles.add_store_action_label}>Quét QR code</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              onPress={() => 1}
              underlayColor="transparent"
              style={styles.add_store_action_btn}>
              <View style={styles.add_store_action_btn_box}>
                <Icon name="shopping-cart" size={28} color="#333333" />
                <Text style={styles.add_store_action_label}>Nhập mã CH</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              onPress={() => 1}
              underlayColor="transparent"
              style={styles.add_store_action_btn}>
              <View style={[styles.add_store_action_btn_box, {borderRightWidth: 0}]}>
                <Icon name="search-plus" size={28} color="#333333" />
                <Text style={styles.add_store_action_label}>Danh sách</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      );
    }

    // store list
    return(
      <TouchableHighlight
        underlayColor={DEFAULT_COLOR}
        onPress={() => {
          Actions.stores({});
        }}>
        <View style={styles.stores}>

          <Image style={styles.stores_image} source={{uri: item.image}} />

          <View style={styles.stores_info}>
            <View style={styles.stores_info_text}>
              <Text style={styles.stores_info_name}>Thực phẩm sạch Anh Thực 03</Text>
              <Text style={styles.stores_info_address}>Số 01 Lương Yên, Long Biên, Hà Nội</Text>
            </View>

            <View style={styles.stores_info_cart}>
              <TouchableHighlight
                onPress={() => {}}
                underlayColor="transparent"
                style={styles.stores_info_action}>
                <View style={styles.stores_info_action_box}>
                  <Icon name="commenting" size={20} color="#ffffff" />
                  <Text style={styles.stores_info_action_label}>Tin nhắn</Text>

                  <View style={styles.stores_info_action_notify}>
                    <Text style={styles.stores_info_action_notify_value}>3</Text>
                  </View>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => {}}
                underlayColor="transparent"
                style={styles.stores_info_action}>
                <View style={styles.stores_info_action_box}>
                  <Icon name="cart-plus" size={22} color="#ffffff" />
                  <Text style={styles.stores_info_action_label}>Giỏ hàng</Text>

                  <View style={styles.stores_info_action_notify}>
                    <Text style={styles.stores_info_action_notify_value}>10</Text>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>

        {this.state.dataSource != null && <FlatList
          data={this.state.dataSource}
          renderItem={this.renderRow}
          keyExtractor={this._keyExtractor}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        />}

        <Modal
          entry="top"
          style={[styles.modal, styles.modal_add_store]}
          ref={"modal_add_store"}>

          <Text style={styles.modal_add_store_title}>Chọn cách bạn thêm cửa hàng</Text>

          <Button
            buttonStyle={styles.modal_add_store_btn}
            backgroundColor="#009588"
            icon={{name: 'qrcode', type: 'font-awesome'}}
            title='Quét QR code' />

          <Button
            buttonStyle={styles.modal_add_store_btn}
            backgroundColor={DEFAULT_COLOR}
            icon={{name: 'shopping-cart', type: 'font-awesome'}}
            title='Nhập mã cửa hàng' />

          <Button
            buttonStyle={styles.modal_add_store_btn}
            backgroundColor="#ffc109"
            icon={{name: 'search-plus', type: 'font-awesome'}}
            title='Xem danh sách cửa hàng' />
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN
  },
  stores: {
    backgroundColor: '#cccccc',
    width: '100%',
    height: Math.floor(CONTAINER_HEIGHT / 3),
    overflow: 'hidden',
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#000000'
  },
  stores_image: {
    height: '100%',
    resizeMode: 'center'
  },
  stores_info: {
    width: '100%',
    minHeight: 56,
    backgroundColor: "rgba(0,0,0,0.7)",
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 8
  },
  stores_info_text: {
    width: Util.size.width - 130
  },
  stores_info_name: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  stores_info_address: {
    color: '#fafafa',
    fontSize: 12,
    marginTop: 4
  },
  stores_info_cart: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 0,
    width: 120,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 10,
  },
  stores_info_action: {
    padding: 10
  },
  stores_info_action_box: {
    alignItems: 'center'
  },
  stores_info_action_label: {
    fontSize: 9,
    color: '#fafafa',
    marginTop: 4
  },
  stores_info_action_notify: {
    position: 'absolute',
    width: 16,
    height: 16,
    backgroundColor: 'red',
    top: -4,
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

  add_store_box: {
    width: '100%',
    backgroundColor: "#ffffff",
    marginVertical: 4,
    padding: 8
  },
  add_store_title: {
    color: "#404040",
    fontSize: 14,
    fontWeight: '600'
  },
  add_store_actions_box: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 8,
    borderTopWidth: Util.pixel,
    borderTopColor: "#ebebeb",
    paddingTop: 8
  },
  add_store_action_btn: {
    paddingVertical: 8
  },
  add_store_action_btn_box: {
    alignItems: 'center',
    width: Math.floor((Util.size.width - 16) / 3),
    borderRightWidth: Util.pixel,
    borderRightColor: '#ebebeb'
  },
  add_store_action_label: {
    fontSize: 12,
    color: '#404040',
    marginTop: 8
  },

  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8
  },

  modal_add_store: {
    width: '90%',
    height: 228,
    borderRadius: 3
  },
  modal_add_store_title: {
    color: "#404040",
    fontSize: 18,
    marginTop: 12,
    marginLeft: 15,
    marginBottom: 8
  },
  modal_add_store_btn: {
    marginTop: 12
  }
});
