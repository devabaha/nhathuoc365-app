import React, {Component} from 'react';
import {Animated, StyleSheet, Easing} from 'react-native';
// 3-party libs
import {reaction} from 'mobx';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {jump} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {NAV_BAR_HEIGHT} from 'src/constants';
// custom components
import {Container, BaseButton} from 'src/components/base';
import TabIcon from './TabIcon';
import handleTabBarOnPress from 'app-helper/handleTabBarOnPress';

class TabBar extends Component {
  static contextType = ThemeContext;

  animatedTabBarValue = new Animated.Value(store.isHideTabbar ? 0 : 1);
  hideTabbarDisposer = () => {};

  componentDidMount() {
    this.hideTabbarDisposer = reaction(
      () => store.isHideTabbar,
      this.handleHideTabbar,
    );
  }

  componentWillUnmount() {
    this.hideTabbarDisposer();
  }

  get theme() {
    return getTheme(this);
  }

  handleHideTabbar = (isHide) => {
    Animated.timing(this.animatedTabBarValue, {
      toValue: isHide ? 0 : 1,
      duration: 250,
      easing: Easing.quad,
      useNativeDriver: true,
    }).start();
  };

  get containerStyle() {
    return {
      borderTopWidth: this.theme.layout.borderWidthPixel,
      borderColor: this.theme.color.border,
      opacity: this.animatedTabBarValue,
      position: store.isHideTabbar ? 'absolute' : 'relative',
    };
  }

  render() {
    const {state} = this.props.navigation;
    const activeTabIndex = state.index;

    return (
      <Container
        animated
        shadow
        row
        pointerEvents={store.isHideTabbar ? 'none' : 'auto'}
        style={[styles.container, this.containerStyle]}>
        {state.routes.map((element, index) => {
          return (
            <BaseButton
              key={element.key}
              onPress={() =>
                handleTabBarOnPress({
                  ...element,
                  theme: this.theme,
                  defaultHandler: () => {
                    jump(element.key, element.routes[0].params, this.theme);
                  },
                })
              }>
              <TabIcon
                focused={activeTabIndex === index}
                {...element.routes[0].params}
              />
            </BaseButton>
          );
        })}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: NAV_BAR_HEIGHT + appConfig.device.bottomSpace,
    bottom: 0,
  },
});

export default observer(TabBar);
