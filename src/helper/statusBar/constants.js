import appConfig from 'app-config';

export const DARK_STATUS_BAR_SCENES = [
  appConfig.routes.domainSelector,

  appConfig.routes.phoneAuth,
  appConfig.routes.qrBarCode,
  appConfig.routes.qrBarCodeInputable,
  appConfig.routes.modalWebview,
  appConfig.routes.transaction,
  appConfig.routes.modalComment,
  appConfig.routes.modalEditImages,
  appConfig.routes.socialCreatePost,

  appConfig.routes.mixedVoucher,
  appConfig.routes.myVoucher,
  appConfig.routes.voucherDetail,
  appConfig.routes.voucherScanner,
  appConfig.routes.alreadyVoucher,
  appConfig.routes.voucherShowBarcode,
  appConfig.routes.voucherEnterCodeManual,

  appConfig.routes.tickidRada,
  appConfig.routes.tickidRadaListService,
  appConfig.routes.tickidRadaServiceDetail,
  appConfig.routes.tickidRadaBooking,

  appConfig.routes.schedule,
  appConfig.routes.scheduleConfirm,

  appConfig.routes.resetPassword,
  appConfig.routes.item,

  appConfig.routes.premiumInfo,

  appConfig.routes.itemAttribute,
  appConfig.routes.accountTab,
  appConfig.routes.personalProfile,
];

export const TRANSLUCENT_STATUS_BAR_SCENES = [`${appConfig.routes.item}_1`];
export const REMAIN_PREV_STATUS_BAR_STYLE_SCENES = [
  appConfig.routes.itemAttribute,
  appConfig.routes.modalConfirm,
  appConfig.routes.modalPicker,
];
