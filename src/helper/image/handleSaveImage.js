import React from 'react';
import {PermissionsAndroid, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import RNFetchBlob from 'rn-fetch-blob';
import appConfig from 'app-config';
import CameraRoll from '@react-native-community/cameraroll';
import {handleDownloadImage} from './handleDownloadImage';
let message = 'Saveddsadadadasdasdasdsads dsad';

let downloaded = 0;
const handleSaveImage = (data) => {
  downloaded = 0;
  typeof data === 'object'
    ? handleSaveAllImage(data, (imagesDownloaded) => {
        console.log(imagesDownloaded);
        imagesDownloaded === data.length
          ? flashShowMessage({
              type: 'success',
              message: 'success download all',
            })
          : console.log(`downloaded ${imagesDownloaded}/${data.length}`);
      })
    : typeof data === 'string'
    ? handleSaveSingleImage(data)
    : null;
};
function handleSaveAllImage(arrURL, callback = () => {}) {
  let photoCounts = Array(arrURL.length)
    .fill()
    .map((_, i) => i + 1);
  arrURL.map((item, index) => {
    handleSaveSingleImage(item.url, true)
      .then(() => {
        console.log(`download thanh cong anh ${index}`);
        photoCounts.splice(index + 1, 1);
        downloaded++;
        callback(downloaded);
      })
      .catch((err) => console.log(err));
  });
  console.log(downloaded);
}

async function hasAndroidPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }
  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}

const handleSaveSingleImage = async (dataURL, all = false) => {
  var base64;
  var imageType;
  try {
    const res = await handleDownloadImage(dataURL);
    if (res) {
      base64 = res.base64Str;
      imageType = res.imageType;
    }
  } catch (err) {
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
      ? RNFetchBlob.fs
          .writeFile(androidPath, base64, 'base64')
          .catch((err) => console.log(err))
      : null);
    if (data && !all) {
      flashShowMessage({
        message: 'Saved',
        position: 'center',
        // style: {
        //   backgroundColor: '#252325',
        //   opacity: 0.8,
        //   width: appConfig.device.width / 2.5,
        //   height: appConfig.device.width / 2.5,
        //   borderRadius: 20,
        // },
        // autoHide: false,
        renderCustomContent: () => {
          return (
            <View>
              <Icon
                style={{
                  position: 'absolute',
                  left: appConfig.device.width / 10,
                  top: appConfig.device.width / 12,
                }}
                name="check"
                size={appConfig.device.width / 5}
                color="#fff"
              />
            </View>
            //     <View
            //       style={{
            //         // color: appConfig.colors.white,
            //         // fontSize: appConfig.device.width / 25,
            //         // fontWeight: 'bold',
            //         position: 'absolute',
            //         backgroundColor: '#fff',
            //         bottom: -appConfig.device.width / 30,
            //         left: -appConfig.device.width / 18 + 3,
            //         width: appConfig.device.width / 2.5,
            //         height: appConfig.device.width / 10,
            //         alignItems: 'center',
            //         justifyContent: 'center',
            //       }}>
            //       <Text>{message}</Text>
            //     </View>
          );
        },
        // renderFlashMessageIcon: () => (
        //   <Icon
        //     style={{
        //       position: 'absolute',
        //       left: appConfig.device.width / 10,
        //       top: appConfig.device.width / 12,
        //     }}
        //     name="check"
        //     size={appConfig.device.width / 5}
        //     color="#fff"
        //   />
        // ),
      });
    }
  } catch (error) {
    flashShowMessage({
      type: 'danger',
      message: t('api.error.message'),
    });
    console.log('err_save_single_image', error);
  }
};
export {handleSaveImage};
