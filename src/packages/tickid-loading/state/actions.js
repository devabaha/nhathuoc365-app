import { SHOW_LOADING, HIDE_LOADING } from './constants';

export function showLoading(options) {
  return { type: SHOW_LOADING, payload: options };
}

export function hideLoading(options) {
  return { type: HIDE_LOADING, payload: options };
}
