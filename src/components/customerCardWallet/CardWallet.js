import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Vibration,
  TouchableOpacity
} from 'react-native';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/AntDesign';
import appConfig from 'app-config';

const LONG_PRESS_TIME_OUT = 300;
const LOOP_DURATION = 3000;

class CardWallet extends PureComponent {
  state = {
    animatedScaling: new Animated.Value(0),
    animatedShaking: new Animated.Value(0),
    animatedOverlay: new Animated.Value(0)
  };
  longPressTimeout = null;
  backgroundTimeout = null;
  shaking = false;

  handlePress = () => {
    this.props.onPress();
  };

  handleLongPress = () => {
    if (!this.shaking && this.props.longPress) {
      this.props.onLongPress();
      clearTimeout(this.longPressTimeout);
      clearTimeout(this.backgroundTimeout);
      this.longPressTimeout = setTimeout(() => {
        Animated.timing(this.state.animatedScaling, {
          toValue: 1,
          easing: Easing.back(),
          duration: LONG_PRESS_TIME_OUT,
          useNativeDriver: true
        }).start(({ finished }) => {
          this.shaking = false;

          if (finished) {
            this.shaking = true;
            Vibration.vibrate(100);

            this.backgroundTimeout = setTimeout(
              () => this.handleCancelLongPress(true),
              LOOP_DURATION
            );

            Animated.sequence([
              Animated.parallel([
                Animated.timing(this.state.animatedScaling, {
                  toValue: 0,
                  easing: Easing.back(),
                  duration: LONG_PRESS_TIME_OUT,
                  useNativeDriver: true
                }),
                Animated.spring(this.state.animatedOverlay, {
                  toValue: 1,
                  useNativeDriver: true
                }),
                Animated.loop(
                  Animated.timing(this.state.animatedShaking, {
                    toValue: 1,
                    useNativeDriver: true,
                    duration: 500,
                    easing: Easing.linear
                  })
                )
              ])
            ]).start();
          }
        });
      }, LONG_PRESS_TIME_OUT / 2);
    }
  };

  handleCancelLongPress = (isCancel = !this.shaking, isPress = false) => {
    if (isCancel) {
      this.props.onCancelLongPress();
      this.shaking = false;
      clearTimeout(this.longPressTimeout);
      clearTimeout(this.backgroundTimeout);
      this.state.animatedShaking.setValue(0);
      Animated.parallel([
        Animated.spring(this.state.animatedScaling, {
          toValue: 0,
          useNativeDriver: true
        }),
        Animated.spring(this.state.animatedOverlay, {
          toValue: 0,
          useNativeDriver: true
        })
      ]).start();
      if (isPress) {
        this.props.onDelete();
      }
    }
  };

  render() {
    const shakingAngle = '1deg';
    const shakingDistanceX = 2;
    const shakingDistanceY = 2.5;

    return (
      <Button
        activeOpacity={appConfig.device.isAndroid ? 0.9 : 0.6}
        disabled={this.props.disabled}
        onPress={this.handlePress}
        onLongPress={this.handleLongPress}
        onPressOut={() => this.handleCancelLongPress()}
        containerStyle={[
          styles.containerBtn,
          this.props.style,
          {
            marginBottom: this.props.last ? 16 : 0
          }
        ]}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                {
                  scale: this.state.animatedScaling.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.05]
                  })
                },
                {
                  translateX: this.state.animatedShaking.interpolate({
                    inputRange: [0, 0.25, 0.5, 0.75, 1],
                    outputRange: [0, shakingDistanceX, 0, -shakingDistanceX, 0]
                  })
                },
                {
                  translateY: this.state.animatedShaking.interpolate({
                    inputRange: [0, 0.25, 0.5, 0.75, 1],
                    outputRange: [
                      0,
                      shakingDistanceY / 4,
                      shakingDistanceY,
                      shakingDistanceY / 4,
                      0
                    ]
                  })
                },
                {
                  rotate: this.state.animatedShaking.interpolate({
                    inputRange: [
                      0,
                      1 / 8,
                      2 / 8,
                      3 / 8,
                      4 / 8,
                      5 / 8,
                      6 / 8,
                      7 / 8,
                      1
                    ],
                    outputRange: [
                      '0deg',
                      shakingAngle,
                      '0deg',
                      `-${shakingAngle}`,
                      '0deg',
                      shakingAngle,
                      '0deg',
                      `-${shakingAngle}`,
                      '0deg'
                    ]
                  })
                }
              ]
            }
          ]}
        >
          <Image source={{ uri: this.props.image }} style={styles.thumbnail} />
          <View style={[styles.infoWrapper]}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{this.props.title}</Text>
              {this.props.rightTitleComponent}
            </View>

            {!!this.props.point && this.props.point !== '0' && (
              <Text style={styles.pointWrapper}>
                <Text style={styles.point}>{this.props.point}</Text>
                {` ${this.props.pointCurrency}`}
              </Text>
            )}
          </View>
          <View style={[styles.avatar, styles.shadow]}>
            <View style={styles.overflow}>
              <Image
                source={{ uri: this.props.logoImage }}
                style={{
                  flex: 1
                }}
              />
            </View>
          </View>
          {!!this.props.discount && (
            <View style={styles.discountWrapper}>
              <Text style={styles.discount}>{this.props.discount}</Text>
            </View>
          )}

          <Animated.View
            style={[
              styles.delete,
              {
                opacity: this.state.animatedOverlay.interpolate({
                  inputRange: [0, 0.9, 1],
                  outputRange: [0, 0, 1]
                }),
                transform: [{ scale: this.state.animatedOverlay }]
              }
            ]}
          >
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => this.handleCancelLongPress(true, true)}
            >
              <View style={styles.iconBackground} />
              <View>
                <Icon name="closecircle" size={28} color="red" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  containerBtn: {
    marginTop: 16,
    marginHorizontal: 20,
    borderRadius: 8
  },
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative'
  },
  thumbnail: {
    width: '100%',
    height: 180,
    resizeMode: 'cover'
  },
  infoWrapper: {
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,

    elevation: 4
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
    marginTop: 4,
    flex: 1
  },
  avatar: {
    position: 'absolute',
    top: 148,
    left: 16,
    width: 46,
    height: 46,
    backgroundColor: '#fff',
    borderRadius: 8
  },
  overflow: {
    overflow: 'hidden',
    borderRadius: 8,
    flex: 1
  },
  discountWrapper: {
    position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'center',
    top: -60,
    left: -20,
    backgroundColor: '#7fc845',
    width: 120,
    height: 120,
    borderRadius: 60
  },
  discount: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20
  },
  pointWrapper: {
    marginTop: 5
  },
  point: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00b140'
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  },
  delete: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,.4)'
  },
  iconBackground: {
    position: 'absolute',
    flex: 1,
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: '#fff'
  },
  closeIcon: {
    right: 15,
    marginTop: 15,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const defaultListener = () => {};

CardWallet.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  discount: PropTypes.string,
  logoImage: PropTypes.string,
  last: PropTypes.bool,
  longPress: PropTypes.bool,
  onLongPress: PropTypes.func,
  onCancelLongPress: PropTypes.func,
  onPress: PropTypes.func,
  onDelete: PropTypes.func,
  style: PropTypes.any
};

CardWallet.defaultProps = {
  image: '',
  title: '',
  discount: '',
  logoImage: '',
  last: false,
  longPress: false,
  onLongPress: defaultListener,
  onCancelLongPress: defaultListener,
  onPress: defaultListener,
  onDelete: defaultListener,
  style: {}
};

export default CardWallet;
