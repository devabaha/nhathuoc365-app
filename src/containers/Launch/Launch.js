import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import appConfig from '../../config';
import store from '../../store';
import FastImage from 'react-native-fast-image';
import { languages } from '../../i18n/constants';

class Launch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animatedBouncing: new Animated.Value(0),
      animatedPressing: new Animated.Value(0),
      animatedSpreading: new Animated.Value(0),
      animatedSpreadingShadow: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this.animateLoading();
    this.handleAuthorization();
    EventTracker.logEvent('launch_page');
  }

  handleAuthorization = async () => {
    try {
      const response = await APIHandler.user_login({
        fb_access_token: '',
        language: this.props.appLanguage,
        locale: languages[this.props.appLanguage].locale
      });
      setTimeout(() => {
        this.handleAuthWithResponse(response);
      }, 500);
    } catch (error) {
      console.log(error);
      setTimeout(this.handleAuthorization, 1000);
    }
  };

  handleAuthWithResponse = response => {
    const user = response.data;
    // @NOTE: set default name and phone for phone card package
    // phoneCardConfig.defaultContactName = user.name;
    // phoneCardConfig.defaultContactPhone = user.tel;
    switch (response.status) {
      case STATUS_SUCCESS:
        store.setUserInfo(user);
        EventTracker.setUserId(user.id);
        Actions.replace(appConfig.routes.primaryTabbar);
        break;
      case STATUS_FILL_INFO_USER:
        store.setUserInfo(user);
        EventTracker.setUserId(user.id);
        Actions.replace('op_register', {
          title: 'Đăng ký thông tin',
          name_props: user.name,
          hideBackImage: true
        });
        break;
      case STATUS_UNDEFINE_USER:
        Actions.replace('phone_auth', {
          loginMode: user.loginMode ? user.loginMode : 'FIREBASE' //FIREBASE / SMS_BRAND_NAME
        });
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
            useNativeDriver: true
          }),
          Animated.timing(this.state.animatedPressing, {
            toValue: 1,
            easing: Easing.bounce,
            duration: 200,
            useNativeDriver: true
          }),
          Animated.timing(this.state.animatedPressing, {
            toValue: 0,
            easing: Easing.in,
            duration: 200,
            useNativeDriver: true
          }),
          Animated.timing(this.state.animatedBouncing, {
            toValue: 60,
            easing: Easing.in,
            duration: 600,
            useNativeDriver: true
          }),
          Animated.timing(this.state.animatedBouncing, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true
          })
        ]),
        Animated.sequence([
          Animated.parallel([
            Animated.timing(this.state.animatedSpreading, {
              toValue: 1,
              easing: Easing.in,
              duration: 600,
              delay: 400,
              useNativeDriver: true
            }),
            Animated.timing(this.state.animatedSpreadingShadow, {
              toValue: 1,
              easing: Easing.in,
              duration: 600,
              delay: 500,
              useNativeDriver: true
            })
          ]),
          Animated.timing(this.state.animatedSpreading, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true
          }),
          Animated.timing(this.state.animatedSpreadingShadow, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true
          })
        ])
      ])
    ).start();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <FastImage
            source={require('../../images/logo-640x410.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.animateLoading}>
            <Animated.View
              style={[
                styles.dot,
                styles.bouncing,
                {
                  opacity: this.state.animatedBouncing.interpolate({
                    inputRange: [0, 30, 60],
                    outputRange: [0.6, 1, 0.6]
                  }),
                  transform: [
                    {
                      translateY: this.state.animatedBouncing.interpolate({
                        inputRange: [0, 30, 60],
                        outputRange: [0, 30, 0]
                      })
                    },
                    {
                      scale: this.state.animatedBouncing.interpolate({
                        inputRange: [0, 30, 60],
                        outputRange: [0.6, 1, 0.6]
                      })
                    },
                    {
                      scaleX: this.state.animatedPressing.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.3]
                      })
                    },
                    {
                      scaleY: this.state.animatedPressing.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.7]
                      })
                    }
                  ]
                }
              ]}
            >
              <Animated.View
                style={[
                  styles.leftHalf,
                  {
                    opacity: this.state.animatedBouncing.interpolate({
                      inputRange: [0, 15, 30, 45, 60],
                      outputRange: [0, 1, 1, 1, 0]
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
                            '360deg'
                          ]
                        })
                      }
                    ]
                  }
                ]}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.spreadingShadow,
                {
                  opacity: this.state.animatedSpreadingShadow.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1, 0]
                  })
                },
                {
                  transform: [
                    {
                      scaleX: this.state.animatedSpreadingShadow.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 8]
                      })
                    },
                    {
                      scaleY: this.state.animatedSpreadingShadow.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.6, 1.5]
                      })
                    }
                  ]
                }
              ]}
            />
            <Animated.View
              style={[
                styles.spreading,
                {
                  opacity: this.state.animatedSpreading.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1, 0]
                  }),
                  transform: [
                    {
                      scaleX: this.state.animatedSpreading.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 5]
                      })
                    }
                  ]
                }
              ]}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  logoContainer: {
    position: 'absolute',
    top: appConfig.device.height * 0.3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 200,
    height: 128
  },
  text: {
    fontSize: 14,
    color: '#666',
    // marginTop: 8,
    fontWeight: '400',
    textAlign: 'center'
  },
  animateLoading: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftHalf: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderTopWidth: 10,
    borderTopColor: appConfig.colors.logo.sub,
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    borderRadius: 10
  },
  dot: {
    borderRadius: 10,
    width: 20,
    height: 20,
    overflow: 'hidden'
  },
  bouncing: {
    backgroundColor: appConfig.colors.logo.main
  },
  spreadingShadow: {
    top: 55,
    backgroundColor: hexToRgbA(appConfig.colors.logo.addition, 0.2),
    borderRadius: 7.5,
    width: 15,
    height: 15,
    zIndex: -2,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spreading: {
    backgroundColor: appConfig.colors.logo.addition,
    top: 55,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: 10,
    height: 10,
    zIndex: -1
  }
});

export default Launch;
