import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import store from '../../store/Store';
import appConfig from 'app-config';
import Loading from '../Loading';
import Tag from '../Tag';
import {CART_TYPES} from 'src/constants/cart';
import {CONFIG_KEY, isConfigActive} from '../../helper/configKeyHandler';
import {getValueFromConfigKey} from 'app-helper/configKeyHandler/configKeyHandler';

class OrdersItemComponent extends Component {
  unmounted = false;
  state = {
    goToStoreLoading: false,
  };

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
      Actions.pop();
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
    this._goOrdersItem(item);
    // }
  }

  _goOrdersItem(item) {
    if (this.props.disableGoDetail) return;
    store.setStoreData(item.site);
    // store.setCartData(item);
    if (item.address_id != 0) {
      Actions.push(appConfig.routes.paymentConfirm, {
        goConfirm: true,
        data: item,
        from_page: 'orders_item',
      });
    } else if (!!getValueFromConfigKey(CONFIG_KEY.PICK_UP_AT_THE_STORE_KEY)){
      Actions.push(appConfig.routes.myAddress, {
        goConfirm: true,
        data: item,
        from_page: 'orders_item',
        take_orders_at_the_store_key: true,
      })
    } else {
      Actions.create_address({
        redirect: 'confirm',
      });
    }
  }

  _goToStore(item) {
    if (this.props.disableGoStore) return;
    store.setStoreData(item.site);
    store.setCartData(item);
    Actions.push(appConfig.routes.store, {
      title: item.shop_name,
    });
  }

  _goStoreOrders(item) {
    if (this.props.disableGoStore) return;
    store.setStoreData(item.site);
    Actions.store_orders({
      store_id: item.site_id,
      title: item.shop_name,
      tel: item.tel,
    });
  }

  renderCartIcon() {
    let iconName = 'shopping-cart';
    switch (this.props.item?.cart_type) {
      case CART_TYPES.DROP_SHIP:
        iconName = 'truck';
        break;
    }
    return (
      <Icon
        style={styles.orders_item_icon}
        name={iconName}
        size={16}
        color="#999999"
      />
    );
  }

  render() {
    var {item, t, index} = this.props;
    var is_paymenting = item.status == CART_STATUS_ORDERING;
    const cartType = item.cart_type_name;
    const deliveryCode =
      item.delivery_details &&
      (item.delivery_details.ship_unit || item.delivery_details.unit) +
        ' - ' +
        (item.delivery_details.ship_unit_id ||
          item.delivery_details.booking_id);

    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={this._goOrdersItemHandler.bind(this, item)}>
        <View style={[styles.orders_item_box]}>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={this._goStoreOrders.bind(this, item)}>
            <View style={styles.cart_section_box}>
              <CachedImage
                mutable
                style={styles.cart_section_image}
                source={{uri: item.shop_logo_url}}
              />
              <Text style={styles.cart_section_title}>{item.shop_name}</Text>
              {!!(index + 1) && (
                <View style={styles.indexContainer}>
                  <Text style={styles.indexValue}>{index + 1}</Text>
                </View>
              )}
            </View>
          </TouchableHighlight>

          <View style={styles.orders_item_icon_box}>
            {this.renderCartIcon()}
            <View style={styles.orders_item_title_container}>
              <Tag
                label={cartType}
                fill={appConfig.colors.cartType[item.cart_type]}
                animate={false}
                strokeWidth={0}
                labelStyle={styles.cartTypeLabel}
                labelContainerStyle={styles.cartTypeLabelContainer}
              />
              <Text style={styles.orders_item_icon_title}>
                #{item.cart_code}
              </Text>
            </View>

            <View style={styles.orders_status_box}>
              <Text
                style={[
                  styles.orders_status_box_title,
                  {
                    color:
                      appConfig.colors.orderStatus[item.status] ||
                      appConfig.colors.primary,
                  },
                ]}>
                {item.status_view}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 37,
            }}>
            <View style={styles.orders_item_content}>
              {item.orders_time != null && item.orders_time != '' && (
                <View style={styles.orders_item_time_box}>
                  <Icon
                    style={styles.orders_item_icon}
                    name="clock-o"
                    size={12}
                    color="#999999"
                  />
                  <Text style={styles.orders_item_time_title}>
                    {item.orders_time}
                  </Text>
                </View>
              )}

              {!!item.payment_status_name && (
                <Tag
                  label={item.payment_status_name}
                  fill={hexToRgbA(
                    appConfig.colors.paymentStatus[item.payment_status],
                    0.1,
                  )}
                  animate={false}
                  strokeWidth={0}
                  labelStyle={[
                    styles.cartTypeLabel,
                    {
                      color:
                        appConfig.colors.paymentStatus[item.payment_status],
                    },
                  ]}
                  labelContainerStyle={styles.cartTypeLabelContainer}
                />
              )}

              <View style={[styles.orders_item_time_box, styles.tagContainer]}>
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
              </View>

              <View style={styles.orders_item_row}>
                {item.products && Object.keys(item.products).length > 0 && (
                  <View style={styles.orders_item_content_text}>
                    <Text style={styles.orders_item_content_value}>
                      {(() => {
                        var items_string = '';
                        Object.keys(item.products)
                          .reverse()
                          .forEach((key) => {
                            let item_product = item.products[key];
                            if (item_product.selected == 1) {
                              items_string +=
                                item_product.name +
                                ' (' +
                                item_product.quantity_view +
                                '), ';
                            }
                          });
                        return sub_string(items_string, 100);
                      })()}
                    </Text>
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
            {item.user_note != null && (
              <View style={styles.orders_item_row}>
                <Text
                  style={[styles.orders_item_content_label, styles.note_label]}>
                  {`${t('item.note')}: `}
                  <Text
                    style={[
                      styles.orders_item_content_value,
                      styles.note_value,
                    ]}>
                    {item.user_note}
                  </Text>
                </Text>
              </View>
            )}

            <View style={[styles.orders_item_row, styles.row_payment]}>
              {!!item.count_selected && (
                <Text style={styles.orders_item_content_label}>
                  {t('item.totalSelected', {total: item.count_selected})}
                </Text>
              )}
              <View style={styles.orders_status_box}>
                <Text style={styles.orders_item_content_value}>
                  {`${t('item.totalPaymentMessage')}: `}
                </Text>
                <Text style={styles.orders_item_price_value}>
                  {item.total_selected}
                </Text>
              </View>
            </View>
          </View>

          {this.state.goToStoreLoading && (
            <Loading
              center
              wrapperStyle={{backgroundColor: 'rgba(0,0,0, .06)'}}
            />
          )}
        </View>
      </TouchableHighlight>
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
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
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
    color: '#000000',
    fontSize: 14,
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
    backgroundColor: '#ffffff',
    marginBottom: 8,
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
  },
  orders_item_icon_box: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  orders_item_icon_title: {
    marginLeft: 5,
    color: '#404040',
    fontWeight: '500',
  },

  orders_item_content: {
    flex: 1,
    // paddingHorizontal: 15,
  },
  orders_item_row: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  orders_item_content_label: {
    fontSize: 14,
    color: '#404040',
    fontWeight: '500',
  },
  orders_status_box: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  orders_status_box_title: {
    fontSize: 12,
    fontWeight: '600',
  },
  orders_item_content_text: {
    marginTop: 8,
    overflow: 'hidden',
    // marginLeft: 22,
  },
  orders_item_content_value: {
    fontSize: 14,
    color: '#404040',
  },
  orders_item_payment: {
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 8,
  },
  orders_item_price_value: {
    color: appConfig.colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  row_payment: {
    borderTopWidth: Util.pixel,
    borderTopColor: '#dddddd',
    paddingTop: 8,
    marginTop: 4,
  },
  orders_item_time_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 5,
  },
  orders_item_time_title: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  note_label: {},
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
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  indexValue: {
    color: '#666',
    fontSize: 12,
  },

  paymentStatusContainer: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  paymentStatusTitle: {
    fontSize: 12,
  },

  tagContainer: {
    flexWrap: 'wrap',
    marginTop: 0,
    marginBottom: 0,
  },
  tagsLabelContainer: {
    marginTop: 5,
    marginRight: 5,
  },
});

export default withTranslation('orders')(observer(OrdersItemComponent));

const actionBtnStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 15,
  },
  btnContainer: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 3,
    backgroundColor: appConfig.colors.primary,
    marginTop: 8,
  },
  btnTitle: {
    color: '#ffffff',
    fontSize: 12,
  },
});

const ActionButton = React.memo(({title, onGoToStore}) => {
  return (
    <View style={actionBtnStyles.container}>
      <TouchableHighlight
        hitSlop={HIT_SLOP}
        underlayColor={hexToRgbA(appConfig.colors.primary, 0.9)}
        onPress={onGoToStore}
        style={actionBtnStyles.btnContainer}>
        <Text style={actionBtnStyles.btnTitle}>
          {title} <Icon name="angle-right" style={actionBtnStyles.btnTitle} />
        </Text>
      </TouchableHighlight>
    </View>
  );
});
