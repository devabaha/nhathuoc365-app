import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import store from '../../store/Store';
import appConfig from 'app-config';
import {servicesHandler, SERVICES_TYPE} from 'src/helper/servicesHandler';
import Loading from '../Loading';
import Tag from '../Tag';

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

  _goOrdersItemHandler(item) {
    const is_paymenting = item.status == CART_STATUS_ORDERING;
    if (is_paymenting) {
      action(() => {
        store.setStoreId(item.site_id);

        if (store.cart_data != null) {
          this._paymentHandler(item);
        } else {
          this._getCart(this._paymentHandler.bind(this, item));
        }
      })();
    } else {
      this._goOrdersItem(item);
    }
  }

  _goOrdersItem(item) {
    if (this.props.disableGoDetail) return;
    store.setStoreData(item.site);
    store.setCartData(item);
    if (item.address_id != 0) {
      Actions.push(appConfig.routes.paymentConfirm, {
        goConfirm: true,
        data: item,
        from_page: 'orders_item'
      });
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

  render() {
    var {item, from_page, t, index} = this.props;
    var single = from_page != 'store_orders';
    var is_paymenting = item.status == CART_STATUS_ORDERING;
    // var is_ready = item.status == CART_STATUS_READY;
    // var is_reorder = item.status == CART_STATUS_COMPLETED;
    var is_ready = false;
    var is_reorder = false;

    const cartType = item.cart_type_name;

    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={this._goOrdersItemHandler.bind(this, item)}>
        <View
          style={[
            styles.orders_item_box,
            {
              // paddingTop: single ? 0 : 12,
            },
          ]}>
          {/* {single && ( */}
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
          {/* )} */}

          <View style={styles.orders_item_icon_box}>
            <Icon
              style={styles.orders_item_icon}
              name="shopping-cart"
              size={16}
              color="#999999"
            />
            <Text style={styles.orders_item_icon_title}>
              {t('item.title', {code: item.cart_code})}
            </Text>

            <View style={styles.orders_status_box}>
              <Text
                style={[
                  styles.orders_status_box_title,
                  {
                    color: is_paymenting ? '#fa7f50' : DEFAULT_COLOR,
                  },
                ]}>
                {item.status_view}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
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

              {!!cartType && (
                <View style={styles.orders_item_time_box}>
                  <Tag
                    label={cartType}
                    fill={appConfig.colors.cartType[item.cart_type]}
                    animate={false}
                    strokeWidth={0}
                    labelStyle={styles.cartTypeLabel}
                    labelContainerStyle={styles.cartTypeLabelContainer}
                  />
                </View>
              )}

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
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}>
                <TouchableHighlight
                  underlayColor={hexToRgbA(DEFAULT_COLOR, 0.9)}
                  onPress={() => {
                    this._goOrdersItem(item);
                  }}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 8,
                    borderRadius: 3,
                    backgroundColor: DEFAULT_COLOR,
                    marginTop: 20,
                  }}>
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 14,
                    }}>
                    {`${t('item.next')} `}
                    <Icon name="angle-right" size={14} color="#ffffff" />
                  </Text>
                </TouchableHighlight>
              </View>
            )}

            {is_ready && (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}>
                <TouchableHighlight
                  underlayColor={hexToRgbA('#dd4b39', 0.9)}
                  onPress={() => {
                    if (this.props.confirmCancelCart) {
                      this.props.confirmCancelCart(item);
                    }
                  }}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 8,
                    borderRadius: 3,
                    backgroundColor: '#dd4b39',
                    marginTop: 16,
                  }}>
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 14,
                    }}>
                    <Icon name="times" size={14} color="#ffffff" />
                    {` ${t('item.cancel')}`}
                  </Text>
                </TouchableHighlight>

                <TouchableHighlight
                  underlayColor={hexToRgbA('#666666', 0.9)}
                  onPress={() => {
                    if (this.props.confirmEditCart) {
                      this.props.confirmEditCart(item);
                    }
                  }}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 8,
                    borderRadius: 3,
                    backgroundColor: '#666666',
                    marginTop: 16,
                  }}>
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 14,
                    }}>
                    <Icon name="pencil-square-o" size={14} color="#ffffff" />
                    {` ${t('item.edit')}`}
                  </Text>
                </TouchableHighlight>
              </View>
            )}

            {/* {is_reorder && (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center'
                }}
              >
                <TouchableHighlight
                  underlayColor={hexToRgbA('#f0ad4e', 0.9)}
                  onPress={() => {
                    if (this.props.confirmCoppyCart) {
                      this.props.confirmCoppyCart(item);
                    }
                  }}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 8,
                    borderRadius: 3,
                    backgroundColor: '#f0ad4e',
                    marginTop: 12
                  }}
                >
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 14
                    }}
                  >
                    <Icon name="files-o" size={14} color="#ffffff" />
                    {' Sao chép'}
                  </Text>
                </TouchableHighlight>
              </View>
            )} */}
          </View>

          <View style={[styles.orders_item_payment]}>
            {item.user_note != null && (
              <View style={styles.orders_item_row}>
                <Text
                  style={[styles.orders_item_content_label, styles.note_label]}>
                  {`${t('item.note')}: `}
                </Text>
                <View style={styles.orders_item_note_content}>
                  <Text style={styles.orders_item_content_value}>
                    {item.user_note}
                  </Text>
                </View>
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

  orders_item_box: {
    width: '100%',
    // height: 180,
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
    marginLeft: 8,
    fontSize: 14,
    color: '#404040',
    fontWeight: '500',
  },

  orders_item_content: {
    width: '70%',
    paddingHorizontal: 15,
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
    color: DEFAULT_COLOR,
  },
  orders_item_content_text: {
    marginTop: 8,
    overflow: 'hidden',
    marginLeft: 22,
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
    color: DEFAULT_COLOR,
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
    marginLeft: 22,
  },
  orders_item_time_title: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  note_label: {
    marginLeft: 22,
  },
  orders_item_note_content: {
    flex: 1,
  },

  cartTypeLabelContainer: {
    marginTop: 3,
  },
  cartTypeLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
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
});

export default withTranslation('orders')(observer(OrdersItemComponent));
