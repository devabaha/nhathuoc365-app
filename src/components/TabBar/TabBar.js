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
          console.log(element);
          return (
            <BaseButton
              key={element.key}
              onPress={() => jump(element.key)}
              onPress={() =>
                handleTabBarOnPress({
                  ...element,
                  theme: this.theme,
                  defaultHandler: () => jump(element.key),
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
    height: 44 + appConfig.device.bottomSpace,
  },
});

export default observer(TabBar);
