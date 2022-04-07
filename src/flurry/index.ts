import DeviceInfo from 'react-native-device-info';
import Flurry from 'react-native-flurry-sdk';

import appConfig from 'app-config';

if (!__DEV__) {
  new Flurry.Builder()
    .withCrashReporting(true)
    .withLogEnabled(true)
    .withLogLevel(Flurry.LogLevel.DEBUG)
    .withAppVersion(DeviceInfo.getVersion())
    .build(appConfig.flurry.androidKey, appConfig.flurry.iosKey);

  Flurry.setVersionName(DeviceInfo.getVersion());
}
