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
  Alert,
  FlatList
} from 'react-native';

import PropTypes from 'prop-types';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import DatePicker from 'react-native-datepicker';
import store from '../../store/Store';

@observer
export default class UserInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      finish: false,
      district_datas: [
        { key: Math.random(), name: 'Ba Đình' },
        { key: Math.random(), name: 'Hoàn Kiếm' },
        { key: Math.random(), name: 'Hai Bà Trưng' },
        { key: Math.random(), name: 'Đống Đa' },
        { key: Math.random(), name: 'Tây Hồ' },
        { key: Math.random(), name: 'Cầu Giấy' },
        { key: Math.random(), name: 'Thanh Xuân' },
        { key: Math.random(), name: 'Hoàng Mai' },
        { key: Math.random(), name: 'Long Biên' },
        { key: Math.random(), name: 'Bắc Từ Liêm' },
        { key: Math.random(), name: 'Thanh Trì' },
        { key: Math.random(), name: 'Gia Lâm' },
        { key: Math.random(), name: 'Đông Anh' },
        { key: Math.random(), name: 'Sóc Sơn' },
        { key: Math.random(), name: 'Hà Đông' },
        { key: Math.random(), name: 'Thị xã Sơn Tây' },
        { key: Math.random(), name: 'Ba Vì' },
        { key: Math.random(), name: 'Phúc Thọ' },
        { key: Math.random(), name: 'Thạch Thất' },
        { key: Math.random(), name: 'Quốc Oai' },
        { key: Math.random(), name: 'Chương Mỹ' },
        { key: Math.random(), name: 'Đan Phượng' },
        { key: Math.random(), name: 'Hoài Đức' },
        { key: Math.random(), name: 'Thanh Oai' },
        { key: Math.random(), name: 'Mỹ Đức' },
        { key: Math.random(), name: 'Ứng Hòa' },
        { key: Math.random(), name: 'Thường Tín' },
        { key: Math.random(), name: 'Phú Xuyên' },
        { key: Math.random(), name: 'Mê Linh' },
        { key: Math.random(), name: 'Nam Từ Liêm' }
      ]
    }
  }

  componentDidMount() {
    this._getData(0);
  }

  _getData = async (delay = 0) => {
    var {cart_data} = this.props;
    var {site_id} = cart_data;
    var user_id = cart_data.user.id;

    try {
      var response = await ADMIN_APIHandler.site_user_info(site_id, user_id);

      if (response && response.status == STATUS_SUCCESS) {
        var { name, tel, birthday, user_note, email, address, district } = response.data;
        setTimeout(() => {
          this.setState({
            name, tel, birthday, user_note, email, address, district,
            finish: true
          });

          layoutAnimation();
        }, delay);
      }
    } catch (e) {
      console.warn(e + ' site_user_info');

      store.addApiQueue('site_user_info', this._getData);
    } finally {

    }
  }

  async _onSave() {
    var {
      name,
      tel,
      birthday,
      email,
      address,
      district
    } = this.state;

    var {cart_data} = this.props;
    var {site_id} = cart_data;
    var user_id = cart_data.user.id;

    try {
      var response = await ADMIN_APIHandler.site_update_site_user(site_id, user_id, {
        name,
        tel,
        birthday,
        email,
        address,
        district
      });

      if (response && response.status == STATUS_SUCCESS) {
        Toast.show('Lưu thành công!');
      }

    } catch (e) {
      console.warn(e + ' site_update_site_user');

      store.addApiQueue('site_update_site_user', this._onSave.bind(this));
    } finally {

    }
  }

  render() {
    var {
      edit_mode,
      name,
      tel,
      birthday,
      user_note,
      email,
      address,
      district,
      district_datas,
      finish
    } = this.state;
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

          <View style={styles.input_box}>
            <TouchableHighlight
              underlayColor="#ffffff"
              onPress={() => {

              }}>
              <Text style={styles.input_label}>Sinh nhật</Text>
            </TouchableHighlight>

            <View style={[styles.input_text_box]}>
              <DatePicker
                style={{
                  width: 200
                }}
                date={birthday}
                mode="date"
                placeholder="Chọn ngày"
                format="YYYY-MM-DD"
                confirmBtnText="Xong"
                cancelBtnText="Huỷ"
                customStyles={{
                  dateInput: {
                    marginLeft: 36,
                    borderWidth: 0,
                    alignItems: 'flex-end'
                  }
                }}
                onDateChange={(date) => {
                  this.setState({
                    birthday: date
                  });
                }}
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
                this.ref_district.open();
              }}>
              <Text style={styles.input_label}>Khu vực</Text>
            </TouchableHighlight>

            <View style={[styles.input_text_box]}>
              <TouchableHighlight
                onPress={() => {
                  this.ref_district.open();
                }}
                underlayColor="transparent">
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                }}>
                  {!district && (
                    <Icon name="plus" color={DEFAULT_ADMIN_COLOR} size={14} />
                  )}
                  <Text style={{
                    color: DEFAULT_ADMIN_COLOR,
                    fontSize: 14,
                    paddingLeft: 4
                  }}>{district || 'Chọn khu vực'}</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>

        <Modal
          ref={ref => this.ref_district = ref}
          style={{
            width: Util.size.width * 0.8,
            height: Util.size.height * 0.6,
            borderRadius: 5,
            padding: 8
          }}
          swipeToClose={false}>

          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={district_datas}
            renderItem={({item, index}) => {
              var active = item.name == district;

              return(
                <TouchableHighlight
                  style={{
                    width: '100%',
                    height: 38,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: DEFAULT_ADMIN_COLOR,
                    borderWidth: Util.pixel,
                    marginTop: 8,
                    borderRadius: 2,
                    backgroundColor: active ? DEFAULT_ADMIN_COLOR : '#ffffff'
                  }}
                  onPress={this._chooseDistrict.bind(this, item)}
                  underlayColor="transparent">
                  <Text style={{
                    color: active ? '#ffffff' : DEFAULT_ADMIN_COLOR,
                    fontSize: 16
                  }}>{item.name}</Text>
                </TouchableHighlight>
              );
            }} />

        </Modal>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={this._onSave.bind(this)}
          style={[styles.address_continue, {
            bottom: store.keyboardTop
          }]}>
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
                <Icon name={"save"} size={20} color="#ffffff" />
              )}
            </View>
            <Text style={[styles.address_continue_title, {
              marginLeft: is_go_confirm ? 0 : 8,
              marginRight: is_go_confirm ? 8 : 0
            }]}>{"LƯU LẠI"}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  _chooseDistrict(item) {
    this.ref_district.close();

    this.setState({
      district: item.name
    });
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
    backgroundColor: DEFAULT_ADMIN_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  address_continue_title: {
    color: '#ffffff',
    fontSize: 18
  }
});
