import React from 'react';
import {StyleSheet, View} from 'react-native';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';

const styles = StyleSheet.create({
  priceInfoRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPriceInfoRow: {
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  priceLabel: {
    flex: 1,
  },
  totalPriceValue: {
    fontWeight: '600',
  },
});

const TotalPrice = (props) => {
  return (
    <View style={[styles.priceInfoRow, styles.totalPriceInfoRow]}>
      <Typography
        type={TypographyType.LABEL_LARGE_TERTIARY}
        style={styles.priceLabel}>
        {props.t('payment.totalPrice')}
      </Typography>
      <Typography
        type={TypographyType.LABEL_HUGE_PRIMARY}
        style={styles.totalPriceValue}>
        {props.value}
      </Typography>
    </View>
  );
};

export default TotalPrice;
