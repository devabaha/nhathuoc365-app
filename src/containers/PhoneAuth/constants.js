import { Platform } from 'react-native';

export const HEADER_HEIGHT = Platform.select({
  ios: 44,
  android: 54,
  windows: 54
});

export const RESEND_OTP_INTERVAL = 30;
