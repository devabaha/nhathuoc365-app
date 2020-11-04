import config from './config';
import { Platform, StatusBar } from 'react-native';

export const show = () => {
  config.methods.show();
};

export const hide = () => {
  config.methods.hide();
};

export const showBgrStatusIfOffsetTop = (currentScene, offsetTop = 0) => {
  return event => {
    if (Platform.OS !== 'ios') return;
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset > offsetTop) {
      if (config.statusBarState[currentScene] !== config.mode.dark) {
        config.statusBarState[currentScene] = config.mode.dark;
        // show();
      }
      StatusBar.setBarStyle('dark-content', true);
    } else {
      if (config.statusBarState[currentScene] !== config.mode.light) {
        config.statusBarState[currentScene] = config.mode.light;
        // hide();
      }
      StatusBar.setBarStyle('light-content', true);
    }
  };
};
