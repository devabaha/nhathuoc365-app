import axios from 'axios';

import {AppMetadataRequestData, AppMetadataReturnObject} from '..';

export interface IOSAppMetadataOptions extends AppMetadataRequestData {}

export const getIOSAppMetadata: (
  options: IOSAppMetadataOptions,
) => AppMetadataReturnObject = ({bundleId}) => {
  const controller = new AbortController();

  return {
    request: async () => {
      try {
        const response = await axios.get(
          `https://itunes.apple.com/lookup?bundleId=${bundleId}`,
          {
            signal: controller.signal,
          },
        );

        return {version: response.data.results?.[0].version};
      } catch (error) {
        throw error;
      }
    },
    cancel: controller.abort,
  } as AppMetadataReturnObject;
};
