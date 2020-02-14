import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
import Communications from 'react-native-communications';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import store from '../../store/Store';
import RNFetchBlob from 'rn-fetch-blob';
import Sticker from '../Sticker';
import { reaction } from 'mobx';
import SelectionList from '../SelectionList';
import appConfig from 'app-config';

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      logout_loading: false,
      sticker_flag: false,
      avatar_loading: false,
      scrollTop: 0
    };

    reaction(() => store.user_info, this.initial);
  }

  initial = callback => {
    const isAdmin = store.user_info.admin_flag == 1;
    var notify = store.notify;
    const isUpdate = notify.updating_version == 1;

    this.setState(
      {
        options: [
          {
            key: '1',
            icon: 'map-marker',
            label: 'Địa chỉ của tôi',
            desc: 'Quản lý địa chỉ nhận hàng',
            rightIcon: <IconAngleRight />,
            onPress: () =>
              Actions.push(appConfig.routes.myAddress, {
                from_page: 'account'
              }),
            boxIconStyle: [
              styles.boxIconStyle,
              {
                backgroundColor: '#fcb309'
              }
            ],
            iconColor: '#ffffff'
          },

          {
            key: '2',
            icon: 'facebook-square',
            label: 'Fanpage ' + APP_NAME_SHOW,
            desc: 'Facebook Fanpage chăm sóc khách hàng',
            rightIcon: <IconAngleRight />,
            onPress: () => Communications.web(APP_FANPAGE),
            boxIconStyle: [
              styles.boxIconStyle,
              {
                backgroundColor: '#4267b2'
              }
            ],
            iconColor: '#ffffff',
            marginTop: !isAdmin
          },

          {
            key: '3',
            icon: 'handshake-o',
            label: 'Về ' + APP_NAME_SHOW + ' - Điều khoản sử dụng',
            desc: 'Điều khoản sử dụng',
            rightIcon: <IconAngleRight />,
            onPress: () =>
              Actions.webview({
                title: 'Về ' + APP_NAME_SHOW,
                url: APP_INFO
              }),
            boxIconStyle: [
              styles.boxIconStyle,
              {
                backgroundColor: DEFAULT_COLOR
              }
            ],
            iconColor: '#ffffff'
            // marginTop: true
          },

          {
            key: '4',
            icon: 'question-circle',
            label: 'Thông tin ứng dụng',
            desc:
              'Sản phẩm của ' +
              APP_NAME_SHOW +
              ' - Phiên bản hiện tại: ' +
              DeviceInfo.getVersion(),
            rightIcon: <IconAngleRight />,
            onPress: () => {},
            boxIconStyle: [
              styles.boxIconStyle,
              {
                backgroundColor: '#688efb'
              }
            ],
            iconColor: '#ffffff',
            hideAngle: true,
            marginTop: true
          },
          {
            key: '5',
            isHidden: !isUpdate,
            icon: 'cloud-download',
            label: 'Cập nhật ứng dụng',
            desc:
              'Cập nhật lên phiên bản ổn định ' + notify.new_version + ' ngay!',
            rightIcon: <IconAngleRight />,
            onPress: () => {
              if (notify.url_update) {
                Communications.web(notify.url_update);
              }
            },
            boxIconStyle: [
              styles.boxIconStyle,
              {
                backgroundColor: '#dd4b39'
              }
            ],
            notify: 'updating_version',
            iconColor: '#ffffff'
          }
        ]
      },
      () => {
        if (typeof callback == 'function') {
          callback();
        }
      }
    );
  };

  onRefresh() {
    this.setState({ refreshing: true }, () => {
      this.login(1000);
    });
  }

  showSticker() {
    this.setState(
      {
        sticker_flag: true
      },
      () => {
        setTimeout(() => {
          this.setState({
            sticker_flag: false
          });
        }, 2000);
      }
    );
  }

  onTapAvatar() {
    const options = {
      title: 'Cập nhật ảnh đại diện tài khoản',
      cancelButtonTitle: 'Huỷ bỏ',
      takePhotoButtonTitle: 'Chụp ảnh',
      chooseFromLibraryButtonTitle: 'Chọn ảnh từ thư viện',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.error) {
        console.log(response.error);
      } else if (response.didCancel) {
        console.log(response);
      } else {
        // console.log(response);
        this.uploadAvatar(response);
      }
    });
  }

  uploadAvatar(response) {
    this.setState(
      {
        avatar_loading: true
      },
      () => {
        const avatar = {
          name: 'avatar',
          filename: response.fileName,
          data: response.data
        };
        console.log(APIHandler.url_user_add_avatar());
        // call api post my form data
        RNFetchBlob.fetch(
          'POST',
          APIHandler.url_user_add_avatar(),
          {
            'Content-Type': 'multipart/form-data'
          },
          [avatar]
        )
          .then(resp => {
            var { data } = resp;
            var response = JSON.parse(data);
            if (response && response.status == STATUS_SUCCESS) {
              this.showSticker();
              this.setState({
                avatar_loading: false
              });
            }
          })
          .catch(error => {
            console.log(error);
            store.addApiQueue(
              'url_user_add_avatar',
              this.uploadAvatar.bind(this, response)
            );
          });
      }
    );
  }

  componentDidMount() {
    this.initial(() => {
      this.key_add_new = this.state.options.length;
      store.is_stay_account = true;
      store.parentTab = '_account';
    });
    EventTracker.logEvent('Account');
  }

  login = async delay => {
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
    } catch (error) {
      console.log(error);
      store.addApiQueue('user_login', () => this.login(delay));
    }
  };

  handleShowProfileDetail = () => {
    Actions.profile_detail({
      userInfo: store.user_info
    });
  };

  handleLogin = () => {
    Actions.push('phone_auth', {
      loginMode: store.store_data.loginMode
        ? store.store_data.loginMode
        : 'FIREBASE' //FIREBASE / SMS_BRAND_NAME
    });
  };

  render() {
    const { user_info } = store;
    const is_login =
      store.user_info != null && store.user_info.username != null;
    const { avatar_loading, logout_loading } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          scrollEventThrottle={16}
          onScroll={event => {
            this.setState({
              scrollTop: event.nativeEvent.contentOffset.y
            });
          }}
          ref={ref => (this.refs_account = ref)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
        >
          <>
            {is_login ? (
              <TouchableHighlight
                onPress={this.handleShowProfileDetail}
                style={[
                  styles.profile_list_opt_btn,
                  styles.profile_user_container,
                  { flex: 1, flexDirection: 'row' }
                ]}
                underlayColor="rgba(255,255,255,.7)"
              >
                <>
                  <TouchableHighlight
                    onPress={this.onTapAvatar.bind(this)}
                    style={styles.profile_avatar_box}
                    underlayColor="transparent"
                  >
                    {avatar_loading ? (
                      <View style={{ width: '100%', height: '100%' }}>
                        <Indicator size="small" />
                      </View>
                    ) : (
                      <View>
                        <CachedImage
                          mutable
                          style={styles.profile_avatar}
                          source={{
                            uri: store.user_info ? store.user_info.img : ''
                          }}
                        />
                      </View>
                    )}
                  </TouchableHighlight>

                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      alignItems: 'center'
                    }}
                  >
                    <View>
                      <Text
                        style={[
                          styles.profile_list_label,
                          {
                            fontSize: 18
                          }
                        ]}
                        numberOfLines={1}
                      >
                        {user_info.name}
                      </Text>

                      <Text
                        style={[
                          styles.profile_list_small_label,
                          {
                            fontSize: 14,
                            marginTop: 5
                          }
                        ]}
                      >
                        {user_info.tel}
                      </Text>
                    </View>

                    {
                      <View
                        style={[
                          styles.profile_list_icon_box,
                          styles.profile_list_icon_box_angle,
                          { marginRight: 0 }
                        ]}
                      >
                        <IconAngleRight />
                      </View>
                    }
                  </View>
                </>
              </TouchableHighlight>
            ) : (
              <TouchableHighlight
                style={[
                  styles.profile_user_container,
                  {
                    flexDirection: 'row',
                    backgroundColor: '#ffffff',
                    paddingVertical: 10,
                    paddingBottom: 0
                  }
                ]}
                underlayColor="rgba(255,255,255,.7)"
                onPress={this.handleLogin}
              >
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <IconMaterialCommunity
                    name="account-circle"
                    size={55}
                    color="#c7c7cd"
                  />
                  <View
                    style={[
                      styles.profile_button_login_box,
                      {
                        backgroundColor: 'transparent'
                      }
                    ]}
                  >
                    <Text style={[styles.profile_button_title]}>Đăng nhập</Text>
                  </View>
                  <IconMaterialCommunity
                    name="login-variant"
                    size={24}
                    color="#242424"
                    style={{
                      position: 'absolute',
                      right: 15,
                      alignSelf: 'center'
                    }}
                  />
                </View>
              </TouchableHighlight>
            )}
          </>

          {user_info.default_wallet && ( //vnd_wallet
            <View
              style={{
                marginTop: 1,
                borderTopWidth: 0,
                borderColor: '#dddddd'
              }}
            >
              <TouchableHighlight
                underlayColor="transparent"
                onPress={() =>
                  Actions.push(appConfig.routes.vndWallet, {
                    title: user_info.default_wallet.name,
                    wallet: user_info.default_wallet
                  })
                }
              >
                <View
                  style={[
                    styles.profile_list_opt_btn,
                    {
                      marginTop: 0,
                      borderTopWidth: 0,
                      borderColor: '#dddddd'
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.profile_list_icon_box,
                      styles.boxIconStyle,
                      {
                        backgroundColor: user_info.default_wallet.color
                      }
                    ]}
                  >
                    <Icon
                      name={user_info.default_wallet.icon}
                      size={16}
                      color="#ffffff"
                    />
                  </View>

                  <View>
                    <Text style={styles.profile_list_label}>
                      {user_info.default_wallet.name}:{' '}
                      <Text
                        style={[
                          styles.profile_list_label_balance,
                          { color: user_info.default_wallet.color }
                        ]}
                      >
                        {user_info.default_wallet.balance_view}
                      </Text>
                    </Text>
                  </View>

                  {
                    <View
                      style={[
                        styles.profile_list_icon_box,
                        styles.profile_list_icon_box_angle
                      ]}
                    >
                      <IconAngleRight />
                    </View>
                  }
                </View>
              </TouchableHighlight>
            </View>
          )}
          {user_info.wallets && (
            <View
              style={{
                marginTop: 7,
                borderTopWidth: 0,
                borderColor: '#dddddd'
              }}
            >
              <View style={styles.add_store_actions_box}>
                {user_info.wallets.map((wallet, index) => (
                  <TouchableHighlight
                    key={index}
                    onPress={
                      wallet.address
                        ? () =>
                            Actions.push(appConfig.routes.vndWallet, {
                              title: wallet.name,
                              wallet: wallet
                            })
                        : () => {}
                    }
                    underlayColor="transparent"
                    style={styles.add_store_action_btn}
                  >
                    <View style={styles.add_store_action_btn_box}>
                      <View style={styles.add_store_action_wallet}>
                        <Text style={styles.add_store_action_wallet_text}>
                          <Icon
                            name={wallet.icon}
                            size={16}
                            color={wallet.color}
                          />{' '}
                          {wallet.name}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.add_store_action_wallet_content,
                          { color: wallet.color }
                        ]}
                      >
                        {wallet.balance_view}
                      </Text>
                    </View>
                  </TouchableHighlight>
                ))}
              </View>
            </View>
          )}
          {user_info.ext_wallets && (
            <View
              style={{
                marginTop: 1,
                borderTopWidth: 0,
                borderColor: '#dddddd'
              }}
            >
              <View style={styles.add_store_actions_box}>
                {user_info.ext_wallets.map((wallet, index) => (
                  <TouchableHighlight
                    key={index}
                    onPress={
                      wallet.address
                        ? () =>
                            Actions.push(appConfig.routes.vndWallet, {
                              title: wallet.name,
                              wallet: wallet
                            })
                        : () => Actions.view_ndt_list()
                    }
                    underlayColor="transparent"
                    style={styles.add_store_action_btn}
                  >
                    <View style={styles.add_store_action_btn_box}>
                      <View style={styles.add_store_action_wallet}>
                        <Text style={styles.add_store_action_wallet_text}>
                          <Icon
                            name={wallet.icon}
                            size={16}
                            color={wallet.color}
                          />{' '}
                          {wallet.name}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.add_store_action_wallet_content,
                          { color: wallet.color }
                        ]}
                      >
                        {wallet.balance_view}
                      </Text>
                    </View>
                  </TouchableHighlight>
                ))}
              </View>
            </View>
          )}

          {!!user_info.username && (
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() =>
                Actions.affiliate({
                  aff_content: store.store_data
                    ? store.store_data.aff_content
                    : 'Thông tin chương trình tiếp thị liên kết cùng ' +
                      APP_NAME_SHOW
                })
              }
            >
              <View
                style={[
                  styles.profile_list_opt_btn,
                  {
                    marginTop: 1,
                    borderTopWidth: 0,
                    borderColor: '#dddddd'
                  }
                ]}
              >
                <View
                  style={[
                    styles.profile_list_icon_box,
                    styles.boxIconStyle,
                    {
                      backgroundColor: '#51A9FF'
                    }
                  ]}
                >
                  <Icon name="commenting-o" size={16} color="#ffffff" />
                </View>

                <View>
                  <Text style={styles.profile_list_label}>
                    Mã giới thiệu:{' '}
                    <Text style={styles.profile_list_label_invite_id}>
                      {user_info.username}
                    </Text>
                  </Text>
                  <Text style={styles.profile_list_small_label}>
                    {user_info.text_invite}
                  </Text>
                </View>

                <View
                  style={[
                    styles.profile_list_icon_box,
                    styles.profile_list_icon_box_angle
                  ]}
                >
                  <IconAngleRight />
                </View>
              </View>
            </TouchableHighlight>
          )}

          {user_info.view_tab_ndt && (
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => Actions.view_ndt_list()}
            >
              <View
                style={[
                  styles.profile_list_opt_btn,
                  {
                    marginTop: 7,
                    borderTopWidth: 0,
                    borderColor: '#dddddd'
                  }
                ]}
              >
                <View
                  style={[
                    styles.profile_list_icon_box,
                    styles.boxIconStyle,
                    {
                      backgroundColor: '#1fa67a'
                    }
                  ]}
                >
                  <Icon name="share-alt" size={16} color="#ffffff" />
                </View>

                <View>
                  <Text style={styles.profile_list_label}>
                    Tài khoản [Nhà đầu tư]
                  </Text>
                  <Text style={styles.profile_list_small_label}>
                    Đồng bộ với tài khoản trên hệ thống Nhà đầu tư
                  </Text>
                </View>

                <View
                  style={[
                    styles.profile_list_icon_box,
                    styles.profile_list_icon_box_angle
                  ]}
                >
                  <IconAngleRight />
                </View>
              </View>
            </TouchableHighlight>
          )}
          {user_info.view_tab_invite && (
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => Actions._add_ref({ title: 'Nhập mã giới thiệu' })}
            >
              <View
                style={[
                  styles.profile_list_opt_btn,
                  {
                    marginTop: 1,
                    borderTopWidth: 0,
                    borderColor: '#dddddd'
                  }
                ]}
              >
                <View
                  style={[
                    styles.profile_list_icon_box,
                    styles.boxIconStyle,
                    {
                      backgroundColor: '#688efb'
                    }
                  ]}
                >
                  <Icon name="globe" size={16} color="#ffffff" />
                </View>

                <View>
                  <Text style={styles.profile_list_label}>
                    Nhập mã giới thiệu
                  </Text>
                  <Text style={styles.profile_list_small_label}>
                    Tham gia hệ thống Cashback 4.0
                  </Text>
                </View>

                <View
                  style={[
                    styles.profile_list_icon_box,
                    styles.profile_list_icon_box_angle
                  ]}
                >
                  <IconAngleRight />
                </View>
              </View>
            </TouchableHighlight>
          )}
          {this.state.options && (
            <SelectionList
              containerStyle={{
                marginTop: 8
              }}
              data={this.state.options}
            />
          )}
        </ScrollView>

        <Sticker
          active={this.state.sticker_flag}
          message="Thay ảnh đại diện thành công."
        />
      </View>
    );
  }

  handleLogout() {
    Alert.alert(
      'Lưu ý khi đăng xuất',
      'Bạn sẽ không nhận được thông báo khuyến mãi từ các cửa hàng của bạn cho tới khi đăng nhập lại.',
      [
        {
          text: 'Huỷ',
          onPress: () => {}
        },
        {
          text: 'Đăng xuất',
          onPress: this.logout,
          style: 'destructive'
        }
      ],
      { cancelable: false }
    );
  }

  logout = async () => {
    this.setState({
      logout_loading: true
    });
    try {
      const response = await APIHandler.user_logout();
      if (response && response.status == STATUS_SUCCESS) {
        EventTracker.removeUserId();
        store.setUserInfo(response.data);
        store.resetCartData();
        store.setRefreshHomeChange(store.refresh_home_change + 1);
        store.setOrdersKeyChange(store.orders_key_change + 1);
        flashShowMessage({
          message: 'Đăng xuất thành công',
          type: 'info'
        });
        Actions.reset(appConfig.routes.sceneWrapper);
      } else {
        flashShowMessage({
          message: 'Đăng xuất không thành công',
          type: 'info'
        });
      }
    } catch (error) {
      console.log(error);
      store.addApiQueue('user_logout', this.logout.bind(this));
    } finally {
      this.setState({
        logout_loading: false
      });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  },

  boxIconStyle: {
    backgroundColor: DEFAULT_COLOR,
    marginRight: 10,
    marginLeft: 6,
    borderRadius: 15
  },
  profile_user_container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 7,
    height: null,
    paddingVertical: 15,
    paddingLeft: 15
  },
  profile_avatar_box: {
    width: 60,
    height: 60,
    backgroundColor: '#cccccc',
    borderWidth: 2,
    borderColor: '#a9a9a9',
    borderRadius: 30,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  profile_avatar: {
    width: 56,
    height: 56,
    borderRadius: 28
    // resizeMode: 'cover'
  },

  point_icon: {
    width: 30,
    height: 30
  },
  profile_button_box: {
    bottom: 42,
    right: 0,
    flexDirection: 'row'
  },
  profile_button_login_box: {
    backgroundColor: appConfig.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 15
  },
  profile_button_title: {
    fontSize: 16,
    color: DEFAULT_COLOR,
    fontWeight: 'bold'
  },
  profile_list_opt: {
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd'
  },
  profile_list_opt_btn: {
    width: Util.size.width,
    height: 52,
    backgroundColor: '#ffffff',
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

  profile_list_icon_box_small: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    marginLeft: 3,
    marginRight: 0
  },
  profile_list_icon_box_angle: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%'
  },
  profile_list_label: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400'
  },
  profile_list_label_balance: {
    fontSize: 18,
    color: '#922B21',
    fontWeight: '600',
    left: 20
  },
  profile_list_label_address: {
    fontSize: 16,
    color: '#0E6655',
    fontWeight: '600'
  },

  profile_list_label_point: {
    fontSize: 16,
    color: '#e31b23',
    fontWeight: '600'
  },

  profile_list_label_invite_id: {
    fontSize: 16,
    color: '#51A9FF',
    fontWeight: '600'
  },
  profile_list_small_label: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2
  },
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: '#dddddd'
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
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd'
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
    fontSize: 14,
    color: '#404040',
    marginLeft: 0,
    marginTop: 3
  },
  add_store_action_wallet_content: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '700'
  },
  add_store_action_wallet: {
    flexDirection: 'row',
    alignItems: 'stretch',
    // paddingVertical: 8,
    paddingHorizontal: 8
    // marginRight: 8
  }
});

export default observer(Account);

const IconAngleRight = () => (
  <Icon name="angle-right" size={26} color="#999999" />
);
