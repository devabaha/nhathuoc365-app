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
import Themes from '../../../../Themes';
import equal from 'deep-equal';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const homeThemes = Themes.getNameSpace('home');
const  headerStyles = homeThemes('styles.home.header');

class Header extends Component {
  static defaultProps = {
    loading: false,
  };
  

  shouldComponentUpdate(nextProps, nextState) {
    return !equal(nextProps, this.props);
  }
  

  containerStyle = [
    styles.container,
    homeThemes('styles.home.header_container'),
  ];

  searchWrapperStyle = [
    styles.searchWrapper,
    homeThemes('styles.home.header_search_wrapper'),
  ];

  render() {
    const SearchIcon = homeThemes('assets.search') || Ionicons;
    const CartIcon = homeThemes('assets.cart')
      ? Animated.createAnimatedComponent(homeThemes('assets.cart'))
      : AnimatedIcon;
    const MessageIcon = homeThemes('assets.message')
      ? Animated.createAnimatedComponent(homeThemes('assets.message'))
      : AnimatedIcon;

    return (
      <Animated.View style={[styles.wrapper, this.props.wrapperStyle]}>
        <Animated.View style={[styles.maskMain, this.props.maskMainStyle]} />
        <Animated.View style={[styles.maskSub, this.props.maskSubStyle]} />
        <View style={[this.containerStyle, this.props.containerStyle]}>
          <View style={styles.userNameWrapper}>
            <TouchableOpacity
              disabled={this.props.loading}
              onPress={this.props.goToSearch}>
              <Animated.View
                style={[
                  this.searchWrapperStyle,
                  styles.maskSub,
                  // this.homeThemes('styles.home.header_mask_sub'),
                ]}
              />
              <Animated.View
                style={[
                  this.searchWrapperStyle,
                  styles.maskMain,
                  this.props.maskSearchWrapperStyle,
                ]}
              />
              <View pointerEvents="none" style={this.searchWrapperStyle}>
                <SearchIcon
                  // style={[this.homeThemes('styles.home.header_search_icon')]}
                  style={styles.searchIcon}
                  name="ios-search"
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder={store.store_data ? store.store_data.name : ''}
                  // placeholderTextColor={
                  //   this.homeThemes(
                  //     'styles.home.header_search_input_placeholder',
                  //   ).color || appConfig.colors.primary
                  // }
                  placeholderTextColor={
                    styles?.searchInputPlaceholder?.color || appConfig.colors.primary
                  }
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
            // containerStyle={this.homeThemes(
            //   'styles.home.header_right_nav_bar_icon',
            // )}
            containerStyle={styles.rightNavBarIcon}
            icon={
              <View>
                <CartIcon
                  style={[styles.icon, styles.iconMask]}
                  name="shoppingcart"
                  size={25}
                />
                <CartIcon
                  style={[styles.icon, this.props.iconStyle]}
                  name="shoppingcart"
                  size={25}
                />
              </View>
            }
          />
          <RightButtonNavBar
            onPress={this.props.onPressNoti}
            type={RIGHT_BUTTON_TYPE.CHAT}
            // containerStyle={[
            //   this.homeThemes('styles.home.header_right_nav_bar_icon'),
            //   this.homeThemes('styles.home.header_right_nav_bar_last_icon'),
            // ]}
            containerStyle={[
              styles.rightNavBarIcon,
              styles.rightNavBarLastIcon
            ]}
            style={styles.chatIconStyle}
            icon={
              <View>
                <MessageIcon
                  style={[styles.icon, styles.iconMask]}
                  name="message1"
                  size={23}
                />
                <MessageIcon
                  style={[styles.icon, this.props.iconStyle]}
                  name="message1"
                  size={23}
                />
              </View>
            }
          />
        </View>
      </Animated.View>
    );
  }
}

let styles = StyleSheet.create({
  wrapper: {
    // position: 'absolute',
    // top: 0,
    // width: '100%'
  },
  container: {
    padding: 15,
    flexDirection: 'row',
    paddingTop: Platform.select({
      // android: StatusBar.currentHeight,
      ios: appConfig.device.statusBarHeight * 1.5,
    }),
    alignItems: 'center',
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
    backgroundColor: appConfig.colors.white,
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
    backgroundColor: 'red',
  },
  notify: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  searchWrapper: {
    paddingHorizontal: 10,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchIcon: {
    color: '#ccc',
    fontSize: 20,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    paddingVertical: isAndroid ? 5 : 10,
    color: appConfig.colors.white,
  },
  chatIconStyle: {
    marginRight: 0,
  },
  loading: {
    position: 'relative',
  },
});
styles = Themes.mergeStyles(styles, headerStyles);

Header.propTypes = {
  name: PropTypes.string,
  notify: PropTypes.object,
};

Header.defaultProps = {
  name: '',
  notify: {},
};

export default withTranslation(['home', 'stores'])(Header);
