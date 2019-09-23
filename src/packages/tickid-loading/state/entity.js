import { NAMESPACE } from './constants';

export class LoadingEntity {
  static fromState(state) {
    return new LoadingEntity(state['app'][NAMESPACE]);
  }

  constructor(data) {
    this.data = data;
  }

  get isLoading() {
    return this.data.showLoading;
  }
}
