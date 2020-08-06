import React, { Component } from 'react';
import appConfig from 'app-config';
import PropTypes from 'prop-types';
import {
  StatusBar,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Animated
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeExchangesSVG from '../../../images/home_exchanges.svg';
import Button from 'react-native-button';

const defaultListener = () => {};

class NavBar extends Component {
  static propTypes = {
    onPressLeft: PropTypes.func,
    onSearch: PropTypes.func,
    onClearText: PropTypes.func,
    placeholder: PropTypes.string,
    searchValue: PropTypes.string
  };

  static defaultProps = {
    onPressLeft: defaultListener,
    onSearch: defaultListener,
    onClearText: defaultListener,
    placeholder: '',
    searchValue: ''
  };

  handleLeftPress = () => {
    if (this.props.back) {
      Actions.pop();
    }
    this.props.onPressLeft();
  };

  handleRightPress = () => {
    this.props.onPressRight();
  };

  renderIcon(CustomIcon, iconSize, iconName) {
    return (
      <CustomIcon
        size={iconSize}
        color="#fff"
        style={[styles.icon]}
        name={iconName}
      />
    );
  }

  renderLeft() {
    if (!this.props.back) return;
    const CustomIcon = appConfig.device.isIOS ? Ionicons : Icon;
    const iconName = appConfig.device.isIOS ? 'ios-arrow-back' : 'arrow-left';
    const iconSize = appConfig.device.isIOS ? 30 : 25;
    const pressColor = 'rgba(0,0,0,.32)';

    /*
     * TouchableNativeFeedback.Ripple causes a crash on old Android versions,
     * therefore only enable it on Android Lollipop and above.
     *
     * All touchables on Android should have the ripple effect according to
     * platform design guidelines.
     * We need to pass the background prop to specify a borderless ripple effect.
     */
    if (Platform.OS === 'android' && Platform.Version >= 21) {
      return (
        <TouchableNativeFeedback
          onPress={this.handleLeftPress}
          background={TouchableNativeFeedback.Ripple(pressColor, true)}
          accessible
          accessibilityComponentType="button"
          hitSlop={HIT_SLOP}
        >
          <View style={[styles.cancelButton, { borderRadius: 20 }]}>
            {this.renderIcon(CustomIcon, iconSize, iconName)}
          </View>
        </TouchableNativeFeedback>
      );
    }

    return (
      <Button
        containerStyle={styles.cancelButton}
        onPress={this.handleLeftPress}
      >
        {this.renderIcon(CustomIcon, iconSize, iconName)}
      </Button>
    );
  }

  renderMiddle() {
    if (this.props.renderTitle) {
      return this.props.renderTitle({ style: styles.text });
    }
    return <Text style={styles.text}>{this.props.title}</Text>;
  }

  renderRight() {
    if (!this.props.back) {
      return (
        <Button
          containerStyle={styles.rightButton}
          onPress={this.handleRightPress}
        >
          <HomeExchangesSVG
            width={25}
            height={25}
            fill="#fff"
            style={styles.icon}
          />
        </Button>
      );
    }

    return null;
  }

  render() {
    return (
      <Animated.View style={[styles.container, this.props.containerStyle]}>
        <Animated.View style={[styles.mask, this.props.maskStyle]} />
        <View style={styles.wrapper}>
          {this.renderLeft()}
          {this.renderMiddle()}
          {this.renderRight()}
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
    ...Platform.select({
      ios: {
        height: 64
      },
      android: {
        height: 54
      },
      windows: {
        height: 54
      }
    }),
    paddingTop: Platform.select({
      ios: appConfig.device.isIphoneX ? 50 : 24,
      android: 0
    }),
    width: appConfig.device.width,
    overflow: 'hidden'
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10
  },
  mask: {
    position: 'absolute',
    width: appConfig.device.width,
    height: 100,
    backgroundColor: appConfig.colors.primary,
    opacity: 0
  },
  cancelButton: {
    position: 'absolute',
    paddingHorizontal: 16,
    zIndex: 1
  },
  rightButton: {
    position: 'absolute',
    paddingHorizontal: 16,
    zIndex: 1,
    right: 0
  },
  cancelText: {
    fontSize: 16,
    color: '#fff'
  },
  icon: {},
  clearWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  searchWrapper: {
    zIndex: 999,
    flex: 1,
    height: 38,
    width: '100%',
    paddingLeft: 10,
    maxWidth: appConfig.device.width * 0.8,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#696969',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    ...ifIphoneX(
      {
        marginTop: 4,
        marginBottom: 8
      },
      {
        marginVertical: Platform.OS === 'ios' ? 6 : 8
      }
    )
  },
  text: {
    fontSize: 16,
    width: appConfig.device.width,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center'
  }
});

export default NavBar;
