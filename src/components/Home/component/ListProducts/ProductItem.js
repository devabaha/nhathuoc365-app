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
import Ribbon from 'src/components/Ribbon/Ribbon';
import Indicator from 'src/components/Indicator';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PRODUCT_TYPES} from 'src/constants';
import {CART_TYPES} from 'src/constants/cart';
import CTAProduct from 'src/components/item/CTAProduct';

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

  handlePress = () => {
    if (!!this.props.selfRequest) {
      this.setState({
        loading: true,
      });
      this.handleSelfRequest();
    } else {
      this.props.onPress();
    }
  };

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
    const {containerStyle, item} = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <TouchableOpacity
          onPress={this.handlePress}
          activeOpacity={0.8}
          style={[styles.wrapper, this.props.wrapperStyle]}>
          <FastImage
            source={{
              uri: this.props.image,
            }}
            style={styles.image}
            resizeMode="cover"
          />

          {this.props.discount_percent > 0 && (
            <View style={styles.discountBadgeContainer}>
              <Ribbon text={saleFormat(this.props.discount_percent)} />
            </View>
          )}
          <View style={[styles.infoWrapper]}>
            <Text style={styles.name} numberOfLines={2}>
              {this.props.name}
            </Text>

            <View style={styles.priceWrapper}>
              <View>
                {this.props.discount_percent > 0 && (
                  <Text style={styles.discount}>
                    <Text style={{textDecorationLine: 'line-through'}}>
                      {this.props.discount_view}
                    </Text>
                    / {this.props.unit_name}
                  </Text>
                )}
                <View style={[styles.priceBox]}>
                  <Text style={[styles.price]}>{this.props.price_view}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.item_add_cart_box}
                onPress={this.handlePressActionBtnProduct}>
                {this.state.buying ? (
                  <View
                    style={{
                      width: 24,
                      height: 24,
                    }}>
                    <Indicator size="small" />
                  </View>
                ) : this.isServiceProduct(item) ? (
                  <Icon name="calendar-plus-o" size={22} color="#0eac24" />
                ) : (
                  <MaterialIcons
                    name="add-shopping-cart"
                    size={22}
                    color={'#0eac24'}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  wrapper: {
    width: appConfig.device.width / 2 - 40,
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
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
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  infoWrapper: {
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    paddingBottom: 5,
  },
  priceWrapper: {
    width: '100%',
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  discount: {
    color: '#404040',
    fontSize: 13,
  },
  priceBox: {
    marginTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(85, 185, 71, 1)',
  },
  price: {
    color: '#fff',
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
});

styles = Themes.mergeStyles(styles, productItemStyle);

export default ProductItem;
