import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Material from 'react-native-vector-icons/MaterialCommunityIcons';

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
  description: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    marginLeft: 22,
  },
  icon: {
    fontSize: 13,
  },
});

const DeliverySection = ({code}) => {
  const {t} = useTranslation('orders');

  return (
    <View style={styles.container}>
      <SectionContainer
        style={styles.contentContainer}
        title={t('confirm.information.deliveryTitle')}
        iconName="shipping-fast"
        iconStyle={styles.icon}
        marginTop={0}>
        <Text style={styles.description}>
          {code}
        </Text>
      </SectionContainer>
    </View>
  );
};

export default React.memo(DeliverySection);
