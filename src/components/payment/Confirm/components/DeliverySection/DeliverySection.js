import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import SectionContainer from '../SectionContainer';

const styles = StyleSheet.create({
  icon: {
    fontSize: 13,
  },
  desc_content: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    marginLeft: 22,
  },
  orders_status: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 15,
  },
});

const DeliverySection = ({code, statusColor, statusName}) => {
  const {t} = useTranslation('orders');

  return (
    <SectionContainer
      title={t('confirm.information.deliveryTitle')}
      iconName="shipping-fast"
      iconStyle={styles.icon}
      marginTop>
      <Text style={styles.desc_content}>{code}</Text>
      <Text
        style={[
          styles.desc_content,
          styles.orders_status,
          {
            color: statusColor,
          },
        ]}>
        {statusName}
      </Text>
    </SectionContainer>
  );
};

export default React.memo(DeliverySection);
