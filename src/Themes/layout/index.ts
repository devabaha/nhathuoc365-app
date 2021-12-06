import appConfig from 'app-config';

import {Layout} from '../interface';

export const LAYOUT: Layout = {
  borderWidthPixel: appConfig.device.pixel,
  borderWidthSmall: 0.5,
  borderWidth: 1,
  borderRadiusSmall: 6,
  borderRadiusMedium: 8,
  borderRadiusLarge: 10,
  borderRadiusHuge: 15,

  shadow: {
    shadowOffset: {
      width: 0,
      height: 2.25,
    },
    shadowOpacity: 0.161,
    shadowRadius: 3,

    elevation: 5,
  },
};
