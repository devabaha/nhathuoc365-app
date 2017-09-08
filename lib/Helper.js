'use strict';

import React from 'react';
import {
  Text,
  View,
  AsyncStorage,
  Platform,
  LayoutAnimation,
  UIManager,
  StatusBar
} from 'react-native';

import Events from './Events';
global.Events = Events;

// center text
import CenterText from '../components/CenterText';
global.CenterText = CenterText;

// components
import Indicator from '../components/Indicator';
global.Indicator = Indicator;

// action for mobx
import {action} from 'mobx';
global.action = action;

// observer from mbox-react
import {observer} from "mobx-react";
global.observer = observer;

// lodash
import _ from 'lodash';
global._ = _;

// APIHandler
import APIHandler from '../network/APIHandler';
global.APIHandler = APIHandler;

// status bar
const MyStatusBar = ({...props}) => (
  <View style={{ height: isIOS ? 20 : 0, backgroundColor: DEFAULT_COLOR }}>
    <StatusBar
      //backgroundColor={DEFAULT_COLOR}
      {...props}
      barStyle="light-content" />
  </View>
);
global.MyStatusBar = MyStatusBar;

// default message toast error
global.defaultToastError = () => Toast.show(MESSAGE_OTHER_ERROR, Toast.SHORT);

// function money format
// add prototype for Number
Number.prototype.formatMoney = function(c, d, t){
var n = this,
    c = isNaN(c = Math.abs(c)) ? 0 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "." : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

 String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

// cut first word
global.cutFirstWord = (words) => {
  if (typeof words != 'string') return;

  var sortName = [];
  words.split(' ').map((word, index) => {
    sortName.push(word.split('')[0]);
  });

  return sortName.join('').toUpperCase();
}

// Layout Animation
if (isAndroid) {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}
global.layoutAnimation = (animate) => {
  animate = typeof animate == 'undefined' ? 'easeInEaseOut' : animate;
  if (LayoutAnimation[animate]) {
    LayoutAnimation[animate]();
  }
}

import {
  Analytics,
  Hits as GAHits,
  Experiment as GAExperiment
} from 'react-native-google-analytics';

global.GoogleAnalytic = (screen) => {
  if(screen){
    var ga = null;
    let clientId = DeviceInfo.getUniqueID();
    ga = new Analytics(GA_ID, clientId, 1, DeviceInfo.getUserAgent());
    var screenView = new GAHits.ScreenView(
      'ABAHA APP',
      screen,
      DeviceInfo.getReadableVersion(),
      DeviceInfo.getBundleId()
    );
    ga.send(screenView);
  }
};

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
    sync : {}
});
global.storage = storage;

/**
* Lib: react-native-md5
* Docs: https://github.com/kmend/react-native-md5
* Use: call md5(encode_string)
*/
import encoding from "react-native-md5";
global.md5 = (str) => encoding.hex_md5(str);

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
}

/**
* Use: url_for(my_url)
*/
global.url_for = (url) => {
  var string = url,
      substring = '?';
  var existGet = string.includes(substring);

  var secret_key = '10ed3b67865abaha_key88dxx1c98141b513b7';
  var device_id = DeviceInfo.getUniqueID();
  var app_key = 'abahaappkey';
  var os = Platform.OS;
  var os_version = DeviceInfo.getSystemVersion();
  var store = '';
  var device_type = DeviceInfo.getBrand();
  var app_version = '1.0';
  var timestamp = time();
  var hash_token = md5(
    secret_key + app_key + app_version +
    device_id + device_type + os +
    os_version + store + timestamp
  );

  var data = {
    device_id,
    app_key,
    os,
    os_version,
    store,
    device_type,
    app_version,
    timestamp,
    hash_token
  }
  var queryUrl = encodeQueryData(data);

  return url + (existGet ? '&' : '?') + queryUrl;
}

/**
* Sub string by length
*/
global.sub_string = (s, n, a) => {
  if (!(typeof s == 'string') || s == '') return '';

  var cut= s.indexOf(' ', n);
  if(cut== -1) return s + (a ? a : '');
  return s.substring(0, cut) + '...';
}

global.hexToRgbA = (hex, opacity) => {
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',' + opacity + ')';
    }
    throw new Error('Bad Hex');
}

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
