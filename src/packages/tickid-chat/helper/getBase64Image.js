import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

const isIOS = Platform.OS === 'ios';

export const getBase64Image = async path => {
  if (isIOS) {
    let regex = /:\/\/(.{36})\//i;
    let result = path.match(regex);
    let tempPath = `assets-library://asset/asset.JPG?id=${result[1]}&ext=JPG`;

    const dest = `${RNFS.TemporaryDirectoryPath}${Math.random()
      .toString(36)
      .substring(7)}.jpg`;

    path = await RNFS.copyAssetsFileIOS(
      tempPath,
      dest,
      500,
      500,
      1.0,
      1.0,
      'contain'
    );
  }

  return RNFS.readFile(path, 'base64')
    .then(data => {
      return data;
    })
    .catch(err => console.log(err));
};
