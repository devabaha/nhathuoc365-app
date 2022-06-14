import React, {useCallback, useState} from 'react';
// types
import {AlertFn, AlertItemData} from '@data';
// context
import {AlertContext} from './alert.context';

export const AlertContextProvider: React.FC = ({children}) => {
  const [alertList, setAlertList] = useState<AlertItemData[]>([]);

  const alert = useCallback<AlertFn>((title, message, buttons, options) => {
    setAlertList((previousList) => {
      const alertListClone = [...previousList];
      alertListClone.push({
        id: Date.now(),
        title,
        message,
        buttons,
        options,
      });
      return alertListClone;
    });
  }, []);

  const closeAlert = useCallback((alertId: number) => {
    setAlertList((previousList) => {
      const alertListClone = [...previousList];
      alertListClone.splice(
        alertListClone.findIndex((alert) => alert.id === alertId),
        1,
      );

      return alertListClone;
    });
  }, []);

  return (
    <AlertContext.Provider
      value={{
        alertList,
        alert,
        setAlertList,
        closeAlert,
      }}>
      {children}
    </AlertContext.Provider>
  );
};
