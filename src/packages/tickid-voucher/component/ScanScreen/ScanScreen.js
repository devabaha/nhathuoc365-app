import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Text} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
// import Button from 'react-native-button';
import config from '../../config';
import LoadingComponent from '@tickid/tickid-rn-loading';
import QRScanner from '../../../../components/QRBarCode/QRScanner';
import Button from '../../../../components/Button';

class ScanScreen extends Component {
  state = {
    permissionCameraGranted: false,
  };

  handleCameraPermission = (permissionCameraGranted) => {
    this.setState({permissionCameraGranted});
  };

  onReadedCode = (event) => {
    this.props.onReadedCode(event.data);
  }

  renderBottomContent = () => {
    return (
      <Button
        containerStyle={styles.enterCodeBtn}
        onPress={this.props.onPressEnterCode}
        title={this.props.t('scan.enterCode')}
      />
    );
  };

  renderTopContent = () => {
    return (
      <View style={styles.topContent}>
        <Text style={styles.topContentText}>{this.props.topContentText}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.wrapper}>
        {this.props.showLoading && <LoadingComponent loading />}
        <QRScanner
          onRead={this.onReadedCode}
          onChangePermission={this.handleCameraPermission}
        />
        {this.state.permissionCameraGranted && this.renderTopContent()}
        {this.renderBottomContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginBottom: config.device.bottomSpace,
  },
  containerStyle: {
    backgroundColor: config.colors.sceneBackground,
    flex: 1,
  },
  topContent: {
    position: 'absolute',
    top: 0,
    padding: 16,
    paddingHorizontal: '20%',
    width: '100%',
  },
  topContentText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
    lineHeight: 22,
    textAlign: 'center',
  },
  enterCodeBtn: {
    position: 'absolute',
    bottom: 0,
  },
});

const defaultListener = () => {};

ScanScreen.propTypes = {
  onPressEnterCode: PropTypes.func,
  onReadedCode: PropTypes.func,
  showLoading: PropTypes.bool,
  topContentText: PropTypes.string,
};

ScanScreen.defaultProps = {
  onPressEnterCode: defaultListener,
  onReadedCode: defaultListener,
  showLoading: false,
  topContentText: '',
};

export default ScanScreen;
