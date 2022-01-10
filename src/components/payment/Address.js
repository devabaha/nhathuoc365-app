import React, {Component} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
import {isConfigActive} from 'app-helper/configKeyHandler';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// routing
import {pop, push, refresh} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BASE_DARK_THEME_ID} from 'src/Themes/Theme.dark';
import {CONFIG_KEY} from 'app-helper/configKeyHandler';
import {
  ButtonRoundedType,
  TypographyType,
  BundleIconSetName,
} from 'src/components/base';
// entities
import {APIRequest} from 'src/network/Entity';
import EventTracker from 'app-helper/EventTracker';
// custom components
import AddressContainer from 'src/components/payment/AddressContainer';
import ListAddressStore from 'src/containers/ListAddressStore';
import AddressItem from './AddressItem';
import Loading from 'src/components/Loading';
import Button from 'src/components/Button';
import Indicator from 'src/components/Indicator';
import {
  Container,
  Typography,
  Icon,
  AppOutlinedButton,
  BaseButton,
  ScreenWrapper,
  ScrollView,
  RefreshControl,
} from 'src/components/base';

const ADDRESS_TYPE = {
  USER: 'user_address',
  STORE: 'store_address',
};

class Address extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    selectedAddressId: '',
    isVisibleUserAddress: true,
    isVisibleStoreAddress: false,
  };

  state = {
    refreshing: false,
    data: null,
    item_selected: this.defaultSelectedAddressId,
    loading: true,
    continue_loading: false,
    single: !this.props.from_page,
  };

  unmounted = false;
  getAddressRequest = new APIRequest();
  requests = [this.getAddressRequest];
  eventTracker = new EventTracker();

  refScrollView = React.createRef();

  isScrollToSelectedAddress = false;
  listAddressStoreOffsetY = 0;
  selectedStoreAddressOffsetY = undefined;
  selectedUserAddressOffsetY = undefined;

  addressTypeLoadedData = {
    [ADDRESS_TYPE.USER]: false,
    [ADDRESS_TYPE.STORE]: false,
  };

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  get defaultSelectedAddressId() {
    return (
      this.props.selectedAddressId ||
      (store.cart_data && store.cart_data.address_id != 0
        ? store.cart_data.address_id
        : null)
    );
  }

  get isVisibleStoreAddress() {
    return (
      isConfigActive(CONFIG_KEY.PICK_UP_AT_THE_STORE_KEY) &&
      this.props.isVisibleStoreAddress
    );
  }

  componentDidMount() {
    if (this.props.isVisibleUserAddress) {
      setTimeout(() =>
        refresh({
          right: this._renderRightButton.bind(this),
        }),
      );
    }
    // this.props.i18n.changeLanguage('en')
    this._getData();
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
    cancelRequests(this.requests);
    this.eventTracker.clearTracking();
    this.updateNavBarDisposer();
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
      this.scrollToSelectedAddress(ADDRESS_TYPE.USER);
      this.setState({
        loading: false,
        refreshing: false,
      });
    }
  }

  _goConfirmPage() {
    if (this.props.onSelectAddress) {
      this.props.onSelectAddress(this.state.item_selected);
      pop();
      return;
    }

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
    pop();
    if (this.props.redirect == 'confirm') {
      push(appConfig.routes.paymentConfirm, {}, this.theme);
    } else {
    }
  }

  // chọn địa chỉ cho đơn hàng
  _addressSelectHandler(item) {
    this.setState({
      item_selected: item.id,
    });
  }

  reloadAddress = () => {
    this.setState({loading: true});
    this._getData(300);
  };

  handleEditAddress = (address) => {
    const {t} = this.props;
    push(
      appConfig.routes.createAddress,
      {
        edit_data: address,
        title: t('common:screen.address.editTitle'),
        addressReload: this.reloadAddress,
        from_page: this.props.from_page,
      },
      this.theme,
    );
  };

  checkAddressSelected = (address) => {};

  _createNew() {
    push(
      appConfig.routes.createAddress,
      {
        redirect: this.props.redirect,
        goBack: this.props.goBack,
        addressReload: this.reloadAddress,
        from_page: this.props.from_page,
      },
      this.theme,
    );
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this._getData();
  };

  handleListAddressStoreLayout = (e) => {
    this.listAddressStoreOffsetY = e.nativeEvent.layout.y;
  };

  handleSelectedStoreAddressLayout = (e) => {
    this.selectedStoreAddressOffsetY = e.nativeEvent.layout.y;
  };

  handleSelectedUserAddressLayout = (e) => {
    this.selectedUserAddressOffsetY = e.nativeEvent.layout.y;
  };

  scrollToSelectedAddress = (type) => {
    if (this.isScrollToSelectedAddress) return;

    this.addressTypeLoadedData[type] = true;
    if (
      Object.values(this.addressTypeLoadedData).every(
        (addressTypeData) => !!addressTypeData,
      )
    ) {
      if (this.refScrollView.current) {
        setTimeout(() => {
          const selectedAddressOffsetY = !!this.selectedStoreAddressOffsetY
            ? this.listAddressStoreOffsetY + this.selectedStoreAddressOffsetY
            : this.selectedUserAddressOffsetY;
          this.refScrollView.current.scrollTo({y: selectedAddressOffsetY});
          this.isScrollToSelectedAddress = true;
        }, 300);
      }
    }
  };

  paymentNavStyle = mergeStyles(styles.payments_nav, {
    borderColor: this.theme.color.border,
    borderBottomWidth: this.theme.layout.borderWidthPixel,
    shadowColor: this.theme.color.shadow,
    ...this.theme.layout.shadow,
  });

  paymentNavIconContainerStyle = mergeStyles(styles.payments_nav_icon_box, {
    borderColor: this.theme.color.iconInactive,
    borderWidth: this.theme.layout.borderWidth,
  });

  paymentNavIconActiveContainerStyle = mergeStyles(
    this.paymentNavIconContainerStyle,
    {
      backgroundColor:
        this.theme.id === BASE_DARK_THEME_ID
          ? this.theme.color.onSurface
          : null,
      borderColor: this.theme.color.primary,
    },
  );

  paymentNavIconStyle = {
    fontSize: 20,
    color: this.theme.color.iconInactive,
  };

  paymentNavIconActiveStyle = [
    this.paymentNavIconStyle,
    {
      color:
        this.theme.id === BASE_DARK_THEME_ID
          ? this.theme.color.primary
          : this.theme.color.primaryHighlight,
    },
  ];

  paymentNavItemTitleStyle = mergeStyles(styles.payments_nav_items_title, {
    color: this.theme.color.textInactive,
  });

  paymentNavItemConnectorStyle = mergeStyles(styles.payments_nav_items_active, {
    backgroundColor: this.theme.color.primaryHighlight,
    height: this.theme.layout.borderWidth,
  });

  paymentNavItemRightConnectorStyle = [
    this.paymentNavItemConnectorStyle,
    {right: undefined, left: 0},
  ];

  // render button trên navbar
  _renderRightButton() {
    const rightBtnNavStyle = mergeStyles(styles.rightBtnNav, {
      color: this.theme.color.onNavBarBackground,
    });

    return (
      <BaseButton
        style={styles.right_btn_add_store}
        activeOpacity={0.7}
        onPress={this._createNew.bind(this)}>
        <Icon
          bundle={BundleIconSetName.FONT_AWESOME}
          name="plus"
          style={rightBtnNavStyle}
        />
      </BaseButton>
    );
  }

  renderAddButtonTitle = (titleStyle) => {
    const {t} = this.props;

    const addressAddIconBtnStyle = [
      {
        fontSize: 15,
      },
      titleStyle,
    ];

    return (
      <View style={styles.address_add_content}>
        <View style={styles.address_add_icon_box}>
          <Icon
            bundle={BundleIconSetName.FONT_AWESOME}
            name="plus"
            style={addressAddIconBtnStyle}
          />
        </View>
        <Typography type={TypographyType.TITLE_MEDIUM} style={titleStyle}>
          {t('address.new')}
        </Typography>
      </View>
    );
  };

  renderAddButtonContent = (index = 0) => {
    return (
      <Container
        key={index}
        style={[styles.address_add, !!index && styles.addressAddContainer]}>
        <AppOutlinedButton
          rounded={ButtonRoundedType.SMALL}
          onPress={this._createNew.bind(this)}
          renderTitleComponent={this.renderAddButtonTitle}
        />
      </Container>
    );
  };

  renderBtnContinueContent = (titleStyle) => {
    const {t} = this.props;

    return (
      <Container row noBackground>
        <Typography style={[styles.address_continue_title, titleStyle]}>
          {t('nextBtnMessage')}
        </Typography>
        <View style={styles.addressContinueIconContainer}>
          {this.state.continue_loading ? (
            <Indicator size="small" color="#fff" />
          ) : (
            <Icon
              bundle={BundleIconSetName.FONT_AWESOME}
              name="chevron-right"
              style={titleStyle}
              size={20}
            />
          )}
        </View>
      </Container>
    );
  };

  render() {
    const {single} = this.state;
    const {t} = this.props;

    return (
      <ScreenWrapper safeLayout={single}>
        {this.state.loading && <Loading center />}
        {single && (
          <Container row style={this.paymentNavStyle}>
            <BaseButton>
              <View style={styles.payments_nav_items}>
                <View style={this.paymentNavIconActiveContainerStyle}>
                  <Icon
                    bundle={BundleIconSetName.FONT_AWESOME}
                    style={this.paymentNavIconActiveStyle}
                    name="map-marker"
                  />
                </View>
                <Typography
                  type={TypographyType.LABEL_SMALL_PRIMARY}
                  style={styles.payments_nav_items_title}>
                  {t('address.title')}
                </Typography>

                <View style={this.paymentNavItemConnectorStyle} />
              </View>
            </BaseButton>

            <BaseButton
              onPress={() => {
                if (store.cart_data.address_id == 0) {
                  this._goConfirmPage();
                } else {
                  this._goConfirm();
                }
              }}
              activeOpacity={0.7}>
              <View style={styles.payments_nav_items}>
                <View style={this.paymentNavIconContainerStyle}>
                  <Icon
                    bundle={BundleIconSetName.FONT_AWESOME}
                    name="check"
                    style={this.paymentNavIconStyle}
                  />
                </View>
                <Typography
                  type={TypographyType.LABEL_SMALL}
                  style={this.paymentNavItemTitleStyle}>
                  {t('confirm.title')}
                </Typography>

                <View style={this.paymentNavItemRightConnectorStyle} />
              </View>
            </BaseButton>
          </Container>
        )}

        <ScrollView
          safeLayout={!single}
          ref={this.refScrollView}
          contentContainerStyle={{
            paddingTop: single ? 15 : 0,
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          {!!this.props.isVisibleUserAddress && (
            <AddressContainer title={t('address.myAddress')}>
              {this.state.data != null
                ? this.state.data.map((item, index) => {
                    if (item.type == 'address_add') {
                      return this.renderAddButtonContent(index);
                    }

                    var is_selected = false;

                    if (this.state.item_selected) {
                      if (this.state.item_selected == item.id) {
                        is_selected = true;
                      }
                    } else if (
                      store.cart_data &&
                      store.cart_data.address_id != 0
                    ) {
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
                        key={index}
                        address={item}
                        editable
                        selectable={single}
                        selected={is_selected}
                        onSelectAddress={this._addressSelectHandler.bind(
                          this,
                          item,
                        )}
                        onEditPress={this.handleEditAddress.bind(this, item)}
                        onLayout={
                          is_selected
                            ? this.handleSelectedUserAddressLayout
                            : undefined
                        }
                      />
                    );
                  })
                : this.renderAddButtonContent()}
            </AddressContainer>
          )}

          {this.isVisibleStoreAddress && (
            <AddressContainer
              title={t('address.store')}
              onLayout={this.handleListAddressStoreLayout}>
              <ListAddressStore
                refreshing={this.state.refreshing}
                selectedAddressId={this.state.item_selected}
                onChangeAddress={this._addressSelectHandler.bind(this)}
                onLoadedData={() =>
                  this.scrollToSelectedAddress(ADDRESS_TYPE.STORE)
                }
                onSelectedAddressLayout={this.handleSelectedStoreAddressLayout}
              />
            </AddressContainer>
          )}
        </ScrollView>

        {single && (
          <Button
            onPress={this._goConfirmPage.bind(this)}
            renderTitleComponent={this.renderBtnContinueContent}
          />
        )}
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginBottom: 0,
  },
  rightBtnNav: {
    fontSize: 20,
  },

  addressAddContainer: {
    marginTop: 8,
  },
  address_add: {
    paddingVertical: 17,
    paddingHorizontal: 34,
  },
  address_add_content: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  address_add_icon_box: {
    marginRight: 6,
  },
  address_continue_title: {
    marginRight: 8,
  },
  addressContinueIconContainer: {
    minWidth: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  payments_nav: {
    height: 60,
    borderBottomWidth: Util.pixel,
    zIndex: 1,
  },
  payments_nav_items: {
    justifyContent: 'center',
    height: 60,
    width: Util.size.width / 2,
    alignItems: 'center',
  },
  payments_nav_items_title: {
    paddingHorizontal: 10,
    fontWeight: '500',
  },
  payments_nav_items_active: {
    position: 'absolute',
    width: Util.size.width / 4 - 14,
    top: 20,
    right: 0,
  },
  payments_nav_items_right_active: {
    position: 'absolute',
    width: Util.size.width / 4 - 14,
    top: 20,
    left: 0,
    height: Util.pixel,
  },

  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 12,
  },

  payments_nav_icon_box: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
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
