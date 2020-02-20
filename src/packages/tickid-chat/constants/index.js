import { Dimensions, Platform, StatusBar } from 'react-native';
import {
  getStatusBarHeight,
  isIphoneX as isIphoneXHelper,
  getBottomSpace
} from 'react-native-iphone-x-helper';
import DeviceInfo from 'react-native-device-info';

export const { width: WIDTH, height: HEIGHT } = Dimensions.get('screen');
export const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get(
  'window'
);

export const isAndroid = Platform.OS === 'android';
export let isAndroidEmulator = false;
DeviceInfo.isEmulator().then(isEmulator => {
  isAndroidEmulator = isAndroid && isEmulator;
});
export const isIos = Platform.OS === 'ios';
export const isIphoneX = isIphoneXHelper();

export const HIT_SLOP = { right: 10, top: 10, left: 10, bottom: 10 };

export const config = {
  blurColor: '#929493',
  focusColor: '#1a94fd'
};

export const IMAGE_ICON_TYPE = 'image';

export const BOTTOM_OFFSET_GALLERY = HEIGHT / 3.3;
export const DURATION_SHOW_GALLERY = 300;

export const BOTTOM_SPACE_IPHONE_X = isIphoneX ? getBottomSpace() : 0;
export const MIN_HEIGHT_COMPOSER = 44;

export const ANDROID_STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0;
export const ANDROID_EXTRA_DIMENSIONS_HEIGHT = HEIGHT - WINDOW_HEIGHT;
export const EXTRA_DIMENSIONS_HEIGHT =
  ANDROID_EXTRA_DIMENSIONS_HEIGHT !== 0
    ? ANDROID_EXTRA_DIMENSIONS_HEIGHT
    : ANDROID_STATUS_BAR_HEIGHT;

export const HEADER_HEIGHT = isIos
  ? isIphoneX
    ? getStatusBarHeight() + 60
    : 64
  : 56 + ANDROID_STATUS_BAR_HEIGHT;

export const COMPONENT_TYPE = {
  _NONE: {
    id: -1,
    name: 'none'
  },
  GALLERY: {
    id: 0,
    name: 'gallery'
  },
  PIN: {
    id: 1,
    name: 'pin'
  }
};
