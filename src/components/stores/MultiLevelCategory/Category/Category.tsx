import React, {Component} from 'react';
import {Image, View, StyleSheet, Animated, Easing} from 'react-native';
// types
import {CategoryProps} from '.';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {BaseButton, Container, Typography} from 'src/components/base';

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  activeMask: {
    position: 'absolute',
    borderRadius: 100,
    width: '100%',
    height: '100%',
  },
  container: {
    width: appConfig.device.width / 4,
    height: appConfig.device.width / 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10%',
  },
  imageContainer: {
    width: '55%',
    height: '55%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  title: {
    marginTop: '5%',
    letterSpacing: 0.5,
    textAlign: 'center',
    fontWeight: '500',
  },
  maskTitle: {
    position: 'absolute',
  },
});

class Category extends Component<CategoryProps> {
  static contextType = ThemeContext;

  static defaultProps = {
    isActive: false,
    numberOfLines: 2,
    onPress: () => {},
  };

  state = {};
  animatedActiveValue = new Animated.Value(0);

  get theme() {
    return getTheme(this);
  }
  shouldComponentUpdate(nextProps: CategoryProps, nextState: any) {
    if (nextProps.isActive !== this.props.isActive) {
      this.animateActive(nextProps.isActive ? 1 : 0);
    }

    if (nextState !== this.state) {
      return true;
    }

    if (nextProps !== this.props) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.animateActive(this.props.isActive ? 1 : 0);
  }

  animateActive(toValue) {
    Animated.timing(this.animatedActiveValue, {
      toValue,
      duration: 200,
      easing: Easing.quad,
      useNativeDriver: true,
    }).start();
  }

  get activeMaskStyle() {
    return mergeStyles(styles.activeMask, {
      backgroundColor: this.theme.color.primaryHighlight,
    });
  }

  get containerStyle() {
    return mergeStyles(
      [
        styles.container,
        {
          borderBottomColor: this.theme.color.border,
          borderBottomWidth: this.theme.layout.borderWidthSmall,
        },
      ],
      this.props.containerStyle,
    );
  }

  render() {
    const activeContainerStyle = mergeStyles(
      [
        styles.activeMask,
        //@ts-ignore
        {
          opacity: this.animatedActiveValue,
          transform: [
            {
              scale: this.animatedActiveValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1.5],
              }),
            },
          ],
        },
      ],
      {
        backgroundColor: this.theme.color.primaryHighlight,
      },
    );
    // const activeContainerStyle = {
    //     opacity: this.animatedActiveValue,
    //     transform: [{
    //         scale: interpolate(this.animatedActiveValue, {
    //             inputRange: [0, 1],
    //             outputRange: [0, 1.5],
    //             // extrapolate: Extrapolate.CLAMP
    //         })
    //     }]
    // };
    const activeTitleStyle = mergeStyles(
      [styles.maskTitle, styles.title, this.props.titleStyle],
      //@ts-ignore
      {
        opacity: this.animatedActiveValue,
        color: this.theme.color.onPrimaryHighlight,
      },
    );

    return (
      <Container style={styles.wrapper}>
        <>
          <Animated.View style={activeContainerStyle} />
          <BaseButton
            useTouchableHighlight
            style={this.containerStyle}
            disabled={this.props.disabled}
            onPress={this.props.onPress}>
            <>
              {!!this.props.image && (
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.image}
                    source={{uri: this.props.image}}
                  />
                </View>
              )}
              {!!this.props.title && (
                <View>
                  <Typography
                    type={TypographyType.LABEL_SMALL}
                    numberOfLines={this.props.numberOfLines}
                    style={[styles.title, this.props.titleStyle]}>
                    {this.props.title}
                  </Typography>
                  <Typography
                    animated
                    type={TypographyType.LABEL_SMALL}
                    numberOfLines={this.props.numberOfLines}
                    style={activeTitleStyle}>
                    {this.props.title}
                  </Typography>
                </View>
              )}
              {this.props.children}
            </>
          </BaseButton>
        </>
      </Container>
    );
  }
}

export default Category;
