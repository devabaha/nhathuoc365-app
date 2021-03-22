import React, {Component} from 'react';
import {
  TouchableOpacity,
  // Animated,
  StyleSheet,
  ViewPropTypes,
  Text,
} from 'react-native';
import Animated from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import appConfig from 'app-config';
import PropTypes from 'prop-types';

const AnimatedIonicons = new Animated.createAnimatedComponent(Ionicons);
const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    width: 38,
    height: 38,
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
    fontSize: 22,
    color: appConfig.colors.primary,
  },
  contentOverlay: {
    position: 'absolute',
    zIndex: 1,
  },
  iconOverlay: {
    color: '#fff',
  },
});

class OverlayIconButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    renderMainIcon: PropTypes.func,
    renderOverlayIcon: PropTypes.func,
  };

  state = {};

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.disabled !== this.props.disabled ||
      nextProps.iconName !== this.props.iconName ||
      nextProps.containerStyle !== this.props.containerStyle ||
      nextProps.iconStyle !== this.props.iconStyle ||
      nextProps.contentOverlayStyle !== this.props.contentOverlayStyle
    ) {
      return true;
    }
    return false;
  }

  renderMainIcon = () => {
    if (typeof this.props.renderMainIcon === 'function') {
      return this.props.renderMainIcon(styles.icon);
    }

    return (
      <AnimatedIonicons
        name={this.props.iconName}
        style={[styles.icon, this.props.iconStyle]}
      />
    );
  };

  renderOverlayIcon = () => {
    if (typeof this.props.renderOverlayIcon === 'function') {
      return this.props.renderOverlayIcon(
        styles.icon,
        styles.iconOverlay,
        styles.contentOverlay,
      );
    }

    return (
      <AnimatedIonicons
        name={this.props.iconName}
        style={[
          styles.icon,
          styles.iconOverlay,
          styles.contentOverlay,
          this.props.contentOverlayStyle,
        ]}
      />
    );
  };

  render() {
    return (
      <Animated.View style={this.props.wrapperStyle}>
        <TouchableOpacity
          hitSlop={HIT_SLOP}
          disabled={this.props.disabled}
          onPress={this.props.onPress}>
          <Animated.View style={[styles.container, this.props.containerStyle]}>
            <Animated.View
              style={[styles.background, this.props.backgroundStyle]}
            />
            {this.renderMainIcon()}
            {this.renderOverlayIcon()}
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

export default OverlayIconButton;
