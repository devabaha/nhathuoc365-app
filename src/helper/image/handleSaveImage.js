import { useState } from "react";
import RNFetchBlob from 'rn-fetch-blob';
import appConfig from 'app-config';
import CameraRoll from '@react-native-community/cameraroll';
import handleDownloadImage from "./handleDownloadImage";

const handleSavePhoto = async (dataURL) => {
    
    const imageName = new Date().getTime() + '.png';
    var base64;
    try { 
    const res = await handleDownloadImage(dataURL);
    base64 = res;
    console.log(base64);
    } catch ( err){
        console.log(err);
    }
    const androidPath = RNFetchBlob.fs.dirs.DCIMDir + '/' + imageName;
    const iOSPath = 'data:image/png;base64,' + base64;
    try {
      const data = await (appConfig.device.isIOS
        ? CameraRoll.save(iOSPath, {type: 'photo'})
        : RNFetchBlob.fs.writeFile(androidPath, base64, 'base64'));
       
      if (data) {
        
        flashShowMessage({
          type: 'success',
          message: 'Lưu ảnh thành công',
        });
      }
    } catch (error) {
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
      console.log('err_save_qr_code', error);
  };
  

}
  export default handleSavePhoto