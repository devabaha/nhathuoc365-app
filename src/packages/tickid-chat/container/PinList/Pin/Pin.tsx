import React, {Component} from 'react';
import {StyleSheet, View, Animated} from 'react-native';
// types
import {Style} from 'src/Themes/interface';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {IMAGE_ICON_TYPE, MAX_PIN} from 'app-packages/tickid-chat/constants';
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {BaseButton, Icon, Typography} from 'src/components/base';
import Image from 'src/components/Image';

const styles = StyleSheet.create({
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  itemWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 45,
    height: 45,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 45,
    height: 45,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 6,
  },
  notifyWrapper: {
    position: 'absolute',
    width: 22,
    height: 22,
    top: -10,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 11,
  },
  notify: {
    fontWeight: 'bold',
  },
});

class Pin extends Component<any> {
  static contextType = ThemeContext;

  state = {
    animatedShowUpValue: new Animated.Value(0),
  };

  get theme() {
    return getTheme(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.notify !== this.props.notify) {
      if (nextProps.notify > 0) {
        this.state.animatedShowUpValue.setValue(
          this.props.notify === 0 ? 0 : 0.7,
        );
      }
      const isHidden = this.props.notify > 0 && nextProps.notify === 0;
      Animated.spring(this.state.animatedShowUpValue, {
        toValue: isHidden ? 0 : 1,
        useNativeDriver: true,
        friction: 5,
        overshootClamping: isHidden,
      }).start();
    }

    if (nextState !== this.state) {
      return true;
    }

    if (nextProps !== this.props) {
      return true;
    }

    return false;
  }

  get iconStyle(): Style {
    return {color: this.theme.color.white};
  }

  get notifyWrapperStyle(): Style {
    return {backgroundColor: this.theme.color.danger};
  }

  get notifyStyle(): Style {
    return {color: this.theme.color.white};
  }

  render() {
    const {pin, notify, onPress, itemsPerRow} = this.props;
    const extraStyle = {
      width: `${100 / itemsPerRow}%`,
    };

    let animatedStyle = {
      opacity: this.state.animatedShowUpValue.interpolate({
        inputRange: [0, 0.7, 1],
        outputRange: [0, 1, 1],
      }),
      transform: [{scale: this.state.animatedShowUpValue}],
    };

    return (
      <BaseButton onPress={onPress} style={[styles.buttonWrapper, extraStyle]}>
        <View style={styles.itemWrapper}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: pin.bgrColor,
              },
            ]}>
            {pin.iconType === IMAGE_ICON_TYPE ? (
              <Image style={styles.image} source={{uri: pin.icon}} />
            ) : (
              <Icon
                bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
                name={pin.icon}
                style={[styles.icon, this.iconStyle]}
              />
            )}
          </View>
          <Typography
            type={TypographyType.LABEL_SEMI_MEDIUM}
            style={styles.title}>
            {pin.title}
          </Typography>

          <Animated.View
            style={[
              styles.notifyWrapper,
              this.notifyWrapperStyle,
              animatedStyle,
            ]}>
            <Typography
              type={TypographyType.LABEL_EXTRA_SMALL}
              style={[styles.notify, this.notifyStyle]}>
              {notify > MAX_PIN ? `${MAX_PIN}+` : notify}
            </Typography>
          </Animated.View>
        </View>
      </BaseButton>
    );
  }
}

export default Pin;
