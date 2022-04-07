import config from './config';
import {Platform, StatusBar} from 'react-native';
import store from 'app-store';

export const show = () => {
  config.methods.show();
};

export const hide = () => {
  config.methods.hide();
};

export const showBgrStatusIfOffsetTop = (currentScene, offsetTop = 0) => {
  return (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset > offsetTop) {
      if (Platform.OS === 'ios') {
        if (config.statusBarState[currentScene] !== config.mode.dark) {
          config.statusBarState[currentScene] = config.mode.dark;
          // show();
        }
        StatusBar.setBarStyle(
          store.theme?.layout?.statusBarSurfaceModeStyle,
          true,
        );
      } else {
        // StatusBar.setBarStyle('dark-content');
        // StatusBar.setBackgroundColor(store.theme?.color?.surface);
        // store.setHomeBarBackgroundColor(store.theme?.color?.surface);
      }
    } else {
      if (Platform.OS === 'ios') {
        if (config.statusBarState[currentScene] !== config.mode.light) {
          config.statusBarState[currentScene] = config.mode.light;
          // hide();
        }
        StatusBar.setBarStyle(store.theme?.layout?.statusBarStyle, true);
      } else {
        // StatusBar.setBarStyle('light-content');
        // StatusBar.setBackgroundColor(store.theme?.color?.navBarBackground);
        // store.setHomeBarBackgroundColor(store.theme?.color?.navBarBackground);
      }
    }
  };
};
