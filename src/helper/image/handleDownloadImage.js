import RNFetchBlob from 'rn-fetch-blob';
const handleDownloadImage = (url) => {
     return RNFetchBlob.fetch('GET', url)
        .then((res) => {
          let status = res.info().status;
          console.log(res);
        
          if (status === 200) {
            // the conversion is done in native code
            let base64Str = res.base64();
            let imageType = res.info().headers['Content-Type'].slice(6);
            // the following conversions are done in js, it's SYNC
            return {base64Str: base64Str , imageType: imageType}
          } else {
            // handle other status codes
            console.log('get b64 fail')
          }
        })
        // Something went wrong:
        .catch((errorMessage, statusCode) => {
          // error handling
          console.log(errorMessage, statusCode);
        });
    };

    export default handleDownloadImage;