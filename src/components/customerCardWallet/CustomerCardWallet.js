import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';
import Button from 'react-native-button';

class CustomerCardWallet extends PureComponent {
  state = {
    animatedShaking: new Animated.Value(0)
  };

  componentDidMount() {
    Animated.loop(
      Animated.timing(this.state.animatedShaking, {
        toValue: 1,
        useNativeDriver: true,
        duration: 2000,
        easing: Easing.linear
      })
    ).start();
  }

  handleLongPress(e) {}

  render() {
    const shakingAngle = '5deg';
    const shakingDistanceX = 8;
    const shakingDistanceY = 15;

    return (
      <Button
        onPress={this.props.onPress}
        delayLongPress={800}
        onLongPress={this.handleLongPress}
        containerStyle={[styles.containerBtn, this.props.style]}
      >
        <Animated.View
          style={[
            styles.container,
            {
              marginBottom: this.props.last ? 16 : 0,
              transform: [
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
                      -shakingDistanceY / 4,
                      0
                    ]
                  })
                },
                {
                  rotate: this.state.animatedShaking.interpolate({
                    inputRange: [
                      0,
                      0.1,
                      0.2,
                      0.3,
                      0.4,
                      0.5,
                      0.6,
                      0.7,
                      0.8,
                      0.9,
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
                      '0deg',
                      shakingAngle,
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
            <Text style={styles.title}>{this.props.title}</Text>

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
        </Animated.View>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  containerBtn: {
    marginTop: 16
  },
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
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
  title: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
    marginTop: 4
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
  }
});

const defaultListener = () => {};

CustomerCardWallet.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  discount: PropTypes.string,
  logoImage: PropTypes.string,
  last: PropTypes.bool,
  onPress: PropTypes.func,
  style: PropTypes.any
};

CustomerCardWallet.defaultProps = {
  image: '',
  title: '',
  discount: '',
  logoImage: '',
  last: false,
  onPress: defaultListener,
  style: {}
};

export default CustomerCardWallet;
