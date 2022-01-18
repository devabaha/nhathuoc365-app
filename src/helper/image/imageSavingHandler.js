import appConfig from 'app-config';
import i18n from 'i18next';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';
import {downloadImage} from './imageDownloadingHandler';
import {PhotoLibraryPermission} from '../permissionHelper/PhotoLibraryPermission';
import showFlashNotification from '../../components/FlashNotification';

const saveImage = async (url = '', dataURL = '', mimeType = '') => {
  const t = i18n.getFixedT(undefined, 'common');
  let base64 = dataURL,
    imageType = mimeType;

  if (!base64) {
    try {
      const res = await downloadImage(url);
      console.log(res);
      if (res) {
        base64 = res.base64;
        imageType = res.imageType;
      }
    } catch (err) {
      console.log('download_image', err);
    }
  }

  const imageName = new Date().getTime() + '.' + imageType;
  const androidPath = RNFetchBlob.fs.dirs.DownloadDir + '/' + imageName;
  console.log(androidPath);
  const iOSPath = 'data:image/' + imageType + ';base64,' + base64;
  try {
    const granted = await (appConfig.device.isIOS
      ? PhotoLibraryPermission.request()
      : PhotoLibraryPermission.requestWriteExternalAndroid());
    if (granted) {
      const data = await (appConfig.device.isIOS
        ? CameraRoll.save(iOSPath, {type: 'photo'})
        : RNFetchBlob.fs.writeFile(androidPath, base64, 'base64'));
      if (data) {
        if (appConfig.device.isAndroid) {
          RNFetchBlob.fs
            .scanFile([{path: androidPath, mime: imageType}])
            .then((res) => {
              console.log('scan_image_successfully', res);
              showFlashNotification(t('saved'));
            })
            .catch((err) => console.log('scan_image_error', err));
        } else {
          showFlashNotification(t('saved'));
        }
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
