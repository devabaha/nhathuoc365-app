import React from 'react';

import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import store from 'app-store';
import appConfig from 'app-config';
import {
  servicesHandler,
  SERVICES_TYPE
} from '../../../../../helper/servicesHandler';
import SubActionButton from '../SubActionButton';

const styles = StyleSheet.create({
  add_store_action_btn: {
    paddingVertical: 4
  },
  add_store_action_btn_box: {
    alignItems: 'center'
  },
  add_store_action_label: {
    fontSize: 14,
    color: '#404040',
    marginTop: 4
  },
  icon: {
    fontSize: 28,
    color: appConfig.colors.primary
  }
});

const PointRechargeButton = ({
  label,
  wrapperStyle,
  containerStyle,
  iconName = 'ios-add-circle',
  iconStyle,
  labelStyle,
  onPress = () => {}
}) => {
  function goPaymentMethod() {
    const service = {
      type: SERVICES_TYPE.PAYMENT_METHOD,
      showPrice: false,
      showSubmit: false,
      storeId: store.app_id,
      title: 'Hướng dẫn nạp'
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

    onPress={goPaymentMethod}
    />
  );
};

export default PointRechargeButton;
