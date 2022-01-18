import React, {Component} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
// 3-party libs
import AsyncStorage from '@react-native-async-storage/async-storage';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// network
import BaseAPI from 'src/network/API/BaseAPI';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
import {rgbaToRgb, hexToRgba} from 'app-helper';
// routing
import {replace} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {LIVE_API_DOMAIN} from 'src/network/API/BaseAPI';
import {languages} from 'src/i18n/constants';
import {THEME_STORAGE_KEY} from 'src/constants';
// custom components
import {Container, ScreenWrapper} from 'src/components/base';
import Image from 'src/components/Image';

class Launch extends Component {
  static contextType = ThemeContext;

  state = {
    animatedBouncing: new Animated.Value(0),
    animatedPressing: new Animated.Value(0),
    animatedSpreading: new Animated.Value(0),
    animatedSpreadingShadow: new Animated.Value(0),
  };

  get theme() {
    return getTheme(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.refreshData) {
      this.handleAuthorization();
    }

    return true;
  }

  componentDidMount() {
    this.loadTheme();
    this.animateLoading();
  }

  loadTheme = async () => {
    try {
      let themeStorage = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (themeStorage) {
        themeStorage = JSON.parse(themeStorage);
        this.context.updateTheme(themeStorage);
      }
    } catch (error) {
      console.log('load_theme', error);
    } finally {
      this.handleAuthorization();
    }
  };

  handleAuthorization = async () => {
    try {
      const response = await APIHandler.user_login({
        fb_access_token: '',
        language: this.props.appLanguage,
        locale: languages[this.props.appLanguage].locale,
      });
      setTimeout(() => {
        this.handleAuthWithResponse(response);
      }, 500);
    } catch (error) {
      console.log(error);
      setTimeout(this.handleAuthorization, 1000);
    }
  };

  handleTestDevice(isTestDevice) {
    if (
      !store.ignoreChangeDomain &&
      isTestDevice &&
      BaseAPI.apiDomain === LIVE_API_DOMAIN
    ) {
      replace(appConfig.routes.domainSelector, {}, this.theme);
      return true;
    }
    return false;
  }

  handleAuthWithResponse = (response) => {
    const user = response.data || {};
    const site = response.other_data?.site || {};
    store.setStoreData(site);

    const {is_test_device} = user;
    const isTestDevice = this.handleTestDevice(is_test_device);

    if (isTestDevice) {
      return;
    }
    // @NOTE: set default name and phone for phone card package
    // phoneCardConfig.defaultContactName = user.name;
    // phoneCardConfig.defaultContactPhone = user.tel;
    switch (response.status) {
      case STATUS_SUCCESS:
        store.setUserInfo(user);
        store.setAnalyticsUser(user);
        replace(appConfig.routes.primaryTabbar, {}, this.theme);
        replace(appConfig.routes.homeTab, {}, this.theme);
        break;
      case STATUS_FILL_INFO_USER:
        store.setUserInfo(user);
        store.setAnalyticsUser(user);
        replace(
          appConfig.routes.op_register,
          {
            name_props: user.name,
            hideBackImage: true,
          },
          this.theme,
        );
        break;
      case STATUS_UNDEFINED_USER:
        replace(
          appConfig.routes.phoneAuth,
          {
            loginMode: user.loginMode ? user.loginMode : 'FIREBASE', //FIREBASE / SMS_BRAND_NAME
          },
          this.theme,
        );
        break;
      case STATUS_SYNC_FLAG:
        store.setUserInfo(user);
        store.setAnalyticsUser(user);
        replace(appConfig.routes.rootGpsStoreLocation, {}, this.theme);
        break;
      default:
        setTimeout(this.handleAuthorization, 1000);
    }
  };

  animateLoading = () => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(this.state.animatedBouncing, {
            toValue: 30,
            easing: Easing.circle,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(this.state.animatedPressing, {
            toValue: 1,
            easing: Easing.bounce,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(this.state.animatedPressing, {
            toValue: 0,
            easing: Easing.in,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(this.state.animatedBouncing, {
            toValue: 60,
            easing: Easing.in,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(this.state.animatedBouncing, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.parallel([
            Animated.timing(this.state.animatedSpreading, {
              toValue: 1,
              easing: Easing.in,
              duration: 600,
              delay: 400,
              useNativeDriver: true,
            }),
            Animated.timing(this.state.animatedSpreadingShadow, {
              toValue: 1,
              easing: Easing.in,
              duration: 600,
              delay: 500,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(this.state.animatedSpreading, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(this.state.animatedSpreadingShadow, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  };

  get leftHalfStyle() {
    return mergeStyles(styles.leftHalf, {
      borderTopColor: rgbaToRgb(
        hexToRgba(this.theme.color.persistPrimary, 0.7),
      ),
    });
  }

  get dotStyle() {
    return mergeStyles(styles.bouncing, {
      backgroundColor: this.theme.color.persistPrimary,
    });
  }

  get spreadingShadowStyle() {
    return mergeStyles(styles.spreadingShadow, {
      backgroundColor: hexToRgba(this.theme.color.persistSecondary, 0.2),
    });
  }

  get spreadingStyle() {
    return mergeStyles(styles.spreading, {
      backgroundColor: this.theme.color.persistSecondary,
    });
  }

  render() {
    return (
      <ScreenWrapper style={styles.container}>
        <Container flex>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../images/btn-cart.png')}
              style={styles.logo}
              resizeMode="contain"
              loadingColor="transparent"
            />
            <View style={styles.animateLoading}>
              <Animated.View
                style={[
                  styles.dot,
                  this.dotStyle,
                  {
                    opacity: this.state.animatedBouncing.interpolate({
                      inputRange: [0, 30, 60],
                      outputRange: [0.6, 1, 0.6],
                    }),
                    transform: [
                      {
                        translateY: this.state.animatedBouncing.interpolate({
                          inputRange: [0, 30, 60],
                          outputRange: [0, 30, 0],
                        }),
                      },
                      {
                        scale: this.state.animatedBouncing.interpolate({
                          inputRange: [0, 30, 60],
                          outputRange: [0.6, 1, 0.6],
                        }),
                      },
                      {
                        scaleX: this.state.animatedPressing.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.3],
                        }),
                      },
                      {
                        scaleY: this.state.animatedPressing.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0.7],
                        }),
                      },
                    ],
                  },
                ]}>
                <Animated.View
                  style={[
                    this.leftHalfStyle,
                    {
                      opacity: this.state.animatedBouncing.interpolate({
                        inputRange: [0, 15, 30, 45, 60],
                        outputRange: [0, 1, 1, 1, 0],
                      }),
                      transform: [
                        {
                          rotate: this.state.animatedBouncing.interpolate({
                            inputRange: [0, 15, 30, 45, 60],
                            outputRange: [
                              '-360deg',
                              '-180deg',
                              '0deg',
                              '180deg',
                              '360deg',
                            ],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              </Animated.View>

              <Animated.View
                style={[
                  this.spreadingShadowStyle,
                  {
                    opacity: this.state.animatedSpreadingShadow.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 1, 0],
                    }),
                  },
                  {
                    transform: [
                      {
                        scaleX: this.state.animatedSpreadingShadow.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 8],
                        }),
                      },
                      {
                        scaleY: this.state.animatedSpreadingShadow.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.6, 1.5],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={[
                  this.spreadingStyle,
                  {
                    opacity: this.state.animatedSpreading.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 1, 0],
                    }),
                    transform: [
                      {
                        scaleX: this.state.animatedSpreading.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 5],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>
        </Container>
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  logoContainer: {
    position: 'absolute',
    top: appConfig.device.height * 0.3,
    alignSelf: 'center',
  },
  logo: {
    width: 200,
    height: 128,
  },
  animateLoading: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftHalf: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    borderRadius: 10,
  },
  dot: {
    borderRadius: 10,
    width: 20,
    height: 20,
    overflow: 'hidden',
  },
  bouncing: {},
  spreadingShadow: {
    top: 55,
    borderRadius: 7.5,
    width: 15,
    height: 15,
    zIndex: -2,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spreading: {
    top: 55,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: 10,
    height: 10,
    zIndex: -1,
  },
});

export default Launch;
