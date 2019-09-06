export const QRCODE_SIZE = 28;
export const QRCODE_SCANING_SIZE = 20;
export const TO_SHOW = 1;
export const TO_HIDE = 0;
export const FLASH_SCAN_START = -3;
export const FLASH_SCAN_END = 43;

export const QRCODE_TYPE = 'qrcode';
export const BARCODE_TYPE = 'barcode';

export const SCANING_ANIMATED_DEFINITION = [
  {
    functions: ['codeFadeOut', 'codeScaningFadeIn'],
    delay: 1000
  },
  {
    functions: ['scaningAnimation'],
    delay: 1800
  },
  {
    functions: ['codeScaningFadeOut', 'codeFadeIn'],
    delay: 3600
  },
  {
    functions: ['changeCodeType'],
    delay: 3750
  },
  {
    functions: ['startAnimation'],
    delay: 5000
  }
];
