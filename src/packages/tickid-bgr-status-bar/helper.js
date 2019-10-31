import config from './config';
import { Platform, StatusBar } from 'react-native';

export const show = () => {
  config.methods.show();
};

export const hide = () => {
  config.methods.hide();
};

let statusBarStyle;

export const showBgrStatusIfOffsetTop = (currentScene, offsetTop = 0) => {
  return event => {
    if (Platform.OS !== 'ios') return;
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset > offsetTop) {
      if (statusBarStyle !== config.mode.dark) {
        show();
        statusBarStyle = config.mode.dark;
        config.statusBarState[currentScene] = config.mode.dark;
      }
      StatusBar.setBarStyle('dark-content', true);
    } else {
      if (statusBarStyle !== config.mode.light) {
        hide();
        statusBarStyle = config.mode.light;
        config.statusBarState[currentScene] = config.mode.light;
      }
      StatusBar.setBarStyle('light-content', true);
    }
  };
};
