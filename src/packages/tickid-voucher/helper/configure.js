import { VOUCHER_INITIALIZED } from '../constants';

const isObject = val =>
  Object.prototype.toString.call(val) === '[object Object]';

export const merge = (oldConfig, newConfig) => {
  if (!isObject(oldConfig) || !isObject(newConfig)) {
    return newConfig;
  }

  const result = Object.assign({}, oldConfig, newConfig);

  Object.keys(newConfig).forEach(key => {
    if (isObject(newConfig[key])) {
      result[key] = merge(oldConfig[key], newConfig[key]);
    }
  });

  return result;
};

export default function configure(oldConfig, newConfig) {
  Object.keys(newConfig).forEach(key => {
    oldConfig[key] = merge(oldConfig[key], newConfig[key]);
  });

  oldConfig[VOUCHER_INITIALIZED] = true;
}
