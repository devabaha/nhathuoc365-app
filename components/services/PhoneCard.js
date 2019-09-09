import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Image,
  FlatList,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';

@observer
export default class PhoneCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      service_type: props.service_type || 'phone_card',
      service_id: props.service_id || 1,
      data: '',
      telco: '',
      price_list: [],
      price: 0,
      discount: 0,
      pay: 0,
      price_select: '',
      discount_label: '',
      loading: true
    };
  }

  componentDidMount() {
    this._getData();
  }

  async _getData(delay) {
    try {
      var response = await APIHandler.service_info(this.state.service_id);

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          this.setState({
            telcos: response.data.sub_services
          });
          this.onPressChooseTelco(response.data.sub_services[0]);
        }, delay || 0);
      }
    } catch (e) {
      console.log(e + ' service_phone_card');
    }
  }

  //Chon nha mang
  onPressChooseTelco(telco) {
    // Fix for api
    this.setState({
      telco_id: telco.id,
      telco_name: telco.name,
      help_content: telco.content,
      loading: false,
      price_list: telco.data
    });
    this.onPressChoosePrice(telco.data[0]);
  }
  //set state khi chon gia
  onPressChoosePrice(telco) {
    this.setState({
      loading: false,
      telco_id: telco.id,
      price: telco.price,
      discount: telco.discount,
      pay: telco.price,
      price_select: telco.label,
      discount_label: telco.discount_label
    });
  }

  render() {
    var { help_content } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={{
            marginBottom: 150
          }}
        >
          {/* Block chon nha mang */}

          <View style={styles.provinder_box}>
            <FlatList
              ref="telco_list"
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.state.telcos}
              extraData={this.state}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={() => (
                <View style={{ width: ~~(Util.size.width / 25) }} />
              )}
              renderItem={({ item }) => (
                <TouchableHighlight
                  id={item.id}
                  underlayColor="transparent"
                  onPress={() => this.onPressChooseTelco(item)}
                  style={
                    this.state.telco_name === item.name
                      ? styles.provinder_box_action_btn_active
                      : styles.provinder_box_action_btn
                  }
                >
                  <View style={styles.provinder_box_action_logo}>
                    <Image
                      style={
                        this.state.telco_name === item.name
                          ? styles.provinder_logo_active
                          : styles.provinder_logo
                      }
                      source={{ uri: item.image }}
                    />
                  </View>
                </TouchableHighlight>
              )}
            />
          </View>

          {/* Block chon menh gia the */}
          <View style={styles.block_choose_price_option}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10
              }}
            >
              <Icon
                style={styles.icon_label}
                name="info-circle"
                size={12}
                color="#999999"
              />
              <Text style={styles.input_label_header}>
                {this.state.telco_name === ''
                  ? 'Vui lòng chọn nhà mạng'
                  : 'Chọn mệnh giá thẻ'}
              </Text>
            </View>

            <View style={styles.choose_price_option}>
              {this.state.price_list.map(item => {
                return (
                  <TouchableHighlight
                    key={item.price}
                    onPress={() => this.onPressChoosePrice(item)}
                    ref="price_list"
                    underlayColor="transparent"
                  >
                    <View
                      style={
                        this.state.price === item.price
                          ? styles.boxButtonActionChoosePriceActive
                          : styles.boxButtonActionChoosePrice
                      }
                    >
                      <Text
                        style={
                          this.state.price === item.price
                            ? styles.buttonActionTitleActive
                            : styles.buttonActionTitle
                        }
                      >
                        {item.label}
                      </Text>
                      <Text
                        style={
                          this.state.price === item.price
                            ? styles.buttonActionSubTitleActive
                            : styles.buttonActionSubTitle
                        }
                      >
                        Hoàn lại {item.discount_label}
                      </Text>
                    </View>
                  </TouchableHighlight>
                );
              })}
            </View>
          </View>

          {/* Block thong tin chi tiet*/}
          <View style={styles.block_help_box}>
            <TouchableHighlight underlayColor="#ffffff">
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10
                }}
              >
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
              <Text style={styles.input_label_help}>{help_content}</Text>
            </View>
          </View>
        </ScrollView>

        {/*Block Continue */}
        <View underlayColor="transparent" style={[styles.block_continue]}>
          <View
            style={[styles.block_continue_content, { flexDirection: 'row' }]}
          >
            <View style={styles.block_continue_content_label}>
              <Text style={styles.blocl_continue_input_label}>
                Thẻ điện thoại{' '}
              </Text>
              <View style={styles.block_continue_content_label_right}>
                <Text
                  style={[
                    styles.blocl_continue_input_label,
                    { color: DEFAULT_COLOR }
                  ]}
                >
                  {this.state.telco_name} {this.state.price_select}
                </Text>
              </View>
            </View>
            <View style={styles.block_continue_content_label}>
              <Text style={styles.blocl_continue_input_label}>Hoàn tiền</Text>
              <View style={styles.block_continue_content_label_right}>
                <Text
                  style={[
                    styles.blocl_continue_input_label,
                    { color: DEFAULT_COLOR }
                  ]}
                >
                  {this.state.pay !== 0
                    ? this.state.discount_label +
                      '(' +
                      this.state.discount +
                      '%)'
                    : ''}
                </Text>
              </View>
            </View>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => {
                Actions.phonecard_confirm({
                  detail: this.state
                });
              }}
            >
              <View
                style={[
                  styles.boxButtonAction,
                  {
                    width: Util.size.width - 160,
                    backgroundColor: DEFAULT_COLOR,
                    borderColor: '#999999',
                    marginTop: 10
                  }
                ]}
              >
                <Text
                  style={[
                    styles.buttonActionTitle,
                    {
                      color: '#ffffff'
                    }
                  ]}
                >
                  Tiếp tục
                </Text>
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
    color: '#000000',
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
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderTopWidth: Util.pixel,
    borderColor: '#dddddd',
    borderBottomColor: '#dddddd'
  },
  provinder_box_action_btn: {
    width: ~~(Util.size.width / 5),
    opacity: 0.4
  },
  provinder_box_action_btn_active: {
    width: ~~(Util.size.width / 5),
    opacity: 1
  },
  provinder_box_action_logo: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  provinder_logo: {
    width: ~~(Util.size.width / 5),
    height: 70,
    borderWidth: Util.pixel,
    borderColor: '#666666',
    borderRadius: 10
  },
  provinder_logo_active: {
    width: ~~(Util.size.width / 5),
    height: 70,
    borderWidth: 2,
    borderColor: DEFAULT_COLOR,
    borderRadius: 10
  },
  // Chon menh gia the
  block_choose_price_option: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd',
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  choose_price_option: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // alignItems: 'stretch',
    justifyContent: 'space-between'
    // paddingHorizontal: 5,
    // paddingTop: 5,
    // backgroundColor: "red",
  },
  boxButtonActionChoosePrice: {
    flexDirection: 'column',
    flex: 1,
    borderWidth: Util.pixel,
    borderColor: '#666666',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 5,
    width: Util.size.width / 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
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
    borderColor: '#999999'
  },
  btn_choose_price_option: {
    width: '100%',
    height: 45,
    lineHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    color: '#fff',
    textAlign: 'center',
    fontSize: 13,
    ...Platform.select({
      ios: {
        width: 200
      }
    })
  },
  input_box: {
    width: '100%',
    height: 52,
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd',
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
    color: '#000000'
  },
  input_text: {
    width: '96%',
    height: 44,
    paddingLeft: 8,
    color: '#000000',
    fontSize: 14,
    textAlign: 'right',
    paddingVertical: 0
  },
  // Help
  block_help_box: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd',
    borderTopWidth: Util.pixel,
    borderTopColor: '#dddddd'
  },
  input_label_help: {
    fontSize: 12,
    marginTop: 2,
    color: '#666666'
  },
  input_address_text: {
    width: '100%',
    color: '#000000',
    fontSize: 14,
    marginTop: 4,
    paddingVertical: 0
  },
  desc_content: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 22
  },
  //Block Continue
  block_continue: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%'
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
    borderTopColor: '#dddddd'
  },
  block_continue_content_label_right: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  block_continue_content_label: {
    width: '100%',
    height: 35,
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd',
    flexDirection: 'row',
    alignItems: 'center'
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
        height: 40
      }
    })
  },
  block_continue_btn: {
    backgroundColor: DEFAULT_COLOR,
    color: '#fff',
    width: '100%'
  },
  blocl_continue_input_label: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold'
  },
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: '#cccccc'
  },
  right_title_btn_box: {
    flex: 1,
    alignItems: 'flex-end'
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
    flexDirection: 'row',
    color: '#333333',
    marginLeft: 4,
    fontSize: 14
  },
  buttonActionTitleActive: {
    flexDirection: 'row',
    color: '#ffffff',
    marginLeft: 4,
    fontSize: 14
  },
  buttonActionSubTitle: {
    color: '#333333',
    marginLeft: 4,
    fontSize: 8
  },
  buttonActionSubTitleActive: {
    color: '#ffffff',
    marginLeft: 4,
    fontSize: 8
  },
  lineView: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgb(225,225,225)'
  },
  button: {
    borderColor: '#000066',
    borderWidth: 1,
    borderRadius: 10
  },
  buttonPress: {
    borderColor: '#000066',
    backgroundColor: '#000066',
    borderWidth: 1,
    borderRadius: 10
  }
});
