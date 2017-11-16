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
  TextInput,
  Alert,
  Keyboard
} from 'react-native';
import PropTypes from 'prop-types';

// librarys
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';

var CART = {}

export default class ListProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      cart_data: props.cart_data,
      data: null,
      cat_id: 0
    }
  }

  componentDidMount() {
    this._getData();

    Actions.refresh({
      onNavSave: this._onSaveHandler,
      onNavFilter: this.ref_popup_categories.open,
      onBack: () => {
        if (this._clicked) {
          return;
        }
        
        if (Object.keys(CART).length > 0) {
          Alert.alert(
            'Xác nhận',
            'Lưu lại những mặt hàng vừa thêm?',
            [
              {text: 'Không', onPress: () => {
                CART = {}
                Actions.pop();
              }},
              {text: 'Đồng ý', onPress: () => {
                this._onSaveHandler();
              }},
            ]
          );
        } else {
          Actions.pop();
        }
      }
    });
  }

  _onSaveHandler = () => {
    if (this._clicked) {
      return;
    }

    if (Object.keys(CART).length == 0) {
      return Toast.show('Chưa có mặt hàng nào được chọn!');
    }

    this._clicked = true;

    Toast.show('Đang xử lý...');

    Object.keys(CART).map(key => {
      let quantity = CART[key];

      this._onSave(key, quantity);
    });
  }

  _onSave = async (product_id, quantity) => {
    var {id, site_id} = this.state.cart_data;
    try {
      var response = await ADMIN_APIHandler.site_update_cart(site_id, id, {
        product_id,
        quantity
      });

      if (response.status == 1) {
        delete CART[product_id];

        if (Object.keys(CART).length == 0) {
          Actions.pop();

          Toast.show('Thêm thành công!');

          if (this.props.reloadData) {
            this.props.reloadData(400);
          }
        }
      }

    } catch (e) {
      console.warn(e + ' site_update_cart');

      this._clicked = false;
    } finally {

    }
  }

  _getData = async (delay = 0) => {
    var {id, site_id} = this.state.cart_data;
    var {cat_id} = this.state;

    try {
      var response = await ADMIN_APIHandler.site_list_product(site_id, id, cat_id);

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          this.setState({
            data: response.data
          });
          layoutAnimation();
        }, delay);
      }

    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  _onChangeCate(item) {
    this.ref_popup_categories.close();
    this.setState({
      cat_id: item.id,
      data: null
    }, this._getData.bind(this, 450));
  }

  render() {
    var {data} = this.state;
    if (data) {
      var categories = data.categories;
    }

    return(
      <View style={styles.container}>
        {data != null ? (
          <FlatList
            data={data.products}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => {
              var categorie = categories[item.cat_id];
              return(
                <ItemCartComponent
                  categorie={categorie}
                  item={item}
                  index={index} />
              );
            }}
            />
        ) : (
          <Indicator size="small" />
        )}

        <Modal
          style={{
            width: '80%',
            height: '50%',
            borderRadius: 5,
            paddingVertical: 12,
            paddingHorizontal: 15
          }}
          swipeToClose={false}
          ref={ref => this.ref_popup_categories = ref}>
          {data && (
            <FlatList
              data={[{id: 0, name: 'Tất cả'}, ...data.categories_data]}
              renderItem={({item, index}) => {
                let active = item.id == this.state.cat_id;
                return(
                  <TouchableHighlight
                    style={{
                      height: 48,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: Util.pixel,
                      marginTop: 4,
                      borderTopWidth: 1,
                      borderColor: DEFAULT_ADMIN_COLOR,
                      backgroundColor: active ? hexToRgbA(DEFAULT_ADMIN_COLOR, 0.9) : '#ffffff'
                    }}
                    onPress={this._onChangeCate.bind(this, item)}
                    underlayColor="transparent">
                    <Text style={{
                      color: active ? '#ffffff' : DEFAULT_ADMIN_COLOR,
                      fontSize: 16
                    }}>{item.name}</Text>
                  </TouchableHighlight>
                );
              }}
              keyExtractor={item => item.id} />
          )}
        </Modal>
      </View>
    );
  }
}

class ItemCartComponent extends Component {
  constructor(props) {
    super(props);

    var {item} = props;

    this.state = {
      check_loading: false,
      increment_loading: false,
      decrement_loading: false,
      site_id: props.site_id,
      cart_id: props.cart_id,
      quantity: CART[item.id] ? CART[item.id] : 0
    }
  }

  _incrementQnt(item) {
    var {quantity} = this.state;
    quantity = parseFloat(quantity) + 1;

    this.setState({
      increment_loading: true
    }, () => {
      this.setState({
        quantity,
        increment_loading: false
      });

      CART[item.id] = quantity;
    });
  }

  _decrementQnt(item) {
    var {quantity} = this.state;
    quantity = parseFloat(quantity) - 1;

    this.setState({
      decrement_loading: true
    }, () => {
      if (quantity > 0) {
        this.setState({
          quantity,
          decrement_loading: false
        });

        CART[item.id] = quantity;
      } else {
        this.setState({
          quantity: 0,
          decrement_loading: false
        });

        delete CART[item.id];
      }
    });
  }

  _onChangeText = (value) => {
    var {item} = this.props;

    this.setState({
      quantity: value
    }, () => {
      CART[item.id]  = value;
    });
  }

  render() {
    var {item, categorie} = this.props;

    var {check_loading, increment_loading, decrement_loading} = this.state;
    var is_processing = check_loading || increment_loading || decrement_loading;

    return (
      <View style={[styles.cart_item_box, {
        height: 120
      }]}>
        <View style={styles.cart_item_image_box}>
          <CachedImage style={styles.cart_item_image} source={{uri: item.image}} />
        </View>

        <View style={styles.cart_item_info}>
          <View style={[styles.cart_item_info_content]}>
            <Text style={styles.cart_item_info_name}>{item.name}</Text>
            <Text style={styles.cart_item_cate_name}>{categorie.name}</Text>
            <View style={styles.cart_item_actions}>
              <TouchableHighlight
                style={styles.cart_item_actions_btn}
                underlayColor="transparent"
                onPress={this._decrementQnt.bind(this, item)}>
                <View>
                  {decrement_loading ? (
                    <Indicator size="small" />
                  ) : (
                    <Text style={styles.cart_item_btn_label}>-</Text>
                  )}
                </View>
              </TouchableHighlight>

              <TextInput
                keyboardType="numeric"
                onChangeText={this._onChangeText}
                value={`${this.state.quantity}`}
                style={styles.cart_item_actions_quantity} />

              <TouchableHighlight
                style={styles.cart_item_actions_btn}
                underlayColor="transparent"
                onPress={this._incrementQnt.bind(this, item)}>
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
    color: DEFAULT_ADMIN_COLOR
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
    width: Util.size.width * 0.76,
    height: '100%'
  },
  cart_item_info_content: {
    paddingLeft: 15
  },
  cart_item_info_name: {
    color: "#000000",
    fontSize: 14,
    fontWeight: '600',
    marginRight: 30
  },
  cart_item_cate_name: {
    fontSize: 14,
    color: "#404040"
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
    color: DEFAULT_ADMIN_COLOR
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
    backgroundColor: DEFAULT_ADMIN_COLOR,
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
    color: DEFAULT_ADMIN_COLOR,
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
    color: DEFAULT_ADMIN_COLOR
  },
  payments_nav_items_active: {
    position: 'absolute',
    width: Util.size.width / 4 - 14,
    top: 20,
    right: 0,
    height: Util.pixel,
    backgroundColor: DEFAULT_ADMIN_COLOR
  },
  payments_nav_items_right_active: {
    position: 'absolute',
    width: Util.size.width / 4 - 14,
    top: 20,
    left: 0,
    height: Util.pixel,
    backgroundColor: DEFAULT_ADMIN_COLOR
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
    color: DEFAULT_ADMIN_COLOR
  },
  payments_nav_icon_box_active: {
    borderColor: DEFAULT_ADMIN_COLOR
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
    backgroundColor: DEFAULT_ADMIN_COLOR,
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
