import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {getNavBarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {elevationShadowStyle} from 'app-helper';
// routing
import {pop} from 'app-helper/routing';
// context
import ProfileContext from 'src/containers/Profile/ProfileContext';
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {NavBarWrapper, TypographyType} from 'src/components/base';
// custom components
import NavBarButton from './NavBarButton';
import {Container, Typography} from 'src/components/base';

class NavBar extends Component {
  static contextType = ThemeContext;

  state = {};

  get theme() {
    return getTheme(this);
  }

  get navBarTheme() {
    return getNavBarTheme(this.theme, true);
  }

  get tilteStyle() {
    return this.navBarTheme?.titleStyle;
  }

  get iconStyle() {
    return this.navBarTheme?.iconStyle;
  }

  render() {
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
      <NavBarWrapper
        appNavBar={false}
        style={[styles.wrapper, this.navBarTheme?.headerStyle]}>
        <Container style={styles.container}>
          <Container
            animated
            style={[styles.maskBackground, animatedBackgroundMaskStyle]}
          />
          <NavBarButton
            containerStyle={styles.iconBackContainer}
            maskStyle={navBarBtnMaskStyle}
            iconName="arrowleft"
            onPress={pop}
          />
          <Typography
            animated
            // navBarTheme.titleStyle will override this type
            // this type is fallback if navBarTheme.titleStyle undefined
            type={TypographyType.TITLE_SEMI_LARGE}
            numberOfLines={2}
            style={[
              styles.title,
              this.navBarTheme?.titleStyle,
              animatedBackgroundMaskStyle,
            ]}>
            {this.props.title}
          </Typography>
          <View style={styles.right}>
            <ProfileContext.Consumer>
              {({isMainUser}) =>
                isMainUser ? (
                  <>
                    <NavBarButton
                      maskStyle={navBarBtnMaskStyle}
                      iconName="edit"
                      onPress={this.props.onEdit}
                      iconStyle={this.iconStyle}
                    />

                    <NavBarButton
                      maskStyle={navBarBtnMaskStyle}
                      iconName="logout"
                      onPress={this.props.onLogout}
                      iconStyle={this.iconStyle}
                    />
                  </>
                ) : (
                  <NavBarButton
                    maskStyle={navBarBtnMaskStyle}
                    iconName="message1"
                    onPress={this.props.onChat}
                    iconStyle={this.iconStyle}
                  />
                )
              }
            </ProfileContext.Consumer>
          </View>
        </Container>
      </NavBarWrapper>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: undefined,
    zIndex: 999,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    ...elevationShadowStyle(3, 0, 5, 0.1),
  },
  contentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height:
      36 + // height of NavBarButton
      10 * 2 + // marginVertical of navBarButton
      12 + // random number
      (appConfig.device.isAndroid ? -12 : 0),
  },
  title: {
    paddingLeft: 5,
    marginRight: 15,
    fontWeight: '600',
    flex: 1,
  },
  maskBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBackContainer: {
    marginLeft: 10,
  },
});

export default NavBar;
