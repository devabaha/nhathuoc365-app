import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import appConfig from 'app-config';
import ImageBackground from '../../../ImageBg';
import Loading from '../../../Loading';
import {DiscountBadge} from '../../../Badges';
import Themes from 'src/Themes';
import Indicator from 'src/components/Indicator';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PRODUCT_TYPES} from 'src/constants';
import {CART_TYPES} from 'src/constants/cart';
import CTAProduct from 'src/components/item/CTAProduct';
import {debounce} from 'lodash';

const homeThemes = Themes.getNameSpace('home');
const productItemStyle = homeThemes('styles.home.listProduct');

class ProductItem extends PureComponent {
  constructor(props) {
    super(props);
    this.CTAProduct = new CTAProduct(props.t, this);
  }
  static propTypes = {
    name: PropTypes.string,
    image: PropTypes.string,
    discount_view: PropTypes.string,
    discount_percent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price_view: PropTypes.string,
    onPress: PropTypes.func,
    last: PropTypes.bool,
    horizontal: PropTypes.bool,
    item: PropTypes.object,
  };

  static defaultProps = {
    name: '',
    image: '',
    discount_view: '',
    discount_percent: 0,
    price_view: '',
    onPress: () => {},
    last: false,
    buying: false,
  };

  state = {
    loading: false,
  };
  unmounted = false;

  isServiceProduct(product = {}) {
    return product.product_type === PRODUCT_TYPES.SERVICE;
  }

  handlePress = debounce(
    () => {
      if (!!this.props.selfRequest) {
        this.setState({
          loading: true,
        });
        this.handleSelfRequest();
      } else {
        this.props.onPress();
      }
    },
    500,
    {leading: true, trailing: false},
  );

  handlePressActionBtnProduct = () => {
    const {item} = this.props;
    this.CTAProduct.handlePressMainActionBtnProduct(item, CART_TYPES.NORMAL);
  };

  handleSelfRequest = () => {
    this.props.selfRequest(() => {
      !this.unmounted && this.setState({loading: false});
    });
  };

  render() {
    const {containerStyle, item, horizontal} = this.props;
    const extraContainerStyle = horizontal && styles.containerHorizontal;
    const extraImageStyle = horizontal && styles.imageHorizontal;
    return (
      <View style={[styles.container, extraContainerStyle, containerStyle]}>
        <TouchableOpacity
          onPress={this.handlePress}
          activeOpacity={0.8}
          style={[styles.wrapper, this.props.wrapperStyle]}>
          {this.props.renderContent ? (
            this.props.renderContent()
          ) : (
            <>
              <View>
                <FastImage
                  source={{
                    uri: this.props.image,
                  }}
                  style={[styles.image, extraImageStyle]}
                  resizeMode="cover"
                />
                {!!item.brand && (
                  <View style={styles.brandTagContainer}>
                    <Text numberOfLines={1} style={styles.brandTag}>
                      {item.brand}
                    </Text>
                  </View>
                )}
              </View>

              {this.props.discount_percent > 0 && (
                <DiscountBadge
                  containerStyle={styles.saleContainer}
                  contentContainerStyle={styles.saleContentContainer}
                  tailSpace={4}
                  label={saleFormat(this.props.discount_percent)}
                />
              )}
              <View style={[styles.infoWrapper]}>
                <Text style={styles.name} numberOfLines={2}>
                  {this.props.name}
                </Text>

                <View style={styles.priceWrapper}>
                  <View style={styles.priceContainer}>
                    {!!this.props.item.commission_value && 
                        <Text style={styles.commissionText} numberOfLines={1}>
                          {this.props.item.commission_value_view}
                        </Text>
                    }

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      {this.props.discount_percent > 0 && (
                        <Text style={styles.discount}>
                          <Text style={styles.deletedTitle}>
                            {this.props.discount_view}
                          </Text>
                          {/* / {this.props.unit_name} */}
                        </Text>
                      )}
                    </View>
                    <View style={[styles.priceBox]}>
                      <Text style={[styles.price]}>
                        {this.props.price_view}
                        {!!item.unit_name && (
                          <View>
                            <Text style={styles.unitName}>
                              {'/ ' + item.unit_name_view}
                            </Text>
                          </View>
                        )}
                      </Text>

                      <TouchableOpacity
                        style={styles.item_add_cart_box}
                        onPress={this.handlePressActionBtnProduct}>
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          {this.state.buying ? (
                            <Indicator size="small" />
                          ) : this.isServiceProduct(item) ? (
                            <Icon name="calendar-plus-o" style={styles.icon} />
                          ) : (
                            <MaterialIcons
                              name="add-shopping-cart"
                              style={styles.icon}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const MARGIN_ITEM = 7.5;
const WIDTH_ITEM = appConfig.device.width / 2 - MARGIN_ITEM * 3;
const HORIZONTAL_WIDTH_ITEM = appConfig.device.width * 0.4;

let styles = StyleSheet.create({
  container: {
    marginHorizontal: MARGIN_ITEM,
    marginTop: MARGIN_ITEM * 2,
    marginBottom: 0,
    width: WIDTH_ITEM,
  },
  containerHorizontal: {
    width: HORIZONTAL_WIDTH_ITEM,
  },
  wrapper: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    ...appConfig.styles.shadow,
  },
  image: {
    width: '100%',
    height: WIDTH_ITEM,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  imageHorizontal: {
    height: HORIZONTAL_WIDTH_ITEM,
  },
  infoWrapper: {
    flex: 1,
    padding: 10,
  },
  name: {
    flex: 1,
    marginBottom: 8,
    ...appConfig.styles.typography.text,
  },
  priceWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
  },
  commissionText: {
    color: appConfig.colors.cherry,
  },
  discount: {
    marginTop: 4,
    ...appConfig.styles.typography.secondary,
  },
  priceBox: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    flex: 1,
    flexWrap: 'wrap',
    paddingRight: 5,
    ...appConfig.styles.typography.heading3,
    color: appConfig.colors.primary,
  },
  loading: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,.12)',
  },
  discountBadgeContainer: {
    top: 10,
    left: -4,
    position: 'absolute',
    width: undefined,
    ...elevationShadowStyle(1),
  },
  item_add_cart_box: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: hexToRgbA('#ffffff', 0.8),
    paddingVertical: 2,
  },

  saleContainer: {
    position: 'absolute',
    top: 8,
  },
  saleContentContainer: {
    paddingHorizontal: 7,
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
  },
  deletedTitle: {
    textDecorationLine: 'line-through',
  },
  icon: {
    fontSize: 20,
    color: appConfig.colors.highlight[1],
  },
  brandTagContainer: {
    position: 'absolute',
    bottom: -5,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    maxWidth: WIDTH_ITEM * 0.8,
    borderWidth: appConfig.device.pixel,
    borderRightWidth: 0,
    borderBottomWidth: 1.2,
    borderColor: '#ddd',
    borderBottomColor: '#ddd',
  },
 brandTag: {
    color: appConfig.colors.primary,
    fontWeight: '500',
    fontSize: 12,
  },
  unitName: {
    fontSize: 11,
    color: '#888',
    marginTop: appConfig.device.isIOS ? 2 : 0,
    top: appConfig.device.isAndroid ? 2 : undefined,
    lineHeight: appConfig.device.isAndroid ? 11 : undefined,
  },
});

styles = Themes.mergeStyles(styles, productItemStyle);

export default ProductItem;
