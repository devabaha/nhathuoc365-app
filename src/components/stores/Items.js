import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  // Image,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import store from '../../store/Store';
import {Actions} from 'react-native-router-flux';
import FastImage from 'react-native-fast-image';

import appConfig from 'app-config';
import {DiscountBadge} from '../../components/Badges';
import {PRODUCT_TYPES} from '../../constants';
import CTAProduct from '../item/CTAProduct';
import {CART_TYPES} from 'src/constants/cart';
import Ribbon from '../Ribbon/Ribbon';
class Items extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buying: false,
      loadmore: false,
    };
    this.CTAProduct = new CTAProduct(props.t, this);
  }
  unmounted = false;

  isServiceProduct(product = {}) {
    return product.product_type === PRODUCT_TYPES.SERVICE;
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  handlePressActionBtnProduct = (product, quantity = 1, model = '') => {
    this.CTAProduct.handlePressMainActionBtnProduct(product, CART_TYPES.NORMAL);
    // switch (product.product_type) {
    //   case PRODUCT_TYPES.NORMAL:
    //     this._addCart(product, quantity, model);
    //     break;
    //   case PRODUCT_TYPES.SERVICE:
    //     this.goToSchedule(product);
    //     break;
    //   default:
    //     this._addCart(product, quantity, model);
    //     break;
    // }
  };

  goToSchedule = (product) => {
    Actions.push(appConfig.routes.productSchedule, {
      productId: product.id,
    });
  };

  // add item vào giỏ hàng
  _addCart = (item, quantity = 1, model = '') => {
    if (this.props.buyPress) {
      this.props.buyPress(item);
    }

    this.setState(
      {
        buying: true,
      },
      async () => {
        const data = {
          quantity,
          model,
        };
        const {t} = this.props;

        try {
          const response = await APIHandler.site_cart_plus(
            store.store_id,
            item.id,
            data,
          );

          if (!this.unmounted) {
            if (response && response.status == STATUS_SUCCESS) {
              if (response.data.attrs) {
                Actions.push(appConfig.routes.itemAttribute, {
                  itemId: item.id,
                  onSubmit: (quantity, modal_key) =>
                    this._addCart(item, quantity, modal_key),
                });
              } else {
                store.setCartData(response.data);

                var index = null,
                  length = 0;
                if (response.data.products) {
                  length = Object.keys(response.data.products).length;

                  Object.keys(response.data.products)
                    .reverse()
                    .some((key, key_index) => {
                      let value = response.data.products[key];
                      if (value.id == item.id) {
                        index = key_index;
                        return true;
                      }
                    });
                }

                flashShowMessage({
                  message: response.message,
                  type: 'success',
                });
              }
            } else {
              flashShowMessage({
                message: response.message || t('common:api.error.message'),
                type: 'danger',
              });
            }
          }
        } catch (e) {
          console.warn(e + ' site_cart_plus');
          flashShowMessage({
            type: 'danger',
            message: t('common:api.error.message'),
          });
        } finally {
          !this.unmounted &&
            this.setState({
              buying: false,
            });
        }
      },
    );
  };

  render() {
    let {item, index, onPress, isCategories, isLocationItem, t} = this.props;
    // render item chọn khu vực đặt hàng
    if (isLocationItem) {
      return (
        <TouchableHighlight onPress={onPress} underlayColor="transparent">
          <View
            style={[
              styles.item_box,
              {
                marginRight: index % 2 == 0 ? 8 : 0,
                marginLeft: index % 2 == 0 ? 8 : 0,
                backgroundColor: 'transparent',
              },
            ]}>
            <View
              ref={(ref) => (this.ref_item = ref)}
              style={styles.item_image_box}>
              {!!item.logo_url && (
                <FastImage
                  style={styles.item_image}
                  source={{uri: item.logo_url}}
                  resizeMode="cover"
                />
              )}
            </View>
            <Text style={styles.nameLocation}>{item.name}</Text>
          </View>
        </TouchableHighlight>
      );
    }

    // render item danh mục sản phẩm màn home
    if (isCategories) {
      return (
        <TouchableHighlight onPress={onPress} underlayColor="transparent">
          <View
            style={[
              styles.item_box,
              {
                marginRight: index % 2 == 0 ? 8 : 0,
                marginLeft: index % 2 == 0 ? 8 : 0,
                height: ITEM_IMG_HEIGHT,
              },
            ]}>
            <View
              ref={(ref) => (this.ref_item = ref)}
              style={styles.item_image_box}>
              {!!item.image && (
                <FastImage
                  style={styles.item_image}
                  source={{uri: item.image}}
                  resizeMode="cover"
                />
              )}
            </View>
          </View>
        </TouchableHighlight>
      );
    }

    // button load more
    if (item.type == 'loadmore') {
      return (
        <TouchableHighlight
          onPress={() => {
            if (onPress) {
              onPress();
            }

            this.setState({
              loadmore: true,
            });
          }}
          underlayColor="transparent">
          <View
            style={[
              styles.item_box,
              {
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            {this.state.loadmore ? (
              <Indicator size="small" />
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="th" size={24} color="#404040" />
                <Text
                  style={{
                    marginTop: 8,
                    color: '#404040',
                    fontSize: 14,
                  }}>
                  {t('item.more')}
                </Text>
              </View>
            )}
          </View>
        </TouchableHighlight>
      );
    }

    var quantity = 0;
    const {containerStyle, contentStyle} = this.props;
    return (
      <TouchableHighlight onPress={onPress} underlayColor="transparent">
        <View style={[styles.item_box, containerStyle]}>
          <View style={[styles.item_box_container, contentStyle]}>
            <View
              ref={(ref) => (this.ref_item = ref)}
              style={styles.item_image_box}>
              {!!item.image && (
                <FastImage
                  style={styles.item_image}
                  source={{uri: item.image}}
                  resizeMode="cover"
                />
              )}
            </View>
            {item.discount_percent > 0 && (
              <View style={styles.discountBadgeContainer}>
                <Ribbon text={saleFormat(item.discount_percent)} />
              </View>
            )}

            <View style={styles.item_info_box}>
              <View>
                <Text style={styles.item_info_name} numberOfLines={2}>
                  {item.name}
                </Text>
              </View>
              <View style={styles.price_box}>
                <View
                  style={{
                    maxWidth: '80%',
                  }}>
                  {item.discount_percent > 0 && (
                    <Text style={styles.item_safe_off_price}>
                      <Text style={{textDecorationLine: 'line-through'}}>
                        {item.discount_view}
                      </Text>
                      / {item.unit_name}
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.item_info_price,
                      {
                        color:
                          // item.discount_percent > 0 ? "#fa7f50" :
                          DEFAULT_COLOR,
                      },
                    ]}>
                    {item.price_view}
                  </Text>
                </View>
                <TouchableHighlight
                  style={styles.item_add_cart_btn}
                  underlayColor="transparent"
                  onPress={() => this.handlePressActionBtnProduct(item)}>
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                    }}>
                    <View style={styles.item_add_cart_box}>
                      {this.state.buying ? (
                        <View
                          style={{
                            width: 24,
                            height: 24,
                          }}>
                          <Indicator size="small" />
                        </View>
                      ) : this.isServiceProduct(item) ? (
                        <Icon
                          name="calendar-plus-o"
                          size={22}
                          color="#0eac24"
                        />
                      ) : (
                        <MaterialIcons
                          name="add-shopping-cart"
                          size={22}
                          color={'#0eac24'}
                        />
                      )}
                      {/* {this.isServiceProduct(item) ? (
                        <Text style={styles.item_add_cart_title}>
                          {t('product:shopTitle.book')}
                        </Text>
                      ) : (
                        <Text style={styles.item_add_cart_title}>
                          {t('product:shopTitle.buy')}
                        </Text>
                      )} */}

                      {quantity > 0 && (
                        <View style={styles.quantity_box}>
                          <Text style={styles.quantity_value}>{quantity}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

Items.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
};

const ITEM_WIDTH = appConfig.device.width / 2 - 5;
const ITEM_HEIGHT = (Util.size.width / 2) * 1.333;
const ITEM_IMG_HEIGHT = (Util.size.width / 2) * 1.333 * 0.666;

const styles = StyleSheet.create({
  item_box: {
    width: ITEM_WIDTH,
    paddingVertical: 5,
    flex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#333',
        shadowOffset: {
          width: 1,
          height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
    overflow: 'visible',
  },
  item_box_container: {
    overflow: 'visible',
    marginHorizontal: 5,
    backgroundColor: '#fff',
    flex: 1,
    borderRadius: 7,
    elevation: 4,
  },
  directionRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item_image_box: {
    width: ITEM_WIDTH - 10,
    height: ITEM_WIDTH - 10,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  item_image: {
    zIndex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  item_info_box: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 7,
    position: 'relative',
  },
  item_info_made: {
    flexDirection: 'row',
  },
  item_info_made_title: {
    fontSize: 9,
    // fontWeight: "600",
    fontWeight: appConfig.device.isIOS ? '400' : '300',
    color: '#444',
    paddingHorizontal: 8,
  },
  item_info_weight: {
    // flex: 1,
    marginLeft: 5,
    alignItems: 'flex-end',
  },
  item_info_name: {
    fontSize: 13,
    fontWeight: appConfig.device.isIOS ? '500' : '400',
    color: '#404040',
    marginTop: 2,
    marginBottom: 7,
    lineHeight: 18,
  },
  item_info_price: {
    fontSize: 15,
    fontWeight: '600',
    color: DEFAULT_COLOR,
  },
  item_add_cart_btn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 2,
  },
  item_add_cart_box: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: hexToRgbA('#ffffff', 0.8),
    paddingVertical: 2,
  },
  item_add_cart_title: {
    color: '#0eac24',
    fontSize: 8,
    marginTop: 3,
  },

  item_add_book_title: {
    color: DEFAULT_COLOR,
    fontSize: 8,
  },

  item_safe_off: {
    zIndex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: '100%',
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item_safe_off_percent: {
    // backgroundColor: "#fa7f50",
    backgroundColor: 'yellow',
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    ...elevationShadowStyle(3),
  },
  item_safe_off_percent_val: {
    color: '#ffffff',
    fontSize: 12,
  },
  item_safe_off_price: {
    color: '#A0A0A0',
    fontSize: 13,
    marginRight: 4,
    paddingBottom: 4,
  },

  quantity_box: {
    position: 'absolute',
    top: 0,
    right: 8,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  quantity_value: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '500',
  },
  price_box: {
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  nameLocation: {
    fontSize: 14,
    color: 'rgb(0,0,0)',
    alignSelf: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  discountBadgeContainer: {
    top: 10,
    left: -5,
    position: 'absolute',
    zIndex: 99,
  },
});

export default withTranslation(['stores', 'product', 'common'])(
  observer(Items),
);
