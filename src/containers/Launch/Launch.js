import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing
} from 'react-native';
import { CachedImage } from 'react-native-img-cache';
import appConfig from '../../config';
import store from '../../store';

class Launch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animatedBouncing: new Animated.Value(0),
      animatedPressing: new Animated.Value(0),
      animatedSpreading: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this.handleAuthorization();
    // this.state.animatedBouncing.addListener(
    //   this.onAnimatedBouncingValueChange
    // );
    this.animateLoading();
  }

  onAnimatedBouncingValueChange = ({ value }) => {
    if (value > 29) {
      Animated.spring(this.state.animatedSpreading, {
        toValue: 1,
        useNativeDriver: true,
        duration: 300
      }).start(() =>
        Animated.spring(this.state.animatedSpreading, {
          toValue: 0,
          useNativeDriver: true,
          duration: 300
        }).start()
      );
    }
  };

  handleAuthorization = async () => {
    try {
      const response = await APIHandler.user_login({
        fb_access_token: ''
      });
      this.handleAuthWithResponse(response);
    } catch (error) {
      console.log(error);
      setTimeout(this.handleAuthorization, 1000);
    }
  };

  handleAuthWithResponse = response => {
    return;
    const user = response.data;
    // @NOTE: set default name and phone for phone card package
    // phoneCardConfig.defaultContactName = user.name;
    // phoneCardConfig.defaultContactPhone = user.tel;

    switch (response.status) {
      case STATUS_SUCCESS:
        store.setUserInfo(user);
        Actions.replace(appConfig.routes.primaryTabbar);
        break;
      case STATUS_FILL_INFO_USER:
        store.setUserInfo(user);
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
      Animated.sequence([
        Animated.timing(this.state.animatedBouncing, {
          toValue: 30,
          easing: Easing.circle,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.parallel([
          Animated.timing(this.state.animatedPressing, {
            toValue: 1,
            easing: Easing.bounce,
            duration: 200,
            useNativeDriver: true
          }),
          Animated.timing(this.state.animatedSpreading, {
            toValue: 1,
            easing: Easing.in,
            duration: 200,
            useNativeDriver: true
          })
        ]),
        Animated.parallel([
          Animated.timing(this.state.animatedPressing, {
            toValue: 0,
            easing: Easing.quad,
            duration: 200,
            useNativeDriver: true
          }),
          Animated.timing(this.state.animatedSpreading, {
            toValue: 0,
            easing: Easing.in,
            duration: 0,
            useNativeDriver: true
          })
        ]),
        Animated.timing(this.state.animatedBouncing, {
          toValue: 0,
          easing: Easing.in,
          duration: 500,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  render() {
    return (
      <View style={styles.container}>
        {/* <ActivityIndicator size="large" /> */}
        <View style={styles.logoContainer}>
          <CachedImage
            source={require('../../images/logo-640x410.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.text}>Đang kết nối...</Text>
          <View style={styles.animateLoading}>
            <Animated.View
              style={[
                styles.bouncing,
                {
                  transform: [
                    { translateY: this.state.animatedBouncing },
                    {
                      scaleX: this.state.animatedPressing.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.2]
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
            />
            <Animated.View
              style={[
                styles.spreading,
                {
                  opacity: this.state.animatedSpreading.interpolate({
                    inputRange: [0, 0.3, 1],
                    outputRange: [0, 1, 0]
                  })
                },
                {
                  transform: [
                    {
                      scaleX: this.state.animatedSpreading.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 4]
                      })
                    },
                    {
                      scaleY: this.state.animatedSpreading.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
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
    marginBottom: appConfig.device.bottomSpace,
    backgroundColor: '#fff'
  },
  logoContainer: {
    // position: 'absolute',
    // bottom: appConfig.device.height / 1.618,
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
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
    // position: 'absolute'
  },
  bouncing: {
    backgroundColor: 'yellow',
    borderRadius: 20,
    width: 40,
    height: 40
  },
  spreading: {
    marginTop: 24,
    backgroundColor: 'red',
    borderRadius: 7.5,
    width: 15,
    height: 15,
    zIndex: -1
  }
});

export default Launch;
