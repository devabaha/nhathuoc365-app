import i18n from 'i18next';
import RNFetchBlob from 'rn-fetch-blob';
import appConfig from 'app-config';
import CameraRoll from '@react-native-community/cameraroll';
import {handleDownloadImage} from './handleDownloadImage';
import showFlashNotification from '../../components/FlashNotification';
import {PhotoLibraryPermission} from '../permissionHelper';

async function hasAndroidPermission() {
  const granted = await (appConfig.device.isIOS
    ? PhotoLibraryPermission.request()
    : PhotoLibraryPermission.requestWriteExternalAndroid());
  if (granted) {
    return true;
  } else {
    setTimeout(() => {
      PhotoLibraryPermission.openPermissionAskingModal();
    }, 500);
    return;
  }
}

const handleSaveImage = async (url, message) => {
  const t = i18n.getFixedT(undefined, 'common');
  let base64, imageType;
  try {
    const res = await handleDownloadImage(url);
    if (res) {
      base64 = res.base64Str;
      imageType = res.imageType;
      // console.log('alo',res.base64Str)
    }
  } catch (err) {
    console.log(err);
  }
  // console.log(base64, imageType)
  const imageName = new Date().getTime() + '.' + imageType;
  const androidPath = RNFetchBlob.fs.dirs.DCIMDir + '/' + imageName;
  const iOSPath = 'data:image/' + imageType + ';base64,' + base64;
  try {
    const data = await (appConfig.device.isIOS
      ? CameraRoll.save(iOSPath, {type: 'photo'})
      : hasAndroidPermission()
      ? RNFetchBlob.fs.writeFile(androidPath, base64, 'base64')
      : null);
    if (data) {
      showFlashNotification(t('saved'));
    }
  } catch (error) {
    flashShowMessage({
      type: 'danger',
      message: t('saveImageFailed'),
    });
    console.log('err_save_single_image', error);
  }
};

export {handleSaveImage};
