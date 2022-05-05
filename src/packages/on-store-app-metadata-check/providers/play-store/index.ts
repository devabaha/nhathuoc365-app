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
        const match = response.data.match(
          /Current Version.+?>([\d.-]+)<\/span>/,
        );

        return {version: match[3].trim()};
      } catch (error) {
        throw error;
      }
    },
    cancel: controller.abort,
  };
};
