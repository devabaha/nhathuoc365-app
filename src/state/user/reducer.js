import { USER_SET } from './constants';

const initialState = {};

export default function user(state = initialState, action) {
  switch (action.type) {
    case USER_SET:
      return { ...action.payload };

    default:
      return state;
  }
}
