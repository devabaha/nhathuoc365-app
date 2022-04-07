import {
  PERMISSIONS,
  check,
  request as requestPermission,
} from 'react-native-permissions';
import BasePermission from '../BasePermission';

import appConfig from 'app-config';
import {REQUEST_RESULT_TYPE} from '../constants';
import {push} from 'app-helper/routing';

const CAMERA_PERMISSIONS_TYPE = appConfig.device.isIOS
  ? PERMISSIONS.IOS.CAMERA
  : PERMISSIONS.ANDROID.CAMERA;

class CameraPermission extends BasePermission {
  async request() {
    const result = await this.callPermission(
      requestPermission,
      CAMERA_PERMISSIONS_TYPE,
    );
    return result === REQUEST_RESULT_TYPE.GRANTED;
  }

  openPermissionAskingModal() {
    push(appConfig.routes.modalConfirm, {
      momo: true,
      title: 'Cho phép sử dụng Camera',
      content: 'Bạn cần cho phép ứng dụng truy cập Camera để có thể chụp ảnh',
      yesTitle: 'Đi tới Cài đặt',
      noTitle: 'Huỷ',
      yesConfirm: this.handleOpenAppSettings,
    });
  }
}

export default new CameraPermission();
