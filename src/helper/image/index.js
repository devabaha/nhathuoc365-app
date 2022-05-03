import ImageCropPicker from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';

import appConfig from 'app-config';

<<<<<<< HEAD
import {IMAGE_PICKER_TYPE, IMAGE_RATIOS, MAX_IMAGE_UPLOAD_DIMENSION} from 'src/constants/image';
=======
import {
  IMAGE_PICKER_TYPE,
  IMAGE_RATIOS,
  MAX_IMAGE_UPLOAD_DIMENSION,
} from 'src/constants/image';
>>>>>>> app-core/core-master
import {getBase64Image} from 'app-packages/tickid-chat/helper';
import {saveImage} from './imageSavingHandler';
import {downloadImage} from './imageDownloadingHandler';

export const getImageSize = (image_ratio, base = appConfig.device.width) => {
  return {
    width: base,
    height: base / image_ratio,
  };
};

export const getBannerSize = () => {
  return getImageSize(IMAGE_RATIOS.BANNER);
};

export const getNewsFeedSize = () => {
  return getImageSize(IMAGE_RATIOS.NEWS_FEED);
};

export const openLibrary = (
  callbackSuccess = () => {},
  closeModal = () => {},
) => {
  const options = getPickerOptions(IMAGE_PICKER_TYPE.RN_IMAGE_CROP_PICKER, {
    includeExif: true,
    multiple: true,
    includeBase64: true,
    mediaType: 'photo',
    maxFiles: 10,
  });

  ImageCropPicker.openPicker(options)
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
  const options = getPickerOptions(IMAGE_PICKER_TYPE.RN_IMAGE_PICKER, {
    rotation: 360,
    storageOptions: {
      skipBackup: false,
      path: 'images',
    },
  });

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
    } else if (img.path) {
      img.uri = img.path;
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
  let requests = [];
  async function uploadImage(image, index) {
    const imageData = await normalizePostImageData(image);

    const request = RNFetchBlob.fetch(
      'POST',
      uploadUrl,
      {
        'Content-Type': 'multipart/form-data',
      },
      [imageData],
    );

    request
      .uploadProgress({interval: 150}, (written, total) => {
        // console.log(index, 'uploadprogress', written, total);
        callbackUploadProgress(written / total, image, index);
      })
      .then((response) => {
        console.log(response);
        const res = JSON.parse(response.data);
        if (res.status === STATUS_SUCCESS) {
          callbackSuccess(res, image, index);
        } else {
          callbackError(res?.message, image, index);
          flashShowMessage({
            type: 'danger',
            message: res.message,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        callbackError(error, image, index);
      });

    return request;
  }

  images.forEach((image, index) => {
    requests.push(uploadImage(image, index));
  });

  return requests;
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
};

export const getPickerOptions = (type, options) => {
  switch (type) {
    case IMAGE_PICKER_TYPE.RN_IMAGE_CROP_PICKER:
      return {
        ...options,
        compressImageMaxWidth: MAX_IMAGE_UPLOAD_DIMENSION,
        compressImageMaxHeight: MAX_IMAGE_UPLOAD_DIMENSION,
      };
    case IMAGE_PICKER_TYPE.RN_IMAGE_PICKER:
      return {
        ...options,
        maxHeight: MAX_IMAGE_UPLOAD_DIMENSION,
        maxWidth: MAX_IMAGE_UPLOAD_DIMENSION,
      };
    default:
      return options;
  }
};

export {saveImage, downloadImage};
