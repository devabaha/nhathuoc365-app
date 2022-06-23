import React, {Dispatch, SetStateAction} from 'react';
// types
import {AlertFn, AlertItemData} from '@data';

export type AlertContextState = {
  alertList: AlertItemData[];
  setAlertList: Dispatch<SetStateAction<AlertItemData[]>>;
  closeAlert: (alertId: number) => void;
  alert: AlertFn;
};

export const INITIAL_VALUE: AlertContextState = {
  alertList: [],
  alert: () => {},
  closeAlert: () => {},
  setAlertList: () => {},
};

export const AlertContext = React.createContext<AlertContextState>(
  INITIAL_VALUE,
);
