import RNFetchBlob from 'rn-fetch-blob';

const handleDownloadImage = (url) => {
  return RNFetchBlob.fetch('GET', url)
    .then((res) => {
      if (!!res && res.info().status === STATUS_SUCCESS) {
        let imageType;
        let base64Str = res.data;
        if (res.respInfo.headers['content-type'] === undefined) {
          imageType = res.respInfo.headers['Content-Type'].slice(6);
        } else imageType = res.respInfo.headers['content-type'].slice(6);
        return {base64Str: base64Str, imageType: imageType};
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

export {handleDownloadImage};
