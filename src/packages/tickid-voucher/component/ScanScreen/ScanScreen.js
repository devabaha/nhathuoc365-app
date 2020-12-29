import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Button from 'react-native-button';
import config from '../../config';
import LoadingComponent from '@tickid/tickid-rn-loading';

function ScanScreen(props) {
  const { t } = useTranslation('voucher');
  const renderBottomContent = () => {
    return (
      <Button
        containerStyle={styles.enterCodeBtn}
        onPress={props.onPressEnterCode}
      >
        <Text style={styles.enterCodeBtnTitle}>{t('scan.enterCode')}</Text>
      </Button>
    );
  };

  const renderTopContent = () => {
    return (
      <View style={styles.topContent}>
        <Text style={styles.topContentText}>{props.topContentText}</Text>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      {props.showLoading && <LoadingComponent loading />}

      <QRCodeScanner
        onRead={event => props.onReadedCode(event.data)}
        containerStyle={styles.containerStyle}
        cameraStyle={styles.cameraStyle}
        topContent={renderTopContent()}
        bottomContent={renderBottomContent()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginBottom: config.device.bottomSpace
  },
  containerStyle: {
    backgroundColor: config.colors.sceneBackground,
    flex: 1
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

const defaultListener = () => {};

ScanScreen.propTypes = {
  onPressEnterCode: PropTypes.func,
  onReadedCode: PropTypes.func,
  showLoading: PropTypes.bool,
  topContentText: PropTypes.string
};

ScanScreen.defaultProps = {
  onPressEnterCode: defaultListener,
  onReadedCode: defaultListener,
  showLoading: false,
  topContentText: ''
};

export default ScanScreen;
