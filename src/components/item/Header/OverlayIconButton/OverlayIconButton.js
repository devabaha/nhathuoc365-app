import React, {Component} from 'react';
import {
  TouchableOpacity,
  // Animated,
  StyleSheet,
} from 'react-native';
import Animated from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import appConfig from 'app-config';

const AnimatedIonicons = new Animated.createAnimatedComponent(Ionicons);
const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  icon: {
    fontSize: 24,
    color: appConfig.colors.primary,
  },
  contentOverlay: {
    position: 'absolute',
    zIndex: 1,
    color: '#fff',
  },
});

class OverlayIconButton extends Component {
  state = {};
  render() {
    return (
      <Animated.View style={this.props.wrapperStyle}>
        <TouchableOpacity
          disabled={this.props.disabled}
          onPress={this.props.onPress}>
          <Animated.View style={[styles.container, this.props.containerStyle]}>
            <Animated.View
              style={[styles.background, this.props.backgroundStyle]}
            />
            <AnimatedIonicons
              name={this.props.iconName}
              style={[styles.icon, this.props.iconStyle]}
            />
            <AnimatedIonicons
              name={this.props.iconName}
              style={[
                styles.icon,
                styles.contentOverlay,
                this.props.contentOverlayStyle,
              ]}
            />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

export default OverlayIconButton;
