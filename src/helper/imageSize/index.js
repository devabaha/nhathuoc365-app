import appConfig from 'app-config';
import {IMAGE_RATIOS} from 'src/constants/image';

export const getImageSize = (image_ratio, base = appConfig.device.width) => {
  return {
    width: base,
    height: base / image_ratio,
  };
};

export const getNewsFeedSize = () => {
  return getImageSize(IMAGE_RATIOS.NEWS_FEED);
};
