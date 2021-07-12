import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

class GradientIcon extends PureComponent {
  static defaultProps = {
    icon: null,
    gradientColors: ['#000', '#fff'],
    locations: [0.3, 0.6],
    useAngle: false,
    angle: 45,
    size: 16
  };
  state = {};

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
      gradientColors,
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
            justifyContent: 'center'
          },
          containerStyle
        ]}
        {...rest}
      >
        <MaskedView
          style={{ width: '100%', height: '100%' }}
          maskElement={
            <View
              style={{
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
              }}
            >
              {icon || (
                <Icon
                  name={iconName}
                  size={iconSize}
                  color={iconColor}
                  style={styles.icon}
                />
              )}
            </View>
          }
        >
          <LinearGradient
            colors={gradientColors}
            locations={locations}
            angle={angle}
            useAngle={useAngle}
            style={{ flex: 1 }}
          />
        </MaskedView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    // ...elevationShadowStyle(7)
  }
});

export default GradientIcon;
