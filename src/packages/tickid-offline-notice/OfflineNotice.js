import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Image } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import i18n from 'packages/ziperp-i18n';
import appConfig from 'app-config';
import Button from 'react-native-button';
import { getImageRatio } from 'packages/ziperp-util';
import layoutAnimation from 'packages/ziperp-layout-animation';
import { actions as loadingActions } from 'packages/ziperp-loading';

const connector = connect(
  null,
  {
    showLoading: loadingActions.showLoading,
    hideLoading: loadingActions.hideLoading
  }
);

class OfflineNotice extends PureComponent {
  static propTypes = {
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired
  };

  state = {
    isConnected: true
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange
    );
  }

  handleConnectivityChange = isConnected => {
    layoutAnimation();
    this.setState({ isConnected });
  };

  trying;
  handleRetry = () => {
    if (this.trying) return;
    this.trying = true;

    this.props.showLoading();

    const threeSeconds = 3000;
    setTimeout(() => {
      this.props.hideLoading();
      this.trying = false;
    }, threeSeconds);

    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({ isConnected });
    });
  };

  render() {
    if (!this.state.isConnected) {
      return (
        <View style={styles.container}>
          <Image
            style={styles.noInternetImage}
            source={require('./assets/images/no-internet.png')}
          />

          <Text style={styles.heading}>{i18n.t('offlineNotice.heading')}</Text>
          <Text style={styles.description}>
            {i18n.t('offlineNotice.description')}
          </Text>

          <Button
            onPress={this.handleRetry}
            containerStyle={styles.retryBtn}
            style={styles.retryBtnText}
          >
            {i18n.t('offlineNotice.retry')}
          </Button>
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noInternetImage: {
    ...getImageRatio(1200, 600, appConfig.device.width)
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 50,
    color: appConfig.colors.black
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
    color: appConfig.colors.text,
    paddingHorizontal: 40
  },
  retryBtn: {
    backgroundColor: '#1eb1ec',
    marginTop: 32,
    paddingVertical: 10,
    paddingHorizontal: 48,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#999'
  },
  retryBtnText: {
    color: appConfig.colors.white
  }
});

export default connector(OfflineNotice);
