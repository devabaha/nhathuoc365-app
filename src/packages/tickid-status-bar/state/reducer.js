import update from 'immutability-helper';
import { SHOW_STATUS_BAR, HIDE_STATUS_BAR } from './constants';

const initialState = {
  showStatusBar: false,
  barStyle: 'dark',
  backgroundColor: '#fff'
};

export default function statusBarReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_STATUS_BAR:
      return update(state, {
        showStatusBar: { $set: true },
        barStyle: { $set: action.payload.barStyle },
        backgroundColor: { $set: action.payload.backgroundColor }
      });
    case HIDE_STATUS_BAR:
      return update(state, {
        showStatusBar: { $set: false }
      });
    default:
      return state;
  }
}
