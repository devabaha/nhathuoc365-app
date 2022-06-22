import {Alert, Platform} from 'react-native';
import {
  OnStoreAppMetadataOptions,
  getAndroidAppMetadata,
  getIOSAppMetadata,
  AppMetadataResponse,
} from './providers';

export const getOnStoreAppMetadata: (
  options: OnStoreAppMetadataOptions,
) => Promise<AppMetadataResponse | undefined> = async ({
  data,
  onBeforeRequest = () => {},
  onFinishRequest = () => {},
  onFinally = () => {},
  onSuccess = () => {},
  onError = () => {},
}) => {
  const provider =
    Platform.OS === 'ios'
      ? getIOSAppMetadata(data)
      : Platform.OS === 'android'
      ? getAndroidAppMetadata(data)
      : null;

  if (!provider) {
    Alert.alert('App metadata checking failed', 'Platform is not supported');
    return;
  }

  try {
    onBeforeRequest();
    const response = await provider.request();
    onFinishRequest(response);
    onSuccess(response);
    return response;
  } catch (error) {
    console.log('error_get_app_metadata', error);
    onError(error);
  } finally {
    onFinally();
  }
};
