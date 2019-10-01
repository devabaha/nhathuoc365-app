import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducers';
import appConfig from '../config';

export default function() {
  const initialState = {};

  // Middleware and store enhancers
  const enhancers = [applyMiddleware(thunk)];

  if (appConfig.reduxLoggerEnable) {
    enhancers.push(applyMiddleware(logger));
  }

  const store = createStore(rootReducer, initialState, compose(...enhancers));

  return store;
}
