import appConfig from 'app-config';
import { NAMESPACE } from './constants';

export class UserEntity {
  static fromState(state) {
    return new UserEntity(state[appConfig.namespace][NAMESPACE]);
  }

  constructor(data) {
    this.data = data;
  }
}
