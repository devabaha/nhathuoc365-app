import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import {CONFIG_KEY, isConfigActive} from 'app-helper/configKeyHandler';
import {mergeStyles} from 'src/Themes/helper';
// routing
import {push, pop} from 'app-helper/routing';
// context
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
import {CART_TYPES} from 'src/constants/cart';
// custom components
import {Container, Typography, Icon, BaseButton} from 'src/components/base';
import Loading from '../Loading';
import Tag from '../Tag';
import Image from '../Image';
import ActionButton from './ActionButton';

class OrdersItemComponent extends Component {
  static contextType = ThemeContext;

  unmounted = false;
  state = {
    goToStoreLoading: false,
  };

  get theme() {
    return getTheme(this);
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  async _getCart(callback) {
    try {
      const response = await APIHandler.site_cart_show(store.store_id);

      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS) {
          store.setCartData(response.data);

          if (typeof callback == 'function') {
            callback();
          }
        } else {
          store.resetCartData();
        }
      }
    } catch (e) {
      console.log(e + ' site_cart_show');
    }
  }

  _paymentHandler(item) {
    // action(() => {
    //   store.setStoreData({
    //     id: item.site_id,
    //     name: item.shop_name,
    //     tel: item.tel
    //   });
    // })();

    if (
      store.parentTab == '_home' &&
      !this.props.goStore
      // || store.orderIsPop
    ) {
      pop();
    } else {
      this._goToStore(item);
    }
  }

  handleGoToStore(item) {
    const is_paymenting = item.status == CART_STATUS_ORDERING;
    if (is_paymenting) {
      action(() => {
        store.setStoreId(item.site_id);

        if (store.cart_data != null) {
          this._paymentHandler(item);
        } else {
          this._getCart(this._paymentHandler(item));
        }
      })();
    }
  }

  _goOrdersItemHandler(item) {
    // const is_paymenting = item.status == CART_STATUS_ORDERING;
    // if (is_paymenting) {
    //   action(() => {
    //     store.setStoreId(item.site_id);

    //     if (store.cart_data != null) {
    //       this._paymentHandler(item);
    //     } else {
    //       this._getCart(this._paymentHandler.bind(this, item));
    //     }
    //   })();
    // } else {
    switch (item.cart_type) {
      case CART_TYPES.BOOKING:
        this.goToBooking(item);
        break;
      default:
        this._goOrdersItem(item);
    }
    // }
  }

  goToBooking(order) {
    const product =
      order.primary_product ||
      (order.products && Object.values(order.products)[0]);
    if (!product) return;

    push(
      appConfig.routes.booking,
      {
        bookingId: order.id,
        siteId: order.site_id,
        attrs: product.attrs,
        models: product.models,
      },
      this.theme,
    );
  }

  _goOrdersItem(item) {
    if (this.props.disableGoDetail) return;
    store.setStoreData(item.site);
    // store.setCartData(item);
    if (item.address_id != 0 || item.status != CART_STATUS_ORDERING) {
      push(
        appConfig.routes.paymentConfirm,
        {
          goConfirm: true,
          data: item,
          from_page: 'orders_item',
        },
        this.theme,
      );
    } else if (isConfigActive(CONFIG_KEY.PICK_UP_AT_THE_STORE_KEY)) {
      push(
        appConfig.routes.myAddress,
        {
          redirect: 'confirm',
          goBack: true,
          isVisibleStoreAddress: true,
        },
        this.theme,
      );
    } else {
      push(
        appConfig.routes.createAddress,
        {
          redirect: 'confirm',
        },
        this.theme,
      );
    }
  }

  _goToStore(item) {
    if (this.props.disableGoStore) return;
    store.setStoreData(item.site);
    store.setCartData(item);
    push(
      appConfig.routes.store,
      {
        title: item.shop_name,
      },
      this.theme,
    );
  }

  _goStoreOrders(item) {
    if (this.props.disableGoStore) return;
    store.setStoreData(item.site);
    push(
      appConfig.routes.storeOrders,
      {
        store_id: item.site_id,
        title: item.shop_name,
        tel: item.tel,
      },
      this.theme,
    );
  }

  renderCartIcon() {
    let iconName = 'shopping-cart';
    switch (this.props.item?.cart_type) {
      case CART_TYPES.DROP_SHIP:
        iconName = 'truck';
        break;
      case CART_TYPES.BOOKING:
        iconName = 'calendar';
        break;
    }
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        style={[styles.orderTypeIcon, this.iconStyle]}
        name={iconName}
      />
    );
  }

  renderIconBefore(style) {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        style={[styles.createdIcon, style]}
        name="clock-o"
      />
    );
  }

  get cartSectionBoxStyle() {
    return mergeStyles(styles.cart_section_box, {
      borderBottomWidth: this.theme.layout.borderWidthPixel,
      borderColor: this.theme.color.border,
    });
  }

  get iconStyle() {
    return {
      color: this.theme.color.iconInactive,
    };
  }

  get ordersItemBoxStyle() {
    return mergeStyles(styles.orders_item_box, {
      borderColor: this.theme.color.border,
      borderBottomWidth: this.theme.layout.borderWidthPixel,
    });
  }

  get rowPaymentStyles() {
    return mergeStyles(styles.row_payment, {
      borderTopWidth: this.theme.layout.borderWidthPixel,
      borderTopColor: this.theme.color.border,
    });
  }

  get indexContainerStyle() {
    return mergeStyles(styles.indexContainer, {
      backgroundColor: this.theme.color.contentBackgroundWeak,
      borderTopLeftRadius: this.theme.layout.borderRadiusHuge,
      borderBottomLeftRadius: this.theme.layout.borderRadiusHuge,
    });
  }

  get cartSectionImage() {
    return mergeStyles(styles.cart_section_image, {
      borderRadius: this.theme.layout.borderRadiusHuge,
    });
  }

  get wrapperLoadingStyle() {
    return {
      backgroundColor: this.theme.color.overlay30,
    };
  }

  render() {
    var {item, t, index} = this.props;
    var is_paymenting = item.status == CART_STATUS_ORDERING;
    const cartType = item.cart_type_name;
    // const POSCode =
    //   item.pos_details &&
    //   item.pos_details.pos_type + ' - ' + item.pos_details.pos_code;
    // const deliveryCode =
    //   item.delivery_details &&
    //   (item.delivery_details.ship_unit || item.delivery_details.unit) +
    //     ' - ' +
    //     (item.delivery_details.ship_unit_id ||
    //       item.delivery_details.booking_id);

    return (
      <BaseButton
        useTouchableHighlight
        underlayColor="transparent"
        onPress={this._goOrdersItemHandler.bind(this, item)}>
        <Container style={this.ordersItemBoxStyle}>
          <BaseButton
            useTouchableHighlight
            underlayColor="transparent"
            onPress={this._goStoreOrders.bind(this, item)}>
            <Container style={this.cartSectionBoxStyle}>
              <Image
                style={this.cartSectionImage}
                source={{uri: item.shop_logo_url}}
              />
              <Typography
                type={TypographyType.LABEL_MEDIUM}
                style={styles.cart_section_title}>
                {item.shop_name}
              </Typography>
              {!!(index + 1) && (
                <Container style={this.indexContainerStyle}>
                  <Typography
                    type={TypographyType.LABEL_SMALL}
                    style={styles.indexValue}>
                    {index + 1}
                  </Typography>
                </Container>
              )}
            </Container>
          </BaseButton>

          <Container noBackground style={styles.orders_item_icon_box}>
            {this.renderCartIcon()}
            <View style={styles.orders_item_title_container}>
              <Tag
                label={cartType}
                fill={this.theme.color.cartType[item.cart_type]}
                animate={false}
                strokeWidth={0}
                labelStyle={styles.cartTypeLabel}
                labelContainerStyle={styles.cartTypeLabelContainer}
              />
              <Typography
                type={TypographyType.LABEL_MEDIUM}
                style={styles.orders_item_icon_title}>
                #{item.cart_code}
              </Typography>
            </View>

            <View style={styles.orders_status_box}>
              <Typography
                type={TypographyType.LABEL_SMALL}
                style={[
                  styles.orders_status_box_title,
                  {
                    color:
                      this.theme.color.cartStatus[item.status] ||
                      this.theme.color.persistPrimary,
                  },
                ]}>
                {item.status_view}
              </Typography>
            </View>
          </Container>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 37,
            }}>
            <View style={styles.orders_item_content}>
              {item.orders_time != null && item.orders_time != '' && (
                <View style={styles.orders_item_time_box}>
                  <Typography
                    type={TypographyType.DESCRIPTION_SEMI_MEDIUM}
                    renderIconBefore={this.renderIconBefore}>
                    {item.orders_time}
                  </Typography>
                </View>
              )}

              {!!item.payment_status_name && (
                <Tag
                  label={item.payment_status_name}
                  fill={hexToRgba(
                    this.theme.color.cartPaymentStatus[item.payment_status],
                    0.1,
                  )}
                  animate={false}
                  strokeWidth={0}
                  labelStyle={[
                    styles.cartTypeLabel,
                    {
                      color: this.theme.color.cartPaymentStatus[
                        item.payment_status
                      ],
                    },
                  ]}
                  labelContainerStyle={styles.cartTypeLabelContainer}
                />
              )}

              {/* <View style={[styles.orders_item_time_box, styles.tagContainer]}>
                {!!POSCode && (
                  <Tag
                    label={POSCode}
                    fill={appConfig.colors.primary}
                    animate={false}
                    strokeWidth={0}
                    labelStyle={styles.cartTypeLabel}
                    labelContainerStyle={[
                      styles.cartTypeLabelContainer,
                      styles.tagsLabelContainer,
                    ]}
                  />
                )}

                {!!deliveryCode && (
                  <Tag
                    label={deliveryCode}
                    fill={
                      appConfig.colors.delivery[
                        item.delivery_details?.status
                      ] || appConfig.colors.cartType[item.cart_type]
                    }
                    animate={false}
                    strokeWidth={0}
                    labelStyle={styles.cartTypeLabel}
                    labelContainerStyle={[
                      styles.cartTypeLabelContainer,
                      styles.tagsLabelContainer,
                    ]}
                  />
                )}
              </View> */}

              <View style={styles.orders_item_row}>
                {item.products && Object.keys(item.products).length > 0 && (
                  <View style={styles.orders_item_content_text}>
                    <Typography
                      type={TypographyType.LABEL_MEDIUM_TERTIARY}
                      style={styles.orders_item_content_value}>
                      {(() => {
                        var items_string = '';
                        Object.keys(item.products)
                          .reverse()
                          .forEach((key, index) => {
                            let item_product = item.products[key];
                            if (item_product.selected == 1) {
                              items_string +=
                                item_product.name +
                                ' (' +
                                item_product.quantity_view +
                                ')' +
                                (index !== Object.keys(item.products).length - 1
                                  ? ', '
                                  : '');
                            }
                          });
                        return sub_string(items_string, 100);
                      })()}
                    </Typography>
                  </View>
                )}
              </View>
            </View>

            {is_paymenting && (
              <ActionButton
                title={t('item.store')}
                onGoToStore={() => this.handleGoToStore(item)}
              />
            )}
          </View>

          <View style={[styles.orders_item_payment]}>
            {!!item.user_note && (
              <View style={[styles.orders_item_row, styles.noteContainer]}>
                <Icon
                  bundle={BundleIconSetName.FONT_AWESOME_5}
                  style={[styles.noteIcon, this.iconStyle]}
                  name="pen-square"
                />

                <Typography
                  type={TypographyType.LABEL_MEDIUM_TERTIARY}
                  style={[styles.orders_item_content_label, styles.note_label]}>
                  <Typography
                    type={TypographyType.LABEL_MEDIUM_TERTIARY}
                    style={[
                      styles.orders_item_content_value,
                      styles.note_value,
                    ]}>
                    {item.user_note}
                  </Typography>
                </Typography>
              </View>
            )}

            <View style={[styles.orders_item_row, this.rowPaymentStyles]}>
              {!!item.count_selected && (
                <Typography
                  type={TypographyType.LABEL_MEDIUM}
                  style={styles.orders_item_content_label}>
                  {t('item.totalSelected', {total: item.count_selected})}
                </Typography>
              )}
              <View style={styles.orders_status_box}>
                <Typography
                  type={TypographyType.LABEL_MEDIUM}
                  style={styles.orders_item_content_value}>
                  {`${t('item.totalPaymentMessage')}: `}
                </Typography>

                <Typography
                  type={TypographyType.LABEL_MEDIUM_PRIMARY}
                  style={styles.orders_item_price_value}>
                  {item.total_selected}
                </Typography>
              </View>
            </View>
          </View>

          {this.state.goToStoreLoading && (
            <Loading center wrapperStyle={this.wrapperLoadingStyle} />
          )}
        </Container>
      </BaseButton>
    );
  }
}

OrdersItemComponent.propTypes = {
  item: PropTypes.object.isRequired,
  storeOnPress: PropTypes.func,
};

const styles = StyleSheet.create({
  cart_section_box: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
    marginBottom: 8,
  },
  cart_section_image: {
    width: 26,
    height: 26,
    resizeMode: 'cover',
    marginLeft: 15,
    borderRadius: 13,
  },
  cart_section_title: {
    flex: 1,
    paddingLeft: 8,
    fontWeight: '500',
  },

  orders_item_title_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  orders_item_box: {
    width: '100%',
    paddingBottom: 8,
    marginBottom: 8,
  },
  orders_item_icon_box: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  orders_item_icon_title: {
    marginLeft: 5,
    fontWeight: '500',
  },

  orders_item_content: {
    flex: 1,
  },
  orders_item_row: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  orders_item_content_label: {
    fontWeight: '500',
  },
  orders_status_box: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  orders_status_box_title: {
    fontWeight: '600',
  },
  orders_item_content_text: {
    marginTop: 8,
    overflow: 'hidden',
    marginRight: 15,
  },
  orders_item_content_value: {},
  orders_item_payment: {
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 8,
  },
  orders_item_price_value: {
    fontWeight: '500',
  },
  row_payment: {
    paddingTop: 8,
    marginTop: 4,
  },
  orders_item_time_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 5,
    marginLeft: 4,
  },
  orders_item_time_title: {
    marginLeft: 4,
  },
  noteContainer: {
    marginTop: 5,
  },
  note_label: {
    marginLeft: 9,
    flex: 1,
  },
  note_value: {
    fontWeight: '300',
  },
  orders_item_note_content: {
    flex: 1,
  },

  cartTypeLabelContainer: {
    paddingVertical: 3,
  },
  cartTypeLabel: {
    fontSize: 9,
    textTransform: 'uppercase',
    textAlign: 'left',
  },

  indexContainer: {
    paddingVertical: 3,
    paddingRight: 18,
    paddingLeft: 10,
  },
  indexValue: {},

  tagContainer: {
    flexWrap: 'wrap',
    marginTop: 0,
    marginBottom: 0,
  },
  tagsLabelContainer: {
    marginTop: 5,
    marginRight: 5,
  },
  orders_item_icon: {},
  orderTypeIcon: {
    fontSize: 16,
  },
  createdIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  noteIcon: {
    fontSize: 15,
  },
});

export default withTranslation('orders')(observer(OrdersItemComponent));
