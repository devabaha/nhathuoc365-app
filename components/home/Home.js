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
      finish: false,
      scrollTop: 0
    };

    this._goSearchStore = this._goSearchStore.bind(this);
    this._goListStore = this._goListStore.bind(this);
    this._getData = this._getData.bind(this);

    // auto refresh home
    reaction(() => store.refresh_home_change, () => this._getData(450));
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

    if (this.state.finish && store.is_stay_home) {
      if (this.state.scrollTop == 0) {
        this._scrollOverTopAndReload();
      } else {
        this._scrollToTop(0);
      }
    }

    store.is_stay_home = true;
  }

  _scrollToTop(top = 0) {
    if (this.refs_home) {
      this.refs_home.scrollTo({x: 0, y: top, animated: true});
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

  // login khi mở app
  _login() {
    this.setState({
      loading: true
    }, async () => {
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
    });
  }

  // lấy dữ liệu trang home
  _getData(delay) {
    this.setState({
      loading: true
    }, async () => {
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

            this._scrollToTop(0);
          }, delay || 0);
        }
      } catch (e) {
        console.warn(e);
      }
    });
  }

  // render button trên navbar
  _renderRightButton() {
    return(
      <TouchableHighlight
        style={styles.right_btn_add_store}
        underlayColor="transparent"
        onPress={this._showPopupAddStore.bind(this)}>
        <Icon name="plus" size={20} color="#ffffff" />
      </TouchableHighlight>
    );
  }

  _showPopupAddStore() {
    if (this.refs_modal_add_store) {
        this.refs_modal_add_store.open()
    }
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
          onScroll={(event) => {
            this.setState({
              scrollTop: event.nativeEvent.contentOffset.y
            });
          }}
          ref={ref => this.refs_home = ref}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>

          <View style={{
            backgroundColor: "#f1f1f1",
            paddingHorizontal: 15,
            paddingVertical: 8,
            flexDirection: 'row'
          }}>
            <Text style={styles.add_store_title}>CỬA HÀNG YÊU THÍCH</Text>

            {stores_data != null && stores_data.length > 3 && (
              <View style={styles.right_title_btn_box}>
                <TouchableHighlight
                  style={styles.right_title_btn}
                  underlayColor="transparent"
                  onPress={() => {}}>
                  <Text style={[styles.add_store_title, {color: DEFAULT_COLOR}]}>XEM TẤT CẢ</Text>
                </TouchableHighlight>
              </View>
            )}
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
            <TouchableHighlight
              underlayColor="transparent"
              onPress={this._showPopupAddStore.bind(this)}
              >
              <View style={styles.defaultBox}>
                <CenterText
                  marginTop={0}
                  title={"Chưa có cửa hàng\nThêm cửa hàng bạn yêu thích ngay!"} />
              </View>
            </TouchableHighlight>
          )}

          {finish && (
            <View>
              <View style={{
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderBottomWidth: Util.pixel,
                borderColor: "#dddddd"
              }}>
                <Text style={styles.add_store_title}>THÊM CỬA HÀNG YÊU THÍCH</Text>
              </View>
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
                    <Icon name="search-plus" size={20} color="#333333" />
                    <Text style={styles.add_store_action_label}>Nhập mã CH</Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  onPress={this._goListStore}
                  underlayColor="transparent"
                  style={styles.add_store_action_btn}>
                  <View style={[styles.add_store_action_btn_box, {borderRightWidth: 0}]}>
                    <Icon name="list-ul" size={20} color="#333333" />
                    <Text style={styles.add_store_action_label}>Danh sách</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          )}


          {newses_data != null && (
            <View style={{
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderBottomWidth: Util.pixel,
              borderColor: "#dddddd",
              marginTop: 4,
              flexDirection: 'row'
            }}>
              <Text style={styles.add_store_title}>TIN KHUYẾN MÃI</Text>

              {newses_data != null && (
                <View style={styles.right_title_btn_box}>
                  <TouchableHighlight
                    style={styles.right_title_btn}
                    underlayColor="transparent"
                    onPress={() => {
                      Actions.notifys({
                        title: "KHUYẾN MÃI",
                        news_type: "/1"
                      });
                    }}>
                    <Text style={[styles.add_store_title, {color: DEFAULT_COLOR}]}>XEM TẤT CẢ</Text>
                  </TouchableHighlight>
                </View>
              )}
            </View>
          )}

          {loading && newses_data != null ? (
            <View style={[styles.defaultBox, {
              height: this.defaultNewBoxHeight || (isIOS ? 116 : 124),
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

                this.defaultNewBoxHeight += (isIOS ? 116 : 124);

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
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderBottomWidth: Util.pixel,
              borderColor: "#dddddd",
              marginTop: 4,
              flexDirection: 'row'
            }}>
              <Text style={styles.add_store_title}>THÔNG BÁO ĐƠN HÀNG</Text>

              {user_notice != null && (
                <View style={styles.right_title_btn_box}>
                  <TouchableHighlight
                    style={styles.right_title_btn}
                    underlayColor="transparent"
                    onPress={() => {
                      Actions._main_notify({type: ActionConst.REFRESH});
                    }}>
                    <Text style={[styles.add_store_title, {color: DEFAULT_COLOR}]}>XEM TẤT CẢ</Text>
                  </TouchableHighlight>
                </View>
              )}
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
            icon={{name: 'search-plus', type: 'font-awesome'}}
            title='Nhập mã cửa hàng' />

          <Button
            buttonStyle={styles.modal_add_store_btn}
            backgroundColor="#ffc109"
            onPress={this._goListStore}
            icon={{name: 'list-ul', type: 'font-awesome'}}
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
    marginBottom: 4
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
    paddingBottom: 8,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  add_store_title: {
    color: "#404040",
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20
  },
  add_store_actions_box: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
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
  },

  right_title_btn_box: {
    flex: 1,
    alignItems: 'flex-end'
  }
});
