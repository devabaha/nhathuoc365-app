/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  Touch,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  Alert
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import store from '../../store/Store';
import { SocialIcon } from '../../lib/react-native-elements';
import Communications from 'react-native-communications';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import Sticker from '../Sticker';
import {reaction} from 'mobx';

// components
import SelectionList from '../SelectionList';

@observer
export default class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      logout_loading: false,
      sticker_flag: false,
      avatar_loading: false,
      scrollTop: 0
    }

    reaction(() => store.user_info, this._initial);
  }

  _initial = (callback) => {
    const isAdmin = store.user_info.admin_flag == 1;

    this.setState({
      options: [
        // {
        //   key: 1,
        //   icon: "heart",
        //   label: "Ưa thích",
        //   desc: "Xem sản phẩm đã thích",
        //   onPress: () => 1,
        //   boxIconStyle: []
        // },
        // {
        //   key: 2,
        //   icon: "history",
        //   label: "Mới xem",
        //   desc: "Sản phẩm đã xem gần đây",
        //   onPress: () => 1,
        //   boxIconStyle: []
        // },
        {
          key: "1",
          icon: "map-marker",
          label: "Địa chỉ của tôi",
          desc: "Quản lý địa chỉ nhận hàng",
          onPress: () => Actions.address({
            from_page: "account"
          }),
          boxIconStyle: [styles.boxIconStyle, {
            backgroundColor: "#fcb309"
          }],
          iconColor: "#ffffff"
        },

        {
          key: "2",
          isHidden: !isAdmin,
          icon: "home",
          label: "Cửa hàng của tôi",
          desc: "Quản lý cửa hàng kinh doanh",
          onPress: () => Actions.dashboard({

          }),
          boxIconStyle: [styles.boxIconStyle, {
            backgroundColor: "#1fa67a"
          }],
          iconColor: "#ffffff",
          marginTop: true,
          notify: "notify_myshop"
        },

        {
          key: "3",
          icon: "facebook-square",
          label: "Fanpage MACCACA",
          desc: "Facebook fanpage của ứng dụng",
          onPress: () => Communications.web("http://fanpage.MACCACA.vn"),
          boxIconStyle: [styles.boxIconStyle, {
            backgroundColor: "#4267b2"
          }],
          iconColor: "#ffffff",
          marginTop: !isAdmin
        },

        {
          key: "4",
          icon: "handshake-o",
          label: "Về MACCACA - Điều khoản sử dụng",
          desc: "Điều khoản sử dụng",
          onPress: () => Actions.webview({
            title: "Về MACCACA",
            url: MY_FOOD_API + "info/privacy"
          }),
          boxIconStyle: [styles.boxIconStyle, {
            backgroundColor: DEFAULT_COLOR
          }],
          iconColor: "#ffffff",
          // marginTop: true
        },

        {
          key: "5",
          icon: "question-circle",
          label: "Thông tin ứng dụng",
          desc: "Sản phẩm của MACCACA - Phiên bản hiện tại: " + DeviceInfo.getVersion(),
          onPress: () => 1,
          boxIconStyle: [styles.boxIconStyle, {
            backgroundColor: "#688efb"
          }],
          iconColor: "#ffffff",
          hideAngle: true,
          marginTop: true
        }
      ]
    }, () => {
      if (typeof callback == 'function') {
        callback();
      }
    });
  }

  _onRefresh() {
    this.setState({refreshing: true}, () => {
      this._login(1000);
    });
  }

  _showSticker() {
    this.setState({
      sticker_flag: true
    }, () => {
      setTimeout(() => {
        this.setState({
          sticker_flag: false
        });
      }, 2000);
    });
  }

  _onTapAvatar() {
    const options = {
      title: 'Cập nhật ảnh đại diện tài khoản',
      cancelButtonTitle: 'Huỷ bỏ',
      takePhotoButtonTitle: 'Chụp ảnh',
      chooseFromLibraryButtonTitle: 'Chọn ảnh từ thư viện',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {

      }
      else if (response.error) {
        console.warn(response.error);
      }
      else {
        this._uploadAvatar(response);
      }
    });
  }

  _uploadAvatar(response) {
    this.setState({
      avatar_loading: true
    }, () => {
      const avatar = {
        name: 'avatar',
        filename: response.fileName,
        data: response.data
      }

      // call api post my form data
      RNFetchBlob.fetch('POST', APIHandler.url_user_add_avatar(), {
          'Content-Type' : 'multipart/form-data',
      }, [avatar]).then((resp) => {

          var {data} = resp;
          var response = JSON.parse(data);
          if (response && response.status == STATUS_SUCCESS) {
            this._showSticker();

            action(() => {
              store.setUserInfo(response.data);
            })();
            this.setState({
              avatar_loading: false
            });
          }
      }).catch((error) => {
          console.warn(error + ' url_user_add_avatar');

          store.addApiQueue('url_user_add_avatar', this._uploadAvatar.bind(this, response));
      });
    });
  }

  componentDidMount() {
    this._initial(() => {
      this.key_add_new = this.state.options.length;

      this.setState({
        finish: true
      });

      store.is_stay_account = true;

      store.parentTab = '_account';

      // updating version
      this._updateHandler(store.notify);

      // callback when has new version
      Events.on(CALLBACK_APP_UPDATING, CALLBACK_APP_UPDATING + 'ID', this._updateHandler.bind(this));
    });
  }

  _updateHandler(notify) {
    if (notify.updating_version > 0) {
      if (!this.state.options[this.key_add_new]) {
        this.state.options.push({
          key: "6",
          icon: "cloud-download",
          label: "Cập nhật ứng dụng",
          desc: "Cập nhật lên phiên bản ổn định " + notify.new_version + " ngay!",
          onPress: () => {
            if (notify.url_update) {
              Communications.web(notify.url_update);
            }
          },
          boxIconStyle: [styles.boxIconStyle, {
            backgroundColor: "#dd4b39"
          }],
          notify: "updating_version",
          iconColor: "#ffffff"
        });

        this.setState({
          options: this.state.options
        });
      }
    } else {
      if (this.state.options[this.key_add_new]) {
        this.state.options.splice(this.key_add_new, 1);

        this.setState({
          options: this.state.options
        });
      }
    }
  }

  componentWillReceiveProps() {
    store.parentTab = '_account';

    store.getNoitify();

    if (this.state.finish && store.is_stay_account) {
      if (this.state.scrollTop == 0) {
        this._scrollOverTopAndReload();
      } else {
        this._scrollToTop(0);
      }
    }

    store.is_stay_account = true;
  }

  _scrollToTop(top = 0) {
    if (this.refs_account) {
      this.refs_account.scrollTo({x: 0, y: top, animated: true});

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
      this._login(1000);
    });
  }

  _login(delay) {
    this.setState({
      loading: true
    }, async () => {
      try {
        var response = await APIHandler.user_login({
          fb_access_token: ''
        });

        if (response && response.status == STATUS_SUCCESS) {
          setTimeout(() => {
            action(() => {
              store.setUserInfo(response.data);

              store.setOrdersKeyChange(store.orders_key_change + 1);

              this.setState({
                refreshing: false
              });
            })();
          }, delay || 0);
        }
      } catch (e) {
        console.warn(e + ' user_login');

        store.addApiQueue('user_login', this._login.bind(this, delay));
      }
    });
  }

  render() {

    var is_login = store.user_info != null && store.user_info.username != null;
    var {user_info} = store;

    var {avatar_loading, logout_loading} = this.state;

    if (avatar_loading) {
      var avatar = (
        <View style={{width: '100%', height: '100%'}}>
          <Indicator size="small" />
        </View>
      );
    } else {
      var avatar = (
        <View>
          <CachedImage mutable style={styles.profile_avatar} source={{uri: store.user_info.img}} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.profile_cover_box}>
          <ImageBackground style={styles.profile_cover} source={require('../../images/profile_bgr.jpg')}>
            <TouchableHighlight
              onPress={this._onTapAvatar.bind(this)}
              style={styles.profile_avatar_box}
              underlayColor="#cccccc">
              {avatar}
            </TouchableHighlight>

            {is_login ? (
              <View style={{
                position: 'absolute',
                left: 120,
                bottom: 48,
                backgroundColor: "transparent"
              }}>

              <Text style={{
                color: "#ffffff",
                fontSize: 16,

              }}>{user_info.name}</Text>

              <Text style={{
                color: "#ffffff",
                fontSize: 12,
                marginTop: 4
              }}>{user_info.tel}</Text>

              </View>
            ) : (
              <View style={styles.profile_button_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => {
                    Actions.register({});
                  }}>

                  <View style={[styles.profile_button_login_box, {
                    marginRight: 8,
                    backgroundColor: "#666666"
                  }]}>
                    <Icon name="user-plus" size={14} color="#ffffff" />
                    <Text style={styles.profile_button_title}>Đăng ký</Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => {
                    Actions.login();
                  }}>

                  <View style={[styles.profile_button_login_box, {
                    backgroundColor: DEFAULT_COLOR
                  }]}>
                    <Icon name="sign-in" size={14} color="#ffffff" />
                    <Text style={styles.profile_button_title}>Đăng nhập</Text>
                  </View>
                </TouchableHighlight>
              </View>
            )}

            {is_login && (
              <View style={{
                position: 'absolute',
                bottom: 0,
                right: 0
              }}>
                {logout_loading ? (
                  <Indicator size="small" />
                ) : (
                  <TouchableHighlight
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 15
                    }}
                    underlayColor="transparent"
                    onPress={this._onLogout.bind(this)}>
                    <Text style={{
                      color: "#cccccc",
                      fontSize: 10
                    }}>
                      <Icon name="sign-out" size={10} color="#cccccc" />
                      {" Đăng xuất"}
                    </Text>
                  </TouchableHighlight>
                )}
              </View>
            )}

          </ImageBackground>
        </View>

        <ScrollView
          onScroll={(event) => {
            this.setState({
              scrollTop: event.nativeEvent.contentOffset.y
            });
          }}
          ref={ref => this.refs_account = ref}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>
          {true && (
            <TouchableHighlight
              underlayColor="transparent">

              <View style={[styles.profile_list_opt_btn, {
                marginTop: 0,
                borderTopWidth: 0,
                borderColor: "#dddddd"
              }]}>

                <View style={[styles.profile_list_icon_box, styles.boxIconStyle, {
                  backgroundColor: DEFAULT_COLOR
                }]}>
                  <Icon name="credit-card" size={16} color="#ffffff" />
                </View>

                <View>
                  <Text style={styles.profile_list_label}>Tài khoản Cashback: <Text style={styles.profile_list_label_balance}>{user_info.vnd}</Text></Text>
                  <Text style={styles.profile_list_small_label}>{user_info.text_vnd}</Text>
                </View>

                {<View style={[styles.profile_list_icon_box, styles.profile_list_icon_box_angle]}>
                  <Icon name="angle-right" size={16} color="#999999" />
                </View>}
                
                {store.notify.notify_vnd > 0 && <View style={styles.stores_info_action_notify}>
                  <Text style={styles.stores_info_action_notify_value}>{store.notify.notify_vnd}</Text></View>}
              

              </View>

            </TouchableHighlight>
          )}
          {(
            <View style={{
                marginTop: 1,
                borderTopWidth: 0,
                borderColor: "#dddddd"
              }}>
              <View style={styles.add_store_actions_box}>
                <TouchableHighlight
                  // onPress={() => {Communications.phonecall(this.state.store_data.tel, true)}}
                  underlayColor="transparent"
                  style={styles.add_store_action_btn}>
                  <View style={styles.add_store_action_btn_box}>
                    <View style={styles.add_store_action_wallet}>
                    <Icon style={{color: 'blue'}} name="credit-card" size={16} color="#333333" /> 
                    <Text style={styles.add_store_action_wallet_text}>Đầu tư</Text>
                    </View>
                    <Text style={styles.add_store_action_wallet_content}>10.000 CPDT</Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  // onPress={() => {Communications.phonecall(this.state.store_data.tel, true)}}
                  underlayColor="transparent"
                  style={styles.add_store_action_btn}>
                  <View style={styles.add_store_action_btn_box}>
                    <View style={[styles.add_store_action_wallet,{
                      color: 'red'
                    }]}>
                      <Icon style={{color: 'red'}} name="credit-card" size={16} color="#333333" /> 
                      <Text style={styles.add_store_action_wallet_text}>Lending</Text>
                    </View>
                    <Text style={styles.add_store_action_wallet_content}>8.000.000 VND</Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={styles.add_store_actions_box}>
              <TouchableHighlight
                  // onPress={() => {Communications.phonecall(this.state.store_data.tel, true)}}
                  underlayColor="transparent"
                  style={styles.add_store_action_btn}>
                  <View style={styles.add_store_action_btn_box}>
                    <View style={styles.add_store_action_wallet}>
                    <Icon style={{color: '#cc9900'}} name="credit-card" size={16} color="#333333" /> 
                    <Text style={styles.add_store_action_wallet_text}>Sản phẩm</Text>
                    </View>
                    <Text style={styles.add_store_action_wallet_content}>2.000.000 MAC</Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  // onPress={() => {Communications.phonecall(this.state.store_data.tel, true)}}
                  underlayColor="transparent"
                  style={styles.add_store_action_btn}>
                  <View style={styles.add_store_action_btn_box}>
                    <View style={styles.add_store_action_wallet}>
                    <Icon style={{color: 'green'}} name="credit-card" size={16} color="#333333" /> 
                    <Text style={styles.add_store_action_wallet_text}>Đầu tư 4.0</Text>
                    </View>
                    <Text style={styles.add_store_action_wallet_content}>100.000.000 VND</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          )}
          {true && (
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => Actions.sync_ndt({title: "Nhập mã đồng bộ"})}
              >

              <View style={[styles.profile_list_opt_btn, {
                marginTop: 1,
                borderTopWidth: 0,
                borderColor: "#dddddd"
              }]}>

                <View style={[styles.profile_list_icon_box, styles.boxIconStyle, {
                  backgroundColor: "#688efb"
                }]}>
                  <Icon name="globe" size={16} color="#ffffff" />
                </View>

                <View>
                  <Text style={styles.profile_list_label}>Đồng bộ [Nhà đầu tư]</Text>
                  <Text style={styles.profile_list_small_label}>Tích hợp với tài khoản trên hệ thống Nhà đầu tư</Text>
                </View>

                <View style={[styles.profile_list_icon_box, styles.profile_list_icon_box_angle]}>
                  <Icon name="angle-right" size={16} color="#999999" />
                </View>
                

              </View>

            </TouchableHighlight>
          )}
          {this.state.options && (
            <SelectionList
              containerStyle={{
                marginTop: 8
              }}
              data={this.state.options} />
          )}

        </ScrollView>

        <Sticker
          active={this.state.sticker_flag}
          message="Thay ảnh đại diện thành công."
         />
      </View>
    );
  }

  _onLogout() {
    Alert.alert(
      'Lưu ý khi đăng xuất',
      'Bạn sẽ không nhận được thông báo khuyến mãi từ các cửa hàng của bạn cho tới khi đăng nhập lại.',
      [
        {text: 'Huỷ', onPress: () => {

        }},
        {text: 'Đăng xuất', onPress: () => {
          this.setState({
            logout_loading: true
          }, () => {
            this._logout();
          });
        }, style: "destructive"}
      ],
      { cancelable: false }
    );
  }

  async _logout() {
    try {
      var response = await APIHandler.user_logout();

      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          store.setUserInfo(response.data);

          store.resetCartData();

          store.setRefreshHomeChange(store.refresh_home_change + 1);

          store.setOrdersKeyChange(store.orders_key_change + 1);
        })();
      }
    } catch (e) {
      console.warn(e + ' user_logout');

      store.addApiQueue('user_logout', this._logout.bind(this));
    } finally {
      this.setState({
        logout_loading: false
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    marginBottom: BAR_HEIGHT
  },

  boxIconStyle: {
    backgroundColor: DEFAULT_COLOR,
    marginRight: 10,
    marginLeft: 6,
    borderRadius: 15
  },

  profile_cover_box: {
    width: '100%',
    backgroundColor: "#ccc",
    height: 180
  },
  profile_cover: {
    width: '100%',
    height: '100%'
  },
  profile_avatar_box: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    width: 80,
    height: 80,
    backgroundColor: "#cccccc",
    borderWidth: 2,
    borderColor: "#ffffff",
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  profile_avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    // resizeMode: 'cover'
  },

  point_icon: {
    width: 30,
    height: 30,
  },
  profile_button_box: {
    position: 'absolute',
    bottom: 42,
    right: 0,
    flexDirection: 'row'
  },
  profile_button_login_box: {
    backgroundColor: "#4267b2",
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 3,
    marginRight: 15
  },
  profile_button_title: {
    fontSize: 14,
    color: "#ffffff",
    marginLeft: 4
  },
  profile_list_opt: {
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  profile_list_opt_btn: {
    width: Util.size.width,
    height: 52,
    backgroundColor: "#ffffff",
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  profile_list_icon_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    marginLeft: 4,
    marginRight: 4
  },
  profile_list_icon_box_angle: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%'
  },
  profile_list_label: {
    fontSize: 16,
    color: "#000000",
    fontWeight: '400'
  },
  profile_list_label_balance: {
    fontSize: 16,
    color: DEFAULT_COLOR,
    fontWeight: '600'
  },

  profile_list_label_point: {
    fontSize: 16,
    color: "#e31b23",
    fontWeight: '600'
  },
  
  profile_list_label_invite_id: {
    fontSize: 16,
    color: "#51A9FF",
    fontWeight: '600'
  },
  profile_list_small_label: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2
  },
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#dddddd",
  },

  stores_info_action_notify: {
    position: 'absolute',
    minWidth: 16,
    paddingHorizontal: 2,
    height: 16,
    backgroundColor: 'red',
    top: 4,
    left: 30,
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
  
  profile_list_balance_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,
    height: 30,
    marginLeft: 4,
    marginRight: 4
  },
  profile_list_balance_box_angle: {
    position: 'absolute',
    top: 0,
    right: 20
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
  add_store_action_wallet_text: {
    fontSize: 15,
    color: '#404040',
    marginLeft: 3
  },
  add_store_action_wallet_content:{
    fontSize: 16,
    color: '#333333',
    fontWeight: '700'
  },
  add_store_action_wallet: {
    flexDirection: 'row',
    alignItems: 'stretch',
    // paddingVertical: 8,
    paddingHorizontal: 8,
    // marginRight: 8
  },
});
