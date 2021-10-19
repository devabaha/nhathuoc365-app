import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SectionContainer from '../SectionContainer';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  container: {
      backgroundColor: '#fafafa'
  },
  address_name_box: {
    flexDirection: 'row',
  },
  feeBox: {
    marginTop: 12,
  },
  feeLabel: {
    fontSize: 16,
    flex: 1,
  },
  feeValue: {
    fontSize: 16,
  },

  firstCommission: {
    marginTop: 0,
  },
  lastCommission: {
    borderTopWidth: appConfig.device.pixel,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginHorizontal: -15,
    marginVertical: -12,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  commissionTitle: {
    paddingRight: 15,
  },

  text_total_items: {
    fontSize: 14,
    color: '#000000',
  },
  both: {
    fontWeight: '600',
  },

  address_default_title: {
    color: '#666666',
    fontSize: 12,
  },
  title_active: {
    color: appConfig.colors.primary,
  },
});

const CommissionsSection = ({commissions = []}) => {
  if (!commissions?.length) return null;
  
  return (
    <SectionContainer marginTop style={styles.container}>
      {commissions.map((commission, index) => {
        const isFirst = index === 0;
        const isLast = index === commissions.length - 1;
        return (
          <View
            key={index}
            style={[
              styles.address_name_box,
              styles.feeBox,
              isFirst && styles.firstCommission,
              isLast && styles.lastCommission,
            ]}>
            <Text
              style={[
                styles.text_total_items,
                styles.feeLabel,
                isLast && styles.both,
                !isLast && styles.title_active,
                styles.commissionTitle,
              ]}>
              {commission.name}
            </Text>

            <View>
              <Text
                style={[
                  styles.address_default_title,
                  styles.title_active,
                  styles.feeValue,
                  isLast && styles.both,
                ]}>
                {commission.value_view}
              </Text>
            </View>
          </View>
        );
      })}
    </SectionContainer>
  );
};

export default React.memo(CommissionsSection);
