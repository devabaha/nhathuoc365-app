import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  FlatList,
  RefreshControl,
  ScrollView,
  Animated,
  TextInput
} from 'react-native';
import PropTypes from 'prop-types';

// librarys
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

export default class Order extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      cart_data: {
        "id": "581",
        "cart_code": "CHTNMF2410581",
        "site_id": "14",
        "user_id": "41",
        "products": {
          "cart-270": {
            "quantity": 1,
            "id": "270",
            "name": "Cà chua hữu cơ túi 300gr",
            "selected": 1,
            "discount_percent": "12",
            "service_price": 0,
            "discount": "17.000đ",
            "price": "15000",
            "price_view": "15.000đ",
            "unit_name": "túi",
            "cart_step": "1.0",
            "quantity_view": "1 túi",
            "image": "http://myfood.com.vn/photos/resized/320x/14-1507975722-cuahangtrainghiem.png"
          },
          "cart-272": {
            "quantity": 1,
            "id": "272",
            "name": "Dưa chuột hữu cơ túi 300gr",
            "selected": 1,
            "discount_percent": "18",
            "service_price": 0,
            "discount": "12.000đ",
            "price": "10000",
            "price_view": "10.000đ",
            "unit_name": "túi",
            "cart_step": "1.0",
            "quantity_view": "1 túi",
            "image": "http://myfood.com.vn/photos/resized/320x/14-1507968961-cuahangtrainghiem.png"
          },
          "cart-273": {
            "quantity": 1,
            "id": "273",
            "name": "Rau muống hữu cơ túi 300gr",
            "selected": 1,
            "discount_percent": "18",
            "service_price": 0,
            "discount": "12.000đ",
            "price": "10000",
            "price_view": "10.000đ",
            "unit_name": "túi",
            "cart_step": "1.0",
            "quantity_view": "1 túi",
            "image": "http://myfood.com.vn/photos/resized/320x/14-1507970644-cuahangtrainghiem.png"
          }
        },
        "total_value": 35000,
        "total_count_selected": 3,
        "count_selected": 3,
        "point": 35,
        "fcoin": "0",
        "award_date": "0",
        "award_month": "0",
        "status": "5",
        "address_id": "148",
        "user_note": null,
        "site_note": null,
        "payment": "Khi nhận hàng",
        "delete_flag": "0",
        "pushed": "0",
        "orders_time": "2017-10-24 18:51:23",
        "modified": "2017-10-24 18:51:23",
        "created": "2017-10-24 18:43:16",
        "count": 3,
        "total": "35.000đ",
        "total_selected": "35.000đ",
        "status_view": "Đã đặt hàng",
        "address": {
          "id": "148",
          "user_id": "41",
          "name": "Ngọc Sơn",
          "tel": "01653538222",
          "address": "Số 1 Lương Yên, Hà Nội",
          "city": "",
          "district": "",
          "default_flag": "0",
          "delete_flag": "0",
          "modified": "2017-10-13 17:27:33",
          "created": "2017-10-13 17:27:33"
        },
        "shop_logo_url": "http://myfood.com.vn/photos/resized/120x120/14-1507956244-cuahangtrainghiem.png",
        "shop_name": "Cửa hàng trải nghiệm",
        "shop_id": "14",
        "tel": "0905250209"
      },
      editMode: true
    }
  }

  _onRefresh() {
    this.setState({
      refreshing: true
    }, () => {
      setTimeout(() => {
        this.setState({
          refreshing: false
        });
      }, 1000);
    });
  }

  _renderActionsButton(data) {
    return data.map((item, index) => {
      return(
        <TouchableHighlight
          key={index}
          onPress={item.onPress}
          underlayColor="transparent">
          <View style={styles.userInfoActionBox}>
            <View style={[styles.userInfoActionIconBox, {
              backgroundColor: item.bgrIcon ? item.bgrIcon : DEFAULT_COLOR
            }]}>
              {item.icon && <Icon name={item.icon} size={18} color="#ffffff" />}
            </View>
            <Text style={styles.actionTitle}>{item.title}</Text>
          </View>
        </TouchableHighlight>
      );
    });
  }

  render() {
    var {editMode, cart_data} = this.state;

    if (cart_data && Object.keys(cart_data.products).length > 0) {
      var cart_products_confirm = [];
      Object.keys(cart_data.products).map(key => {
        let product = cart_data.products[key];
        if (product.selected == 1) {
          cart_products_confirm.push(product);
        }
      });

      // set new data
      var cart_products_confirm = cart_products_confirm.reverse();
      var address_data = cart_data.address;
    }

    // show loading
    if (cart_data == null || cart_products_confirm == null || address_data == null) {
      return (
        <View style={styles.container}>
          <Indicator />
        </View>
      );
    }

    // animation
    var interpolateColor, interpolateColor2, animatedStyle, animatedStyle2;

    if (this.animatedValue) {
      interpolateColor = this.animatedValue.interpolate({
        inputRange: [0, 150],
        outputRange: [hexToRgbA(DEFAULT_COLOR, 0.8), hexToRgbA("#ffffff", 1)]
      });
      interpolateColor2 = this.animatedValue.interpolate({
        inputRange: [0, 150],
        outputRange: [hexToRgbA("#ffffff", 1), hexToRgbA("#000000", 1)]
      });

      animatedStyle = {
        backgroundColor: interpolateColor
      }
      animatedStyle2 = {
        // color: interpolateColor2
      }
    }

    var is_login = true;
    var is_ready = cart_data.status == CART_STATUS_READY;
    var is_reorder = cart_data.status == CART_STATUS_COMPLETED;
    var is_paymenting = cart_data.status == CART_STATUS_ORDERING;

    return (
      <View style={styles.container}>
        <ScrollView
          onScroll={(event) => {
            var scrollTop = event.nativeEvent.contentOffset.y;
            this.setState({ scrollTop });
          }}
          //keyboardShouldPersistTaps="always"
          ref={ref => this.refs_confirm_page = ref}
          style={styles.content}>

          <View style={styles.userInfoBox}>
            <View style={styles.userInfoAvataBox}>
              <Image
                source={{uri: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t1.0-9/22815235_1302219029924435_8143315674876846694_n.jpg?oh=ee659e31b1cfc0659f5da7e6eadcf91d&oe=5AA4473E'}}
                style={styles.userInfoAvata} />
              <Text style={styles.userInfoName}>Cẩm Anh</Text>
            </View>

            <View style={styles.userInfoActions}>
              {this._renderActionsButton.call(this, [
                {
                  title: 'duyệt đơn',
                  icon: 'check',
                  onPress: () => {

                  }
                },
                {
                  title: 'huỷ đơn',
                  icon: 'times',
                  bgrIcon: '#dd4b39',
                  onPress: () => {

                  }
                },
                {
                  title: 'Khách hàng',
                  icon: 'user',
                  bgrIcon: '#b3b3b3',
                  onPress: () => {
                    Actions.sale_user_info({
                      title: 'THÔNG TIN',
                      isGrayStyle: true
                    });
                  }
                }
              ])}
            </View>
          </View>

          <View style={[styles.rows, styles.borderBottom]}>
            <View style={styles.address_name_box}>
              <View>
                <View style={styles.box_icon_label}>
                  <Icon style={styles.icon_label} name="info-circle" size={16} color="#999999" />
                  <Text style={styles.input_label}>Thông tin đơn hàng</Text>
                </View>
                <Text style={styles.desc_content}>Mã đơn hàng: #{cart_data.cart_code}</Text>
              </View>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <View style={styles.orders_status_box}>
                    <Text style={styles.address_default_title}>Trạng thái</Text>
                    <Text style={[styles.orders_status]}>{cart_data.status_view}</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>

          {/*<View style={[styles.rows, styles.borderBottom]}>
            <View style={styles.address_name_box}>
              <View style={styles.box_icon_label}>
                <Icon style={styles.icon_label} name="credit-card" size={12} color="#999999" />
                <Text style={styles.input_label}>Phương thức thanh toán</Text>
              </View>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <Text style={styles.address_default_title}>{cart_data.payment}</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>*/}

          <View style={[styles.rows, styles.borderBottom, styles.mt8, {
            paddingTop: 0,
            paddingRight: 0
          }]}>
            <View style={[styles.address_name_box, {
              paddingTop: 12
            }]}>
              <View style={styles.box_icon_label}>
                <Icon style={styles.icon_label} name="truck" size={13} color="#999999" />
                <Text style={styles.input_label}>Địa chỉ giao hàng</Text>
              </View>
              <View style={[styles.address_default_box, {
                position: 'absolute',
                top: 0,
                right: 0
              }]}>
                {editMode ? (
                  <TouchableHighlight
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 15
                    }}
                    underlayColor="transparent"
                    onPress={() => 1}>
                    <Text style={[styles.address_default_title, styles.title_active]}>NHẤN ĐỂ THAY ĐỔI</Text>
                  </TouchableHighlight>
                ) : (
                  <TouchableHighlight
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 15
                    }}
                    underlayColor="transparent"
                    onPress={() => 1}>
                    <Text style={[styles.address_default_title, styles.title_active]}>SAO CHÉP</Text>
                  </TouchableHighlight>
                )}
              </View>
            </View>

            <View style={styles.address_content}>
              <Text style={styles.address_name}>{address_data.name}</Text>
              <Text style={styles.address_content_phone}>{address_data.tel}</Text>
              {editMode ? (
                <View>
                  <Text style={styles.address_content_address_detail}>{address_data.address}</Text>
                  {/*<Text style={styles.address_content_phuong}>Phường Phương Lâm</Text>
                  <Text style={styles.address_content_city}>Thành Phố Hoà Bình</Text>
                  <Text style={styles.address_content_tinh}>Hoà Bình</Text>*/}
                </View>
              ) : (
                <Text style={styles.address_content_address_detail}>{address_data.address}</Text>
              )}
            </View>
          </View>

          <View
            style={[styles.rows, styles.borderBottom, styles.mt8]}>
            <TouchableHighlight
              underlayColor="#ffffff"
              onPress={() => {
                if (this.refs_cart_note) {
                  this.refs_cart_note.focus();
                }
              }}
            >
              <View style={styles.box_icon_label}>
                <Icon style={styles.icon_label} name="pencil-square-o" size={15} color="#999999" />
                <Text style={[styles.input_label]}>Ghi chú</Text>
              </View>
            </TouchableHighlight>
            {editMode ? (
              <View>
                <TouchableHighlight
                  underlayColor="#ffffff"
                  onPress={() => {
                    if (this.refs_cart_note) {
                      this.refs_cart_note.focus();
                    }
                  }}
                >
                  <Text style={styles.input_label_help}>(Thời gian giao hàng, ghi chú khác)</Text>
                </TouchableHighlight>

                <TextInput
                  ref={ref => this.refs_cart_note = ref}
                  style={[styles.input_address_text, {height: this.state.address_height > 50 ? this.state.address_height : 50}]}
                  keyboardType="default"
                  maxLength={250}
                  placeholder="Nhập ghi chú của bạn tại đây"
                  placeholderTextColor="#999999"
                  multiline={true}
                  underlineColorAndroid="transparent"
                  onContentSizeChange={(e) => {
                    this.setState({address_height: e.nativeEvent.contentSize.height});
                  }}
                  onChangeText={(value) => {

                  }}
                  onFocus={() => 1}
                  value=""
                  />
              </View>
            ) : (
              <Text style={styles.input_note_value}>{cart_data.user_note || "Không có ghi chú"}</Text>
            )}
          </View>

          {/*<View style={[styles.rows, styles.borderBottom, styles.mt8]}>
            <View style={styles.address_name_box}>
              <View style={styles.box_icon_label}>
                <Icon style={styles.icon_label} name="usd" size={14} color="#999999" />
                <Text style={styles.input_label}>Thành tiền</Text>
              </View>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <Text style={[styles.address_default_title, styles.title_active]}>{cart_data.total_selected}</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>*/}

          <View style={[styles.rows, styles.borderBottom, styles.mt8]}>
            <View style={styles.address_name_box}>
              <View style={styles.box_icon_label}>
                <Icon style={styles.icon_label} name="shopping-cart" size={14} color="#999999" />
                <Text style={styles.input_label}>{editMode ? "Mặt hàng đã chọn" : "Mặt hàng đã mua"}</Text>
              </View>
            </View>
          </View>

          {editMode ? (
            <FlatList
              style={styles.items_box}
              data={cart_products_confirm}
              extraData={cart_products_confirm}
              renderItem={({item, index}) => {
                return(
                  <ItemCartComponent
                    parentCtx={this}
                    item={item}
                  />
                );
              }}
              keyExtractor={item => item.id}
            />
          ) : (
            <FlatList
              style={styles.items_box}
              data={cart_products_confirm}
              extraData={cart_products_confirm}
              renderItem={({item, index}) => {
                // hide item not selected
                if (item.selected != 1) {
                  return null;
                }

                return(
                  <View style={[styles.cart_item_box, {
                    height: 80
                  }]}>
                    <View style={styles.cart_item_image_box}>
                      <Image style={styles.cart_item_image} source={{uri: item.image}} />
                    </View>

                    <View style={styles.cart_item_info}>
                      <View style={styles.cart_item_info_content}>
                        <Text style={styles.cart_item_info_name}>{item.name}</Text>

                        <View style={styles.cart_item_price_box}>
                          {item.discount_percent > 0 && (
                            <Text style={styles.cart_item_price_price_safe_off}>{item.discount}</Text>
                          )}
                          <Text style={styles.cart_item_price_price}>{item.price_view}</Text>
                        </View>
                      </View>
                    </View>

                    <Text style={styles.cart_item_weight}>{item.quantity_view}</Text>

                    {item.discount_percent > 0 && (
                      <View style={styles.item_safe_off}>
                        <View style={styles.item_safe_off_percent}>
                          <Text style={styles.item_safe_off_percent_val}>-{item.discount_percent}%</Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              }}
              keyExtractor={item => item.id}
            />
          )}

          <View style={[styles.rows, styles.borderBottom, {
            borderTopWidth: 0
          }]}>
            <View style={styles.address_name_box}>
              <Text style={styles.text_total_items}>{cart_data.count_selected} sản phẩm</Text>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <Text style={[styles.address_default_title, styles.title_active]}>Thành tiền: {cart_data.total_selected}</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

class ItemCartComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      check_loading: false,
      increment_loading: false,
      decrement_loading: false
    }
  }

  render() {
    var item = this.props.item;

    var {check_loading, increment_loading, decrement_loading} = this.state;
    var is_processing = check_loading || increment_loading || decrement_loading;

    return (
      <View style={[styles.cart_item_box, {
        height: 120
      }]}>
        {/*<View style={styles.cart_item_check_box}>
          {check_loading ? (
            <Indicator size="small" />
          ) : (
            <CheckBox
              containerStyle={styles.cart_item_check}
              checked={item.selected == 1 ? true : false}
              checkedColor={DEFAULT_COLOR}
              hiddenTextElement
              onPress={() => 1}
              />
          )}
        </View>*/}

        <View style={styles.cart_item_image_box}>
          <Image style={styles.cart_item_image} source={{uri: item.image}} />
        </View>

        <View style={styles.cart_item_info}>
          <View style={styles.cart_item_info_content}>
            <Text style={styles.cart_item_info_name}>{item.name}</Text>
            <View style={styles.cart_item_actions}>
              <TouchableHighlight
                style={styles.cart_item_actions_btn}
                underlayColor="transparent"
                onPress={() => 1}>
                <View>
                  {decrement_loading ? (
                    <Indicator size="small" />
                  ) : (
                    <Text style={styles.cart_item_btn_label}>-</Text>
                  )}
                </View>
              </TouchableHighlight>

              <Text style={styles.cart_item_actions_quantity}>{item.quantity_view}</Text>

              <TouchableHighlight
                style={styles.cart_item_actions_btn}
                underlayColor="transparent"
                onPress={() => 1}>
                <View>
                  {increment_loading ? (
                    <Indicator size="small" />
                  ) : (
                    <Text style={styles.cart_item_btn_label}>+</Text>
                  )}
                </View>
              </TouchableHighlight>
            </View>

            <View style={styles.cart_item_price_box}>
              {item.discount_percent > 0 && (
                <Text style={styles.cart_item_price_price_safe_off}>{item.discount}</Text>
              )}
              <Text style={styles.cart_item_price_price}>{item.price_view}</Text>
            </View>
          </View>
        </View>

        {item.discount_percent > 0 && (
          <View style={styles.item_safe_off}>
            <View style={styles.item_safe_off_percent}>
              <Text style={styles.item_safe_off_percent_val}>-{item.discount_percent}%</Text>
            </View>
          </View>
        )}
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
  right_btn_box: {
    flexDirection: 'row'
  },
  rows: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
    borderTopWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  address_name_box: {
    flexDirection: 'row'
  },
  address_name: {
    fontSize: 14,
    color: "#000000",
    fontWeight: '600'
  },
  address_default_box: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  address_default_title: {
    color: "#666666",
    fontSize: 12
  },
  title_active: {
    color: DEFAULT_COLOR
  },
  address_content: {
    marginTop: 12,
    marginLeft: 22
  },
  address_content_phone: {
    color: "#404040",
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600'
  },
  address_content_address_detail: {
    color: "#404040",
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20
  },
  address_content_phuong: {
    color: "#404040",
    fontSize: 14,
    marginTop: 4
  },
  address_content_city: {
    color: "#404040",
    fontSize: 14,
    marginTop: 4
  },
  address_content_tinh: {
    color: "#404040",
    fontSize: 14,
    marginTop: 4
  },

  desc_content: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
    marginLeft: 22
  },
  orders_status_box: {
    alignItems: 'center'
  },
  orders_status: {
    fontSize: 12,
    color: "#fa7f50",
    fontWeight: '600',
    marginTop: 4
  },
  borderBottom: {
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },

  cart_section_box: {
    width: '100%',
    height: 32,
    justifyContent: 'center',
    backgroundColor: "#fa7f50"
  },
  cart_section_title: {
    color: "#ffffff",
    fontSize: 14,
    paddingLeft: 8,
    fontWeight: '600'
  },

  cart_item_box: {
    width: '100%',
    paddingVertical: 8,
    flexDirection: 'row',
    backgroundColor: "#ffffff",
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  cart_item_image_box: {
    width: '20%',
    height: '100%',
    marginLeft: 8
  },
  cart_item_image: {
    height: '100%',
    resizeMode: 'contain'
  },
  cart_item_info: {
    width: Util.size.width * 0.68 - 8,
    height: '100%'
  },
  cart_item_info_content: {
    paddingHorizontal: 15
  },
  cart_item_info_name: {
    color: "#000000",
    fontSize: 14,
    fontWeight: '600',
    marginRight: 30
  },
  cart_item_actions: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center'
  },
  cart_item_actions_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 26,
    height: 26,
    borderWidth: Util.pixel,
    borderColor: "#666666",
    borderRadius: 3
  },
  cart_item_actions_quantity: {
    paddingHorizontal: 8,
    minWidth: '30%',
    textAlign: 'center',
    color: "#404040",
    fontWeight: '500'
  },
  cart_item_btn_label: {
    color: "#404040",
    fontSize: 20,
    lineHeight: isIOS ? 20 : 24
  },
  cart_item_check_box: {
    width: '10%',
    justifyContent: 'center',
    marginLeft: '2%'
  },
  cart_item_check: {
    padding: 0,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    width: 24
  },
  cart_item_price_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#dddddd"
  },
  cart_item_weight: {
    position: 'absolute',
    right: 15,
    bottom: 8,
    color: "#666666",
    fontSize: 12
  },

  cart_item_price_price_safe_off: {
    textDecorationLine: 'line-through',
    fontSize: 14,
    color: "#666666",
    marginRight: 4
  },
  cart_item_price_price: {
    fontSize: 14,
    color: DEFAULT_COLOR
  },

  cart_payment_btn_box: {
    position: 'absolute',
    width: '100%',
    height: 60,
    bottom: 0,
    left: 0,
    right: 0
  },
  cart_payment_btn: {
    width: '100%',
    height: '100%',
    backgroundColor: DEFAULT_COLOR,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cart_payment_btn_title: {
    color: "#ffffff",
    fontSize: 18,
    marginLeft: 8
  },

  mt8: {
    marginTop: 8
  },
  text_total_items: {
    fontSize: 12,
    color: "#666666"
  },

  input_address_text: {
    width: '100%',
    color: "#000000",
    fontSize: 14,
    marginTop: 4
  },
  input_label: {
    fontSize: 16,
    color: "#000000",
    marginLeft: 8
  },
  input_label_help: {
    fontSize: 12,
    marginTop: 2,
    color: "#666666"
  },

  box_icon_label: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon_label: {
  },

  success_box: {
    padding: 15
  },
  success_title: {
    lineHeight: 20,
    color: "#000000"
  },
  success_icon_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  success_icon_label: {
    color: DEFAULT_COLOR,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8
  },
  input_note_value: {
    fontSize: 14,
    marginTop: 8,
    color: "#404040",
    marginLeft: 22
  },

  item_safe_off: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: '100%',
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  item_safe_off_percent: {
    backgroundColor: '#fa7f50',
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  item_safe_off_percent_val: {
    color: "#ffffff",
    fontSize: 12
  },

  payments_nav: {
    backgroundColor: '#ffffff',
    height: 60,
    flexDirection: 'row',
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  payments_nav_items: {
    justifyContent: 'center',
    height: 60,
    width: Util.size.width / 2,
    alignItems: 'center'
  },
  payments_nav_items_title: {
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: '500',
    color: '#666666'
  },
  payments_nav_items_title_active: {
    color: DEFAULT_COLOR
  },
  payments_nav_items_active: {
    position: 'absolute',
    width: Util.size.width / 4 - 14,
    top: 20,
    right: 0,
    height: Util.pixel,
    backgroundColor: DEFAULT_COLOR
  },
  payments_nav_items_right_active: {
    position: 'absolute',
    width: Util.size.width / 4 - 14,
    top: 20,
    left: 0,
    height: Util.pixel,
    backgroundColor: DEFAULT_COLOR
  },
  borderBottom: {
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#dddddd"
  },
  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8
  },

  payments_nav_icon_box: {
    borderWidth: Util.pixel,
    borderColor: "#cccccc",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4
  },
  payments_nav_icon_active: {
    color: DEFAULT_COLOR
  },
  payments_nav_icon_box_active: {
    borderColor: DEFAULT_COLOR
  },

  uncheckOverlay: {
    backgroundColor: "rgba(0,0,0,0.05)",
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
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

  userInfoBox: {
    width: Util.size.width,
    minHeight: 100,
    backgroundColor: "#fafafa",
    paddingVertical: 16
  },
  userInfoAvataBox: {
    alignItems: 'center'
  },
  userInfoAvata: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  userInfoName: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500'
  },
  userInfoActions: {
    width: Util.size.width,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16
  },
  userInfoActionBox: {
    alignItems: 'center'
  },
  userInfoActionIconBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: DEFAULT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginHorizontal: 24
  },
  actionTitle: {
    fontSize: 12,
    color: '#404040',
    marginTop: 4
  }
});
