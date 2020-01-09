import { Dimensions, Platform } from 'react-native';
import { getStatusBarHeight, isIphoneX } from 'react-native-iphone-x-helper';

export const { width: WIDTH, height: HEIGHT } = Dimensions.get('screen');

export const isAndroid = Platform.OS === 'android';
export const isIos = Platform.OS === 'ios';

export const HIT_SLOP = { right: 15, top: 15, left: 15, bottom: 15 };

export const config = {
  blurColor: '#929493',
  focusColor: '#1a94fd'
};

export const HEADER_HEIGHT = isIos
  ? isIphoneX()
    ? getStatusBarHeight() + 60
    : 64
  : 56;
