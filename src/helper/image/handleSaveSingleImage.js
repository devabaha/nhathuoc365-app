import { PermissionsAndroid } from "react-native";
import RNFetchBlob from 'rn-fetch-blob';
import appConfig from 'app-config';
import CameraRoll from '@react-native-community/cameraroll';
import {handleDownloadImage} from "./handleDownloadImage";

async function hasAndroidPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}

 const handleSaveSingleImage = async (dataURL, callback = () => {}, all = false) => {
    var base64;
    var imageType;
    try { 
      const res = await handleDownloadImage(dataURL);
      if(res){
        base64 = res.base64Str;
        imageType = res.imageType;
      }
    } catch ( err){
        console.log(err);
    }
    const imageName = new Date().getTime() + '.' + imageType;
    const androidPath = RNFetchBlob.fs.dirs.DCIMDir + '/' + imageName;
    // console.log(androidPath)
    const iOSPath = 'data:image/' + imageType + ';base64,' + base64;
    try {
      const data = await (appConfig.device.isIOS
        ? CameraRoll.save(iOSPath, {type: 'photo'})
        : hasAndroidPermission() 
        ? RNFetchBlob.fs.writeFile(androidPath, base64, 'base64')
          .catch(err => console.log(err))
        : null)
        
      if (data&&!all) {
        flashShowMessage({
          type: 'success',
          message: 'Lưu ảnh thành công',
        });
        callback('done');
      }
    } catch (error) {
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
      console.log('err_save_single_image', error);
  };
}

export default handleSaveSingleImage;