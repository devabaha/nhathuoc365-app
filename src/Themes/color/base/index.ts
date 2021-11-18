import {CORE} from './core';
import {SYSTEM_LIGHT, SYSTEM_DARK} from './system';
import {ADDITION_LIGHT, ADDITION_DARK} from './addition';

export const BASE_LIGHT = {
  ...CORE,
  ...SYSTEM_LIGHT,
  ...ADDITION_LIGHT,
};

export const BASE_DARK = {
  ...CORE,
  ...SYSTEM_DARK,
  ...ADDITION_DARK,
};
