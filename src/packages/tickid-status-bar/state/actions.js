import { SHOW_STATUS_BAR, HIDE_STATUS_BAR } from './constants';

export function showStatusBar(
  options = {
    barStyle: 'dark',
    backgroundColor: '#fff'
  }
) {
  return { type: SHOW_STATUS_BAR, payload: options };
}

export function hideStatusBar() {
  return { type: HIDE_STATUS_BAR, payload: null };
}
