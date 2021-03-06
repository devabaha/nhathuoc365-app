import {ANALYTICS_EVENTS_NAME, formatViewEvents} from './analytics';
import {PRODUCT_TYPES} from './product';
import {ORDER_TYPES} from './orders';
import appConfig from 'app-config';

const LOGIN_MODE = {
  FIREBASE: 'firebase',
  CALL: 'call',
};

const LOGIN_STEP = {
  REGISTER: 'Registering',
  GET_USER: 'User Getting',
  CONFIRM: 'Confirming',
};

export {
  ANALYTICS_EVENTS_NAME,
  formatViewEvents,
  LOGIN_MODE,
  LOGIN_STEP,
  PRODUCT_TYPES,
  ORDER_TYPES,
};

// Use with Ionicons.
export const BACK_NAV_ICON_NAME = appConfig.device.isIOS
  ? 'ios-chevron-back'
  : 'md-arrow-back';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Zocial from 'react-native-vector-icons/Zocial';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Platform} from 'react-native';

export const BUNDLE_ICON_SETS = {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Octicons,
  Zocial,
  SimpleLineIcons,
};

export type BUNDLE_ICON_SETS_NAME =
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'Fontisto'
  | 'Foundation'
  | 'Ionicons'
  | 'MaterialIcons'
  | 'MaterialCommunityIcons'
  | 'Octicons'
  | 'Zocial'
  | 'SimpleLineIcons';

export const BUNDLE_ICON_SETS_NAME = {
  AntDesign: 'AntDesign',
  Entypo: 'Entypo',
  EvilIcons: 'EvilIcons',
  Feather: 'Feather',
  FontAwesome: 'FontAwesome',
  FontAwesome5: 'FontAwesome5',
  Fontisto: 'Fontisto',
  Foundation: 'Foundation',
  Ionicons: 'Ionicons',
  MaterialIcons: 'MaterialIcons',
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  Octicons: 'Octicons',
  Zocial: 'Zocial',
  SimpleLineIcons: 'SimpleLineIcons',
};

export const MAX_DRAWER_WIDTH = 350;
export const BASE_DRAWER_WIDTH = appConfig.device.width * 0.8;
export const DRAWER_WIDTH =
  BASE_DRAWER_WIDTH > MAX_DRAWER_WIDTH ? MAX_DRAWER_WIDTH : BASE_DRAWER_WIDTH;

export const REQUEST_TYPE = {
  WARRANTY: 'warranty',
};

export const GPS_LIST_TYPE = {
  /**
   * @description list of store in a site
   */
  GPS_LIST_SITE: 'gps_list_site',
  /**
   * @description list of site
   */
  GPS_LIST_STORE: 'gps_list_store',
};

export const MEDIA_TYPE = {
  IMAGE: 'image',
  YOUTUBE_VIDEO: 'youtube',
};

export const HIT_SLOP = {
  top: 15,
  right: 15,
  bottom: 15,
  left: 15,
};

export const THEME_STORAGE_KEY = 'theme_storage_key';

export const EULA_AGREEMENT_USER_DECISION_DATA_KEY =
  'eulaAgreementUserDecisionData';

export const EULA_AGREEMENT_LAST_UPDATED = '2022-01-12';

export const NAV_BAR_HEIGHT = Platform.select({
  ios: 44,
  android: 54,
  windows: 54,
});

export const STATUS_SUCCESS = 200;
