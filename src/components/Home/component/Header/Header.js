import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar
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
import { RIGHT_BUTTON_TYPE } from '../../../RightButtonNavBar/constants';
import Loading from '../../../Loading';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

class Header extends Component {
  static defaultProps = {
    loading: false
  };

  render() {
    const {t} = this.props;
    const {notify} = store;
    return (
      <Animated.View style={[styles.wrapper, this.props.wrapperStyle]}>
        <Animated.View style={[styles.maskMain, this.props.maskMainStyle]} />
        <Animated.View style={[styles.maskSub, this.props.maskSubStyle]} />
        <View style={[styles.container, this.props.containerStyle]}>
          <View style={styles.userNameWrapper}>
            <TouchableOpacity
              disabled={this.props.loading}
              onPress={this.props.goToSearch}
            >
              <Animated.View style={[styles.searchWrapper, styles.maskSub]} />
              <Animated.View
                style={[
                  styles.searchWrapper,
                  styles.maskMain,
                  this.props.maskSearchWrapperStyle
                ]}
              />
              <View pointerEvents="none" style={styles.searchWrapper}>
                <Ionicons
                  size={20}
                  color="#ccc"
                  style={styles.searchIcon}
                  name="ios-search"
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder={store.store_data ? store.store_data.name : ''}
                  placeholderTextColor={appConfig.colors.primary}
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
                  style={[styles.icon, styles.iconMask]}
                  name="shoppingcart"
                  size={25}
                />
                <AnimatedIcon
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
            style={styles.chatIconStyle}
            icon={
              <View>
                <AnimatedIcon
                  style={[styles.icon, styles.iconMask]}
                  name="message1"
                  size={23}
                />
                <AnimatedIcon
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

const styles = StyleSheet.create({
  wrapper: {
    // position: 'absolute',
    // top: 0,
    // width: '100%'
  },
  container: {
    padding: 15,
    flexDirection: 'row',
    paddingTop: Platform.select({
      ios: appConfig.device.statusBarHeight * 1.5,
    }),
    alignItems: 'center'
  },
  maskMain: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  maskSub: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: appConfig.colors.white
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
    position: 'relative'
  },
  icon: {
    color: '#fff'
  },
  iconMask: {
    position: 'absolute'
  },
  userNameWrapper: {
    flex: 1
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
    backgroundColor: 'red'
  },
  notify: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600'
  },
  searchWrapper: {
    paddingHorizontal: 10,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row'
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: isAndroid ? 5 : 10,
    color: appConfig.colors.white
  },
  chatIconStyle: {
    marginRight: 0
  },
  loading: {
    position: 'relative'
  }
});

Header.propTypes = {
  name: PropTypes.string,
  notify: PropTypes.object,
};

Header.defaultProps = {
  name: '',
  notify: {},
};

export default withTranslation(['home', 'stores'])(Header);
