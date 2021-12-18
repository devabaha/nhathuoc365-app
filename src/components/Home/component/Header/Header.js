import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, Platform} from 'react-native';
// 3-party libs
import Animated from 'react-native-reanimated';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
//constants
import {RIGHT_BUTTON_TYPE} from 'src/components/RightButtonNavBar/constants';
import {BundleIconSetName} from 'src/components/base';
// custom components
import RightButtonNavBar from 'src/components/RightButtonNavBar';
import Loading from 'src/components/Loading';
import {BaseButton, Container, Input, Icon} from 'src/components/base';

class Header extends Component {
  static contextType = ThemeContext;

  get theme() {
    return getTheme(this);
  }

  get searchIconStyle() {
    return mergeStyles(styles.searchIcon, {
      color: this.theme.color.onOverlay,
    });
  }

  get searchInputStyle() {
    return mergeStyles(styles.searchInput);
  }

  get iconStyle() {
    return {
      color: this.theme.color.onPrimary,
    };
  }

  get searchWrapperStyle() {
    return mergeStyles(styles.searchWrapper, {
      backgroundColor: this.theme.color.overlay30,
      borderRadius: this.theme.layout.borderRadiusGigantic,
    });
  }

  render() {
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
              <BaseButton
                disabled={this.props.loading}
                onPress={this.props.goToSearch}>
                <Container
                  reanimated
                  style={[this.searchWrapperStyle, styles.maskSub]}
                />
                <Container
                  reanimated
                  style={[
                    this.searchWrapperStyle,
                    styles.maskMain,
                    this.props.maskSearchWrapperStyle,
                  ]}
                />
                <View pointerEvents="none" style={styles.searchWrapper}>
                  <Icon
                    bundle={BundleIconSetName.IONICONS}
                    style={this.searchIconStyle}
                    name="ios-search"
                  />
                  <Input
                    style={this.searchInputStyle}
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
              </BaseButton>
            </View>

            <RightButtonNavBar
              type={RIGHT_BUTTON_TYPE.SHOPPING_CART}
              icon={
                <View>
                  <Icon
                    bundle={BundleIconSetName.ANT_DESIGN}
                    reanimated
                    style={[this.iconStyle, styles.iconMask]}
                    name="shoppingcart"
                    size={25}
                  />
                  <Icon
                    bundle={BundleIconSetName.ANT_DESIGN}
                    reanimated
                    style={[this.iconStyle, this.props.iconStyle]}
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
                  <Icon
                    bundle={BundleIconSetName.ANT_DESIGN}
                    reanimated
                    style={[this.iconStyle, styles.iconMask]}
                    name="message1"
                    size={23}
                  />
                  <Icon
                    bundle={BundleIconSetName.ANT_DESIGN}
                    reanimated
                    style={[this.iconStyle, this.props.iconStyle]}
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
    // padding: 15,
    // paddingBottom: 0,
    flexDirection: 'row',
    // paddingTop: Platform.select({
    //   ios: appConfig.device.statusBarHeight * 1.5,
    // }),
    alignItems: 'center',
  },
  contentContainer: {
    padding: 15,

    flexDirection: 'row',
    alignItems: 'center',
    // paddingBottom: 15,
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
  icon: {},
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
    alignItems: 'center',
    flexDirection: 'row',
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
