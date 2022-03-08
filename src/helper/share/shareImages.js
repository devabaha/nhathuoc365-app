import Share from 'react-native-share';
import pLimit from 'p-limit';
import i18n from 'i18next';

import {downloadImage} from 'app-helper/image/imageDownloadingHandler';

const limit = pLimit(6);

export const shareImages = async (
  imageURLs = [],
  callbackSuccess = () => {},
  title = '',
  message = '',
  metadataUrl = '',
  maxLength = 20,
) => {
  const t = i18n.getFixedT(undefined, 'common');

  const imagesData = imageURLs.slice(0, maxLength).map((url) => {
    return limit(() =>
      downloadImage(url).then((response) => response?.imageBase64),
    );
  });

  try {
    const urls = await Promise.all(imagesData);
    callbackSuccess();

    const extraOptions = {
      ...(urls?.length > 1 ? {urls} : urls?.length === 1 ? {url: urls[0]} : {}),
      activityItemSources: [
        {
          // For using custom icon instead of default text icon at share preview when sharing with message.
          placeholderItem: {
            type: 'url',
            content: metadataUrl || urls[0],
          },
          linkMetadata: {
            title: title,
            ...(metadataUrl ? {originalUrl: metadataUrl} : {icon: urls[0]}),
          },
          // item: {
          //   default: {
          //     type: 'text',
          //     content: title,
          //   },
          // },
        },
      ],
    };

    let result = await Share.open({
      title: title,
      message: message,
      failOnCancel: false,
      ...extraOptions,
    });

    if (!!result && result.success) {
      console.log('share_successfully', result.message);
      //share successfully
    } else if (result.dismissedAction) {
      console.log('dismissed', result.message);
      //dissmiss
      // }
    } else {
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    }
  } catch (error) {
    console.log('%cerror_sharing', 'color: red', error);
    //@ts-ignore
    flashShowMessage({
      type: 'danger',
      message: 'Chia sẻ không thành công! Bạn vui lòng thử lại sau!',
    });
  }
};
