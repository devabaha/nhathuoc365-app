import {RESULTS, PERMISSIONS, request, check} from 'react-native-permissions';
import AndroidOpenSettings from 'react-native-android-open-settings';

import appConfig from 'app-config';
import {LOCATION_PERMISSION_TYPE, REQUEST_RESULT_TYPE} from '../constants';
import i18n from 'i18next';
import {openLink} from 'app-helper';
import {push} from 'app-helper/routing';
import {Linking} from 'react-native';

class LocationPermission {
  t = i18n.getFixedT(undefined, 'common');

  callPermission = async (type, callback = (result) => {}) => {
    const permissionGranted = await this.handleLocationPermission(type);
    callback(permissionGranted);
    return permissionGranted;
  };

  handleLocationPermission = async (type) => {
    const permissionLocationRequest = appConfig.device.isAndroid
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    let permissionHandler = check;
    switch (type) {
      case LOCATION_PERMISSION_TYPE.CHECK:
        permissionHandler = check;
        break;
      case LOCATION_PERMISSION_TYPE.REQUEST:
        permissionHandler = request;
        break;
    }

    try {
      const result = await permissionHandler(permissionLocationRequest);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          return REQUEST_RESULT_TYPE.NOT_AVAILABLE;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          return REQUEST_RESULT_TYPE.NOT_GRANTED;
        case RESULTS.GRANTED:
          console.log('The location permission is granted');
          return REQUEST_RESULT_TYPE.GRANTED;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          return REQUEST_RESULT_TYPE.BLOCKED;
      }
    } catch (error) {
      console.log('%crequest_location_permission', 'color:red', error);
      return REQUEST_RESULT_TYPE.TIMEOUT;
    }
  };

  handleAccessSettingWhenRequestLocationError = (errorCode) => {
    switch (errorCode) {
      case REQUEST_RESULT_TYPE.NOT_GRANTED:
      case REQUEST_RESULT_TYPE.BLOCKED:
        appConfig.device.isIOS
          ? this.openSettingIOS()
          : this.openSettingsAndroid(errorCode);
        break;
      case REQUEST_RESULT_TYPE.NOT_AVAILABLE:
        appConfig.device.isIOS
          ? this.openSettingIOS()
          : this.openSettingsAndroid(errorCode);
        break;
    }
  };

  openSettingIOS = (url) => {
    if (!url) {
      Linking.openSettings();
    } else {
      openLink(url);
    }
  };

  openSettingsAndroid = (type) => {
    switch (type) {
      case REQUEST_RESULT_TYPE.NOT_AVAILABLE:
        AndroidOpenSettings.locationSourceSettings();
        break;
      case REQUEST_RESULT_TYPE.NOT_GRANTED:
      case REQUEST_RESULT_TYPE.BLOCKED:
        AndroidOpenSettings.appDetailsSettings();
        break;
    }
  };

  openPermissionAskingModal({
    title = undefined,
    errCode = undefined,
    errContent = '',
    confirmTitle = '',
    cancelTitle = '',
    otherClose = false,

    onConfirm = undefined,
    onCancel = undefined,
    ...props
  }) {
    const content =
      errContent ||
      (errCode === REQUEST_RESULT_TYPE.TIMEOUT
        ? this.t('requestTimeout')
        : this.t('requireLocation'));

    const yesTitle =
      confirmTitle ||
      (errCode === REQUEST_RESULT_TYPE.TIMEOUT
        ? this.t('tryAgain')
        : this.t('settings'));
    const noTitle = cancelTitle || this.t('cancel');

    push(appConfig.routes.modalConfirm, {
      momo: true,
      otherClose,
      title: title || this.t('allowLocationAccess'),
      content,
      yesTitle,
      noTitle,
      yesConfirm: () => {
        typeof onConfirm === 'function' && onConfirm();
        this.handleAccessSettingWhenRequestLocationError(errCode);
      },
      noConfirm: onCancel,
      ...props,
    });
  }
}

export default new LocationPermission();
