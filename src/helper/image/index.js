import ImageCropPicker from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';

import appConfig from 'app-config';
import {IMAGE_RATIOS} from 'src/constants/image';
import RNFetchBlob from 'rn-fetch-blob';
import { getBase64Image } from 'app-packages/tickid-chat/helper';

export const getImageSize = (image_ratio, base = appConfig.device.width) => {
  return {
    width: base,
    height: base / image_ratio,
  };
};

export const getNewsFeedSize = () => {
  return getImageSize(IMAGE_RATIOS.NEWS_FEED);
};

export const openLibrary = (
  callbackSuccess = () => {},
  closeModal = () => {},
) => {
  ImageCropPicker.openPicker({
    includeExif: true,
    multiple: true,
    includeBase64: true,
    mediaType: 'photo',
    maxFiles: 10,
  })
    .then((response) => {
      // console.log(response);
      closeModal();
      const selectedImages = normalizeImages(response);
      console.log(selectedImages);
      callbackSuccess(selectedImages);
    })
    .catch((err) => {
      console.log('open_picker_err', err);
      closeModal();
    });
};

export const openCamera = async (
  callbackSuccess = () => {},
  closeModal = () => {},
) => {
  const options = {
    rotation: 360,
    storageOptions: {
      skipBackup: false,
      path: 'images',
    },
  };

  ImagePicker.launchCamera(options, (response) => {
    if (response.error) {
      console.log(response);
      closeModal();
    } else if (response.didCancel) {
      console.log(response);
      closeModal();
    } else {
      // console.log(response);
      closeModal();
      response.path = response.uri;
      const selectedImages = normalizeImages([response]);
      callbackSuccess(selectedImages);
      // console.log(selectedImages);
    }
  });
};

export const normalizeImages = (images) => {
  return images.map((img) => {
    img.id = new Date().getTime();
    if (!img.filename) {
      img.filename = `${new Date().getTime()}`;
    }
    if (!img.fileName) {
      img.fileName = `${new Date().getTime()}`;

      if (img.mime) {
        img.fileName += '.' + img.mime.split('image/')[1];
      } else {
        img.fileName += '.jpeg';
      }
    }
    if (img.data) {
      img.uploadPath = img.data;
      img.isBase64 = true;
    }

    if (img.sourceURL) {
      img.uri = img.sourceURL;
    }

    if (img.sourceURL || img.uri) {
      img.url = img.sourceURL || img.uri;
    }
    return img;
  });
};

export const uploadImages = (
  uploadUrl,
  images,
  callbackUploadProgress = () => {},
  callbackSuccess = () => {},
  callbackError = () => {},
) => {
  images.forEach((image, index) => {
    const imageData = normalizePostImageData(image);

    console.log(imageData);

    RNFetchBlob.fetch(
      'POST',
      uploadUrl,
      {
        'Content-Type': 'multipart/form-data',
      },
      [imageData],
    )
      .uploadProgress({interval: 250}, (written, total) => {
        console.log('uploadprogress', written);
        callbackUploadProgress(written / total, image, index);
      })
      .then((response) => {
        console.log(response);
        callbackSuccess(response, image, index);
      })
      .catch((error) => {
        console.log(error);
        callbackError(error, image, index);
      });
  });
};

export const normalizePostImageData = async (image) => {
  let base64 = image.uploadPath;
    if (!image.isBase64) {
      base64 = await getBase64Image(image.path);
    }

    const imageData = {
      name: 'upload',
      filename: image.fileName,
      data: base64,
    };

    return imageData;
}
