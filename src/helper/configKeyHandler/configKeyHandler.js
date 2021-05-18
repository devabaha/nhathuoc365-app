import store from 'app-store';
import {isEmpty} from 'lodash';

export const isConfigActive = (key) => {
  const data = store.store_data;

  if (data) {
    return !!Number(data[key]);
  }
  return false;
};

export const getValueFromConfigKey = (key) => {
  const data = store.store_data;
  if (!isEmpty(data)) {
    return data?.[key];
  } else return {};
};

export const INPUT_ADDRESS_TYPE = {
  ONLY_MAP_ADDRESS: 0,
  ONLY_COMBO_ADDRESS: 1,
  ALL_ADDRESS: 2,
};
