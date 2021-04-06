import {Linking, Alert} from 'react-native';
import {openSettings, RESULTS} from 'react-native-permissions';
import {REQUEST_RESULT_TYPE} from '../constants';

class BasePermission {
  callPermission = async (
    permissionHandler,
    permissionTypeRequest,
    callback = () => {},
  ) => {
    const permissionGranted = await this.handlePermission(
      permissionHandler,
      permissionTypeRequest,
    );
    callback(permissionGranted);
    return permissionGranted;
  };

  handlePermission = async (permissionHandler, permissionTypeRequest) => {
    try {
      const result = await permissionHandler(permissionTypeRequest);
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
      console.log('%c' + permissionTypeRequest, 'color:red', error);
      return REQUEST_RESULT_TYPE.TIMEOUT;
    }
  };

  handleOpenAppSettings = () => {
    openSettings().catch(() =>
      Alert.alert('Ứng dụng không thể truy cập vào Cài đặt!'),
    );
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
}

export default BasePermission;
