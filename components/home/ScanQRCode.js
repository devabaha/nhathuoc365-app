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
                    Actions.search_store({
                      site_code: e.data,
                      type: ActionConst.REPLACE
                    });
                  }
                }, 450);
              }

            }
          }}
          topContent={(
            <View style={styles.topContent}>
              <Text style={styles.centerText}>
                <Icon name="info-circle" size={16} color="#404040" />
                {" Hướng máy ảnh của bạn về phía mã QR Code để thêm Cửa hàng"}
              </Text>
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
  }
});
