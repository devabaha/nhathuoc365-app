import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import {Icon} from 'src/components/base';

class GradientIcon extends PureComponent {
  static contextType = ThemeContext;

  static defaultProps = {
    icon: null,
    locations: [0.3, 0.6],
    useAngle: false,
    angle: 45,
    size: 16,
  };
  state = {};

  get theme() {
    return getTheme(this);
  }

  render() {
    const {
      icon,
      iconName,
      iconColor,
      iconSize,
      size,
      angle,
      useAngle,
      locations,
      gradientColors = [this.theme.color.black, this.theme.color.white],
      containerStyle,
      style,
      ...rest
    } = this.props;

    return (
      <View
        style={[
          {
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
          },
          containerStyle,
        ]}
        {...rest}>
        <MaskedView
          style={{width: '100%', height: '100%'}}
          maskElement={
            <View
              style={{
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              {icon || (
                <Icon
                  bundle={BundleIconSetName.FONT_AWESOME_5}
                  name={iconName}
                  size={iconSize}
                  color={iconColor}
                  style={styles.icon}
                />
              )}
            </View>
          }>
          <LinearGradient
            colors={gradientColors}
            locations={locations}
            angle={angle}
            useAngle={useAngle}
            style={{flex: 1}}
          />
        </MaskedView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    // ...elevationShadowStyle(7)
  },
});

export default GradientIcon;
