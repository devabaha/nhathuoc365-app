import React, {Component} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import {default as NetInfo} from '@react-native-community/netinfo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import appConfig from 'app-config';
import store from '../../store';
import {ORIGIN_API_DOMAIN} from '../../network/API/BaseAPI';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    zIndex: 9999999,
    top: 0,
    position: 'absolute',
  },
  androidDivider: {
    height: 3,
  },
  container: {
    flex: 1,
  },
  iconContainer: {
    marginRight: 15,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 26,
    color: appConfig.colors.primary,
  },
  mainContent: {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    ...elevationShadowStyle(3),
  },
  messageContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 12,
    color: '#444',
    marginTop: 3,
    fontStyle: 'italic',
  },
  btnContainer: {
    marginLeft: 15,
    borderRadius: 4,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  btn: {
    padding: 7,
    paddingHorizontal: 10,
    backgroundColor: appConfig.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
  },

  devServerWaterMarkWrapper: {
    zIndex: 9999999,
    top: 0,
    right: 0,
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  devServerWaterMarkContainer: {
    backgroundColor: 'rgba(0,0,0,1)',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 10,
    opacity: 0.2,
  },
  devServerWaterMarkLabel: {
    letterSpacing: 3,
    fontWeight: 'bold',
    // fontFamily: 'SairaStencilOne-Regular',
    color: '#fff',
    textAlign: 'center',
    fontSize: 8,
    textTransform: 'uppercase'
  },
});

class NetWorkInfo extends Component {
  state = {
    isConnected: true,
    visible: false,
  };
  unsubscribe = () => {};
  animatedTranslateY = new Animated.Value(-100);

  get title() {
    const {t} = this.props;
    if (!this.state.isConnected) {
      return t('networkInfo.notConnected.title');
    } else if (this.state.isWeakConnection) {
      return t('networkInfo.weakConnection.title');
    } else {
      return '';
    }
  }

  get message() {
    const {t} = this.props;
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
      return <FeatherIcon name="wifi-off" style={styles.icon} />;
    } else if (this.state.isWeakConnection) {
      return null;
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
        useNativeDriver: true,
      }).start(({finished}) => {
        finished && this.setState({visible: nextState.visible});
      });
      return false;
    }

    if (nextState !== this.state) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(
      this.handleNetWorkState.bind(this),
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleNetWorkState(state) {
    const {isConnected} = state;
    const visible = !!!isConnected;

    this.setState({visible, isConnected});
  }

  onOk() {
    this.setState({visible: false});
  }

  renderDevServerModeWaterMark() {
    const isLiveServer = store.apiDomain === ORIGIN_API_DOMAIN;
    if (!isLiveServer) {
      return (
        <SafeAreaView pointerEvents="none" style={styles.devServerWaterMarkWrapper}>
          <View style={styles.devServerWaterMarkContainer}>
            <Text style={styles.devServerWaterMarkLabel}>ON DEV SERVER</Text>
          </View>
        </SafeAreaView>
      );
    }

    return null;
  }

  render() {
    const extraStyle = {
      transform: [{translateY: this.animatedTranslateY}],
    };
    return (
      <>
        <Animated.View style={[styles.wrapper, extraStyle]}>
          <SafeAreaView
            style={[
              styles.container,
              {
                backgroundColor: this.backgroundColor,
              },
            ]}>
            {appConfig.device.isAndroid && (
              <View
                style={[
                  styles.androidDivider,
                  {
                    backgroundColor: this.backgroundColor,
                  },
                ]}
              />
            )}
            <View style={styles.mainContent}>
              <View style={styles.iconContainer}>{this.icon}</View>
              <View style={styles.messageContainer}>
                <Text style={styles.title}>{this.title}</Text>
                <Text style={styles.description}>{this.message}</Text>
              </View>
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={this.onOk.bind(this)}>
                  <Text style={styles.btnText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>
        {this.renderDevServerModeWaterMark()}
      </>
    );
  }
}

export default withTranslation()(observer(NetWorkInfo));
