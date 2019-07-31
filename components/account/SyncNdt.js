/* @flow */

import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Platform,
  TextInput
} from 'react-native';

// library
import store from '../../store/Store';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

export default class SyncNdt extends Component {
  constructor(props) {
    super();

    this.state = {
      pageNum: 0,
      stores_data: store.stores_data,
      user: store.user_info,
      loading: false,
      searchValue: ""
    }
  }

  componentDidMount() {
    GoogleAnalytic('_sync_ndt');
  }


  // thực hiện add cửa hàng vào account của user

  async _add_ref() {
    if (this.state.searchValue != undefined) {
      this.props.onSyncing(true);
      var response = await APIHandler.user_sync_ndt({ "code": this.state.searchValue });
      this.props.onSyncing(false);

      if (response) {
        if (response.status == STATUS_SUCCESS) {
          this.setState({ searchValue: "" });
          store.setUserInfo(response.data);
          Toast.show(response.message);
        } else {
          Toast.show(response.message);
        }
      } else {
        Toast.show("Có lỗi xảy ra, vui lòng thử lại");
      }
    }
  }

  _onChangeSearch(text) {
    this.setState({
      searchValue: text
    });
  }

  render() {
    var { pageNum, stores_data, user, loading } = this.state;
    let { containerStyle } = this.props;
    return (
      <View style={[styles.container]}>

        <ScrollView
          style={{
            marginBottom: store.keyboardTop
          }}
          keyboardShouldPersistTaps="always">
          <View style={[styles.invite_text_input, containerStyle]}>
            <View style={styles.invite_text_input_sub}>
              <Text style={{
                fontWeight: '500',
                color: "#444444",
                fontSize: 16,
                marginLeft: 0,
                marginBottom: 8,

              }}>
                Nhập mã đồng bộ trên Web [Nhà đầu tư] để đồng bộ tài khoản.
                </Text>
                <View style={{
                    flexDirection: 'row',
                  }}>
                <TextInput
                  underlineColorAndroid="transparent"
                  ref={ref => this.searchInput = ref}
                  // onLayout={() => {
                  //   if (this.searchInput) {
                  //     this.searchInput.focus();
                  //   }
                  // }}
                  style={{
                    height: 42,
                    width: 250,
                    borderColor: "#dddddd",
                    borderWidth: 1,
                    marginHorizontal: 15,
                    paddingHorizontal: 8,
                    borderRadius: 2,
                    color: "#404040",
                    fontSize: 18,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    backgroundColor: "#ffffff"
                  }}
                  placeholder=""
                  // keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                  // autoFocus
                  onChangeText={this._onChangeSearch.bind(this)}
                  onSubmitEditing={this._add_ref.bind(this)}
                  value={this.state.searchValue}
                />
                  <TouchableHighlight
                  underlayColor="transparent"
                  style={{
                    height: 42,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: "#ffffff"
                  }}
                  onPress={() => {
                    Actions.scan_qr_code({
                      onBackHandler: (site_code) => {
                        this.setState({
                          searchValue: site_code
                        }, () => {
                          Actions.refresh({
                            searchValue: site_code
                          });

                          this.search_handler = setTimeout(() => {
                            this._add_ref();
                          }, 300);
                        });
                      }
                    });
                  }}>
                  <Icon
                    style={{
                      marginLeft: 4
                    }}
                    name="qrcode" size={30} color="#333333" />
                </TouchableHighlight>
                </View>
              <Text style={styles.disclaimerText}>Chưa có mã đồng bộ, hãy đăng nhập vào trang [Nhà đầu tư], bấm vào [Đồng bộ tài khoản] để nhận mã.</Text>
              <TouchableHighlight
                style={[styles.buttonAction, {
                  marginTop: 6
                }]}
                onPress={this._add_ref.bind(this)}
                underlayColor="transparent">
                <View style={[styles.boxButtonAction, {
                  backgroundColor: "#fa7f50",
                  borderColor: "#999999"
                }]}>
                  <Icon name="check" size={16} color="#ffffff" />
                  <Text style={[styles.buttonActionTitle, {
                    color: "#ffffff"
                  }]}>Đồng bộ</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: "#ffffff"
  },

  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#cccccc"
  },

  store_result_item_image_box: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "",
    marginTop: 40
  },
  store_result_item_image: {
    width: 240,
    height: 150,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },

  invite_text_input: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "",
    // marginTop: 30,
    marginTop: 145,
  },

  invite_text_input_sub: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "",
    marginLeft: 20,
    marginRight: 20
  },
  boxButtonActions: {
    backgroundColor: "#ffffff",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16
  },
  boxButtonAction: {
    flexDirection: 'row',
    borderWidth: Util.pixel,
    borderColor: "#666666",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    width: Util.size.width / 2 - 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonActionTitle: {
    color: "#333333",
    marginLeft: 4,
    fontSize: 14
  },
  image: {
    width: Util.size.width,
    height: Util.size.height - (isAndroid ? 24 : 0),
    alignItems: 'center'
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
  add_store_action_wallet_content: {
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
  ndt_history: {
    // backgroundColor: "",
    marginTop: 10
  },

  ndt_history_sub: {
    // backgroundColor: "",
    marginLeft: 20,
    marginRight: 20
  },
  disclaimerText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
    color: 'grey'
  },
});

SyncNdt.defaultProps = {
  isAppBegin: true,
  onSuccess: () => { }
}
