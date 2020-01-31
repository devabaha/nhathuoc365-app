import { showMessage as showMessageFM } from 'react-native-flash-message';

export const VOUCHER_INITIALIZED = 'initialize';

export const USE_ONLINE = 'USE_ONLINE';
export const showMessage = global.flashShowMessage || showMessageFM;
