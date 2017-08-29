/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

// library
import QRCodeScanner from 'react-native-qrcode-scanner';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

export default class ScanQRCode extends Component {
  render() {
    return (
      <View style={styles.container}>
        <QRCodeScanner
          onRead={(e) => {
            if (e.data) {
              setTimeout(() => {
                Actions.search_store({
                  site_code: e.data,
                  type: ActionConst.REPLACE
                });
              }, 450);
            }
          }}
          topContent={(
            <View style={styles.topContent}>
              <Icon style={{marginTop: 2}} name="qrcode" size={24} color="#404040" />
              <Text style={styles.centerText}>Hướng máy ảnh của bạn về phía mã QR Code để thêm Cửa hàng</Text>
            </View>
          )}
        />
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
    paddingHorizontal: 25,
    paddingVertical: 16,
    flexDirection: 'row',
    backgroundColor: "#cccccc"
  },
  centerText: {
    lineHeight: 20,
    fontSize: 16,
    color: "#404040",
    marginLeft: 8
  }
});
