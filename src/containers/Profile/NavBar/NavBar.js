import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import appConfig from 'app-config';
import ProfileContext from '../ProfileContext';
import NavBarButton from './NavBarButton';

class NavBar extends Component {
  static contextType = ProfileContext;
  state = {};

  render() {
    const {
      animatedScroll,
      animatedInputRange,
      animatedVisibleNavBar,
      isMainUser,
    } = this.context;
    const animatedBackgroundMaskStyle = {
      // opacity: animatedVisibleNavBar,
      // animatedScroll.interpolate({
      //   inputRange: animatedInputRange,
      //   outputRange: [0, 1],
      // }),
    };
    const navBarBtnMaskStyle = {
      // opacity: animatedVisibleNavBar.interpolate({
      //   inputRange: [0, 1],
      //   outputRange: [1, 0],
      // }),
    };

    return (
      <View style={styles.container}>
        <Animated.View
          style={[styles.maskBackground, animatedBackgroundMaskStyle]}
        />
        <SafeAreaView style={styles.wrapper}>
          <NavBarButton
            containerStyle={styles.iconBackContainer}
            maskStyle={navBarBtnMaskStyle}
            iconName="arrowleft"
            onPress={Actions.pop}
          />
          <Animated.Text
            numberOfLines={2}
            style={[styles.title, animatedBackgroundMaskStyle]}>
            {this.props.title}
          </Animated.Text>
          <View style={styles.right}>
            {isMainUser ? (
              <>
                <NavBarButton
                  maskStyle={navBarBtnMaskStyle}
                  iconName="edit"
                  onPress={this.props.onEdit}
                />

                <NavBarButton
                  maskStyle={navBarBtnMaskStyle}
                  iconName="logout"
                  onPress={this.props.onLogout}
                />
              </>
            ) : (
              <NavBarButton
                  maskStyle={navBarBtnMaskStyle}
                  iconName="message1"
                  onPress={this.props.onChat}
                />
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // position: 'absolute',
    zIndex: 999,
    width: '100%',
    // ...elevationShadowStyle(5)
    backgroundColor: '#fff',
    ...elevationShadowStyle(3),
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height:
      36 + // height of NavBarButton
      10 * 2 + // marginVertical of navBarButton
      12 + // random number
      (appConfig.device.isAndroid
        ? -12
        : appConfig.device.isIphoneX
        ? appConfig.device.statusBarHeight
        : 0),
  },
  title: {
    paddingLeft: 5,
    marginRight: 15,
    fontWeight: '600',
    flex: 1,
    color: '#333',
    fontSize: 18,
  },
  maskBackground: {
    position: 'absolute',
    backgroundColor: appConfig.colors.white,
    width: '100%',
    height: '100%',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 15,
    marginVertical: 10,
    backgroundColor: 'rgba(0,0,0,.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBtnContainer: {
    paddingLeft: 1,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  iconBackContainer: {
    marginLeft: 10,
  },
  icon: {
    fontSize: 20,
    color: '#fff',
    ...elevationShadowStyle(7),
  },
});

export default NavBar;
