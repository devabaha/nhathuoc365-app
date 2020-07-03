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
import Button from 'react-native-button';

const defaultListener = () => {};

class NavBar extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    onSearch: PropTypes.func,
    onClearText: PropTypes.func,
    placeholder: PropTypes.string,
    searchValue: PropTypes.string
  };

  static defaultProps = {
    onCancel: defaultListener,
    onSearch: defaultListener,
    onClearText: defaultListener,
    placeholder: '',
    searchValue: ''
  };

  renderLeft() {
    const BackIcon = appConfig.device.isIOS ? Ionicons : Icon;
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
          onPress={() => {
            Actions.pop();
            this.props.onCancel();
          }}
          // background={TouchableNativeFeedback.Ripple(pressColor, true)}
          // accessible
          // accessibilityComponentType="button"
        >
          <View style={[styles.cancelButton, { borderRadius: 20 }]}>
            <BackIcon
              size={iconSize}
              color="#fff"
              style={styles.searchIcon}
              name={iconName}
            />
          </View>
        </TouchableNativeFeedback>
      );
    }

    return (
      <Button
        containerStyle={styles.cancelButton}
        onPress={() => {
          Actions.pop();
          this.props.onCancel();
        }}
      >
        <BackIcon
          size={iconSize}
          color="#fff"
          style={styles.searchIcon}
          name={iconName}
        />
      </Button>
    );
  }

  renderMiddle() {
    if (this.props.renderTitle) {
      return this.props.renderTitle({ style: styles.text });
    }
    return <Text style={styles.text}>{this.props.title}</Text>;
  }

  render() {
    return (
      <Animated.View style={[styles.container, this.props.containerStyle]}>
        <Animated.View style={[styles.mask, this.props.maskStyle]} />
        <View style={styles.wrapper}>
          {this.renderLeft()}
          {this.renderMiddle()}
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
    paddingTop: Platform.select({
      ios: appConfig.device.isIphoneX ? 50 : 24,
      android: StatusBar.currentHeight
    }),
    paddingBottom: 7,
    width: appConfig.device.width,
    overflow: 'hidden'
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  mask: {
    position: 'absolute',
    width: appConfig.device.width,
    height: 100,
    backgroundColor: appConfig.colors.primary,
    opacity: 0
  },
  cancelButton: {
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  cancelText: {
    fontSize: 16,
    color: '#fff'
  },
  searchIcon: {
    position: 'relative',
    top: 2
  },
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
    position: 'absolute',
    fontSize: 16,
    width: appConfig.device.width,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center'
  }
});

export default NavBar;
