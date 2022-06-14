import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet} from 'react-native';
// types
import {AlertItemData} from '@data';
// hooks
import {useAlert} from '@shared';
// entities
import {default as AlertManager} from 'app-helper/Alert';
// custom components
import AlertItem from './AlertItem';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Alert = () => {
  const {alertList, alert, closeAlert} = useAlert();

  useEffect(() => {
    AlertManager.register(alert);

    return () => {
      AlertManager.unregister();
    };
  }, [alert]);

  const handleCloseAlert = useCallback(
    (alertId: number) => {
      closeAlert(alertId);
    },
    [closeAlert],
  );

  const renderAlert = (alert: AlertItemData, index: number) => {
    return (
      <AlertItem
        key={index}
        title={alert.title || 'title'}
        message={alert.message || 'this is a message'}
        buttons={alert.buttons}
        onClose={() => handleCloseAlert(alert.id)}
      />
    );
  };

  return <>{alertList.map(renderAlert)}</>;
};

export default memo(Alert);
