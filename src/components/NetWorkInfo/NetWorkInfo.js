import React, { Component } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native';
import { default as NetInfo } from '@react-native-community/netinfo';
import SVGNoWifi from '../../images/no_wifi.svg';
import SVGLowWifi from '../../images/low_wifi.svg';
import appConfig from 'app-config';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    zIndex: 9999999,
    top: 0,
    position: 'absolute'
  },
  androidDivider: {
    height: 3
  },
  container: {
    flex: 1
  },
  iconContainer: {
    width: 40,
    marginRight: 15
  },
  mainContent: {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    ...elevationShadowStyle(3)
  },
  messageContainer: {
    flex: 1
  },
  title: {
    fontWeight: 'bold',
    color: '#333'
  },
  description: {
    fontSize: 12,
    color: '#444',
    marginTop: 3,
    fontStyle: 'italic'
  },
  btn: {
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: appConfig.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginLeft: 15
  },
  btnText: {
    color: '#fff'
  }
});

class NetWorkInfo extends Component {
  state = {
    isConnected: true,
    isWeakConnection: false,
    visible: false
  };
  unsubscribe = () => {};
  animatedTranslateY = new Animated.Value(-100);

  get title() {
    const { t } = this.props;
    if (!this.state.isConnected) {
      return t('networkInfo.notConnected.title');
    } else if (this.state.isWeakConnection) {
      return t('networkInfo.weakConnection.title');
    } else {
      return '';
    }
  }

  get message() {
    const { t } = this.props;
    if (!this.state.isConnected) {
      return t('networkInfo.notConnected.message');
    } else if (this.state.isWeakConnection) {
      return t('networkInfo.weakConnection.message');
    } else {
      return '';
    }
  }

  get backgroundColor() {
    if (!this.state.isConnected) {
      return '#ff4d4f';
    } else if (this.state.isWeakConnection) {
      return '#e8a84a';
    } else {
      return '#000';
    }
  }

  get icon() {
    if (!this.state.isConnected) {
      return <SVGNoWifi width="100%" height="100%" />;
    } else if (this.state.isWeakConnection) {
      return <SVGLowWifi width="100%" height="100%" />;
    } else {
      return null;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.visible !== this.state.visible) {
      Animated.timing(this.animatedTranslateY, {
        toValue: nextState.visible ? 0 : -100,
        duration: 300,
        easing: Easing.quad,
        useNativeDriver: true
      }).start(({ finished }) => {
        finished && this.setState({ visible: nextState.visible });
      });
      return false;
    }

    return true;
  }

  componentDidMount() {
    setTimeout(() => {
      this.unsubscribe = NetInfo.addEventListener(
        this.handleNetWorkState.bind(this)
      );
    }, 3000);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleNetWorkState(state) {
    let isWeakConnection = false;
    const { details, isConnected } = state;
    if (details) {
      isWeakConnection = !!details.isConnectionExpensive;
    }
    const visible = !!!isConnected || !!isWeakConnection;

    this.setState({ visible, isConnected, isWeakConnection });
  }

  onOk() {
    this.setState({ visible: false });
  }

  render() {
    const extraStyle = {
      transform: [{ translateY: this.animatedTranslateY }]
    };
    return (
      this.state.visible && (
        <Animated.View style={[styles.wrapper, extraStyle]}>
          <SafeAreaView
            style={[
              styles.container,
              {
                backgroundColor: this.backgroundColor
              }
            ]}
          >
            {appConfig.device.isAndroid && (
              <View
                style={[
                  styles.androidDivider,
                  {
                    backgroundColor: this.backgroundColor
                  }
                ]}
              />
            )}
            <View style={styles.mainContent}>
              <View style={styles.iconContainer}>{this.icon}</View>
              <View style={styles.messageContainer}>
                <Text style={styles.title}>{this.title}</Text>
                <Text style={styles.description}>{this.message}</Text>
              </View>
              <TouchableOpacity
                style={styles.btn}
                onPress={this.onOk.bind(this)}
              >
                <Text style={styles.btnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      )
    );
  }
}

export default withTranslation()(NetWorkInfo);
