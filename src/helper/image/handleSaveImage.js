import i18n from 'i18next';
import RNFetchBlob from 'rn-fetch-blob';
import appConfig from 'app-config';
import CameraRoll from '@react-native-community/cameraroll';
import {handleDownloadImage} from './handleDownloadImage';
import showFlashNotification from '../../components/FlashNotification';
import {PhotoLibraryPermission} from '../permissionHelper';

const handleSaveImage = (data, message) => {
  handleSaveSingleImage(data, message);
};

async function hasAndroidPermission() {
  const granted = await PhotoLibraryPermission.request();
  if (granted) {
    return true;
  } else {
    setTimeout(() => {
      PhotoLibraryPermission.openPermissionAskingModal();
    }, 500);
    return;
  }
}

const handleSaveSingleImage = async (dataURL, message) => {
  const t = i18n.getFixedT(undefined, 'common');
  let base64, imageType;
  try {
    const res = await handleDownloadImage(dataURL);
    if (res) {
      base64 = res.base64Str;
      imageType = res.imageType;
    }
    // else {
    //   flashShowMessage({
    //     type: 'danger',
    //     message: t('api.error.message'),
    //   });
    // }
  } catch (err) {
    console.log(err);
  }
  const imageName = new Date().getTime() + '.' + imageType;
  const androidPath = RNFetchBlob.fs.dirs.DCIMDir + '/' + imageName;
  const iOSPath = 'data:image/' + imageType + ';base64,' + base64;
  try {
    const data = await (appConfig.device.isIOS
      ? CameraRoll.save(iOSPath, {type: 'photo'})
      : hasAndroidPermission().then
      ? RNFetchBlob.fs
          .writeFile(androidPath, base64, 'base64')
          .catch((err) => console.log(err))
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
