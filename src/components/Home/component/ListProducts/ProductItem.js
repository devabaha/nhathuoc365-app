import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, TouchableOpacity, Keyboard} from 'react-native';
import FastImage from 'react-native-fast-image';
import appConfig from 'app-config';
import {DiscountBadge} from '../../../Badges';
import Themes from 'src/Themes';
import Indicator from 'src/components/Indicator';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ORDER_TYPES} from 'src/constants';
import {CART_TYPES} from 'src/constants/cart';
import CTAProduct from 'src/components/item/CTAProduct';
import {debounce} from 'lodash';
import {isOutOfStock} from 'app-helper/product';
import {hasVideo} from 'app-helper/product/product';
import {Card, Container, Typography} from 'src/components/base';
import Image from 'src/components/Image';
import {TypographyType} from 'src/components/base/Typography/constants';
import {mergeStyles} from 'src/Themes/helper';
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
import {IconButton} from 'src/components/base/Button';
import {BundleIconSetName} from 'src/components/base/Icon/constants';

const homeThemes = Themes.getNameSpace('home');
const productItemStyle = homeThemes('styles.home.listProduct');

class ProductItem extends PureComponent {
  static contextType = ThemeContext;

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

  get theme() {
    return getTheme(this);
  }

  isServiceProduct(product = {}) {
    return product.order_type === ORDER_TYPES.BOOKING;
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
    if (!!item.has_attr) {
      Keyboard.dismiss();
    }
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

    const brandTagContainerStyle = mergeStyles(styles.brandTagContainer, {
      borderColor: this.theme.color.border,
    });

    const iconBuyStyle = mergeStyles(styles.icon, {
      color: this.theme.color.accent1,
    });

    return (
      <View style={[styles.container, extraContainerStyle, containerStyle]}>
        <TouchableOpacity
          style={styles.wrapper}
          onPress={this.handlePress}
          activeOpacity={0.8}>
          <Card style={[styles.wrapper, this.props.wrapperStyle]}>
            {this.props.renderContent ? (
              this.props.renderContent()
            ) : (
              <>
                <View>
                  <Image
                    source={{
                      uri: this.props.image,
                    }}
                    style={[styles.image, extraImageStyle]}
                    resizeMode="cover"
                  />
                  {(!!item.brand || hasVideo(item)) && (
                    <View pointerEvents="none" style={styles.overlayContainer}>
                      {hasVideo(item) && (
                        <View style={styles.videoContainer}>
                          <Icon name="play" style={styles.iconVideo} />
                        </View>
                      )}
                      {!!item.brand && (
                        <Container style={brandTagContainerStyle}>
                          <Typography
                            type={TypographyType.DESCRIPTION_SMALL_PRIMARY}
                            numberOfLines={1}
                            style={styles.brandTag}>
                            {item.brand}
                          </Typography>
                        </Container>
                      )}
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
                  <Typography
                    type={TypographyType.LABEL_MEDIUM}
                    style={styles.name}
                    numberOfLines={2}>
                    {this.props.name}
                  </Typography>

                  <View style={styles.priceWrapper}>
                    <View style={styles.priceContainer}>
                      {!!this.props.item.commission_value && (
                        <Text style={styles.commissionText} numberOfLines={1}>
                          {this.props.item.commission_value_view}
                        </Text>
                      )}

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        {this.props.discount_percent > 0 && (
                          <Typography
                            type={TypographyType.DESCRIPTION_MEDIUM}
                            style={styles.discount}>
                            <Text style={styles.deletedTitle}>
                              {this.props.discount_view}
                            </Text>
                            {/* / {this.props.unit_name} */}
                          </Typography>
                        )}
                      </View>
                      <View style={[styles.priceBox]}>
                        <Typography
                          type={TypographyType.LABEL_LARGE_PRIMARY}
                          style={[styles.price]}>
                          {this.props.price_view}
                          {!!item.unit_name && (
                            <View>
                              <Typography
                                type={TypographyType.DESCRIPTION_SMALL}
                                style={styles.unitName}>
                                {'/ ' + item.unit_name_view}
                              </Typography>
                            </View>
                          )}
                        </Typography>

                        <Container
                          style={{
                            minWidth: 20,
                            minHeight: 24,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          {this.state.buying ? (
                            <Indicator size="small" />
                          ) : (
                            <IconButton
                              disabled={isOutOfStock(item)}
                              style={styles.item_add_cart_box}
                              onPress={this.handlePressActionBtnProduct}
                              hitSlop={HIT_SLOP}
                              bundle={
                                this.isServiceProduct(item)
                                  ? BundleIconSetName.FONT_AWESOME
                                  : BundleIconSetName.MATERIAL_ICONS
                              }
                              name={
                                this.isServiceProduct(item)
                                  ? 'calendar-plus-o'
                                  : 'add-shopping-cart'
                              }
                              iconStyle={iconBuyStyle}
                            />
                          )}
                        </Container>

                        {/* <TouchableOpacity
                          disabled={isOutOfStock(item)}
                          style={styles.item_add_cart_box}
                          onPress={this.handlePressActionBtnProduct}
                          hitSlop={HIT_SLOP}>
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
                              <Icon
                                name="calendar-plus-o"
                                style={styles.icon}
                              />
                            ) : (
                              <MaterialIcons
                                name="add-shopping-cart"
                                style={[
                                  styles.icon,
                                  isOutOfStock(item) && styles.iconDisabled,
                                ]}
                              />
                            )}
                          </View>
                        </TouchableOpacity> */}
                      </View>
                    </View>
                  </View>
                </View>
              </>
            )}
          </Card>
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
    // borderRadius: 8,
    // backgroundColor: '#fff',
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
    // ...appConfig.styles.typography.text,
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
    // ...appConfig.styles.typography.secondary,
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
    fontWeight: '600',
    // ...appConfig.styles.typography.heading3,
    // color: appConfig.colors.primary,
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
    // backgroundColor: hexToRgba('#ffffff', 0.8),
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
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  videoContainer: {
    marginLeft: 'auto',
    marginRight: 7,
    marginBottom: 7,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  icon: {
    fontSize: 20,
    // color: appConfig.colors.highlight[1],
  },
  iconDisabled: {
    color: '#ddd',
  },
  iconVideo: {
    color: appConfig.colors.white,
    fontSize: appConfig.device.isIOS ? 10 : 9,
    left: appConfig.device.isIOS ? 1.5 : 0.75,
  },
  brandTagContainer: {
    // backgroundColor: '#fff',
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
    marginBottom: -5,
  },
  brandTag: {
    // color: appConfig.colors.primary,
    fontWeight: '500',
    // fontSize: 12,
  },
  unitName: {
    // fontSize: 11,
    // color: '#888',
    marginTop: appConfig.device.isIOS ? 2 : 0,
    top: appConfig.device.isAndroid ? 2 : undefined,
    lineHeight: appConfig.device.isAndroid ? 11 : undefined,
  },
});

styles = Themes.mergeStyles(styles, productItemStyle);

export default withTranslation('product')(ProductItem);
