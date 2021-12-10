import React, {Component} from 'react';
import {View, StyleSheet, Image} from 'react-native';
// 3-party libs
import Animated, {Easing, timing, concat} from 'react-native-reanimated';
// types
import {RowProps} from '.';
import {Theme} from 'src/Themes/interface';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
//constants
import {BundleIconSetName, IconButton} from 'src/components/base';
// custom components
import {BaseButton, Container, Typography} from 'src/components/base';

const styles = StyleSheet.create({
  container: {},
  layoutContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContainer: {
    width: 35,
    height: 35,
    marginRight: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    // flex: 1,
  },
  contentContainer: {
    overflow: 'hidden',
  },
  iconContainer: {
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
  },
});

class Row extends Component<RowProps> {
  static contextType = ThemeContext;

  static defaultProps = {
    defaultOpenChild: false,
    disabledOpenChild: false,
    onPressTitle: () => {},
  };
  state = {
    isOpen: this.props.defaultOpenChild,
    animatedCoreValue: new Animated.Value(0),
  };
  directionIconProps = {reanimated: true};

  get theme(): Theme {
    return getTheme(this);
  }

  get animatedContentStyle() {
    return {
      opacity: this.state.animatedCoreValue,
      height: this.state.animatedCoreValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, this.props.totalHeight],
      }),
    };
  }

  get animatedIconStyle() {
    return {
      transform: [
        {
          rotate: concat(
            this.state.animatedCoreValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 180],
            }),
            'deg',
          ),
        },
      ],
    };
  }

  shouldComponentUpdate(nextProps: RowProps, nextState: any) {
    if (nextState.isOpen !== this.state.isOpen) {
      timing(this.state.animatedCoreValue, {
        toValue: nextState.isOpen ? 1 : 0,
        duration: 200,
        easing: Easing.quad,
      }).start();
    }

    if (nextProps.defaultOpenChild !== this.props.defaultOpenChild) {
      this.setState({isOpen: nextProps.defaultOpenChild});
    }

    if (nextProps.fullMode !== this.props.fullMode) {
      timing(this.state.animatedCoreValue, {
        toValue: nextProps.fullMode ? 1 : 0,
        duration: 200,
        easing: Easing.quad,
      }).start();

      this.setState({isOpen: nextProps.fullMode ? true : false});
    }

    if (nextState !== this.state) {
      return true;
    }

    const isUpdateProps = Object.keys(nextProps).some(
      (key) => nextProps[key] !== this.props[key] && key !== 'children',
    );

    if (isUpdateProps) {
      return true;
    }

    return false;
  }

  onToggle() {
    this.setState((prevState: any) => ({
      isOpen: !prevState.isOpen,
    }));
  }

  get directionIconStyle() {
    return mergeStyles([styles.icon, this.animatedIconStyle], {
      color: this.theme.color.iconInactive,
    });
  }

  get imageContainerStyle() {
    return mergeStyles(styles.imageContainer, {
      backgroundColor: this.theme.color.contentBackground,
      borderRadius: this.theme.layout.borderRadiusExtraSmall,
    });
  }

  render() {
    const isShowDirectionIcon =
      !this.props.fullMode && !!this.props.totalHeight;

    return (
      <Container style={[styles.container, this.props.containerStyle]}>
        <View style={[styles.header, this.props.headerContainerStyle]}>
          <View style={{flex: 1}}>
            <BaseButton
              style={[styles.layoutContainer]}
              onPress={this.props.onPressTitle}>
              {!!this.props.image && (
                <View style={this.imageContainerStyle}>
                  <Image
                    source={{uri: this.props.image}}
                    style={styles.image}
                  />
                </View>
              )}
              <Typography style={styles.title}>{this.props.title}</Typography>
            </BaseButton>
          </View>
          {isShowDirectionIcon && (
            <IconButton
              style={styles.iconContainer}
              iconStyle={this.directionIconStyle}
              iconProps={this.directionIconProps}
              bundle={BundleIconSetName.FONT_AWESOME}
              name="angle-down"
              onPress={this.onToggle.bind(this)}
            />
          )}
        </View>

        <Animated.View
          style={[
            styles.contentContainer,
            this.animatedContentStyle,
            this.props.contentContainerStyle,
          ]}>
          {this.props.children}
        </Animated.View>
      </Container>
    );
  }
}

export default Row;
