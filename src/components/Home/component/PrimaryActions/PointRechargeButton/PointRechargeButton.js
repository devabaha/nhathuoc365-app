import React from 'react';
// 3-party libs
import {useTranslation} from 'react-i18next';
// configs
import store from 'app-store';
// helpers
import {servicesHandler} from 'app-helper/servicesHandler';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {SERVICES_TYPE} from 'app-helper/servicesHandler';
// custom components
import SubActionButton from '../SubActionButton';

const PointRechargeButton = ({
  label,
  wrapperStyle,
  containerStyle,
  iconName = 'ios-add-circle',
  iconStyle,

  useTouchableHighlight = true,
  onPress = () => {},
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation();

  function goPaymentMethod() {
    const service = {
      type: SERVICES_TYPE.PAYMENT_METHOD,
      showPrice: false,
      showSubmit: false,
      storeId: store.app_id,
      title: t('vndWallet:rechargeInstructions'),
      theme: theme,
    };
    onPress(service);
    servicesHandler(service);
  }

  return (
    <SubActionButton
      iconName={iconName}
      label={label}
      wrapperStyle={wrapperStyle}
      containerStyle={containerStyle}
      iconStyle={iconStyle}
      useTouchableHighlight={useTouchableHighlight}
      onPress={goPaymentMethod}
    />
  );
};

export default PointRechargeButton;
