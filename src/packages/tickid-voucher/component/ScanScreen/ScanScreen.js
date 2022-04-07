import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import LoadingComponent from '@tickid/tickid-rn-loading';
// configs
import config from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';
import QRScanner from 'src/components/QRBarCode/QRScanner';
import Button from 'src/components/Button';

class ScanScreen extends Component {
  static contextType = ThemeContext;

  state = {
    permissionCameraGranted: false,
  };

  get theme() {
    return getTheme(this);
  }

  handleCameraPermission = (permissionCameraGranted) => {
    this.setState({permissionCameraGranted});
  };

  onReadedCode = (event) => {
    this.props.onReadedCode(event.data);
  };

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
        <Typography
          type={TypographyType.LABEL_MEDIUM}
          style={this.topContentTextStyle}>
          {this.props.topContentText}
        </Typography>
      </View>
    );
  };

  get topContentTextStyle() {
    return mergeStyles(styles.topContentText, {color: this.theme.color.white});
  }

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
  topContent: {
    position: 'absolute',
    top: 0,
    padding: 16,
    paddingHorizontal: '20%',
    width: '100%',
  },
  topContentText: {
    fontWeight: '500',
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
