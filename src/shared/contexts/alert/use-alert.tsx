import React from 'react';
// context
import {AlertContext} from './alert.context';

export function useAlert() {
  return React.useContext(AlertContext);
}
