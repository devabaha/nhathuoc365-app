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
import AddressContainer from 'src/components/payment/AddressContainer';
import ListAddressStore from 'src/containers/ListAddressStore';
import AddressItem from './AddressItem';
import Loading from '../Loading';

class Address extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      data: null,
      item_selected: this.defaultSelectedAddressId,
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

  get defaultSelectedAddressId() {
    return store.cart_data && store.cart_data.address_id != 0
      ? store.cart_data.address_id
      : null;
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
        activeOpacity={0.7}
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
              item_selected: this.defaultSelectedAddressId,
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
  _addressSelectHandler(item) {
    this.setState({
      item_selected: item.id,
    });
  }

  handleEditAddress = (address) => {
    const {t} = this.props;
    Actions.create_address({
      edit_data: address,
      title: t('common:screen.address.editTitle'),
      addressReload: this._getData,
      from_page: this.props.from_page,
    });
  };

  checkAddressSelected = (address) => {};

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

  render() {
    const {single} = this.state;
    const {t} = this.props;

    return (
      <View style={styles.container}>
        {this.state.loading && <Loading center />}
        {single && (
          <View style={styles.payments_nav}>
            <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
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
              activeOpacity={0.7}>
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
          contentContainerStyle={{
            paddingTop: single ? 15 : 0,
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <AddressContainer title="Địa chỉ của tôi">
            {this.state.data != null ? (
              this.state.data.map((item, index) => {
                if (item.type == 'address_add') {
                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
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

                return (
                  <AddressItem
                    address={item}
                    editable
                    selectable={single}
                    selected={is_selected}
                    onSelectAddress={this._addressSelectHandler.bind(
                      this,
                      item,
                    )}
                    onEditPress={this.handleEditAddress.bind(this, item)}
                  />
                );
              })
            ) : (
              <View>
                <TouchableOpacity
                  activeOpacity={0.7}
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
          </AddressContainer>

          {this.props.take_orders_at_the_store_key && (
            <AddressContainer 
              title={t('pickUpAtTheStore')}
            >
              <ListAddressStore
                refreshing={this.state.refreshing}
                selectedAddressId={this.state.item_selected}
                onChangeAddress={this._addressSelectHandler.bind(this)}
              />
            </AddressContainer>
          )}
        </ScrollView>

        {single && (
          <TouchableOpacity
            activeOpacity={0.7}
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
    zIndex: 1,
    ...elevationShadowStyle(2),
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
});

export default withTranslation(['address', 'common'])(observer(Address));
