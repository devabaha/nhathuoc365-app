import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import store from '../../store/Store';
import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';
import { DiscountBadge } from '../../components/Badges';

class Items extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buying: false,
      loadmore: false
    };
  }
  unmounted = false;

  componentWillUnmount() {
    this.unmounted = true;
  }

  // add item vào giỏ hàng
  _addCart = (item, quantity = 1, model = '') => {
    if (this.props.buyPress) {
      this.props.buyPress(item);
    }

    // if (isIOS) {
    //   this._getMeasure(item);
    // }

    this.setState(
      {
        buying: true
      },
      async () => {
        const data = {
          quantity,
          model
        };
        const { t } = this.props;

        try {
          const response = await APIHandler.site_cart_plus(
            store.store_id,
            item.id,
            data
          );

          if (!this.unmounted) {
            if (response && response.status == STATUS_SUCCESS) {
              if (response.data.attrs) {
                Actions.push(appConfig.routes.itemAttribute, {
                  itemId: item.id,
                  onSubmit: (quantity, modal_key) =>
                    this._addCart(item, quantity, modal_key)
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

                // if (isIOS) {
                //   setTimeout(() => {
                //     store.setCartFlyPosition({
                //       px: 24,
                //       py: Util.size.height - NAV_HEIGHT - 64,
                //       width: 60,
                //       height: 60
                //     });
                //     layoutAnimation();
                //   }, 500);
                // }

                if (index !== null && index < length) {
                  store.setCartItemIndex(index);
                  Events.trigger(NEXT_PREV_CART, { index });
                  // setTimeout(() => {
                  //   store.setCartFlyShow(false);
                  //   store.setCartFlyImage(null);
                  // }, 750);
                }

                flashShowMessage({
                  message: response.message,
                  type: 'success'
                });
              }
            } else {
              flashShowMessage({
                message: response.message || t('common:api.error.message'),
                type: 'danger'
              });
            }
          }
        } catch (e) {
          console.warn(e + ' site_cart_plus');
          flashShowMessage({
            type: 'danger',
            message: t('common:api.error.message')
          });
        } finally {
          !this.unmounted &&
            this.setState({
              buying: false
            });
        }
      }
    );
  };

  _getMeasure(item) {
    action(() => {
      store.setCartFlyImage({ uri: item.image });
    })();

    if (this.ref_item) {
      this.ref_item.measure((a, b, width, height, px, py) => {
        action(() => {
          store.setCartFlyPosition({
            px,
            py: py - (isIOS ? NAV_HEIGHT : 0),
            width: ITEM_WIDTH,
            height: ITEM_IMG_HEIGHT
          });
        })();
      });
    }
  }

  render() {
    let { item, index, onPress, isCategories, isLocationItem, t } = this.props;

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
                backgroundColor: 'transparent'
              }
            ]}
          >
            <View
              ref={ref => (this.ref_item = ref)}
              style={styles.item_image_box}
            >
              {!!item.logo_url && (
                <Image
                  style={styles.item_image}
                  source={{ uri: item.logo_url }}
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
                height: ITEM_IMG_HEIGHT
              }
            ]}
          >
            <View
              ref={ref => (this.ref_item = ref)}
              style={styles.item_image_box}
            >
              {!!item.image && (
                <Image style={styles.item_image} source={{ uri: item.image }} />
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
              loadmore: true
            });
          }}
          underlayColor="transparent"
        >
          <View
            style={[
              styles.item_box,
              {
                marginRight: index % 2 == 0 ? 8 : 0,
                marginLeft: index % 2 == 0 ? 8 : 0,
                justifyContent: 'center',
                alignItems: 'center'
              }
            ]}
          >
            {this.state.loadmore ? (
              <Indicator size="small" />
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Icon name="th" size={24} color="#404040" />
                <Text
                  style={{
                    marginTop: 8,
                    color: '#404040',
                    fontSize: 14
                  }}
                >
                  {t('item.more')}
                </Text>
              </View>
            )}
          </View>
        </TouchableHighlight>
      );
    }

    var quantity = 0;

    return (
      <TouchableHighlight onPress={onPress} underlayColor="transparent">
        <View
          style={[
            styles.item_box,
            {
              marginRight: index % 2 == 0 ? 8 : 0,
              marginLeft: index % 2 == 0 ? 8 : 0
            }
          ]}
        >
          <View
            ref={ref => (this.ref_item = ref)}
            style={styles.item_image_box}
          >
            {!!item.image && (
              <Image style={styles.item_image} source={{ uri: item.image }} />
            )}
            <TouchableHighlight
              style={styles.item_add_cart_btn}
              underlayColor="transparent"
              onPress={() => this._addCart(item)}
            >
              <View
                style={{
                  width: '100%',
                  height: '100%'
                }}
              >
                <View style={styles.item_add_cart_box}>
                  {this.state.buying ? (
                    <View
                      style={{
                        width: 24,
                        height: 24
                      }}
                    >
                      <Indicator size="small" />
                    </View>
                  ) : item.book_flag == 1 ? (
                    <Icon
                      name="cart-arrow-down"
                      size={22}
                      color={DEFAULT_COLOR}
                    />
                  ) : (
                    <Icon name="cart-plus" size={22} color={'#0eac24'} />
                  )}
                  {item.book_flag == 1 ? (
                    <Text style={styles.item_add_book_title}>
                      {t('product:shopTitle.preOrder')}
                    </Text>
                  ) : (
                    <Text style={styles.item_add_cart_title}>
                      {t('product:shopTitle.buy')}
                    </Text>
                  )}

                  {quantity > 0 && (
                    <View style={styles.quantity_box}>
                      <Text style={styles.quantity_value}>{quantity}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableHighlight>

            {item.discount_percent > 0 && (
              <DiscountBadge
                containerStyle={styles.item_safe_off}
                label={saleFormat(item.discount_percent)}
              />
            )}
          </View>

          <View style={styles.item_info_box}>
            <View>
              <View style={styles.item_info_made}>
                <View style={styles.directionRow}>
                  {item.made_in != '' && (
                    <>
                      <Icon name="map-marker" size={12} color="#666666" />
                      <Text
                        numberOfLines={2}
                        style={styles.item_info_made_title}
                      >
                        {item.made_in}
                      </Text>
                    </>
                  )}
                </View>

                <View style={styles.item_info_weight}>
                  <Text style={styles.item_info_made_title}>
                    {item.unit_name_view}
                  </Text>
                </View>
              </View>
              <Text style={styles.item_info_name} numberOfLines={2}>
                {item.name}
              </Text>
            </View>
            <View style={styles.price_box}>
              {item.discount_percent > 0 && (
                <Text style={styles.item_safe_off_price}>
                  {item.discount_view}
                </Text>
              )}

              <Text
                style={[
                  styles.item_info_price,
                  {
                    color:
                      // item.discount_percent > 0 ? "#fa7f50" :
                      DEFAULT_COLOR
                  }
                ]}
              >
                {item.price_view}
              </Text>
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
  onPress: PropTypes.func.isRequired
};

const ITEM_WIDTH = Util.size.width / 2 - 12;
const ITEM_HEIGHT = (Util.size.width / 2) * 1.333;
const ITEM_IMG_HEIGHT = (Util.size.width / 2) * 1.333 * 0.666;

const styles = StyleSheet.create({
  item_box: {
    flex: 1,
    width: ITEM_WIDTH,
    // height: ITEM_HEIGHT,
    // borderWidth: Util.pixel,
    // borderWidth: Util.pixel,
    // borderColor: "#dddddd",
    backgroundColor: '#ffffff',
    marginBottom: 8
  },
  directionRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  item_image_box: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH
  },
  item_image: {
    zIndex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  item_info_box: {
    flex: 1,
    backgroundColor: 'red',
    // minHeight: "34%",
    paddingHorizontal: 8,
    paddingVertical: 7,
    // position: "absolute",
    // left: 0,
    // bottom: 0,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.7)'
  },
  item_info_made: {
    flexDirection: 'row'
  },
  item_info_made_title: {
    fontSize: 9,
    // fontWeight: "600",
    fontWeight: appConfig.device.isIOS ? '400' : '300',
    color: '#444',
    paddingHorizontal: 8
  },
  item_info_weight: {
    // flex: 1,
    marginLeft: 5,
    alignItems: 'flex-end'
  },
  item_info_name: {
    fontSize: 13,
    fontWeight: appConfig.device.isIOS ? '500' : '400',
    color: '#404040',
    marginTop: 2,
    marginBottom: 7,
    lineHeight: 18
  },
  item_info_price: {
    fontSize: 15,
    fontWeight: '600',
    color: DEFAULT_COLOR
  },
  item_add_cart_btn: {
    position: 'absolute',
    top: 0,
    right: 0,
    // width: 50,
    // height: 50,
    zIndex: 2
  },
  item_add_cart_box: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: hexToRgbA('#ffffff', 0.8),
    // backgroundColor: hexToRgbA("#0eac24", .6),
    paddingVertical: 2,
    // borderTopLeftRadius: 15,
    // padding: 10,
    width: 50,
    height: 45
  },
  item_add_cart_title: {
    color: '#0eac24',
    fontSize: 8
  },

  item_add_book_title: {
    color: DEFAULT_COLOR,
    fontSize: 8
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
    alignItems: 'center'
  },
  item_safe_off_percent: {
    // backgroundColor: "#fa7f50",
    backgroundColor: 'yellow',
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    ...elevationShadowStyle(3)
  },
  item_safe_off_percent_val: {
    color: '#ffffff',
    fontSize: 12
  },
  item_safe_off_price: {
    color: '#404040',
    fontSize: 11,
    textDecorationLine: 'line-through',
    marginRight: 4
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
    paddingHorizontal: 2
  },
  quantity_value: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '500'
  },
  price_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  nameLocation: {
    fontSize: 14,
    color: 'rgb(0,0,0)',
    alignSelf: 'center',
    marginTop: 10,
    fontWeight: 'bold'
  }
});

export default withTranslation(['stores', 'product', 'common'])(
  observer(Items)
);
