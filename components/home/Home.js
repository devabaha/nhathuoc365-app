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
  ScrollView,
  Alert
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
import { ItemList as AdItemList } from '../dashboard/ItemList';
import NotifyItemComponent from '../notify/NotifyItemComponent';
import NewItemComponent from '../notify/NewItemComponent';
import {
  TabTutorial,
  AddStoreTutorial,
  GoStoreTutorial
} from '../tutorial';

@observer
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stores_data: null,
      refreshing: false,
      loading: false,
      user_notice: null,
      finish: false,
      scrollTop: 0,
      show_tutorial_tab: false,
      show_add_store: false,
      show_go_store: false,
      admin_stores_data: null
    };

    this._goSearchStore = this._goSearchStore.bind(this);
    this._goListStore = this._goListStore.bind(this);
    this._getData = this._getData.bind(this);

    // auto refresh home
    reaction(() => store.refresh_home_change, () => this._getData(450));
  }

  componentWillMount() {

  }

  componentDidMount() {
    // Actions.refresh({
    //   renderRightButton: this._renderRightButton.bind(this)
    // });

    this._getData();

    store.parentTab = '_home';

    if (!store.launched) {
      store.launched = true;
      Actions.error();
    }
  }

  componentWillReceiveProps() {

    if (store.goStoreNow) {
      store.goStoreNow = undefined;
      return Actions.stores();
    }

    store.parentTab = '_home';

    this._closePopup();

    store.getNoitify();

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

  // lấy dữ liệu trang home
  _getData(delay) {
    this.setState({
      loading: true
    }, async () => {
      try {
        var response = await APIHandler.user_home();

        if (response && response.status == STATUS_SUCCESS) {
          setTimeout(() => {

            var {data} = response;

            // Animation is true when first loaded
            if (this.state.stores_data == null) {
              layoutAnimation();
            }

            this.setState({
              finish: true,
              loading: false,
              refreshing: false,
              show_add_store: false,
              stores_data: data.sites.length > 0 ? data.sites : null,
              user_notice: data.notices.length > 0 ? data.notices : null,
              newses_data: data.newses.length > 0 ? data.newses : null,
              view_all_sites: data.view_all_sites == 1,
              view_all_notices: data.view_all_notices == 1,
              view_all_newses: data.view_all_newses == 1,
            });

            if (data.sites.length <= 0) {
              this._showAddStore();
              this.setState({
                show_go_store: false
              });
            } else {
              this._showGoStore();
            }

            this._scrollToTop(0);
          }, delay || 0);
        }
      } catch (e) {
        console.warn(e + ' user_home');

        store.addApiQueue('user_home', this._getData.bind(this));
      } finally {
        const isAdmin = store.user_info.admin_flag == 1;
        if (isAdmin) {
          this._getAdData();
        } else {
          this.setState({
            admin_stores_data: null
          });
        }
      }
    });
  }

  _getAdData = async () => {
    try {
      var response = await ADMIN_APIHandler.user_home();

      if (response && response.status == STATUS_SUCCESS) {
        this.setState({
          admin_stores_data: response.data
        });

        // layoutAnimation();
      }

    } catch (e) {
      console.warn(e + ' admin:user_home');

      store.addApiQueue('admin:user_home', this._getAdData.bind(this));
    } finally {

    }
  }

  // render button trên navbar
  _renderRightButton() {
    return(
      <TouchableHighlight
        style={styles.right_btn_add_store}
        underlayColor="transparent"
        onPress={this._showPopupAddStore.bind(this)}>
        <View style={{
          height: 34,
          alignItems: 'center',
          marginTop: -8
        }}>
          <Icon name="phone" size={22} color="#ffffff" />
          <Text style={{
            fontSize: 10,
            color: '#ffffff',
            marginTop: 2
          }}>Gọi hỗ trợ</Text>
        </View>
      </TouchableHighlight>
    );
  }

  _showPopupAddStore() {
    if (this.refs_modal_add_store) {
        this.refs_modal_add_store.open();
    }
  }

  // tới màn hình tìm cửa hàng theo mã CH
  _goSearchStore() {
    this._closePopup();

    Actions.search_store();
  }

  // tới màn hình tìm cửa hàng theo danh sách
  _goListStore() {
    this._closePopup();

    Actions.list_store();
  }

  _goScanQRCode() {
    this._closePopup();

    Actions.scan_qr_code();
  }

  _closePopup() {
    if (this.refs_modal_add_store) {
        this.refs_modal_add_store.close();
    }
  }

  // pull to reload danh sách cửa hàng
  _onRefresh() {
    this.setState({refreshing: true});

    this._getData(1000);
  }

  // render rows cửa hàng trong list
  renderRow({item, index}, isAdmin) {
    if (index == 0) {
      this.defaultBoxHeight = 0;
    }

    this.defaultBoxHeight += 104;

    // store list
    return(
      <ItemList item={item} index={index} that={this} />
    );
  }

  renderAdRow({item, index}, isAdmin) {
    if (index == 0) {
      this.defaultBoxHeight = 0;
    }

    this.defaultBoxHeight += 104;

    // store list
    return(
      <AdItemList item={item} index={index} itemListOnPress={this._goAdStore.bind(this, item)} />
    );
  }

  _goAdStore(item) {
    Actions.sale_menu({
      item_data: item,
      title: item.name
    });
  }

  _showTutorialTab() {
    var key_tutorial = 'KeyTutorialTabShow' + store.user_info.id;

    if (this._showTutorialTabFlag) {
      return;
    }

    this._showTutorialTabFlag = true;

    this._cachedStore(key_tutorial, () => {

    }, () => {
      layoutAnimation();

      // show tutorial
      this.setState({
        show_tutorial_tab: true
      }, () => {
        setTimeout(() => {
          this.setState({
            show_tutorial_tab: false
          });
        }, 5000);
      });

      //
      storage.save({
        key: key_tutorial,
        data: {finish: true},
        expires: null
      });
    });
  }

  _showAddStore() {
    var key_tutorial = 'KeyTutorialAddStore' + store.user_info.id;

    this._cachedStore(key_tutorial, () => {

    }, () => {
      layoutAnimation();

      // show tutorial
      this.setState({
        show_add_store: true
      });
    });
  }

  _showGoStore() {
    var key_tutorial = 'KeyTutorialGoStore' + store.user_info.id;
    this._cachedStore(key_tutorial, () => {

    }, () => {
      layoutAnimation();

      // show tutorial
      this.setState({
        show_go_store: true
      }, () => {
        setTimeout(() => {
          this.setState({
            show_go_store: false
          });
        }, 15000);
      });
    });
  }

  _cachedStore(key, thenFunc = () => 1, catchFunc = () => 1) {
    storage.load({
      key,
      autoSync: true,
      syncInBackground: true,
      syncParams: {
        extraFetchOptions: {
        },
        someFlag: true,
      },
    }).then(data => {
      thenFunc(data);
    }).catch(err => {
      catchFunc(err);
    });
  }

  render() {

    var {
      loading,
      finish,
      stores_data,
      newses_data,
      user_notice,
      view_all_newses,
      view_all_notices,
      view_all_sites,

      show_tutorial_tab,
      show_add_store,
      show_go_store,

      admin_stores_data
    } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          onScroll={(event) => {
            var scrollTop = event.nativeEvent.contentOffset.y;
            this.setState({ scrollTop });

            if (scrollTop > 200) {
              this._showTutorialTab();
            }
          }}
          ref={ref => this.refs_home = ref}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>

          <View style={styles.myFavoriteBox}>
            <Text style={styles.add_store_title}>CỬA HÀNG YÊU THÍCH</Text>

            {view_all_sites && (
              <View style={styles.right_title_btn_box}>
                <TouchableHighlight
                  style={styles.right_title_btn}
                  underlayColor="transparent"
                  onPress={() => Actions.stores_list({

                  })}>
                  <Text style={[styles.add_store_title, {color: DEFAULT_COLOR}]}>XEM TẤT CẢ</Text>
                </TouchableHighlight>
              </View>
            )}
          </View>

          {loading && stores_data == null ? (
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
              data={stores_data}
              renderItem={({item, index}) => this.renderRow({item, index}, false)}
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

          {admin_stores_data && (
            <View>
              <View style={styles.myStoresBox}>
                <Text style={styles.add_store_title}>CỬA HÀNG CỦA TÔI</Text>
              </View>

              <FlatList
                style={styles.stores_box}
                onEndReached={(num) => {

                }}
                onEndReachedThreshold={0}
                data={admin_stores_data}
                renderItem={({item, index}) => this.renderAdRow({item, index}, true)}
                keyExtractor={item => item.id}
              />
            </View>
          )}

          {false && (//finish - thay false vao finish de an o them cua hang
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
                  <View style={[styles.add_store_action_btn_box, {borderRightWidth: 0}]}>
                    <Icon name="search-plus" size={20} color="#333333" />
                    <Text style={styles.add_store_action_label}>Tìm cửa hàng</Text>
                  </View>
                </TouchableHighlight>

                {/*<TouchableHighlight
                  onPress={this._goListStore}
                  underlayColor="transparent"
                  style={styles.add_store_action_btn}>
                  <View style={[styles.add_store_action_btn_box, {borderRightWidth: 0}]}>
                    <Icon name="list-ul" size={20} color="#333333" />
                    <Text style={styles.add_store_action_label}>Danh sách</Text>
                  </View>
                </TouchableHighlight>*/}
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
              <Text style={styles.add_store_title}>TIN TỨC</Text>

              {view_all_newses && (
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

          {newses_data && (
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

              {view_all_notices && (
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
            title='Tìm cửa hàng' />

          {/*<Button
            buttonStyle={styles.modal_add_store_btn}
            backgroundColor="#ffc109"
            onPress={this._goListStore}
            icon={{name: 'list-ul', type: 'font-awesome'}}
            title='Xem danh sách cửa hàng' />*/}
        </Modal>

        {show_tutorial_tab && (
          <TabTutorial
            title="Tap vào đây để Về đầu trang nhanh hơn :)"
            left={(Util.size.width / 4) / 2}
            onPress={() => {
              this.setState({
                show_tutorial_tab: false
              });
            }}
            />
        )}

        {show_add_store && (
          <AddStoreTutorial
            title="Tap vào đây để thêm cửa hàng yêu thích"
            right={(Util.size.width / 2.2) / 2}
            onPress={() => {
              this.setState({
                show_add_store: false
              });
            }}
            />
        )}

        {show_go_store && (
          <GoStoreTutorial
            title="Tap vào đây để vào cửa hàng yêu thích"
            left={(Util.size.width / 4) / 2}
            onPress={() => {
              this.setState({
                show_go_store: false
              });
            }}
            />
        )}
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
    // width: ~~((Util.size.width - 16) / 2),
    width: ~~(Util.size.width / 2),
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
  },
  myStoresBox: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: 'row'
  },
  myFavoriteBox: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: 'row'
  }
});
