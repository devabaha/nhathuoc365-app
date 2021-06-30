import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import SectionContainer from '../SectionContainer';

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingRight: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginTop: 8,
  },
  contentContainer: {
    marginTop: 0,
    paddingTop: 0,
    paddingRight: 0,
  },
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
    <View style={styles.container}>
      <SectionContainer
        style={styles.contentContainer}
        title={t('confirm.information.deliveryTitle')}
        iconName="shipping-fast"
        iconStyle={styles.icon}
        marginTop={0}>
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
    </View>
  );
};

export default React.memo(DeliverySection);
