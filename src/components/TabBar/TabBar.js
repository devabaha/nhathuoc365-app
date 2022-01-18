import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
// configs
import appConfig from 'app-config';
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

  get theme() {
    return getTheme(this);
  }

  get containerStyle() {
    return {
      borderTopWidth: this.theme.layout.borderWidthPixel,
      borderColor: this.theme.color.border,
    };
  }

  render() {
    const {state} = this.props.navigation;
    const activeTabIndex = state.index;

    return (
      <Container shadow row style={[styles.container, this.containerStyle]}>
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
  },
});

export default observer(TabBar);
