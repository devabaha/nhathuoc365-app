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
import {ORDER_TYPES} from '../../constants';
import CTAProduct from '../item/CTAProduct';
import {CART_TYPES} from 'src/constants/cart';
import {ProductItem} from '../Home/component/ListProducts';
class Items extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buying: false,
      loadMore: false,
    };
    this.CTAProduct = new CTAProduct(props.t, this);
  }
  unmounted = false;

  isServiceProduct(product = {}) {
    return product.order_type === ORDER_TYPES.BOOKING;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.index !== this.props.index && nextState.loadMore) {
      this.setState({loadMore: false});
    }

    return true;
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.setState({loadMore: false});
  }

  handlePressActionBtnProduct = (product, quantity = 1, model = '') => {
    this.CTAProduct.handlePressMainActionBtnProduct(product, CART_TYPES.NORMAL);
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

  getItemExtraStyle(index) {
    return (
      index % 2 !== 0 && {
        marginHorizontal: 0,
        // marginLeft: index % 2 == 0 ? 15 : 0,
      }
    );
  }

  render() {
    let {item, index, onPress, t} = this.props;
    let renderLoadMore = null;
    // button load more
    if (item.type == 'loadMore') {
      renderLoadMore = () => {
        return (
          <TouchableHighlight
            onPress={() => {
              if (onPress) {
                onPress();
              }

              this.setState({
                loadMore: true,
              });
            }}
            underlayColor="transparent"
            style={[
              {
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              },
            ]}>
            {this.state.loadMore ? (
              <Indicator size="small" />
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="th" size={24} color={appConfig.colors.typography.text} />
                <Text
                  style={{
                    marginTop: 8,
                    ...appConfig.styles.typography.text
                  }}>
                  {t('item.more')}
                </Text>
              </View>
            )}
          </TouchableHighlight>
        );
      };
    }

    var quantity = 0;

    return (
      <ProductItem
        containerStyle={[styles.wrapper, this.getItemExtraStyle(index)]}
        name={item.name}
        image={item.image}
        discount_view={item.discount_view}
        discount_percent={item.discount_percent}
        price_view={item.price_view}
        unit_name={item.unit_name}
        onPress={onPress}
        item={item}
        renderContent={renderLoadMore}
      />
    );
  }
}

Items.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
};

const ITEM_SPACING = 15;
const ITEM_WIDTH = (appConfig.device.width - ITEM_SPACING * 3) / 2;
const ITEM_HEIGHT = (appConfig.device.width / 2) * 1.333;
const ITEM_IMG_HEIGHT = (appConfig.device.width / 2) * 1.333 * 0.666;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 0,
    marginBottom: 15,
    marginHorizontal: 15,
    width: ITEM_WIDTH,
  },
  container: {
    borderRadius: 8,
    ...appConfig.styles.shadow,
  },
  item_box: {
    width: ITEM_WIDTH,
    // height: ITEM_HEIGHT,
    // borderWidth: Util.pixel,
    // borderWidth: Util.pixel,
    // borderColor: "#dddddd",
    backgroundColor: '#ffffff',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  directionRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item_image_box: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
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
    backgroundColor: 'red',
    // minHeight: "34%",
    paddingHorizontal: 8,
    paddingVertical: 7,
    // position: "absolute",
    // left: 0,
    // bottom: 0,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.7)',
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
    top: 0,
    right: 0,
    // width: 50,
    // height: 50,
    zIndex: 2,
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
    height: 45,
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
    color: '#404040',
    fontSize: 11,
    textDecorationLine: 'line-through',
    marginRight: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  nameLocation: {
    fontSize: 14,
    color: 'rgb(0,0,0)',
    alignSelf: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default withTranslation(['stores', 'product', 'common'])(
  observer(Items),
);
