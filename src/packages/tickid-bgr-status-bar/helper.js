import config from './config';
import { Platform, StatusBar } from 'react-native';
import appConfig from 'app-config';

export const show = () => {
  config.methods.show();
};

export const hide = () => {
  config.methods.hide();
};

export const showBgrStatusIfOffsetTop = (currentScene, offsetTop = 0) => {
  return event => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset > offsetTop) {
      if (Platform.OS === 'ios') {
        if (config.statusBarState[currentScene] !== config.mode.dark) {
          config.statusBarState[currentScene] = config.mode.dark;
          // show();
        }
        StatusBar.setBarStyle('dark-content', true);
      } else {
        StatusBar.setBackgroundColor('#000');
      }
    } else {
      if (Platform.OS === 'ios') {
        if (config.statusBarState[currentScene] !== config.mode.light) {
          config.statusBarState[currentScene] = config.mode.light;
          // hide();
        }
        StatusBar.setBarStyle('light-content', true);
      } else {
        StatusBar.setBackgroundColor(appConfig.colors.primary);
      }
    }
  };
};
