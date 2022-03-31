import React from 'react';
import { View, Platform, LayoutAnimation, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import getTickUniqueID from '../util/getTickUniqueID';
import appConfig from 'app-config';
import Events from './Events';
global.Events = Events;

import {CachedImage, CachedImageBackground} from 'react-native-img-cache';
global.CachedImage = CachedImage;
global.CachedImageBackground = CachedImageBackground;

global.AsyncStorage = AsyncStorage;

// center text
import CenterText from '../components/CenterText';
global.CenterText = CenterText;

// components
import Indicator from '../components/Indicator';
global.Indicator = Indicator;

// action for mobx
import {action} from 'mobx';
global.action = action;

// observer from mobx-react
import {observer} from 'mobx-react';
global.observer = observer;

// withTranslation from react-i18next
import {withTranslation} from 'react-i18next';
global.withTranslation = withTranslation;

// useTranslation from react-i18next
import {useTranslation} from 'react-i18next';
global.useTranslation = useTranslation;

// lodash
import _ from 'lodash';
global._ = _;

// APIHandler
import APIHandler from '../network/APIHandler';
global.APIHandler = APIHandler;

// default message toast error
global.defaultToastError = () => Toast.show(MESSAGE_OTHER_ERROR, Toast.SHORT);

// function money format
// add prototype for Number
Number.prototype.formatMoney = function (c, d, t) {
  var n = this,
    c = isNaN((c = Math.abs(c))) ? 0 : c,
    d = d == undefined ? '.' : d,
    t = t == undefined ? '.' : t,
    s = n < 0 ? '-' : '',
    i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c)))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  return (
    s +
    (j ? i.substr(0, j) + t : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : '')
  );
};

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

function isURL(s) {
  var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(s);
}
global.isURL = isURL;

global.isLinkTickID = (s) => {
  var regexp = /(abaha)/;
  return regexp.test(s);
};

global.isWalletAddress = (address) => {
  return /^(0x|0y|0z)[0-9a-fA-F]{40}$/.test(address);
};

global.isWalletAddressWithZoneCode = (str) => {
  var addresses = str.split('|');
  if (addresses[1] && isWalletAddress(addresses[0])) {
    return addresses;
  } else {
    return false;
  }
};

//Kiem tra la ma tai khoan
global.isAccountCode = (address) => {
  return /^(0x)[0-9a-z]{10}$/.test(address);
};

//Kiem tra la ma tai khoan
global.isCartCode = (address) => {
  return /^(00)[0-9a-z]{9}$/.test(address);
};

global.stristr = (haystack, needle, bool) => {
  var pos = 0;
  haystack += '';
  pos = haystack.toLowerCase().indexOf((needle + '').toLowerCase());
  if (pos === -1) {
    return false;
  } else {
    if (bool) {
      return haystack.substr(0, pos);
    } else {
      return haystack.slice(pos);
    }
  }
};
// cut first word
global.cutFirstWord = (words) => {
  if (typeof words != 'string') return;

  var sortName = [];
  words.split(' ').map((word, index) => {
    sortName.push(word.split('')[0]);
  });

  return sortName.join('').toUpperCase();
};

// Layout Animation
// if (isAndroid) {
//   UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
// }
global.layoutAnimation = (animate) => {
  animate = typeof animate == 'undefined' ? 'easeInEaseOut' : animate;
  if (LayoutAnimation[animate]) {
    LayoutAnimation[animate]();
  }
};

// import EventTracker from "../helper/EventTracker";
// global.EventTracker = new EventTracker();
/**
 * Flash message
 */
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
global.FlashMessage = FlashMessage;

global.flashMessageSuccessTheme = {
  color: 'white',
  backgroundColor: '#007E33',
};
global.flashMessageDangerTheme = {
  color: 'white',
  backgroundColor: '#CC0000',
};
global.flashMessageInfoTheme = {
  color: 'white',
  backgroundColor: '#0099CC',
};
global.flashMessageWarningTheme = {
  color: 'white',
  backgroundColor: '#FF8800',
};

global.flashShowMessage = (props) => {
  let theme = {};
  switch (props.type) {
    case 'danger':
      theme = flashMessageDangerTheme;
      break;
    case 'success':
      theme = flashMessageSuccessTheme;
      break;
    case 'info':
      theme = flashMessageInfoTheme;
      break;
    case 'warning':
      theme = flashMessageWarningTheme;
      break;
    default:
      break;
  }
  showMessage({...props, ...theme});
};

global.flashHideMessage = hideMessage;

/**
 * Toast
 */
import Toast from 'react-native-simple-toast';
global.Toast = Toast;

/**
 * Lib: react-native-device-info
 * Docs: https://github.com/rebeccahughes/react-native-device-info
 * Use: DeviceInfo.propertiesName()
 * E.g: DeviceInfo.DeviceInfo()
 */
import DeviceInfo from 'react-native-device-info';
global.DeviceInfo = DeviceInfo;

/**
 * Lib: react-native-storage
 * Docs: https://github.com/sunnylqm/react-native-storage
 * Use: storage.save(), storage.load(), storage.remove()...
 * E.g:
 */
import Storage from 'react-native-storage';
var storage = new Storage({
  size: 30000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
  sync: {},
});
global.storage = storage;

/**
 * Lib: react-native-md5
 * Docs: https://github.com/kmend/react-native-md5
 * Use: call md5(encode_string)
 */
import encoding from 'react-native-md5';
global.md5 = (str) => encoding.hex_md5(str);

global.validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// 4 Digi Password
global.validate4DigiPassword = (password) => {
  var re = /^[0-9]{4}$/;
  return re.test(String(password).toLowerCase());
};

// 10 Digi
global.validatePhonenumber = (password) => {
  var re = /^[0-9]{10}$/;
  return re.test(String(password).toLowerCase());
};

// money >= 0 && is a number
global.validateMoney = (money) => {
  if (!isNaN(money)) {
    return money >= 0;
  }
  return false;
};

/**
 * Get timestamp
 * Use: call time() everywhere
 */
global.time = () => new Date().getTime();

/**
 * encode Query Data
 * Use: encodeQueryData(object)
 */
global.encodeQueryData = (data) => {
  let ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  return ret.join('&');
};

/**
 * Use: url_for(my_url)
 */
global.url_for = (url, ...params) => {
  const string = url,
    substring = '?';
  const existGet = string.includes(substring);

  const secret_key = appConfig.voucherModule.secretKey;
  const device_id = getTickUniqueID();
  const app_key = appConfig.voucherModule.appKey;
  const os = Platform.OS;
  const os_version = DeviceInfo.getSystemVersion();
  const store = '';
  const device_type = DeviceInfo.getBrand() + '-' + DeviceInfo.getDeviceId();
  const app_version = DeviceInfo.getVersion();
  const timestamp = time();
  const hash_token = md5(
    secret_key +
      app_key +
      app_version +
      device_id +
      device_type +
      os +
      os_version +
      store +
      timestamp,
  );

  const data = {
    device_id,
    app_key,
    os,
    os_version,
    store,
    device_type,
    app_version,
    timestamp,
    hash_token,
  };
  const queryUrl = encodeQueryData(data);
  if (params.length !== 0) {
    params.forEach((param) => {
      if (param !== undefined) {
        url += '/' + param;
      }
    });
  }
  return url + (existGet ? '&' : '?') + queryUrl;
};

/**
 * Sub string by length
 */
global.sub_string = (s, n, a) => {
  if (typeof s !== 'string') return '';

  var cut = s.indexOf(' ', n);
  if (cut == -1) return s + (a ? a : '');
  return s.substring(0, cut) + '...';
};

global.hexToRgbA = (hex, opacity) => {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return (
      'rgba(' +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') +
      ',' +
      opacity +
      ')'
    );
  }
  throw new Error('Bad Hex');
};

global.hexToRgbCode = (hex) => {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return (
      [(c >> 16) & 255, (c >> 8) & 255, c & 255]
    );
  }
  throw new Error('Bad Hex');
};

/**
 * Custommer tags
 * Center tag
 */
const Center = ({ref, style, children}) => (
  <View ref={ref} style={[style, {alignItems: 'center'}]}>
    {children}
  </View>
);
global.Center = Center;

global.willUpdateState = (unmounted, callback) => {
  if (!unmounted) {
    callback();
  }
};

global.setStater = (context, isUnmounted, state, callback = () => {}) => {
  if (!isUnmounted) {
    context.setState({ ...state }, () => callback());
  }
};

global.elevationShadowStyle = (
  elevation,
  width = 0,
  height = 0,
  shadowOpacity = 0.25,
  shadowColor = 'black',
) => ({
  elevation,
  shadowColor,
  shadowOffset: {width: width, height: height || 0.5 * elevation},
  shadowOpacity,
  shadowRadius: 0.8 * elevation,
});

global.LightenColor = (color, percent) => {
  var num = parseInt(color.replace('#', ''), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = ((num >> 8) & 0x00ff) + amt,
    G = (num & 0x0000ff) + amt;

  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

global.normalizeNotify = (notify = '') => {
  if (isNaN(notify) || !!!notify) {
    return notify;
  }
  return notify > 9 ? '9+' : notify + '';
};

/**
 * @todo format number to standard format
 * @example 1000 -> 1.000
 * @param {!number} target
 * @param {number} n
 * @param {number} x
 * @returns {string}
 */
global.numberFormat = (target, n, x) => {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\,' : '$') + ')';
  return target.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&.');
};

/**
 * @todo format standard number to vnđ currency
 * @example 1.000 -> 1.000đ
 * @see numberFormat
 */
global.vndCurrencyFormat = (target, n, x) => {
  return numberFormat(target, n, x) + 'đ';
};

/**
 * @todo prefetch images
 * @param {Array<string>} images
 * @returns {Promise}
 */
global.prefetchImages = images => {
  return Promise.all(
    images.map(image => {
      let img = {
        ...Image.resolveAssetSource(image),
        cache: 'force-cache'
      };

      return Image.prefetch(img);
    })
  );
};

/** @todo format number to sale form
 * @example 25 -> -25%
 */
global.saleFormat = (sale) => {
  return `-${sale}%`;
};

/**
 * @todo cancel all APIRequest() request(s)
 *
 * @param {Function[] | Function} requests
 */
global.cancelRequests = (requests) => {
  if (Array.isArray(requests)) {
    requests.forEach((request) => {
      request.cancel();
    });
  } else {
    requests.cancel();
  }
};

/**
 * @todo check if 1-level obj is updated
 *
 * @param oldObj old-state object
 * @param newObj new-state object
 */
global.is1LevelObjectUpdated = (oldObj, newObj) => {
  if (!oldObj || !newObj) return oldObj !== newObj;

  const oldKeys = Object.keys(oldObj);
  const newKeys = Object.keys(newObj);

  if (oldKeys.length !== newKeys.length) {
    return true;
  }

  return oldKeys.some(key => oldObj[key] !== newObj[key]);
};

/**
 * @todo cancel all timeouts passed in.
 *
 * @param {(typeof setTimeout)[] | typeof setTimeout} timeouts
 */
global.clearTimeouts = (timeouts) => {
  if (Array.isArray(timeouts)) {
    timeouts.forEach((timeout) => {
      timeout.cancel();
    });
  } else {
    timeout.cancel();
  }
};

/**
 * @todo cancel all intervals passed in.
 *
 * @param {(typeof setInterval)[] | typeof setInterval} intervals
 */
global.clearIntervals = (intervals) => {
  if (Array.isArray(intervals)) {
    intervals.forEach((interval) => {
      clearInterval(interval);
    });
  } else {
    clearInterval(intervals);
  }
};

//-----react-native-exception-handler------
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';

const errorHandler = (error, isFatal) => {
  if (isFatal) {
    Toast.show('Tính năng đang xảy ra sự cố ngoài ý muốn', Toast.LONG);
    console.log('fatal_exception', error);
  } else {
    console.log('exception', error); // So that we can see it in the ADB logs in case of Android if needed
  }
};

setJSExceptionHandler((error, isFatal) => {
  errorHandler(error, isFatal);
}, false);

setNativeExceptionHandler((exceptionString) => {
  console.log('native_exception', exceptionString);
});

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};

global.hapticFeedBack = (type = 'impactLight', opt = options) => {
  ReactNativeHapticFeedback.trigger(type, opt);
};

global.getNumberOnly = (text) => {
  return text.replace(REGEX_NUMBER_ONLY, '');
};

global.dateHandler = function(date = new Date()) {
  var d=new Date(date);

  var s=d.getSeconds();

  var m=d.getMinutes();

  var h=d.getHours();

  var day=d.getDay();

  var date=d.getDate();

  var month=d.getMonth();

  var year=d.getFullYear();

  var days=new Array("Chủ nhật","Thứ hai","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7");

  var months=new Array("1","2","3","4","5","6","7","8","9","10","11","12");

  var month_2 = months[month] < 10 ? ('0' + months[month]) : months[month];
  var date_2 = date < 10 ? ('0' + date) : date;

  return {
    date: `${date_2}${month_2}${year}`,
    dateString: days[day] + ", " + date + " tháng " + months[month] + " " + year,
    current: `${year}-${month_2}-${date_2}`,
  };
}

global.normalizeNotify = (notify = '') => {
  if (isNaN(notify) || !!!notify) {
    return notify;
  }
  return notify > 9 ? '9+' : notify + '';
};

