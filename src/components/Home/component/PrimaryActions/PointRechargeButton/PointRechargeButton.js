import React from 'react';

import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import store from 'app-store';
import appConfig from 'app-config';
import {
  servicesHandler,
  SERVICES_TYPE
} from '../../../../../helper/servicesHandler';

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
    fontSize: 30,
    color: appConfig.colors.primary
  }
});

const PointRechargeButton = ({
  label,
  wrapperStyle,
  containerStyle,
  iconName = 'plus-circle',
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
      title: 'Hướng dẫn nạp điểm HomeID'
    };
    onPress(service);
    servicesHandler(service);
  }

  return (
    <TouchableOpacity
      onPress={goPaymentMethod}
      style={[styles.add_store_action_btn, wrapperStyle]}
    >
      <View style={[styles.add_store_action_btn_box, containerStyle]}>
        <Icon name={iconName} style={[styles.icon, iconStyle]} />
        {!!label && (
          <Text style={[styles.add_store_action_label, labelStyle]}>
            {label}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PointRechargeButton;
