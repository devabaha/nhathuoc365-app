/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';

// library
import QRCodeScanner from 'react-native-qrcode-scanner';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Actions, ActionConst } from 'react-native-router-flux';
import QRCode from 'react-native-qrcode-svg';
import Barcode from 'react-native-barcode-builder';
import store from '../../store/Store';

const timer = require('react-native-timer');

export default class QRBarCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: props.index || 0,
      wallet: props.wallet || false,
      loading: false,
      from: props.from || false,
      barcode: props.address || '0x000000000',
      title: props.title ? props.title : 'Mã tài khoản',
      content: props.content
        ? props.content
        : 'Dùng QRCode địa chỉ Ví để nhận chuyển khoản'
    };
  }

  componentWillMount() {
    if (!this.props.address) {
      this._getData();
      this.setTimmer();
    }
  }

  componentWillUnmount() {
    timer.clearTimeout(this, 'barcodeupdate');
  }

  setTimmer() {
    timer.setTimeout(
      this,
      'barcodeupdate',
      () => {
        this._getData();
        this.setTimmer();
      },
      5000
    );
  }

  async _getData() {
    this.setState({ loading: true });
    const response = await APIHandler.user_barcode(store.store_id);
    console.log(response);
    if (response && response.status == STATUS_SUCCESS) {
      this.setState({ barcode: response.data.barcode });
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
        loading: true
      },
      async () => {
        try {
          var response = await APIHandler.getAPI(link);
          if (response && response.status == STATUS_SUCCESS) {
            action(() => {
              this.setState(
                {
                  loading: false
                },
                () => {
                  setTimeout(() => {
                    this._proccessQRCodeResult(response.data.barcode);
                  }, 450);
                }
              );
            })();
          } else {
            action(() => {
              this.setState(
                {
                  loading: false
                },
                () => {
                  this._open_webview(link);
                }
              );
            })();
          }
        } catch (e) {
          action(() => {
            this.setState(
              {
                loading: false
              },
              () => {
                this._open_webview(link);
              }
            );
          })();
        } finally {
          this.setState({
            loading: false
          });
        }
      }
    );
  }

  /***
   * Lay tai khoan tu Ma Tai khoan
   */
  _getAccountByBarcode(barcode) {
    //, password, refer
    this.setState(
      {
        loading: true
      },
      async () => {
        try {
          var response = await APIHandler.user_from_barcode(barcode);
          if (response && response.status == STATUS_SUCCESS) {
            action(() => {
              this.setState(
                {
                  loading: false
                },
                () => {
                  Actions.pay_account({
                    title: 'Thông tin tài khoản',
                    barcode: barcode,
                    wallet: response.data.account.default_wallet,
                    account: response.data.account,
                    app: response.data.app,
                    type: ActionConst.REPLACE
                  });
                  Toast.show(response.message, Toast.SHORT);
                }
              );
            })();
          } else {
            this._search_store(barcode);
          }
        } catch (e) {
          this.setState({
            loading: false
          });
        } finally {
          this.setState({
            loading: false
          });
        }
      }
    );
  }

  /***
   * Lay cart
   */
  _getWalletByAddressAndZoneCode(barcode) {
    //,
    this.setState(
      {
        loading: true
      },
      async () => {
        try {
          var data = isWalletAddressWithZoneCode(barcode);
          var response = await APIHandler.user_get_wallet(data[1]);
          if (
            response &&
            response.data.wallet &&
            response.status == STATUS_SUCCESS
          ) {
            action(() => {
              this.setState(
                {
                  loading: false
                },
                () => {
                  Actions.pay_wallet({
                    title: 'Chuyển khoản',
                    wallet: response.data.wallet,
                    address: data[0],
                    type: ActionConst.REPLACE
                  });
                  // Toast.show(response.message, Toast.SHORT);
                }
              );
            })();
          } else {
            this._search_store(barcode);
          }
        } catch (e) {
          this._search_store(barcode);
        } finally {
        }
      }
    );
  }

  // tới màn hình store
  _goStores(item, category_id) {
    action(() => {
      store.setStoreData(item);
    })();

    // hide tutorial go store
    if (this.props.that) {
      this.props.that.setState({
        show_go_store: false
      });
    }

    Actions.stores({
      title: item.name,
      goCategory: category_id,
      type: ActionConst.REPLACE
    });
  }
  _goProduct(item) {
    Actions.item({
      title: item.name,
      item,
      type: ActionConst.REPLACE
    });
  }

  _goNewsDetail(item) {
    Actions.notify_item({
      title: item.title,
      data: item,
      type: ActionConst.REPLACE
    });
  }

  /***
   * Lay cart
   */
  _check_address(barcode) {
    //,
    this.setState(
      {
        loading: true
      },
      async () => {
        try {
          var response = await APIHandler.user_check_address(barcode);
          if (response && response.status == STATUS_SUCCESS) {
            action(() => {
              this.setState(
                {
                  loading: false
                },
                () => {
                  if (response.data.object.type == OBJECT_TYPE_KEY_USER) {
                    Actions.pay_wallet({
                      title: 'Chuyển khoản',
                      wallet: this.state.wallet,
                      address: barcode,
                      type: ActionConst.REPLACE
                    });
                  } else if (
                    response.data.object.type == OBJECT_TYPE_KEY_ADDRESS
                  ) {
                    this._goStores(response.data.item);
                  } else if (
                    response.data.object.type == OBJECT_TYPE_KEY_SITE
                  ) {
                    this._goStores(response.data.item);
                  } else if (
                    response.data.object.type ==
                    OBJECT_TYPE_KEY_PRODUCT_CATEGORY
                  ) {
                    this._goStores(
                      response.data.item,
                      response.data.item.site_product_category_id
                    );
                  } else if (
                    response.data.object.type == OBJECT_TYPE_KEY_PRODUCT
                  ) {
                    this._goProduct(response.data.item);
                  } else if (
                    response.data.object.type == OBJECT_TYPE_KEY_NEWS
                  ) {
                    this._goNewsDetail(response.data.item);
                  } else if (
                    response.data.object.type == OBJECT_TYPE_KEY_CART
                  ) {
                    Actions.view_orders_item({
                      data: response.data.item,
                      title: '#' + response.data.item.cart_code,
                      type: ActionConst.REPLACE
                    });
                  } else {
                    this._search_store(barcode);
                  }
                  // Toast.show(response.message, Toast.SHORT);
                }
              );
            })();
          } else {
            this._search_store(barcode);
          }
        } catch (e) {
          this._search_store(barcode);
        } finally {
        }
      }
    );
  }

  /***
   * Lay cart
   */
  _getCartByCartcode(barcode) {
    //,
    this.setState(
      {
        loading: true
      },
      async () => {
        try {
          var response = await APIHandler.user_cart_code(barcode);
          if (response && response.status == STATUS_SUCCESS) {
            action(() => {
              this.setState(
                {
                  loading: false
                },
                () => {
                  Actions.view_orders_item({
                    data: response.data,
                    title: '#' + barcode,
                    tel: response.data.tel,
                    type: ActionConst.REPLACE
                  });
                  // Toast.show(response.message, Toast.SHORT);
                }
              );
            })();
          } else {
            this._search_store(barcode);
          }
        } catch (e) {
          this._search_store(barcode);
        } finally {
        }
      }
    );
  }

  _search_store(barcode) {
    action(() => {
      this.setState(
        {
          loading: false
        },
        () => {
          Actions.search_store({
            site_code: barcode,
            type: ActionConst.REPLACE
          });
        }
      );
    })();
  }

  _open_webview(link) {
    Actions.webview({
      title: link,
      url: link,
      type: ActionConst.REPLACE
    });
  }

  _proccessQRCodeResult(text_result) {
    const { wallet, title, from } = this.state;
    if (text_result) {
      if (isURL(text_result)) {
        if (isLinkTickID(text_result)) {
          this._getSearchCodeByLink(text_result);
        } else {
          this._open_webview(text_result);
        }
      } else if (isWalletAddress(text_result)) {
        if (from == 'vndwallet') {
          Actions.pay_wallet({
            title: 'Chuyển khoản',
            wallet: wallet,
            address: text_result,
            type: ActionConst.REPLACE
          });
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
        this._search_store(text_result);
      }
    }
  }

  renderQRCodeScanner(text_result) {
    const { wallet, title } = this.state;
    return (
      <QRCodeScanner
        checkAndroid6Permissions={true}
        ref={node => {
          this.scanner = node;
        }}
        onRead={e => {
          this._proccessQRCodeResult(e.data);
        }}
        topContent={
          <View style={styles.topContent}>
            <Text style={styles.centerText}>
              <Icon name="camera-party-mode" size={16} color="#404040" />
              {' Hướng máy ảnh của bạn về phía mã QR Code để khám phá'}
            </Text>
          </View>
        }
      />
    );
  }

  renderMyQRCode() {
    const { barcode } = this.state;
    return (
      <ScrollView style={{ flex: 1 }}>
        <Text style={styles.headerText}>
          Đưa mã QRCode cho thu ngân để tích điểm
        </Text>
        <View style={{ marginLeft: 30, marginRight: 30 }}>
          <Barcode
            value={barcode}
            format="CODE128"
            width={1}
            height={80}
            background="transparent"
          />
        </View>
        <Text style={styles.barcodeText}>{barcode}</Text>
        <View style={styles.qrCodeView}>
          <QRCode
            style={{ flex: 1 }}
            value={barcode}
            size={Util.size.width / 3}
            logoBackgroundColor="transparent"
          />
        </View>
        <Text style={[styles.barcodeText, { fontSize: 16 }]}>
          <Icon name="reload" size={16} color="#000" />
          Tự động cập nhật sau 60 giây
        </Text>
        <Text style={styles.descText}>
          ● Đây là mã vạch đại diện cho tài khoản của bạn
        </Text>
        <Text style={styles.descText}>
          ● Sử dụng mã vạch này để nhận hoàn tiền từ cửa hàng
        </Text>
      </ScrollView>
    );
  }

  renderOnlyQRCode() {
    const { barcode, content } = this.state;
    return (
      <ScrollView style={{ flex: 1 }}>
        <Text style={styles.addressText}>{barcode}</Text>
        <View style={styles.addressQrCodeView}>
          <QRCode
            style={{ flex: 1 }}
            value={barcode}
            size={Util.size.width / 1.5}
            logoBackgroundColor="transparent"
          />
        </View>
        <Text style={styles.addressText}>● {content}</Text>
      </ScrollView>
    );
  }

  onPressTabButton(index) {
    if (index == 0) {
      Actions.refresh({ title: this.state.title, address: this.props.address });
    } else {
      Actions.refresh({ title: 'Scan QRCode' });
    }
    this.setState({ index: index });
  }

  render() {
    const { index, title } = this.state;
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
          <View style={styles.lineView} />
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => this.onPressTabButton(0)}
            activeOpacity={1}
          >
            <Icon
              name="barcode-scan"
              size={20}
              color={index == 0 ? global.DEFAULT_COLOR : '#000'}
            />
            <Text
              style={[
                styles.titleBottomButton,
                index == 0 ? { color: global.DEFAULT_COLOR } : { color: '#000' }
              ]}
            >
              {title}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => this.onPressTabButton(1)}
            activeOpacity={1}
          >
            <Icon
              name="qrcode-scan"
              size={20}
              color={index == 1 ? global.DEFAULT_COLOR : '#000'}
            />
            <Text
              style={[
                styles.titleBottomButton,
                index == 1 ? { color: global.DEFAULT_COLOR } : { color: '#000' }
              ]}
            >
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
    width: '100%'
  },
  topContent: {
    width: Util.size.width,
    paddingVertical: 16,
    backgroundColor: '#cccccc'
  },
  centerText: {
    lineHeight: 20,
    fontSize: 16,
    color: '#404040',
    marginLeft: 8,
    paddingHorizontal: 15
  },
  contentView: {
    height: Util.size.height - 49 - global.NAV_HEIGHT
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 49,
    flexDirection: 'row'
  },
  lineView: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: 'gray'
  },
  bottomButton: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center'
  },
  titleBottomButton: {
    color: '#000',
    fontSize: 14
  },
  headerText: {
    fontSize: 15,
    color: '#000',
    marginTop: 20,
    marginLeft: 30,
    marginRight: 20
  },
  qrCodeView: {
    marginTop: 0,
    width: Util.size.width / 3,
    height: Util.size.width / 3,
    alignSelf: 'center'
  },
  barcodeText: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20
  },
  descText: {
    fontSize: 14,
    color: '#000',
    marginTop: 20,
    marginLeft: 70,
    marginRight: 70
  },
  addressText: {
    fontSize: 16,
    color: '#000',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  poweredText: {
    fontSize: 14,
    color: '#000',
    bottom: 20,
    textAlign: 'center'
  },
  addressQrCodeView: {
    marginTop: 0,
    marginBottom: 20,
    width: Util.size.width / 1.5,
    height: Util.size.width / 1.5,
    alignSelf: 'center'
  }
});
