import React, {PureComponent} from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {debounce} from 'lodash';
// configs
import appConfig from 'app-config';
// helpers
import {isOutOfStock, hasVideo} from 'app-helper/product';
import {getTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
import {ORDER_TYPES} from 'src/constants';
import {CART_TYPES} from 'src/constants/cart';
import {PRODUCT_BUTTON_ACTION_LOADING_PARAM} from 'src/constants/product';
// entities
import Themes from 'src/Themes';
import CTAProduct from 'src/components/item/CTAProduct';
// custom components
import {DiscountBadge} from 'src/components/Badges';
import Indicator from 'src/components/Indicator';
import Image from 'src/components/Image';
import {
  BaseButton,
  IconButton,
  Icon,
  Card,
  Container,
  Typography,
} from 'src/components/base';

const homeThemes = Themes.getNameSpace('home');
const productItemStyle = homeThemes('styles.home.listProduct');

class ProductItem extends PureComponent {
  static contextType = ThemeContext;

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
    [PRODUCT_BUTTON_ACTION_LOADING_PARAM.ADD_TO_CART]: false,
  };

  state = {
    loading: false,
  };
  CTAProduct = new CTAProduct(this);

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
    this.CTAProduct.handlePressMainActionBtnProduct({
      product: item,
      cartType: CART_TYPES.NORMAL,
    });
  };

  handleSelfRequest = () => {
    this.props.selfRequest(() => {
      !this.unmounted && this.setState({loading: false});
    });
  };

  get videoContainerStyle() {
    return mergeStyles(styles.videoContainer, {
      backgroundColor: this.theme.color.overlay30,
    });
  }

  get iconVideoStyle() {
    return mergeStyles(styles.iconVideo, {color: this.theme.color.onOverlay});
  }

  get brandTagContainerStyle() {
    return mergeStyles(styles.brandTagContainer, {
      borderColor: this.theme.color.border,
      borderWidth: this.theme.layout.borderWidthPixel,
      borderTopLeftRadius: this.theme.layout.borderRadiusExtraSmall,
      borderBottomLeftRadius: this.theme.layout.borderRadiusExtraSmall,
    });
  }

  getIconBuyStyle(disabled) {
    return mergeStyles(
      styles.icon,
      !disabled && {
        color: this.theme.color.accent1,
      },
    );
  }

  get commissionTextStyle() {
    return mergeStyles(styles.commissionText, {
      color: this.theme.color.cherry,
    });
  }

  get saleContentContainerStyle() {
    return mergeStyles(styles.saleContentContainer, {
      borderTopRightRadius: this.theme.layout.borderRadiusExtraSmall,
      borderBottomRightRadius: this.theme.layout.borderRadiusExtraSmall,
    });
  }

  get imageStyle() {
    return mergeStyles(styles.image, {
      borderTopLeftRadius: this.theme.layout.borderRadiusMedium,
      borderTopRightRadius: this.theme.layout.borderRadiusMedium,
    });
  }

  render() {
    const {containerStyle, item, horizontal} = this.props;
    const extraContainerStyle = horizontal && styles.containerHorizontal;
    const extraImageStyle = horizontal && styles.imageHorizontal;
    const disabled = isOutOfStock(item);

    return (
      <View style={[styles.container, extraContainerStyle, containerStyle]}>
        <BaseButton style={styles.wrapper} onPress={this.handlePress}>
          <Card shadow flex>
            <Card flex>
              {this.props.renderContent ? (
                this.props.renderContent()
              ) : (
                <>
                  <View>
                    <Image
                      source={{
                        uri: this.props.image,
                      }}
                      style={[this.imageStyle, extraImageStyle]}
                      resizeMode="cover"
                    />
                    {(!!item.brand || hasVideo(item)) && (
                      <View
                        pointerEvents="none"
                        style={styles.overlayContainer}>
                        {hasVideo(item) && (
                          <View style={this.videoContainerStyle}>
                            <Icon
                              bundle={BundleIconSetName.FONT_AWESOME}
                              name="play"
                              style={this.iconVideoStyle}
                            />
                          </View>
                        )}
                        {!!item.brand && (
                          <Container style={this.brandTagContainerStyle}>
                            <Typography
                              type={TypographyType.LABEL_SMALL_PRIMARY}
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
                      contentContainerStyle={this.saleContentContainerStyle}
                      tailSpace={4}
                      label={saleFormat(this.props.discount_percent)}
                    />
                  )}
                  <View style={styles.infoWrapper}>
                    <Typography
                      type={TypographyType.LABEL_MEDIUM}
                      style={styles.name}
                      numberOfLines={2}>
                      {this.props.name}
                    </Typography>

                    <View style={styles.priceWrapper}>
                      <View style={styles.priceContainer}>
                        {!!this.props.item.commission_value && (
                          <Typography
                            type={TypographyType.LABEL_MEDIUM}
                            style={this.commissionTextStyle}
                            numberOfLines={1}>
                            {this.props.item.commission_value_view}
                          </Typography>
                        )}

                        <View style={styles.priceBox}>
                          <Typography
                            type={TypographyType.LABEL_LARGE_PRIMARY}
                            style={styles.price}>
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
                            noBackground
                            style={{
                              minWidth: 20,
                              minHeight: 24,
                              justifyContent: 'center',
                              alignItems: 'center',
                              alignSelf: 'flex-end',
                            }}>
                            {this.state[
                              PRODUCT_BUTTON_ACTION_LOADING_PARAM.ADD_TO_CART
                            ] ? (
                              <Indicator size="small" />
                            ) : (
                              <IconButton
                                disabled={disabled}
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
                                iconStyle={this.getIconBuyStyle(disabled)}
                              />
                            )}
                          </Container>
                        </View>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </Card>
          </Card>
        </BaseButton>
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
  },
  image: {
    width: '100%',
    height: WIDTH_ITEM,
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
  commissionText: {},
  discount: {
    marginTop: 4,
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
  },

  item_add_cart_box: {
    justifyContent: 'center',
    // alignItems: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 2,
  },

  saleContainer: {
    position: 'absolute',
    top: 8,
  },
  saleContentContainer: {
    paddingHorizontal: 7,
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
  },
  icon: {
    fontSize: 20,
  },
  iconVideo: {
    fontSize: appConfig.device.isIOS ? 10 : 9,
    left: appConfig.device.isIOS ? 1.5 : 0.75,
  },
  brandTagContainer: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    maxWidth: WIDTH_ITEM * 0.8,
    borderRightWidth: 0,
    borderBottomWidth: 1.2,
    marginBottom: -5,
  },
  brandTag: {
    fontWeight: '500',
  },
  unitName: {
    marginTop: appConfig.device.isIOS ? 2 : 0,
    top: appConfig.device.isAndroid ? 2 : undefined,
    lineHeight: appConfig.device.isAndroid ? 11 : undefined,
  },
});

styles = Themes.mergeStyles(styles, productItemStyle);

export default withTranslation('product')(ProductItem);
