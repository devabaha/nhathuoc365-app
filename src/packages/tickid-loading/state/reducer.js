import update from 'immutability-helper';
import { SHOW_LOADING, HIDE_LOADING } from './constants';

const initialState = {
  showLoading: false
};

export default function loading(state = initialState, action) {
  switch (action.type) {
    case SHOW_LOADING:
      return update(state, {
        showLoading: { $set: true }
      });
    case HIDE_LOADING:
      return update(state, {
        showLoading: { $set: false }
      });
    default:
      return state;
  }
}
