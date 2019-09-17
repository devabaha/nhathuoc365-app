import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducers';
import Config from 'react-native-config';

export default function() {
  const initialState = {};

  // Middleware and store enhancers
  const enhancers = [applyMiddleware(thunk)];

  if (Config.ENV !== 'production') {
    enhancers.push(applyMiddleware(logger));
  }

  const store = createStore(rootReducer, initialState, compose(...enhancers));

  return store;
}
