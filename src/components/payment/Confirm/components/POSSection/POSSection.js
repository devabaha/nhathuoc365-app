import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Fontisto from 'react-native-vector-icons/Fontisto';

import SectionContainer from '../SectionContainer';

const styles = StyleSheet.create({
  icon: {
    width: 15,
    color: '#999',
    fontSize: 19,
  },
  desc_content: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    marginLeft: 22,
    textTransform: 'uppercase',
  },
  orders_status: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 15,
  },
});

const POSSection = ({code}) => {
  const {t} = useTranslation('orders');

  return (
    <SectionContainer
      title={t('confirm.information.POSTitle')}
      customIcon={<Fontisto style={styles.icon} name="shopping-pos-machine" />}
      marginTop>
      <Text style={styles.desc_content}>{code}</Text>
    </SectionContainer>
  );
};

export default React.memo(POSSection);
