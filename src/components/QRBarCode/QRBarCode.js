import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, Alert, Dimensions} from 'react-native';
// 3-party libs
import ScreenBrightness from 'react-native-screen-brightness';
import {openSettings} from 'react-native-permissions';
import QRCode from 'react-native-qrcode-svg';
import Barcode from 'react-native-barcode-builder';
import timer from 'react-native-timer';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// network
import APIHandler from 'src/network/APIHandler';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import EventTracker from 'app-helper/EventTracker';
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// routing
import {push, pop, refresh, replace} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import {
  TextButton,
  ScreenWrapper,
  Container,
  Typography,
  ScrollView,
  Icon,
} from 'src/components/base';
import Button from 'src/components/Button';
import QRScanner from './QRScanner';
import {BASE_DARK_THEME_ID} from 'src/Themes/Theme.dark';

const MAXIMUM_LUMINOUS = 0.7;
const MIN_LUMINOUS = 0.5;

const CONTAINER_QR_HEIGHT = Dimensions.get('window').height;

const BOTTOM_HEIGHT =
  CONTAINER_QR_HEIGHT * 0.1 > 100 ? 100 : CONTAINER_QR_HEIGHT * 0.1;

class QRBarCode extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    mobxStore: PropTypes.object,
    topContentText: PropTypes.string,
    placeholder: PropTypes.string,
    isFromProductStamps: PropTypes.bool,
    isEnterCode: PropTypes.bool,
    onCloseEnterCode: PropTypes.func,
  };

  static defaultProps = {
    onCloseEnterCode: () => {},
    isVisibleTabBar: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      index: props.index || 0,
      wallet: props.wallet || false,
      loading: false,
      from: props.from || false,
      barcode: props.address || '000000000000',
      title: props.title || props.t('common:screen.qrBarCode.mainTitle'),
      content: props.content ? props.content : props.t('content.description'),
      originLuminous: MIN_LUMINOUS,

      isVisibleBtnEnterCode: false,
      topContentText: '',
      placeholder: '',
      isFromProductStamps: false,
      isEnterCode: false,
    };

    this.unmounted = false;
    this.eventTracker = new EventTracker();
    this.checkProductRequest = new APIRequest();
    this.requests = [this.checkProductRequest];
    this.updateNavBarDisposer = () => {};
  }

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    if (this.props.isEnterCode) {
      this.enterCodeManual();
    }

    if (!this.props.address) {
      this._getData();
      this.setTimmer();
    }

    this.handleBrightness();
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
    timer.clearTimeout(this, 'barcodeupdate');
    ScreenBrightness.setBrightness(this.state.originLuminous);
    this.eventTracker.clearTracking();
    cancelRequests(this.requests);

    this.updateNavBarDisposer();
  }

  enterCodeManual = () => {
    const {t} = this.props;
    push(appConfig.routes.voucherEnterCodeManual, {
      heading: t('common:screen.qrBarCode.enterCodeProduct'),
      placeholder: t('common:screen.qrBarCode.enterCode'),
      onClose: () => {
        pop();
        this.props.onCloseEnterCode();
      },
      onSendCode: (code) => {
        this.checkProductCode(code);
        pop();
      },
    });
  };

  handleBrightness = () => {
    ScreenBrightness.getBrightness().then((originLuminous) => {
      if (originLuminous < MIN_LUMINOUS) {
        this.setState({originLuminous}, () =>
          ScreenBrightness.setBrightness(MAXIMUM_LUMINOUS),
        );
      }
    });
  };

  setTimmer() {
    timer.setTimeout(
      this,
      'barcodeupdate',
      () => {
        this._getData();
        this.setTimmer();
      },
      5000,
    );
  }

  async _getData() {
    this.setState({loading: true});
    const response = await APIHandler.user_barcode(
      this.props.mobxStore.store_id,
    );
    if (response && response.status == STATUS_SUCCESS && !this.unmounted) {
      this.setState({barcode: response.data.barcode});
    }
  }

  /***
   * Lay ma code qua url trong qrcode
   */
  _getSearchCodeByLink(link) {
    //, password, refer
    var existGet = stristr(link, '?');
    var existViewApp = stristr(link, 'view=app');

    if (!existViewApp) {
      link = link + (existGet ? '&' : '?') + 'view=app';
    }
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          var response = await APIHandler.getAPI(link);
          if (!this.unmounted) {
            if (response && response.status == STATUS_SUCCESS) {
              action(() => {
                this.setState(
                  {
                    loading: false,
                  },
                  () => {
                    setTimeout(() => {
                      !this.unmounted &&
                        this._proccessQRCodeResult(response.data.barcode);
                    }, 450);
                  },
                );
              })();
            } else {
              action(() => {
                this.setState(
                  {
                    loading: false,
                  },
                  () => {
                    this._open_webview(link);
                  },
                );
              })();
            }
          }
        } catch (e) {
          action(() => {
            !this.unmounted &&
              this.setState(
                {
                  loading: false,
                },
                () => {
                  this._open_webview(link);
                },
              );
          })();
        } finally {
          !this.unmounted &&
            this.setState({
              loading: false,
            });
        }
      },
    );
  }

  /***
   * Lay tai khoan tu Ma Tai khoan
   */
  _getAccountByBarcode(barcode) {
    const {t} = this.props;
    //, password, refer
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          var response = await APIHandler.user_from_barcode(barcode);
          if (!this.unmounted) {
            if (response && response.status == STATUS_SUCCESS) {
              action(() => {
                this.setState(
                  {
                    loading: false,
                  },
                  () => {
                    pop();
                    push(
                      'pay_account',
                      {
                        title: t('common:screen.payAccount.mainTitle'),
                        barcode: barcode,
                        wallet: response.data.account.default_wallet,
                        account: response.data.account,
                        app: response.data.app,
                      },
                      this.theme,
                    );

                    flashShowMessage({
                      type: 'success',
                      message: response.message,
                    });
                  },
                );
              })();
            } else {
              this._search_store(barcode);
            }
          }
        } catch (e) {
        } finally {
          !this.unmounted &&
            this.setState({
              loading: false,
            });
        }
      },
    );
  }

  /***
   * Lay cart
   */
  _getWalletByAddressAndZoneCode(barcode) {
    //,
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          // const data = isWalletAddressWithZoneCode(barcode);
          const data = {qrcode: barcode};
          const response = await APIHandler.user_process_qrcode(data);
          console.log(response);
          if (
            response &&
            response.data.wallet &&
            response.status == STATUS_SUCCESS
          ) {
            this.setState(
              {
                loading: false,
              },
              () => {
                const {t} = this.props;
                const {wallet, to_wallet, site: receiverInfo} = response.data;
                let receiverTel = receiverInfo.tel;
                receiverTel = receiverTel.split('+84').join('0');
                if (receiverTel.slice(0, 2) === '84') {
                  receiverTel = receiverTel.replace('84', '0');
                }
                pop();
                console.log(response.data);
                push(
                  appConfig.routes.transferPayment,
                  {
                    title: t('transfer:transferPaymentTitle', {
                      walletName: receiverInfo.name,
                    }),
                    wallet,
                    showWallet: true,
                    receiver: {
                      id: receiverInfo.id,
                      walletAddress: receiverInfo.wallet_address,
                      name: receiverInfo.name,
                      walletName: receiverInfo.name,
                      tel: receiverTel,
                      originTel: receiverInfo.tel,
                      avatar: receiverInfo.logo_url,
                      address: receiverInfo.address,
                      notInContact: true,
                    },
                  },
                  this.theme,
                );
                // replace(appConfig.routes.payWallet, {
                //   title: "Chuyển khoản",
                //   wallet: response.data.wallet,
                //   address: data[0],
                // });
                Toast.show(response.message, Toast.SHORT);
              },
            );
          } else {
            this._search_store(barcode);
          }
        } catch (e) {
          this._search_store(barcode);
        }
      },
    );
  }

  // tới màn hình store
  _goStores(item, category_id) {
    action(() => {
      this.props.mobxStore.setStoreData(item);
    })();

    // hide tutorial go store
    if (this.props.that) {
      this.props.that.setState({
        show_go_store: false,
      });
    }

    replace(
      appConfig.routes.store,
      {
        title: item.name,
        goCategory: category_id,
      },
      this.theme,
    );
  }
  _goProduct(item) {
    replace(appConfig.routes.item, {
      title: item.name,
      item,
    });
  }

  _goNewsDetail(item) {
    replace(
      appConfig.routes.notifyDetail,
      {
        title: item.title,
        data: item,
      },
      this.theme,
    );
  }

  /***
   * Lay cart
   */
  _check_address(barcode) {
    //,
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          var response = await APIHandler.user_check_address(barcode);

          if (!this.unmounted) {
            if (response && response.status == STATUS_SUCCESS) {
              action(() => {
                this.setState(
                  {
                    loading: false,
                  },
                  () => {
                    if (response.data.object.type == OBJECT_TYPE_KEY_USER) {
                      pop();
                      // setTimeout(() => {
                      //   push(appConfig.routes.payWallet, {
                      //     title: 'Chuyển khoản',
                      //     wallet: this.state.wallet,
                      //     address: barcode
                      //   });
                      // }, this.theme);
                      this.goToPayment(barcode);
                    } else if (
                      response.data.object.type == OBJECT_TYPE_KEY_ADDRESS
                    ) {
                      pop();
                      setTimeout(() => {
                        this._goStores(response.data.item);
                      }, 0);
                    } else if (
                      response.data.object.type == OBJECT_TYPE_KEY_SITE
                    ) {
                      pop();
                      setTimeout(() => {
                        this._goStores(response.data.item);
                      }, 0);
                    } else if (
                      response.data.object.type ==
                      OBJECT_TYPE_KEY_PRODUCT_CATEGORY
                    ) {
                      pop();
                      setTimeout(() => {
                        this._goStores(
                          response.data.item,
                          response.data.item.site_product_category_id,
                        );
                      }, 0);
                    } else if (
                      response.data.object.type == OBJECT_TYPE_KEY_PRODUCT
                    ) {
                      pop();
                      setTimeout(() => {
                        this._goProduct(response.data.item);
                      }, 0);
                    } else if (
                      response.data.object.type == OBJECT_TYPE_KEY_NEWS
                    ) {
                      pop();
                      setTimeout(() => {
                        this._goNewsDetail(response.data.item);
                      }, 0);
                    } else if (
                      response.data.object.type == OBJECT_TYPE_KEY_CART
                    ) {
                      pop();
                      setTimeout(() => {
                        push(appConfig.routes.ordersDetail, {
                          data: response.data.item,
                          title: '#' + response.data.item.cart_code,
                        });
                      }, this.theme);
                    } else if (
                      response.data.object.type == OBJECT_TYPE_KEY_CAMPAIGN
                    ) {
                      pop();
                      setTimeout(() => {
                        push(
                          appConfig.routes.voucherDetail,
                          {
                            title: response.data.item.title,
                            campaignId: response.data.item.id,
                          },
                          this.theme,
                        );
                      }, 0);
                    } else {
                      pop();
                      setTimeout(() => {
                        this._search_store(barcode);
                      }, 0);
                    }
                    // Toast.show(response.message, Toast.SHORT);
                  },
                );
              })();
            } else {
              this._search_store(barcode);
            }
          }
        } catch (e) {
          this._search_store(barcode);
        }
      },
    );
  }

  /***
   * Lay cart
   */
  _getCartByCartcode(barcode) {
    //,
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          var response = await APIHandler.user_cart_code(barcode);
          if (response && response.status == STATUS_SUCCESS) {
            action(() => {
              this.setState(
                {
                  loading: false,
                },
                () => {
                  replace(appConfig.routes.ordersDetail, {
                    data: response.data,
                    title: '#' + barcode,
                    tel: response.data.tel,
                  });
                  // Toast.show(response.message, Toast.SHORT);
                },
              );
            })();
          } else {
            this._search_store(barcode);
          }
        } catch (e) {
          this._search_store(barcode);
        }
      },
    );
  }

  _search_store(barcode) {
    const {t} = this.props;
    alert(t('invalidQRCode'));
  }

  _open_webview(link) {
    pop();
    setTimeout(() => {
      push(appConfig.routes.webview, {
        title: link,
        url: link,
      });
    }, this.theme);
  }

  _proccessQRCodeResult = (event) => {
    setTimeout(() => {
      if (this.unmounted) return;
      const text_result = event.data;
      const {wallet, from} = this.state;

      if (this.props.getQRCode) {
        this.props.getQRCode(text_result);
        pop();
        return;
      }

      if (text_result) {
        if (isURL(text_result)) {
          if (isLinkTickID(text_result)) {
            this._getSearchCodeByLink(text_result);
          } else {
            this._open_webview(text_result);
          }
        } else if (isWalletAddress(text_result)) {
          if (from == appConfig.routes.transfer) {
            // push(appConfig.routes.payWallet, {
            //   title: 'Chuyển khoản',
            //   wallet: wallet,
            //   address: text_result
            // }, this.theme);
            this.goToPayment(text_result);
          } else {
            this._check_address(text_result);
          }
        } else if (isAccountCode(text_result)) {
          setTimeout(() => {
            this._getAccountByBarcode(text_result);
          }, 450);
        } else if (isCartCode(text_result)) {
          setTimeout(() => {
            this._getCartByCartcode(text_result);
          }, 450);
        } else if (isWalletAddressWithZoneCode(text_result)) {
          this._getWalletByAddressAndZoneCode(text_result);
        } else {
          // this._search_store(text_result);
          this.checkProductCode(text_result);
        }
      }
    }, 500);
  };

  async checkProductCode(qrcode) {
    const data = {qrcode};
    const {t} = this.props;

    try {
      this.checkProductRequest.data = APIHandler.user_check_product_code(data);
      const response = await this.checkProductRequest.promise();
      console.log(response);

      if (response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          pop();
          push(
            appConfig.routes.item,
            {
              item: response.data.product,
              title: response.data.name,
              preventUpdate: true,
              showBtnProductStamps: true,
            },
            this.theme,
          );
        } else {
          // push(appConfig.routes.searchStore, {
          //   qr_code: qrcode,
          // }, this.theme);
          flashShowMessage({
            type: 'danger',
            message: response.message || t('common:api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('common:api.error.message'),
        });
      }
    } catch (error) {
      console.log('check_product_code', error);
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message'),
      });
    }
  }

  goToSetting() {
    const {t} = this.props;
    openSettings().catch(() =>
      Alert.alert(t('common:system.settings.error.accessProblem')),
    );
  }

  goToPayment = (wallet_address) => {
    const {t} = this.props;
    this.getUserInfo(wallet_address, (receiverInfo) => {
      pop();
      setTimeout(() => {
        const wallet = this.props.wallet || store.user_info.default_wallet;
        push(
          appConfig.routes.transferPayment,
          {
            title: t('transferPaymentTitle', {walletName: wallet.name}),
            wallet,
            receiver: {
              id: receiverInfo.id,
              walletAddress: receiverInfo.wallet_address,
              name: receiverInfo.name,
              walletName: receiverInfo.name,
              tel: receiverInfo.tel,
              originTel: receiverInfo.tel,
              avatar: receiverInfo.avatar,
              notInContact: true,
            },
          },
          this.theme,
        );
      });
    });
  };

  getUserInfo = async (wallet_address, callBackSuccess) => {
    const data = {wallet_address};
    this.setState({loading: true});

    try {
      const response = await APIHandler.user_get_info_by_wallet_address(data);
      if (!this.unmounted) {
        if (response.status === STATUS_SUCCESS && response.data) {
          callBackSuccess({
            id: response.data.id,
            name: response.data.name,
            wallet_address: response.data.wallet_address,
            avatar: response.data.img,
            tel: response.data.tel,
          });
        } else {
          Alert.alert(response.message);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      !this.unmounted && this.setState({loading: false});
    }
  };

  renderQRCodeScanner() {
    return <QRScanner onRead={this._proccessQRCodeResult} />;
  }

  renderIconBefore(titleStyle) {
    return (
      <Icon
        bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
        style={[titleStyle, styles.iconReload]}
        name="reload"
      />
    );
  }

  renderMyQRCode() {
    const {barcode} = this.state;
    const {t} = this.props;
    return (
      <ScrollView contentContainerStyle={styles.myQRCodeContainer}>
        <Typography
          type={TypographyType.TITLE_MEDIUM}
          style={styles.headerText}>
          {' ' + t('POSGuideMessage')}
        </Typography>
        <View style={{marginLeft: 30, marginRight: 30}}>
          <Barcode
            lineColor={this.theme.color.onBackground}
            value={barcode}
            format="CODE128"
            width={1.5}
            height={80}
            background={this.theme.color.background}
          />
        </View>
        <Typography type={TypographyType.LABEL_HUGE} style={styles.barcodeText}>
          {barcode}
        </Typography>
        <View style={styles.qrCodeView}>
          <QRCode
            color={this.theme.color.onBackground}
            backgroundColor={this.theme.color.background}
            style={{flex: 1}}
            value={barcode}
            size={appConfig.device.width / 3}
            logoBackgroundColor="transparent"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Typography
            type={TypographyType.LABEL_LARGE}
            style={[styles.barcodeText]}
            renderIconBefore={this.renderIconBefore}>
            {t('reload')}
          </Typography>
        </View>
        <Typography type={TypographyType.LABEL_MEDIUM} style={styles.descText}>
          {t('accountDescription')}
        </Typography>
        <Typography type={TypographyType.LABEL_MEDIUM} style={styles.descText}>
          {t('cashbackDescription')}
        </Typography>
      </ScrollView>
    );
  }

  renderOnlyQRCode() {
    const {barcode, content} = this.state;
    return (
      <ScrollView contentContainerStyle={styles.myQRCodeContainer}>
        <Typography
          type={TypographyType.TITLE_MEDIUM}
          style={styles.addressText}>
          {barcode}
        </Typography>
        <View style={styles.addressQrCodeView}>
          <QRCode
            style={{flex: 1}}
            value={barcode}
            size={appConfig.device.width / 1.5}
            logoBackgroundColor="transparent"
          />
        </View>
        <Typography
          type={TypographyType.TITLE_MEDIUM}
          style={styles.addressText}>
          • {content}
        </Typography>
      </ScrollView>
    );
  }

  renderIconQRCode = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
        name="barcode-scan"
        style={[titleStyle, styles.iconQR]}
      />
    );
  };

  renderIconScanQRCode = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
        name="qrcode-scan"
        style={[titleStyle, styles.iconQR]}
      />
    );
  };

  onPressTabButton(index) {
    if (index == 0) {
      refresh({title: this.state.title, address: this.props.address});
    } else {
      const {t} = this.props;
      refresh({title: t('common:screen.qrBarCode.scanTitle')});
    }
    this.setState({index: index});
  }

  getButtonBackgroundStyle = (focused) => {
    return [
      styles.bottomButton,
      focused &&
        this.theme.id === BASE_DARK_THEME_ID && {
          backgroundColor: this.theme.color.surfaceHighlight,
        },
    ];
  };

  getButtonTitleStyle = (focused) => {
    return (
      focused && {
        color:
          this.theme.id === BASE_DARK_THEME_ID
            ? this.theme.color.primary
            : this.theme.color.persistPrimary,
      }
    );
  };

  get titleBtnLeftStyle() {
    return mergeStyles(styles.titleStyle, {
      color: this.theme.color.persistPrimary,
    });
  }

  get iconQRStyle() {
    return mergeStyles(styles.iconQR, {
      color: this.theme.color.persistPrimary,
    });
  }

  get bottomViewStyle() {
    return mergeStyles(styles.bottomView, {
      borderTopWidth: this.theme.layout.borderWidthSmall,
      borderColor: this.theme.color.border,
    });
  }

  render() {
    const {index, title} = this.state;

    const isQRCodeFocused = this.state.index === 0;
    const isScanQRCodeFocused = this.state.index === 1;

    return (
      <ScreenWrapper style={styles.container}>
        <View style={styles.contentView}>
          {index == 0
            ? this.props.address
              ? this.renderOnlyQRCode()
              : this.renderMyQRCode()
            : this.renderQRCodeScanner()}
        </View>

        {!!this.props.isVisibleBtnEnterCode ? (
          <Button
            containerStyle={styles.enterCodeBtn}
            onPress={() => this.enterCodeManual()}
            title={this.props.t('common:screen.qrBarCode.enterCode')}
          />
        ) : (
          !!this.props.isVisibleTabBar && (
            <Container style={this.bottomViewStyle}>
              <TextButton
                column
                renderIconLeft={this.renderIconQRCode}
                style={this.getButtonBackgroundStyle(isQRCodeFocused)}
                titleStyle={this.getButtonTitleStyle(isQRCodeFocused)}
                onPress={() => this.onPressTabButton(0)}>
                {title}
              </TextButton>
              <TextButton
                column
                renderIconLeft={this.renderIconScanQRCode}
                style={this.getButtonBackgroundStyle(isScanQRCodeFocused)}
                titleStyle={this.getButtonTitleStyle(isScanQRCodeFocused)}
                onPress={() => this.onPressTabButton(1)}>
                {this.props.t('scanQRCode')}
              </TextButton>
            </Container>
          )
        )}
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    width: '100%',
  },

  enterCodeBtn: {
    position: 'absolute',
    bottom: appConfig.device.bottomSpace,
  },

  topContent: {
    paddingVertical: 16,
    paddingTop: '50%',
    alignItems: 'center',
  },
  contentView: {
    height: appConfig.device.height - 49 - NAV_HEIGHT,
  },
  myQRCodeContainer: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  bottomView: {
    position: 'absolute',
    height: BOTTOM_HEIGHT,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  bottomButton: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  titleBottomButton: {
    fontSize: 14,
  },
  headerText: {
    marginTop: 20,
    marginLeft: 30,
    marginRight: 20,
    textAlign: 'center',
  },
  qrCodeView: {
    marginTop: 0,
    width: appConfig.device.width / 3,
    height: appConfig.device.width / 3,
    alignSelf: 'center',
  },
  barcodeText: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 5,
  },
  descText: {
    marginTop: 20,
    marginLeft: 70,
    marginRight: 70,
  },
  addressText: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  addressQrCodeView: {
    marginTop: 0,
    marginBottom: 20,
    width: appConfig.device.width / 1.5,
    height: appConfig.device.width / 1.5,
    alignSelf: 'center',
  },
  iconReload: {
    fontSize: 16,
  },
  iconQR: {
    fontSize: 20,
  },
  titleStyle: {},
});

export default withTranslation(['qrBarCode', 'transfer', 'common'])(QRBarCode);
