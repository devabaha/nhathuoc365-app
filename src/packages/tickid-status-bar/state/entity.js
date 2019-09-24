import { NAMESPACE } from './constants';

export class StatusBarEntity {
  static fromState(state) {
    return new StatusBarEntity(state['app'][NAMESPACE]);
  }

  constructor(data) {
    this.data = data;
  }

  get isShowStatusBar() {
    return this.data.showStatusBar;
  }
}
