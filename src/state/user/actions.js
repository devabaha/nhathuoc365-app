import { USER_SET } from './constants';

export function setUser(payload) {
  return { type: USER_SET, payload };
}
