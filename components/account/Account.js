/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
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

// components
import SelectionList from '../SelectionList';

@observer
export default class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
          key: 2,
          icon: "commenting-o",
          label: "Gửi phản hồi tới quản trị ứng dụng",
          desc: "Đóng góp, ý kiến của bạn",
          onPress: () => {
            var user = {}
            // edit...
            var to = 'support@myfood.com.vn';
            var subject = '';

            var body = '';

            Communications.email([to], null, null, subject, body);
          },
          boxIconStyle: [styles.boxIconStyle, {
            backgroundColor: "#ff6d64"
          }],
          iconColor: "#ffffff"
          // marginTop: true
        },

        {
          key: 3,
          icon: "map-marker",
          label: "Địa chỉ của bạn",
          desc: "Quản lý địa chỉ nhận hàng",
          onPress: () => Actions.address({
            from: "account"
          }),
          boxIconStyle: [styles.boxIconStyle, {
            backgroundColor: "#fcb309"
          }],
          iconColor: "#ffffff",
          marginTop: true
        },

        {
          key: 4,
          icon: "facebook-square",
          label: "Fanpage MyFood",
          desc: "Facebook fanpage của ứng dụng",
          onPress: () => Communications.web("http://fanpage.myfood.com.vn"),
          boxIconStyle: [styles.boxIconStyle, {
            backgroundColor: "#4267b2"
          }],
          iconColor: "#ffffff",
          marginTop: true
        },

        {
          key: 5,
          icon: "handshake-o",
          label: "Về MyFood - Điều khoản sử dụng",
          desc: "Điều khoản sử dụng MyFood",
          onPress: () => Actions.webview({
            title: "Về MyFood",
            url: MY_FOOD_API + "info/privacy"
          }),
          boxIconStyle: [styles.boxIconStyle, {
            backgroundColor: DEFAULT_COLOR
          }],
          iconColor: "#ffffff",
          // marginTop: true
        },

        {
          key: 6,
          icon: "question-circle",
          label: "Thông tin ứng dụng",
          desc: "Sản phẩm của MyFood - Phiên bản: 1.0.0",
          onPress: () => 1,
          boxIconStyle: [styles.boxIconStyle, {
            backgroundColor: "#688efb"
          }],
          iconColor: "#ffffff",
          hideAngle: true,
          marginTop: true
        }
      ],
      refreshing: false,
      logout_loading: false,
      sticker_flag: false,
      avatar_loading: false,
      scrollTop: 0
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});

    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
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
      title: 'Cập nhật ảnh đại diện',
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
          });
        });

      }
    });

  }

  componentDidMount() {
    this.setState({
      finish: true
    });
    store.is_stay_account = true;
  }

  componentWillReceiveProps() {
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

              this.setState({
                refreshing: false
              });
            })();
          }, delay || 0);
        }
      } catch (e) {
        console.warn(e + ' user_login');
      }
    });
  }

  render() {

    var is_login = store.user_info != null && store.user_info.verify_flag == STATUS_VERIFYED;
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
        <Image style={styles.profile_avatar} source={{uri: store.user_info.img}} />
      );
    }

    return (
      <View style={styles.container}>
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
          }
          >

          <View style={styles.profile_cover_box}>
            <Image style={styles.profile_cover} source={require('../../images/profile_bgr.jpg')}>

              <TouchableHighlight
                style={styles.profile_avatar_box}
                underlayColor="#cccccc"
                onPress={this._onTapAvatar.bind(this)}>
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

            </Image>
          </View>

          <SelectionList
            containerStyle={{
              marginTop: 8
            }}
            data={this.state.options} />

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
      'Thông báo',
      'Bạn chắc chắn muốn đăng xuất?',
      [
        {text: 'Không', onPress: () => {

        }},
        {text: 'Có', onPress: () => {
          this.setState({
            logout_loading: true
          }, async () => {
            try {
              var response = await APIHandler.user_logout();

              if (response && response.status == STATUS_SUCCESS) {
                action(() => {
                  store.setUserInfo(response.data);

                  store.resetCartData();

                  store.setRefreshHomeChange(store.refresh_home_change + 1);
                })();
              }
            } catch (e) {
              console.warn(e + ' user_logout');
            } finally {
              this.setState({
                logout_loading: false
              });
            }
          });
        }}
      ],
      { cancelable: false }
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1"
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
    height: '100%',
    resizeMode: 'cover'
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
    resizeMode: 'cover'
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
  }
});
