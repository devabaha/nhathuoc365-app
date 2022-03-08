import {Share} from 'react-native';
import appConfig from 'app-config';

export const share = async (url, message = '') => {
  try {
    message =
      appConfig.device.isAndroid && url ? message + '\r\n' + url : message;

    const shareContent = url ? {url, message} : {message};

    const result = await Share.share(shareContent, {
      dialogTitle: message,
      tintColor: appConfig.colors.primary,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    console.log('%cerror_sharing', 'color: red', error);
    if (error?.message === 'User did not share') {
      return;
    }
    //@ts-ignore
    flashShowMessage({
      type: 'danger',
      message: 'Chia sẻ không thành công! Bạn vui lòng thử lại sau!',
    });
  }
};
