import { combineReducers } from 'redux';
import config from '../config';

import {
  constants as userConstants,
  reducer as userReducer
} from '../state/user';

const rootReducer = combineReducers({
  [config.namespace]: combineReducers({
    [userConstants.NAMESPACE]: userReducer
  })
});

export default rootReducer;
