/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  RefreshControl,
  TouchableHighlight,
  FlatList,
  ScrollView
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import { Button } from '../../lib/react-native-elements';
import store from '../../store/Store';

@observer
export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      stores_data: null,
      refreshing: false,
      loading: false
    };

    this._goSearchStore = this._goSearchStore.bind(this);
    this._goListStore = this._goListStore.bind(this);
    this._getData = this._getData.bind(this);
  }

  componentWillMount() {
    Actions.refresh({
      renderRightButton: this._renderRightButton.bind(this)
    });
  }

  componentDidMount() {

    this._login();

  }

  // login khi mở app
  async _login() {
    this.setState({
      loading: true
    });

    try {
      var response = await APIHandler.user_login({
        fb_access_token: ''
      });

      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          store.setUserInfo(response.data);

          this._getData();
        })();
      }
    } catch (e) {
      console.warn(e);
    }
  }

  // lấy dữ liệu trang home
  async _getData(delay) {
    this.setState({
      loading: delay ? false : true
    });

    try {
      var response = await APIHandler.user_home();

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          this.setState({
            loading: false,
            refreshing: false,
            stores_data: response.data
          });
          layoutAnimation();
        }, delay || 0);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  // render button trên navbar
  _renderRightButton() {
    return(
      <TouchableHighlight
        style={styles.right_btn_add_store}
        underlayColor="transparent"
        onPress={() => {
          if (this.refs_modal_add_store) {
              this.refs_modal_add_store.open()
          }
        }}>
        <Icon name="plus-square" size={20} color="#ffffff" />
      </TouchableHighlight>
    );
  }

  // tới màn hình tìm cửa hàng theo mã CH
  _goSearchStore() {
    if (this.refs_modal_add_store) {
        this.refs_modal_add_store.close();
    }
    Actions.search_store({
      parent_reload: this._getData
    });
  }

  // tới màn hình tìm cửa hàng theo danh sách
  _goListStore() {
    if (this.refs_modal_add_store) {
        this.refs_modal_add_store.close();
    }
    Actions.list_store({
      parent_reload: this._getData
    });
  }

  // tới màn hình store
  _goStores(item) {
    action(() => {
      store.setStoreId(item.id);
    })();

    Actions.stores({
      title: item.name
    });
  }

  // tới màn hình giỏ hàng
  _goCart(item) {
    action(() => {
      store.setStoreId(item.id);

      Actions.cart({

      });
    })();
  }

  // pull to reload danh sách cửa hàng
  _onRefresh() {
    this.setState({refreshing: true});

    this._getData(1000);
  }

  // render rows cửa hàng trong list
  renderRow({item}) {
    // store list
    return(
      <TouchableHighlight
        underlayColor="transparent"
        onPress={this._goStores.bind(this, item)}>
        <View style={styles.stores}>

          <Image style={styles.stores_image} source={{uri: item.logo}} />

          <View style={styles.stores_info}>
            <View style={styles.stores_info_text}>
              <Text style={styles.stores_info_name}>{item.name}</Text>
              <Text style={styles.stores_info_address}>{item.address}</Text>
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
                onPress={this._goCart.bind(this, item)}
                underlayColor="transparent"
                style={styles.stores_info_action}>
                <View style={styles.stores_info_action_box}>
                  <Icon name="shopping-cart" size={22} color="#ffffff" />
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
    if (this.state.loading) {
      return <Indicator />
    }

    return (
      <View style={styles.container}>
        <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>

          {this.state.stores_data != null && <FlatList
            style={styles.stores_box}
            onEndReached={(num) => {

            }}
            onEndReachedThreshold={0}
            data={this.state.stores_data}
            renderItem={this.renderRow.bind(this)}
            keyExtractor={item => item.id}
          />}

          <View style={styles.add_store_box}>
            <Text style={styles.add_store_title}>Chọn cách bạn thêm cửa hàng</Text>

            <View style={styles.add_store_actions_box}>
              {/*<TouchableHighlight
                onPress={() => 1}
                underlayColor="transparent"
                style={styles.add_store_action_btn}>
                <View style={styles.add_store_action_btn_box}>
                  <Icon name="qrcode" size={28} color="#333333" />
                  <Text style={styles.add_store_action_label}>Quét QR code</Text>
                </View>
              </TouchableHighlight>*/}

              <TouchableHighlight
                onPress={this._goSearchStore}
                underlayColor="transparent"
                style={styles.add_store_action_btn}>
                <View style={styles.add_store_action_btn_box}>
                  <Icon name="shopping-cart" size={28} color="#333333" />
                  <Text style={styles.add_store_action_label}>Nhập mã CH</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={this._goListStore}
                underlayColor="transparent"
                style={styles.add_store_action_btn}>
                <View style={[styles.add_store_action_btn_box, {borderRightWidth: 0}]}>
                  <Icon name="search-plus" size={28} color="#333333" />
                  <Text style={styles.add_store_action_label}>Danh sách</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>

        </ScrollView>

        <Modal
          entry="top"
          style={[styles.modal, styles.modal_add_store]}
          ref={ref => this.refs_modal_add_store = ref}>

          <Text style={styles.modal_add_store_title}>Chọn cách bạn thêm cửa hàng</Text>

          {/*<Button
            buttonStyle={styles.modal_add_store_btn}
            backgroundColor="#009588"
            icon={{name: 'qrcode', type: 'font-awesome'}}
            title='Quét QR code' />*/}

          <Button
            buttonStyle={styles.modal_add_store_btn}
            backgroundColor={DEFAULT_COLOR}
            onPress={this._goSearchStore}
            icon={{name: 'shopping-cart', type: 'font-awesome'}}
            title='Nhập mã cửa hàng' />

          <Button
            buttonStyle={styles.modal_add_store_btn}
            backgroundColor="#ffc109"
            onPress={this._goListStore}
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
  stores_box: {
    marginBottom: 8
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
    resizeMode: 'cover'
  },
  stores_info: {
    width: '100%',
    minHeight: 56,
    backgroundColor: "rgba(0,0,0,0.7)",
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 8,
    paddingHorizontal: 15
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
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopWidth: Util.pixel,
    borderColor: "#dddddd"
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
    width: Math.floor((Util.size.width - 16) / 2),
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
    // height: 228,
    height: 180,
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
