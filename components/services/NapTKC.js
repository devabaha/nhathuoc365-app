/* @flow */

import React, {Component} from 'react';
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
  Image,
  FlatList,
  Platform
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions, ActionConst} from 'react-native-router-flux';
import {Button} from '../../lib/react-native-elements';
import store from "../../store/Store";

@observer
export default class NapTKC extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: '',
      telco: '',
      price_list: [],
      price: 0,
      discount: 0,
      pay: 0,
      price_select: '',
      discount_label: '',
      loading: true,
      text_tel: ''
    }
  }

  componentDidMount() {
    this._getData();
  }

  async _getData(delay) {
    try {
      var response = await APIHandler.service_detail('nap_tkc', this.props.store.store_id);

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          let data_price_list = {};
          let price = 0;
          let discount = 0;
          let unit = '';
          let discount_label = '';
          let telco_name = '';
          let pay = 0;
          if (response.data && Object.keys(response.data.service_info_list_childs).length > 0) {
            Object.keys(response.data.service_info_list_childs).map(key => {
              price = Number(response.data.service_info_list_childs[0].price);
              discount = Number(response.data.service_info_list_childs[0].discount);
              unit = response.data.service_info_list_childs[0].unit;
              discount_label = ((discount * 50000) / 100).toString() + " " + unit;
              telco_name = response.data.service_info_list_childs[0].name;
              pay = price - (price * discount) / 100;

              let service_phone_card_default = response.data.service_info_list_childs[0].data;
              let json_price_list = JSON.parse(service_phone_card_default);
              if (json_price_list.price_list != "undefined") {
                data_price_list = json_price_list.price_list;
              }
            });
          }

          this.setState({
            data: response.data,
            loading: false,
            telco: telco_name,
            price: price,
            discount: discount,
            pay: pay,
            price_select: '50.000 đ',
            price_list: data_price_list,
            discount_label: discount_label,
          });
        }, delay || 0);
      }
    } catch (e) {
      console.log(e + ' service_phone_card');

    } finally {

    }
  }

  onPressChooseTelco(telco_id, price_list = "{}", price, discount, unit) {
    // Fix for api
    let pay = 50000 - (price * discount) / 100;
    let json_price_list = JSON.parse(price_list);
    let data_price_list = {};
    if (json_price_list.price_list != "undefined") {
      data_price_list = json_price_list.price_list;
    }

    let discount_label = ((discount * 50000) / 100).toString() + " " + unit;
    this.setState({
      telco: telco_id,
      price: 50000,
      discount: discount,
      pay: pay,
      price_select: '50.000 đ',
      price_list: data_price_list,
      discount_label: discount_label,
    }, () => console.log());
  }

  onPressChoosePrice(telco_id, price, discount, label, discount_label) {
    if (this.state.telco === '') {
      return Alert.alert(
        'Thông báo',
        'Bạn cần chọn nhà  tiếp tục',
        [
          {
            text: 'Đồng ý', onPress: () => {
            }
          },
        ],
        {cancelable: false}
      );
    } else {
      let pay = price - (price * discount) / 100;
      this.setState({
        price: price,
        discount: discount,
        pay: pay,
        price_select: label,
        discount_label: discount_label,
      }, () => console.log());
    }
  }

  render() {
    let help_content = '';
    if (this.state.data && Object.keys(this.state.data.service_info).length > 0) {
      Object.keys(this.state.data.service_info).map(key => {
        let service_info = this.state.data.service_info[key];
        help_content = service_info.content;
      });
    }
    console.log(this.state);
    return (
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={{
            marginBottom: 150,
          }}>

          {/* Block chon nha mang */}
          <View style={styles.provinder_box}>
            <FlatList
              ref="telco_list"
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.state.data.service_info_list_childs}
              extraData={this.state}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={
                () => <View style={{width: ~~(Util.size.width / 25)}}/>
              }
              renderItem={({item}) => (
                <TouchableHighlight
                  id={item.id}
                  underlayColor="transparent"
                  onPress={() => this.onPressChooseTelco(item.name, item.data, item.price, item.discount, item.unit)}
                  style={this.state.telco === item.name
                    ? styles.provinder_box_action_btn_active
                    : styles.provinder_box_action_btn}>
                  <View style={styles.provinder_box_action_logo}>
                    <Image style={this.state.telco === item.name
                      ? styles.provinder_logo_active
                      : styles.provinder_logo}
                           source={{uri: MY_FOOD_API + item.image}}
                    />
                  </View>
                </TouchableHighlight>
              )}
            />
          </View>

          {/* Block chon menh gia the */}
          <View style={styles.block_choose_price_option}>
            <View style={{flexDirection: 'row', alignItems: "center", marginBottom: 10,}}>
              <Icon
                style={styles.icon_label}
                name="info-circle"
                size={12}
                color="#999999"
              />
              <Text style={styles.input_label_header}>
                {this.state.telco === ''
                  ? "Vui lòng chọn nhà mạng"
                  : "Chọn số tiền nạp"}
              </Text>
            </View>

            <View style={styles.choose_price_option}>
              {this.state.price_list.map((item) => {
                return (
                  <TouchableHighlight
                    key={item.value}
                    onPress={() => this.onPressChoosePrice(item.telco_id, item.value, item.discount, item.label, item.discount_label)}
                    ref="price_list"
                    underlayColor="transparent">
                    <View
                      style={this.state.price === item.value
                        ? styles.boxButtonActionChoosePriceActive
                        : styles.boxButtonActionChoosePrice}>
                      <Text
                        style={this.state.price === item.value
                          ? styles.buttonActionTitleActive
                          : styles.buttonActionTitle}>{item.label}</Text>
                      <Text
                        style={this.state.price === item.value
                          ? styles.buttonActionSubTitleActive
                          : styles.buttonActionSubTitle}>Hoàn lại {item.discount_label}</Text>
                    </View>
                  </TouchableHighlight>
                );
              })}
            </View>
          </View>

          {/* Block nhap so dien thoai */}
          <View style={styles.block_choose_price_option}>
            <View style={{flexDirection: 'row', alignItems: "center", marginBottom: 10,}}>
              <Icon
                style={styles.icon_label}
                name="phone-square"
                size={12}
                color="#999999"
              />
              <Text style={styles.input_label_header}>
                Nhập số điện thoại nạp
              </Text>
            </View>

            <View>
              <TextInput
                ref={ref => this.refs_tel = ref}
                style={{
                  paddingLeft: 15, height: 40, borderWidth: 1, fontSize: 16,
                  borderColor: "#dddddd"
                }}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text_tel}
                keyboardType="phone-pad"
                maxLength={30}
                placeholder="Nhập số điện thoại"
                placeholderTextColor="#dddddd"
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  this.setState({
                    text_tel: value.replaceAll(' ', '')
                  });
                }}
              />
            </View>
          </View>

          {/* Block thong tin chi tiet*/}
          <View style={styles.block_help_box}>
            <TouchableHighlight underlayColor="#ffffff">
              <View style={{flexDirection: 'row', alignItems: "center", marginBottom: 10,}}>
                <Icon
                  style={styles.icon_label}
                  name="question"
                  size={12}
                  color="#999999"
                />
                <Text style={styles.input_label_header}>Hướng dẫn</Text>
              </View>
            </TouchableHighlight>
            <View>
              <Text style={styles.input_label_help}>
                {help_content}
              </Text>
            </View>
          </View>

        </ScrollView>

        {/*Block Continue */}
        <View
          underlayColor="transparent"
          style={[styles.block_continue]}>
          <View style={[
            styles.block_continue_content,
            {flexDirection: 'row'}
          ]}>
            <View style={styles.block_continue_content_label}>
              <Text style={styles.blocl_continue_input_label}>Số {this.state.text_tel}</Text>
              <View style={styles.block_continue_content_label_right}>
                <Text
                  style={[styles.blocl_continue_input_label, {color: DEFAULT_COLOR}]}>{this.state.telco} {this.state.price_select}</Text>
              </View>
            </View>
            <View style={styles.block_continue_content_label}>
              <Text style={styles.blocl_continue_input_label}>Hoàn tiền</Text>
              <View style={styles.block_continue_content_label_right}>
                <Text style={[styles.blocl_continue_input_label, {color: DEFAULT_COLOR}]}>{this.state.pay !== 0
                  ? this.state.discount_label + '(' + this.state.discount + '%)'
                  : ''}</Text>
              </View>
            </View>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => {
                if (this.state.text_tel === '') {
                  return Alert.alert(
                    'Thông báo',
                    'Bạn cần nhập số điện thoại cần nạp',
                    [
                      {
                        text: 'Đồng ý', onPress: () => {
                        }
                      },
                    ],
                    {cancelable: false}
                  );
                } else {
                  Actions.nap_tkc_confirm({
                    detail: this.state
                  });
                }
              }}
            >
              <View style={[styles.boxButtonAction, {
                width: Util.size.width - 160,
                backgroundColor: DEFAULT_COLOR,
                borderColor: "#999999",
                marginTop: 10,
              }]}>
                <Text style={[styles.buttonActionTitle, {
                  color: "#ffffff"
                }]}>Tiếp tục</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
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
  input_label_header: {
    fontSize: 16,
    color: "#000000",
    marginLeft: 8
  },
  // Chon nha mang
  provinder_box: {
    // width: '100%',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: Util.pixel,
    borderTopWidth: Util.pixel,
    borderColor: "#dddddd",
    borderBottomColor: "#dddddd",
  },
  provinder_box_action_btn: {
    width: ~~(Util.size.width / 5),
    opacity: 0.4,

  },
  provinder_box_action_btn_active: {
    width: ~~(Util.size.width / 5),
    opacity: 1,
  },
  provinder_box_action_logo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  provinder_logo: {
    width: ~~(Util.size.width / 5),
    height: 70,
    borderWidth: Util.pixel,
    borderColor: "#666666",
    borderRadius: 10,
  },
  provinder_logo_active: {
    width: ~~(Util.size.width / 5),
    height: 70,
    borderWidth: 2,
    borderColor: DEFAULT_COLOR,
    borderRadius: 10,
  },
  // Chon menh gia the
  block_choose_price_option: {
    width: '100%',
    backgroundColor: "#ffffff",
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#dddddd",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  choose_price_option: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // alignItems: 'stretch',
    justifyContent: 'space-between',
    // paddingHorizontal: 5,
    // paddingTop: 5,
    // backgroundColor: "red",
  },
  boxButtonActionChoosePrice: {
    flexDirection: 'column',
    flex: 1,
    borderWidth: Util.pixel,
    borderColor: "#666666",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 5,
    width: Util.size.width / 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  boxButtonActionChoosePriceActive: {
    flexDirection: 'column',
    flex: 1,
    borderWidth: Util.pixel,
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 5,
    width: Util.size.width / 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: DEFAULT_COLOR,
    borderColor: "#999999",
  },
  btn_choose_price_option: {
    width: '100%',
    height: 45,
    lineHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    color: "#fff",
    textAlign: 'center',
    fontSize: 13,
    ...Platform.select({
      ios: {
        width: 200,
      },
    }),
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
  // Help
  block_help_box: {
    width: '100%',
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#dddddd",
    borderTopWidth: Util.pixel,
    borderTopColor: "#dddddd",
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
  desc_content: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 22
  },
  //Block Continue
  block_continue: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  block_continue_content: {
    // width: '100%',
    // height: '100%',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    padding: 10,
    paddingHorizontal: 15,
    borderTopWidth: Util.pixel,
    borderTopColor: '#dddddd',
  },
  block_continue_content_label_right: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  block_continue_content_label: {
    width: '100%',
    height: 35,
    backgroundColor: "#ffffff",
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#dddddd",
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn_phone_card_next: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: 5,
    ...Platform.select({
      ios: {
        width: 250,
        height: 40,
      },
    }),
  },
  block_continue_btn: {
    backgroundColor: DEFAULT_COLOR,
    color: '#fff',
    width: '100%',
  },
  blocl_continue_input_label: {
    fontSize: 14,
    color: "#000",
    fontWeight: 'bold'
  },
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#cccccc"
  },
  right_title_btn_box: {
    flex: 1,
    alignItems: 'flex-end'
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
    flexDirection: 'row',
    color: "#333333",
    marginLeft: 4,
    fontSize: 14
  },
  buttonActionTitleActive: {
    flexDirection: 'row',
    color: "#ffffff",
    marginLeft: 4,
    fontSize: 14
  },
  buttonActionSubTitle: {
    color: "#333333",
    marginLeft: 4,
    fontSize: 8
  },
  buttonActionSubTitleActive: {
    color: "#ffffff",
    marginLeft: 4,
    fontSize: 8
  },
  lineView: {
    height: 1,
    width: "100%",
    backgroundColor: "rgb(225,225,225)"
  },
  button: {
    borderColor: "#000066",
    borderWidth: 1,
    borderRadius: 10
  },
  buttonPress: {
    borderColor: "#000066",
    backgroundColor: "#000066",
    borderWidth: 1,
    borderRadius: 10
  }
});
