import React, {Component} from 'react';
import {StyleSheet, View, Animated, Easing} from 'react-native';
// 3-party libs
import {default as NetInfo} from '@react-native-community/netinfo';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {
  BundleIconSetName,
  ButtonRoundedType,
  TypographyType,
} from 'src/components/base';
import {LIVE_API_DOMAIN} from '../../network/API/BaseAPI';
// custom components
import DomainWatermark from './DomainWatermark';
import {
  AppFilledButton,
  Typography,
  Icon,
  Container,
} from 'src/components/base';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    zIndex: 9999999,
    top: 0,
    position: 'absolute',
  },
  container: {
    zIndex: 1,
    flex: 1,
    paddingTop: appConfig.device.isIOS ? appConfig.device.statusBarHeight : 7,
  },
  iconContainer: {
    marginRight: 15,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 26,
  },
  mainContent: {
    padding: 10,
    flexDirection: 'row',
  },
  messageContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  description: {
    marginTop: 3,
    fontStyle: 'italic',
  },
  btnContainer: {
    marginLeft: 15,
    alignSelf: 'center',
    overflow: 'hidden',

    padding: 7,
    paddingHorizontal: 10,
  },

  devServerWaterMarkWrapper: {
    zIndex: 9999999,
    top: 0,
    right: 0,
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class NetworkInfo extends Component {
  static contextType = ThemeContext;

  state = {
    isConnected: true,
    visible: false,
    visibleMainContent: true,
  };
  unsubscribe = () => {};
  animatedTranslateY = new Animated.Value(-100);
  animatedMainContentTranslateY = new Animated.Value(0);

  get theme() {
    return getTheme(this);
  }

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
      return this.theme.color.danger;
    } else if (this.state.isWeakConnection) {
      return this.theme.color.warning;
    } else {
      return this.theme.color.black;
    }
  }

  get icon() {
    if (!this.state.isConnected) {
      return (
        <Icon
          bundle={BundleIconSetName.FEATHER}
          name="wifi-off"
          style={[styles.icon, this.iconStyle]}
        />
      );
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
        finished &&
          this.setState({
            visible: nextState.visible,
            visibleMainContent: nextState.visible,
          });
      });
      return true;
    }

    if (nextState.visibleMainContent !== this.state.visibleMainContent) {
      Animated.timing(this.animatedMainContentTranslateY, {
        toValue: nextState.visibleMainContent ? 0 : -100,
        duration: 300,
        easing: Easing.quad,
        useNativeDriver: true,
      }).start(({finished}) => {
        finished &&
          this.setState({visibleMainContent: nextState.visibleMainContent});
      });
      return true;
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
    this.setState({visibleMainContent: false});
  }

  renderDevServerModeWaterMark() {
    const isLiveServer = store.baseDomains[0] === LIVE_API_DOMAIN;
    let domains = [...store.baseDomains];
    if (!isLiveServer) {
      return <DomainWatermark domains={domains} />;
    }

    return null;
  }

  get iconStyle() {
    return {
      color: this.theme.color.primary,
    };
  }

  render() {
    const extraStyle = {
      transform: [{translateY: this.animatedTranslateY}],
    };
    const extraMainContentStyle = {
      transform: [{translateY: this.animatedMainContentTranslateY}],
    };
    return (
      <>
        <Animated.View style={[styles.wrapper, extraStyle]}>
          <View
            style={[
              styles.container,
              {
                backgroundColor: this.backgroundColor,
              },
            ]}
          />
          <Container
            shadow
            animated
            style={[styles.mainContent, extraMainContentStyle]}>
            <View style={styles.iconContainer}>{this.icon}</View>
            <View style={styles.messageContainer}>
              <Typography
                type={TypographyType.LABEL_MEDIUM}
                style={styles.title}>
                {this.title}
              </Typography>
              <Typography
                type={TypographyType.DESCRIPTION_SMALL_TERTIARY}
                style={styles.description}>
                {this.message}
              </Typography>
            </View>

            <AppFilledButton
              rounded={ButtonRoundedType.EXTRA_SMALL}
              style={styles.btnContainer}
              onPress={this.onOk.bind(this)}>
              {this.props.t('ok')}
            </AppFilledButton>
          </Container>
        </Animated.View>
        {this.renderDevServerModeWaterMark()}
      </>
    );
  }
}

export default withTranslation()(observer(NetworkInfo));
