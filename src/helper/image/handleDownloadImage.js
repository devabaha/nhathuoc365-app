import RNFetchBlob from 'rn-fetch-blob';
import appConfig from 'app-config';

export const handleDownloadImage = (url) => {
  return (
    RNFetchBlob.fetch('GET', url)
      .then((res) => {
        let status = res.info().status;
        // let contentType = appConfig.device.isIOS ? 'Content-Type' : 'content-type';
        // console.log(res);
        // console.log(res.respInfo.headers[0])
        if (status === STATUS_SUCCESS) {
          // the conversion is done in native code
          let base64Str = res.data;
          let imageType = res.respInfo.headers['Content-Type'].slice(6);
          // the following conversions are done in js, it's SYNC
          return {base64Str: base64Str, imageType: imageType};
        } else {
          // handle other status codes
          console.log('get b64 fail');
        }
      })
      // Something went wrong:
      .catch((errorMessage, statusCode) => {
        // error handling
        console.log(errorMessage, statusCode);
      })
  );
};
