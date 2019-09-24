import { combineReducers } from 'redux';
import config from '../config';

import {
  constants as userConstants,
  reducer as userReducer
} from '../state/user';
import {
  constants as loadingConstants,
  reducer as loadingReducer
} from 'app-packages/tickid-loading';
import {
  constants as statusBarConstants,
  reducer as statusBarReducer
} from 'app-packages/tickid-status-bar';

const rootReducer = combineReducers({
  [config.namespace]: combineReducers({
    [userConstants.NAMESPACE]: userReducer,
    [loadingConstants.NAMESPACE]: loadingReducer,
    [statusBarConstants.NAMESPACE]: statusBarReducer
  })
});

export default rootReducer;
