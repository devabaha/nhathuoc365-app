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
  Alert
} from 'react-native';
import PropTypes from 'prop-types';

// librarys
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';

export default class Order extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      cart_data: null,
      editMode: false
    }
  }

  componentDidMount() {
    this._getData(450);
  }

  _getData = async (delay = 0) => {

    var {id, site_id} = this.props.item_data;

    try {
      var response = await ADMIN_APIHandler.site_cart_by_id(site_id, id);

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          this.setState({
            cart_data: response.data,
            refreshing: false
          });

          layoutAnimation();
        }, delay);
      }
    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  _reloadData = (cart_data) => {
    this.setState({
      cart_data
    });
  }

  _onRefresh() {
    this.setState({
      refreshing: true
    }, () => this._getData(1000));
  }

  _cartEdit = async (item, status) => {
    var {id, site_id} = item;
    try {
      var response = await ADMIN_APIHandler.cart_status_edit(site_id, id, {
        status
      });

      if (response && response.status == STATUS_SUCCESS) {
        this._getData();
        Toast.show('Cập nhật đơn hàng thành công!');
      }

    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  _confirmCancelOrder = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn muốn huỷ đơn hàng này?',
      [
        {text: 'Không', onPress: () => console.log('Cancel Pressed')},
        {text: 'Đồng ý', onPress: () => this._cartEdit(cart_data, CART_STATUS_CANCEL)},
      ]
    );
  }

  _renderActionsButton = (cart_data) => {
    var status = parseInt(cart_data.status);
    var data = [];

    switch (status) {
      case CART_STATUS_ORDERING:
        data = [
          {
            title: 'huỷ đơn',
            icon: 'times',
            bgrIcon: '#dd4b39',
            onPress: this._confirmCancelOrder
          }
        ];
        break;
      case CART_STATUS_READY:
        data = [
          {
            title: 'duyệt đơn',
            icon: 'check',
            onPress: () => {
              Alert.alert(
                'Xác nhận',
                'Bạn muốn duyệt đơn hàng này?',
                [
                  {text: 'Không', onPress: () => console.log('Cancel Pressed')},
                  {text: 'Đồng ý', onPress: () => this._cartEdit(cart_data, CART_STATUS_ACCEPTED)},
                ]
              );
            }
          },
          {
            title: 'huỷ đơn',
            icon: 'times',
            bgrIcon: '#dd4b39',
            onPress: this._confirmCancelOrder
          }
        ];
        break;
      case CART_STATUS_ACCEPTED:
        data = [
          {
            title: 'xử lý đơn',
            icon: 'check',
            onPress: () => {
              Alert.alert(
                'Xác nhận',
                'Bắt đầu xử lý đơn hàng này?',
                [
                  {text: 'Không', onPress: () => console.log('Cancel Pressed')},
                  {text: 'Đồng ý', onPress: () => this._cartEdit(cart_data, CART_STATUS_PROCESSING)},
                ]
              );
            }
          },
          {
            title: 'huỷ đơn',
            icon: 'times',
            bgrIcon: '#dd4b39',
            onPress: this._confirmCancelOrder
          }
        ];
        break;
      case CART_STATUS_PROCESSING:
        data = [
          {
            title: 'Giao đơn hàng',
            icon: 'check',
            onPress: () => {
              Alert.alert(
                'Xác nhận',
                'Bắt đầu giao đơn hàng này?',
                [
                  {text: 'Không', onPress: () => console.log('Cancel Pressed')},
                  {text: 'Đồng ý', onPress: () => this._cartEdit(cart_data, CART_STATUS_DELIVERY)},
                ]
              );
            }
          },
          {
            title: 'huỷ đơn',
            icon: 'times',
            bgrIcon: '#dd4b39',
            onPress: this._confirmCancelOrder
          }
        ];
        break;
      case CART_STATUS_DELIVERY:
        data = [
          {
            title: 'hoàn thành',
            icon: 'check',
            onPress: () => {
              Alert.alert(
                'Xác nhận',
                'Hoàn thành đơn hàng này?',
                [
                  {text: 'Không', onPress: () => console.log('Cancel Pressed')},
                  {text: 'Đồng ý', onPress: () => this._cartEdit(cart_data, CART_STATUS_COMPLETED)},
                ]
              );
            }
          },
          {
            title: 'huỷ đơn',
            icon: 'times',
            bgrIcon: '#dd4b39',
            onPress: this._confirmCancelOrder
          }
        ];
        break;
      case CART_STATUS_COMPLETED:
        data = [

        ];
        break;
    }

    var data_push = [
      {
        title: 'khách hàng',
        icon: 'user',
        bgrIcon: '#b3b3b3',
        onPress: () => {
          Actions.sale_user_info({
            title: 'THÔNG TIN',
            isGrayStyle: true
          });
        }
      }
    ];

    return [...data, ...data_push].map((item, index) => {
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

          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          //keyboardShouldPersistTaps="always"
          ref={ref => this.refs_confirm_page = ref}
          style={styles.content}>

          <View style={styles.userInfoBox}>
            <View style={styles.userInfoAvataBox}>
              <CachedImage
                source={{uri: cart_data.avatar}}
                style={styles.userInfoAvata} />
              <Text style={styles.userInfoName}>{cart_data.user.name}</Text>
            </View>

            <View style={styles.userInfoActions}>
              {this._renderActionsButton(cart_data)}
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
                <TouchableHighlight
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 15
                  }}
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <Text style={[styles.address_default_title, styles.title_active]}>SAO CHÉP</Text>
                </TouchableHighlight>
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
            <View style={styles.box_icon_label}>
              <Icon style={styles.icon_label} name="pencil-square-o" size={15} color="#999999" />
              <Text style={[styles.input_label]}>Ghi chú</Text>
            </View>
            <Text style={styles.input_note_value}>{cart_data.user_note || "Không có ghi chú"}</Text>
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
            {editMode && (
              <View style={[styles.address_default_box, {
                position: 'absolute',
                top: 0,
                right: 0
              }]}>
                <TouchableHighlight
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 15
                  }}
                  underlayColor="transparent"
                  onPress={() => {
                    Actions.list_product({
                      title: 'THÊM MẶT HÀNG',
                      cart_data,
                      reloadData: this._getData
                    });
                  }}>
                  <Text style={[styles.address_default_title, styles.title_active]}>THÊM MẶT HÀNG</Text>
                </TouchableHighlight>
              </View>
            )}
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
                    cart_id={cart_data.id}
                    site_id={cart_data.site_id}
                    reloadData={this._reloadData}
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

          {is_ready && (
            <View style={styles.boxButtonActions}>
              {editMode ? (
                <TouchableHighlight
                  style={[styles.buttonAction, {
                    marginLeft: 6
                  }]}
                  onPress={this._confirmSaveCart.bind(this, cart_data)}
                  underlayColor="transparent">
                  <View style={[styles.boxButtonAction, {
                    backgroundColor: DEFAULT_COLOR,
                    borderColor: "#999999"
                  }]}>
                    <Icon name="check" size={16} color="#ffffff" />
                    <Text style={[styles.buttonActionTitle, {
                      color: "#ffffff"
                    }]}>Chỉnh sửa xong</Text>
                  </View>
                </TouchableHighlight>
              ) : (
                <TouchableHighlight
                  style={[styles.buttonAction, {
                    marginLeft: 6
                  }]}
                  onPress={this._confirmEditCart.bind(this, cart_data)}
                  underlayColor="transparent">
                  <View style={[styles.boxButtonAction, {
                    backgroundColor: "#fa7f50",
                    borderColor: "#999999"
                  }]}>
                    <Icon name="pencil-square-o" size={16} color="#ffffff" />
                    <Text style={[styles.buttonActionTitle, {
                      color: "#ffffff"
                    }]}>Sửa đơn hàng</Text>
                  </View>
                </TouchableHighlight>
              )}
            </View>
          )}

        </ScrollView>
      </View>
    );
  }

  _confirmEditCart() {
    Alert.alert(
      'Xác nhận',
      'Bạn muốn chỉnh sửa đơn hàng này?',
      [
        {text: 'Không', onPress: () => console.log('Cancel Pressed')},
        {text: 'Đồng ý', onPress: () => {
          this.setState({
            editMode: true
          });

          layoutAnimation();
        }},
      ]
    );
  }

  _confirmSaveCart() {
    this.setState({
      editMode: false
    });

    layoutAnimation();
  }
}

class ItemCartComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      check_loading: false,
      increment_loading: false,
      decrement_loading: false,
      quantity: props.item.quantity,
      site_id: props.site_id,
      cart_id: props.cart_id
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      quantity: nextProps.item.quantity
    });
  }

  _incrementQnt(item) {
    var {quantity} = this.state;
    quantity = parseFloat(quantity) + 1;

    this.setState({
      increment_loading: true
    }, async () => {
      try {
        var {site_id, cart_id} = this.state;
        var response = await ADMIN_APIHandler.site_cart_up(site_id, cart_id, {
          product_id: item.id
        });

        if (response && response.status == STATUS_SUCCESS) {
          if (this.props.reloadData) {
            this.props.reloadData(response.data);
          }
        }

      } catch (e) {
        console.warn(e);
      } finally {
        this.setState({
          increment_loading: false
        });
      }
    });
  }

  _decrementQnt(item) {
    var {quantity} = this.state;
    quantity = parseFloat(quantity) - 1;

    if (quantity > 0) {
      this.setState({
        decrement_loading: true
      }, async () => {
        try {
          var {site_id, cart_id} = this.state;
          var response = await ADMIN_APIHandler.site_cart_down(site_id, cart_id, {
            product_id: item.id
          });

          if (response && response.status == STATUS_SUCCESS) {
            if (this.props.reloadData) {
              this.props.reloadData(response.data);
            }
          }

        } catch (e) {
          console.warn(e);
        } finally {
          this.setState({
            decrement_loading: false
          });
        }
      });
    } else {
      Alert.alert(
        'Xác nhận',
        `Xoá ${item.name} khỏi đơn hàng này?`,
        [
          {text: 'Không', onPress: () => console.log('Cancel Pressed')},
          {text: 'Đồng ý', onPress: async () => {
            try {
              var {site_id, cart_id} = this.state;
              var response = await ADMIN_APIHandler.site_cart_remove(site_id, cart_id, {
                product_id: item.id
              });

              if (response && response.status == STATUS_SUCCESS) {
                if (this.props.reloadData) {
                  this.props.reloadData(response.data);
                  layoutAnimation();
                }
              }

            } catch (e) {
              console.warn(e);
            } finally {
            }
          }},
        ]
      );
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
          <CachedImage mutable style={styles.cart_item_image} source={{uri: item.image}} />
        </View>

        <View style={styles.cart_item_info}>
          <View style={styles.cart_item_info_content}>
            <Text style={styles.cart_item_info_name}>{item.name}</Text>
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
                value={this.state.quantity.toString()}

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
