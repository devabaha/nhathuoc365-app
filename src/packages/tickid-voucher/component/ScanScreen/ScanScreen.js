import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Button from 'react-native-button';
import config from '../../config';

const defaultListener = () => {};

ScanScreen.propTypes = {
  onPressEnterCode: PropTypes.func,
  onReadedCode: PropTypes.func
};

ScanScreen.defaultProps = {
  onPressEnterCode: defaultListener,
  onReadedCode: defaultListener
};

function ScanScreen(props) {
  const renderBottomContent = () => {
    return (
      <Button
        containerStyle={styles.enterCodeBtn}
        onPress={props.onPressEnterCode}
      >
        <Text style={styles.enterCodeBtnTitle}>Nhập mã</Text>
      </Button>
    );
  };

  const renderTopContent = () => {
    return (
      <View style={styles.topContent}>
        <Text style={styles.topContentText}>
          Hướng máy ảnh của bạn về phía mã QR Code để sử dụng voucher
        </Text>
      </View>
    );
  };

  return (
    <QRCodeScanner
      onRead={event => props.onReadedCode(event.data)}
      containerStyle={styles.containerStyle}
      cameraStyle={styles.cameraStyle}
      topContent={renderTopContent()}
      bottomContent={renderBottomContent()}
    />
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: '#f1f1f1'
  },
  topContent: {
    padding: 16
  },
  topContentText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    lineHeight: 22
  },
  enterCodeBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    backgroundColor: config.colors.white,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ebebeb'
  },
  enterCodeBtnTitle: {
    fontSize: 16,
    color: config.colors.black
  }
});

export default ScanScreen;
