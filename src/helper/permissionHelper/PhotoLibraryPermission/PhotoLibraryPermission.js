import {
  PERMISSIONS,
  check,
  request as requestPermission,
} from 'react-native-permissions';
import BasePermission from '../BasePermission';

import appConfig from 'app-config';
import {REQUEST_RESULT_TYPE} from '../constants';
import {Actions} from 'react-native-router-flux';

const PHOTO_LIBRARY_PERMISSIONS_TYPE = appConfig.device.isIOS
  ? PERMISSIONS.IOS.PHOTO_LIBRARY
  : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

  const PHOTO_LIBRARY_TITLE = appConfig.device.isIOS ? 'Ảnh' : 'Bộ nhớ'

class PhotoLibraryPermission extends BasePermission {
  async request() {
    const result = await this.callPermission(
      requestPermission,
      PHOTO_LIBRARY_PERMISSIONS_TYPE,
    );
    return result === REQUEST_RESULT_TYPE.GRANTED;
  }

  openPermissionAskingModal() {
    Actions.push(appConfig.routes.modalConfirm, {
      momo: true,
      title: `Cho phép truy cập ${PHOTO_LIBRARY_TITLE}`,
      content: `Bạn cần cho phép ứng dụng truy cập ${PHOTO_LIBRARY_TITLE} để có thể sử dụng ảnh`,
      yesTitle: 'Đi tới Cài đặt',
      noTitle: 'Huỷ',
      yesConfirm: this.handleOpenAppSettings,
    });
  }
}

export default new PhotoLibraryPermission();
