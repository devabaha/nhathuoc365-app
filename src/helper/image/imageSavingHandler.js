import appConfig from 'app-config';
import i18n from 'i18next';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import {downloadImage} from './imageDownloadingHandler';
import {PhotoLibraryPermission} from '../permissionHelper';
import showFlashNotification from '../../components/FlashNotification';

const saveImage = async (url = '') => {
  const t = i18n.getFixedT(undefined, 'common');
  let base64, imageType;
  try {
    const res = await downloadImage(url);
    if (res) {
      base64 = res.base64Str;
      imageType = res.imageType;
    }
  } catch (err) {
    console.log(err);
  }
  const imageName = new Date().getTime() + '.' + imageType;
  const androidPath = RNFS.DownloadDirectoryPath + '/' + imageName;
  console.log(androidPath);
  const iOSPath = 'data:image/' + imageType + ';base64,' + base64;
  try {
    const granted = await (appConfig.device.isIOS
      ? PhotoLibraryPermission.request()
      : PhotoLibraryPermission.requestWriteExternalAndroid());
    if (granted) {
      const data = await (appConfig.device.isIOS
        ? CameraRoll.save(iOSPath, {type: 'photo'})
        : RNFS.downloadFile({fromUrl: url, toFile: androidPath}));
      //  RNFetchBlob.fs.writeFile(androidPath, base64, 'base64')
      if (data) {
        showFlashNotification(t('saved'));
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('saveImageFailed'),
        });
      }
    } else {
      setTimeout(() => {
        PhotoLibraryPermission.openPermissionAskingModal();
      }, 500);
    }
  } catch (error) {
    flashShowMessage({
      type: 'danger',
      message: t('saveImageFailed'),
    });
    console.log('err_save_single_image', error);
  }
};
export {saveImage};
