import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions, ActionConst} from 'react-native-router-flux';
import store from '../../store/Store';
import appConfig from 'app-config';
import EventTracker from '../../helper/EventTracker';
import {APIRequest} from 'src/network/Entity';

class Address extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      data: null,
      item_selected: null,
      loading: true,
      continue_loading: false,
      single: !props.from_page,
    };
     
    this._getData = this._getData.bind(this);
    this.unmounted = false;
    this.getAddressRequest = new APIRequest();
    this.requests = [this.getAddressRequest];
    this.eventTracker = new EventTracker();
  }

  componentDidMount() {
    setTimeout(() =>
      Actions.refresh({
        right: this._renderRightButton.bind(this),
      }),
    );
    // this.props.i18n.changeLanguage('en')
    this._getData();
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    cancelRequests(this.requests);
    this.eventTracker.clearTracking();
  }

  // render button trên navbar
  _renderRightButton() {
    return (
      <TouchableOpacity
        style={styles.right_btn_add_store}
        activeOpacity={.7}
        onPress={this._createNew.bind(this)}>
        <Icon name="plus" size={20} color="#ffffff" />
      </TouchableOpacity>
    );
  }

  // get list address
  async _getData(delay) {
    try {
      this.getAddressRequest.data = APIHandler.user_address();
      const response = await this.getAddressRequest.promise();
      if (response && response.status == STATUS_SUCCESS) {
        if (response.data) {
          setTimeout(() => {
            this.setState({
              data: [...response.data, {id: 0, type: 'address_add'}],
              loading: false,
              item_selected: null,
            });
          }, delay || 0);
        } else {
          this.setState({
            data: null,
            loading: false,
          });
        }
      }
    } catch (e) {
      console.log(e + ' user_address');
    } finally {
      this.setState({
        loading: false,
        refreshing: false,
      });
    }
  }

  _goConfirmPage() {
    if (this.state.item_selected == null) {
      const {t} = this.props;

      return Alert.alert(
        t('confirmNotification.title'),
        t('confirmNotification.description'),
        [
          {
            text: t('confirmNotification.accept'),
            onPress: this._createNew.bind(this),
          },
        ],
        {cancelable: false},
      );
    }

    this._addSiteCart();
  }

  _addSiteCart(addressId = this.state.item_selected) {
    this.setState(
      {
        continue_loading: true,
      },
      async () => {
        const {t} = this.props;
        try {
          const response = await APIHandler.site_cart_change_address(
            store.store_id,
            addressId,
          );

          if (!this.unmounted) {
            if (response && response.status == STATUS_SUCCESS) {
              store.setCartData(response.data);

              flashShowMessage({
                type: 'success',
                message: response.message,
              });

              this._goConfirm();
            } else {
              flashShowMessage({
                type: 'danger',
                message: response.message || t('common:api.error.message'),
              });
            }
          }
        } catch (e) {
          console.log(e + ' site_cart_change_address');
          flashShowMessage({
            type: 'danger',
            message: t('common:api.error.message'),
          });
        } finally {
          !this.unmounted &&
            this.setState({
              continue_loading: false,
            });
        }
      },
    );
  }

  _goConfirm() {
    // Actions.replace(appConfig.routes.paymentConfirm);
    Actions.pop();
  }

  // chọn địa chỉ cho đơn hàng
  _addressSelectHanlder(item) {
    this.setState({
      item_selected: item.id,
    });
  }

  _createNew() {
    Actions.create_address({
      addressReload: this._getData,
      from_page: this.props.from_page,
    });
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this._getData();
  };

  onChangeAddress = (addressId) => {
    this._addSiteCart(addressId);
    Actions.pop();
  }

  render() {
    const {single} = this.state;
    const {t} = this.props;

    return (
      <View style={styles.container}>
        {single && (
          <View style={styles.payments_nav}>
            <TouchableOpacity onPress={() => {}} activeOpacity={.7}>
              <View style={styles.payments_nav_items}>
                <View
                  style={[
                    styles.payments_nav_icon_box,
                    styles.payments_nav_icon_box_active,
                  ]}>
                  <Icon
                    style={[
                      styles.payments_nav_icon,
                      styles.payments_nav_icon_active,
                    ]}
                    name="map-marker"
                    size={20}
                    color="#999"
                  />
                </View>
                <Text
                  style={[
                    styles.payments_nav_items_title,
                    styles.payments_nav_items_title_active,
                  ]}>
                  {t('address.title')}
                </Text>

                <View style={styles.payments_nav_items_active} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (store.cart_data.address_id == 0) {
                  this._goConfirmPage();
                } else {
                  this._goConfirm();
                }
              }}
              activeOpacity={.7}>
              <View style={styles.payments_nav_items}>
                <View style={[styles.payments_nav_icon_box]}>
                  <Icon
                    style={[styles.payments_nav_icon]}
                    name="check"
                    size={20}
                    color="#999"
                  />
                </View>
                <Text style={[styles.payments_nav_items_title]}>
                  {t('confirm.title')}
                </Text>

                <View style={styles.payments_nav_items_right_active} />
              </View>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          style={[
            styles.content,
            {
              marginBottom: single ? 60 : 0,
            },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          {this.props.isVisiblePickUp &&
            <View style={styles.pickUpStyle}>
              <TouchableOpacity
                onPress={() => {
                  Actions.push(appConfig.routes.listAddressStore, {
                    onChangeAddress: this.onChangeAddress,
                    addressId: this.props.addressId
                  })
                }}
              >
                <Text style={styles.textBtn}>{t('pickUpAtTheStore')}</Text>
              </TouchableOpacity>
            </View>}
          {!single && (
            <View
              style={{
                backgroundColor: '#f1f1f1',
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderTopWidth: Util.pixel,
                borderColor: '#dddddd',
              }}>
              <Text style={styles.add_store_title}>{t('address.receive')}</Text>
            </View>
          )}
          <View
            style={[
              styles.address_list_box,
              {
                marginTop: single ? 8 : 0,
              },
            ]}>
            {this.state.data != null ? (
              // <FlatList
              //   ref="address_list"
              //   data={this.state.data}
              //   extraData={this.state}
              //   keyExtractor={(item) => `${item.id}`}
              //   ItemSeparatorComponent={() => (
              //     <View style={styles.separator}></View>
              //   )}
              //   renderItem={({item, index}) => {
              this.state.data.map((item, index) => {
                if (item.type == 'address_add') {
                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={.7}
                      onPress={this._createNew.bind(this)}
                      style={styles.address_add_box}>
                      <View style={styles.address_add_content}>
                        <Text style={styles.address_add_title}>
                          {t('address.new')}
                        </Text>
                        <View style={styles.address_add_icon_box}>
                          <Icon name="plus" size={18} color="#999999" />
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }

                var is_selected = false;

                if (this.state.item_selected) {
                  if (this.state.item_selected == item.id) {
                    is_selected = true;
                  }
                } else if (store.cart_data && store.cart_data.address_id != 0) {
                  is_selected = store.cart_data.address_id == item.id;
                  if (is_selected) {
                    this.state.item_selected = item.id;
                  }
                } else if (index == 0) {
                  this.state.item_selected = item.id;
                  is_selected = true;
                }

                const comboAddress =
                  (item.province_name || '') +
                  (item.district_name ? ' • ' + item.district_name : '') +
                  (item.ward_name ? ' • ' + item.ward_name : '');

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={.7}
                    onPress={this._addressSelectHanlder.bind(this, item)}
                    style={{backgroundColor: '#fff'}}>
                    <View
                      style={[
                        styles.address_box,
                        !is_selected && single && styles.uncheckOverlay,
                      ]}>
                      <View style={styles.address_name_box}>
                        <Text style={styles.address_name}>
                          {item.name}{' '}
                          {item.default_flag == 1 && (
                            <Icon
                              name="map-marker"
                              style={styles.address_edit_btn}
                            />
                          )}
                        </Text>
                        <TouchableOpacity
                          activeOpacity={.7}
                          onPress={() => {
                            Actions.create_address({
                              edit_data: item,
                              title: t('common:screen.address.editTitle'),
                              addressReload: this._getData,
                              from_page: this.props.from_page,
                            });
                          }}>
                          <View style={styles.address_edit_box}>
                            <Icon
                              name="pencil-square-o"
                              size={12}
                              color="#999999"
                            />
                            <Text style={styles.address_edit_label}>
                              {t('address.edit')}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.address_name_box}>
                        <View style={styles.address_content}>
                          <Text style={styles.address_content_phone}>
                            {item.tel}
                          </Text>
                          <Text style={styles.address_content_address_detail}>
                            {item.address}
                          </Text>
                          {!!item.map_address && (
                            <Text style={styles.address_content_map_address}>
                              {item.map_address}
                            </Text>
                          )}
                          {/* <Text style={styles.address_content_city}>Thành Phố Hoà Bình</Text>
                          <Text style={styles.address_content_tinh}>Hoà Bình</Text> */}
                        </View>

                        {single && (
                          <View style={[styles.address_selected_box, {opacity: is_selected ?1:0}]}>
                            <Icon
                              name="check"
                              size={24}
                              color={DEFAULT_COLOR}
                            />
                            {/* <Text style={styles.address_label}>
                                {t('address.delivery')}
                              </Text> */}
                          </View>
                        )}
                      </View>
                      {/* {item.default_flag == 1 && (
                          <View style={styles.address_edit_btn}>
                            <Text style={styles.address_default_title}>
                              {t('address.default')}
                            </Text>
                          </View>
                        )} */}

                      {/* <View style={styles.address_default_box}>
                          <TouchableOpacity
                            activeOpacity={.7}
                            onPress={() => {
                              Actions.create_address({
                                edit_data: item,
                                title: t('common:screen.address.editTitle'),
                                addressReload: this._getData,
                                from_page: this.props.from_page
                              });
                            }}
                          >
                            <View style={styles.address_edit_box}>
                              <Icon
                                name="pencil-square-o"
                                size={12}
                                color="#999999"
                              />
                              <Text style={styles.address_edit_label}>
                                {t('address.edit')}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View> */}

                      {/* {
                          !is_selected && single && (
                            <TouchableOpacity
                              activeOpacity={.7}
                              onPress={this._addressSelectHanlder.bind(
                                this,
                                item
                              )}
                              style={styles.uncheckOverlay}
                            >
                              <View></View>
                            </TouchableOpacity>
                          )
                        } */}
                      {!!comboAddress && (
                        <Text style={styles.comboAddress}>{comboAddress}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              // }
              // />
              <View>
                {this.state.loading && (
                  <View
                    style={{
                      paddingVertical: 16,
                    }}>
                    <Indicator size="small" />
                  </View>
                )}

                <TouchableOpacity
                  activeOpacity={.7}
                  onPress={this._createNew.bind(this)}
                  style={[
                    styles.address_add_box,
                    {
                      marginTop: 0,
                      borderTopWidth: 0,
                    },
                  ]}>
                  <View style={styles.address_add_content}>
                    <Text style={styles.address_add_title}>
                      {t('address.new')}
                    </Text>
                    <View style={styles.address_add_icon_box}>
                      <Icon name="plus" size={18} color="#999999" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        {single && (
          <TouchableOpacity
            activeOpacity={.7}
            onPress={this._goConfirmPage.bind(this)}
            style={styles.address_continue}>
            <View style={styles.address_continue_content}>
              <Text style={styles.address_continue_title}>
                {t('nextBtnMessage')}
              </Text>
              <View
                style={{
                  minWidth: 20,
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {this.state.continue_loading ? (
                  <Indicator size="small" color="#fff" />
                ) : (
                  <Icon name="chevron-right" size={20} color="#ffffff" />
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  add_store_title: {
    color: '#404040',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },

  container: {
    flex: 1,

    marginBottom: 0,
  },
  content: {
    marginBottom: 60,
  },
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: '#dddddd',
  },
  address_list_box: {
    marginTop: 8,
    borderTopWidth: Util.pixel,
    borderColor: '#dddddd',
  },
  address_box: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    minHeight: 120,
    borderBottomColor: '#dddddd',
    borderBottomWidth: Util.pixel,
  },
  address_name_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  address_name: {
    fontSize: 16,
    color: '#3c3c3c',
    fontWeight: 'bold',
  },
  address_default_box: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
  },
  address_default_title: {
    color: '#999999',
    fontSize: 12,
  },
  address_content: {
    marginTop: 8,
    flex: 1,
    // width: Util.size.width - 140
  },
  address_content_phone: {
    color: '#333',
    fontSize: 14,
  },
  address_content_address_detail: {
    color: '#333',
    fontSize: 14,
    marginTop: 6,
  },
  address_content_map_address: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  address_content_phuong: {
    color: '#404040',
    fontSize: 14,
    marginTop: 4,
  },
  address_content_city: {
    color: '#404040',
    fontSize: 14,
    marginTop: 4,
  },
  address_content_tinh: {
    color: '#404040',
    fontSize: 14,
    marginTop: 4,
  },
  address_selected_box: {
    // position: 'absolute',
    // width: 100,
    // height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    // top: 20,
    // right: 10
  },
  address_label: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
  },

  address_add_box: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: Util.pixel,
    borderTopColor: '#dddddd',
  },
  address_add_content: {
    width: '100%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd',
  },
  address_add_title: {
    color: '#242424',
    fontSize: 14,
  },
  address_add_icon_box: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },

  address_continue: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 60,
  },
  address_continue_content: {
    width: '100%',
    height: '100%',
    backgroundColor: DEFAULT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  address_continue_title: {
    color: '#ffffff',
    fontSize: 18,
    marginRight: 8,
  },

  address_edit_btn: {
    // position: 'absolute',
    // bottom: 0,
    // right: 0,
    // paddingVertical: 8,
    // paddingHorizontal: 15
    fontSize: 22,
    color: DEFAULT_COLOR,
  },
  address_edit_box: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 15,
  },
  address_edit_label: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 4,
  },

  uncheckOverlay: {
    backgroundColor: hexToRgbA('#000', 0.03),
    // backgroundColor: 'rgba(0,0,0,.03)',
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0
  },

  payments_nav: {
    backgroundColor: '#ffffff',
    height: 60,
    flexDirection: 'row',
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
  },
  payments_nav_items: {
    justifyContent: 'center',
    height: 60,
    width: Util.size.width / 2,
    alignItems: 'center',
  },
  payments_nav_items_title: {
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  payments_nav_items_title_active: {
    color: DEFAULT_COLOR,
  },
  payments_nav_items_active: {
    position: 'absolute',
    width: Util.size.width / 4 - 14,
    top: 20,
    right: 0,
    height: Util.pixel,
    backgroundColor: DEFAULT_COLOR,
  },
  payments_nav_items_right_active: {
    position: 'absolute',
    width: Util.size.width / 4 - 14,
    top: 20,
    left: 0,
    height: Util.pixel,
    backgroundColor: DEFAULT_COLOR,
  },
  borderBottom: {
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd',
  },
  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 12,
  },

  payments_nav_icon_box: {
    borderWidth: Util.pixel,
    borderColor: '#cccccc',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  payments_nav_icon_active: {
    color: DEFAULT_COLOR,
  },
  payments_nav_icon_box_active: {
    borderColor: DEFAULT_COLOR,
  },

  comboAddress: {
    marginHorizontal: -15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    color: '#333',
    letterSpacing: 0.2,
    marginTop: 10,
    fontSize: 13,
    fontWeight: '400',
  },

  pickUpStyle: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: '#ffffff',
    marginTop: 8,
  },

  textBtn: {
    letterSpacing: 0.2,
    fontSize: 16,
    fontWeight: '400',
  }
});

export default withTranslation(['address', 'common'])(observer(Address));
