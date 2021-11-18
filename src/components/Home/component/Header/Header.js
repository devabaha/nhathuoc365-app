import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from 'react-native-button';
import appConfig from 'app-config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import store from 'app-store';
import RightButtonOrders from '../../../RightButtonOrders';
import Animated from 'react-native-reanimated';
import RightButtonChat from '../../../RightButtonChat';
import RightButtonNavBar from '../../../RightButtonNavBar';
import {RIGHT_BUTTON_TYPE} from '../../../RightButtonNavBar/constants';
import Loading from '../../../Loading';
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
import {Input} from 'src/components/base';
import { mergeStyles } from 'src/Themes/helper';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

class Header extends Component {
  static contextType = ThemeContext;

  get theme() {
    return getTheme(this);
  }

  render() {
    const searchIconStyle = mergeStyles(styles.searchIcon, {
      color: this.theme.color.onOverlay,
    });
    const searchInputStyle = mergeStyles(styles.searchInput);

    const iconStyle = mergeStyles(styles.icon, {
      color: this.theme.color.onPrimary,
    });

    const searchWrapperStyle = mergeStyles(styles.searchWrapper, {
      backgroundColor: this.theme.color.overlay30,
    });

    return (
      <Animated.View style={[styles.wrapper, this.props.wrapperStyle]}>
        <Animated.View style={[styles.maskMain, this.props.maskMainStyle]} />
        <Animated.View style={[styles.maskSub, this.props.maskSubStyle]} />
        <View style={[styles.container, this.props.containerStyle]}>
          <View
            onLayout={this.props.onContentLayout}
            style={[styles.contentContainer, this.props.contentContainer]}>
            {this.props.renderLeft()}
            <View style={styles.userNameWrapper}>
              <TouchableOpacity
                disabled={this.props.loading}
                onPress={this.props.goToSearch}>
                <Animated.View style={[searchWrapperStyle, styles.maskSub]} />
                <Animated.View
                  style={[
                    searchWrapperStyle,
                    styles.maskMain,
                    this.props.maskSearchWrapperStyle,
                  ]}
                />
                <View pointerEvents="none" style={styles.searchWrapper}>
                  <Ionicons style={searchIconStyle} name="ios-search" />
                  <Input
                    style={searchInputStyle}
                    placeholder={
                      this.props.placeholder ||
                      (store.store_data ? store.store_data.name : '')
                    }
                    placeholderTextColor={this.theme.color.onOverlay}
                    numberOfLines={1}
                  />
                  {this.props.loading && (
                    <Loading wrapperStyle={styles.loading} size="small" />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <RightButtonNavBar
              type={RIGHT_BUTTON_TYPE.SHOPPING_CART}
              icon={
                <View>
                  <AnimatedIcon
                    style={[iconStyle, styles.iconMask]}
                    name="shoppingcart"
                    size={25}
                  />
                  <AnimatedIcon
                    style={[iconStyle, this.props.iconStyle]}
                    name="shoppingcart"
                    size={25}
                  />
                </View>
              }
            />
            <RightButtonNavBar
              onPress={this.props.onPressNoti}
              type={RIGHT_BUTTON_TYPE.CHAT}
              style={styles.chatIconStyle}
              icon={
                <View>
                  <AnimatedIcon
                    style={[iconStyle, styles.iconMask]}
                    name="message1"
                    size={23}
                  />
                  <AnimatedIcon
                    style={[iconStyle, this.props.iconStyle]}
                    name="message1"
                    size={23}
                  />
                </View>
              }
            />
          </View>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    // position: 'absolute',
    // top: 0,
    // width: '100%'
  },
  container: {
    padding: 15,
    paddingBottom: 0,
    flexDirection: 'row',
    paddingTop: Platform.select({
      ios: appConfig.device.statusBarHeight * 1.5,
    }),
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
  },
  maskMain: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  maskSub: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    // backgroundColor: appConfig.colors.white
  },
  notificationWrapper: {
    top: -2,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    fontWeight: 'bold',
  },
  notificationBtn: {
    paddingTop: 12,
    paddingLeft: 8,
    paddingBottom: 8,
    position: 'relative',
  },
  icon: {
    color: '#fff',
  },
  iconMask: {
    position: 'absolute',
  },
  userNameWrapper: {
    flex: 1,
  },
  userName: {
    fontWeight: '500',
    fontSize: 16,
    color: '#FAFAFA',
  },
  userNameBold: {
    fontWeight: 'bold',
  },
  notifyWrapper: {
    position: 'absolute',
    minWidth: 16,
    paddingHorizontal: 2,
    height: 16,
    top: -8,
    right: -8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8,
  },
  notify: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  searchWrapper: {
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: 'rgba(0,0,0,.3)',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: isAndroid ? 5 : 10,
    // color: appConfig.colors.white,
  },
  chatIconStyle: {
    marginRight: 0,
  },
  loading: {
    position: 'relative',
  },
  searchIcon: {
    fontSize: 20,
    color: appConfig.colors.white,
  },
});

Header.propTypes = {
  name: PropTypes.string,
  notify: PropTypes.object,
  loading: PropTypes.bool,
  renderLeft: PropTypes.func,
};

Header.defaultProps = {
  name: '',
  notify: {},
  loading: false,
  renderLeft: () => null,
};

export default withTranslation(['home', 'stores'])(observer(Header));
