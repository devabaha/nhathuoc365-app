import React, {PureComponent, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import {BlurView} from '@react-native-community/blur';
import Animated, {Easing, useValue} from 'react-native-reanimated';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
// custom components
import {
  ActivityIndicator,
  Typography,
  TypographyType,
  Container,
} from 'src/components/base';

export default class Loading extends PureComponent {
  static contextType = ThemeContext;

  get theme() {
    return getTheme(this);
  }

  render() {
    const wrapperStyle = mergeStyles(styles.wrapper, [
      this.props.center ? styles.centerContainer : {},
      this.props.wrapperStyle,
    ]);

    const containerStyle = mergeStyles(styles.container, [
      (this.props.blur || this.props.highlight) && [
        styles.blurContentContainer,
        {
          backgroundColor: this.theme.color.background,
          borderRadius: this.theme.layout.borderRadiusLarge,
        },
      ],
      this.props.containerStyle,
    ]);

    return (
      <View pointerEvents={this.props.pointerEvents} style={wrapperStyle}>
        {!!this.props.blur && (
          <BlurFilter visible blurType={this.props.blurType} />
        )}
        <Container noBackground style={containerStyle}>
          <ActivityIndicator
            style={[
              styles.loading,
              this.props.style,
              this.props.center ? styles.center : {},
            ]}
            color={this.props.color}
            size={this.props.size || 'large'}
          />
          {this.props.message && (
            <Typography
              type={TypographyType.LABEL_SMALL}
              style={[styles.message, this.props.textStyle]}>
              {this.props.message}
            </Typography>
          )}
        </Container>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    overflow: 'hidden',
  },
  blurContainer: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  blurContentContainer: {
    padding: 20,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    // height: 40,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    // position: 'absolute',
    // top: Util.size.height / 2 - LOADING_WIDTH / 2 - NAV_HEIGHT,
    // left: Util.size.width / 2 - LOADING_WIDTH / 2,
    zIndex: 999,
    // width: LOADING_WIDTH,
    // height: LOADING_WIDTH
  },
  message: {
    textAlign: 'center',
  },
});

export const BlurFilter = React.memo(({visible, blurType}) => {
  const animatedOpacity = useValue(0);

  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: visible ? 1 : 0,
      duration: 300,
      easing: Easing.quad,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.blurContainer, {opacity: animatedOpacity}]}>
      <BlurView
        style={styles.blurContainer}
        reducedTransparencyFallbackColor="#fff"
        blurType={blurType}
      />
    </Animated.View>
  );
});
