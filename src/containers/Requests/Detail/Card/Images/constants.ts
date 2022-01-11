import appConfig from 'app-config';

export const MAX_IMAGES = 4;
export const IMAGE_SPACE = 12;
export const WIDTH_IMAGES = appConfig.device.width - 60;
export const IMAGE_SIZE =
  (WIDTH_IMAGES - IMAGE_SPACE * (MAX_IMAGES - 1)) / MAX_IMAGES;
