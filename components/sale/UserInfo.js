/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Switch,
  Keyboard,
  ScrollView,
  Alert
} from 'react-native';

import PropTypes from 'prop-types';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

export default class UserInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      finish: false
    }
  }

  componentDidMount() {
    this._getData();
  }

  _getData = async () => {
    var {cart_data} = this.props;
    var {site_id} = cart_data;
    var user_id = cart_data.user.id;

    try {
      var response = await ADMIN_APIHandler.site_user_info(site_id, user_id);

      if (response && response.status == STATUS_SUCCESS) {
        var { name, tel, birthday, user_note, email, address } = response.data;
        this.setState({
          name, tel, birthday, user_note, email, address,
          finish: true
        });
      }
    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  _onSave() {
    alert('saved')
  }

  render() {
    var { edit_mode, name, tel, birthday, user_note, email, address, finish } = this.state;
    var is_go_confirm = this.props.redirect == 'confirm';

    if (finish == false) {
      return(
        <View style={styles.container}>
          <Indicator size="small" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={{

          }}>

          <View style={styles.input_box}>
            <TouchableHighlight
              underlayColor="#ffffff"
              onPress={() => {
                if (this.refs_name) {
                  this.refs_name.focus();
                }
              }}
            >
              <Text style={styles.input_label}>Tên</Text>
            </TouchableHighlight>

            <View style={styles.input_text_box}>
              <TextInput
                ref={ref => this.refs_name = ref}
                style={styles.input_text}
                keyboardType="default"
                maxLength={30}
                placeholder="Tên người nhận hàng"
                placeholderTextColor="#999999"
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  this.setState({
                    name: value
                  });
                }}
                value={this.state.name}
                onSubmitEditing={() => {
                  if (this.refs_tel) {
                    this.refs_tel.focus();
                  }
                }}
                returnKeyType="next"
                />
            </View>
          </View>

          <View style={styles.input_box}>
            <TouchableHighlight
              underlayColor="#ffffff"
              onPress={() => {
                if (this.refs_tel) {
                  this.refs_tel.focus();
                }
              }}
            >
              <Text style={styles.input_label}>Số điện thoại</Text>
            </TouchableHighlight>

            <View style={styles.input_text_box}>
              <TextInput
                ref={ref => this.refs_tel = ref}
                style={styles.input_text}
                keyboardType="phone-pad"
                maxLength={30}
                placeholder="Điền số điện thoại"
                placeholderTextColor="#999999"
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  this.setState({
                    tel: value.replaceAll(' ', '')
                  });
                }}
                value={this.state.tel}
                />
            </View>
          </View>

          <View style={styles.input_address_box}>
            <TouchableHighlight
              underlayColor="#ffffff"
              onPress={() => {
                if (this.refs_address) {
                  this.refs_address.focus();
                }
              }}
            >
              <View>
                <Text style={styles.input_label}>Địa chỉ</Text>
                <Text style={styles.input_label_help}>(Số nhà, tên toà nhà, tên đường, tên khu vực, thành phố)</Text>
              </View>
            </TouchableHighlight>

            <TextInput
              ref={ref => this.refs_address = ref}
              style={[styles.input_address_text, {height: this.state.address_height | 50}]}
              keyboardType="default"
              maxLength={250}
              placeholder="Nhập địa chỉ cụ thể"
              placeholderTextColor="#999999"
              multiline={true}
              underlineColorAndroid="transparent"
              onContentSizeChange={(e) => {
                this.setState({address_height: e.nativeEvent.contentSize.height});
              }}
              onChangeText={(value) => {
                this.setState({
                  address: value
                });
              }}
              value={this.state.address}
              />
          </View>

          <View style={styles.input_box}>
            <TouchableHighlight
              underlayColor="#ffffff"
              onPress={() => {
                if (this.refs_email) {
                  this.refs_email.focus();
                }
              }}
            >
              <Text style={styles.input_label}>Email</Text>
            </TouchableHighlight>

            <View style={styles.input_text_box}>
              <TextInput
                ref={ref => this.refs_email = ref}
                style={styles.input_text}
                keyboardType="default"
                maxLength={30}
                placeholder="Địa chỉ email"
                placeholderTextColor="#999999"
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  this.setState({
                    email: value
                  });
                }}
                value={this.state.email}
                onSubmitEditing={() => {
                  if (this.refs_zone) {
                    this.refs_zone.focus();
                  }
                }}
                returnKeyType="next"
                />
            </View>
          </View>

          <View style={styles.input_box}>
            <TouchableHighlight
              underlayColor="#ffffff"
              onPress={() => {
                if (this.refs_zone) {
                  this.refs_zone.focus();
                }
              }}
            >
              <Text style={styles.input_label}>Khu vực</Text>
            </TouchableHighlight>

            <View style={styles.input_text_box}>
              <TextInput
                ref={ref => this.refs_zone = ref}
                style={styles.input_text}
                keyboardType="default"
                maxLength={30}
                placeholder="Chọn khu vực"
                placeholderTextColor="#999999"
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  this.setState({
                    zone: value
                  });
                }}
                value={this.state.zone}
                onSubmitEditing={() => {

                }}
                returnKeyType="done"
                />
            </View>
          </View>
        </ScrollView>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={this._onSave.bind(this)}
          style={[styles.address_continue]}>
          <View style={[
            styles.address_continue_content,
            {flexDirection: is_go_confirm ? 'row-reverse' : 'row'}
          ]}>
            <View style={{
              minWidth: 20,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {this.state.finish_loading ? (
                <Indicator size="small" color="#ffffff" />
              ) : (
                <Icon name={this.state.edit_mode ? "save" : is_go_confirm ? "chevron-right" : "save"} size={20} color="#ffffff" />
              )}
            </View>
            <Text style={[styles.address_continue_title, {
              marginLeft: is_go_confirm ? 0 : 8,
              marginRight: is_go_confirm ? 8 : 0
            }]}>{this.state.edit_mode ? "LƯU LẠI" : is_go_confirm ? "TIẾP TỤC" : "LƯU LẠI"}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0
  },
  input_box: {
    width: '100%',
    height: 52,
    backgroundColor: "#ffffff",
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#dddddd",
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  input_text_box: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  input_label: {
    fontSize: 14,
    color: "#000000"
  },
  input_text: {
    width: '96%',
    height: 44,
    paddingLeft: 8,
    color: "#000000",
    fontSize: 14,
    textAlign: 'right',
    paddingVertical: 0
  },

  input_address_box: {
    width: '100%',
    minHeight: 100,
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#dddddd",
  },
  input_label_help: {
    fontSize: 12,
    marginTop: 2,
    color: "#666666"
  },
  input_address_text: {
    width: '100%',
    color: "#000000",
    fontSize: 14,
    marginTop: 4,
    paddingVertical: 0
  },

  address_continue: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 60
  },
  address_continue_content: {
    width: '100%',
    height: '100%',
    backgroundColor: DEFAULT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  address_continue_title: {
    color: '#ffffff',
    fontSize: 18
  }
});
