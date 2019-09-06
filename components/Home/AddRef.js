/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  TextInput
} from 'react-native';

// library
import store from '../../store/Store';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

export default class AddRef extends Component {
  constructor(props) {
    super();

    this.state = {
      pageNum: 0,
      stores_data: null
    };
  }

  componentDidMount() {
    //GoogleAnalytic('_add_ref');
  }

  _onFinish() {
    Actions.myTabBar({
      type: ActionConst.RESET
    });
  }

  // thực hiện add cửa hàng vào account của user

  async _add_ref() {
    if (this.state.searchValue != undefined) {
      var response = await APIHandler.user_add_ref(this.state.searchValue);
      if (response) {
        if (response.status == STATUS_SUCCESS) {
          this._onFinish();
        } else {
          Toast.show(response.message);
        }
      } else {
        Toast.show('Có lỗi xảy ra, vui lòng thử lại');
      }
    }
  }

  _onChangeSearch(text) {
    this.setState({
      searchValue: text
    });
  }

  render() {
    var { pageNum } = this.state;

    return (
      <View style={styles.container}>
        <ImageBackground
          resizeMode="stretch"
          style={styles.image}
          source={require('../../images/bg.png')}
        >
          <ScrollView
            style={{
              marginBottom: store.keyboardTop
            }}
            keyboardShouldPersistTaps="always"
          >
            <View style={styles.store_result_item_image_box}>
              <CachedImage
                mutable
                style={styles.store_result_item_image}
                source={require('../../images/logo-640x410.jpg')}
              />
            </View>

            <View style={styles.invite_text_input}>
              <View style={styles.invite_text_input_sub}>
                <Text
                  style={{
                    fontWeight: '500',
                    color: '#444444',
                    fontSize: 16,
                    marginLeft: 0,
                    marginTop: 15,
                    marginBottom: 8
                  }}
                >
                  "Nhập số điện thoại Người giới thiệu để được giảm giá tới 30%"
                </Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  ref={ref => (this.searchInput = ref)}
                  // onLayout={() => {
                  //   if (this.searchInput) {
                  //     this.searchInput.focus();
                  //   }
                  // }}
                  style={{
                    height: 42,
                    width: 250,
                    borderColor: '#dddddd',
                    borderWidth: 1,
                    marginHorizontal: 15,
                    paddingHorizontal: 8,
                    borderRadius: 2,
                    color: '#404040',
                    fontSize: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff'
                  }}
                  placeholder=""
                  onChangeText={this._onChangeSearch.bind(this)}
                  onSubmitEditing={this._add_ref.bind(this)}
                  value={this.state.searchValue}
                />
                <TouchableHighlight
                  style={[
                    styles.buttonAction,
                    {
                      marginTop: 6
                    }
                  ]}
                  onPress={this._add_ref.bind(this)}
                  underlayColor="transparent"
                >
                  <View
                    style={[
                      styles.boxButtonAction,
                      {
                        backgroundColor: '#fa7f50',
                        borderColor: '#999999'
                      }
                    ]}
                  >
                    <Icon name="check" size={16} color="#ffffff" />
                    <Text
                      style={[
                        styles.buttonActionTitle,
                        {
                          color: '#ffffff'
                        }
                      ]}
                    >
                      Xác nhận
                    </Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  style={[
                    styles.buttonAction,
                    {
                      marginBottom: 20,
                      marginTop: 10
                    }
                  ]}
                  onPress={this._onFinish.bind(this)}
                  underlayColor="transparent"
                >
                  <Text
                    style={[
                      styles.buttonActionTitle,
                      {
                        color: '#666666'
                      }
                    ]}
                  >
                    Bỏ qua
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: '#ffffff'
  },

  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: '#cccccc'
  },

  store_result_item_image_box: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "",
    marginTop: 100
  },
  store_result_item_image: {
    width: 120,
    height: 75,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center'
  },

  invite_text_input: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "",
    marginTop: 10
  },

  invite_text_input_sub: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "",
    marginLeft: 20,
    marginRight: 20
  },
  boxButtonActions: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16
  },
  boxButtonAction: {
    flexDirection: 'row',
    borderWidth: Util.pixel,
    borderColor: '#666666',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    width: Util.size.width / 2 - 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonActionTitle: {
    color: '#333333',
    marginLeft: 4,
    fontSize: 14
  },
  image: {
    width: Util.size.width,
    height: Util.size.height - (isAndroid ? 24 : 0),
    alignItems: 'center'
  }
});
