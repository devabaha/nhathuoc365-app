import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import ScreenBrightness from 'react-native-screen-brightness';
import {
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Actions, ActionConst} from 'react-native-router-flux';
import QRCode from 'react-native-qrcode-svg';
import Barcode from 'react-native-barcode-builder';
import appConfig from 'app-config';
import timer from 'react-native-timer';
import store from 'app-store';
import EventTracker from '../../helper/EventTracker';
import {APIRequest} from 'src/network/Entity';
import APIHandler from 'src/network/APIHandler';
import QRScanner from './QRScanner';

const MAXIMUM_LUMINOUS = 0.7;
const MIN_LUMINOUS = 0.5;
const isAndroid = Platform.OS === 'android';
const isIos = Platform.OS === 'ios';

const DEFAULT_CAMERA_RATIO = 4 / 3;
const CONTAINER_QR_WIDTH = Dimensions.get('window').width;
const CONTAINER_QR_HEIGHT = Dimensions.get('window').height;
const DEFAULT_CAMERA_WIDTH = CONTAINER_QR_HEIGHT / DEFAULT_CAMERA_RATIO;

const BOTTOM_HEIGHT =
  CONTAINER_QR_HEIGHT * 0.1 > 100 ? 100 : CONTAINER_QR_HEIGHT * 0.1;

const SCAN_AREA_WIDTH = CONTAINER_QR_WIDTH * 0.6;
const SCAN_AREA_HEIGHT = CONTAINER_QR_WIDTH * 0.6;

const SCAN_AREA_TOP_PERCENT =
  (CONTAINER_QR_HEIGHT - SCAN_AREA_HEIGHT - BOTTOM_HEIGHT * 2) /
  CONTAINER_QR_HEIGHT /
  2;
const SCAN_AREA_TOP = CONTAINER_QR_HEIGHT * SCAN_AREA_TOP_PERCENT;
const SCAN_AREA_LEFT = CONTAINER_QR_WIDTH * 0.2;
const SCAN_AREA_LEFT_PERCENT =
  ((DEFAULT_CAMERA_WIDTH - CONTAINER_QR_WIDTH) / 2 + SCAN_AREA_LEFT) /
  DEFAULT_CAMERA_WIDTH;

const QR_SCAN_AREA = {
  x: SCAN_AREA_TOP_PERCENT,
  y: SCAN_AREA_LEFT_PERCENT,
  width: SCAN_AREA_HEIGHT / CONTAINER_QR_HEIGHT,
  height: 1 - SCAN_AREA_LEFT_PERCENT * 2,
};

class QRBarCode extends Component {
  static propTypes = {
    mobxStore: PropTypes.object,
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
    };

    this.unmounted = false;
    this.eventTracker = new EventTracker();
    this.checkProductRequest = new APIRequest();
    this.requests = [this.checkProductRequest];
  }

  componentDidMount() {
    if (!this.props.address) {
      this._getData();
      this.setTimmer();
    }

    this.handleBrightness();
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    timer.clearTimeout(this, 'barcodeupdate');
    ScreenBrightness.setBrightness(this.state.originLuminous);
    this.eventTracker.clearTracking();
    cancelRequests(this.requests);
  }

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
                    Actions.pay_account({
                      title: t('common:screen.payAccount.mainTitle'),
                      barcode: barcode,
                      wallet: response.data.account.default_wallet,
                      account: response.data.account,
                      app: response.data.app,
                      type: ActionConst.REPLACE,
                    });

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
                Actions.pop();
                console.log(response.data);
                Actions.push(appConfig.routes.transferPayment, {
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
                });
                // Actions.push(appConfig.routes.payWallet, {
                //   title: "Chuyển khoản",
                //   wallet: response.data.wallet,
                //   address: data[0],
                //   type: ActionConst.REPLACE,
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

    Actions.push(appConfig.routes.store, {
      title: item.name,
      goCategory: category_id,
      type: ActionConst.REPLACE,
    });
  }
  _goProduct(item) {
    Actions.item({
      title: item.name,
      item,
      type: ActionConst.REPLACE,
    });
  }

  _goNewsDetail(item) {
    Actions.notify_item({
      title: item.title,
      data: item,
      type: ActionConst.REPLACE,
    });
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
                      Actions.pop();
                      // setTimeout(() => {
                      //   Actions.push(appConfig.routes.payWallet, {
                      //     title: 'Chuyển khoản',
                      //     wallet: this.state.wallet,
                      //     address: barcode
                      //   });
                      // }, 0);
                      this.goToPayment(barcode);
                    } else if (
                      response.data.object.type == OBJECT_TYPE_KEY_ADDRESS
                    ) {
                      Actions.pop();
                      setTimeout(() => {
                        this._goStores(response.data.item);
                      }, 0);
                    } else if (
                      response.data.object.type == OBJECT_TYPE_KEY_SITE
                    ) {
                      Actions.pop();
                      setTimeout(() => {
                        this._goStores(response.data.item);
                      }, 0);
                    } else if (
                      response.data.object.type ==
                      OBJECT_TYPE_KEY_PRODUCT_CATEGORY
                    ) {
                      Actions.pop();
                      setTimeout(() => {
                        this._goStores(
                          response.data.item,
                          response.data.item.site_product_category_id,
                        );
                      }, 0);
                    } else if (
                      response.data.object.type == OBJECT_TYPE_KEY_PRODUCT
                    ) {
                      Actions.pop();
                      setTimeout(() => {
                        this._goProduct(response.data.item);
                      }, 0);
                    } else if (
                      response.data.object.type == OBJECT_TYPE_KEY_NEWS
                    ) {
                      Actions.pop();
                      setTimeout(() => {
                        this._goNewsDetail(response.data.item);
                      }, 0);
                    } else if (
                      response.data.object.type == OBJECT_TYPE_KEY_CART
                    ) {
                      Actions.pop();
                      setTimeout(() => {
                        Actions.view_orders_item({
                          data: response.data.item,
                          title: '#' + response.data.item.cart_code,
                        });
                      }, 0);
                    } else if (
                      response.data.object.type == OBJECT_TYPE_KEY_CAMPAIGN
                    ) {
                      Actions.pop();
                      setTimeout(() => {
                        Actions.push(appConfig.routes.voucherDetail, {
                          title: response.data.item.title,
                          campaignId: response.data.item.id,
                        });
                      }, 0);
                    } else {
                      Actions.pop();
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
                  Actions.view_orders_item({
                    data: response.data,
                    title: '#' + barcode,
                    tel: response.data.tel,
                    type: ActionConst.REPLACE,
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
    Actions.pop();
    setTimeout(() => {
      Actions.webview({
        title: link,
        url: link,
      });
    }, 0);
  }

  _proccessQRCodeResult(event) {
    setTimeout(() => {
      if (this.unmounted) return;
      const text_result = event.data;
      const {wallet, from} = this.state;
      if (text_result) {
        if (isURL(text_result)) {
          if (isLinkTickID(text_result)) {
            this._getSearchCodeByLink(text_result);
          } else {
            this._open_webview(text_result);
          }
        } else if (isWalletAddress(text_result)) {
          if (from == appConfig.routes.transfer) {
            // Actions.push(appConfig.routes.payWallet, {
            //   title: 'Chuyển khoản',
            //   wallet: wallet,
            //   address: text_result
            // });
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
  }

  async checkProductCode(qrcode) {
    const data = {qrcode};
    const {t} = this.props;

    try {
      this.checkProductRequest.data = APIHandler.user_check_product_code(data);
      const response = await this.checkProductRequest.promise();
      console.log(response);

      if (response) {
        Actions.pop();
        if (response.status === STATUS_SUCCESS && response.data) {
          Actions.push(appConfig.routes.item, {
            item: response.data.product,
            title: response.data.name,
            preventUpdate: true,
            showBtnProductStamps: true,
          });
        } else {
          Actions.push(appConfig.routes.searchStore, {
            qr_code: qrcode,
          });
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
      Actions.pop();
      setTimeout(() => {
        const wallet = this.props.wallet || store.user_info.default_wallet;
        Actions.push(appConfig.routes.transferPayment, {
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
        });
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

  renderMyQRCode() {
    const {barcode} = this.state;
    const {t} = this.props;
    return (
      <ScrollView contentContainerStyle={styles.myQRCodeContainer}>
        <Text style={styles.headerText}>{' ' + t('POSGuideMessage')}</Text>
        <View style={{marginLeft: 30, marginRight: 30}}>
          <Barcode
            value={barcode}
            format="CODE128"
            width={1.5}
            height={80}
            background="transparent"
          />
        </View>
        <Text style={styles.barcodeText}>{barcode}</Text>
        <View style={styles.qrCodeView}>
          <QRCode
            style={{flex: 1}}
            value={barcode}
            size={appConfig.device.width / 3}
            logoBackgroundColor="transparent"
          />
        </View>
        <Text style={[styles.barcodeText, {fontSize: 16}]}>
          <Icon name="reload" size={16} color="#000" />
          {t('reload')}
        </Text>
        <Text style={styles.descText}>{t('accountDescription')}</Text>
        <Text style={styles.descText}>{t('cashbackDescription')}</Text>
      </ScrollView>
    );
  }

  renderOnlyQRCode() {
    const {barcode, content} = this.state;
    return (
      <ScrollView contentContainerStyle={styles.myQRCodeContainer}>
        <Text style={styles.addressText}>{barcode}</Text>
        <View style={styles.addressQrCodeView}>
          <QRCode
            style={{flex: 1}}
            value={barcode}
            size={appConfig.device.width / 1.5}
            logoBackgroundColor="transparent"
          />
        </View>
        <Text style={styles.addressText}>● {content}</Text>
      </ScrollView>
    );
  }

  onPressTabButton(index) {
    if (index == 0) {
      Actions.refresh({title: this.state.title, address: this.props.address});
    } else {
      const {t} = this.props;
      Actions.refresh({title: t('common:screen.qrBarCode.scanTitle')});
    }
    this.setState({index: index});
  }

  render() {
    const {index, title} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.contentView}>
          {index == 0
            ? this.props.address
              ? this.renderOnlyQRCode()
              : this.renderMyQRCode()
            : this.renderQRCodeScanner()}
        </View>
        <View style={styles.bottomView}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => this.onPressTabButton(0)}
            activeOpacity={1}>
            <Icon
              name="barcode-scan"
              size={20}
              color={index == 0 ? global.DEFAULT_COLOR : '#000'}
            />
            <Text
              style={[
                styles.titleBottomButton,
                index == 0 ? {color: global.DEFAULT_COLOR} : {color: '#000'},
              ]}>
              {title}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => this.onPressTabButton(1)}
            activeOpacity={1}>
            <Icon
              name="qrcode-scan"
              size={20}
              color={index == 1 ? global.DEFAULT_COLOR : '#000'}
            />
            <Text
              style={[
                styles.titleBottomButton,
                index == 1 ? {color: global.DEFAULT_COLOR} : {color: '#000'},
              ]}>
              Scan QRCode
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  topContent: {
    paddingVertical: 16,
    paddingTop: '50%',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#404040',
    marginLeft: 8,
    paddingHorizontal: 15,
  },
  contentView: {
    height: Util.size.height - 49 - global.NAV_HEIGHT,
  },
  myQRCodeContainer: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  bottomView: {
    backgroundColor: '#fff',
    position: 'absolute',
    height: BOTTOM_HEIGHT,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingVertical: 15,
    borderTopWidth: 0.5,
    borderColor: '#eee',
  },
  bottomButton: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  titleBottomButton: {
    color: '#000',
    fontSize: 14,
    marginTop: 2,
  },
  headerText: {
    fontSize: 15,
    color: '#000',
    marginTop: 20,
    marginLeft: 30,
    marginRight: 20,
  },
  qrCodeView: {
    marginTop: 0,
    width: appConfig.device.width / 3,
    height: appConfig.device.width / 3,
    alignSelf: 'center',
  },
  barcodeText: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  descText: {
    fontSize: 14,
    color: '#000',
    marginTop: 20,
    marginLeft: 70,
    marginRight: 70,
  },
  addressText: {
    fontSize: 16,
    color: '#000',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  poweredText: {
    fontSize: 14,
    color: '#000',
    bottom: 20,
    textAlign: 'center',
  },
  addressQrCodeView: {
    marginTop: 0,
    marginBottom: 20,
    width: appConfig.device.width / 1.5,
    height: appConfig.device.width / 1.5,
    alignSelf: 'center',
  },
});

export default withTranslation(['qrBarCode', 'transfer', 'common'])(QRBarCode);
