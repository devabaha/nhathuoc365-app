import RNFetchBlob from 'rn-fetch-blob';

const IMAGE_BASE64_PREFIX = 'data:image/png;base64,';

const downloadImage = (url) => {
  return RNFetchBlob.fetch('GET', url)
    .then((res) => {
      if (!!res && res.info().status === STATUS_SUCCESS) {
        let imageType;
        let base64 = res.data;

        const contentType =
          res.respInfo.headers['content-type'] ||
          res.respInfo.headers['Content-Type'];

        imageType = contentType.slice(6);

        return {
          base64,
          imageType: imageType,
          imageBase64: IMAGE_BASE64_PREFIX + base64,
        };
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message'),
        });
      }
    })
    .catch((errorMessage, statusCode) => {
      console.log(errorMessage, statusCode);
    });
};

export {downloadImage};
