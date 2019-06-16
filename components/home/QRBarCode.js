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

const timer = require("react-native-timer");

export default class QRBarCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: props.index || 0,
      loading: false,
      barcode: "000 000 000 000"
    };
  }

  componentWillMount() {
    this._getData();
    this.setTimmer()
  }

  setTimmer() {
    timer.setTimeout(
      this,
      "hide",
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
    console.log(response)
    if (response && response.status == STATUS_SUCCESS) {
      this.setState({ barcode: response.data.barcode})
    }
  }

  renderQRCodeScanner() {
    return (
      <QRCodeScanner
        checkAndroid6Permissions={true}
        onRead={(e) => {
          var text_result = e.data;
          if (text_result) {

            if (isURL(text_result)) {
              return Actions.webview({
                title: text_result,
                url: text_result,
                type: ActionConst.REPLACE
              });
            } else {
              if (this.props.onBackHandler) {
                  Actions.pop();
              }
              setTimeout(() => {
                if (this.props.onBackHandler) {
                  this.props.onBackHandler(e.data);
                } else {
                  //search
                  Actions.search({
                    qr_code: e.data,
                  });
                  // Actions.search_store({
                  //   site_code: e.data,
                  //   type: ActionConst.REPLACE
                  // });
                }
              }, 450);
            }

          }
        }}
        topContent={(
          <View style={styles.topContent}>
            <Text style={styles.centerText}>
              <Icon name="camera-party-mode" size={16} color="#404040" />
              {" Hướng máy ảnh của bạn về phía mã QR Code để khám phá"}
            </Text>
          </View>
        )}
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
            width="1"
            background='transparent'/>
        </View>
        <Text style={styles.barcodeText}>
          {barcode}
        </Text>
        <View style={styles.qrCodeView}>
          <QRCode
          style={{ flex: 1 }}
            value={barcode}
            size={Util.size.width/3}
            logoBackgroundColor='transparent'
          />
        </View>
        <Text style={[styles.barcodeText, {fontSize: 16}]}>
          <Icon name="reload" size={16} color="#000"/>
          Tự động cập nhật sau 60 giây
        </Text>
        <Text style={styles.descText}>
          ●  Đây là mã vạch đại diện cho tài khoản của bạn
        </Text>
        <Text style={styles.descText}>
          ●  Sử dụng mã vạch này để nhận hoàn tiền từ cửa hàng
        </Text>
      </ScrollView>
    );
  }

  onPressTabButton(index) {
    if (index == 0) {
      Actions.refresh({ title: "Mã tài khoản"});
    } else {
      Actions.refresh({ title: "Scan QRCode"});
    }
    this.setState({ index: index });
  }

  render() {
    const { index } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.contentView}>
          {index == 0 ? 
            this.renderMyQRCode():
            this.renderQRCodeScanner()}
        </View>
        <View style={styles.bottomView}>
          <View style={styles.lineView}/>
          <TouchableOpacity style={styles.bottomButton}
            onPress={() => this.onPressTabButton(0)}
            activeOpacity={1}>
              <Icon name='barcode-scan'
                size={20} 
                color={index==0 ? global.DEFAULT_COLOR : "#000"} />
              <Text style={[styles.titleBottomButton,
                index==0 ? {color: global.DEFAULT_COLOR}: {color: '#000'}]}>
                Mã tài khoản
              </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton}
            onPress={() => this.onPressTabButton(1)}
            activeOpacity={1}>
              <Icon name="qrcode-scan" 
                size={20} 
                color={index==1 ? global.DEFAULT_COLOR : "#000"} />
              <Text style={[styles.titleBottomButton,
                index==1 ? {color: global.DEFAULT_COLOR}: {color: '#000'}]}>
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
    ...MARGIN_SCREEN,
    marginBottom: 0,
    width: '100%'
  },
  topContent: {
    width: Util.size.width,
    paddingVertical: 16,
    backgroundColor: "#cccccc"
  },
  centerText: {
    lineHeight: 20,
    fontSize: 16,
    color: "#404040",
    marginLeft: 8,
    paddingHorizontal: 15
  },
  contentView: {
    height: Util.size.height - 49 - global.NAV_HEIGHT
  },
  bottomView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 49,
    flexDirection: 'row'
  },
  lineView: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: 'gray',
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
    width: Util.size.width/3,
    height: Util.size.width/3,
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
  }
});
