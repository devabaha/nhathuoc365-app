import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// images
import SVGCoupon from 'src/images/coupon.svg';
// custom components
import {
  BaseButton,
  Container,
  Icon,
  IconButton,
  OutlinedButton,
  Typography,
} from 'src/components/base';
import Indicator from 'src/components/Indicator';
import Image from 'src/components/Image';
import {DiscountBadge} from 'src/components/Badges';
import ExtraQuantityInput from '../cart/CartItem/ExtraQuantityInput';

const styles = StyleSheet.create({
  cart_item_box_container: {},
  cart_item_box: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cart_item_check_box: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    marginLeft: 30,
    width: 24,
    height: 24,
  },
  cart_item_check_icon: {
    fontSize: 24,
  },
  cart_item_image_box: {
    width: 100,
    height: 100,
  },
  cart_item_image: {
    height: '100%',
  },
  cart_item_info: {
    flex: 1,
  },
  cart_item_info_content: {
    paddingHorizontal: 7,
    paddingLeft: 10,
  },
  cart_item_info_name: {
    fontWeight: '600',
    paddingRight: 30,
  },
  cart_item_sub_info_name: {
    marginTop: 3,
  },
  cart_item_price_box: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 7,
  },
  cart_item_price_price_safe_off: {
    textDecorationLine: 'line-through',
    marginLeft: 7,
  },
  cart_item_price_price: {},
  cart_item_quantity_container: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 11,
    height: 20,
    minWidth: 20,
  },
  cart_item_quantity_mess: {
    textAlign: 'center',
  },
  cart_item_actions: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cart_item_quantity: {
    flex: 1,
    alignItems: 'flex-start',
  },
  cart_item_quantity_content: {
    justifyContent: 'center',
  },
  cart_item_calculations: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cart_item_actions_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
  },
  cart_item_actions_btn_container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  cart_item_actions_btn_left: {
    zIndex: 1,
    left: 0,
    right: undefined,
  },
  cart_item_remove_btn: {
    borderWidth: 0,
    top: 15,
    right: 18,
    position: 'absolute',
    padding: 3,
  },
  cart_item_remove_icon: {
    fontSize: 15,
  },
  store_cart_item_qnt_container: {
    paddingHorizontal: 18,
    minWidth: 50,
  },
  store_cart_item_qnt_wrapper_text: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cart_item_actions_quantity: {
    textAlign: 'center',
  },
  cart_item_btn_label: {
    lineHeight: isIOS ? 20 : 24,
  },
  discountBadge: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: undefined,
    width: undefined,
  },
  discountBadgeContent: {
    padding: 3,
    paddingHorizontal: 5,
  },

  discountContentContainer: {
    paddingBottom: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountContentIcon: {
    marginRight: 7,
  },
  discountContent: {
    flex: 1,
  },
});

class CartItem extends Component {
  static contextType = ThemeContext;

  state = {
    check_loading: false,
    increment_loading: false,
    decrement_loading: false,
    isUpdateQuantityLoading: false,
  };

  refModal = null;

  cartItemActionBtnTitleTypoProps = {type: TypographyType.LABEL_HUGE};

  get theme() {
    return getTheme(this);
  }

  _checkBoxHandler(item) {
    this.setState(
      {
        check_loading: true,
      },
      async () => {
        const {t} = this.props;
        try {
          const data = {
            model: item.model,
          };
          let response = null;

          if (item.selected == 1) {
            response = await APIHandler.site_cart_unselected(
              store.store_id,
              item.id,
              data,
            );
          } else {
            response = await APIHandler.site_cart_selected(
              store.store_id,
              item.id,
              data,
            );
          }

          if (!this.unmounted) {
            if (response && response.status == STATUS_SUCCESS) {
              store.setCartData(response.data);
              flashShowMessage({
                message: response.message,
                type: 'success',
              });
            } else {
              flashShowMessage({
                message: response.message || t('common:api.error.message'),
                type: 'danger',
              });
            }
          }
        } catch (e) {
          if (item.selected == 1) {
            console.log(e + ' site_cart_unselected');
          } else {
            console.log(e + ' site_cart_selected');
          }
          flashShowMessage({
            message: t('common:api.error.message'),
            type: 'danger',
          });
        } finally {
          !this.unmounted &&
            this.setState({
              check_loading: false,
            });
        }
      },
    );
  }

  // xử lý trừ số lượng, số lượng = 0 confirm xoá
  _item_qnt_decrement_handler(item) {
    if (item.quantity <= 1) {
      this.props.onRemoveCartItem(item);
    } else {
      this._item_qnt_decrement(item);
    }
  }

  // giảm số lượng item trong giỏ hàng
  _item_qnt_decrement(item) {
    this.setState(
      {
        decrement_loading: true,
      },
      async () => {
        try {
          const {t} = this.props;
          const data = {
            quantity: 1,
            model: item.model,
          };

          const response = await APIHandler.site_cart_minus(
            store.store_id,
            item.id,
            data,
          );
          if (!this.unmounted) {
            if (response && response.status == STATUS_SUCCESS) {
              store.setCartData(response.data);
              flashShowMessage({
                message: response.message,
                type: 'success',
              });
            } else {
              flashShowMessage({
                message: response.message || t('common:api.error.message'),
                type: 'danger',
              });
            }
          }
        } catch (e) {
          console.log(e + ' site_cart_minus');
          flashShowMessage({
            message: t('common:api.error.message'),
            type: 'danger',
          });
        } finally {
          !this.unmounted &&
            this.setState({
              decrement_loading: false,
            });
        }
      },
    );
  }

  // tăng số lượng sảm phẩm trong giỏ hàng
  _item_qnt_increment(item) {
    this.setState(
      {
        increment_loading: true,
      },
      async () => {
        const {t} = this.props;
        try {
          const data = {
            quantity: 1,
            model: item.model,
          };

          const response = await APIHandler.site_cart_plus(
            store.store_id,
            item.id,
            data,
          );

          if (!this.unmounted) {
            if (response && response.status == STATUS_SUCCESS) {
              store.setCartData(response.data);

              flashShowMessage({
                message: response.message,
                type: 'success',
              });
            } else {
              flashShowMessage({
                message: response.message || t('common:api.error.message'),
                type: 'danger',
              });
            }
          }
        } catch (e) {
          console.log(e + ' site_cart_plus');
          flashShowMessage({
            message: t('common:api.error.message'),
            type: 'danger',
          });
        } finally {
          !this.unmounted &&
            this.setState({
              increment_loading: false,
            });
        }
      },
    );
  }

  async _updateCartItem(item, quantity) {
    this.setState({
      isUpdateQuantityLoading: true,
    });
    try {
      const data = {
        quantity,
        model: item.model,
      };

      var response = await APIHandler.site_cart_update(
        store.store_id,
        item.id,
        data,
      );

      if (response && response.status == STATUS_SUCCESS) {
        store.setCartData(response.data);
        // prev item in list
        if (isAndroid && store.cart_item_index > 0) {
          store.setCartItemIndex(store.cart_item_index - 1);
        }
        flashShowMessage({
          type: 'success',
          message: response.message,
        });
      } else {
        flashShowMessage({
          type: 'danger',
          message: response.message || this.props.t('common:api.error.message'),
        });
      }
    } catch (e) {
      console.log('site_cart_footer_update', e);
      flashShowMessage({
        type: 'danger',
        message: this.props.t('common:api.error.message'),
      });
    } finally {
      !this.unmounted &&
        this.setState({
          isUpdateQuantityLoading: false,
        });
    }
  }

  handleSelectQuantity = (quantity) => {
    if (this.refModal) {
      this.refModal.close();
    }

    this._updateCartItem(this.props.item, quantity);
  };

  onShowModalChangeQuantity = () => {
    push(appConfig.routes.modalInput, {
      backdropPressToClose: true,
      title: this.props.t('quantityInput'),
      btnTitle: this.props.t('common:select'),
      onSubmit: this.handleSelectQuantity,
      description: `${this.props.item?.name}${
        this.props.item?.classification &&
        '\r\n' + this.props.item?.classification
      }`,
      value: this.props.item?.quantity?.toString(),
      textInputProps: {
        autoFocus: true,
        keyboardType: 'number-pad',
        textAlign: 'center',
      },
      textInputStyle: {flex: 1},
      extraInput: <ExtraQuantityInput message={this.props.item?.unit_name} />,
      textInputContainerStyle: {flexDirection: 'row'},
      refModal: (inst) => (this.refModal = inst),
    });
  };

  onPressCartItem = () => {
    push(
      appConfig.routes.item,
      {
        item: this.props.item,
        title: this.props.item.name,
      },
      this.theme,
    );
  };

  handleRemoveCartItem = () => {
    this.props.onRemoveCartItem(this.props.item);
  };

  renderFooterActionBtn() {
    const item = this.props.item;
    const {check_loading, increment_loading, decrement_loading} = this.state;
    const is_processing =
      check_loading || increment_loading || decrement_loading;

    if (!!this.props.noAction) {
      return (
        <View
          style={[
            styles.cart_item_quantity_container,
            this.cartItemQuantityContainer,
          ]}>
          <Typography
            type={TypographyType.LABEL_SMALL}
            style={styles.cart_item_quantity_mess}>
            {item.quantity_view}
          </Typography>
        </View>
      );
    }

    return (
      <View style={styles.cart_item_actions}>
        <View style={styles.cart_item_quantity}>
          <View style={styles.cart_item_quantity_content}>
            <BaseButton
              hitSlop={HIT_SLOP}
              onPress={
                this.state.isUpdateQuantityLoading ||
                this.state.decrement_loading ||
                this.state.increment_loading
                  ? () => {}
                  : this.onShowModalChangeQuantity
              }>
              <View
                style={[
                  styles.store_cart_item_qnt_container,
                  styles.store_cart_item_qnt_wrapper_text,
                ]}>
                <Typography
                  type={TypographyType.LABEL_SEMI_MEDIUM}
                  style={[
                    styles.cart_item_actions_quantity,
                    styles.store_cart_item_qnt_container,
                    {opacity: this.state.isUpdateQuantityLoading ? 0 : 1},
                  ]}>
                  {item.quantity_view}
                </Typography>

                {this.state.isUpdateQuantityLoading && (
                  <Indicator size="small" />
                )}
              </View>
            </BaseButton>

            <OutlinedButton
              useTouchableHighlight
              typoProps={this.cartItemActionBtnTitleTypoProps}
              style={[
                styles.cart_item_actions_btn,
                styles.cart_item_actions_btn_container,
                styles.cart_item_actions_btn_left,
                this.cartItemActionsBtn,
              ]}
              titleStyle={styles.cart_item_btn_label}
              hitSlop={HIT_SLOP}
              onPress={
                is_processing
                  ? () => {}
                  : this._item_qnt_decrement_handler.bind(this, item)
              }>
              {decrement_loading ? <Indicator size="small" /> : '-'}
            </OutlinedButton>

            <OutlinedButton
              useTouchableHighlight
              typoProps={this.cartItemActionBtnTitleTypoProps}
              style={[
                styles.cart_item_actions_btn,
                styles.cart_item_actions_btn_container,
                this.cartItemActionsBtn,
              ]}
              titleStyle={styles.cart_item_btn_label}
              hitSlop={HIT_SLOP}
              onPress={
                is_processing
                  ? () => {}
                  : this._item_qnt_increment.bind(this, item)
              }>
              {increment_loading ? <Indicator size="small" /> : '+'}
            </OutlinedButton>
          </View>
        </View>

        <View style={styles.cart_item_check_box}>
          {check_loading ? (
            <Indicator size="small" />
          ) : (
            <BaseButton
              hitSlop={{right: 50, bottom: 50, left: 50, top: 50}}
              onPress={
                is_processing ? null : this._checkBoxHandler.bind(this, item)
              }>
              <Icon
                bundle={BundleIconSetName.FEATHER}
                name={item.selected == 1 ? 'check-circle' : 'circle'}
                style={[styles.cart_item_check_icon, this.iconStyle]}
              />
            </BaseButton>
          )}
        </View>
      </View>
    );
  }

  get cartItemQuantityContainer() {
    return {
      backgroundColor: this.theme.color.contentBackground,
    };
  }

  get cartItemActionsBtn() {
    return {
      borderWidth: this.theme.layout.borderWidthSmall,
      borderColor: this.theme.color.border,
      borderRadius: this.theme.layout.borderRadiusSmall,
    };
  }

  get iconStyle() {
    return {
      color: this.theme.color.primaryHighlight,
    };
  }

  get cartItemBoxContainerStyle() {
    return {
      borderBottomWidth: this.theme.layout.borderWidthPixel,
      borderColor: this.theme.color.border,
    };
  }

  render() {
    const item = this.props.item;
    if (this.props.noAction && !item.selected) return null;
    return (
      <BaseButton onPress={this.onPressCartItem}>
        <Container
          style={[
            styles.cart_item_box_container,
            this.cartItemBoxContainerStyle,
          ]}>
          <View style={styles.cart_item_box}>
            <View
              style={[
                styles.cart_item_image_box,
                this.props.noAction && {
                  width: 80,
                  height: 80,
                },
              ]}>
              <Image
                style={styles.cart_item_image}
                resizeMode="contain"
                source={{uri: item.image}}
              />
            </View>

            <View style={styles.cart_item_info}>
              <View style={styles.cart_item_info_content}>
                <Typography
                  type={TypographyType.LABEL_MEDIUM}
                  numberOfLines={2}
                  style={styles.cart_item_info_name}>
                  {item.name}
                </Typography>

                {!!item.classification && (
                  <Typography
                    type={TypographyType.DESCRIPTION_SMALL_TERTIARY}
                    numberOfLines={1}
                    style={styles.cart_item_sub_info_name}>
                    {item.classification}
                  </Typography>
                )}

                <View style={styles.cart_item_price_box}>
                  <Typography
                    type={TypographyType.LABEL_SEMI_LARGE_PRIMARY}
                    style={styles.cart_item_price_price}>
                    {item.price_view}
                  </Typography>
                  {!!item.discount_view && (
                    <Typography
                      type={TypographyType.LABEL_SEMI_LARGE_TERTIARY}
                      style={styles.cart_item_price_price_safe_off}>
                      {item.discount_view}
                    </Typography>
                  )}
                </View>

                {this.renderFooterActionBtn()}
              </View>
            </View>

            {item.discount_percent > 0 && (
              <DiscountBadge
                containerStyle={styles.discountBadge}
                contentContainerStyle={styles.discountBadgeContent}
                label={saleFormat(item.discount_percent)}
              />
            )}

            {!!!this.props.noAction && (
              <IconButton
                bundle={BundleIconSetName.ANT_DESIGN}
                name="close"
                style={[
                  styles.cart_item_actions_btn,
                  styles.cart_item_remove_btn,
                ]}
                neutral
                iconStyle={styles.cart_item_remove_icon}
                onPress={this.handleRemoveCartItem}
              />
            )}
          </View>
          {!!item.discount_content && (
            <View style={styles.discountContentContainer}>
              <SVGCoupon
                style={styles.discountContentIcon}
                width={18}
                height={18}
                fill={this.theme.color.primaryHighlight}
              />
              <Typography
                type={TypographyType.LABEL_SEMI_MEDIUM_PRIMARY}
                style={styles.discountContent}>
                {item.discount_content}
              </Typography>
            </View>
          )}
        </Container>
      </BaseButton>
    );
  }
}

export default withTranslation(['cart', 'common'])(CartItem);
