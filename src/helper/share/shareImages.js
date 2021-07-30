import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';

export const shareImages = async (
  imageURLs = [],
  loadingCallback = () => {},
  message = '',
  title = '',
) => {
  const imagesData = imageURLs.map(async (url) => {
    try {
      const response = await RNFetchBlob.fetch('GET', url);
      if (!!response && response.info().status === STATUS_SUCCESS) {
        return `data:image/png;base64,${response.data}`;
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message'),
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
  try {
    const urls = await Promise.all(imagesData);
    loadingCallback();

    if (urls) {
      let result = await Share.open({
        title: title,
        urls: urls,
        message: message,
      });
      if (!!result && result.success) {
        console.log('share successfully', result.message);
        //share successfully
      } else if (result.dismissedAction) {
        console.log('dismissed', result.message);
        //dissmiss
      }
    } else {
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    }
  } catch (err) {
    console.log('%cerror_sharing', 'color: red', error);
    //@ts-ignore
    flashShowMessage({
      type: 'danger',
      message: 'Chia sẻ không thành công! Bạn vui lòng thử lại sau!',
    });
  }
};
