import {RESULTS, PERMISSIONS, request, check} from 'react-native-permissions';
import {LOCATION_PERMISSION_TYPE, REQUEST_RESULT_TYPE} from '../constants';
import appConfig from 'app-config';
import {Alert, Linking} from 'react-native';
import AndroidOpenSettings from 'react-native-android-open-settings';
import {Actions} from 'react-native-router-flux';

const LOCATION_TITLE = 'Vị trí';
const REQUEST_TIMEOUT_MESSAGE = 'Hết thời gian yêu cầu.';
const REQUEST_PERMISSION_MESSAGE =
  'Bạn vui lòng bật Vị trí và cấp quyền truy cập Vị trí cho ứng dụng để có thể đạt được trải nghiệm sử dụng tốt nhất.';

class LocationPermission {
  callPermission = async (type, callback = () => {}) => {
    const permissionGranted = await this.handleLocationPermission(type);
    callback(permissionGranted);
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
          return REQUEST_RESULT_TYPE.NOT_GRANTED;
      }
    } catch (error) {
      console.log('%crequest_location_permission', 'color:red', error);
      return REQUEST_RESULT_TYPE.TIMEOUT;
    }
  };

  handleAccessSettingWhenRequestLocationError = (errorCode) => {
    switch (errorCode) {
      case REQUEST_RESULT_TYPE.NOT_GRANTED:
        appConfig.device.isIOS
          ? this.openSettingIOS('app-settings:')
          : this.openSettingsAndroid(REQUEST_RESULT_TYPE.NOT_GRANTED);
        break;
      case REQUEST_RESULT_TYPE.NOT_AVAILABLE:
        appConfig.device.isIOS
          ? this.openSettingIOS('App-Prefs:root=Privacy&path=LOCATION')
          : this.openSettingsAndroid(REQUEST_RESULT_TYPE.NOT_AVAILABLE);
        break;
    }
  };

  openSettingIOS = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle settings url", url);
          Alert.alert('Không thể truy cập', 'Đường dẫn này không thể mở được.');
        } else {
          Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  openSettingsAndroid = (type) => {
    switch (type) {
      case REQUEST_RESULT_TYPE.NOT_AVAILABLE:
        AndroidOpenSettings.locationSourceSettings();
        break;
      case REQUEST_RESULT_TYPE.NOT_GRANTED:
        AndroidOpenSettings.appDetailsSettings();
        break;
    }
  };

  openPermissionAskingModal(
    errCode,
    onConfirm,
    onCancel,
    errContent = '',
    confirmTitle = '',
    cancelTitle = '',
  ) {
    const content =
      errContent ||
      (errCode === REQUEST_RESULT_TYPE.TIMEOUT
        ? REQUEST_TIMEOUT_MESSAGE
        : REQUEST_PERMISSION_MESSAGE);

    const yesTitle =
      confirmTitle ||
      (errCode === REQUEST_RESULT_TYPE.TIMEOUT ? 'Thử lại' : 'Cài đặt');
    const noTitle = cancelTitle || 'Huỷ';

    Actions.push(appConfig.routes.modalConfirm, {
      momo: true,
      title: `Cho phép truy cập ${LOCATION_TITLE}`,
      content,
      yesTitle,
      noTitle,
      yesConfirm: () => {
        typeof onConfirm === 'function' && onConfirm();
        this.handleAccessSettingWhenRequestLocationError(errCode);
      },
      noConfirm: onCancel,
    });
  }
}

export default new LocationPermission();
