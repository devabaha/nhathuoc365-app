import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import Animated from 'react-native-reanimated';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import {Icon, BaseButton} from 'src/components/base';

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
  },
  icon: {
    fontSize: 22,
  },
  contentOverlay: {
    position: 'absolute',
    zIndex: 1,
  },
  iconOverlay: {},
  disabled: {
    opacity: 0.3,
  },
});

class OverlayIconButton extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    disabled: PropTypes.bool,
    renderMainIcon: PropTypes.func,
    renderOverlayIcon: PropTypes.func,
  };

  state = {};

  get theme() {
    return getTheme(this);
  }

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
      return this.props.renderMainIcon(this.iconStyle);
    }

    return (
      <Icon
        reanimated
        bundle={BundleIconSetName.IONICONS}
        name={this.props.iconName}
        style={[this.iconStyle, this.props.iconStyle]}
      />
    );
  };

  renderOverlayIcon = () => {
    if (typeof this.props.renderOverlayIcon === 'function') {
      return this.props.renderOverlayIcon(
        this.iconStyle,
        this.iconOverlayStyle,
        styles.contentOverlay,
      );
    }

    return (
      <Icon
        reanimated
        bundle={BundleIconSetName.IONICONS}
        name={this.props.iconName}
        style={[
          this.iconStyle,
          this.iconOverlayStyle,
          styles.contentOverlay,
          this.props.contentOverlayStyle,
        ]}
      />
    );
  };

  get iconStyle() {
    return mergeStyles(styles.icon, {
      color: this.theme.color.primaryHighlight,
    });
  }

  get iconOverlayStyle() {
    return mergeStyles(styles.iconOverlay, {
      color: this.theme.color.onOverlay,
    });
  }

  get backgroundStyle() {
    return {
      backgroundColor: this.theme.color.overlay60,
    };
  }

  render() {
    return (
      <Animated.View
        onStartShouldSetResponderCapture={() => this.props.disabled}
        style={this.props.wrapperStyle}>
        <BaseButton
          hitSlop={HIT_SLOP}
          disabled={this.props.disabled}
          onPress={this.props.onPress}>
          <Animated.View
            style={[
              styles.container,
              this.props.disabled && styles.disabled,
              this.props.containerStyle,
            ]}>
            <Animated.View
              style={[
                styles.background,
                this.backgroundStyle,
                this.props.backgroundStyle,
              ]}
            />
            {this.renderMainIcon()}
            {this.renderOverlayIcon()}
          </Animated.View>
        </BaseButton>
      </Animated.View>
    );
  }
}

export default OverlayIconButton;
