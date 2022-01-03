import React, {Component} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {Typography, Container, Icon} from 'src/components/base';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  staticBackground: {
    transform: [{rotate: '-45deg'}],
  },
  overlay: {
    position: 'absolute',
  },
  leftDoor: {
    top: '-50%',
  },
  rightDoor: {
    top: '50%',
  },
  iconContainer: {
    marginHorizontal: 15,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  icon: {
    fontSize: 20,
  },
  txtContainer: {
    paddingRight: 15,
  },
  title: {
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  titleActive: {
    position: 'absolute',
  },
  desc: {
    marginTop: 4,
  },
});

class BenefitRow extends Component {
  static contextType = ThemeContext;

  state = {};
  activeRotateAnimated = new Animated.Value(0);
  activeTranslateAnimated = new Animated.Value(0);
  activeOpacityAnimated = new Animated.Value(0);

  get theme() {
    return getTheme(this);
  }

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
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(this.activeRotateAnimated, {
          toValue: 1,
          duration: 260,
          easing: Easing.quad,
          useNativeDriver: true,
        }),
        Animated.timing(this.activeTranslateAnimated, {
          toValue: 1,
          duration: 400,
          easing: Easing.quad,
          useNativeDriver: true,
        }),
        Animated.timing(this.activeOpacityAnimated, {
          toValue: 1,
          duration: 400,
          easing: Easing.quad,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }

  get containerStyle() {
    return {
      borderColor: this.theme.color.border,
      borderBottomWidth: this.theme.layout.borderWidthSmall,
    };
  }

  get iconStyle() {
    return {
      ...this.theme.layout.shadow,
      shadowColor: this.theme.color.shadow,
    };
  }

  get unactiveIconStyle() {
    return {
      color: this.theme.color.onDisabled,
    };
  }

  get activeIconStyle() {
    return {
      color: this.theme.color.onPersistPrimary,
    };
  }

  get rightDoorStyle() {
    return {
      backgroundColor: LightenColor(this.theme.color.disabled, 3),
    };
  }

  get leftDoorStyle() {
    return {
      backgroundColor: this.theme.color.disabled,
    };
  }

  get staticLeftBackgroundStyle() {
    return {
      backgroundColor: this.theme.color.persistPrimary,
    };
  }

  get staticRightBackgroundStyle() {
    return {
      backgroundColor: LightenColor(this.theme.color.persistPrimary, 15),
    };
  }

  render() {
    const extraBackgroundLockStyle = {
      transform: [
        {
          rotate: this.activeRotateAnimated.interpolate({
            inputRange: [0, 0.6, 0.8, 1],
            outputRange: ['-45deg', '15deg', '-15deg', '0deg'],
          }),
        },
      ],
    };
    const extraLeftDoorStyle = {
      transform: [
        {
          translateY: this.activeTranslateAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -100],
          }),
        },
      ],
    };
    const extraRightDoorStyle = {
      transform: [
        {
          translateY: this.activeTranslateAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 100],
          }),
        },
      ],
    };
    const unActiveStyle = {
      opacity: this.activeOpacityAnimated.interpolate({
        inputRange: [0, 0.3],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          scale: this.activeOpacityAnimated.interpolate({
            inputRange: [0, 0.2],
            outputRange: [1, 3],
            extrapolate: 'clamp',
          }),
        },
      ],
    };

    const activeStyle = {
      opacity: this.activeOpacityAnimated,
    };

    const extraTitleActiveStyle = {
      opacity: this.activeOpacityAnimated.interpolate({
        inputRange: [0, 0.3],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          scale: this.activeOpacityAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.8],
            extrapolate: 'clamp',
          }),
        },
      ],
    };

    return (
      <Container row style={[this.containerStyle, styles.container]}>
        <View style={styles.iconContainer}>
          <View style={[styles.background, styles.staticBackground]}>
            <Container
              animated
              style={[
                styles.background,
                styles.leftDoor,
                this.staticLeftBackgroundStyle,
              ]}
            />
            <Container
              animated
              style={[
                styles.background,
                styles.rightDoor,
                this.staticRightBackgroundStyle,
              ]}
            />
          </View>
          <Container
            noBackground
            animated
            style={[styles.background, extraBackgroundLockStyle]}>
            <Container
              animated
              style={[
                styles.background,
                styles.leftDoor,
                this.leftDoorStyle,
                extraLeftDoorStyle,
              ]}
            />
            <Container
              noBackground
              animated
              style={[
                styles.background,
                styles.rightDoor,
                this.rightDoorStyle,
                extraRightDoorStyle,
              ]}
            />
          </Container>
          <Icon
            animated
            bundle={BundleIconSetName.FONT_AWESOME}
            name="lock"
            style={[
              this.iconStyle,
              this.unactiveIconStyle,
              styles.icon,
              unActiveStyle,
            ]}
          />
          <Icon
            animated
            bundle={BundleIconSetName.FONT_AWESOME}
            name="check"
            style={[
              this.iconStyle,
              this.activeIconStyle,
              styles.icon,
              styles.overlay,
              activeStyle,
            ]}
          />
        </View>
        <Container noBackground flex style={styles.txtContainer}>
          <Typography
            type={TypographyType.LABEL_SEMI_LARGE_PRIMARY}
            style={styles.title}>
            {this.props.title}
          </Typography>
          <Typography
            animated
            type={TypographyType.LABEL_SEMI_LARGE_TERTIARY}
            style={[styles.title, styles.titleActive, extraTitleActiveStyle]}>
            {this.props.title}
          </Typography>
          {!!this.props.description && (
            <Typography
              type={TypographyType.DESCRIPTION_SEMI_MEDIUM}
              style={styles.desc}>
              {this.props.description}
            </Typography>
          )}
        </Container>
      </Container>
    );
  }
}

export default BenefitRow;
