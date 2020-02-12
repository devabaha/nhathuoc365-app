import React, { Component } from 'react';
import {
  Text,
  Animated,
  StyleSheet,
  Easing,
  View,
  ViewPropTypes
} from 'react-native';
import { default as ButtonRN } from 'react-native-button';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import appConfig from 'app-config';

const PERSPECTIVE = 1000;
const ROTATE_Y = '30deg';

class Button extends Component {
  state = {
    expandingAnimated: new Animated.Value(0),
    pressingAnimated: new Animated.Value(1),
    scalingAnimated: new Animated.Value(1),
    extraStyle: null
  };
  layout = {};
  animating = false;

  handlePress = () => {
    this.props.onPress();
    this.setState(
      {
        extraStyle: {
          position: 'absolute',
          alignSelf: this.props.first ? 'flex-start' : 'flex-end',
          zIndex: 999
        }
      },
      () =>
        Animated.spring(this.state.expandingAnimated, {
          toValue: 1
        }).start(() =>
          Animated.spring(this.state.expandingAnimated, {
            toValue: 0
          }).start(() =>
            this.setState({
              extraStyle: null
            })
          )
        )
    );
  };

  handleTouchStart = e => {
    this.animating = true;
    const { locationX } = e.nativeEvent;
    const middleBelowX = this.layout.width / 5;
    const middleAboveX = (this.layout.width * 4) / 5;
    const animated =
      locationX < middleBelowX || locationX > middleAboveX
        ? this.state.pressingAnimated
        : this.state.scalingAnimated;
    // console.log(locationX, middleBelowX, middleAboveX, (locationX < middleBelowX || locationX > middleAboveX))
    Animated.timing(animated, {
      toValue: locationX < middleBelowX ? 0 : locationX > middleAboveX ? 2 : 3,
      duration: 100,
      easing: Easing.in,
      useNativeDriver: true
    }).start(() => {
      this.animating = false;
      if (this.canceling) {
        this.handleTouchEnd();
      }
    });
  };

  handleTouchEnd = () => {
    this.canceling = true;
    const duration = 200;
    if (!this.animating)
      Animated.parallel([
        Animated.timing(this.state.scalingAnimated, {
          toValue: 1,
          duration,
          easing: Easing.in,
          useNativeDriver: true
        }),
        Animated.timing(this.state.pressingAnimated, {
          toValue: 1,
          duration,
          easing: Easing.in,
          useNativeDriver: true
        })
      ]).start(() => {
        this.canceling = false;
      });
  };

  measureLayout = e => {
    this.layout = e.nativeEvent.layout;
  };

  render() {
    const extraStyle = {
      borderLeftWidth: 1,
      borderColor: '#d9d9d9'
    };

    const animatedStyle = {
      transform: [
        {
          perspective: PERSPECTIVE
        },
        {
          scale: this.state.scalingAnimated.interpolate({
            inputRange: [1, 3],
            outputRange: [1, 0.9]
          })
        },
        {
          rotateY: '0deg'
        },
        {
          rotateY: this.state.pressingAnimated.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [`-${ROTATE_Y}`, '0deg', ROTATE_Y]
          })
        }
      ]
    };

    return (
      <Animated.View
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        style={[
          styles.btnContainer,
          styles.btnWrapper,
          this.props.containerStyle
        ]}
      >
        <ButtonRN
          onPress={this.handlePress}
          containerStyle={[styles.container]}
        >
          <View style={[styles.btnWrapper, !this.props.first && extraStyle]}>
            <Animated.View
              onLayout={this.measureLayout}
              style={[styles.btnContainer, styles.btnWrapper, animatedStyle]}
            >
              <Icon
                name={this.props.iconName}
                color={appConfig.colors.primary}
                size={24}
                style={styles.icon}
              />
              <Text numberOfLines={1} style={styles.title}>
                {this.props.title}
              </Text>
            </Animated.View>
          </View>
        </ButtonRN>
      </Animated.View>
    );
  }
}

Button.propTypes = {
  title: PropTypes.string,
  iconName: PropTypes.string,
  containerStyle: PropTypes.any,
  onPress: PropTypes.func,
  effectType: PropTypes.oneOf(['left', 'center', 'right'])
};

Button.defaultProps = {
  containerStyle: null,
  title: '',
  iconName: '',
  onPress: () => {},
  effectType: 'left'
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    maxWidth: 500,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 3
  },
  btnContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    paddingVertical: 7
  },
  btnWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    color: appConfig.colors.text,
    fontWeight: '600',
    flex: 1
  },
  icon: {
    marginHorizontal: 15
  }
});

export default Button;
