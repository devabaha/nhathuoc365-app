export * from './app-store';
export * from './play-store';

export type AppMetadataRequestData = {
  bundleId: string;
};

export interface OnStoreAppMetadataOptions {
  data: AppMetadataRequestData;
  onBeforeRequest?: () => void;
  onFinishRequest?: (response: any) => void;
  onFinally?: () => void;
  onError?: (error: any) => void;
  onSuccess?: (response: any) => void;
}

export type AppMetadataResponse = {
  version: string;
};

export interface AppMetadataReturnObject {
  request: () => Promise<AppMetadataResponse | undefined>;
  cancel: () => void;
}
