export let config = {
  partnerAuthorization: null,
  defaultLocation: null,
  webhookUrl: null
};

export function init(configs) {
  if (
    configs.partnerAuthorization == null ||
    configs.partnerAuthorization == undefined
  ) {
    throw new Error('<partnerAuthorization> is required');
  }
  if (configs.defaultLocation == null || configs.defaultLocation == undefined) {
    throw new Error('<defaultLocation> is required');
  }
  config = configs;
}
