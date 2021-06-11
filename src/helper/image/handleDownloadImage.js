import RNFetchBlob from 'rn-fetch-blob';

const handleDownloadImage = (url) => {
  return (
    RNFetchBlob.fetch('GET', url)
      .then((res) => {
        if (!!res && res.info().status === STATUS_SUCCESS) {
          let imageType;
          let base64Str = res.data;
          if (res.respInfo.headers['content-type'] === undefined) {
            imageType = res.respInfo.headers['Content-Type'].slice(6);
          } else imageType = res.respInfo.headers['content-type'].slice(6);
          // the following conversions are done in js, it's SYNC
          return {base64Str: base64Str, imageType: imageType};
        } else {
          flashShowMessage({
            type: 'danger',
            message: t('api.error.connect'),
          });
        }
      })
      // Something went wrong:
      .catch((errorMessage, statusCode) => {
        // error handling
        console.log(errorMessage, statusCode);
      })
  );
};

export {handleDownloadImage};
