import axios from 'axios';

import {AppMetadataRequestData, AppMetadataReturnObject} from '..';

export interface AndroidAppVersionProps extends AppMetadataRequestData {}

export const getAndroidAppMetadata: (
  options: AndroidAppVersionProps,
) => AppMetadataReturnObject = ({bundleId}) => {
  const controller = new AbortController();

  return {
    request: async () => {
      try {
        const response = await axios.get(
          `https://play.google.com/store/apps/details?id=${bundleId}&hl=en`,
          {
            signal: controller.signal,
          },
        );
        const match = response.data.match(/\[\[\[['"]((\d+\.)+\d+)['"]\]\],/);

        return {version: match[1]?.trim()};
      } catch (error) {
        throw error;
      }
    },
    cancel: controller.abort,
  };
};
