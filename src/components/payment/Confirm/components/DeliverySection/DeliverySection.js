import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import SectionContainer from '../SectionContainer';

const styles = StyleSheet.create({
  box_icon_label: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon_label: {
    width: 15,
    color: '#999',
  },
  input_label: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 8,
  },
  desc_content: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    marginLeft: 22,
  },
});

const DeliverySection = ({deliveryCode}) => {
  return (
    <View>
      <SectionContainer>
        <View>
          <View style={styles.box_icon_label}>
            <Material
              style={styles.icon_label}
              name="truck-delivery"
              size={14}
            />
            <Text style={styles.input_label}>Thông tin vận đơn</Text>
          </View>
          <Text style={styles.desc_content}>
            {`${t('confirm.information.ordersCode')}:`} {deliveryCode}
          </Text>
        </View>
      </SectionContainer>
    </View>
  );
};

export default React.memo(DeliverySection);
