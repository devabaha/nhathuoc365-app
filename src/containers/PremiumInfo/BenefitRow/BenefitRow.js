import React, { Component } from 'react';
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Container from '../../../components/Layout/Container';
import appConfig from 'app-config';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderColor: '#eee'
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  staticBackground: {
    transform: [{ rotate: '-45deg' }]
  },
  overlay: {
    position: 'absolute'
  },
  leftDoor: {
    backgroundColor: '#ddd',
    top: '-50%'
  },
  rightDoor: {
    backgroundColor: '#eee',
    top: '50%'
  },
  iconContainer: {
    marginHorizontal: 15,
    // backgroundColor: "#ddd",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  icon: {
    fontSize: 20,
    color: '#777',
    ...elevationShadowStyle(5)
  },
  txtContainer: {
    paddingRight: 15
  },
  title: {
    color: appConfig.colors.primary,
    fontSize: 15,
    fontWeight: '500',
    textTransform: 'uppercase'
  },
  titleActive: {
    color: '#888',
    position: 'absolute'
  },
  desc: {
    color: '#888',
    fontSize: 13,
    marginTop: 4
  }
});

const AnimatedFontAwesomeIcon = Animated.createAnimatedComponent(
  FontAwesomeIcon
);

class BenefitRow extends Component {
  state = {};
  activeRotateAnimated = new Animated.Value(0);
  activeTranslateAnimated = new Animated.Value(0);
  activeOpacityAnimated = new Animated.Value(0);

  componentDidMount() {
    if (this.props.active) {
      this.activeAnimating();
    }
  }

  activeAnimating() {
    Animated.sequence([
      Animated.delay(200),
      Animated.timing(this.activeRotateAnimated, {
        toValue: 0.6,
        duration: 400,
        easing: Easing.bezier(0.45, 0, 0.55, 1),
        useNativeDriver: true
      }),
      Animated.parallel([
        Animated.timing(this.activeRotateAnimated, {
          toValue: 1,
          duration: 260,
          easing: Easing.quad,
          useNativeDriver: true
        }),
        Animated.timing(this.activeTranslateAnimated, {
          toValue: 1,
          duration: 400,
          easing: Easing.quad,
          useNativeDriver: true
        }),
        Animated.timing(this.activeOpacityAnimated, {
          toValue: 1,
          duration: 400,
          easing: Easing.quad,
          useNativeDriver: true
        })
      ])
    ]).start();
  }

  render() {
    const extraBackgroundLockStyle = {
      transform: [
        {
          rotate: this.activeRotateAnimated.interpolate({
            inputRange: [0, 0.6, 0.8, 1],
            outputRange: ['-45deg', '15deg', '-15deg', '0deg']
          })
        }
      ]
    };
    const extraLeftDoorStyle = {
      transform: [
        {
          translateY: this.activeTranslateAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -100]
          })
        }
      ]
    };
    const extraRightDoorStyle = {
      transform: [
        {
          translateY: this.activeTranslateAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 100]
          })
        }
      ]
    };
    const unActiveStyle = {
      opacity: this.activeOpacityAnimated.interpolate({
        inputRange: [0, 0.3],
        outputRange: [1, 0],
        extrapolate: 'clamp'
      }),
      transform: [
        {
          scale: this.activeOpacityAnimated.interpolate({
            inputRange: [0, 0.2],
            outputRange: [1, 3],
            extrapolate: 'clamp'
          })
        }
      ]
    };

    const activeStyle = {
      opacity: this.activeOpacityAnimated,
      color: '#f7f7f7'
    };

    const extraTitleActiveStyle = {
      opacity: this.activeOpacityAnimated.interpolate({
        inputRange: [0, 0.3],
        outputRange: [1, 0],
        extrapolate: 'clamp'
      }),
      transform: [
        {
          scale: this.activeOpacityAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.8],
            extrapolate: 'clamp'
          })
        }
      ]
    };

    return (
      <Container row style={styles.container}>
        <View style={styles.iconContainer}>
          <View style={[styles.background, styles.staticBackground]}>
            <Animated.View
              style={[
                styles.background,
                styles.leftDoor,
                { backgroundColor: appConfig.colors.primary }
              ]}
            />
            <Animated.View
              style={[
                styles.background,
                styles.rightDoor,
                { backgroundColor: LightenColor(appConfig.colors.primary, 15) }
              ]}
            />
          </View>
          <Animated.View style={[styles.background, extraBackgroundLockStyle]}>
            <Animated.View
              style={[styles.background, styles.leftDoor, extraLeftDoorStyle]}
            />
            <Animated.View
              style={[styles.background, styles.rightDoor, extraRightDoorStyle]}
            />
          </Animated.View>
          <AnimatedFontAwesomeIcon
            name="lock"
            style={[styles.icon, unActiveStyle]}
          />
          <AnimatedFontAwesomeIcon
            name="check"
            style={[styles.icon, styles.overlay, activeStyle]}
          />
        </View>
        <Container.Item flex style={styles.txtContainer}>
          <Text style={styles.title}>{this.props.title}</Text>
          <Animated.Text
            style={[styles.title, styles.titleActive, extraTitleActiveStyle]}
          >
            {this.props.title}
          </Animated.Text>
          {!!this.props.description && (
            <Text style={styles.desc}>{this.props.description}</Text>
          )}
        </Container.Item>
      </Container>
    );
  }
}

export default BenefitRow;
