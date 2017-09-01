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
import {reaction} from 'mobx';

// components
import ItemGrid from './ItemGrid';
import ItemList from './ItemList';
import NotifyItemComponent from '../notify/NotifyItemComponent';
import NewItemComponent from '../notify/NewItemComponent';

@observer
export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      stores_data: null,
      refreshing: false,
      loading: false,
      user_notice: null,
      finish: false
    };

    this._goSearchStore = this._goSearchStore.bind(this);
    this._goListStore = this._goListStore.bind(this);
    this._getData = this._getData.bind(this);

    // auto refresh home
    reaction(() => store.refresh_home_change, this._getData);
  }

  componentWillMount() {
    Actions.refresh({
      renderRightButton: this._renderRightButton.bind(this)
    });
  }

  componentDidMount() {

    this._login();

  }

  componentWillReceiveProps() {
    // this._getData();
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
          layoutAnimation();

          this.setState({
            finish: true,
            loading: false,
            refreshing: false,
            stores_data: response.data.sites.length > 0 ? response.data.sites : null,
            user_notice: response.data.notices.length > 0 ? response.data.notices : null,
            newses_data: response.data.newses.length > 0 ? response.data.newses : null
          });
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
        <Icon name="plus" size={20} color="#ffffff" />
      </TouchableHighlight>
    );
  }

  // tới màn hình tìm cửa hàng theo mã CH
  _goSearchStore() {
    if (this.refs_modal_add_store) {
        this.refs_modal_add_store.close();
    }
    Actions.search_store();
  }

  // tới màn hình tìm cửa hàng theo danh sách
  _goListStore() {
    if (this.refs_modal_add_store) {
        this.refs_modal_add_store.close();
    }
    Actions.list_store();
  }

  _goScanQRCode() {
    if (this.refs_modal_add_store) {
        this.refs_modal_add_store.close();
    }
    Actions.scan_qr_code();
  }

  // pull to reload danh sách cửa hàng
  _onRefresh() {
    this.setState({refreshing: true});

    this._getData(1000);
  }

  // render rows cửa hàng trong list
  renderRow({item, index}) {
    if (index == 0) {
      this.defaultBoxHeight = 0;
    }

    this.defaultBoxHeight += 104;

    // store list
    return(
      <ItemList item={item} />
    );
  }

  render() {

    var {loading, finish, stores_data, newses_data, user_notice} = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>

          <View style={{
            backgroundColor: "#ffffff",
            paddingHorizontal: 15,
            paddingVertical: 8
          }}>
            <Text style={styles.add_store_title}>Cửa hàng bạn yêu thích</Text>
          </View>

          {loading ? (
            <View style={[styles.defaultBox, {
              height: this.defaultBoxHeight || 104
            }]}>
              <Indicator size="small" />
            </View>
          ) : stores_data != null ? (
            <FlatList
              style={styles.stores_box}
              onEndReached={(num) => {

              }}
              onEndReachedThreshold={0}
              data={this.state.stores_data}
              renderItem={this.renderRow.bind(this)}
              keyExtractor={item => item.id}
            />
          ) : (
            <View style={styles.defaultBox}>
              <CenterText
                marginTop={0}
                title={"Chưa có cửa hàng\nThêm cửa hàng bạn yêu thích ngay!"} />
            </View>
          )}

          {finish && (
            <View style={styles.add_store_box}>
              <Text style={styles.add_store_title}>Thêm cửa hàng bạn yêu thích</Text>

              <View style={styles.add_store_actions_box}>
                <TouchableHighlight
                  onPress={this._goScanQRCode.bind(this)}
                  underlayColor="transparent"
                  style={styles.add_store_action_btn}>
                  <View style={styles.add_store_action_btn_box}>
                    <Icon name="qrcode" size={20} color="#333333" />
                    <Text style={styles.add_store_action_label}>Quét QR code</Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  onPress={this._goSearchStore}
                  underlayColor="transparent"
                  style={styles.add_store_action_btn}>
                  <View style={styles.add_store_action_btn_box}>
                    <Icon name="shopping-cart" size={20} color="#333333" />
                    <Text style={styles.add_store_action_label}>Nhập mã CH</Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  onPress={this._goListStore}
                  underlayColor="transparent"
                  style={styles.add_store_action_btn}>
                  <View style={[styles.add_store_action_btn_box, {borderRightWidth: 0}]}>
                    <Icon name="search-plus" size={20} color="#333333" />
                    <Text style={styles.add_store_action_label}>Danh sách</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          )}


          {newses_data != null && (
            <View style={{
              backgroundColor: "#ffffff",
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderTopWidth: Util.pixel,
              borderBottomWidth: Util.pixel,
              borderColor: "#dddddd",
              marginTop: 8
            }}>
              <Text style={styles.add_store_title}>Thông báo</Text>
            </View>
          )}

          {loading && newses_data != null ? (
            <View style={[styles.defaultBox, {
              height: this.defaultNewBoxHeight || 116,
              marginBottom: 0,
              borderTopWidth: 0
            }]}>
              <Indicator size="small" />
            </View>
          ) : newses_data ? (
            <FlatList
              data={newses_data}
              renderItem={({item, index}) => {
                if (index == 0) {
                  this.defaultNewBoxHeight = 0;
                }

                this.defaultNewBoxHeight += 116;

                return(
                  <NewItemComponent
                    item={item} />
                );
              }}
              keyExtractor={item => item.id}
            />
          ) : (
            null
          )}

          {user_notice && (
            <View style={{
              backgroundColor: "#ffffff",
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderTopWidth: Util.pixel,
              borderBottomWidth: Util.pixel,
              borderColor: "#dddddd",
              marginTop: 8
            }}>
              <Text style={styles.add_store_title}>Cập nhật đơn hàng</Text>
            </View>
          )}

          {loading && user_notice != null ? (
            <View style={[styles.defaultBox, {
              borderTopWidth: 0
            }]}>
              <Indicator size="small" />
            </View>
          ) : user_notice ? (
            <FlatList
              ItemSeparatorComponent={() => <View style={styles.separator}></View>}
              data={user_notice}
              style={[styles.profile_list_opt]}
              renderItem={({item, index}) => {
                return(
                  <NotifyItemComponent
                    item={item} />
                );
              }}
              keyExtractor={item => item.id}
            />
          ) : (
            null
          )}

        </ScrollView>

        <Modal
          entry="top"
          style={[styles.modal, styles.modal_add_store]}
          ref={ref => this.refs_modal_add_store = ref}>

          <Text style={styles.modal_add_store_title}>Thêm cửa hàng bạn yêu thích</Text>

          <Button
            onPress={this._goScanQRCode.bind(this)}
            buttonStyle={styles.modal_add_store_btn}
            backgroundColor="#009588"
            icon={{name: 'qrcode', type: 'font-awesome'}}
            title='Quét QR code' />

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
  defaultBox: {
    width: '100%',
    height: 104,
    backgroundColor: "#ffffff",
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd",
    marginBottom: 8
  },

  container: {
    flex: 1,
    ...MARGIN_SCREEN
  },
  stores_box: {
    marginBottom: 8,
    borderTopWidth: Util.pixel,
    borderColor: "#dddddd"
  },

  add_store_box: {
    width: '100%',
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
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
    paddingVertical: 4
  },
  add_store_action_btn_box: {
    alignItems: 'center',
    width: ~~((Util.size.width - 16) / 3),
    borderRightWidth: Util.pixel,
    borderRightColor: '#ebebeb'
  },
  add_store_action_label: {
    fontSize: 12,
    color: '#404040',
    marginTop: 4
  },

  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8
  },

  modal_add_store: {
    width: '90%',
    height: 228,
    // height: 180,
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
  },

  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#cccccc"
  },

  profile_list_opt: {
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  }
});
